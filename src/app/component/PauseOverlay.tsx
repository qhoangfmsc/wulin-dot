"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DoorOpen, Play } from "lucide-react";
import { useWorldStore } from "@/modules/world/store";

gsap.registerPlugin(useGSAP);

const CONTROLS: [string, string][] = [
  ["W A S D", "Di chuyển"],
  ["J / K / L", "Skill 1 / Skill 2 / Tuyệt kỹ"],
  ["U", "Bình Máu"],
  ["P", "Tạm dừng / Tiếp tục"],
];

export function PauseOverlay({ accentColor, onExitToLobby }: { accentColor: string; onExitToLobby: () => void }) {
  const paused = useWorldStore((s) => s.paused);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!paused || !cardRef.current) return;
      gsap.fromTo(cardRef.current, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
    },
    { dependencies: [paused] },
  );

  if (!paused) return null;

  return (
    <div className="pointer-events-auto absolute inset-0 z-20 flex items-center justify-center bg-zinc-950/70 backdrop-blur-sm">
      <div ref={cardRef} className="w-full max-w-xs rounded-2xl border border-zinc-800 bg-zinc-950/95 p-5 text-center shadow-2xl">
        <p className="font-title text-lg font-bold text-zinc-100">Tạm Dừng</p>

        <div className="mt-4 flex flex-col gap-1.5 text-left">
          {CONTROLS.map(([key, label]) => (
            <div key={key} className="flex items-center justify-between text-xs">
              <span className="rounded border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 font-mono text-zinc-300">{key}</span>
              <span className="text-zinc-500">{label}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => useWorldStore.getState().setPaused(false)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: accentColor }}
        >
          <Play className="h-4 w-4" /> Tiếp Tục
        </button>
        <button
          type="button"
          onClick={onExitToLobby}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-zinc-700 px-5 py-2 text-xs text-zinc-400 hover:border-zinc-500"
        >
          <DoorOpen className="h-3.5 w-3.5" /> Về Sảnh Chờ
        </button>
      </div>
    </div>
  );
}
