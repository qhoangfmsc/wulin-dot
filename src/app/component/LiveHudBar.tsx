"use client";

import { Lock, PawPrint, Swords, User } from "lucide-react";

function LockedSlot({ icon: Icon, label }: { icon: typeof Lock; label: string }) {
  return (
    <div
      title={`${label} — Chưa mở khoá`}
      className="pointer-events-auto relative flex h-12 w-12 items-center justify-center rounded-xl border opacity-60"
      style={{ borderColor: "#7a5230aa", background: "linear-gradient(160deg, #3a2c1a, #241a10)" }}
    >
      <Icon className="h-5 w-5 text-[#a0855c]" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-black/40">
        <Lock className="h-3.5 w-3.5 text-[#d9bd83]" />
      </div>
    </div>
  );
}

/** Bottom HUD for the live exploration flow — skill/character/mount action
 * slots. Level/vitals live in `PlayerStatusPanel` (top-left) instead, so
 * this bar doesn't repeat them. All three slots are locked placeholders
 * today (none of those systems are wired into this flow yet); they reuse
 * the same locked-slot language as the dormant `AbilityBar` (opacity + lock
 * icon + tooltip) so the behavior reads consistently across the game. */
export function LiveHudBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-20 flex justify-center">
      <div
        className="pointer-events-auto flex items-center gap-2 rounded-2xl border-2 px-4 py-2 shadow-2xl backdrop-blur"
        style={{
          borderColor: "#7a5230",
          background: "linear-gradient(160deg, rgba(58,44,26,0.92), rgba(36,26,16,0.92))",
        }}
      >
        <LockedSlot icon={Swords} label="Kỹ Năng" />
        <LockedSlot icon={User} label="Nhân Vật" />
        <LockedSlot icon={PawPrint} label="Thú Cưỡi" />
      </div>
    </div>
  );
}
