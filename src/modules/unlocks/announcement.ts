import { create } from "zustand";
import type { UnlockableFeature } from "./types";

interface UnlockAnnouncementState {
  pending: UnlockableFeature[];
}

/** Transient "just unlocked, show the celebration overlay" signal —
 * deliberately NOT persisted (unlike `store.ts`'s actual `unlocked` flags):
 * if the page reloads before the player dismisses it, losing the queued
 * announcement is a fine trade for not having a stale "unlocked!" overlay
 * resurrect itself on every future load. */
export const useUnlockAnnouncementStore = create<UnlockAnnouncementState>(() => ({
  pending: [],
}));

export function announceUnlock(feature: UnlockableFeature) {
  useUnlockAnnouncementStore.setState((s) => ({ pending: [...s.pending, feature] }));
}

/** Advances past `pending[0]` — used by `FeatureUnlockOverlay.tsx` when the
 * player dismisses the CURRENT feature's guide card, so unlocking SEVERAL
 * features at once (only `bag` triggers today via `first_deer_hunt`, see
 * `MapScreen.tsx` — but nothing stops a future quest from calling
 * `unlockFeature` more than once) would tour them one at a time instead of
 * dumping every name into a single card. */
export function dismissCurrentAnnouncement() {
  useUnlockAnnouncementStore.setState((s) => ({ pending: s.pending.slice(1) }));
}
