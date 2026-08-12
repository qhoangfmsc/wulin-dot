"use client";

import { useWorldStore } from "@/modules/world/store";

const RADAR_SIZE = 128;
const RADAR_RANGE = 500; // world units mapped to the radar's radius

export function Radar({ accentColor }: { accentColor: string }) {
  const player = useWorldStore((s) => s.player);
  const blips = useWorldStore((s) => s.blips);
  const radius = RADAR_SIZE / 2;
  const scale = (radius - 6) / RADAR_RANGE;

  return (
    <div
      className="pointer-events-none absolute bottom-6 right-4 overflow-hidden rounded-full border border-zinc-700 bg-zinc-950/80 backdrop-blur"
      style={{ width: RADAR_SIZE, height: RADAR_SIZE }}
    >
      <div
        className="animate-radar-sweep absolute inset-0"
        style={{ background: `conic-gradient(from 0deg, transparent 0deg, ${accentColor}4d 25deg, transparent 60deg)` }}
      />
      <div className="absolute inset-2.5 rounded-full border border-zinc-800/80" />
      <div className="absolute inset-7 rounded-full border border-zinc-800/60" />

      {blips.map((blip) => {
        const dx = (blip.x - player.x) * scale;
        const dy = (blip.y - player.y) * scale;
        const dist = Math.hypot(dx, dy);
        const clamped = Math.min(dist, radius - 6);
        const angle = Math.atan2(dy, dx);
        const x = Math.cos(angle) * clamped;
        const y = Math.sin(angle) * clamped;
        const outOfRange = dist > radius - 6;

        return (
          <span
            key={blip.id}
            className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              backgroundColor: blip.color,
              opacity: outOfRange ? 0.35 : 0.9,
            }}
          />
        );
      })}

      <span
        className="absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2"
        style={{
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderBottom: `8px solid ${accentColor}`,
          transform: `translate(-50%, -50%) rotate(${player.angle + Math.PI / 2}rad)`,
        }}
      />
    </div>
  );
}
