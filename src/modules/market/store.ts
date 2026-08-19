import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addCurrency, addItem, addSummonCard, removeItem, spendCurrency, useInventoryStore } from "@/modules/inventory/store";
import { WEAPON_TYPE_IDS } from "@/modules/inventory/data";
import { syncMaxHpToLiveHud } from "@/modules/character/store";
import { rollRarity } from "@/modules/summon/store";
import { RARITY_CONFIG } from "@/modules/summon/data";
import { BASE_LISTING_PRICE, BASE_SELL_PRICE, DAILY_FREE_SUMMON_CARDS, RESET_STOCK_COST, STOCK_SIZE } from "./data";
import type { MarketListing } from "./types";

interface MarketState {
  stock: MarketListing[];
  /** `"YYYY-MM-DD"` of the last successful `claimDailyFreeCards()`, `null`
   * before the first ever claim. */
  lastDailyClaimAt: string | null;
}

/** Chợ Trời's stock + daily-claim tracking — persisted the same way
 * `inventory/store.ts` is. `mapScene.ts`/components call the action
 * functions below directly via `getState()`/`setState()` where needed. */
export const useMarketStore = create<MarketState>()(
  persist((): MarketState => ({ stock: [], lastDailyClaimAt: null }), { name: "wulin-market" }),
);

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function createRandomListing(level: number): MarketListing {
  const rarity = rollRarity(1); // shop's stock isn't tied to Tiệm Triệu Hồi's storeLevel — plain base odds
  const multiplier = RARITY_CONFIG[rarity].statMultiplier;
  const weaponTypeId = WEAPON_TYPE_IDS[Math.floor(Math.random() * WEAPON_TYPE_IDS.length)];
  const statBonus =
    Math.random() < 0.5
      ? { attack: Math.round(level * 2 * multiplier) }
      : { hp: Math.round(level * 8 * multiplier) };
  return {
    id: crypto.randomUUID(),
    weaponTypeId,
    level,
    rarity,
    statBonus,
    price: Math.round(BASE_LISTING_PRICE * multiplier * level),
  };
}

/** Populates `stock` if it's empty (first-ever open) — does nothing once
 * there's already something in stock, use `resetStock()` to reroll on
 * purpose. */
export function ensureStock(characterLevel: number) {
  if (useMarketStore.getState().stock.length > 0) return;
  const stock = Array.from({ length: STOCK_SIZE }, () => createRandomListing(characterLevel));
  useMarketStore.setState({ stock });
}

/** Rerolls the ENTIRE stock — costs `RESET_STOCK_COST` Bạc, returns whether
 * it actually happened (guarded the same "check then report" way as
 * `spendSummonCard`). */
export function resetStock(characterLevel: number): boolean {
  if (!spendCurrency(RESET_STOCK_COST)) return false;
  const stock = Array.from({ length: STOCK_SIZE }, () => createRandomListing(characterLevel));
  useMarketStore.setState({ stock });
  return true;
}

export function buyListing(listingId: string): boolean {
  const listing = useMarketStore.getState().stock.find((l) => l.id === listingId);
  if (!listing) return false;
  if (!spendCurrency(listing.price)) return false;
  addItem({ id: listing.id, weaponTypeId: listing.weaponTypeId, level: listing.level, rarity: listing.rarity, statBonus: listing.statBonus });
  useMarketStore.setState((s) => ({ stock: s.stock.filter((l) => l.id !== listingId) }));
  return true;
}

/** Sell price is a fraction of buy price (same rarity/level math, smaller
 * base) — always succeeds if the item actually exists in the inventory. */
export function sellItem(itemId: string): boolean {
  const item = useInventoryStore.getState().items.find((i) => i.id === itemId);
  if (!item) return false;
  const price = Math.round(BASE_SELL_PRICE * RARITY_CONFIG[item.rarity].statMultiplier * item.level);
  removeItem(itemId);
  addCurrency(price);
  syncMaxHpToLiveHud(); // no-op unless the sold item was equipped
  return true;
}

/** Once per real-world day — returns whether it actually granted cards
 * (already claimed today → `false`, no-op). */
export function claimDailyFreeCards(): boolean {
  const today = todayKey();
  if (useMarketStore.getState().lastDailyClaimAt === today) return false;
  addSummonCard(DAILY_FREE_SUMMON_CARDS);
  useMarketStore.setState({ lastDailyClaimAt: today });
  return true;
}

export function isDailyFreeClaimed(): boolean {
  return useMarketStore.getState().lastDailyClaimAt === todayKey();
}
