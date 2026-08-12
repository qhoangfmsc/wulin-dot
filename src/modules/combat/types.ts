import type { StatId } from "@/modules/stats/types";

export type MonsterKind = "ghost" | "skull" | "spider";
export type MonsterTier = "normal" | "elite" | "boss";

/** Static tuning for one monster species. Spawning is wave-based (see
 * `world/scene.ts`), so `spawnCount` is a concurrent-alive CAP for this kind
 * (prevents e.g. infinite skulls), not an initial population. */
export interface MonsterConfig {
  kind: MonsterKind;
  tier: MonsterTier;
  name: string;
  sprite: string; // path under /public/villain/
  hp: number; // at monster level 1 — scaled up at spawn time by monster level
  contactDamage: number; // per tick while touching the player, same scaling
  moveSpeed: number;
  displaySize: number; // px, longest edge, before the elite/boss size bump
  spawnCount: number; // max concurrent alive of this kind
  skillPointReward: number; // granted to the player's skill point pool on kill
  expReward: number; // granted to the player's level/exp pool on kill
}

export type AbilityKind = "bolt" | "burst" | "ultimate" | "heal";

/** Combat numbers for one usable ability. `basicAttack` abilities are
 * generic per class; `skill1`/`skill2`/`ultimate` are keyed by the matching
 * `SkillNode.id` from `modules/skills/data.ts` so they share unlock state,
 * name, description, and icon with the skill tree instead of duplicating
 * them here. All non-heal abilities auto-target the nearest alive monster
 * (there's no mouse aim — see input scheme in the design doc). */
export interface CombatAbility {
  id: string;
  key: string; // display keybind label, e.g. "J", "K", "L", "U"
  kind: AbilityKind;
  damageStat: Extract<StatId, "physicalDamage" | "magicDamage">;
  damageMultiplier: number;
  cooldownMs: number;
  range: number; // max projectile travel distance, or burst cast distance from player
  radius: number; // hit radius (bolt) or blast radius (burst/ultimate)
  projectileSpeed: number; // px/s, unused for burst/ultimate/heal
  piercing: boolean; // bolt keeps traveling through monsters instead of stopping
  color: string; // hex, tints the projectile/vfx
  /** Only used when `kind === "heal"`: fraction of max HP restored. */
  healRatio?: number;
}

export interface CombatLoadout {
  basicAttack: CombatAbility;
  skill1: CombatAbility;
  skill2: CombatAbility;
  ultimate: CombatAbility;
}
