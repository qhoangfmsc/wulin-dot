import type { QuestDef, QuestId } from "./types";

export const QUESTS: Record<QuestId, QuestDef> = {
  first_deer_hunt: {
    id: "first_deer_hunt",
    npcId: "turtle_guide",
    title: "Diệt 5 Nai Đột Biến",
    objectiveLabel: "Khám phá thế giới, tìm ra 5 con Nai bị bất ổn ở con đường phía trước và tiêu diệt chúng.",
    targetCount: 5,
    rewardExp: 1000,
    rewardCurrency: 2000,
  },
};
