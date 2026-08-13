"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const LINES = [
  "Đùnggg... Một vụ nổ lớn đã xảy ra",
  "Trong chớp mắt tôi thấy mọi thứ khác đi",
  "Xuyên không? Tôi không biết nữa, nhưng tôi thấy mình đang ở một nơi xa lạ",
];

/** Explosion splash + decaying screen-shake, then narrative lines fade in
 * one by one, then a "tap to continue" prompt. Once the prompt shows, the
 * WHOLE screen (click anywhere, or Space) advances — not just the text. The
 * eye-blink transition that follows is owned by `IntroExperience` (needs to
 * cover both this screen and the one after it), not this component. */
export function StoryIntroScreen({ onContinue }: { onContinue: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (!showPrompt) return;
    function handleKeydown(e: KeyboardEvent) {
      if (e.code === "Space") onContinue();
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [showPrompt, onContinue]);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.to(rootRef.current, { x: 10, y: -8, duration: 0.04 })
      .to(rootRef.current, { x: -14, y: 8, duration: 0.05 })
      .to(rootRef.current, { x: 12, y: -10, duration: 0.05 })
      .to(rootRef.current, { x: -9, y: 7, duration: 0.05 })
      .to(rootRef.current, { x: 6, y: -4, duration: 0.06 })
      .to(rootRef.current, { x: -4, y: 2, duration: 0.06 })
      .to(rootRef.current, { x: 0, y: 0, duration: 0.08 })
      .from(".story-line", { opacity: 0, y: 12, stagger: 1.2, duration: 0.6, ease: "power2.out" }, "+=0.15")
      .call(() => setShowPrompt(true));
  }, []);

  return (
    <div
      ref={rootRef}
      onClick={showPrompt ? onContinue : undefined}
      className={`relative flex h-dvh w-dvw flex-col items-center justify-end overflow-hidden bg-zinc-950 text-zinc-100 ${
        showPrompt ? "cursor-pointer" : ""
      }`}
    >
      <Image src="/story/explode_introduction.png" alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/55 to-zinc-950/10" />

      <div className="relative z-10 mb-16 flex max-w-3xl flex-col items-center gap-10 px-6 text-center">
        {LINES.map((line) => (
          <p key={line} className="story-line text-[28px] leading-relaxed text-zinc-200 drop-shadow">
            {line}
          </p>
        ))}
      </div>

      {showPrompt && (
        <p className="font-p22 relative z-10 mb-8 animate-pulse text-xl uppercase tracking-[0.3em] text-zinc-400">
          Chạm để tiếp tục
        </p>
      )}
    </div>
  );
}
