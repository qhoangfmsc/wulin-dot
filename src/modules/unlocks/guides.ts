import type { UnlockableFeature } from "./types";

export interface FeatureGuide {
  name: string;
  description: string;
  /** Carousel images, in display order — real screenshots/art aren't
   * available yet for most of these, so this leans on existing icons +
   * weapon-display sprites already shipped elsewhere in the app rather
   * than inventing new art. Prefer showing the THING (icon/sprite) over
   * describing it in prose — see SKILL.md mục 2's "hạn chế dùng từ ngữ
   * mang tính value" rule. */
  images: string[];
}

/** The ONE content file driving the "vừa mở khoá" onboarding tour
 * (`FeatureUnlockOverlay.tsx` + `ImageCarousel.tsx`) — name/description/
 * carousel per feature, kept separate from `data.ts`'s bare
 * `UNLOCK_FEATURE_NAMES` map since this is richer guide CONTENT, not a
 * lookup table. `Partial` on purpose: `bag` is the only feature with a
 * REAL unlock trigger today (`first_deer_hunt`, see `MapScreen.tsx`).
 * `summonStore`/`market` keep an entry here even though nothing currently
 * calls `unlockFeature` for them (đợt 15 — unhooked from `first_deer_hunt`
 * on purpose, saved for a later trigger, see `types.ts`) since the guide
 * content is still correct whenever that trigger lands; `skills`/`pet`/
 * `mount`/`friends` don't have an entry at all — add one the same day a
 * real trigger is wired up for them, not before. */
export const FEATURE_GUIDES: Partial<Record<UnlockableFeature, FeatureGuide>> = {
  bag: {
    name: "Túi Đồ",
    description:
      "Nơi cất mọi thứ nhặt được trên đường giang hồ. Vào đây để xem tài sản đang có, lướt qua từng món vũ khí đã sở hữu, rồi trang bị món hợp nhất trước khi đối đầu quái hoặc trùm phía trước.",
    images: ["/icon/bag.png", "/icon/coins.png", "/icon/summon_card.png", "/weapon-display/vlr_primevandal.png"],
  },
  summonStore: {
    name: "Tiệm Triệu Hồi",
    description:
      "Dùng Thẻ Triệu Hồi để ra vũ khí ngẫu nhiên — phẩm chất từ Thường đến Huyền Thoại. Triệu hồi càng nhiều, Tiệm càng lên cấp, tỉ lệ ra đồ hiếm càng cao.",
    images: ["/icon/summon_store.png", "/icon/summon_card.png", "/weapon-display/dress_shoe.png", "/weapon-display/vlr_primevandal.png"],
  },
  market: {
    name: "Chợ Trời",
    description:
      "Chợ mua bán vũ khí giữa các cao thủ. Mua món ưng ý, bán bớt món dư, hoặc ghé mỗi ngày để nhận vài Thẻ Triệu Hồi miễn phí.",
    images: ["/icon/market.png", "/icon/coins.png", "/icon/summon_card.png"],
  },
};
