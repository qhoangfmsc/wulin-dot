import type { ObstacleConfig } from "../mapScene";
import type { GridCellKind, GridSymbol } from "../mapGrid";
import type { MonsterSpawnConfig } from "../monster";

export interface DialogueLine {
  side: "left" | "right";
  name: string;
  portraitSrc?: string;
  text: string;
}

/** How a room looks — floor/wall art + optional color wash. Declared per
 * `GridCellKind` in a map module (`roomStyles`), never computed with
 * if-else in a component. */
export interface RoomVisualStyle {
  floorSrc: string;
  wallSrc: string;
  tint?: number;
}

/** A story object placed in a room — everything an `ObstacleConfig` has
 * (position/size/art, blocks movement the same way), plus an optional
 * one-time `dialogue` fired the first time the player reaches that room. */
export interface SubjectConfig extends ObstacleConfig {
  dialogue?: DialogueLine[];
}

/** A map is a self-contained module: its own grid, obstacles, story
 * objects, music, and tutorial visibility — never a "demo," always real,
 * permanent content. Adding a new map means adding a new module + one line
 * in `MAP_ORDER` (see `./index.ts`); nothing about `MapScreen` changes. */
export interface MapModule {
  id: string;
  grid: GridSymbol[][];
  obstaclesByCell: Record<string, ObstacleConfig[]>;
  subjectsByCell?: Record<string, SubjectConfig[]>;
  /** Hostile mobs placed in specific rooms, keyed by `"row-col"`. */
  monstersByCell?: Record<string, MonsterSpawnConfig[]>;
  /** Looped playlist — `onended` advances to the next track, wrapping back
   * to the start. A single-track array just loops that one track. */
  music: string[];
  /** Whether `TutorialOverlay` should ever appear on this map. */
  showTutorial: boolean;
  /** Floor/wall/tint per room kind — the only place a map decides "what
   * does a boss/special/normal room look like", so `MapScreen` never has to
   * branch on `cell.kind` itself. */
  roomStyles: Record<GridCellKind, RoomVisualStyle>;
  /** Force a specific cell's floor regardless of its kind's default (e.g.
   * the start cell always being dirt), keyed by `"row-col"`. */
  floorOverridesByCell?: Record<string, string>;
}
