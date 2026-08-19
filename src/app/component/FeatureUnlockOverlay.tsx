"use client";

import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { UNLOCK_FEATURE_NAMES } from "@/modules/unlocks/data";
import { FEATURE_GUIDES } from "@/modules/unlocks/guides";
import { dismissCurrentAnnouncement, useUnlockAnnouncementStore } from "@/modules/unlocks/announcement";
import { ImageCarousel } from "./ImageCarousel";

gsap.registerPlugin(useGSAP);

/** Full-screen celebration + mini onboarding tour, shown the instant
 * `unlockFeature()` actually flips a feature from locked to unlocked (see
 * `modules/unlocks/store.ts`) — highest z-index in the app (`z-[60]`,
 * above `DeathNotice`'s `z-50`) since it can in principle land on top of
 * anything. Unlike `DeathNotice` (fade in, sit still, auto-dismiss), this
 * one keeps glowing/pulsing the whole time it's up — dismiss is manual
 * only (click anywhere, the button, or Space), same two dismiss patterns
 * already used elsewhere (`TutorialOverlay`'s click-panel, `DialogueBox`'s
 * Space listener). Mounted once in `MapScreen.tsx`; renders nothing while
 * nothing's pending.
 *
 * Shows exactly ONE feature at a time (`pending[0]`) — unlocking several
 * at once (only `bag` triggers today via `first_deer_hunt`, see
 * `MapScreen.tsx`, but a future quest could call `unlockFeature` more than
 * once) tours them one after another instead of dumping every name into 1
 * card.
 * Dismissing advances the queue (`dismissCurrentAnnouncement`) rather than
 * clearing it outright. Name/description/carousel images all come from
 * `modules/unlocks/guides.ts`'s `FEATURE_GUIDES` — falls back to just the
 * bare name (no description/carousel) for a feature with no guide entry
 * yet, so this never crashes if `unlockFeature` is ever called for one. */
export function FeatureUnlockOverlay() {
  const pending = useUnlockAnnouncementStore((s) => s.pending);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const current = pending[0] ?? null;

  function handleDismiss() {
    if (!current) return;
    gsap.to(cardRef.current, { opacity: 0, scale: 0.9, duration: 0.25, ease: "power2.in", onComplete: dismissCurrentAnnouncement });
  }

  useGSAP(() => {
    if (!current) return;
    gsap.fromTo(cardRef.current, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" });
    gsap.fromTo(
      glowRef.current,
      { opacity: 0.35, scale: 1 },
      { opacity: 0.85, scale: 1.08, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1 },
    );
  }, [current]);

  useEffect(() => {
    if (!current) return;
    function handleKeydown(e: KeyboardEvent) {
      if (e.code === "Space") handleDismiss();
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  if (!current) return null;

  const guide = FEATURE_GUIDES[current];
  const name = guide?.name ?? UNLOCK_FEATURE_NAMES[current];

  return (
    <div onClick={handleDismiss} className="pointer-events-auto absolute inset-0 z-[60] flex cursor-pointer items-center justify-center bg-black/80">
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-sm cursor-default flex-col items-center gap-3 rounded-3xl border-2 px-8 py-7 text-center shadow-2xl"
        style={{ borderColor: "#b8892f", background: "linear-gradient(160deg, #3a2c1a, #1c140b)" }}
      >
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{ boxShadow: "0 0 60px 20px rgba(242,198,109,0.5)" }}
        />
        <Sparkles className="relative h-8 w-8" style={{ color: "#f2c66d" }} />
        <p className="relative text-lg uppercase tracking-[0.2em] text-[#f2c66d]">Mở khoá tính năng!</p>
        <p className="relative text-xl font-bold text-[#e6d3ad]">{name}</p>

        {guide && (
          <>
            <div className="relative w-full">
              <ImageCarousel key={current} images={guide.images} />
            </div>
            <p className="relative text-[15px] leading-snug text-[#cbb98f]">{guide.description}</p>
          </>
        )}

        <button
          type="button"
          onClick={handleDismiss}
          className="relative mt-1 rounded-full border-2 px-6 py-2 text-base font-semibold"
          style={{ borderColor: "#b8892f", color: "#f2c66d" }}
        >
          {pending.length > 1 ? "Tiếp Theo" : "Tiếp Tục"}
        </button>
        {pending.length > 1 && (
          <p className="relative text-xs text-[#8a6a3f]">còn {pending.length - 1} tính năng mới nữa</p>
        )}
      </div>
    </div>
  );
}
