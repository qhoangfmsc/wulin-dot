import type { UnlockableFeature } from "./types";

/** The ONLY place a gated feature's English key maps to its Vietnamese
 * display name — everything else (store, overlay logic) works with the
 * English `UnlockableFeature` value. */
export const UNLOCK_FEATURE_NAMES: Record<UnlockableFeature, string> = {
  summonStore: "Tiệm Triệu Hồi",
  market: "Chợ Trời",
};
