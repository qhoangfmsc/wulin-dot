"use client";

import { IntroExperience } from "./component/IntroExperience";

/** Entry point — the whole app is now exactly 3 screens: tap to start ->
 * story intro -> game (see `IntroExperience`). The old legendary-character
 * select screen has been removed; crane/dragon/tiger stay in the codebase
 * as a dormant module (Lobby/HudShell/combat) for a possible later unlock
 * system, but nothing here links to it — see `docs/GAME_DESIGN.md` mục 0. */
export default function Home() {
  return <IntroExperience />;
}
