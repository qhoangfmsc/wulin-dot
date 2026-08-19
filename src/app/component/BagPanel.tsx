"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { RARITY_CONFIG } from "@/modules/summon/data";
import { WEAPON_TYPES } from "@/modules/inventory/data";
import { equipItem, useInventoryStore } from "@/modules/inventory/store";
import { syncMaxHpToLiveHud } from "@/modules/character/store";
import type { InventoryItem } from "@/modules/inventory/types";
import { WuxiaModal } from "./WuxiaModal";
import { computeItemDetailCardPosition, ItemDetailCard, type ItemDetailCardPosition } from "./ItemDetailCard";
import { CurrencyValue } from "./CurrencyValue";

const GRID_COLS = 6;
const GRID_ROWS = 3;
/** 1 trang = đúng `GRID_ROWS` hàng đầy (đợt 21, đợt 23 tăng lên 3 hàng) —
 * phân trang thay vì `overflow-y-auto` cuộn vô hạn, tránh lưới dài mãi khi
 * túi đồ đầy dần theo thời gian. Con số 3 KHÔNG còn ràng buộc gì tới việc
 * hover card có bị cắt hay không nữa (đợt 23 — xem `ItemDetailCard.tsx`'s
 * `computeItemDetailCardPosition`, portal + đo vị trí thật) — chọn thuần
 * theo cảm quan layout (3 hàng vừa mắt hơn 2, đỡ chuyển trang liên tục). */
const PAGE_SIZE = GRID_COLS * GRID_ROWS;

/** 1 ô vuông/vũ khí — tên/phẩm chất/cấp/MỌI chỉ số cộng thêm hiện qua
 * `ItemDetailCard` khi hover (đủ để nhận ra ngay bằng icon+viền màu phẩm
 * chất lúc bình thường), đồ ĐANG trang bị có badge dấu tick góc trên-phải
 * thay vì nút chữ dài.
 *
 * KHÔNG tự vẽ `ItemDetailCard` — chỉ báo hover lên `onHover`/`onUnhover`
 * (đợt 23) kèm `DOMRect` thật của chính nó lúc `onMouseEnter`.
 * `BagPanel` là nơi DUY NHẤT giữ "đang hover item nào" và portal đúng 1
 * card ra `document.body`, định vị bằng toạ độ đo được — xem
 * `ItemDetailCard.tsx`'s doc comment cho lý do đổi từ CSS `group-hover`
 * lồng trong modal sang cách này. */
function ItemSlot({
  item,
  equipped,
  onToggle,
  onHover,
  onUnhover,
}: {
  item: InventoryItem;
  equipped: boolean;
  onToggle: () => void;
  onHover: (rect: DOMRect) => void;
  onUnhover: () => void;
}) {
  const weapon = WEAPON_TYPES[item.weaponTypeId];
  const rarity = RARITY_CONFIG[item.rarity];

  return (
    <button
      type="button"
      onClick={onToggle}
      onMouseEnter={(e) => onHover(e.currentTarget.getBoundingClientRect())}
      onMouseLeave={onUnhover}
      className="relative flex aspect-square items-center justify-center rounded-xl border-2 p-2 transition-transform hover:scale-105"
      style={{ borderColor: equipped ? "#b8892f" : rarity.color, background: equipped ? "rgba(184,137,47,0.15)" : "transparent" }}
    >
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
 * `CharacterPanel` only shows the currently-equipped one, read-only.
 *
 * Phân trang thay vì cuộn (đợt 21) — mỗi trang tối đa `PAGE_SIZE` món.
 * `page` KHÔNG dùng thẳng — luôn CLAMP lại trong khoảng hợp lệ mỗi render
 * (`maxPage`) thay vì reset qua `useEffect`, vì tổng số trang có thể tụt
 * xuống bất kỳ lúc nào (bán/mất vật phẩm) trong khi panel vẫn đang mở —
 * clamp tại chỗ luôn đúng ngay lập tức. `hovered` giữ item (nếu có) đang
 * được hover + vị trí đo thật của nó, để portal ĐÚNG 1 `ItemDetailCard`
 * (đợt 23 — xem file đó). */
export function BagPanel({ onClose }: { onClose: () => void }) {
  const { items, equippedItemId, currency, summonCards } = useInventoryStore();
  const [pageRaw, setPage] = useState(0);
  const [hovered, setHovered] = useState<{ item: InventoryItem; position: ItemDetailCardPosition } | null>(null);

  function handleEquip(id: string | null) {
    equipItem(id);
    syncMaxHpToLiveHud();
  }

  const maxPage = Math.max(0, Math.ceil(items.length / PAGE_SIZE) - 1);
  const page = Math.min(pageRaw, maxPage);
  const pageItems = items.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const totalPages = maxPage + 1;

  return (
    <WuxiaModal title="Túi Đồ" onClose={onClose}>
      <div className="flex items-center gap-4 text-base font-bold text-[#3f2a16]">
        <CurrencyValue amount={currency} iconSrc="/icon/coins.png" size={22} />
        <CurrencyValue amount={summonCards} iconSrc="/icon/summon_card.png" size={22} />
      </div>

      <div className="mt-4 mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#8a6a3f]">Vũ khí đã có</p>
        {items.length > PAGE_SIZE && (
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8a6a3f]">
            <button
              type="button"
              aria-label="Trang trước"
              disabled={page <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="flex h-6 w-6 items-center justify-center rounded-full border disabled:opacity-30"
              style={{ borderColor: "#7a5230", color: "#5c3a21" }}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="tabular-nums">
              Trang {page + 1}/{totalPages}
            </span>
            <button
              type="button"
              aria-label="Trang sau"
              disabled={page >= maxPage}
              onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
              className="flex h-6 w-6 items-center justify-center rounded-full border disabled:opacity-30"
              style={{ borderColor: "#7a5230", color: "#5c3a21" }}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-[#8a6a3f]">
          Chưa có vũ khí nào — sang Tiệm Triệu Hồi dùng Thẻ Triệu Hồi để ra đồ ngẫu nhiên.
        </p>
      ) : (
        // MUST stay `grid-cols-${GRID_COLS}` — Tailwind needs the literal
        // class name, can't interpolate `GRID_COLS` here.
        <div className="grid grid-cols-6 gap-3">
          {pageItems.map((item) => {
            const equipped = equippedItemId === item.id;
            return (
              <ItemSlot
                key={item.id}
                item={item}
                equipped={equipped}
                onToggle={() => handleEquip(equipped ? null : item.id)}
                onHover={(rect) => setHovered({ item, position: computeItemDetailCardPosition(rect) })}
                onUnhover={() => setHovered(null)}
              />
            );
          })}
        </div>
      )}

      {hovered && <ItemDetailCard item={hovered.item} position={hovered.position} />}
    </WuxiaModal>
  );
}
