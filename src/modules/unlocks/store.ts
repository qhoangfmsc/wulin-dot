import { create } from "zustand";
import { persist } from "zustand/middleware";
import { announceUnlock } from "./announcement";
import type { UnlockableFeature } from "./types";

interface UnlockState {
  unlocked: Record<UnlockableFeature, boolean>;
}

/** Which gated features (Tiệm Triệu Hồi, Chợ Trời, ...) this player has
 * unlocked — everything starts locked. Persisted the same way as
 * `settings/store.ts`. */
export const useUnlockStore = create<UnlockState>()(
  persist(
    (): UnlockState => ({ unlocked: { summonStore: false, market: false } }),
    { name: "wulin-unlocks" },
  ),
);

export function isFeatureUnlocked(feature: UnlockableFeature): boolean {
  return useUnlockStore.getState().unlocked[feature];
}

/** Idempotent — a feature already unlocked stays silently unlocked (no
 * re-triggering the celebration overlay every time this gets called). */
export function unlockFeature(feature: UnlockableFeature) {
  if (isFeatureUnlocked(feature)) return;
  useUnlockStore.setState((s) => ({ unlocked: { ...s.unlocked, [feature]: true } }));
  announceUnlock(feature);
}
