"use client";

import Image from "next/image";
import type { QuestDef } from "@/modules/quest/types";
import { WEAPON_TYPES } from "@/modules/inventory/data";
import { RARITY_CONFIG } from "@/modules/summon/data";

/** Shared "what you'll get" row — used by `QuestOfferModal` (before
 * accepting) and `QuestTracker`'s click-to-reopen detail card (while
 * active), so the reward preview reads identically in both places. Always
 * shows EXP + Bạc; `rewardItem` (VD Cụ Quy's vũ khí cho mượn) only renders
 * when the quest actually has one — reuses `BagPanel.tsx`'s icon+rarity-
 * border item-slot look rather than inventing a new one. */
export function QuestRewardPreview({ quest }: { quest: QuestDef }) {
  const item = quest.rewardItem;
  const weapon = item ? WEAPON_TYPES[item.weaponTypeId] : null;
  const rarity = item ? RARITY_CONFIG[item.rarity] : null;

  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#8a6a3f]">Phần Thưởng</p>
      <div className="mt-1.5 flex items-center gap-2">
        <span
          className="rounded-lg border-2 px-2.5 py-1 text-[13px] font-bold text-[#3f2a16]"
          style={{ borderColor: "#7a523066", background: "rgba(255,255,255,0.2)" }}
        >
          +{quest.rewardExp} EXP
        </span>
        <span
          className="flex items-center gap-1 rounded-lg border-2 px-2.5 py-1 text-[13px] font-bold text-[#3f2a16]"
          style={{ borderColor: "#7a523066", background: "rgba(255,255,255,0.2)" }}
        >
          <span className="relative h-4 w-4">
            <Image src="/icon/coins.png" alt="" fill className="object-contain" />
          </span>
          {quest.rewardCurrency}
        </span>
        {weapon && rarity && (
          <span
            className="flex items-center gap-1.5 rounded-lg border-2 py-1 pl-1 pr-2.5 text-[13px] font-bold"
            style={{ borderColor: rarity.color, background: "rgba(255,255,255,0.2)", color: "#3f2a16" }}
          >
            <span className="relative h-6 w-6 shrink-0">
              <Image src={weapon.spriteSrc} alt="" fill className="object-contain" />
            </span>
            {weapon.name}
          </span>
        )}
      </div>
    </div>
  );
}
