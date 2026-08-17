import { create } from "zustand";

interface NpcInteractionHintState {
  nearbyNpcId: string | null;
}

/** Which NPC (if any) the player is currently close enough to talk to —
 * drives `NpcInteractionHint.tsx`'s "Nhấn Space Để Trò Chuyện" hint.
 * Session-only, not persisted, same bridge pattern as `combatTarget.ts`:
 * `mapScene.ts` writes directly via `setState()` since a Phaser scene can't
 * use hooks. */
export const useNpcInteractionHintStore = create<NpcInteractionHintState>(() => ({
  nearbyNpcId: null,
}));

export function setNearbyNpc(npcId: string | null) {
  useNpcInteractionHintStore.setState((s) => (s.nearbyNpcId === npcId ? s : { nearbyNpcId: npcId }));
}
