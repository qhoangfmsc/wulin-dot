"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

const INK_BORDER = "#5c3a21";

/** Shared wuxia "unrolled scroll" modal chrome — backdrop + wood-roll bars
 * top/bottom + parchment panel + title + X close button. Every hub panel
 * (`CharacterPanel`/`BagPanel`/`SkillsPanel`/`SummonPanel`/`PetPanel`/
 * `MountPanel`) uses this instead of repeating the same markup — see
 * SKILL.md mục 1. Panels only need to write their own content; clicking the
 * backdrop or the X both call `onClose`. */
export function WuxiaModal({
  title,
  onClose,
  children,
  maxWidthClassName = "max-w-md",
  edgeTabs,
  titleRight,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Tailwind `max-w-*` class — wider hubs (VD `CharacterPanel`'s 2 cột)
   * can pass a bigger one than the default. */
  maxWidthClassName?: string;
  /** Optional vertical rail of tab buttons rendered OUTSIDE the card's left
   * edge, like bookmark tabs sticking out of a book — for switching between
   * whole alternate content panes within the SAME modal without an in-modal
   * tab row eating into the content area (VD `CharacterPanel`'s Chỉ Số/Nhân
   * Vật/Cài Đặt). Positioned via `right-full` off the card + `items-end` so
   * each tab's OWN width decides how far it "sticks out" — a wider active
   * tab naturally protrudes further than a narrower inactive one, no manual
   * offset math needed per tab. Caller supplies fully-built buttons; this
   * is a pure positioning slot, not a tab-state manager. */
  edgeTabs?: ReactNode;
  /** Optional content anchored to the RIGHT of `title`, same row (space-
   * between) instead of below it — for "value đang có" (Bạc/Thẻ Triệu Hồi,
   * see `CurrencyValue.tsx`) that panels like `SummonPanel.tsx`/
   * `MarketPanel.tsx` want at-a-glance right next to the title (đợt 19),
   * not buried further down the content. Omit for the plain title-only
   * header every other panel still uses. */
  titleRight?: ReactNode;
}) {
  return (
    <div
      className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className={`relative flex max-h-[85vh] w-full ${maxWidthClassName} flex-col`} onClick={(e) => e.stopPropagation()}>
        {/* Both sit OUTSIDE the overflow-y-auto panel below (as siblings,
         * not children) — `overflow-y-auto` forces the browser to also clip
         * the X axis, so a button offset past the panel edge would get
         * silently cut off if nested inside it. */}
        {edgeTabs && (
          <div className="absolute right-full top-10 z-10 flex flex-col items-end gap-2">{edgeTabs}</div>
        )}
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-3 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 shadow-lg"
          style={{ borderColor: INK_BORDER, background: "#3a2c1a", color: "#f2c66d" }}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="h-4 shrink-0 rounded-full shadow-lg" style={{ background: "linear-gradient(180deg, #6b4a28, #3a2c1a)" }} />

        <div
          className="relative overflow-y-auto border-x-2 shadow-2xl"
          style={{ borderColor: INK_BORDER, background: "linear-gradient(160deg, #f4e6c4 0%, #e6d1a1 55%, #d9bd83 100%)" }}
        >
          <div className="flex items-center justify-between gap-3 px-6 pt-6">
            <p className="text-xl font-bold uppercase tracking-[0.15em] text-[#5c3a21]">{title}</p>
            {titleRight}
          </div>
          <div className="px-6 pb-6 pt-3">{children}</div>
        </div>

        <div className="h-4 shrink-0 rounded-full shadow-lg" style={{ background: "linear-gradient(180deg, #6b4a28, #3a2c1a)" }} />
      </div>
    </div>
  );
}
