import type { WeaponTypeId } from "@/modules/inventory/types";

export type CharacterId = "dog" | "tiger" | "panda" ;

export interface CharacterConfig {
  id: CharacterId;
  name: string;
  /** In-map bust, same asset used by `Actor`. */
  spriteSrc: string;
  /** Weapon shown/thrown when no item is equipped from the inventory. */
  defaultWeaponId: WeaponTypeId;
  /** Stat baseline BEFORE level-up points/weapon bonus — differs per
   * character (see `data.ts`), unlike the old single global constant. */
  baseHp: number;
  baseAttack: number;
}
