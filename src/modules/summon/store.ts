import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addItem, spendSummonCard } from "@/modules/inventory/store";
import { WEAPON_TYPE_IDS } from "@/modules/inventory/data";
import type { InventoryItem } from "@/modules/inventory/types";
import { RARITY_CONFIG, RARITY_IDS } from "./data";
import type { Rarity } from "./types";

interface SummonState {
  /** Higher = better rarity odds, see `rollRarity`. Levels up automatically
   * via `recordSummonRoll` once `summonExp` reaches `rollsForLevel`. */
  storeLevel: number;
  /** Rolls accumulated toward the NEXT `storeLevel` — resets (keeping any
   * remainder) each time a level-up fires. */
  summonExp: number;
}

/** The Summon Store's own progression — separate from `character`'s level,
 * persisted the same way. */
export const useSummonStore = create<SummonState>()(
  persist(() => ({ storeLevel: 1, summonExp: 0 }), { name: "wulin-summon" }),
);

/** Rolls needed to go from `level` to `level + 1` — plain linear curve
 * (level×10), a placeholder tuning number, easy to change later since UI
 * reads it through this function rather than hardcoding the formula. */
export function rollsForLevel(level: number): number {
  return level * 10;
}

/** Called once per successful summon (both `performSummon` and
 * `performSummonBatch` route through here) — accumulates `summonExp` and
 * levels up `storeLevel` whenever the threshold is reached, carrying over
 * any remainder instead of resetting to 0. */
function recordSummonRoll(count: number) {
  useSummonStore.setState((s) => {
    let { storeLevel, summonExp } = s;
    summonExp += count;
    let threshold = rollsForLevel(storeLevel);
    while (summonExp >= threshold) {
      summonExp -= threshold;
      storeLevel += 1;
      threshold = rollsForLevel(storeLevel);
    }
    return { storeLevel, summonExp };
  });
}

const BASE_WEIGHTS: Record<Rarity, number> = { common: 70, rare: 24, epic: 5, legendary: 1 };
const MIN_COMMON_WEIGHT = 20;
const SHIFT_PER_LEVEL = 3; // moved from common into epic(+2)/legendary(+1) each level above 1

/** Single source of truth for the odds math — both `rollRarity` (actually
 * rolling) and `SummonPanel`'s "Xem Tỉ Lệ" viewer (just displaying the
 * numbers) read through this, so the two can never drift apart. Every
 * `storeLevel` above 1 shifts a few points out of `common` into
 * `epic`/`legendary` (never below `MIN_COMMON_WEIGHT`); `rare` stays fixed. */
export function getRarityWeights(storeLevel: number): Record<Rarity, number> {
  const weights = { ...BASE_WEIGHTS };
  const extraLevels = Math.max(0, storeLevel - 1);
  for (let i = 0; i < extraLevels && weights.common - SHIFT_PER_LEVEL >= MIN_COMMON_WEIGHT; i++) {
    weights.common -= SHIFT_PER_LEVEL;
    weights.epic += 2;
    weights.legendary += 1;
  }
  return weights;
}

/** Weights normalized to whole percentages that sum to exactly 100 — the
 * leftover from rounding always lands on `common` so the displayed numbers
 * never silently sum to 99/101. */
export function getRarityPercentages(storeLevel: number): Record<Rarity, number> {
  const weights = getRarityWeights(storeLevel);
  const total = RARITY_IDS.reduce((sum, id) => sum + weights[id], 0);
  const pct = { common: 0, rare: 0, epic: 0, legendary: 0 } as Record<Rarity, number>;
  let assigned = 0;
  for (const id of RARITY_IDS) {
    if (id === "common") continue;
    pct[id] = Math.round((weights[id] / total) * 100);
    assigned += pct[id];
  }
  pct.common = 100 - assigned;
  return pct;
}

/** Weighted random rarity — see `getRarityWeights` for the actual math. */
export function rollRarity(storeLevel: number): Rarity {
  const weights = getRarityWeights(storeLevel);
  const total = RARITY_IDS.reduce((sum, id) => sum + weights[id], 0);
  let roll = Math.random() * total;
  for (const id of RARITY_IDS) {
    roll -= weights[id];
    if (roll <= 0) return id;
  }
  return "common";
}

/** Spends 1 summon card (from `inventory`) for a random weapon item —
 * `null` if there were no cards to spend. Item level = the character's
 * current level (passed in by the caller, e.g. `SummonPanel.tsx` via
 * `useCharacterStore`); stat bonus is the same base formula as the old
 * kill-drop roll (Máu `level*8` or Tấn Công `level*2`, 50/50), scaled by
 * the rolled rarity's `statMultiplier`. */
export function performSummon(characterLevel: number): InventoryItem | null {
  if (!spendSummonCard()) return null;

  const { storeLevel } = useSummonStore.getState();
  const rarity = rollRarity(storeLevel);
  const multiplier = RARITY_CONFIG[rarity].statMultiplier;
  const weaponTypeId = WEAPON_TYPE_IDS[Math.floor(Math.random() * WEAPON_TYPE_IDS.length)];
  const statBonus =
    Math.random() < 0.5
      ? { attack: Math.round(characterLevel * 2 * multiplier) }
      : { hp: Math.round(characterLevel * 8 * multiplier) };

  const item: InventoryItem = { id: crypto.randomUUID(), weaponTypeId, level: characterLevel, rarity, statBonus };
  addItem(item);
  recordSummonRoll(1);
  return item;
}

/** Rolls `count` times in a row — stops early if summon cards run out, so
 * the returned array can be shorter than `count`. Used by "Triệu Hồi x10";
 * `performSummon` already handles the single-roll case (and its own
 * `recordSummonRoll(1)`), so this only adds the loop, not duplicate logic. */
export function performSummonBatch(characterLevel: number, count: number): InventoryItem[] {
  const results: InventoryItem[] = [];
  for (let i = 0; i < count; i++) {
    const item = performSummon(characterLevel);
    if (!item) break;
    results.push(item);
  }
  return results;
}
