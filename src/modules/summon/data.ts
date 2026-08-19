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
 * base weight from `RARITY_WEIGHTS` below, keyed the same way).
 *
 * `.color` is used as TEXT color in several places (`ItemDetailCard.tsx`,
 * `SummonRatesModal.tsx`, `MarketPanel.tsx`, `SummonPanel.tsx`'s result
 * card), always against this app's light parchment `WuxiaModal` background
 * (`#f4e6c4`→`#d9bd83` gradient) — pick colors with real contrast against
 * THAT, not against the dark HUD boxes. `legendary` used to be `#f2c66d`
 * (a light gold), which sat almost exactly at the same lightness as the
 * parchment itself and was reported unreadable everywhere — replaced with
 * `#b8892f`, a darker/richer gold already proven legible as plain text on
 * this exact parchment elsewhere in the app (VD `SkillsPanel.tsx`'s
 * prerequisite label). */
export const RARITY_CONFIG: Record<Rarity, RarityConfig> = {
  common: { name: "Thường", color: "#9ca3af", statMultiplier: 1 },
  rare: { name: "Hiếm", color: "#60a5fa", statMultiplier: 1.5 },
  epic: { name: "Sử Thi", color: "#a855f7", statMultiplier: 2.5 },
  legendary: { name: "Huyền Thoại", color: "#b8892f", statMultiplier: 4 },
};

export const RARITY_IDS = Object.keys(RARITY_CONFIG) as Rarity[];

/** Bạc cost per Thẻ Triệu Hồi bought directly in `SummonPanel.tsx` (via
 * `BuySummonCardsModal.tsx`) — moved here from `modules/market/` at đợt
 * 19, since the buy-cards action now lives entirely in the Summon Store's
 * own UI, not Chợ Trời's. Placeholder tuning number, easy to retune. */
export const SUMMON_CARD_BUY_PRICE = 200;
