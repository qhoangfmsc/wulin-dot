import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InventoryItem } from "./types";

interface InventoryState {
  items: InventoryItem[];
  equippedItemId: string | null;
  /** In-world currency — "Bạc". */
  currency: number;
  /** Spent at the Summon Store (`modules/summon/`) to roll a random item —
   * see `spendSummonCard`. */
  summonCards: number;
}

/** Weapons the player has picked up + which one (if any) is equipped —
 * persisted the same way `mapProgress.ts` is, so it survives a refresh.
 * `mapScene.ts`/`Monster`/`modules/summon/store.ts` call the action
 * functions below directly via `getState()`/`setState()`, same bridge
 * pattern as `liveHud.ts`. */
export const useInventoryStore = create<InventoryState>()(
  persist(
    (): InventoryState => ({
      items: [],
      equippedItemId: null,
      currency: 0,
      summonCards: 0,
    }),
    { name: "wulin-inventory" },
  ),
);

export function addItem(item: InventoryItem) {
  useInventoryStore.setState((s) => ({ items: [...s.items, item] }));
}

/** Used by `modules/market/store.ts`'s sell flow — unequips first if the
 * sold item happened to be the one worn, so `equippedItemId` never points
 * at an item that no longer exists. */
export function removeItem(id: string) {
  useInventoryStore.setState((s) => ({
    items: s.items.filter((item) => item.id !== id),
    equippedItemId: s.equippedItemId === id ? null : s.equippedItemId,
  }));
}

/** `null` unequips (falls back to the character's default weapon look). */
export function equipItem(id: string | null) {
  useInventoryStore.setState({ equippedItemId: id });
}

export function addCurrency(amount: number) {
  useInventoryStore.setState((s) => ({ currency: s.currency + amount }));
}

/** Spends `amount` Bạc if there's enough — returns whether it actually
 * spent it, same "guard + report success" shape as `spendSummonCard`. Used
 * by `modules/market/store.ts` for buying/resetting-stock. */
export function spendCurrency(amount: number): boolean {
  const { currency } = useInventoryStore.getState();
  if (currency < amount) return false;
  useInventoryStore.setState((s) => ({ currency: s.currency - amount }));
  return true;
}

export function addSummonCard(amount: number) {
  useInventoryStore.setState((s) => ({ summonCards: s.summonCards + amount }));
}

/** Spends 1 card if any are left — returns whether it actually spent one, so
 * the caller (`modules/summon/store.ts`) knows whether to roll an item. */
export function spendSummonCard(): boolean {
  const { summonCards } = useInventoryStore.getState();
  if (summonCards <= 0) return false;
  useInventoryStore.setState((s) => ({ summonCards: s.summonCards - 1 }));
  return true;
}

const CURRENCY_DROP_CHANCE = 0.5;
const SUMMON_CARD_DROP_CHANCE = 0.15;
const CURRENCY_MIN = 5;
const CURRENCY_MAX = 15;

/** Rolled once per monster kill (not per hit) — 50% chance of Bạc (flat
 * 5–15, not level-scaled), independently 15% chance of a Summon Card. No
 * more direct item drops here — items only come from summoning
 * (`modules/summon/`, see `SUMMON_CARD_DROP_CHANCE`). Applies the drop
 * immediately and reports what dropped so the caller can show floating
 * text. */
export function rollDrop(): { currency?: number; summonCard?: boolean } {
  const result: { currency?: number; summonCard?: boolean } = {};

  if (Math.random() < CURRENCY_DROP_CHANCE) {
    const amount = Math.floor(CURRENCY_MIN + Math.random() * (CURRENCY_MAX - CURRENCY_MIN + 1));
    addCurrency(amount);
    result.currency = amount;
  }

  if (Math.random() < SUMMON_CARD_DROP_CHANCE) {
    addSummonCard(1);
    result.summonCard = true;
  }

  return result;
}
