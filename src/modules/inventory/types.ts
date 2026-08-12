import type { StatBlock } from "@/modules/stats/types";

export type ItemRarity = "common" | "rare" | "epic" | "legendary";
export type EquipSlot = "weapon" | "armor" | "accessory";

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  rarity: ItemRarity;
  icon: string; // lucide-react icon name
  quantity: number;
  /** Present only on equippable items — which of the 3 slots it goes in. */
  slot?: EquipSlot;
  /** Flat bonus applied on top of base stats while equipped. */
  statBonus?: Partial<StatBlock>;
}
