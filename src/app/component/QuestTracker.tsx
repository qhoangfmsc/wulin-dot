"use client";

import { QUESTS } from "@/modules/quest/data";
import { useQuestStore } from "@/modules/quest/store";
import type { QuestId } from "@/modules/quest/types";

/** Sits right below `PlayerStatusPanel` (via `GameHud`'s left-column
 * wrapper) so the player can see quest progress at a glance without opening
 * anything. Only lists quests currently `"active"`/`"ready_to_turn_in"` —
 * renders nothing at all once there's nothing to track (no empty box). */
export function QuestTracker() {
  const statusByQuest = useQuestStore((s) => s.statusByQuest);
  const progressByQuest = useQuestStore((s) => s.progressByQuest);

  const tracked = (Object.keys(QUESTS) as QuestId[]).filter(
    (id) => statusByQuest[id] === "active" || statusByQuest[id] === "ready_to_turn_in",
  );

  if (tracked.length === 0) return null;

  return (
    <div
      className="pointer-events-none w-64 rounded-2xl border-2 px-3 py-2.5 shadow-2xl backdrop-blur"
      style={{ borderColor: "#7a5230", background: "linear-gradient(160deg, rgba(42,32,20,0.92), rgba(20,15,10,0.92))" }}
    >
      <p className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#f2c66d]">Nhiệm Vụ</p>
      <div className="mt-1.5 flex flex-col gap-1.5">
        {tracked.map((id) => {
          const quest = QUESTS[id];
          const status = statusByQuest[id];
          const progress = progressByQuest[id] ?? 0;
          return (
            <div key={id} className="flex items-center justify-between gap-2">
              <span className="truncate text-[13px] text-[#e6d3ad]">{quest.title}</span>
              <span className="shrink-0 text-[12px] font-semibold tabular-nums text-[#f2c66d]">
                {status === "ready_to_turn_in" ? "Sẵn sàng trả!" : `${progress}/${quest.targetCount}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
