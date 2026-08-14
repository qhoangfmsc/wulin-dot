import type { DialogueLine } from "@/modules/world/maps";
import type { QuestId } from "@/modules/quest/types";

/** Literal union, extend as new NPCs get added. */
export type NpcId = "turtle_guide";

/** An NPC's static identity + dialogue for every quest-interaction phase.
 * `questIds` is a LIST (not a single quest) so this NPC can hand out a
 * second/third quest later without changing the shape — see the
 * "Nghĩ thêm cho tương lai" note in the plan this was built from. */
export interface NpcConfig {
  name: string;
  spriteSrc: string;
  portraitSrc: string;
  questIds: QuestId[];
  /** First-ever meeting — leads into the quest-offer modal once done. */
  introLines: DialogueLine[];
  /** Quest already accepted, not finished yet. */
  activeLines: DialogueLine[];
  /** Quest finished, not turned in yet — turning it in (reward + status
   * flip to `"completed"`) happens automatically once this dialogue ends. */
  turnInLines: DialogueLine[];
  /** Every quest this NPC has is `"completed"` (or it has none). */
  doneLines: DialogueLine[];
}

/** An NPC placed in a room via `MapModule.npcsByCell` (see
 * `world/maps/types.ts`) — position/sprite only, no runtime state. */
export interface NpcSpawnConfig {
  xFrac: number;
  yFrac: number;
  npcId: NpcId;
  displaySize?: number;
  /** How close the player must be to interact (press Space). Defaults to
   * `DEFAULT_TALK_RADIUS` in `npc.ts` if omitted. */
  talkRadius?: number;
}
