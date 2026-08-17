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

export function clearAnnouncement() {
  useUnlockAnnouncementStore.setState({ pending: [] });
}
