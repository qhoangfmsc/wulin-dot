import { create } from "zustand";
import { persist } from "zustand/middleware";
import { announceUnlock } from "./announcement";
import type { UnlockableFeature } from "./types";

interface UnlockState {
  unlocked: Record<UnlockableFeature, boolean>;
}

const DEFAULT_UNLOCKED: Record<UnlockableFeature, boolean> = {
  bag: false,
  summonStore: false,
  market: false,
  skills: false,
  pet: false,
  mount: false,
  friends: false,
};

/** Which gated features (Tiệm Triệu Hồi, Chợ Trời, ...) this player has
 * unlocked — everything starts locked. Persisted the same way as
 * `settings/store.ts`. Custom `merge` (rather than the default shallow
 * `{...current, ...persisted}`) because `unlocked` is a NESTED object —
 * a shallow merge would replace it wholesale with whatever was persisted
 * before `skills`/`pet`/`mount`/`friends` existed, silently dropping those
 * keys (`undefined` is falsy so nothing crashes, but it's not correct). */
export const useUnlockStore = create<UnlockState>()(
  persist(
    (): UnlockState => ({ unlocked: DEFAULT_UNLOCKED }),
    {
      name: "wulin-unlocks",
      merge: (persisted, current) => ({
        ...current,
        unlocked: { ...current.unlocked, ...(persisted as Partial<UnlockState> | null)?.unlocked },
      }),
    },
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
