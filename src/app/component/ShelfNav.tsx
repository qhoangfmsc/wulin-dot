"use client";

import { useState } from "react";
import Image from "next/image";
import type { PanelId } from "./hubPanelId";
import { LOCKED_FEATURE_HINT } from "@/modules/unlocks/data";
import type { UnlockableFeature } from "@/modules/unlocks/types";
import { WuxiaTooltip } from "./WuxiaTooltip";
import { FriendsDropdown } from "./FriendsDropdown";

const MODAL_ITEMS: { id: PanelId; iconSrc: string; label: string; feature: UnlockableFeature }[] = [
  { id: "bag", iconSrc: "/icon/bag.png", label: "Túi Đồ", feature: "bag" },
  { id: "skills", iconSrc: "/icon/skills.png", label: "Kỹ Năng", feature: "skills" },
  { id: "pet", iconSrc: "/icon/pet.png", label: "Thú Cưng", feature: "pet" },
  { id: "mount", iconSrc: "/icon/mount.png", label: "Thú Cưỡi", feature: "mount" },
];

/** `locked` behaves like `SummonQuickButton`/`MarketQuickButton`'s
 * `unlocked` prop — dims instead of hiding, no-ops the click instead of
 * using the native `disabled` attribute (which would kill `:hover`/
 * `group-hover` and silently break the tooltip). See those files' doc
 * comments for the full reasoning. */
function Bubble({
  iconSrc,
  label,
  onClick,
  showTooltip = true,
  locked = false,
}: {
  iconSrc: string;
  label: string;
  onClick: () => void;
  showTooltip?: boolean;
  locked?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={locked ? undefined : onClick}
      className={`group pointer-events-auto relative flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-lg transition-transform hover:z-30 ${locked ? "cursor-not-allowed" : "hover:-translate-y-0.5 hover:scale-110"}`}
      style={{
        borderColor: "#f2c66d99",
        background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.65), rgba(226,193,140,0.35) 45%, rgba(90,64,32,0.55) 100%)",
        opacity: locked ? 0.5 : 1,
      }}
    >
      {showTooltip && <WuxiaTooltip label={locked ? LOCKED_FEATURE_HINT : label} placement="top" />}
      <span className="pointer-events-none absolute left-1.5 top-1 h-1.5 w-2.5 rounded-full bg-white/50 blur-[1px]" />
      <div className="relative h-5 w-5" style={{ filter: locked ? "grayscale(1)" : undefined }}>
        <Image src={iconSrc} alt="" fill className="object-contain drop-shadow" />
      </div>
    </button>
  );
}

/** Small wuxia "shelf" (`public/shell.png`) in the bottom-right corner
 * holding 5 bubble buttons — every feature that isn't Nhân Vật/Triệu Hồi
 * (that one lives next to the minimap, see `SummonQuickButton`) lives here:
 * Túi Đồ/Kỹ Năng/Thú Cưng/Thú Cưỡi/Bạn Bè. Replaces the nav-grid that used
 * to live inside `CharacterPanel` — see SKILL.md mục 1. Kept deliberately
 * small/nhỏ (đổi theo yêu cầu — trước đó to, giữa-trên màn hình).
 *
 * Bạn Bè is the odd one out: it opens `FriendsDropdown` anchored right at
 * its own bubble instead of going through `onNavigate` to a full
 * `WuxiaModal` — a short list doesn't need a screen takeover. State for
 * that lives here (`friendsOpen`), not in `GameHud`'s `activePanel`.
 *
 * Kỹ Năng/Thú Cưng/Thú Cưỡi/Bạn Bè are locked "for now" at this stage of
 * the game (no real content behind them yet — see `modules/unlocks/types.ts`
 * doc comment) — shown dimmed via `unlocked`, not hidden. Túi Đồ (đợt 14)
 * unlocks for real, same trigger as Tiệm Triệu Hồi/Chợ Trời
 * (`first_deer_hunt`'s turn-in) — it used to be always-unlocked. */
export function ShelfNav({
  onNavigate,
  unlocked,
}: {
  onNavigate: (panel: PanelId) => void;
  unlocked: Record<UnlockableFeature, boolean>;
}) {
  const [friendsOpen, setFriendsOpen] = useState(false);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-20" style={{ width: 300 }}>
      {/* z-10 — later in DOM isn't enough on its own once the shelf image
       * below overlaps upward via -mt-4; without an explicit stacking order
       * the shelf paints over the bubbles' bottom half instead of sitting
       * under them. */}
      <div className="relative z-10 flex justify-between px-6 pt-1">
        {MODAL_ITEMS.map((item) => (
          <Bubble
            key={item.id}
            iconSrc={item.iconSrc}
            label={item.label}
            onClick={() => onNavigate(item.id)}
            locked={!unlocked[item.feature]}
          />
        ))}

        <div className="pointer-events-auto relative">
          <Bubble
            iconSrc="/icon/friends.png"
            label="Bạn Bè"
            onClick={() => setFriendsOpen((v) => !v)}
            showTooltip={!friendsOpen}
            locked={!unlocked.friends}
          />
          {friendsOpen && (
            <>
              {/* Full-screen click-catcher to close on outside click — sits
               * behind the dropdown card (both explicit z-index, not relying
               * on DOM order, see `WuxiaTooltip.tsx`'s doc comment on why). */}
              <div className="pointer-events-auto fixed inset-0 z-30" onClick={() => setFriendsOpen(false)} />
              <FriendsDropdown />
            </>
          )}
        </div>
      </div>
      <Image src="/shell.png" alt="" width={300} height={56} className="-mt-4 w-full h-auto drop-shadow-2xl" priority />
    </div>
  );
}
