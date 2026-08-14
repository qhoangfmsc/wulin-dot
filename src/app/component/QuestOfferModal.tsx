"use client";

import type { QuestDef } from "@/modules/quest/types";
import { WuxiaModal } from "./WuxiaModal";

/** Confirm-or-decline prompt shown after an NPC's intro dialogue finishes —
 * see `MapScreen.tsx`'s `handleNpcDialogueDone`. Declining just closes it;
 * the quest stays `"not_started"` (no separate "declined" state — talking
 * to the NPC again asks the same thing from scratch). */
export function QuestOfferModal({
  quest,
  onAccept,
  onDecline,
}: {
  quest: QuestDef;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <WuxiaModal title="Nhiệm Vụ Mới" onClose={onDecline}>
      <p className="text-[20px] font-bold text-[#3f2a16]">{quest.title}</p>
      <p className="mt-2 text-[16px] text-[#5c3a21]">{quest.objectiveLabel}</p>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={onDecline}
          className="flex-1 rounded-xl border-2 px-4 py-2.5 text-[16px] font-bold transition-transform hover:scale-[1.02]"
          style={{ borderColor: "#7a523066", color: "#5c3a21", background: "rgba(255,255,255,0.15)" }}
        >
          Để Sau
        </button>
        <button
          type="button"
          onClick={onAccept}
          className="flex-1 rounded-xl border-2 px-4 py-2.5 text-[16px] font-bold text-[#3a2c1a] shadow-lg transition-transform hover:scale-[1.02]"
          style={{ borderColor: "#b8892f", background: "linear-gradient(160deg, #f2c66d, #d9a441)" }}
        >
          Nhận Nhiệm Vụ
        </button>
      </div>
    </WuxiaModal>
  );
}
