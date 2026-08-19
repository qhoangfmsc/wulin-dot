"use client";

import { QUESTS } from "@/modules/quest/data";
import { useQuestStore } from "@/modules/quest/store";
import type { QuestId } from "@/modules/quest/types";

/** Sits right below `PlayerStatusPanel` (via `GameHud`'s left-column
 * wrapper) so the player can see quest progress at a glance without opening
 * anything. Only lists quests currently `"active"`/`"ready_to_turn_in"` —
 * renders nothing at all once there's nothing to track (no empty box).
 *
 * Each row is clickable and calls `onSelectQuest` to reopen the quest's
 * full detail — the actual modal (`QuestDetailModal`) is owned/rendered by
 * `GameHud`, NOT here: this component lives inside a `fixed left-4 top-4`
 * wrapper, which would break a `WuxiaModal`'s `absolute inset-0` full-
 * viewport sizing if nested this deep (see `QuestDetailModal.tsx`'s doc
 * comment). The hover card stays for a quick glance without a click. */
export function QuestTracker({ onSelectQuest }: { onSelectQuest: (id: QuestId) => void }) {
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
            <button
              key={id}
              type="button"
              onClick={() => onSelectQuest(id)}
              className="group/quest pointer-events-auto relative flex items-center justify-between gap-2 text-left"
            >
              <span className="truncate text-[13px] text-[#e6d3ad]">{quest.title}</span>
              <span className="shrink-0 text-[12px] font-semibold tabular-nums text-[#f2c66d]">
                {status === "ready_to_turn_in" ? "Sẵn sàng trả!" : `${progress}/${quest.targetCount}`}
              </span>

              {/* Opens to the RIGHT of the tracker (pinned to the screen's
               * left edge, no scrollable ancestor here) — full title +
               * `objectiveLabel` description, not just a 1-line label, so
               * this is a bespoke card rather than `WuxiaTooltip` (which
               * forces `whitespace-nowrap`, no room for a wrapped
               * description). */}
              <div
                className="pointer-events-none absolute left-full top-0 z-30 ml-2 w-56 rounded-xl border-2 px-3 py-2.5 opacity-0 shadow-2xl transition-opacity duration-100 group-hover/quest:opacity-100"
                style={{ borderColor: "#5c3a21", background: "linear-gradient(160deg, #f4e6c4, #d9bd83)" }}
              >
                <p className="text-[13px] font-bold text-[#3f2a16]">{quest.title}</p>
                <p className="mt-1 text-[12px] leading-snug text-[#5c3a21]">{quest.objectiveLabel}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
