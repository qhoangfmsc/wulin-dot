"use client";

import Image from "next/image";

/** Icon + number, standing in for spelled-out "N Bạc"/"N Thẻ Triệu Hồi"
 * text — see SKILL.md mục 2's "hạn chế dùng từ ngữ mang tính value, ưu
 * tiên icon/hình ảnh" rule (đợt 14), applied to Tiệm Triệu Hồi/Chợ Trời's
 * UI at đợt 18. `SummonQuickButton.tsx`'s count badge already does exactly
 * this (icon + number, no text) — this generalizes that pattern into a
 * reusable inline piece so it drops into button labels/paragraphs without
 * breaking their flow. Only 2 real currencies exist in the game (Bạc via
 * `/icon/coins.png`, Thẻ Triệu Hồi via `/icon/summon_card.png`) so this
 * takes `iconSrc` directly rather than a "currency type" enum — no
 * indirection needed for 2 fixed cases. */
export function CurrencyValue({ amount, iconSrc, size = 16 }: { amount: number; iconSrc: string; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      <span className="relative inline-block shrink-0" style={{ width: size, height: size }}>
        <Image src={iconSrc} alt="" fill className="object-contain" />
      </span>
      <span className="tabular-nums">{amount}</span>
    </span>
  );
}
