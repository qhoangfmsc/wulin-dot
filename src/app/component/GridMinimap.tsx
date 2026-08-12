"use client";

import { useState } from "react";
import Image from "next/image";
import { Gem, Skull, X } from "lucide-react";
import type { GridCell } from "@/modules/world/mapGrid";

const MIN_GRID = 5; // minimap always reserves at least a 5x5 footprint, even for smaller maps
const CELL_SIZE = 20;
const ZOOM_CELL_SIZE = 48;

const INK_BORDER = "#5c3a21";

function GridCells({
  cells,
  position,
  visited,
  cellSize,
}: {
  cells: GridCell[][];
  position: { row: number; col: number };
  visited: Set<string>;
  cellSize: number;
}) {
  const rows = Math.max(MIN_GRID, cells.length);
  const cols = Math.max(MIN_GRID, cells[0]?.length ?? 0);

  return (
    <div className="grid gap-0.75" style={{ gridTemplateColumns: `repeat(${cols}, ${cellSize}px)` }}>
      {Array.from({ length: rows }).flatMap((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const key = `${r}-${c}`;
          const cell = cells[r]?.[c];
          if (!cell || cell.kind === "empty") return <div key={key} style={{ width: cellSize, height: cellSize }} />;

          const isCurrent = r === position.row && c === position.col;
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
              <span style={{ fontSize: cellSize * 0.5 }} className="font-title text-[#8a6a3f]">
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
 * Always reserves at least a `MIN_GRID`×`MIN_GRID` footprint. Click it to
 * open a bigger "unrolled scroll" overlay. Fog of war: unvisited cells hide
 * their `kind` except `"unknown"` cells, which always show a "?". */
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
      <button
        type="button"
        onClick={() => setZoomed(true)}
        className="pointer-events-auto absolute right-4 top-4 z-20 overflow-hidden rounded-xl border-2 shadow-xl transition-transform hover:scale-105"
        style={{ borderColor: INK_BORDER }}
        title="Click to enlarge the map"
      >
        <Image src="/minimap.png" alt="" fill className="object-cover blur-[2px]" sizes="200px" />
        <div className="relative bg-black/45 p-2">
          <GridCells cells={cells} position={position} visited={visited} cellSize={CELL_SIZE} />
        </div>
      </button>

      {zoomed && (
        <div
          className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setZoomed(false)}
        >
          <div className="relative flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="h-4 rounded-full shadow-lg" style={{ background: "linear-gradient(180deg, #6b4a28, #3a2c1a)" }} />
            <div className="relative overflow-hidden border-x-2 shadow-2xl" style={{ borderColor: INK_BORDER }}>
              <Image src="/minimap.png" alt="" fill className="object-cover blur-[2px]" sizes="600px" />
              <div className="relative bg-black/45 px-6 py-5">
                <button
                  type="button"
                  onClick={() => setZoomed(false)}
                  className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 shadow-lg"
                  style={{ borderColor: INK_BORDER, background: "#3a2c1a", color: "#f2c66d" }}
                >
                  <X className="h-4 w-4" />
                </button>
                <GridCells cells={cells} position={position} visited={visited} cellSize={ZOOM_CELL_SIZE} />
              </div>
            </div>
            <div className="h-4 rounded-full shadow-lg" style={{ background: "linear-gradient(180deg, #6b4a28, #3a2c1a)" }} />
          </div>
        </div>
      )}
    </>
  );
}
