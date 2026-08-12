import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlayerCharacter } from "./types";

interface CharacterStoreState {
  character: PlayerCharacter | null;
  setCharacter: (character: PlayerCharacter) => void;
  resetCharacter: () => void;
}

export const useCharacterStore = create<CharacterStoreState>()(
  persist(
    (set) => ({
      character: null,
      setCharacter: (character) => set({ character }),
      resetCharacter: () => set({ character: null }),
    }),
    { name: "wulin-character" },
  ),
);
