"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCharacterStore } from "@/modules/character/store";
import { useInventoryStore } from "@/modules/inventory/store";
import { WEAPON_TYPES } from "@/modules/inventory/data";
import { getRarityPercentages, performSummon, useSummonStore } from "@/modules/summon/store";
import { RARITY_CONFIG, RARITY_IDS } from "@/modules/summon/data";
import type { Rarity } from "@/modules/summon/types";
import type { InventoryItem } from "@/modules/inventory/types";
import { WuxiaModal } from "./WuxiaModal";

gsap.registerPlugin(useGSAP);

const ROLL_DURATION_MS = 950;

function OddsRow({ rarity, pct }: { rarity: Rarity; pct: number }) {
  const cfg = RARITY_CONFIG[rarity];
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="flex items-center gap-2">
        <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: cfg.color }} />
        <span className="font-semibold" style={{ color: cfg.color }}>
          {cfg.name}
        </span>
      </span>
      <span className="font-bold text-[#3f2a16]">{pct}%</span>
    </div>
  );
}

/** Tiệm Triệu Hồi — spend 1 Thẻ Triệu Hồi for a random weapon item (rarity
 * odds shift with `storeLevel`, see `modules/summon/store.ts`). Items land
 * straight in the inventory — check `BagPanel` to equip. A "roll" (spin +
 * pulse on the store icon, GSAP timeline) plays before the result reveals,
 * and "Xem Tỉ Lệ" opens a transparent odds table (current level vs next)
 * driven by `getRarityPercentages` — the exact same function `rollRarity`
 * itself uses, so the displayed numbers can never drift from reality. */
export function SummonPanel({ onClose }: { onClose: () => void }) {
  const summonCards = useInventoryStore((s) => s.summonCards);
  const storeLevel = useSummonStore((s) => s.storeLevel);
  const level = useCharacterStore((s) => s.level);
  const [result, setResult] = useState<InventoryItem | null>(null);
  const [rolling, setRolling] = useState(false);
  const [showOdds, setShowOdds] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!result) return;
      gsap.fromTo(resultRef.current, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" });
    },
    { dependencies: [result] },
  );

  function handleSummon() {
    if (summonCards <= 0 || rolling) return;
    setResult(null);
    setRolling(true);
    gsap
      .timeline()
      .to(iconRef.current, { scale: 1.12, rotate: 10, duration: ROLL_DURATION_MS / 1000 / 6, ease: "power1.inOut" })
      .to(iconRef.current, { rotate: -10, duration: ROLL_DURATION_MS / 1000 / 6, ease: "power1.inOut", repeat: 3, yoyo: true })
      .to(iconRef.current, { scale: 1, rotate: 0, duration: 0.2, ease: "back.out(2)" })
      .call(() => {
        const item = performSummon(level);
        setResult(item);
        setRolling(false);
      });
  }

  const resultWeapon = result ? WEAPON_TYPES[result.weaponTypeId] : null;
  const resultRarity = result ? RARITY_CONFIG[result.rarity] : null;
  const currentPct = getRarityPercentages(storeLevel);
  const nextPct = getRarityPercentages(storeLevel + 1);

  return (
    <WuxiaModal title="Tiệm Triệu Hồi" onClose={onClose}>
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

      <p className="mt-2 text-center text-sm text-[#8a6a3f]">Cấp Tiệm: {storeLevel}</p>
      <p className="text-center text-base text-[#3f2a16]">
        Thẻ Triệu Hồi: <span className="font-bold">{summonCards}</span>
      </p>

      <button
        type="button"
        disabled={summonCards <= 0 || rolling}
        onClick={handleSummon}
        className="mt-3 w-full rounded-full border-2 px-4 py-2.5 text-base font-semibold disabled:opacity-40"
        style={{ borderColor: "#7a5230", color: "#5c3a21" }}
      >
        {rolling ? "Đang quay..." : "Triệu Hồi"}
      </button>

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

      {result === null && !rolling && summonCards <= 0 && (
        <p className="mt-4 text-center text-sm text-[#8a6a3f]">Hết Thẻ Triệu Hồi — hạ quái để có cơ hội rớt thêm.</p>
      )}

      <button
        type="button"
        onClick={() => setShowOdds((v) => !v)}
        className="mt-4 flex w-full items-center justify-center gap-1 text-sm font-semibold text-[#7a5230] hover:text-[#5c3a21]"
      >
        Xem Tỉ Lệ Rớt Đồ {showOdds ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {showOdds && (
        <div className="mt-2 rounded-xl border-2 p-3" style={{ borderColor: "#7a523033" }}>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#8a6a3f]">Cấp Tiệm {storeLevel} (hiện tại)</p>
          {RARITY_IDS.map((id) => (
            <OddsRow key={id} rarity={id} pct={currentPct[id]} />
          ))}

          <div className="my-2 border-t" style={{ borderColor: "#7a523033" }} />

          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#8a6a3f]">Cấp Tiệm {storeLevel + 1} (nếu nâng cấp)</p>
          {RARITY_IDS.map((id) => (
            <OddsRow key={id} rarity={id} pct={nextPct[id]} />
          ))}

          <p className="mt-2 text-[11px] leading-snug text-[#8a6a3f]">
            Cấp Tiệm càng cao, tỉ lệ Sử Thi/Huyền Thoại càng lớn (trừ thẳng vào tỉ lệ Thường) — tỉ lệ Hiếm không đổi theo cấp.
          </p>
        </div>
      )}
    </WuxiaModal>
  );
}
