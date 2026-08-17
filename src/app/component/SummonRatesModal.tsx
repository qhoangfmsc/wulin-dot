"use client";

import { RARITY_CONFIG, RARITY_IDS } from "@/modules/summon/data";
import { getRarityPercentages } from "@/modules/summon/store";
import type { Rarity } from "@/modules/summon/types";
import { WuxiaModal } from "./WuxiaModal";

const MAX_LEVEL_SAFETY_CAP = 200;

function ratesEqual(a: Record<Rarity, number>, b: Record<Rarity, number>) {
  return RARITY_IDS.every((id) => a[id] === b[id]);
}

/** Every level up to (and including) the one where the odds first stop
 * changing — `getRarityWeights` has a floor (`MIN_COMMON_WEIGHT`), so past
 * some level every further level is identical to the last; no point
 * listing those, and no hardcoded "max level" number to keep in sync by
 * hand if the floor/shift-per-level constants ever change. */
function computeLevelRows(): { level: number; pct: Record<Rarity, number> }[] {
  const rows: { level: number; pct: Record<Rarity, number> }[] = [];
  let prev: Record<Rarity, number> | null = null;
  for (let level = 1; level <= MAX_LEVEL_SAFETY_CAP; level++) {
    const pct = getRarityPercentages(level);
    if (prev && ratesEqual(prev, pct)) break;
    rows.push({ level, pct });
    prev = pct;
  }
  return rows;
}

/** Full odds table across every meaningful Cấp Tiệm — opened from a small
 * icon button in `SummonPanel.tsx` (was an inline expand/collapse section
 * before, now its own modal so it doesn't push the rest of the panel
 * around). Reads `getRarityPercentages` — the exact function `rollRarity`
 * itself uses — so these numbers can never drift from what actually rolls. */
export function SummonRatesModal({ onClose }: { onClose: () => void }) {
  const rows = computeLevelRows();

  return (
    <WuxiaModal title="Tỉ Lệ Rớt Đồ" onClose={onClose}>
      <p className="mb-3 text-[13px] leading-snug text-[#8a6a3f]">
        Cấp Tiệm càng cao, tỉ lệ Sử Thi/Huyền Thoại càng lớn (trừ thẳng vào tỉ lệ Thường) — tỉ lệ Hiếm không đổi theo cấp.
      </p>
      <div className="max-h-96 overflow-y-auto pr-1">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-[#8a6a3f]">
              <th className="py-1">Cấp</th>
              {RARITY_IDS.map((id) => (
                <th key={id} className="py-1 text-right" style={{ color: RARITY_CONFIG[id].color }}>
                  {RARITY_CONFIG[id].name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ level, pct }) => (
              <tr key={level} className="border-t" style={{ borderColor: "#7a523022" }}>
                <td className="py-1 font-semibold text-[#3f2a16]">{level}</td>
                {RARITY_IDS.map((id) => (
                  <td key={id} className="py-1 text-right font-bold" style={{ color: RARITY_CONFIG[id].color }}>
                    {pct[id]}%
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WuxiaModal>
  );
}
