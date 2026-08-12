import type { CharacterClassId } from "@/modules/character/types";
import { CHARACTER_CLASSES } from "@/modules/character/data";
import type { CombatAbility, CombatLoadout, MonsterConfig } from "./types";

/** ghost = quái thường, skull = quái tinh anh, spider = boss — art in
 * `public/villain/`. `hp`/`contactDamage` are level-1 baselines, scaled up
 * at spawn time by the monster's assigned level (see `monsterLevelFor` /
 * `scaledMonsterStats` in `world/scene.ts`). Tuned against the stat pools in
 * `modules/stats/data.ts` (roughly 300-700 HP, 8-50 dmg per hit). */
export const MONSTER_CONFIGS: MonsterConfig[] = [
  {
    kind: "ghost",
    tier: "normal",
    name: "U Hồn",
    sprite: "/villain/ghost_ingame.png",
    hp: 40,
    contactDamage: 4,
    moveSpeed: 42,
    displaySize: 46,
    spawnCount: 10,
    skillPointReward: 1,
    expReward: 4,
  },
  {
    kind: "skull",
    tier: "elite",
    name: "Cốt Tinh",
    sprite: "/villain/skull_ingame.png",
    hp: 150,
    contactDamage: 11,
    moveSpeed: 58,
    displaySize: 62,
    spawnCount: 4,
    skillPointReward: 2,
    expReward: 12,
  },
  {
    kind: "spider",
    tier: "boss",
    name: "Thiên Chu Vương",
    sprite: "/villain/spider_ingame.png",
    hp: 450,
    contactDamage: 18,
    moveSpeed: 36,
    displaySize: 96,
    spawnCount: 1,
    skillPointReward: 5,
    expReward: 50,
  },
];

/** Universal active ability, not tied to any class — bound to `U`, always
 * available (base kit, not gated by the skill tree). `I`/`O` are reserved
 * HUD slots for future consumables (not implemented yet — see roadmap). */
export const HEAL_POTION: CombatAbility = {
  id: "heal-potion",
  key: "U",
  kind: "heal",
  damageStat: "physicalDamage", // unused for "heal" kind
  damageMultiplier: 0,
  cooldownMs: 14000,
  range: 0,
  radius: 0,
  projectileSpeed: 0,
  piercing: false,
  color: "#4ade80",
  healRatio: 0.3,
};

function basicAttackFor(classId: CharacterClassId): CombatAbility {
  const color = CHARACTER_CLASSES.find((c) => c.id === classId)!.color;
  const damageStat = classId === "dragon" ? "magicDamage" : "physicalDamage";
  return {
    id: `${classId}-basic-attack`,
    key: "Tự động",
    kind: "bolt",
    damageStat,
    damageMultiplier: 0.85,
    cooldownMs: 450,
    range: 480,
    radius: 10,
    projectileSpeed: 560,
    piercing: false,
    color,
  };
}

/** Combat numbers for each class's 3 keybound abilities. `id` MUST match the
 * corresponding `SkillNode.id` in `modules/skills/data.ts` (tier-1 active →
 * skill1, its tier-2 active child → skill2, tier-3 → ultimate) so unlock
 * state, name, description and icon stay driven by the skill tree — this
 * file only adds the numbers needed to actually fire the ability. */
export const COMBAT_LOADOUTS: Record<CharacterClassId, CombatLoadout> = {
  crane: {
    basicAttack: basicAttackFor("crane"),
    skill1: {
      id: "crane-piercing-shot",
      key: "J",
      kind: "bolt",
      damageStat: "physicalDamage",
      damageMultiplier: 1.6,
      cooldownMs: 3000,
      range: 640,
      radius: 12,
      projectileSpeed: 720,
      piercing: true,
      color: "#e4e4e7",
    },
    skill2: {
      id: "crane-poison-rain",
      key: "K",
      kind: "burst",
      damageStat: "magicDamage",
      damageMultiplier: 1.4,
      cooldownMs: 6000,
      range: 420,
      radius: 110,
      projectileSpeed: 0,
      piercing: false,
      color: "#a3e635",
    },
    ultimate: {
      id: "crane-cloud-piercer",
      key: "L",
      kind: "ultimate",
      damageStat: "physicalDamage",
      damageMultiplier: 3.2,
      cooldownMs: 16000,
      range: 0,
      radius: 220,
      projectileSpeed: 0,
      piercing: false,
      color: "#f4f4f5",
    },
  },
  dragon: {
    basicAttack: basicAttackFor("dragon"),
    skill1: {
      id: "dragon-flame-palm",
      key: "J",
      kind: "burst",
      damageStat: "magicDamage",
      damageMultiplier: 1.5,
      cooldownMs: 3200,
      range: 380,
      radius: 90,
      projectileSpeed: 0,
      piercing: false,
      color: "#fb923c",
    },
    skill2: {
      id: "dragon-flame-charge",
      key: "K",
      kind: "bolt",
      damageStat: "magicDamage",
      damageMultiplier: 2.3,
      cooldownMs: 6500,
      range: 700,
      radius: 20,
      projectileSpeed: 640,
      piercing: true,
      color: "#22d3ee",
    },
    ultimate: {
      id: "dragon-manifest",
      key: "L",
      kind: "ultimate",
      damageStat: "magicDamage",
      damageMultiplier: 3.6,
      cooldownMs: 16000,
      range: 0,
      radius: 230,
      projectileSpeed: 0,
      piercing: false,
      color: "#6366f1",
    },
  },
  tiger: {
    basicAttack: basicAttackFor("tiger"),
    skill1: {
      id: "tiger-claw-strike",
      key: "J",
      kind: "burst",
      damageStat: "physicalDamage",
      damageMultiplier: 2.0,
      cooldownMs: 2600,
      range: 140,
      radius: 80,
      projectileSpeed: 0,
      piercing: false,
      color: "#fb923c",
    },
    skill2: {
      id: "tiger-mountain-charge",
      key: "K",
      kind: "bolt",
      damageStat: "physicalDamage",
      damageMultiplier: 2.4,
      cooldownMs: 6000,
      range: 480,
      radius: 32,
      projectileSpeed: 780,
      piercing: true,
      color: "#f97316",
    },
    ultimate: {
      id: "tiger-king-descent",
      key: "L",
      kind: "ultimate",
      damageStat: "physicalDamage",
      damageMultiplier: 3.8,
      cooldownMs: 16000,
      range: 0,
      radius: 240,
      projectileSpeed: 0,
      piercing: false,
      color: "#b45309",
    },
  },
};
