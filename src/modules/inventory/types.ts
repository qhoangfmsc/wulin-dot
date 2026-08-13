import type { Rarity } from "@/modules/summon/types";

export type WeaponTypeId = "dress_shoe" | "flip_flop";

export interface WeaponTypeConfig {
  id: WeaponTypeId;
  name: string;
  /** Thrown-projectile art, shown in `AttackConfig.weaponTextureKey` and in
   * the character panel's weapon list — not a held-in-hand sprite. */
  spriteSrc: string;
}

/** A weapon obtained by summoning (see `modules/summon/`) — `level`,
 * `rarity`, and `statBonus` are rolled once at summon time and never change
 * afterward. */
export interface InventoryItem {
  id: string;
  weaponTypeId: WeaponTypeId;
  level: number;
  rarity: Rarity;
  statBonus: { hp?: number; attack?: number };
}
