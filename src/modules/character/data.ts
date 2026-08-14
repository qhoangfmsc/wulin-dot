import type { CharacterConfig, CharacterId } from "./types";

/** Real, permanent playable characters — add an entry here (+ art in
 * `public/character/ingame/`) to make a new one selectable, no other code
 * changes needed. Each has its own `baseHp`/`baseAttack` (flavor: tanky
 * animals hit softer but soak more, glass-cannon ones hit harder but soak
 * less) — level-up points and equipped weapon bonus stack on TOP of
 * whichever character is currently active, see `store.ts`'s
 * `getEffectiveStats()`. `zombie.png`/`deer_injured.png` in that same
 * folder are deliberately NOT here — `zombie` is monster art (see
 * `modules/world/maps`), `deer_injured` is a hurt-state variant of `deer`,
 * neither is a distinct playable character. */
export const CHARACTERS: Record<CharacterId, CharacterConfig> = {
  dog: { id: "dog", name: "Cẩu Nhi", spriteSrc: "/character/ingame/dog.png", defaultWeaponId: "dress_shoe", baseHp: 100, baseAttack: 20 },
  turtle: { id: "turtle", name: "Quy Nhi", spriteSrc: "/character/ingame/turtle.png", defaultWeaponId: "dress_shoe", baseHp: 160, baseAttack: 15 },
  deer: { id: "deer", name: "Lộc Nhi", spriteSrc: "/character/ingame/deer.png", defaultWeaponId: "dress_shoe", baseHp: 90, baseAttack: 30 },
  tiger: { id: "tiger", name: "Hổ Nhi", spriteSrc: "/character/ingame/tiger.png", defaultWeaponId: "dress_shoe", baseHp: 95, baseAttack: 25 },
  dragon: { id: "dragon", name: "Long Nhi", spriteSrc: "/character/ingame/dragon.png", defaultWeaponId: "dress_shoe", baseHp: 120, baseAttack: 16 },
  panda: { id: "panda", name: "Gấu Trúc", spriteSrc: "/character/ingame/panda.png", defaultWeaponId: "dress_shoe", baseHp: 150, baseAttack: 12 },
  crane: { id: "crane", name: "Hạc Nhi", spriteSrc: "/character/ingame/crane.png", defaultWeaponId: "dress_shoe", baseHp: 70, baseAttack: 50 },
};

export const CHARACTER_IDS = Object.keys(CHARACTERS) as CharacterId[];

export const STAT_POINTS_PER_LEVEL = 2;
