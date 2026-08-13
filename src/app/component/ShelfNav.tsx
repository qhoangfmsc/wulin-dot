"use client";

import { useState } from "react";
import Image from "next/image";
import type { PanelId } from "./hubPanelId";
import { WuxiaTooltip } from "./WuxiaTooltip";
import { FriendsDropdown } from "./FriendsDropdown";

const MODAL_ITEMS: { id: PanelId; iconSrc: string; label: string }[] = [
  { id: "bag", iconSrc: "/icon/bag.png", label: "Túi Đồ" },
  { id: "skills", iconSrc: "/icon/skills.png", label: "Kỹ Năng" },
  { id: "pet", iconSrc: "/icon/pet.png", label: "Thú Cưng" },
  { id: "mount", iconSrc: "/icon/mount.png", label: "Thú Cưỡi" },
];

function Bubble({
  iconSrc,
  label,
  onClick,
  showTooltip = true,
}: {
  iconSrc: string;
  label: string;
  onClick: () => void;
  showTooltip?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="group pointer-events-auto relative flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-lg transition-transform hover:z-30 hover:-translate-y-0.5 hover:scale-110"
      style={{
        borderColor: "#f2c66d99",
        background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.65), rgba(226,193,140,0.35) 45%, rgba(90,64,32,0.55) 100%)",
      }}
    >
      {showTooltip && <WuxiaTooltip label={label} placement="top" />}
      <span className="pointer-events-none absolute left-1.5 top-1 h-1.5 w-2.5 rounded-full bg-white/50 blur-[1px]" />
      <div className="relative h-5 w-5">
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
 * that lives here (`friendsOpen`), not in `GameHud`'s `activePanel`. */
export function ShelfNav({ onNavigate }: { onNavigate: (panel: PanelId) => void }) {
  const [friendsOpen, setFriendsOpen] = useState(false);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-20" style={{ width: 300 }}>
      {/* z-10 — later in DOM isn't enough on its own once the shelf image
       * below overlaps upward via -mt-4; without an explicit stacking order
       * the shelf paints over the bubbles' bottom half instead of sitting
       * under them. */}
      <div className="relative z-10 flex justify-between px-6 pt-1">
        {MODAL_ITEMS.map((item) => (
          <Bubble key={item.id} iconSrc={item.iconSrc} label={item.label} onClick={() => onNavigate(item.id)} />
        ))}

        <div className="pointer-events-auto relative">
          <Bubble iconSrc="/icon/friends.png" label="Bạn Bè" onClick={() => setFriendsOpen((v) => !v)} showTooltip={!friendsOpen} />
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
