import Image from "next/image";
import type { CSSProperties } from "react";

const MOTE_COUNT = 18;

/** Deterministic per-index pseudo-randomness — must render identically on
 * server and client, so no Math.random() here (would break hydration). */
function moteStyle(i: number): CSSProperties {
  const left = (i * 53.7) % 100;
  const duration = 14 + ((i * 7) % 10);
  const delay = -((i * 3.1) % duration);
  const drift = ((i % 2 === 0 ? 1 : -1) * (20 + ((i * 11) % 40))).toFixed(0);
  const size = 2 + (i % 3);
  return {
    left: `${left}%`,
    width: size,
    height: size,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    ["--mote-drift" as string]: `${drift}px`,
  };
}

/** Full-bleed illustrated backdrop with a slow Ken Burns zoom, a vignette
 * scrim for text legibility, and drifting embers for atmosphere. */
export function SceneBackdrop({ src }: { src: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 animate-scene-zoom">
        <Image src={src} alt="" fill priority sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-zinc-950/60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(9,9,11,0.65)_100%)]" />
      {Array.from({ length: MOTE_COUNT }).map((_, i) => (
        <span key={i} className="mote" style={moteStyle(i)} />
      ))}
    </div>
  );
}
