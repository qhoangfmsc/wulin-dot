import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SKILL_TREE_BY_ID } from "./data";

interface SkillsState {
  learnedSkillIds: string[];
}

/** Which skills are learned — persisted. Learning doesn't grant any real
 * gameplay bonus yet (see SKILL.md, "chưa mở hệ thống môn phái"), but the
 * gate (level + prerequisites) and the persisted progress are real. */
export const useSkillsStore = create<SkillsState>()(
  persist((): SkillsState => ({ learnedSkillIds: [] }), { name: "wulin-skills" }),
);

export interface LearnEligibility {
  eligible: boolean;
  /** Vietnamese, human-readable — shown next to a disabled "Học" button.
   * Undefined when `eligible` is true. */
  reason?: string;
}

/** Single source of truth for "can this skill be learned right now" —
 * `SkillsPanel` uses this both to disable the "Học" button and to explain
 * why (already learned / level too low / prerequisite missing). */
export function getLearnEligibility(skillId: string, characterLevel: number, learnedSkillIds: string[]): LearnEligibility {
  const node = SKILL_TREE_BY_ID[skillId];
  if (learnedSkillIds.includes(skillId)) return { eligible: false, reason: "Đã học" };
  if (characterLevel < node.requiredLevel) return { eligible: false, reason: `Cần đạt cấp ${node.requiredLevel}` };
  const missingPrereqId = node.prerequisiteIds.find((id) => !learnedSkillIds.includes(id));
  if (missingPrereqId) return { eligible: false, reason: `Cần học "${SKILL_TREE_BY_ID[missingPrereqId].name}" trước` };
  return { eligible: true };
}

export function learnSkill(skillId: string, characterLevel: number) {
  const { learnedSkillIds } = useSkillsStore.getState();
  if (!getLearnEligibility(skillId, characterLevel, learnedSkillIds).eligible) return;
  useSkillsStore.setState({ learnedSkillIds: [...learnedSkillIds, skillId] });
}
