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
    // Cụ Quy cho mượn — số liệu thử nghiệm, dễ chỉnh sau.
    rewardItem: {
      id: "quest_reward_vlr_primevandal",
      weaponTypeId: "vlr_primevandal",
      level: 1,
      rarity: "legendary",
      statBonus: { attack: 150, hp: 400 },
    },
  },
};
