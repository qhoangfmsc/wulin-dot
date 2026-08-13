import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  musicMuted: boolean;
}

/** Player-facing app settings — starts with just music on/off, persisted.
 * Kept its own domain since settings tend to grow (SFX volume, language,
 * etc. later) rather than stay a single toggle forever — see SKILL.md mục 1
 * ("concern có khả năng phình to phải có module riêng ngay từ đầu"). */
export const useSettingsStore = create<SettingsState>()(
  persist((): SettingsState => ({ musicMuted: false }), { name: "wulin-settings" }),
);

export function toggleMusicMuted() {
  useSettingsStore.setState((s) => ({ musicMuted: !s.musicMuted }));
}
