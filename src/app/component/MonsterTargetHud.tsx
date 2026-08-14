"use client";

import Image from "next/image";
import { useCombatTargetStore } from "@/modules/world/combatTarget";

/** Sits right next to `PlayerStatusPanel` (top-left, via `GameHud`) —
 * whichever monster is currently nearest-in-range of the player's
 * auto-attack (`mapScene.ts`'s `findNearestAliveMonsterInRange()`, synced
 * live through `combatTarget.ts`). Renders nothing when nothing's in
 * range, so it doesn't clutter the HUD outside of combat. */
export function MonsterTargetHud() {
  const { active, hp, maxHp, spriteSrc } = useCombatTargetStore();

  if (!active || !spriteSrc) return null;

  const pct = maxHp > 0 ? Math.max(0, Math.min(100, Math.round((hp / maxHp) * 100))) : 0;

  return (
    <div
      className="pointer-events-none flex items-center gap-2.5 rounded-2xl border-2 px-3 py-2.5 shadow-2xl backdrop-blur"
      style={{ borderColor: "#7a1f1f", background: "linear-gradient(160deg, rgba(42,20,20,0.92), rgba(20,10,10,0.92))" }}
    >
      <div
        className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 shadow-lg"
        style={{ borderColor: "#e0554f", background: "radial-gradient(circle at 35% 30%, #3a2020, #1a0f0f)" }}
      >
        <Image src={spriteSrc} alt="" fill sizes="44px" className="object-contain p-1" />
      </div>
      <div className="flex w-32 flex-col gap-1">
        <div className="relative h-3 overflow-hidden rounded-full bg-black/50 ring-1 ring-black/40">
          <div
            className="h-full rounded-full transition-[width] duration-300"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg, #7a1f1f, #e0554f)" }}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-white/15" />
        </div>
        <span className="text-right text-[11px] font-semibold tabular-nums text-[#e6d3ad]">
          {hp}/{maxHp}
        </span>
      </div>
    </div>
  );
}
