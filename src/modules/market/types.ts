import type { InventoryItem } from "@/modules/inventory/types";

/** A weapon sitting in Chợ Trời's stock — same shape as anything the player
 * can own, plus its asking price. */
export interface MarketListing extends InventoryItem {
  price: number;
}
