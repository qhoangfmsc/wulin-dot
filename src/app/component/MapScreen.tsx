"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import type { MapEdge } from "@/modules/world/mapScene";
import { cellAt, getCellWalls, neighborCoords, parseGridMap } from "@/modules/world/mapGrid";
import { MAP_MODULES } from "@/modules/world/maps";
import type { DialogueLine } from "@/modules/world/maps";
import { useMapProgressStore } from "@/modules/world/mapProgress";
import { useMapMusic } from "@/modules/world/useMapMusic";
import { GridMinimap } from "./GridMinimap";
import { TutorialOverlay } from "./TutorialOverlay";
import { DialogueBox } from "./DialogueBox";
import { ExperienceBar } from "./ExperienceBar";
import { LiveHudBar } from "./LiveHudBar";
import { PlayerStatusPanel } from "./PlayerStatusPanel";

const MapCanvas = dynamic(() => import("@/modules/world/components/MapCanvas").then((m) => m.MapCanvas), { ssr: false });

const OPPOSITE_EDGE: Record<MapEdge, MapEdge> = { left: "right", right: "left", up: "down", down: "up" };

function cellKey(row: number, col: number) {
  return `${row}-${col}`;
}

/** World map — renders whichever map module is current (see
 * `modules/world/maps`; every map is a real, permanent module, never a
 * "demo"). A grid is a small hand-authored `GridSymbol[][]` (see
 * `mapGrid.ts` for the shorthand: 0 = blocked, 1 = normal, "X" = start,
 * "B" = boss, "S" = special, "?" = unknown/fog). `parseGridMap` derives the
 * start position; `getCellWalls` derives each room's open/walled edges from
 * adjacency — nothing here manually wires up doors. */
export function MapScreen() {
  const currentMapId = useMapProgressStore((s) => s.currentMapId);
  const map = MAP_MODULES[currentMapId];

  const parsed = useMemo(() => parseGridMap(map.grid), [map]);
  const [position, setPosition] = useState(parsed.start);
  const [visited, setVisited] = useState<Set<string>>(() => new Set([cellKey(parsed.start.row, parsed.start.col)]));
  const [spawnAt, setSpawnAt] = useState<MapEdge | null>(null);
  const [showTutorial, setShowTutorial] = useState(map.showTutorial);
  const [dialogueQueue, setDialogueQueue] = useState<DialogueLine[] | null>(null);
  const [lastCheckedKey, setLastCheckedKey] = useState<string | null>(null);
  const [dialogueShownFor, setDialogueShownFor] = useState<Set<string>>(() => new Set());
  const fadeRef = useRef<HTMLDivElement>(null);

  useMapMusic(map.music, currentMapId);

  const posKey = cellKey(position.row, position.col);
  const cell = parsed.cells[position.row][position.col];
  const walls = useMemo(() => getCellWalls(parsed, position.row, position.col), [parsed, position]);
  const isStartCell = position.row === parsed.start.row && position.col === parsed.start.col;
  const floorSrc = isStartCell
    ? "/ground/dirt.png" // the room the player first spawns into is always dirt
    : (position.row + position.col) % 2 === 0
      ? "/ground/dirt.png"
      : "/ground/grass.png";
  const wallSrc = cell.kind === "boss" ? "/ground/lava_wall.png" : "/ground/log_wall.png";
  const tint = cell.kind === "boss" ? 0xef4444 : cell.kind === "special" ? 0xa855f7 : undefined;
  // Memoized so the array reference only changes when the room actually
  // changes — `MapCanvas`'s effect depends on `obstacles` by reference, so a
  // freshly spread array on every render (e.g. from dismissing the dialogue
  // or tutorial, which just toggles unrelated state) would make it tear
  // down and rebuild the whole Phaser game every time, flashing the screen.
  const subjects = useMemo(() => map.subjectsByCell?.[posKey] ?? [], [map, posKey]);
  const obstacles = useMemo(
    () => [...(map.obstaclesByCell[posKey] ?? []), ...subjects],
    [map, posKey, subjects],
  );

  // Adjust state during render (not in an effect) so the dialogue for a
  // room's story object appears the moment that room is reached, exactly
  // once per session — see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (posKey !== lastCheckedKey) {
    setLastCheckedKey(posKey);
    if (!dialogueShownFor.has(posKey)) {
      const withDialogue = subjects.find((s) => s.dialogue && s.dialogue.length > 0);
      if (withDialogue?.dialogue) {
        setDialogueShownFor((prev) => new Set(prev).add(posKey));
        setDialogueQueue(withDialogue.dialogue);
      }
    }
  }

  function handleReachEdge(edge: MapEdge) {
    const next = neighborCoords(position.row, position.col, edge);
    const nextCell = cellAt(parsed, next.row, next.col);
    if (!nextCell || nextCell.kind === "empty" || !fadeRef.current) return; // shouldn't happen — walls already guard this

    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        setPosition(next);
        setVisited((prev) => new Set(prev).add(cellKey(next.row, next.col)));
        // Walked off an edge on this room -> appear at the matching
        // (opposite) edge of the next one, so it reads as one connected
        // space rather than a random teleport.
        setSpawnAt(OPPOSITE_EDGE[edge]);
        gsap.to(fadeRef.current, { opacity: 0, duration: 0.5, ease: "power2.out", delay: 0.15 });
      },
    });
  }

  return (
    <div className="relative h-dvh w-dvw overflow-hidden bg-zinc-950">
      <MapCanvas
        key={posKey}
        floorSrc={floorSrc}
        spriteUrl="/character/ingame/dog.png"
        walls={walls}
        wallSrc={wallSrc}
        tint={tint}
        obstacles={obstacles}
        spawnAt={spawnAt}
        onReachEdge={handleReachEdge}
      />

      <GridMinimap cells={parsed.cells} position={position} visited={visited} />

      {showTutorial && !dialogueQueue && <TutorialOverlay onDismiss={() => setShowTutorial(false)} />}

      {dialogueQueue && <DialogueBox lines={dialogueQueue} onDone={() => setDialogueQueue(null)} />}

      <PlayerStatusPanel />
      <LiveHudBar />
      <ExperienceBar />

      <div ref={fadeRef} className="pointer-events-none absolute inset-0 z-30 bg-zinc-950 opacity-0" />
    </div>
  );
}
