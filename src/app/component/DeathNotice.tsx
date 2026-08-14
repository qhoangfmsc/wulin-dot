"use client";

import { useEffect, useRef } from "react";
import { Skull } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const AUTO_DISMISS_MS = 2500;

/** Shown the instant the player's HP hits 0 — appears before the room fades
 * to black (see `MapScreen.tsx`'s `handlePlayerDeath`) so the fade reads as
 * a consequence of dying, not a random blackout, and stays up through the
 * teleport back to the map's start room. Auto-dismisses on its own after
 * `AUTO_DISMISS_MS`, same convention as `TutorialOverlay`. */
export function DeathNotice({ onDismiss }: { onDismiss: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  function handleDismiss() {
    gsap.to(panelRef.current, { opacity: 0, y: -16, duration: 0.3, ease: "power2.in", onComplete: onDismiss });
  }

  useGSAP(() => {
    gsap.fromTo(panelRef.current, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(handleDismiss, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-16 z-50 flex justify-center">
      <div
        ref={panelRef}
        className="flex items-center gap-3 rounded-2xl border-2 px-6 py-4 shadow-2xl backdrop-blur"
        style={{
          borderColor: "#7a5230",
          background: "linear-gradient(160deg, rgba(58,44,26,0.94), rgba(36,26,16,0.94))",
        }}
      >
        <Skull className="h-7 w-7" style={{ color: "#ef4444" }} />
        <p className="text-[20px] font-bold uppercase tracking-[0.15em] text-[#f2c66d]">Bạn Đã Gục Ngã</p>
      </div>
    </div>
  );
}
