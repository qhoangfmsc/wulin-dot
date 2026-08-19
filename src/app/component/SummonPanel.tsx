"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Percent, Plus } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCharacterStore } from "@/modules/character/store";
import { useInventoryStore } from "@/modules/inventory/store";
import { WEAPON_TYPES } from "@/modules/inventory/data";
import { performSummon, performSummonBatch, rollsForLevel, useSummonStore } from "@/modules/summon/store";
import { RARITY_CONFIG } from "@/modules/summon/data";
import type { InventoryItem } from "@/modules/inventory/types";
import { WuxiaModal } from "./WuxiaModal";
import { WuxiaTooltip } from "./WuxiaTooltip";
import { SummonRatesModal } from "./SummonRatesModal";
import { CurrencyValue } from "./CurrencyValue";
import { BuySummonCardsModal } from "./BuySummonCardsModal";

gsap.registerPlugin(useGSAP);

const ROLL_DURATION_MS = 950;
const BATCH_COLS = 5;

/** 1 result slot in the x10 grid reveal — mirrors `BagPanel`'s `ItemSlot`
 * (icon + rarity-color border, full name/bonus only on hover) for visual
 * consistency between "an item I own" and "an item I just got". */
function BatchResultSlot({ item, tooltipAlign }: { item: InventoryItem; tooltipAlign: "start" | "center" | "end" }) {
  const weapon = WEAPON_TYPES[item.weaponTypeId];
  const rarity = RARITY_CONFIG[item.rarity];
  const bonus = item.statBonus.hp ? `+${item.statBonus.hp} Máu` : `+${item.statBonus.attack} Tấn Công`;
  return (
    <div
      className="group relative flex aspect-square items-center justify-center rounded-lg border-2 p-1 hover:z-30"
      style={{ borderColor: rarity.color, background: `${rarity.color}22` }}
    >
      <WuxiaTooltip label={`${weapon.name} · ${rarity.name} — ${bonus}`} placement="top" align={tooltipAlign} />
      <div className="relative h-full w-full">
        <Image src={weapon.spriteSrc} alt={weapon.name} fill className="object-contain" />
      </div>
    </div>
  );
}

/** Tiệm Triệu Hồi — spend Thẻ Triệu Hồi for random weapon item(s) (rarity
 * odds shift with `storeLevel`, see `modules/summon/store.ts`). Items land
 * straight in the inventory — check `BagPanel` to equip. A "roll" (spin +
 * pulse on the store icon, GSAP timeline) plays before the result reveals —
 * x10 plays the SAME single spin, not ten in a row, then reveals a grid
 * instead of one card. `storeLevel` now levels up on its own from
 * accumulated rolls (`summonExp`/`rollsForLevel`) — no manual upgrade
 * button. "Xem Tỉ Lệ" opens a full odds table (`SummonRatesModal`) instead
 * of an inline expand section, driven by `getRarityPercentages` — the exact
 * same function `rollRarity` itself uses, so the numbers can never drift
 * from reality. Bạc/Thẻ Triệu Hồi hiện ở `WuxiaModal`'s `titleRight` (đợt
 * 19, space-between với tiêu đề) thay vì nằm giữa nội dung — nút "+" xanh
 * lá cạnh số thẻ mở `BuySummonCardsModal` (modal chồng modal) để mua thêm
 * ngay tại đây, không cần sang Chợ Trời nữa. */
export function SummonPanel({ onClose }: { onClose: () => void }) {
  const currency = useInventoryStore((s) => s.currency);
  const summonCards = useInventoryStore((s) => s.summonCards);
  const storeLevel = useSummonStore((s) => s.storeLevel);
  const summonExp = useSummonStore((s) => s.summonExp);
  const level = useCharacterStore((s) => s.level);
  const [result, setResult] = useState<InventoryItem | null>(null);
  const [batchResult, setBatchResult] = useState<InventoryItem[] | null>(null);
  const [rolling, setRolling] = useState(false);
  const [showRates, setShowRates] = useState(false);
  const [showBuyCards, setShowBuyCards] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const batchRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!result) return;
      gsap.fromTo(resultRef.current, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" });
    },
    { dependencies: [result] },
  );

  useGSAP(
    () => {
      if (!batchResult) return;
      gsap.fromTo(
        batchRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" },
      );
    },
    { dependencies: [batchResult] },
  );

  function handleSummon(count: 1 | 10) {
    if (rolling || summonCards < count) return;
    setResult(null);
    setBatchResult(null);
    setRolling(true);
    gsap
      .timeline()
      .to(iconRef.current, { scale: 1.12, rotate: 10, duration: ROLL_DURATION_MS / 1000 / 6, ease: "power1.inOut" })
      .to(iconRef.current, { rotate: -10, duration: ROLL_DURATION_MS / 1000 / 6, ease: "power1.inOut", repeat: 3, yoyo: true })
      .to(iconRef.current, { scale: 1, rotate: 0, duration: 0.2, ease: "back.out(2)" })
      .call(() => {
        if (count === 1) {
          setResult(performSummon(level));
        } else {
          setBatchResult(performSummonBatch(level, count));
        }
        setRolling(false);
      });
  }

  const resultWeapon = result ? WEAPON_TYPES[result.weaponTypeId] : null;
  const resultRarity = result ? RARITY_CONFIG[result.rarity] : null;
  const rollsNeeded = rollsForLevel(storeLevel);

  return (
    <WuxiaModal
      title="Tiệm Triệu Hồi"
      onClose={onClose}
      titleRight={
        <div className="flex items-center gap-3 text-sm font-bold text-[#3f2a16]">
          <CurrencyValue amount={currency} iconSrc="/icon/coins.png" size={18} />
          <div className="flex items-center gap-1">
            <CurrencyValue amount={summonCards} iconSrc="/icon/summon_card.png" size={18} />
            <button
              type="button"
              aria-label="Mua thêm Thẻ Triệu Hồi"
              onClick={() => setShowBuyCards(true)}
              className="group relative flex h-5 w-5 items-center justify-center rounded-full shadow hover:z-30"
              style={{ background: "#22c55e", color: "#fff" }}
            >
              <WuxiaTooltip label="Mua thêm Thẻ Triệu Hồi" placement="bottom" align="end" />
              <Plus className="h-3 w-3" strokeWidth={3} />
            </button>
          </div>
        </div>
      }
    >
      <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
        {rolling && (
          <div
            className="absolute inset-0 animate-spin rounded-full border-4 border-t-transparent"
            style={{ borderColor: "#f2c66d", borderTopColor: "transparent" }}
          />
        )}
        <div ref={iconRef} className="relative h-28 w-28">
          <Image src="/icon/summon_store.png" alt="" fill className="object-contain" />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-1.5">
        <p className="text-center text-sm text-[#8a6a3f]">Cấp Tiệm: {storeLevel}</p>
        <button
          type="button"
          aria-label="Xem Tỉ Lệ Rớt Đồ"
          onClick={() => setShowRates(true)}
          className="group relative flex h-5 w-5 items-center justify-center rounded-full border hover:z-30"
          style={{ borderColor: "#7a5230", color: "#7a5230" }}
        >
          <WuxiaTooltip label="Xem Tỉ Lệ Rớt Đồ" placement="top" />
          <Percent className="h-3 w-3" />
        </button>
      </div>
      <div className="mx-auto mt-1 w-40">
        <div className="relative h-2 overflow-hidden rounded-full bg-black/10 ring-1 ring-black/20">
          <div
            className="h-full rounded-full transition-[width] duration-300"
            style={{ width: `${Math.min(100, Math.round((summonExp / rollsNeeded) * 100))}%`, background: "#b8892f" }}
          />
        </div>
        <p className="mt-0.5 text-center text-[11px] tabular-nums text-[#8a6a3f]">
          {summonExp}/{rollsNeeded} lượt quay tới Cấp {storeLevel + 1}
        </p>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={summonCards <= 0 || rolling}
          onClick={() => handleSummon(1)}
          className="flex-1 rounded-full border-2 px-4 py-2.5 text-base font-semibold disabled:opacity-40"
          style={{ borderColor: "#7a5230", color: "#5c3a21" }}
        >
          {rolling ? "Đang quay..." : "Triệu Hồi"}
        </button>
        <button
          type="button"
          disabled={summonCards < 10 || rolling}
          onClick={() => handleSummon(10)}
          className="flex-1 rounded-full border-2 px-4 py-2.5 text-base font-semibold disabled:opacity-40"
          style={{ borderColor: "#b8892f", color: "#3a2c1a", background: "linear-gradient(160deg, #f2c66d33, #d9a44133)" }}
        >
          Triệu Hồi x10
        </button>
      </div>

      {result && resultWeapon && resultRarity && !rolling && (
        <div
          ref={resultRef}
          className="mt-4 flex items-center gap-3 rounded-xl border-2 px-3 py-3"
          style={{ borderColor: resultRarity.color, background: `${resultRarity.color}22` }}
        >
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2" style={{ borderColor: resultRarity.color }}>
            <Image src={resultWeapon.spriteSrc} alt={resultWeapon.name} fill className="object-contain p-1.5" />
          </div>
          <div>
            <p className="text-base font-bold" style={{ color: resultRarity.color }}>
              {resultWeapon.name} · {resultRarity.name}
            </p>
            <p className="text-sm text-[#8a6a3f]">
              {result.statBonus.hp ? `+${result.statBonus.hp} Máu` : `+${result.statBonus.attack} Tấn Công`}
            </p>
          </div>
        </div>
      )}

      {batchResult && batchResult.length > 0 && !rolling && (
        <div ref={batchRef} className="mt-4 grid grid-cols-5 gap-2">
          {batchResult.map((item, i) => {
            const col = i % BATCH_COLS;
            const tooltipAlign = col === 0 ? "start" : col === BATCH_COLS - 1 ? "end" : "center";
            return <BatchResultSlot key={item.id} item={item} tooltipAlign={tooltipAlign} />;
          })}
        </div>
      )}

      {result === null && batchResult === null && !rolling && summonCards <= 0 && (
        <p className="mt-4 text-center text-sm text-[#8a6a3f]">Hết Thẻ Triệu Hồi — hạ quái để có cơ hội rớt thêm.</p>
      )}

      {showRates && <SummonRatesModal onClose={() => setShowRates(false)} />}
      {showBuyCards && <BuySummonCardsModal onClose={() => setShowBuyCards(false)} />}
    </WuxiaModal>
  );
}
