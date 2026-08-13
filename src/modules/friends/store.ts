import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Friend } from "./types";

interface FriendsState {
  friends: Friend[];
}

/** No multiplayer backend yet — starts empty and stays empty until a real
 * add-friend flow exists (nothing writes to this today). Persisted the same
 * way as every other domain so `FriendsPanel`'s vertical list is already
 * wired to real state, not a hardcoded placeholder — it just renders empty
 * until a later feature actually adds friends. */
export const useFriendsStore = create<FriendsState>()(
  persist((): FriendsState => ({ friends: [] }), { name: "wulin-friends" }),
);
