"use client";

import Image from "next/image";
import { isDailyFreeClaimed, useMarketStore } from "@/modules/market/store";
import { LOCKED_FEATURE_HINT } from "@/modules/unlocks/data";
import { WuxiaTooltip } from "./WuxiaTooltip";

const INK_BORDER = "#5c3a21";

/** Chợ Trời shortcut, right next to `SummonQuickButton` — same shape/size,
 * mirrored button pattern. Dot badge lights up when the daily 3 free Thẻ
 * Triệu Hồi haven't been claimed yet today (`claimDailyFreeCards`, see
 * `modules/market/store.ts`), so the player notices without opening the
 * panel — subscribed to `useMarketStore` (not just `isDailyFreeClaimed()`)
 * so the badge disappears live the moment the claim happens.
 *
 * `unlocked` behaves exactly like `SummonQuickButton`'s — see that file's
 * doc comment for why this dims instead of hides, and why the no-op is on
 * `onClick` rather than the native `disabled` attribute. */
export function MarketQuickButton({ onOpen, unlocked }: { onOpen: () => void; unlocked: boolean }) {
  // Subscribing forces a re-render whenever `lastDailyClaimAt` changes —
  // the actual boolean is recomputed fresh (today's date) each render.
  useMarketStore((s) => s.lastDailyClaimAt);
  const claimed = isDailyFreeClaimed();

  return (
    <button
      type="button"
      aria-label="Chợ Trời"
      onClick={unlocked ? onOpen : undefined}
      className={`group pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-xl border-2 shadow-xl transition-transform hover:z-30 ${unlocked ? "hover:scale-105" : "cursor-not-allowed"}`}
      style={{ borderColor: INK_BORDER, background: "linear-gradient(160deg, #4a3820, #2c2013)", opacity: unlocked ? 1 : 0.55 }}
    >
      <WuxiaTooltip label={unlocked ? "Chợ Trời" : LOCKED_FEATURE_HINT} placement="bottom" />
      <div className="relative h-10 w-10" style={{ filter: unlocked ? undefined : "grayscale(1)" }}>
        <Image src="/icon/market.png" alt="" fill className="object-contain" />
      </div>
      {unlocked && !claimed && (
        <span
          className="absolute -right-1 -top-1 h-4 w-4 animate-pulse rounded-full border"
          style={{ borderColor: "#7a1f1f", background: "#e0554f" }}
        />
      )}
    </button>
  );
}
