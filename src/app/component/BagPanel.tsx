"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { RARITY_CONFIG } from "@/modules/summon/data";
import { WEAPON_TYPES } from "@/modules/inventory/data";
import { equipItem, useInventoryStore } from "@/modules/inventory/store";
import { syncMaxHpToLiveHud } from "@/modules/character/store";
import type { InventoryItem } from "@/modules/inventory/types";
import { WuxiaModal } from "./WuxiaModal";
import { WuxiaTooltip } from "./WuxiaTooltip";

function ResourceStat({ iconSrc, label, value }: { iconSrc: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border-2 px-3 py-2" style={{ borderColor: "#7a523066" }}>
      <div className="relative h-8 w-8 shrink-0">
        <Image src={iconSrc} alt="" fill className="object-contain" />
      </div>
      <div>
        <p className="text-xs text-[#8a6a3f]">{label}</p>
        <p className="text-base font-bold text-[#3f2a16]">{value}</p>
      </div>
    </div>
  );
}

const GRID_COLS = 4;

/** 1 ô vuông/vũ khí — tên/phẩm chất/chỉ số chỉ hiện qua `WuxiaTooltip` khi
 * hover (đủ để nhận ra ngay bằng icon+viền màu phẩm chất lúc bình thường),
 * đồ ĐANG trang bị có badge dấu tick góc trên-phải thay vì nút chữ dài.
 * `tooltipAlign` lệch theo cột (cột đầu "start"/cột cuối "end") để tooltip
 * không tràn ra ngoài `WuxiaModal` — xem `WuxiaTooltip.tsx`. */
function ItemSlot({
  item,
  equipped,
  onToggle,
  tooltipAlign,
}: {
  item: InventoryItem;
  equipped: boolean;
  onToggle: () => void;
  tooltipAlign: "start" | "center" | "end";
}) {
  const weapon = WEAPON_TYPES[item.weaponTypeId];
  const rarity = RARITY_CONFIG[item.rarity];
  const bonus = item.statBonus.hp ? `+${item.statBonus.hp} Máu` : `+${item.statBonus.attack} Tấn Công`;

  return (
    <button
      type="button"
      onClick={onToggle}
      className="group relative flex aspect-square items-center justify-center rounded-xl border-2 p-2 transition-transform hover:z-30 hover:scale-105"
      style={{ borderColor: equipped ? "#b8892f" : rarity.color, background: equipped ? "rgba(184,137,47,0.15)" : "transparent" }}
    >
      <WuxiaTooltip label={`${weapon.name} · ${rarity.name} — Cấp ${item.level} · ${bonus}`} placement="top" align={tooltipAlign} />
      <div className="relative h-full w-full">
        <Image src={weapon.spriteSrc} alt={weapon.name} fill className="object-contain" />
      </div>
      {equipped && (
        <span
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border shadow"
          style={{ borderColor: "#7a1f1f", background: "#b8892f", color: "#fff" }}
        >
          <Check className="h-3 w-3" />
        </span>
      )}
    </button>
  );
}

/** Túi Đồ — Bạc + Thẻ Triệu Hồi at a glance, then every weapon item picked
 * up (via summoning, see `SummonPanel`) as a grid of icon slots (đổi từ
 * list dòng dài — gọn hơn, đồ ĐANG trang bị chỉ cần 1 badge tick, không cần
 * nút chữ). This is the ONLY place a picked-up item gets equipped —
 * `CharacterPanel` only shows the currently-equipped one, read-only. */
export function BagPanel({ onClose }: { onClose: () => void }) {
  const { items, equippedItemId, currency, summonCards } = useInventoryStore();

  function handleEquip(id: string | null) {
    equipItem(id);
    syncMaxHpToLiveHud();
  }

  return (
    <WuxiaModal title="Túi Đồ" onClose={onClose}>
      <div className="grid grid-cols-2 gap-2">
        <ResourceStat iconSrc="/icon/coins.png" label="Bạc" value={currency} />
        <ResourceStat iconSrc="/icon/summon_card.png" label="Thẻ Triệu Hồi" value={summonCards} />
      </div>

      <p className="mt-4 mb-2 text-sm font-semibold uppercase tracking-wide text-[#8a6a3f]">Vũ khí đã có</p>
      {items.length === 0 ? (
        <p className="text-sm text-[#8a6a3f]">
          Chưa có vũ khí nào — sang Tiệm Triệu Hồi dùng Thẻ Triệu Hồi để ra đồ ngẫu nhiên.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {items.map((item, i) => {
            const equipped = equippedItemId === item.id;
            const col = i % GRID_COLS;
            const tooltipAlign = col === 0 ? "start" : col === GRID_COLS - 1 ? "end" : "center";
            return (
              <ItemSlot
                key={item.id}
                item={item}
                equipped={equipped}
                onToggle={() => handleEquip(equipped ? null : item.id)}
                tooltipAlign={tooltipAlign}
              />
            );
          })}
        </div>
      )}
    </WuxiaModal>
  );
}
