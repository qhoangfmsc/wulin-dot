"use client";

import { useState } from "react";
import Image from "next/image";
import { Gem, Skull, X } from "lucide-react";
import type { GridCell } from "@/modules/world/mapGrid";
import { WuxiaTooltip } from "./WuxiaTooltip";

// The minimap renders a fixed-size window CENTERED ON THE PLAYER, not the
// whole grid — the grid itself can be arbitrarily large/maze-shaped (see
// `mapGrid.ts`'s jagged rows) without the minimap having to grow or shrink
// cells to fit it. `VIEWPORT_RADIUS` cells are shown in every direction
// around the player, so the visible window is always
// `(radius*2+1) × (radius*2+1)`.
const VIEWPORT_RADIUS = 2; // 5x5 window
const ZOOM_VIEWPORT_RADIUS = 3; // 7x7 window
const CELL_SIZE = 20;
const ZOOM_CELL_SIZE = 48;

const INK_BORDER = "#5c3a21";

function GridCells({
  cells,
  position,
  visited,
  viewportRadius,
  cellSize,
}: {
  cells: GridCell[][];
  position: { row: number; col: number };
  visited: Set<string>;
  viewportRadius: number;
  cellSize: number;
}) {
  const span = viewportRadius * 2 + 1;
  const offsets = Array.from({ length: span }, (_, i) => i - viewportRadius);

  return (
    <div className="grid gap-0.75" style={{ gridTemplateColumns: `repeat(${span}, ${cellSize}px)` }}>
      {offsets.flatMap((dr) =>
        offsets.map((dc) => {
          const r = position.row + dr;
          const c = position.col + dc;
          const key = `${r}-${c}`;
          const cell = cells[r]?.[c];
          if (!cell || cell.kind === "empty") return <div key={key} style={{ width: cellSize, height: cellSize }} />;

          const isCurrent = dr === 0 && dc === 0;
          const isVisited = visited.has(key);
          const revealed = isCurrent || isVisited;

          let bg = "#c9a86544";
          let border = "#8a6a3f66";
          let content: React.ReactNode = null;

          if (revealed) {
            border = "#8a6a3f";
            bg = "#8a6a3f33";
            if (cell.kind === "boss") {
              bg = "#7a1f1f55";
              border = "#a33";
              content = <Skull style={{ width: cellSize * 0.55, height: cellSize * 0.55, color: "#7a1f1f" }} />;
            } else if (cell.kind === "special") {
              bg = "#5a2f6a55";
              border = "#7a4a8a";
              content = <Gem style={{ width: cellSize * 0.55, height: cellSize * 0.55, color: "#5a2f6a" }} />;
            }
          } else if (cell.kind === "unknown") {
            content = (
              <span style={{ fontSize: cellSize * 0.5 }} className="font-bold text-[#8a6a3f]">
                ?
              </span>
            );
          }

          if (isCurrent) border = "#b8892f";

          return (
            <div
              key={key}
              className="flex items-center justify-center rounded-sm border"
              style={{ width: cellSize, height: cellSize, backgroundColor: bg, borderColor: border }}
            >
              {isCurrent ? (
                <span className="rounded-full" style={{ width: cellSize * 0.28, height: cellSize * 0.28, background: "#b8892f" }} />
              ) : (
                content
              )}
            </div>
          );
        }),
      )}
    </div>
  );
}

/** Static grid minimap styled as an old wuxia map — the illustrated
 * `public/minimap.png` scroll art as backdrop (real asset, not a CSS
 * approximation), with a dark scrim behind the actual dungeon grid so fog
 * of war stays readable over the busy illustration. No rotating sweep
 * (that's for the live-blip combat `Radar`; this is a fixed dungeon map).
 * The player is always the center of the visible window (see
 * `VIEWPORT_RADIUS`) — walking anywhere on an arbitrarily large/maze-shaped
 * grid just pans what's shown, the minimap itself never grows. Click it to
 * open a bigger "unrolled scroll" overlay. Fog of war: unvisited cells hide
 * their `kind` except `"unknown"` cells, which always show a "?". Not
 * self-positioned — `GameHud` places it in the top-right stack alongside
 * `SummonQuickButton`; the zoomed overlay uses `fixed inset-0` so it stays
 * full-screen regardless of that wrapper. */
export function GridMinimap({
  cells,
  position,
  visited,
}: {
  cells: GridCell[][];
  position: { row: number; col: number };
  visited: Set<string>;
}) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <>
      {/* Tooltip is a sibling of the button, not a child — the button needs
       * `overflow-hidden` to clip the `fill` minimap art to its rounded
       * box, which would clip the tooltip too if nested inside it. */}
      <div className="group relative inline-block hover:z-30">
        <button
          type="button"
          onClick={() => setZoomed(true)}
          aria-label="Phóng to"
          className="pointer-events-auto relative overflow-hidden rounded-xl border-2 shadow-xl transition-transform hover:scale-105"
          style={{ borderColor: INK_BORDER }}
        >
          <Image src="/minimap.png" alt="" fill className="object-cover blur-[2px]" sizes="200px" />
          <div className="relative bg-black/45 p-2">
            <GridCells cells={cells} position={position} visited={visited} viewportRadius={VIEWPORT_RADIUS} cellSize={CELL_SIZE} />
          </div>
        </button>
        <WuxiaTooltip label="Phóng to" placement="bottom" />
      </div>

      {zoomed && (
        <div
          className="pointer-events-auto fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setZoomed(false)}
        >
          <div className="relative flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Sibling of the overflow-hidden panel below, not a child of it
             * — same clipping bug/fix as `WuxiaModal.tsx`'s X button: a
             * parent with `overflow-hidden` (needed here to clip the
             * `fill`+`object-cover` minimap art to the rounded/bordered box)
             * silently cuts off any child positioned past its edge. */}
            <button
              type="button"
              onClick={() => setZoomed(false)}
              className="absolute -right-3 top-1 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 shadow-lg"
              style={{ borderColor: INK_BORDER, background: "#3a2c1a", color: "#f2c66d" }}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="h-4 rounded-full shadow-lg" style={{ background: "linear-gradient(180deg, #6b4a28, #3a2c1a)" }} />
            <div className="relative overflow-hidden border-x-2 shadow-2xl" style={{ borderColor: INK_BORDER }}>
              <Image src="/minimap.png" alt="" fill className="object-cover blur-[2px]" sizes="600px" />
              <div className="relative bg-black/45 px-6 py-5">
                <GridCells
                  cells={cells}
                  position={position}
                  visited={visited}
                  viewportRadius={ZOOM_VIEWPORT_RADIUS}
                  cellSize={ZOOM_CELL_SIZE}
                />
              </div>
            </div>
            <div className="h-4 rounded-full shadow-lg" style={{ background: "linear-gradient(180deg, #6b4a28, #3a2c1a)" }} />
          </div>
        </div>
      )}
    </>
  );
}
