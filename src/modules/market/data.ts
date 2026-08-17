/** How many listings sit in stock at once. */
export const STOCK_SIZE = 6;

/** Placeholder tuning numbers — easy to retune later, all in one place. */
export const RESET_STOCK_COST = 200;
export const SUMMON_CARD_BUY_PRICE = 100;
export const DAILY_FREE_SUMMON_CARDS = 3;

/** Sell price = `BASE_SELL_PRICE * rarity multiplier * item level` — a
 * fraction of what buying the equivalent would cost, same spirit as any
 * shop's buy/sell spread. */
export const BASE_SELL_PRICE = 15;

/** Stock listing prices scale off the same rarity multiplier as sell price,
 * just bigger (buying costs more than selling gives back). */
export const BASE_LISTING_PRICE = 60;
