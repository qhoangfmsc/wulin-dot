"use client";

import Image from "next/image";
import { useLiveHudStore } from "@/modules/world/liveHud";
import { getEffectiveStats, useCharacterStore } from "@/modules/character/store";
import { WuxiaTooltip } from "./WuxiaTooltip";

function VitalBar({ value, max, gradient }: { value: number; max: number; gradient: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-black/50 ring-1 ring-black/40">
        <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${pct}%`, background: gradient }} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-white/15" />
      </div>
      <span className="w-14 shrink-0 text-right text-[11px] font-semibold tabular-nums text-[#e6d3ad]">
        {value}/{max}
      </span>
    </div>
  );
}

/** Bottom-left HUD — avatar + Máu/Nộ bars only, kept deliberately gọn
 * (compact). The whole box is one button that opens the Nhân Vật hub
 * (`CharacterPanel`, opened via `onOpenCharacter`) — no separate icon
 * anymore. When `statPoints > 0` (just leveled up, or points still
 * unspent) a badge appears on the box itself so the player notices without
 * opening the panel. Every other feature lives on `ShelfNav` or next to the
 * minimap (`SummonQuickButton`), not here — see SKILL.md mục 1. */
export function PlayerStatusPanel({ onOpenCharacter }: { onOpenCharacter: () => void }) {
  const { hp, maxHp, rage, maxRage } = useLiveHudStore();
  const level = useCharacterStore((s) => s.level);
  const statPoints = useCharacterStore((s) => s.statPoints);
  const { characterSpriteSrc } = getEffectiveStats();

  return (
    <button
      type="button"
      aria-label="Nhân Vật"
      onClick={onOpenCharacter}
      className="group pointer-events-auto fixed bottom-4 left-4 z-20 flex items-center gap-2.5 rounded-2xl border-2 px-3 py-2.5 shadow-2xl backdrop-blur transition-transform hover:z-30 hover:scale-[1.02]"
      style={{ borderColor: "#7a5230", background: "linear-gradient(160deg, rgba(42,32,20,0.92), rgba(20,15,10,0.92))" }}
    >
      <WuxiaTooltip label="Nhân Vật" placement="top" />
      {statPoints > 0 && (
        <span
          className="absolute -right-2 -top-2 flex h-6 min-w-6 animate-pulse items-center justify-center rounded-full border px-1 text-xs font-bold shadow-lg"
          style={{ borderColor: "#7a1f1f", background: "#e0554f", color: "#fff" }}
        >
          +{statPoints}
        </span>
      )}
      <div
        className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 shadow-lg"
        style={{ borderColor: "#f2c66d", background: "radial-gradient(circle at 35% 30%, #f3e2bb, #d8bd8c)" }}
      >
        <Image src={characterSpriteSrc} alt="" fill className="object-contain p-1" />
        <span className="absolute inset-x-0 bottom-0 bg-black/70 text-center text-[10px] font-bold text-[#f2c66d]">LV{level}</span>
      </div>
      <div className="flex w-48 flex-col gap-1">
        <VitalBar value={hp} max={maxHp} gradient="linear-gradient(90deg, #7a1f1f, #e0554f)" />
        <VitalBar value={rage} max={maxRage} gradient="linear-gradient(90deg, #7a4a1f, #f2a13f)" />
      </div>
    </button>
  );
}
