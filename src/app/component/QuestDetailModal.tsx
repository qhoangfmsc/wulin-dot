"use client";

import { QUESTS } from "@/modules/quest/data";
import { useQuestStore } from "@/modules/quest/store";
import type { QuestId } from "@/modules/quest/types";
import { WuxiaModal } from "./WuxiaModal";
import { QuestRewardPreview } from "./QuestRewardPreview";

/** Reopens a tracked quest's full detail (title + objective + progress +
 * reward preview) when its `QuestTracker` row is clicked. Rendered at
 * `GameHud`'s top level (NOT inside `QuestTracker`'s own markup) — `QuestTracker`
 * sits inside a `fixed left-4 top-4` wrapper, which becomes a containing
 * block; a `WuxiaModal` (`absolute inset-0`) nested in there would resolve
 * against that small box instead of the viewport, same bug class as every
 * OTHER hub panel avoids by living directly under `GameHud`'s own
 * fragment. */
export function QuestDetailModal({ questId, onClose }: { questId: QuestId; onClose: () => void }) {
  const status = useQuestStore((s) => s.statusByQuest[questId]);
  const progress = useQuestStore((s) => s.progressByQuest[questId] ?? 0);
  const quest = QUESTS[questId];

  return (
    <WuxiaModal title="Nhiệm Vụ" onClose={onClose}>
      <p className="text-[20px] font-bold text-[#3f2a16]">{quest.title}</p>
      <p className="mt-2 text-[16px] text-[#5c3a21]">{quest.objectiveLabel}</p>
      <p className="mt-2 text-[14px] font-semibold text-[#8a6a3f]">
        Tiến độ: {status === "ready_to_turn_in" ? "Sẵn sàng trả!" : `${progress}/${quest.targetCount}`}
      </p>
      <QuestRewardPreview quest={quest} />
    </WuxiaModal>
  );
}
