import type { NpcId } from "@/modules/npc/types";

/** Literal union, extend as new quests get added. */
export type QuestId = "first_deer_hunt";

export type QuestStatus = "not_started" | "active" | "ready_to_turn_in" | "completed";

/** A quest's objective is a plain "count up to a target" — covers most
 * quest shapes we're likely to want soon (diệt N, thu thập N, gặp N
 * người). Not a generic objective-type engine (escort, survey-the-area,
 * ...) — there's no second real example yet to know that shape correctly,
 * so this is deliberately left for later generalization once one shows up. */
export interface QuestDef {
  id: QuestId;
  npcId: NpcId;
  title: string;
  objectiveLabel: string;
  targetCount: number;
  rewardExp: number;
  rewardCurrency: number;
}
