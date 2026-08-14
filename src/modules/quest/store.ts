import { create } from "zustand";
import { persist } from "zustand/middleware";
import { QUESTS } from "./data";
import type { QuestId, QuestStatus } from "./types";

interface QuestState {
  statusByQuest: Partial<Record<QuestId, QuestStatus>>;
  progressByQuest: Partial<Record<QuestId, number>>;
}

/** Quest state — persisted like `inventory/store.ts`. `mapScene.ts`/`Npc`
 * (Phaser side, can't use hooks) call the functions below directly via
 * `getState()`/`setState()`, same bridge pattern as `liveHud.ts`. */
export const useQuestStore = create<QuestState>()(
  persist(
    (): QuestState => ({
      statusByQuest: {},
      progressByQuest: {},
    }),
    { name: "wulin-quest" },
  ),
);

export function getQuestStatus(id: QuestId): QuestStatus {
  return useQuestStore.getState().statusByQuest[id] ?? "not_started";
}

export function getQuestProgress(id: QuestId): number {
  return useQuestStore.getState().progressByQuest[id] ?? 0;
}

export function startQuest(id: QuestId) {
  useQuestStore.setState((s) => ({
    statusByQuest: { ...s.statusByQuest, [id]: "active" },
    progressByQuest: { ...s.progressByQuest, [id]: 0 },
  }));
}

/** Only counts while the quest is `"active"` — a monster tagged for this
 * quest dying before the player has accepted it (or after it's already
 * done) doesn't silently pre-count. Auto-flips to `"ready_to_turn_in"` once
 * progress reaches the quest's `targetCount`. */
export function reportQuestProgress(id: QuestId, delta: number) {
  const state = useQuestStore.getState();
  if ((state.statusByQuest[id] ?? "not_started") !== "active") return;

  const nextProgress = (state.progressByQuest[id] ?? 0) + delta;
  const target = QUESTS[id].targetCount;
  useQuestStore.setState((s) => ({
    progressByQuest: { ...s.progressByQuest, [id]: nextProgress },
    statusByQuest: nextProgress >= target ? { ...s.statusByQuest, [id]: "ready_to_turn_in" } : s.statusByQuest,
  }));
}

export function completeQuest(id: QuestId) {
  useQuestStore.setState((s) => ({ statusByQuest: { ...s.statusByQuest, [id]: "completed" } }));
}
