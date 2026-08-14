import type { WeaponTypeConfig, WeaponTypeId } from "./types";

/** Real, permanent weapon types — add a new entry here (+ its
 * weapon-display art) to make it droppable/equippable, no other code
 * changes needed. */
export const WEAPON_TYPES: Record<WeaponTypeId, WeaponTypeConfig> = {
  dress_shoe: { id: "dress_shoe", name: "Giày Da", spriteSrc: "/weapon-display/dress_shoe.png" },
  flip_flop: { id: "flip_flop", name: "Dép Lê", spriteSrc: "/weapon-display/flip_flop.png" },
  car_toy: { id: "car_toy", name: "Ô tô chơi", spriteSrc: "/weapon-display/car_toy.png" },
  chicken_pop: { id: "chicken_pop", name: "Gà Pop", spriteSrc: "/weapon-display/chicken_pop.png" },
  cow_meme: { id: "cow_meme", name: "Bò Meme", spriteSrc: "/weapon-display/cow_meme.png" },
  duck: { id: "duck", name: "Vịt", spriteSrc: "/weapon-display/duck.png" },
  fish_stick: { id: "fish_stick", name: "Gậy Cá", spriteSrc: "/weapon-display/fish_stick.png" },
  monsterinc_mike: { id: "monsterinc_mike", name: "Mike", spriteSrc: "/weapon-display/monsterinc_mike.png" },
  mouth_stick: { id: "mouth_stick", name: "Gậy Mồm", spriteSrc: "/weapon-display/mouth_stick.png" },
  pubg_helmet: { id: "pubg_helmet", name: "Mũ PUBG", spriteSrc: "/weapon-display/pubg_helmet.png" },
  pvz_chili: { id: "pvz_chili", name: "Chili Peppers", spriteSrc: "/weapon-display/pvz_chili.png" },
  pvz_peashoot: { id: "pvz_peashoot", name: "Peashoot", spriteSrc: "/weapon-display/pvz_peashoot.png" },
  pvz_sunflower: { id: "pvz_sunflower", name: "Sunflower", spriteSrc: "/weapon-display/pvz_sunflower.png" },
  pvz_zombie: { id: "pvz_zombie", name: "Zombie", spriteSrc: "/weapon-display/pvz_zombie.png" },
  toystory_buzzlightyear  : { id: "toystory_buzzlightyear", name: "Buzz Lightyear", spriteSrc: "/weapon-display/toystory_buzzlightyear.png" },
  vlr_primevandal: { id: "vlr_primevandal", name: "Dép Lê", spriteSrc: "/weapon-display/vlr_primevandal.png" },
};

export const WEAPON_TYPE_IDS = Object.keys(WEAPON_TYPES) as WeaponTypeId[];
