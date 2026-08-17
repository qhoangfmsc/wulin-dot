"use client";

import type { LucideIcon } from "lucide-react";
import { WuxiaTooltip } from "./WuxiaTooltip";

/** 1 "bookmark" sticking out of a `WuxiaModal`'s left edge (its `edgeTabs`
 * slot) — width itself grows when active, so the selected tab visibly
 * protrudes further than the others (see `WuxiaModal`'s `edgeTabs` doc
 * comment). Icon-only + hover tooltip instead of cramming a label into a
 * small square. Originally local to `CharacterPanel.tsx`, extracted once
 * `MarketPanel.tsx` needed the same "bookmark" tabs (Mua/Bán) — 2 real
 * usages is the threshold this codebase extracts a shared component at. */
export function EdgeTab({ icon: Icon, label, active, onClick }: { icon: LucideIcon; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="group relative flex h-12 items-center justify-center rounded-l-xl border-2 border-r-0 shadow-lg transition-all hover:z-30"
      style={{
        width: active ? 52 : 42,
        borderColor: "#5c3a21",
        background: active ? "linear-gradient(160deg, #f4e6c4, #d9bd83)" : "linear-gradient(160deg, #6b4a28, #3a2c1a)",
      }}
    >
      <WuxiaTooltip label={label} placement="bottom" align="start" />
      <Icon className="h-5 w-5" style={{ color: active ? "#5c3a21" : "#f2c66d" }} />
    </button>
  );
}
