import { create } from "zustand";

interface LiveHudState {
  level: number;
  exp: number;
  expToNext: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  rage: number;
  maxRage: number;
}

/** Level/exp/vitals for the LIVE exploration flow's HUD — deliberately
 * separate from the dormant `useWorldStore` (that one belongs to the wave
 * combat scene, which isn't wired into this flow yet). Nothing increments
 * this today; it exists so the HUD is real and readable, ready for when
 * exploration/combat actually grants experience or spends HP/Mana/Rage. */
export const useLiveHudStore = create<LiveHudState>(() => ({
  level: 1,
  exp: 0,
  expToNext: 100,
  hp: 100,
  maxHp: 100,
  mana: 70,
  maxMana: 100,
  rage: 0,
  maxRage: 100,
}));
