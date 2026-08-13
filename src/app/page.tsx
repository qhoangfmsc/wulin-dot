"use client";

import { IntroExperience } from "@/modules/intro/components/IntroExperience";

/** Entry point — the whole app is exactly 3 screens: tap to start -> story
 * intro -> game (see `IntroExperience`). The old legendary-character
 * select/Lobby/HudShell/combat flow was removed entirely (2026-08) — see
 * `docs/GAME_DESIGN.md` mục 0. */
export default function Home() {
  return <IntroExperience />;
}
