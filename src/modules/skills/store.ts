import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SkillStoreState {
  unlockedSkillIds: string[];
  skillPoints: number;
  initSkills: (passiveSkillId: string) => void;
  unlockSkill: (nodeId: string, cost: number) => void;
  addSkillPoints: (amount: number) => void;
  resetSkills: () => void;
}

export const useSkillStore = create<SkillStoreState>()(
  persist(
    (set, get) => ({
      unlockedSkillIds: [],
      skillPoints: 0,
      initSkills: (passiveSkillId) =>
        set({ unlockedSkillIds: [passiveSkillId], skillPoints: 0 }),
      unlockSkill: (nodeId, cost) => {
        const { unlockedSkillIds, skillPoints } = get();
        if (unlockedSkillIds.includes(nodeId) || skillPoints < cost) return;
        set({
          unlockedSkillIds: [...unlockedSkillIds, nodeId],
          skillPoints: skillPoints - cost,
        });
      },
      addSkillPoints: (amount) => set({ skillPoints: get().skillPoints + amount }),
      resetSkills: () => set({ unlockedSkillIds: [], skillPoints: 0 }),
    }),
    { name: "wulin-skills" },
  ),
);
