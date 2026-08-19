"use client";

import { createPortal } from "react-dom";
import Image from "next/image";
import { WEAPON_TYPES } from "@/modules/inventory/data";
import { RARITY_CONFIG } from "@/modules/summon/data";
import type { InventoryItem } from "@/modules/inventory/types";

const CARD_WIDTH = 208; // px — matches `w-52`
const CARD_HEIGHT_ESTIMATE = 190; // px — image + name + rarity/level + up to 2 stat rows + padding
const TRIGGER_GAP = 8;
const VIEWPORT_MARGIN = 8;

export interface ItemDetailCardPosition {
  top: number;
  left: number;
}

/** Computes where the card should render from the hovered trigger's REAL
 * on-screen rect (`getBoundingClientRect()`) — prefers popping straight
 * below the trigger, flips above if there isn't room below, and clamps
 * horizontally so it never runs off either edge of the viewport. This is
 * the actual fix for `BagPanel.tsx`'s grid: earlier attempts reserved a
 * fixed blank spacer sized for the WORST case (item in row 0, nothing
 * below it) — that "worked" but wasted space for every other case and was
 * still just a guess about what "enough" meant, not a real measurement.
 * Computing fresh from real geometry on every hover is correct for ANY
 * row/column combination, any number of rows, any page — no reserved
 * space needed anywhere. */
export function computeItemDetailCardPosition(triggerRect: DOMRect): ItemDetailCardPosition {
  const spaceBelow = window.innerHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;
  const needed = CARD_HEIGHT_ESTIMATE + TRIGGER_GAP;

  let top: number;
  if (spaceBelow >= needed) {
    top = triggerRect.bottom + TRIGGER_GAP;
  } else if (spaceAbove >= needed) {
    top = triggerRect.top - CARD_HEIGHT_ESTIMATE - TRIGGER_GAP;
  } else if (spaceBelow >= spaceAbove) {
    // Neither side fully fits (tiny viewport) — pick whichever has more
    // room and clamp inside the viewport rather than clipping.
    top = Math.min(triggerRect.bottom + TRIGGER_GAP, window.innerHeight - CARD_HEIGHT_ESTIMATE - VIEWPORT_MARGIN);
  } else {
    top = Math.max(triggerRect.top - CARD_HEIGHT_ESTIMATE - TRIGGER_GAP, VIEWPORT_MARGIN);
  }

  const idealLeft = triggerRect.left + triggerRect.width / 2 - CARD_WIDTH / 2;
  const left = Math.min(Math.max(idealLeft, VIEWPORT_MARGIN), window.innerWidth - CARD_WIDTH - VIEWPORT_MARGIN);

  return { top, left };
}

/** Full weapon detail card — replaces `WuxiaTooltip` for item hovers where
 * a single `whitespace-nowrap` line can't fit everything (the old inline
 * tooltip's `item.statBonus.hp ? hpLine : attackLine` silently dropped
 * whichever stat it didn't pick when an item had BOTH). Shows icon + name
 * + rarity + level + EVERY stat bonus present.
 *
 * Portalled to `document.body` and positioned with `position: fixed` at
 * `position` (see `computeItemDetailCardPosition`) — fully escapes
 * `WuxiaModal`'s `overflow-y-auto` clipping instead of relying on a
 * `group-hover` CSS reveal nested inside it. `BagPanel.tsx` owns the hover
 * state (which item, if any) and only renders this when something's
 * actually hovered — no reserved blank space, no per-row/per-column
 * heuristics. */
export function ItemDetailCard({ item, position }: { item: InventoryItem; position: ItemDetailCardPosition }) {
  const weapon = WEAPON_TYPES[item.weaponTypeId];
  const rarity = RARITY_CONFIG[item.rarity];

  return createPortal(
    <div
      className="pointer-events-none fixed z-50 w-52 rounded-xl border-2 p-3 shadow-2xl"
      style={{
        top: position.top,
        left: position.left,
        borderColor: rarity.color,
        background: "linear-gradient(160deg, #f4e6c4, #d9bd83)",
      }}
    >
      <div className="relative mx-auto h-16 w-16">
        <Image src={weapon.spriteSrc} alt="" fill className="object-contain" />
      </div>
      <p className="mt-1.5 text-center text-[15px] font-bold text-[#3f2a16]">{weapon.name}</p>
      <p className="text-center text-[13px] font-semibold" style={{ color: rarity.color }}>
        {rarity.name} · Cấp {item.level}
      </p>
      <div className="mt-2 flex flex-col gap-1 border-t pt-2" style={{ borderColor: "#7a523066" }}>
        {item.statBonus.hp !== undefined && (
          <div className="flex items-center justify-between text-[13px] text-[#5c3a21]">
            <span>Máu</span>
            <span className="font-bold">+{item.statBonus.hp}</span>
          </div>
        )}
        {item.statBonus.attack !== undefined && (
          <div className="flex items-center justify-between text-[13px] text-[#5c3a21]">
            <span>Tấn Công</span>
            <span className="font-bold">+{item.statBonus.attack}</span>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
