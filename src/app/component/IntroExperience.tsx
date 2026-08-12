"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { MapScreen } from "./MapScreen";
import { StoryIntroScreen } from "./StoryIntroScreen";
import { TapToStartScreen } from "./TapToStartScreen";

type Stage = "tap" | "story" | "map";

/** New front-of-game sequence: Tap to Start -> story (explosion + shake +
 * narrative) -> eye-blink transition -> the map. This currently REPLACES
 * the old class-select -> Lobby -> combat flow as the app's entry point —
 * that code is untouched and still in the repo (character creation, Lobby,
 * HudShell), just not reachable from here yet. Wiring the map into
 * "legendary character unlock -> real game" is intentionally left for a
 * later pass (see GAME_DESIGN.md roadmap) — not specified yet. */
export function IntroExperience() {
  const [stage, setStage] = useState<Stage>("tap");
  const topLidRef = useRef<HTMLDivElement>(null);
  const bottomLidRef = useRef<HTMLDivElement>(null);

  function blinkTo(next: Stage) {
    const lids = [topLidRef.current, bottomLidRef.current];
    gsap
      .timeline()
      .to(lids, { scaleY: 1, duration: 0.35, ease: "power2.in" })
      .call(() => setStage(next))
      .to(lids, { scaleY: 0, duration: 0.5, ease: "power2.out", delay: 0.12 });
  }

  return (
    <div className="relative h-dvh w-dvw overflow-hidden bg-zinc-950">
      {stage === "tap" && <TapToStartScreen onStart={() => setStage("story")} />}
      {stage === "story" && <StoryIntroScreen onContinue={() => blinkTo("map")} />}
      {stage === "map" && <MapScreen />}

      {/* Eye-blink transition: 2 lids anchored top/bottom, scaleY 0->1 closes
          the eye (covers the screen), 1->0 opens it again. */}
      <div ref={topLidRef} className="pointer-events-none absolute inset-x-0 top-0 z-40 h-1/2 origin-top scale-y-0 bg-zinc-950" />
      <div
        ref={bottomLidRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-1/2 origin-bottom scale-y-0 bg-zinc-950"
      />
    </div>
  );
}
