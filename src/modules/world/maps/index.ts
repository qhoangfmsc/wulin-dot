import { startMap } from "./start";
import type { MapModule } from "./types";

export type { MapModule, SubjectConfig, DialogueLine } from "./types";

export const MAP_MODULES: Record<string, MapModule> = {
  start: startMap,
};

/** Story order — the extension point for a future map: define its module,
 * append its id here. `MapScreen` doesn't need to change. */
export const MAP_ORDER: string[] = ["start"];
