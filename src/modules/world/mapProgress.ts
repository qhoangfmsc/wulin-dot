import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MapProgressState {
  currentMapId: string;
  furthestMapId: string;
  setCurrentMapId: (id: string) => void;
}

/** Which map module the player is currently on / has reached furthest —
 * persisted the same way as `character`/`inventory`/`skills` state, so it
 * survives a refresh. Only `"start"` exists today; this is the plumbing a
 * second map hooks into later (see `modules/world/maps`). */
export const useMapProgressStore = create<MapProgressState>()(
  persist(
    (set) => ({
      currentMapId: "start",
      furthestMapId: "start",
      setCurrentMapId: (id) => set({ currentMapId: id, furthestMapId: id }),
    }),
    { name: "wulin-map-progress" },
  ),
);
