"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { DialogueLine } from "@/modules/world/maps";

gsap.registerPlugin(useGSAP);

/** In-game conversation box — one line at a time, portrait + name plate on
 * whichever `side` that line's speaker is on, so a real back-and-forth
 * reads as two people facing each other. Every line shows an avatar — a
 * generic silhouette if `portraitSrc` is omitted — never a bare name.
 * Tap anywhere (or Space) to advance, same convention as the intro screens.
 * Wuxia scroll styling: parchment gradient, double ink border, no art
 * assets required. Exits with a fade-out (not an abrupt unmount) so
 * dismissing it doesn't flash-cut back to the scene. */
export function DialogueBox({ lines, onDone }: { lines: DialogueLine[]; onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const line = lines[index];

  function advance() {
    if (index + 1 >= lines.length) {
      gsap.to(panelRef.current, { opacity: 0, y: 16, duration: 0.25, ease: "power2.in", onComplete: onDone });
    } else {
      setIndex((i) => i + 1);
    }
  }

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.code === "Space") advance();
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useGSAP(() => {
    gsap.fromTo(panelRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
  }, [index]);

  if (!line) return null;
  const isLeft = line.side === "left";

  return (
    <div onClick={advance} className="absolute inset-x-0 bottom-28 z-40 flex cursor-pointer justify-center px-4">
      <div ref={panelRef} className={`flex w-full max-w-2xl items-end gap-3 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
        <div
          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 shadow-lg sm:h-20 sm:w-20"
          style={{ borderColor: "#7a5230", background: "radial-gradient(circle at 35% 30%, #f3e2bb, #d8bd8c)" }}
        >
          {line.portraitSrc ? (
            <Image src={line.portraitSrc} alt={line.name} fill className="object-contain p-1.5" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-8 w-8 text-[#7a5230]" />
            </div>
          )}
        </div>

        <div
          className="relative flex-1 rounded-2xl border-2 px-5 py-3.5 shadow-2xl"
          style={{
            borderColor: "#7a5230",
            background: "linear-gradient(160deg, #f4e6c4 0%, #e6d1a1 55%, #d9bd83 100%)",
            boxShadow: "inset 0 0 0 1px #fff6e0, 0 8px 24px rgba(0,0,0,0.45)",
          }}
        >
          <p className="text-lg font-bold text-[#5c3a21] sm:text-2xl">{line.name}</p>
          <p className="mt-1 text-lg text-[#3f2a16] sm:text-2xl">{line.text}</p>
          <p className="mt-2 text-right text-lg text-[#8a6a3f]">Tap to continue</p>
        </div>
      </div>
    </div>
  );
}
