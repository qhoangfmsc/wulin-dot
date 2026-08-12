"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { DynamicIcon } from "./DynamicIcon";

export interface RadialMenuItem {
  id: string;
  label: string;
  icon: string;
}

interface RadialMenuProps {
  items: RadialMenuItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  accentColor: string;
}

const ARC_DEGREES = 130;
const RADIUS = 92;

export function RadialMenu({ items, activeId, onSelect, accentColor }: RadialMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2">
      <div className="relative flex items-center justify-center">
        {items.map((item, i) => {
          const theta =
            items.length === 1 ? 0 : -(ARC_DEGREES / 2) + (i * ARC_DEGREES) / (items.length - 1);
          const rad = (theta * Math.PI) / 180;
          const dx = Math.sin(rad) * RADIUS;
          const dy = -Math.cos(rad) * RADIUS;
          const isActive = activeId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelect(item.id);
                setOpen(false);
              }}
              className="pointer-events-auto absolute flex h-12 w-12 items-center justify-center rounded-full border bg-zinc-900/90 backdrop-blur transition-all duration-300 ease-out"
              style={{
                transform: open ? `translate(${dx}px, ${dy}px) scale(1)` : "translate(0, 0) scale(0.4)",
                opacity: open ? 1 : 0,
                transitionDelay: open ? `${i * 40}ms` : "0ms",
                borderColor: isActive ? accentColor : "#3f3f46",
                boxShadow: isActive ? `0 0 12px ${accentColor}66` : undefined,
              }}
              title={item.label}
            >
              <DynamicIcon
                name={item.icon}
                className="h-5 w-5"
                style={{ color: isActive ? accentColor : "#d4d4d8" }}
              />
            </button>
          );
        })}

        {!open && (
          <span
            className="pointer-events-none absolute h-14 w-14 animate-ping rounded-full"
            style={{ backgroundColor: accentColor, opacity: 0.25 }}
          />
        )}

        <button
          type="button"
          aria-label="Mở menu nhanh"
          onClick={() => setOpen((o) => !o)}
          className="pointer-events-auto relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 bg-zinc-900 shadow-lg transition-transform active:scale-95"
          style={{ borderColor: accentColor }}
        >
          {open ? (
            <X className="h-5 w-5 text-zinc-200" />
          ) : (
            <span className="text-lg font-bold" style={{ color: accentColor }}>
              侠
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
