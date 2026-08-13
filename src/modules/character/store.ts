import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useInventoryStore } from "@/modules/inventory/store";
import { WEAPON_TYPES } from "@/modules/inventory/data";
import { setMaxHp } from "@/modules/world/liveHud";
import { CHARACTERS, STAT_POINTS_PER_LEVEL } from "./data";
import type { CharacterId } from "./types";

interface CharacterState {
  characterId: CharacterId;
  level: number;
  exp: number;
  expToNext: number;
  /** Unspent points from leveling up — see `allocateStat`. */
  statPoints: number;
  bonusHp: number;
  bonusAttack: number;
}

/** Character identity + persistent progression (level/exp/allocated stat
 * points) — separate from `modules/world/liveHud.ts`, which only holds
 * PER-LIFE runtime state (current hp, rage) that's fine to reset. Persisted
 * the same way `mapProgress.ts`/`inventory/store.ts` are. */
export const useCharacterStore = create<CharacterState>()(
  persist(
    (): CharacterState => ({
      characterId: "dog",
      level: 1,
      exp: 0,
      expToNext: 100,
      statPoints: 0,
      bonusHp: 0,
      bonusAttack: 0,
    }),
    { name: "wulin-character" },
  ),
);

export function setCharacter(id: CharacterId) {
  useCharacterStore.setState({ characterId: id });
}

/** Grants EXP and rolls level-ups (carrying the remainder forward, scaling
 * `expToNext` per level) — the only place level/exp changes. Each level
 * grants `STAT_POINTS_PER_LEVEL` points to spend via `allocateStat`. */
export function gainExp(amount: number) {
  useCharacterStore.setState((s) => {
    let { level, exp, expToNext, statPoints } = s;
    exp += amount;
    while (exp >= expToNext) {
      exp -= expToNext;
      level += 1;
      expToNext = Math.round(expToNext * 1.25);
      statPoints += STAT_POINTS_PER_LEVEL;
    }
    return { level, exp, expToNext, statPoints };
  });
}

/** Spends 1 unspent point into Máu or Tấn Công — no-op if none left. Keeps
 * `liveHud`'s `maxHp` in sync since it just changed. */
export function allocateStat(stat: "hp" | "attack") {
  const { statPoints } = useCharacterStore.getState();
  if (statPoints <= 0) return;
  useCharacterStore.setState((s) => ({
    statPoints: s.statPoints - 1,
    bonusHp: stat === "hp" ? s.bonusHp + 1 : s.bonusHp,
    bonusAttack: stat === "attack" ? s.bonusAttack + 1 : s.bonusAttack,
  }));
  syncMaxHpToLiveHud();
}

export interface EffectiveStats {
  maxHp: number;
  attack: number;
  characterSpriteSrc: string;
  weaponSpriteSrc: string;
}

/** The single source of truth for "how strong is the player right now" —
 * base + level-up points + equipped weapon's bonus. `mapScene.ts`,
 * `PlayerStatusPanel`, and `CharacterPanel` all read through this instead
 * of adding base+bonus by hand in more than one place. */
export function getEffectiveStats(): EffectiveStats {
  const character = useCharacterStore.getState();
  const config = CHARACTERS[character.characterId];
  const inventory = useInventoryStore.getState();
  const equippedItem = inventory.items.find((i) => i.id === inventory.equippedItemId) ?? null;

  const weaponSpriteSrc = WEAPON_TYPES[equippedItem?.weaponTypeId ?? config.defaultWeaponId].spriteSrc;
  const maxHp = config.baseHp + character.bonusHp + (equippedItem?.statBonus.hp ?? 0);
  const attack = config.baseAttack + character.bonusAttack + (equippedItem?.statBonus.attack ?? 0);

  return { maxHp, attack, characterSpriteSrc: config.spriteSrc, weaponSpriteSrc };
}

/** Pushes the current effective `maxHp` into `liveHud` (clamping `hp` down
 * if it now exceeds the new max) — call this after anything that can change
 * it: leveling, spending a stat point (done internally by `allocateStat`),
 * or equipping a different weapon (done by the caller, e.g.
 * `CharacterPanel`, since `inventory/store.ts` doesn't import this module
 * to avoid a store-to-store import cycle). */
export function syncMaxHpToLiveHud() {
  const { maxHp } = getEffectiveStats();
  setMaxHp(maxHp);
}
