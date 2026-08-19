"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const INK_BORDER = "#7a523066";

/** Manual (no auto-play — desktop, deliberate browsing) image gallery —
 * prev/next arrows + dot indicators, clamped (not wrap-around) at the
 * edges. Used by `FeatureUnlockOverlay.tsx` to give a visual overview of a
 * just-unlocked feature (see `modules/unlocks/guides.ts`) instead of a
 * wall of descriptive text — pass `key={...}` from the caller when the
 * image SET changes (VD switching feature) so `index` resets to 0 instead
 * of carrying over a stale position from the previous set. */
export function ImageCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  if (images.length === 0) return null;

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div
        className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-xl border-2"
        style={{ borderColor: INK_BORDER, background: "rgba(0,0,0,0.25)" }}
      >
        {images.length > 1 && (
          <button
            type="button"
            aria-label="Ảnh trước"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="absolute left-1.5 z-10 rounded-full border p-1 disabled:opacity-20"
            style={{ borderColor: INK_BORDER, background: "rgba(20,15,10,0.6)", color: "#f2c66d" }}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        <div className="relative h-24 w-24">
          <Image src={images[index]} alt="" fill className="object-contain drop-shadow" />
        </div>
        {images.length > 1 && (
          <button
            type="button"
            aria-label="Ảnh tiếp theo"
            onClick={() => setIndex((i) => Math.min(images.length - 1, i + 1))}
            disabled={index === images.length - 1}
            className="absolute right-1.5 z-10 rounded-full border p-1 disabled:opacity-20"
            style={{ borderColor: INK_BORDER, background: "rgba(20,15,10,0.6)", color: "#f2c66d" }}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-1.5">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Xem ảnh ${i + 1}`}
              onClick={() => setIndex(i)}
              className="h-1.5 w-1.5 rounded-full transition-colors"
              style={{ background: i === index ? "#f2c66d" : "#f2c66d55" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
