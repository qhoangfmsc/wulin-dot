import type { CharacterConfig, CharacterId } from "./types";

/** Real, permanent playable characters — add an entry here (+ art in
 * `public/character/player/`) to make a new one selectable, no other code
 * changes needed. Each has its own `baseHp`/`baseAttack` (flavor: tanky
 * animals hit softer but soak more, glass-cannon ones hit harder but soak
 * less) — level-up points and equipped weapon bonus stack on TOP of
 * whichever character is currently active, see `store.ts`'s
 * `getEffectiveStats()`. `zombie.png`/`deer_injured.png` in that same
 * folder are deliberately NOT here — `zombie` is monster art (see
 * `modules/world/maps`), `deer_injured` is a hurt-state variant of `deer`,
 * neither is a distinct playable character. */
export const CHARACTERS: Record<CharacterId, CharacterConfig> = {
  dog: { id: "dog", name: "Cẩu Nhi", spriteSrc: "/character/player/dog.png", defaultWeaponId: "dress_shoe", baseHp: 100, baseAttack: 20 },
  tiger: { id: "tiger", name: "Hổ Nhi", spriteSrc: "/character/player/tiger.png", defaultWeaponId: "dress_shoe", baseHp: 95, baseAttack: 25 },
  panda: { id: "panda", name: "Gấu Trúc", spriteSrc: "/character/player/panda.png", defaultWeaponId: "dress_shoe", baseHp: 150, baseAttack: 12 },
};

export const CHARACTER_IDS = Object.keys(CHARACTERS) as CharacterId[];

export const STAT_POINTS_PER_LEVEL = 2;
