"use client";

import { useState } from "react";
import type { GridCell } from "@/modules/world/mapGrid";
import type { PanelId } from "./hubPanelId";
import { PlayerStatusPanel } from "./PlayerStatusPanel";
import { MonsterTargetHud } from "./MonsterTargetHud";
import { QuestTracker } from "./QuestTracker";
import { ShelfNav } from "./ShelfNav";
import { SummonQuickButton } from "./SummonQuickButton";
import { GridMinimap } from "./GridMinimap";
import { CharacterPanel } from "./CharacterPanel";
import { BagPanel } from "./BagPanel";
import { SkillsPanel } from "./SkillsPanel";
import { SummonPanel } from "./SummonPanel";
import { PetPanel } from "./PetPanel";
import { MountPanel } from "./MountPanel";

/** The whole HUD layer, in one place: top-left column (`PlayerStatusPanel`
 * + `MonsterTargetHud` side by side, `QuestTracker` below both), top-center
 * feature shelf (`ShelfNav`), top-right
 * stack (`SummonQuickButton` above `GridMinimap`), and whichever hub panel
 * is currently open. `activePanel` is the single piece of state deciding
 * that — every trigger (HUD box, shelf bubble, summon button, or
 * `CharacterPanel`'s own `onNavigate`) just sets it, so only one panel is
 * ever open at once. Bạn Bè isn't part of this — it's a small dropdown
 * anchored to its own `ShelfNav` bubble, see `FriendsDropdown.tsx`.
 * `MapScreen` only owns map/grid state; it hands `cells`/`position`/
 * `visited` down here and doesn't otherwise touch the hub. */
export function GameHud({
  cells,
  position,
  visited,
}: {
  cells: GridCell[][];
  position: { row: number; col: number };
  visited: Set<string>;
}) {
  const [activePanel, setActivePanel] = useState<PanelId | null>(null);

  function close() {
    setActivePanel(null);
  }

  return (
    <>
      <div className="pointer-events-none fixed left-4 top-4 z-20 flex flex-col items-start gap-2">
        <div className="flex items-start gap-2">
          <PlayerStatusPanel onOpenCharacter={() => setActivePanel("character")} />
          <MonsterTargetHud />
        </div>
        <QuestTracker />
      </div>
      <ShelfNav onNavigate={setActivePanel} />
      <div className="pointer-events-none fixed right-4 top-4 z-20 flex items-start gap-2">
        {/* Quick-access icons (currently just Triệu Hồi — room for more
         * later, VD sự kiện/event) sit LEFT of the minimap, top-aligned with
         * it. `flex-wrap` on this constrained-width row means extra icons
         * drop to a 2nd row below instead of pushing the minimap sideways. */}
        <div className="flex max-w-40 flex-wrap items-start justify-end gap-2">
          <SummonQuickButton onOpen={() => setActivePanel("summon")} />
        </div>
        <GridMinimap cells={cells} position={position} visited={visited} />
      </div>

      {activePanel === "character" && <CharacterPanel onNavigate={setActivePanel} onClose={close} />}
      {activePanel === "bag" && <BagPanel onClose={close} />}
      {activePanel === "skills" && <SkillsPanel onClose={close} />}
      {activePanel === "summon" && <SummonPanel onClose={close} />}
      {activePanel === "pet" && <PetPanel onClose={close} />}
      {activePanel === "mount" && <MountPanel onClose={close} />}
    </>
  );
}
