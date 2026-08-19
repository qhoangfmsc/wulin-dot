"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useInventoryStore } from "@/modules/inventory/store";
import { SUMMON_CARD_BUY_PRICE } from "@/modules/summon/data";
import { buySummonCards } from "@/modules/summon/store";
import { WuxiaModal } from "./WuxiaModal";
import { CurrencyValue } from "./CurrencyValue";

const MAX_QUANTITY = 99;

/** Opened from `SummonPanel.tsx`'s green "+" button next to the Thẻ Triệu
 * Hồi count — a MODAL ON TOP OF a modal (`SummonPanel` itself stays
 * mounted underneath) rather than swapping panel content, since this is a
 * quick side-purchase the player wants to do without losing their place in
 * the Summon Store. Works because `WuxiaModal` always uses the same fixed
 * `z-40` — 2 stacked instances paint in DOM order, so whichever mounted
 * SECOND (this one) naturally sits on top with its own dimming backdrop,
 * no extra z-index plumbing needed. Quantity picker (+/-, clamped
 * `[1, MAX_QUANTITY]`) rather than a raw number input — keeps thumb-driven
 * adjustment simple and avoids validating free-typed garbage. */
export function BuySummonCardsModal({ onClose }: { onClose: () => void }) {
  const currency = useInventoryStore((s) => s.currency);
  const [count, setCount] = useState(1);
  const totalCost = count * SUMMON_CARD_BUY_PRICE;
  const canAfford = currency >= totalCost;

  function handleConfirm() {
    if (buySummonCards(count)) onClose();
  }

  return (
    <WuxiaModal title="Mua Thẻ Triệu Hồi" onClose={onClose}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <Image src="/icon/summon_card.png" alt="" fill className="object-contain" />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Giảm số lượng"
            onClick={() => setCount((c) => Math.max(1, c - 1))}
            disabled={count <= 1}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 disabled:opacity-30"
            style={{ borderColor: "#7a5230", color: "#5c3a21" }}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-2xl font-bold tabular-nums text-[#3f2a16]">{count}</span>
          <button
            type="button"
            aria-label="Tăng số lượng"
            onClick={() => setCount((c) => Math.min(MAX_QUANTITY, c + 1))}
            disabled={count >= MAX_QUANTITY}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 disabled:opacity-30"
            style={{ borderColor: "#7a5230", color: "#5c3a21" }}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-lg font-bold text-[#3f2a16]">
          Tổng: <CurrencyValue amount={totalCost} iconSrc="/icon/coins.png" size={20} />
        </div>
        <p className="text-xs text-[#8a6a3f]">
          Đang có <CurrencyValue amount={currency} iconSrc="/icon/coins.png" size={13} />
        </p>

        <button
          type="button"
          disabled={!canAfford}
          onClick={handleConfirm}
          className="mt-1 w-full rounded-full border-2 px-4 py-2.5 text-base font-semibold disabled:opacity-40"
          style={{ borderColor: "#b8892f", color: "#3a2c1a", background: "linear-gradient(160deg, #f2c66d, #d9a441)" }}
        >
          {canAfford ? "Xác Nhận Mua" : "Không Đủ Bạc"}
        </button>
      </div>
    </WuxiaModal>
  );
}
