import { create } from "zustand";
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  type AbilityCooldownState,
  type WorldBlip,
  type WorldPlayerState,
} from "./types";

/** Runtime-only (never persisted) world state. The Phaser scene writes to
 * this directly every frame (throttled); React reads it for the radar/HUD.
 * `paused` is read-write from both sides: the scene toggles it on the `P`
 * keydown, the pause overlay's "Resume" button toggles it back — the scene
 * subscribes to the store so either trigger pauses/resumes its tweens too. */
interface WorldStoreState {
  player: WorldPlayerState;
  blips: WorldBlip[];
  cooldowns: Record<string, AbilityCooldownState>;
  paused: boolean;
  setPlayer: (player: WorldPlayerState) => void;
  setBlips: (blips: WorldBlip[]) => void;
  setCooldowns: (cooldowns: Record<string, AbilityCooldownState>) => void;
  setPaused: (paused: boolean) => void;
}

export const useWorldStore = create<WorldStoreState>((set) => ({
  player: {
    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,
    angle: 0,
    isMoving: false,
    hp: 0,
    maxHp: 0,
    level: 1,
    exp: 0,
    expToNext: 20,
  },
  blips: [],
  cooldowns: {},
  paused: false,
  setPlayer: (player) => set({ player }),
  setBlips: (blips) => set({ blips }),
  setCooldowns: (cooldowns) => set({ cooldowns }),
  setPaused: (paused) => set({ paused }),
}));
