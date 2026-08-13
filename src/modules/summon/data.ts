import type { Rarity } from "./types";

export interface RarityConfig {
  name: string;
  color: string;
  /** Multiplies the base level-scaled stat bonus — see `store.ts`'s
   * `performSummon`. */
  statMultiplier: number;
}

/** Real, permanent quality tiers — add an entry here to introduce a new
 * one, no other code changes needed (`rollRarity` in `store.ts` reads its
 * base weight from `RARITY_WEIGHTS` below, keyed the same way). */
export const RARITY_CONFIG: Record<Rarity, RarityConfig> = {
  common: { name: "Thường", color: "#9ca3af", statMultiplier: 1 },
  rare: { name: "Hiếm", color: "#60a5fa", statMultiplier: 1.5 },
  epic: { name: "Sử Thi", color: "#a855f7", statMultiplier: 2.5 },
  legendary: { name: "Huyền Thoại", color: "#f2c66d", statMultiplier: 4 },
};

export const RARITY_IDS = Object.keys(RARITY_CONFIG) as Rarity[];
