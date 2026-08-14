import Phaser from "phaser";
import { Actor } from "./actor";
import type { QuestId } from "@/modules/quest/types";

const DEFAULT_DISPLAY_SIZE = 52;
const HP_BAR_WIDTH = 46;
const HP_BAR_HEIGHT = 5;
const HP_BAR_OFFSET_Y = -40;
const DEATH_TWEEN_MS = 300;

/** A monster placed in a room via `MapModule.monstersByCell` (see
 * `maps/types.ts`) — position/sprite/combat numbers only, no runtime state. */
export interface MonsterSpawnConfig {
  xFrac: number;
  yFrac: number;
  spriteSrc: string;
  displaySize?: number;
  hp: number;
  damage: number;
  moveSpeed: number;
  /** Player entering this range starts the chase — once triggered, stays
   * aggroed for the rest of the room visit (no leash/give-up). */
  aggroRadius: number;
  /** Close enough to hit the target on cooldown (`attackIntervalMs`). */
  attackRadius: number;
  attackIntervalMs: number;
  expReward: number;
  /** If set, killing this monster reports 1 point of progress toward this
   * quest (only counts while the quest is actually accepted — see
   * `reportQuestProgress` in `modules/quest/store.ts`). */
  questId?: QuestId;
}

/** A hostile mob — owns its own `Actor` (art/rotation/hop), a floating HP
 * bar, and its own AI/combat state (aggro, attack cooldown, death). Kept as
 * its own module rather than folded into `mapScene.ts` because monsters are
 * expected to grow more varied (different shapes/behaviors later) — see
 * SKILL.md mục 1 on not lumping a growing concern into whatever file
 * happens to orchestrate it today. `mapScene.ts` only calls these methods
 * and reacts to their return values; it never reaches into aggro/cooldown
 * state directly. */
export class Monster {
  readonly actor: Actor;
  readonly config: MonsterSpawnConfig;
  private currentHp: number;
  private aggro = false;
  private lastAttackAt = -Infinity;
  private dead = false;
  private readonly hpBarBg: Phaser.GameObjects.Rectangle;
  private readonly hpBarFill: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    config: MonsterSpawnConfig,
    x: number,
    y: number,
    depth: number,
    textureKey: string | null,
  ) {
    this.config = config;
    this.currentHp = config.hp;
    this.actor = new Actor(scene, {
      x,
      y,
      textureKey,
      displaySize: config.displaySize ?? DEFAULT_DISPLAY_SIZE,
      fallbackColor: 0x84cc16,
      depth,
    });
    this.hpBarBg = scene.add
      .rectangle(x, y + HP_BAR_OFFSET_Y, HP_BAR_WIDTH, HP_BAR_HEIGHT, 0x1c1917, 0.85)
      .setDepth(depth + 1);
    this.hpBarFill = scene.add
      .rectangle(x - HP_BAR_WIDTH / 2, y + HP_BAR_OFFSET_Y, HP_BAR_WIDTH, HP_BAR_HEIGHT, 0xef4444)
      .setOrigin(0, 0.5)
      .setDepth(depth + 1);
  }

  get x() {
    return this.actor.x;
  }

  get y() {
    return this.actor.y;
  }

  get isAlive() {
    return !this.dead;
  }

  /** Current HP — `config.hp` doubles as max HP. Read by `mapScene.ts` to
   * drive `combatTarget.ts` (the on-screen "target monster" HUD). */
  get hp() {
    return this.currentHp;
  }

  /** Call once per frame — chases `targetX/targetY` if aggro, otherwise
   * idles in place; keeps the HP bar glued above the actor either way. */
  update(dt: number, targetX: number, targetY: number) {
    if (this.dead) return;
    const dist = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);
    if (dist <= this.config.aggroRadius) this.aggro = true;

    let moveAngle: number | null = null;
    if (this.aggro && dist > 1) {
      const angle = Math.atan2(targetY - this.y, targetX - this.x);
      const step = this.config.moveSpeed * dt;
      this.actor.setPosition(this.x + Math.cos(angle) * step, this.y + Math.sin(angle) * step);
      moveAngle = angle;
    }
    this.actor.update(dt, moveAngle);

    this.hpBarBg.setPosition(this.x, this.y + HP_BAR_OFFSET_Y);
    this.hpBarFill.setPosition(this.x - HP_BAR_WIDTH / 2, this.y + HP_BAR_OFFSET_Y);
    this.hpBarFill.width = HP_BAR_WIDTH * Math.max(0, this.currentHp / this.config.hp);
  }

  /** True if close enough to `targetX/targetY` and its own attack cooldown
   * has elapsed (resets the cooldown as a side effect). The caller applies
   * the actual damage — this class only knows about itself. */
  tryAttack(now: number, targetX: number, targetY: number): boolean {
    if (this.dead) return false;
    const dist = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);
    if (dist > this.config.attackRadius) return false;
    if (now - this.lastAttackAt < this.config.attackIntervalMs) return false;
    this.lastAttackAt = now;
    return true;
  }

  /** Applies damage, forces aggro (getting hit always draws it in, even
   * from outside `aggroRadius`), flashes hit feedback. Returns true if this
   * killed it — the caller decides what a kill is worth (EXP etc). */
  takeDamage(scene: Phaser.Scene, amount: number): boolean {
    if (this.dead) return false;
    this.aggro = true;
    this.currentHp = Math.max(0, this.currentHp - amount);
    this.actor.flashTint(scene);
    if (this.currentHp <= 0) {
      this.die(scene);
      return true;
    }
    return false;
  }

  private die(scene: Phaser.Scene) {
    this.dead = true;
    this.hpBarBg.destroy();
    this.hpBarFill.destroy();
    scene.tweens.add({
      targets: this.actor.container,
      scale: 0,
      alpha: 0,
      duration: DEATH_TWEEN_MS,
      ease: "power1.in",
      onComplete: () => this.actor.destroy(),
    });
  }

  destroy() {
    this.hpBarBg.destroy();
    this.hpBarFill.destroy();
    this.actor.destroy();
  }
}
