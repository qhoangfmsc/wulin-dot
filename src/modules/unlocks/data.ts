import type { UnlockableFeature } from "./types";

/** The ONLY place a gated feature's English key maps to its Vietnamese
 * display name — everything else (store, overlay logic) works with the
 * English `UnlockableFeature` value. */
export const UNLOCK_FEATURE_NAMES: Record<UnlockableFeature, string> = {
  bag: "Túi Đồ",
  summonStore: "Tiệm Triệu Hồi",
  market: "Chợ Trời",
  skills: "Kỹ Năng",
  pet: "Thú Cưng",
  mount: "Thú Cưỡi",
  friends: "Bạn Bè",
};

/** Shown wherever a locked feature's trigger button/tooltip needs a nicer
 * line than a bare feature name — same wording everywhere so it reads as
 * one consistent system rather than ad hoc "chưa mở" copy per button. */
export const LOCKED_FEATURE_HINT = "Tiếp tục khám phá để mở khoá tính năng này";
