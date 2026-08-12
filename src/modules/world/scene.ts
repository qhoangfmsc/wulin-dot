import Phaser from "phaser";
import type { CharacterClassId } from "@/modules/character/types";
import { COMBAT_LOADOUTS, HEAL_POTION, MONSTER_CONFIGS } from "@/modules/combat/data";
import type { CombatAbility, MonsterConfig, MonsterTier } from "@/modules/combat/types";
import type { StatBlock } from "@/modules/stats/types";
import { useSkillStore } from "@/modules/skills/store";
import { Actor } from "./actor";
import { WORLD_WIDTH, WORLD_HEIGHT } from "./types";
import { useWorldStore } from "./store";

const DEFAULT_PLAYER_SPEED = 200;
const PLAYER_DISPLAY_WIDTH = 56;
const PLAYER_HIT_RADIUS = 26;
const CONTACT_TICK_MS = 500;
const INVULNERABLE_MS = 1200;
const STORE_SYNC_INTERVAL_MS = 100;
const SPRITE_LOAD_WIDTH = 256;

// Wave spawner: survivor.io-style — periodic bursts of monsters spawned
// just outside the camera view, always beelining for the player (no
// wander/aggro-range state anymore).
const WAVE_INTERVAL_MS = 8000;
const WAVE_BASE_SIZE = 4;
const WAVE_SIZE_CAP = 16;
const SPAWN_RING_MARGIN = 140;

// Player leveling — uncapped, farmed purely from kills (see `gainExp`).
const LEVEL_STAT_GROWTH = 0.06; // +6% combat-relevant stats per level
const MONSTER_HP_GROWTH = 0.15; // +15% monster hp per monster level above 1
const MONSTER_DMG_GROWTH = 0.08; // +8% monster contact damage per level above 1

const TIER_LEVEL_OFFSET: Record<MonsterTier, number> = { normal: 0, elite: 3, boss: 7 };
const TIER_LABEL_COLOR: Record<MonsterTier, string> = { normal: "#d4d4d8", elite: "#fbbf24", boss: "#f87171" };
const TIER_BLIP_COLOR: Record<MonsterTier, string> = { normal: "#a1a1aa", elite: "#f59e0b", boss: "#dc2626" };

interface MonsterRuntime {
  id: string;
  config: MonsterConfig;
  actor: Actor;
  level: number;
  contactDamage: number;
  hpBarFill: Phaser.GameObjects.Rectangle;
  barWidth: number;
  hp: number;
  hpMax: number;
  dead: boolean;
  nextContactAt: number;
}

interface ProjectileRuntime {
  gameObject: Phaser.GameObjects.Image;
  ability: CombatAbility;
  vx: number;
  vy: number;
  traveled: number;
  damage: number;
  hitMonsterIds: Set<string>;
}

interface SceneOptions {
  classId: CharacterClassId;
  classColor: string;
  spriteUrl?: string | null;
  stats: StatBlock;
}

/** Phaser loads raw files, so a huge source PNG downscaled hard to a tiny
 * display size (e.g. 2000px -> 56px) looks soft/aliased with plain bilinear
 * filtering. Routing through Next's image optimizer pre-shrinks it
 * server-side to something close to the actual display size, which reads
 * far crisper than relying on runtime minification. */
function optimizedSpriteUrl(src: string, width: number = SPRITE_LOAD_WIDTH): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

/** Factory so the scene can close over the current class's theme color,
 * avatar art, live stats and combat loadout without Phaser's scene-data
 * plumbing. Survivor.io-style loop: WASD moves, the player auto-attacks the
 * nearest monster, J/K/L fire skill1/skill2/ultimate (auto-targeted, gated
 * by skill-tree unlock), U drinks the base-kit heal potion, P toggles
 * pause. Both the player and every monster are driven by a shared `Actor`
 * (rotate-to-face-movement + slime hop) instead of separate hand-rolled
 * logic — see `modules/world/actor.ts`. */
export function createMainScene({ classId, classColor, spriteUrl, stats }: SceneOptions) {
  const loadout = COMBAT_LOADOUTS[classId];
  const abilities = [loadout.basicAttack, loadout.skill1, loadout.skill2, loadout.ultimate];

  return class MainScene extends Phaser.Scene {
    private playerActor!: Actor;
    private keys!: {
      up: Phaser.Input.Keyboard.Key;
      left: Phaser.Input.Keyboard.Key;
      down: Phaser.Input.Keyboard.Key;
      right: Phaser.Input.Keyboard.Key;
    };
    private facing = 0;
    private isMoving = false;

    private playerHp = 0;
    private playerMaxHp = 0;
    private invulnerableUntil = 0;
    private playerLevel = 1;
    private playerExp = 0;
    private expToNext = 20;

    private monsters: MonsterRuntime[] = [];
    private projectiles: ProjectileRuntime[] = [];
    private cooldownReadyAt = new Map<string, number>();

    private waveTimer = 0;
    private waveNumber = 0;
    private syncAccumulator = 0;

    constructor() {
      super("main");
    }

    preload() {
      if (spriteUrl) this.load.image("player-avatar", optimizedSpriteUrl(spriteUrl));
      for (const kind of new Set(MONSTER_CONFIGS.map((m) => m.kind))) {
        const config = MONSTER_CONFIGS.find((m) => m.kind === kind)!;
        this.load.image(`monster-${kind}`, optimizedSpriteUrl(config.sprite));
      }
    }

    create() {
      this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      this.input.mouse?.disableContextMenu();

      const tile = this.add.graphics();
      tile.fillStyle(0x18181b, 1);
      tile.fillRect(0, 0, 64, 64);
      tile.lineStyle(1, 0x27272a, 1);
      tile.strokeRect(0, 0, 64, 64);
      tile.generateTexture("ground-tile", 64, 64);
      tile.destroy();

      this.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, "ground-tile").setOrigin(0, 0);

      const border = this.add.graphics();
      border.lineStyle(4, 0x3f3f46, 1);
      border.strokeRect(2, 2, WORLD_WIDTH - 4, WORLD_HEIGHT - 4);

      this.playerMaxHp = Math.round(stats.hp * this.levelMultiplier());
      this.playerHp = this.playerMaxHp;

      this.createPlayer();
      this.cameras.main.startFollow(this.playerActor.container, true, 0.12, 0.12);
      this.spawnWave();
      this.bindInput();
    }

    private createPlayer() {
      const colorInt = Phaser.Display.Color.HexStringToColor(classColor).color;
      this.playerActor = new Actor(this, {
        x: WORLD_WIDTH / 2,
        y: WORLD_HEIGHT / 2,
        textureKey: spriteUrl ? "player-avatar" : null,
        displaySize: PLAYER_DISPLAY_WIDTH,
        fallbackColor: colorInt,
        depth: 10,
      });
    }

    private bindInput() {
      this.keys = this.input.keyboard!.addKeys({ up: "W", left: "A", down: "S", right: "D" }) as typeof this.keys;

      const unsubscribe = useWorldStore.subscribe((state, prev) => {
        if (state.paused === prev.paused) return;
        if (state.paused) this.tweens.pauseAll();
        else this.tweens.resumeAll();
      });
      this.events.once("shutdown", unsubscribe);
    }

    // ---- Waves ----------------------------------------------------------

    private spawnWave() {
      this.waveNumber += 1;
      const waveSize = Math.min(WAVE_SIZE_CAP, WAVE_BASE_SIZE + this.waveNumber);
      for (let i = 0; i < waveSize; i++) {
        const config = this.pickMonsterConfigForWave();
        if (!config) continue;
        const pos = this.pickSpawnPositionAroundPlayer();
        const id = `${config.kind}-${Math.floor(this.time.now)}-${i}-${Math.random().toString(36).slice(2, 7)}`;
        this.monsters.push(this.buildMonster(config, id, pos.x, pos.y));
      }
    }

    private pickMonsterConfigForWave(): MonsterConfig | null {
      const aliveCounts = new Map<string, number>();
      for (const m of this.monsters) {
        if (m.dead) continue;
        aliveCounts.set(m.config.kind, (aliveCounts.get(m.config.kind) ?? 0) + 1);
      }
      const roll = Math.random();
      const order = roll < 0.05 ? ["spider", "skull", "ghost"] : roll < 0.3 ? ["skull", "ghost"] : ["ghost", "skull"];
      for (const kind of order) {
        const config = MONSTER_CONFIGS.find((c) => c.kind === kind)!;
        if ((aliveCounts.get(kind) ?? 0) < config.spawnCount) return config;
      }
      return null;
    }

    private pickSpawnPositionAroundPlayer() {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.max(this.cameras.main.width, this.cameras.main.height) / 2 + SPAWN_RING_MARGIN;
      return {
        x: Phaser.Math.Clamp(this.playerActor.x + Math.cos(angle) * dist, 40, WORLD_WIDTH - 40),
        y: Phaser.Math.Clamp(this.playerActor.y + Math.sin(angle) * dist, 40, WORLD_HEIGHT - 40),
      };
    }

    private monsterLevelFor(tier: MonsterTier): number {
      return this.playerLevel + TIER_LEVEL_OFFSET[tier];
    }

    private scaledMonsterStats(config: MonsterConfig, level: number) {
      const hpGrowth = 1 + (level - 1) * MONSTER_HP_GROWTH;
      const dmgGrowth = 1 + (level - 1) * MONSTER_DMG_GROWTH;
      return {
        hp: Math.max(1, Math.round(config.hp * hpGrowth)),
        contactDamage: Math.max(1, Math.round(config.contactDamage * dmgGrowth)),
      };
    }

    private buildMonster(config: MonsterConfig, id: string, x: number, y: number): MonsterRuntime {
      const level = this.monsterLevelFor(config.tier);
      const { hp, contactDamage } = this.scaledMonsterStats(config, level);

      const actor = new Actor(this, {
        x,
        y,
        textureKey: `monster-${config.kind}`,
        displaySize: config.displaySize,
        fallbackColor: 0x71717a,
        depth: config.tier === "boss" ? 9 : 8,
      });

      const barWidth = Math.max(36, config.displaySize * 0.7);
      const barY = -config.displaySize / 2 - 14;
      const hpBarBg = this.add.rectangle(0, barY, barWidth, 5, 0x000000, 0.55).setOrigin(0.5, 0.5);
      const hpBarFill = this.add.rectangle(-barWidth / 2, barY, barWidth, 5, 0x4ade80).setOrigin(0, 0.5);
      const levelText = this.add
        .text(0, barY - 11, `Lv.${level}`, { fontSize: "10px", color: TIER_LABEL_COLOR[config.tier], fontStyle: "bold" })
        .setOrigin(0.5);
      actor.container.add([hpBarBg, hpBarFill, levelText]);

      return {
        id,
        config,
        actor,
        level,
        contactDamage,
        hpBarFill,
        barWidth,
        hp,
        hpMax: hp,
        dead: false,
        nextContactAt: 0,
      };
    }

    // ---- Combat -----------------------------------------------------------

    private findNearestMonster(): MonsterRuntime | null {
      let nearest: MonsterRuntime | null = null;
      let nearestDist = Infinity;
      for (const m of this.monsters) {
        if (m.dead) continue;
        const dist = Phaser.Math.Distance.Between(this.playerActor.x, this.playerActor.y, m.actor.x, m.actor.y);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = m;
        }
      }
      return nearest;
    }

    private cooldownMsFor(ability: CombatAbility): number {
      // The basic attack's real-world cooldown comes straight from the
      // attackSpeed stat (hit/s) instead of its data-file fallback, so that
      // stat actually affects gameplay like moveSpeed does.
      if (ability.id === loadout.basicAttack.id) return 1000 / Math.max(0.1, stats.attackSpeed);
      return ability.cooldownMs;
    }

    private attemptFire(ability: CombatAbility) {
      const now = this.time.now;
      const readyAt = this.cooldownReadyAt.get(ability.id) ?? 0;
      if (now < readyAt) return;

      if (ability.kind === "heal") {
        this.cooldownReadyAt.set(ability.id, now + ability.cooldownMs);
        this.playerHp = Math.min(this.playerMaxHp, this.playerHp + this.playerMaxHp * (ability.healRatio ?? 0));
        this.spawnBurstVfx(this.playerActor.x, this.playerActor.y, { ...ability, radius: 40 });
        this.syncCooldowns();
        return;
      }

      const target = this.findNearestMonster();
      if (!target) return; // nothing to auto-target — don't burn the cooldown

      const cooldownMs = this.cooldownMsFor(ability);
      this.cooldownReadyAt.set(ability.id, now + cooldownMs);

      const damage = Math.max(1, Math.round(stats[ability.damageStat] * ability.damageMultiplier * this.levelMultiplier()));
      if (ability.kind === "bolt") this.spawnProjectileToward(ability, damage, target);
      else this.castBurstAt(ability, damage, target);
      this.syncCooldowns();
    }

    private ensureBoltTexture(colorHex: string): string {
      const key = `bolt-${colorHex}`;
      if (this.textures.exists(key)) return key;
      const color = Phaser.Display.Color.HexStringToColor(colorHex).color;
      const g = this.add.graphics();
      g.fillStyle(0xffffff, 0.55);
      g.fillCircle(16, 16, 16);
      g.fillStyle(color, 0.95);
      g.fillCircle(16, 16, 11);
      g.fillStyle(0xffffff, 0.95);
      g.fillCircle(16, 16, 5);
      g.generateTexture(key, 32, 32);
      g.destroy();
      return key;
    }

    private spawnProjectileToward(ability: CombatAbility, damage: number, target: MonsterRuntime) {
      const angle = Math.atan2(target.actor.y - this.playerActor.y, target.actor.x - this.playerActor.x);
      const textureKey = this.ensureBoltTexture(ability.color);
      const image = this.add.image(this.playerActor.x, this.playerActor.y, textureKey);
      image.setDisplaySize(ability.radius * 2, ability.radius * 2);
      image.setDepth(9);
      image.rotation = angle;
      this.projectiles.push({
        gameObject: image,
        ability,
        vx: Math.cos(angle) * ability.projectileSpeed,
        vy: Math.sin(angle) * ability.projectileSpeed,
        traveled: 0,
        damage,
        hitMonsterIds: new Set(),
      });
    }

    private castBurstAt(ability: CombatAbility, damage: number, target: MonsterRuntime) {
      let cx: number;
      let cy: number;
      if (ability.kind === "ultimate") {
        cx = this.playerActor.x;
        cy = this.playerActor.y;
      } else {
        const angle = Math.atan2(target.actor.y - this.playerActor.y, target.actor.x - this.playerActor.x);
        const distToTarget = Phaser.Math.Distance.Between(this.playerActor.x, this.playerActor.y, target.actor.x, target.actor.y);
        const dist = Math.min(ability.range, distToTarget);
        cx = this.playerActor.x + Math.cos(angle) * dist;
        cy = this.playerActor.y + Math.sin(angle) * dist;
      }
      for (const m of this.monsters) {
        if (m.dead) continue;
        const dist = Phaser.Math.Distance.Between(cx, cy, m.actor.x, m.actor.y);
        if (dist <= ability.radius + m.config.displaySize / 2) this.damageMonster(m, damage);
      }
      this.spawnBurstVfx(cx, cy, ability);
      if (ability.kind === "ultimate" && this.playerActor.image) {
        this.playerActor.flashTint(this, 120);
      }
    }

    private spawnBurstVfx(x: number, y: number, ability: CombatAbility) {
      const colorInt = Phaser.Display.Color.HexStringToColor(ability.color).color;
      const ring = this.add.circle(x, y, 14, colorInt, 0.22).setStrokeStyle(3, colorInt, 0.9).setDepth(8);
      this.tweens.add({
        targets: ring,
        scaleX: ability.radius / 14,
        scaleY: ability.radius / 14,
        alpha: 0,
        duration: ability.kind === "ultimate" ? 520 : 320,
        ease: "cubic.out",
        onComplete: () => ring.destroy(),
      });
    }

    private explodeProjectile(p: ProjectileRuntime) {
      this.spawnBurstVfx(p.gameObject.x, p.gameObject.y, { ...p.ability, radius: p.ability.radius * 2.4 });
      p.gameObject.destroy();
    }

    private spawnDamageText(x: number, y: number, damage: number) {
      const text = this.add
        .text(x, y, `-${damage}`, { fontSize: "13px", color: "#fca5a5", fontStyle: "bold" })
        .setOrigin(0.5)
        .setDepth(20);
      this.tweens.add({ targets: text, y: y - 26, alpha: 0, duration: 600, ease: "cubic.out", onComplete: () => text.destroy() });
    }

    private damageMonster(m: MonsterRuntime, damage: number) {
      if (m.dead) return;
      m.hp = Math.max(0, m.hp - damage);
      this.spawnDamageText(m.actor.x, m.actor.y - m.config.displaySize / 2 - 10, damage);
      m.actor.flashTint(this);
      if (m.hp <= 0) this.killMonster(m);
      else this.updateMonsterHpBar(m);
    }

    private updateMonsterHpBar(m: MonsterRuntime) {
      const ratio = Phaser.Math.Clamp(m.hp / m.hpMax, 0, 1);
      m.hpBarFill.width = m.barWidth * ratio;
      const color = ratio > 0.5 ? 0x4ade80 : ratio > 0.2 ? 0xfacc15 : 0xf87171;
      m.hpBarFill.setFillStyle(color);
    }

    private killMonster(m: MonsterRuntime) {
      m.dead = true;
      m.hp = 0;
      this.updateMonsterHpBar(m);
      this.tweens.add({
        targets: m.actor.container,
        scale: 0,
        alpha: 0,
        duration: 300,
        ease: "back.in(1.7)",
        onComplete: () => {
          m.actor.destroy();
          this.monsters = this.monsters.filter((x) => x !== m);
        },
      });
      useSkillStore.getState().addSkillPoints(m.config.skillPointReward);
      this.gainExp(m.config.expReward);
    }

    private levelMultiplier(): number {
      return 1 + (this.playerLevel - 1) * LEVEL_STAT_GROWTH;
    }

    private gainExp(amount: number) {
      this.playerExp += amount;
      while (this.playerExp >= this.expToNext) {
        this.playerExp -= this.expToNext;
        this.playerLevel += 1;
        this.expToNext = Math.round(20 * Math.pow(this.playerLevel, 1.35));
        const newMaxHp = Math.round(stats.hp * this.levelMultiplier());
        const hpGained = newMaxHp - this.playerMaxHp;
        this.playerMaxHp = newMaxHp;
        this.playerHp = Math.min(this.playerMaxHp, this.playerHp + hpGained + this.playerMaxHp * 0.1);
      }
    }

    // ---- Per-frame updates --------------------------------------------

    private updateMonsters(dt: number) {
      const now = this.time.now;
      for (const m of this.monsters) {
        if (m.dead) continue; // awaiting its death tween to finish

        const dx = this.playerActor.x - m.actor.x;
        const dy = this.playerActor.y - m.actor.y;
        const dist = Math.hypot(dx, dy);
        let moveAngle: number | null = null;
        if (dist > 4) {
          m.actor.setPosition(m.actor.x + (dx / dist) * m.config.moveSpeed * dt, m.actor.y + (dy / dist) * m.config.moveSpeed * dt);
          moveAngle = Math.atan2(dy, dx);
        }
        m.actor.update(dt, moveAngle);

        if (dist < PLAYER_HIT_RADIUS + m.config.displaySize / 2 && now >= m.nextContactAt) {
          m.nextContactAt = now + CONTACT_TICK_MS;
          if (now >= this.invulnerableUntil) {
            this.playerHp = Math.max(0, this.playerHp - m.contactDamage);
          }
        }
      }
    }

    private updateProjectiles(dt: number) {
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const p = this.projectiles[i];
        p.gameObject.x += p.vx * dt;
        p.gameObject.y += p.vy * dt;
        p.traveled += Math.hypot(p.vx * dt, p.vy * dt);

        let hit = false;
        for (const m of this.monsters) {
          if (m.dead || p.hitMonsterIds.has(m.id)) continue;
          const dist = Phaser.Math.Distance.Between(p.gameObject.x, p.gameObject.y, m.actor.x, m.actor.y);
          if (dist <= p.ability.radius + m.config.displaySize / 2) {
            this.damageMonster(m, p.damage);
            p.hitMonsterIds.add(m.id);
            hit = true;
            if (!p.ability.piercing) break;
          }
        }

        if ((hit && !p.ability.piercing) || p.traveled >= p.ability.range) {
          this.explodeProjectile(p);
          this.projectiles.splice(i, 1);
        }
      }
    }

    private updatePlayer(dt: number) {
      let vx = 0;
      let vy = 0;
      if (this.keys.left.isDown) vx -= 1;
      if (this.keys.right.isDown) vx += 1;
      if (this.keys.up.isDown) vy -= 1;
      if (this.keys.down.isDown) vy += 1;
      const isMoving = vx !== 0 || vy !== 0;
      let moveAngle: number | null = null;

      if (isMoving) {
        const len = Math.hypot(vx, vy);
        vx /= len;
        vy /= len;
        const speed = stats.moveSpeed || DEFAULT_PLAYER_SPEED;
        this.playerActor.setPosition(
          Phaser.Math.Clamp(this.playerActor.x + vx * speed * dt, 20, WORLD_WIDTH - 20),
          Phaser.Math.Clamp(this.playerActor.y + vy * speed * dt, 20, WORLD_HEIGHT - 20),
        );
        moveAngle = Math.atan2(vy, vx);
        this.facing = moveAngle;
      }
      this.isMoving = isMoving;
      this.playerActor.update(dt, moveAngle);

      this.attemptFire(loadout.basicAttack); // auto-attack — cooldown-gated inside

      if (this.playerHp <= 0) {
        this.playerActor.setPosition(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
        this.playerHp = this.playerMaxHp;
        this.invulnerableUntil = this.time.now + INVULNERABLE_MS;
      }
    }

    private syncCooldowns() {
      const now = this.time.now;
      const cooldowns: Record<string, { cooldownMs: number; readyAt: number; now: number }> = {};
      for (const ability of [...abilities, HEAL_POTION]) {
        cooldowns[ability.id] = {
          cooldownMs: this.cooldownMsFor(ability),
          readyAt: this.cooldownReadyAt.get(ability.id) ?? 0,
          now,
        };
      }
      useWorldStore.getState().setCooldowns(cooldowns);
    }

    update(_time: number, delta: number) {
      if (useWorldStore.getState().paused) return;
      const dt = Math.min(delta / 1000, 0.05);

      this.updatePlayer(dt);
      this.updateMonsters(dt);
      this.updateProjectiles(dt);

      this.waveTimer += delta;
      if (this.waveTimer >= WAVE_INTERVAL_MS) {
        this.waveTimer = 0;
        this.spawnWave();
      }

      this.syncAccumulator += delta;
      if (this.syncAccumulator >= STORE_SYNC_INTERVAL_MS) {
        this.syncAccumulator = 0;
        useWorldStore.getState().setPlayer({
          x: this.playerActor.x,
          y: this.playerActor.y,
          angle: this.facing,
          isMoving: this.isMoving,
          hp: this.playerHp,
          maxHp: this.playerMaxHp,
          level: this.playerLevel,
          exp: this.playerExp,
          expToNext: this.expToNext,
        });
        useWorldStore.getState().setBlips(
          this.monsters
            .filter((m) => !m.dead)
            .map((m) => ({ id: m.id, x: m.actor.x, y: m.actor.y, color: TIER_BLIP_COLOR[m.config.tier] })),
        );
        this.syncCooldowns();
      }
    }
  };
}
