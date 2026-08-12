"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const AUTO_DISMISS_MS = 6000;

function KeyCap({ label, invisible }: { label: string; invisible?: boolean }) {
  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-md border font-mono text-sm font-bold sm:h-9 sm:w-9 sm:text-base ${
        invisible ? "invisible" : ""
      }`}
      style={{ borderColor: "#7a5230aa", background: "linear-gradient(160deg, #4a3820, #2c2013)", color: "#f2c66d" }}
    >
      {label}
    </div>
  );
}

function KeyCross({ up, left, down, right }: { up: string; left: string; down: string; right: string }) {
  return (
    <div className="grid grid-cols-3 gap-1">
      <KeyCap label="" invisible />
      <KeyCap label={up} />
      <KeyCap label="" invisible />
      <KeyCap label={left} />
      <KeyCap label={down} />
      <KeyCap label={right} />
    </div>
  );
}

/** Bigger movement callout shown once on a map's first visit (per-map, see
 * `MapModule.showTutorial`) — shows both control schemes (WASD and arrow
 * keys) explicitly instead of a single text line. Fades out on its own, or
 * dismisses on tap anywhere on the panel. */
export function TutorialOverlay({ onDismiss }: { onDismiss: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  function handleDismiss() {
    gsap.to(panelRef.current, { opacity: 0, y: 16, duration: 0.25, ease: "power2.in", onComplete: onDismiss });
  }

  useGSAP(() => {
    gsap.fromTo(panelRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", delay: 0.3 });
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(handleDismiss, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-32 z-20 flex justify-center">
      <div
        ref={panelRef}
        onClick={handleDismiss}
        className="pointer-events-auto flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 px-6 py-4 shadow-2xl backdrop-blur"
        style={{
          borderColor: "#7a5230",
          background: "linear-gradient(160deg, rgba(58,44,26,0.94), rgba(36,26,16,0.94))",
        }}
      >
        <p className="font-title text-base font-bold uppercase tracking-[0.2em] text-[#f2c66d] sm:text-lg">Move</p>
        <div className="flex items-center gap-6">
          <KeyCross up="W" left="A" down="S" right="D" />
          <span className="text-sm text-[#a0855c]">or</span>
          <KeyCross up="↑" left="←" down="↓" right="→" />
        </div>
      </div>
    </div>
  );
}
