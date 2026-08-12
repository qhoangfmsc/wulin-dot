"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flame } from "lucide-react";
import type { CharacterClassConfig } from "../types";

gsap.registerPlugin(useGSAP);

type PreviewForm = "normal" | "sublimation";

/** Bigger, toggleable "Bình Thường" / "Đại Thành" showcase for step 2 of
 * character creation — zooms in on mount, crossfades between the two forms
 * with a brief attack-flavored flash so picking a class feels like more
 * than swapping a thumbnail. */
export function CharacterPreview({ classConfig }: { classConfig: CharacterClassConfig }) {
  const [form, setForm] = useState<PreviewForm>("normal");
  const rootRef = useRef<HTMLDivElement>(null);
  const normalRef = useRef<HTMLDivElement>(null);
  const sublimationRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(rootRef.current, { opacity: 0, scale: 1.22 }, { opacity: 1, scale: 1, duration: 0.55, ease: "power3.out" });
    },
    { dependencies: [classConfig.id] },
  );

  function switchForm(next: PreviewForm) {
    if (next === form) return;
    setForm(next);
    const showEl = next === "sublimation" ? sublimationRef.current : normalRef.current;
    const hideEl = next === "sublimation" ? normalRef.current : sublimationRef.current;
    gsap.to(hideEl, { opacity: 0, scale: 1.04, duration: 0.35, ease: "power2.in" });
    gsap.fromTo(showEl, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" });
    if (flashRef.current) {
      gsap.fromTo(flashRef.current, { opacity: 0.9, scale: 0.6 }, { opacity: 0, scale: 1.6, duration: 0.5, ease: "power2.out" });
    }
  }

  const hasSublimation = Boolean(classConfig.inGameSublimation);

  return (
    <div ref={rootRef} className="flex flex-col gap-2">
      <div
        className="relative h-[clamp(9rem,26dvh,14rem)] w-full overflow-hidden rounded-xl border bg-zinc-900"
        style={{ borderColor: `${classConfig.color}44` }}
      >
        <div
          className="animate-preview-pulse pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(circle at 50% 62%, ${classConfig.color}33, transparent 65%)` }}
        />
        <div ref={normalRef} className="absolute inset-0" style={{ opacity: form === "normal" ? 1 : 0 }}>
          {classConfig.inGameSprite && (
            <Image
              src={classConfig.inGameSprite}
              alt={`${classConfig.sectName} — bình thường`}
              fill
              sizes="400px"
              className="object-cover object-top"
            />
          )}
        </div>
        <div ref={sublimationRef} className="absolute inset-0" style={{ opacity: form === "sublimation" ? 1 : 0 }}>
          {classConfig.inGameSublimation && (
            <Image
              src={classConfig.inGameSublimation}
              alt={`${classConfig.sectName} — Đại Thành`}
              fill
              sizes="400px"
              className="object-cover object-top"
            />
          )}
        </div>
        <div
          ref={flashRef}
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{ background: `radial-gradient(circle at 50% 55%, #ffffff88, ${classConfig.color}55, transparent 70%)` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/85 via-transparent to-transparent" />
        <div className="absolute bottom-1.5 left-2 right-2">
          <p className="font-title text-sm font-bold text-white drop-shadow-md">{classConfig.sectName}</p>
          <p className="text-[11px] text-zinc-300/90 drop-shadow">{classConfig.role} · {classConfig.weapon}</p>
        </div>
      </div>

      {hasSublimation && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => switchForm("normal")}
            className={`flex-1 rounded-full border px-2 py-1 text-[11px] transition-colors ${
              form === "normal" ? "text-zinc-950" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
            }`}
            style={form === "normal" ? { backgroundColor: classConfig.color, borderColor: classConfig.color } : undefined}
          >
            Bình Thường
          </button>
          <button
            type="button"
            onClick={() => switchForm("sublimation")}
            className={`flex flex-1 items-center justify-center gap-1 rounded-full border px-2 py-1 text-[11px] transition-colors ${
              form === "sublimation" ? "text-zinc-950" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
            }`}
            style={form === "sublimation" ? { backgroundColor: classConfig.color, borderColor: classConfig.color } : undefined}
          >
            <Flame className="h-3 w-3" /> Đại Thành
          </button>
        </div>
      )}
    </div>
  );
}
