"use client";

import { useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import gsap from "gsap";
import { DynamicIcon } from "@/app/component/DynamicIcon";
import { getPassiveSkill } from "@/modules/skills/data";
import type { CharacterClassConfig } from "../types";

interface ClassCardProps {
  classConfig: CharacterClassConfig;
  selected: boolean;
  onSelect: () => void;
}

const TILT_DEGREES = 14;

export function ClassCard({ classConfig, selected, onSelect }: ClassCardProps) {
  const passive = getPassiveSkill(classConfig.id);
  const cardRef = useRef<HTMLButtonElement>(null);
  const setRotateX = useRef<(v: number) => void>(null);
  const setRotateY = useRef<(v: number) => void>(null);
  const setLift = useRef<(v: number) => void>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.set(cardRef.current, { transformPerspective: 800, transformStyle: "preserve-3d" });
    setRotateX.current = gsap.quickTo(cardRef.current, "rotationX", { duration: 0.5, ease: "power3.out" });
    setRotateY.current = gsap.quickTo(cardRef.current, "rotationY", { duration: 0.5, ease: "power3.out" });
    setLift.current = gsap.quickTo(cardRef.current, "y", { duration: 0.5, ease: "power3.out" });
  }, []);

  useEffect(() => {
    if (!selected || !cardRef.current) return;
  }, [selected]);

  function handlePointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setRotateX.current?.((0.5 - py) * TILT_DEGREES);
    setRotateY.current?.((px - 0.5) * TILT_DEGREES);
    setLift.current?.(-6);
    cardRef.current.style.setProperty("--glare-x", `${px * 100}%`);
    cardRef.current.style.setProperty("--glare-y", `${py * 100}%`);
  }

  function handlePointerLeave() {
    setRotateX.current?.(0);
    setRotateY.current?.(0);
    setLift.current?.(0);
  }

  function handleSelect() {
    onSelect();
  }

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={handleSelect}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`class-card group relative flex flex-col overflow-hidden rounded-3xl border text-left transition-colors will-change-transform ${
        selected ? "border-transparent" : "border-zinc-800 hover:border-zinc-700"
      }`}
      style={selected ? { boxShadow: `0 0 0 2px ${classConfig.color}, 0 0 24px ${classConfig.color}44` } : undefined}
    >
      <div className="relative h-[clamp(8.5rem,24dvh,13rem)] w-full shrink-0 overflow-hidden bg-zinc-900">
        {classConfig.coverImage && (
          <Image
            src={classConfig.coverImage}
            alt={classConfig.sectName}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover object-top transition-transform duration-500"
            priority
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/25 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3">
          <p className="text-[11px] uppercase tracking-wide text-zinc-300/90 drop-shadow">{classConfig.role}</p>
          <p className="font-title text-lg font-bold text-white drop-shadow-md">{classConfig.sectName}</p>
          <p className="text-xs text-zinc-300/90 drop-shadow">{classConfig.title}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 bg-zinc-900/70 p-3 backdrop-blur-sm">
        <p className="text-xs italic text-zinc-500">&ldquo;{classConfig.tagline}&rdquo;</p>
        <p className="line-clamp-2 text-xs leading-relaxed text-zinc-400">{classConfig.description}</p>

        <div
          className="mt-auto flex items-start gap-2 rounded-lg border p-2"
          style={{ borderColor: `${classConfig.color}33`, backgroundColor: `${classConfig.color}0d` }}
        >
          <DynamicIcon name={passive.icon} className="mt-0.5 h-4 w-4 shrink-0" style={{ color: classConfig.color }} />
          <div>
            <p className="text-xs font-medium text-zinc-200">Bị động: {passive.name}</p>
            <p className="text-[11px] text-zinc-500">{passive.description}</p>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), ${classConfig.color}40, transparent 55%)`,
        }}
      />
    </button>
  );
}
