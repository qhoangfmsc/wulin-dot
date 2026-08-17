import type { NpcId } from "@/modules/npc/types";
import type { InventoryItem } from "@/modules/inventory/types";

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
  /** Optional — most quests are just gold/exp, but some (VD Cụ Quy cho
   * mượn vũ khí) also grant a specific hand-authored item, not a random
   * roll. Granted via `addItem()` on turn-in, same as any other item. */
  rewardItem?: InventoryItem;
}
