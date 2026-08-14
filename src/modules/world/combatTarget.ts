import { create } from "zustand";

interface CombatTargetState {
  active: boolean;
  hp: number;
  maxHp: number;
  spriteSrc: string | null;
}

/** Whichever monster is currently nearest-in-range of the player's
 * auto-attack (`mapScene.ts`'s `findNearestAliveMonsterInRange()`) — drives
 * `MonsterTargetHud.tsx`. PER-LIFE runtime, not persisted, same spirit as
 * `liveHud.ts`. Also the bridge between Phaser and this store: `mapScene.ts`
 * calls the functions below directly via `setState()`, since a Phaser scene
 * can't use hooks. */
export const useCombatTargetStore = create<CombatTargetState>(() => ({
  active: false,
  hp: 0,
  maxHp: 0,
  spriteSrc: null,
}));

export function setCombatTarget(hp: number, maxHp: number, spriteSrc: string) {
  useCombatTargetStore.setState({ active: true, hp, maxHp, spriteSrc });
}

export function clearCombatTarget() {
  useCombatTargetStore.setState((s) => (s.active ? { active: false } : s));
}
