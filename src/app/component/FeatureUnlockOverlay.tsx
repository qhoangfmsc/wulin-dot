"use client";

import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { UNLOCK_FEATURE_NAMES } from "@/modules/unlocks/data";
import { clearAnnouncement, useUnlockAnnouncementStore } from "@/modules/unlocks/announcement";

gsap.registerPlugin(useGSAP);

/** Full-screen celebration shown the instant `unlockFeature()` actually
 * flips a feature from locked to unlocked (see `modules/unlocks/store.ts`)
 * — highest z-index in the app (`z-[60]`, above `DeathNotice`'s `z-50`)
 * since it can in principle land on top of anything. Unlike `DeathNotice`
 * (fade in, sit still, auto-dismiss), this one keeps glowing/pulsing the
 * whole time it's up — dismiss is manual only (click anywhere, the button,
 * or Space), same two dismiss patterns already used elsewhere
 * (`TutorialOverlay`'s click-panel, `DialogueBox`'s Space listener).
 * Mounted once in `MapScreen.tsx`; renders nothing while nothing's
 * pending. */
export function FeatureUnlockOverlay() {
  const pending = useUnlockAnnouncementStore((s) => s.pending);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const visible = pending.length > 0;

  function handleDismiss() {
    if (!visible) return;
    gsap.to(cardRef.current, { opacity: 0, scale: 0.9, duration: 0.25, ease: "power2.in", onComplete: clearAnnouncement });
  }

  useGSAP(() => {
    if (!visible) return;
    gsap.fromTo(cardRef.current, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" });
    gsap.fromTo(
      glowRef.current,
      { opacity: 0.35, scale: 1 },
      { opacity: 0.85, scale: 1.08, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1 },
    );
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    function handleKeydown(e: KeyboardEvent) {
      if (e.code === "Space") handleDismiss();
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  const names = pending.map((feature) => UNLOCK_FEATURE_NAMES[feature]).join(", ");

  return (
    <div onClick={handleDismiss} className="pointer-events-auto absolute inset-0 z-[60] flex cursor-pointer items-center justify-center bg-black/80">
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        className="relative flex cursor-default flex-col items-center gap-4 rounded-3xl border-2 px-10 py-8 text-center shadow-2xl"
        style={{ borderColor: "#b8892f", background: "linear-gradient(160deg, #3a2c1a, #1c140b)" }}
      >
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{ boxShadow: "0 0 60px 20px rgba(242,198,109,0.5)" }}
        />
        <Sparkles className="relative h-10 w-10" style={{ color: "#f2c66d" }} />
        <p className="font-p22 relative text-2xl uppercase tracking-[0.2em] text-[#f2c66d]">Đã Mở Khoá!</p>
        <p className="relative text-xl font-bold text-[#e6d3ad]">{names}</p>
        <button
          type="button"
          onClick={handleDismiss}
          className="relative mt-2 rounded-full border-2 px-6 py-2 text-base font-semibold"
          style={{ borderColor: "#b8892f", color: "#f2c66d" }}
        >
          Tiếp Tục
        </button>
      </div>
    </div>
  );
}
