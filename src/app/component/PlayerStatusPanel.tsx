"use client";

import Image from "next/image";
import { useLiveHudStore } from "@/modules/world/liveHud";

function VitalBar({ label, value, max, gradient }: { label: string; value: number; max: number; gradient: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-12 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-[#e8d2a0] sm:w-14">{label}</span>
      <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-black/50 ring-1 ring-black/40">
        <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${pct}%`, background: gradient }} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-white/15" />
      </div>
      <span className="w-14 shrink-0 text-right text-[10px] tabular-nums text-[#c9b183] sm:w-16">
        {value}/{max}
      </span>
    </div>
  );
}

/** Top-left "kiếm hiệp + hiện đại" vitals HUD — portrait avatar with level
 * badge, plus Máu/Nội Lực/Nộ (HP/Mana/Rage) bars. Reads `liveHud` store
 * (mock full/partial values today — nothing decrements/increments them yet,
 * this just makes the panel real and readable ahead of combat/exploration
 * being wired into the live flow). Distinct from `LiveHudBar` (bottom,
 * action slots) — this one is the "who am I, how am I doing" readout. */
export function PlayerStatusPanel() {
  const { level, hp, maxHp, mana, maxMana, rage, maxRage } = useLiveHudStore();

  return (
    <div
      className="pointer-events-none fixed left-4 top-4 z-20 flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5 shadow-2xl backdrop-blur"
      style={{ borderColor: "#7a5230", background: "linear-gradient(160deg, rgba(42,32,20,0.92), rgba(20,15,10,0.92))" }}
    >
      <div
        className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 shadow-lg"
        style={{ borderColor: "#f2c66d", background: "radial-gradient(circle at 35% 30%, #f3e2bb, #d8bd8c)" }}
      >
        <Image src="/character/ingame/dog.png" alt="" fill className="object-contain p-1" />
        <span className="absolute inset-x-0 bottom-0 bg-black/70 text-center text-[10px] font-bold text-[#f2c66d]">Lv {level}</span>
      </div>
      <div className="flex w-40 flex-col gap-1.5 sm:w-48">
        <VitalBar label="Máu" value={hp} max={maxHp} gradient="linear-gradient(90deg, #7a1f1f, #e0554f)" />
        <VitalBar label="Nội Lực" value={mana} max={maxMana} gradient="linear-gradient(90deg, #1f4a7a, #4fa8d9)" />
        <VitalBar label="Nộ" value={rage} max={maxRage} gradient="linear-gradient(90deg, #7a4a1f, #f2a13f)" />
      </div>
    </div>
  );
}
