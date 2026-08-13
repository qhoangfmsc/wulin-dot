"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SceneBackdrop } from "@/app/component/SceneBackdrop";

gsap.registerPlugin(useGSAP);

/** First screen the player ever sees — plain title + "tap anywhere to
 * start". Kept deliberately minimal (no menu, no options) since it only
 * exists to gate the story intro behind an explicit user gesture. Advances
 * on a click/tap ANYWHERE on screen (the whole thing is a `<button>`) or
 * on Space — never requires hitting the text precisely. */
export function TapToStartScreen({ onStart }: { onStart: () => void }) {
  const rootRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    gsap.from(rootRef.current, { opacity: 0, duration: 1, ease: "power2.out" });
  }, []);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.code === "Space") onStart();
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [onStart]);

  return (
    <button
      ref={rootRef}
      type="button"
      onClick={onStart}
      className="relative flex h-dvh w-dvw flex-col items-center justify-center overflow-hidden bg-zinc-950 text-zinc-100"
    >
      <SceneBackdrop src="/choose_character_background_screen.png" />

      <div className="relative z-10 flex flex-col items-center gap-7">
        <div className="text-center">
          <h1 className="font-bmx mt-2 text-6xl font-bold drop-shadow-lg">Wulin Animal</h1>
        </div>
        <p className="animate-pulse text-md tracking-[0.3em] text-zinc-300 drop-shadow">
          Chạm Để Bắt Đầu
        </p>
      </div>
    </button>
  );
}
