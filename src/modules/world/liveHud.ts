import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LiveHudState {
  hp: number;
  maxHp: number;
  /** Builds up from landing attacks, drains on its own after a few seconds
   * of not attacking — see `addRage()`. No spend mechanic yet. */
  rage: number;
  maxRage: number;
}

/** Runtime vitals for the LIVE exploration flow's HUD. `rage`/`maxRage`
 * reset every session on purpose (per-life). `hp` is PERSISTED though —
 * reloading/logging back in should resume at the HP you left off with, not
 * snap back to a hardcoded default (which used to visibly under-fill a
 * bigger-than-100 `maxHp`, e.g. panda's 150, until regen ticked it back up).
 * `maxHp` itself isn't persisted — it's not player state, just a derived
 * cache re-computed fresh every mount via `character/store.ts`'s
 * `syncMaxHpToLiveHud()` (which also clamps `hp` down if it's now above the
 * real max). Persistent LEVEL/exp/stat-point progression still lives in
 * `modules/character/store.ts`, not here — see that file for why they're
 * split. Also the bridge between Phaser (not React) and this store:
 * `mapScene.ts`/`monster.ts` call the action functions below directly via
 * `getState()`/`setState()`, since a Phaser scene can't use hooks. */
export const useLiveHudStore = create<LiveHudState>()(
  persist(
    (): LiveHudState => ({ hp: 100, maxHp: 100, rage: 0, maxRage: 100 }),
    { name: "wulin-live-hud", partialize: (s) => ({ hp: s.hp }) },
  ),
);

export function damagePlayer(amount: number) {
  useLiveHudStore.setState((s) => ({ hp: Math.max(0, s.hp - amount) }));
}

/** Full-heal — used on respawn after hitting 0 HP. */
export function respawnPlayer() {
  useLiveHudStore.setState((s) => ({ hp: s.maxHp }));
}

/** Passive regen tick (`mapScene.ts`: +1/s while alive) — clamps to
 * whatever `maxHp` currently is, never a hardcoded cap, so it stays correct
 * as `maxHp` changes (level up, stat point, equip). */
export function healPlayer(amount: number) {
  useLiveHudStore.setState((s) => ({ hp: Math.min(s.maxHp, s.hp + amount) }));
}

/** Changes the HP cap (leveling, spending a stat point, equipping a
 * different weapon) — clamps current `hp` down if it now exceeds the new
 * max. Call via `character/store.ts`'s `syncMaxHpToLiveHud()` rather than
 * computing the effective max by hand elsewhere. */
export function setMaxHp(value: number) {
  useLiveHudStore.setState((s) => ({ maxHp: value, hp: Math.min(s.hp, value) }));
}

/** Positive `delta` on landing an attack, negative to drain over time when
 * idle — either way, clamped to `[0, maxRage]`. Caller decides when/how
 * much (`mapScene.ts`: +10 per landed hit, drains after 5s of not
 * attacking) — this function only owns the clamp. */
export function addRage(delta: number) {
  useLiveHudStore.setState((s) => ({ rage: Math.max(0, Math.min(s.maxRage, s.rage + delta)) }));
}
