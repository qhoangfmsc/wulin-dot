import type { ObstacleConfig } from "../mapScene";
import type { GridSymbol } from "../mapGrid";

export interface DialogueLine {
  side: "left" | "right";
  name: string;
  portraitSrc?: string;
  text: string;
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
  /** Looped playlist — `onended` advances to the next track, wrapping back
   * to the start. A single-track array just loops that one track. */
  music: string[];
  /** Whether `TutorialOverlay` should ever appear on this map. */
  showTutorial: boolean;
}
