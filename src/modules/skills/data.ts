import type { SkillNode } from "./types";

/** Hand-authored skill tree — no real gameplay effect from learning yet
 * (see SKILL.md), but the LEARN flow itself is real: level gate +
 * prerequisite gate + persisted progress (`store.ts`). Add a node here to
 * grow the tree, no other code changes needed — `SkillsPanel` lays out
 * purely from `tier`/`prerequisiteIds`, nothing hardcoded per-node in the
 * component. */
export const SKILL_TREE: SkillNode[] = [
  { id: "iron_fist", name: "Thiết Quyền", description: "Rèn luyện nắm đấm cứng như sắt.", requiredLevel: 1, tier: 0, prerequisiteIds: [] },
  { id: "swift_step", name: "Khinh Công", description: "Bước chân nhẹ nhàng, di chuyển như gió thoảng.", requiredLevel: 1, tier: 0, prerequisiteIds: [] },
  {
    id: "iron_body",
    name: "Kim Cang Thân",
    description: "Luyện thân thể cứng như kim cương, chịu đòn tốt hơn.",
    requiredLevel: 5,
    tier: 1,
    prerequisiteIds: ["iron_fist"],
  },
  {
    id: "phantom_strike",
    name: "Ảo Ảnh Chưởng",
    description: "Ra đòn nhanh tới mức đối phương không kịp nhìn thấy.",
    requiredLevel: 5,
    tier: 1,
    prerequisiteIds: ["swift_step"],
  },
  {
    id: "dragon_roar",
    name: "Long Ngâm Công",
    description: "Tuyệt kỹ hợp nhất sức mạnh và tốc độ, chỉ cao thủ mới luyện được.",
    requiredLevel: 12,
    tier: 2,
    prerequisiteIds: ["iron_body", "phantom_strike"],
  },
];

export const SKILL_TREE_BY_ID: Record<string, SkillNode> = Object.fromEntries(SKILL_TREE.map((s) => [s.id, s]));

export const SKILL_TIERS = Array.from(new Set(SKILL_TREE.map((s) => s.tier))).sort((a, b) => a - b);
