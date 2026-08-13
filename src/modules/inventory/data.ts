import type { WeaponTypeConfig, WeaponTypeId } from "./types";

/** Real, permanent weapon types — add a new entry here (+ its
 * weapon-display art) to make it droppable/equippable, no other code
 * changes needed. */
export const WEAPON_TYPES: Record<WeaponTypeId, WeaponTypeConfig> = {
  dress_shoe: { id: "dress_shoe", name: "Giày Da", spriteSrc: "/weapon-display/dress_shoe.png" },
  flip_flop: { id: "flip_flop", name: "Dép Lê", spriteSrc: "/weapon-display/flip_flop.png" },
};

export const WEAPON_TYPE_IDS = Object.keys(WEAPON_TYPES) as WeaponTypeId[];
