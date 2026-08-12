"use client";

import { useLiveHudStore } from "@/modules/world/liveHud";

/** Full-width XP bar, fixed to the very bottom of the screen — always one
 * line, always the same width as the viewport. */
export function ExperienceBar() {
  const { exp, expToNext } = useLiveHudStore();
  const pct = Math.min(100, Math.round((exp / expToNext) * 100));

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-2.5 w-screen bg-[#241a10]">
      <div
        className="h-full transition-[width] duration-500"
        style={{ width: `${pct}%`, background: "linear-gradient(90deg, #b8892f, #f2c66d)" }}
      />
    </div>
  );
}
