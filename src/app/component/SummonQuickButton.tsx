"use client";

import Image from "next/image";
import { useInventoryStore } from "@/modules/inventory/store";
import { WuxiaTooltip } from "./WuxiaTooltip";

const INK_BORDER = "#5c3a21";

/** Tiệm Triệu Hồi shortcut, stacked right above `GridMinimap` — Triệu Hồi
 * is frequent enough combat-loop traffic (spend cards right after a drop)
 * that it doesn't belong buried in the Nhân Vật hub, see SKILL.md mục 1.
 * No `overflow-hidden` on the button — the count badge is positioned past
 * its edge (`-right-1 -top-1`); `object-contain` on the icon never bleeds
 * outside its own box, so nothing actually needed clipping here. */
export function SummonQuickButton({ onOpen }: { onOpen: () => void }) {
  const summonCards = useInventoryStore((s) => s.summonCards);

  return (
    <button
      type="button"
      aria-label="Tiệm Triệu Hồi"
      onClick={onOpen}
      className="group pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-xl border-2 shadow-xl transition-transform hover:z-30 hover:scale-105"
      style={{ borderColor: INK_BORDER, background: "linear-gradient(160deg, #4a3820, #2c2013)" }}
    >
      <WuxiaTooltip label="Tiệm Triệu Hồi" placement="bottom" />
      <div className="relative h-10 w-10">
        <Image src="/icon/summon_store.png" alt="" fill className="object-contain" />
      </div>
      {summonCards > 0 && (
        <span
          className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border px-1 text-[11px] font-bold"
          style={{ borderColor: "#5a2f6a", background: "#a855f7", color: "#fff" }}
        >
          {summonCards}
        </span>
      )}
    </button>
  );
}
