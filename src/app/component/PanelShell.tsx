"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";

gsap.registerPlugin(useGSAP);

interface PanelShellProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function PanelShell({ title, onClose, children }: PanelShellProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, x: 24, scale: 0.97 },
      { opacity: 1, x: 0, scale: 1, duration: 0.35, ease: "power3.out" },
    );
  }, []);

  function handleClose() {
    if (!panelRef.current) return onClose();
    gsap.to(panelRef.current, {
      opacity: 0,
      x: 24,
      scale: 0.97,
      duration: 0.25,
      ease: "power2.in",
      onComplete: onClose,
    });
  }

  return (
    <div
      ref={panelRef}
      className="pointer-events-auto absolute right-4 top-4 flex max-h-[calc(100%-2rem)] w-full max-w-sm flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/95 shadow-2xl backdrop-blur"
    >
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{title}</p>
        <button
          type="button"
          onClick={handleClose}
          className="rounded-full p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="overflow-y-auto p-3">{children}</div>
    </div>
  );
}
