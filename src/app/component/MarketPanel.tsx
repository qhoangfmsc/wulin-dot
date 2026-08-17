"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Coins, ShoppingCart } from "lucide-react";
import { useCharacterStore } from "@/modules/character/store";
import { useInventoryStore } from "@/modules/inventory/store";
import { WEAPON_TYPES } from "@/modules/inventory/data";
import type { InventoryItem } from "@/modules/inventory/types";
import { RARITY_CONFIG } from "@/modules/summon/data";
import {
  buyListing,
  buySummonCard,
  claimDailyFreeCards,
  ensureStock,
  isDailyFreeClaimed,
  resetStock,
  sellItem,
  useMarketStore,
} from "@/modules/market/store";
import { BASE_SELL_PRICE, DAILY_FREE_SUMMON_CARDS, RESET_STOCK_COST, SUMMON_CARD_BUY_PRICE } from "@/modules/market/data";
import type { MarketListing } from "@/modules/market/types";
import { WuxiaModal } from "./WuxiaModal";
import { EdgeTab } from "./EdgeTab";

type Tab = "buy" | "sell";

function ListingCard({ listing, canAfford, onBuy }: { listing: MarketListing; canAfford: boolean; onBuy: () => void }) {
  const weapon = WEAPON_TYPES[listing.weaponTypeId];
  const rarity = RARITY_CONFIG[listing.rarity];
  const bonus = listing.statBonus.hp ? `+${listing.statBonus.hp} Máu` : `+${listing.statBonus.attack} Tấn Công`;
  return (
    <div
      className="flex flex-col items-center gap-1 rounded-xl border-2 p-2"
      style={{ borderColor: rarity.color, background: `${rarity.color}15` }}
    >
      <div className="relative h-14 w-14">
        <Image src={weapon.spriteSrc} alt={weapon.name} fill className="object-contain" />
      </div>
      <p className="text-center text-[11px] font-semibold leading-tight" style={{ color: rarity.color }}>
        {weapon.name}
      </p>
      <p className="text-[10px] text-[#8a6a3f]">{bonus}</p>
      <button
        type="button"
        disabled={!canAfford}
        onClick={onBuy}
        className="mt-1 w-full rounded-full border px-2 py-1 text-[11px] font-bold disabled:opacity-40"
        style={{ borderColor: "#7a5230", color: "#5c3a21" }}
      >
        {listing.price} Bạc
      </button>
    </div>
  );
}

function SellCard({ item, equipped, onSell }: { item: InventoryItem; equipped: boolean; onSell: () => void }) {
  const weapon = WEAPON_TYPES[item.weaponTypeId];
  const rarity = RARITY_CONFIG[item.rarity];
  const price = Math.round(BASE_SELL_PRICE * rarity.statMultiplier * item.level);
  return (
    <div
      className="flex flex-col items-center gap-1 rounded-xl border-2 p-2"
      style={{ borderColor: rarity.color, background: `${rarity.color}15` }}
    >
      <div className="relative h-14 w-14">
        <Image src={weapon.spriteSrc} alt={weapon.name} fill className="object-contain" />
      </div>
      <p className="text-center text-[11px] font-semibold leading-tight" style={{ color: rarity.color }}>
        {weapon.name}
        {equipped ? " (Đang mặc)" : ""}
      </p>
      <button
        type="button"
        onClick={onSell}
        className="mt-1 w-full rounded-full border px-2 py-1 text-[11px] font-bold"
        style={{ borderColor: "#7a5230", color: "#5c3a21" }}
      >
        Bán · {price} Bạc
      </button>
    </div>
  );
}

/** Chợ Trời — mua/bán vũ khí, đặt cạnh Tiệm Triệu Hồi ở HUD (cả hai đều mở
 * khoá bằng nhau, xem `modules/unlocks/`). 2 tab "bookmark" (`EdgeTab`,
 * dùng chung với `CharacterPanel`) thay vì nhồi cả mua lẫn bán vào 1 trang
 * dài. Mua: reset danh sách (tốn Bạc), mua Thẻ Triệu Hồi trực tiếp, nhận quà
 * ngày, và lưới vật phẩm đang bán. Bán: lưới vật phẩm người chơi đang có,
 * mỗi ô ra giá riêng theo `modules/market/store.ts`'s công thức (độc lập
 * với giá mua). */
export function MarketPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("buy");
  const level = useCharacterStore((s) => s.level);
  const stock = useMarketStore((s) => s.stock);
  // Subscribed so the daily-claim button/badge update live the instant
  // `claimDailyFreeCards()` fires, not just on next open.
  useMarketStore((s) => s.lastDailyClaimAt);
  const { items, currency, equippedItemId } = useInventoryStore();
  const claimed = isDailyFreeClaimed();

  useEffect(() => {
    ensureStock(level);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WuxiaModal
      title="Chợ Trời"
      onClose={onClose}
      maxWidthClassName="max-w-lg"
      edgeTabs={
        <>
          <EdgeTab icon={ShoppingCart} label="Mua" active={tab === "buy"} onClick={() => setTab("buy")} />
          <EdgeTab icon={Coins} label="Bán" active={tab === "sell"} onClick={() => setTab("sell")} />
        </>
      }
    >
      <p className="text-center text-base text-[#3f2a16]">
        Bạc: <span className="font-bold">{currency}</span>
      </p>

      {tab === "buy" && (
        <>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={currency < RESET_STOCK_COST}
              onClick={() => resetStock(level)}
              className="flex-1 rounded-full border-2 px-3 py-2 text-sm font-semibold disabled:opacity-40"
              style={{ borderColor: "#7a5230", color: "#5c3a21" }}
            >
              Làm Mới Cửa Hàng · {RESET_STOCK_COST} Bạc
            </button>
            <button
              type="button"
              disabled={currency < SUMMON_CARD_BUY_PRICE}
              onClick={() => buySummonCard()}
              className="flex-1 rounded-full border-2 px-3 py-2 text-sm font-semibold disabled:opacity-40"
              style={{ borderColor: "#7a5230", color: "#5c3a21" }}
            >
              Mua Thẻ Triệu Hồi · {SUMMON_CARD_BUY_PRICE} Bạc
            </button>
          </div>

          <button
            type="button"
            disabled={claimed}
            onClick={() => claimDailyFreeCards()}
            className="mt-2 w-full rounded-full border-2 px-3 py-2 text-sm font-semibold disabled:opacity-40"
            style={{ borderColor: "#b8892f", color: "#3a2c1a", background: "linear-gradient(160deg, #f2c66d33, #d9a44133)" }}
          >
            {claimed ? "Đã Nhận Quà Hôm Nay" : `Nhận ${DAILY_FREE_SUMMON_CARDS} Thẻ Triệu Hồi Miễn Phí`}
          </button>

          <p className="mt-4 mb-2 text-sm font-semibold uppercase tracking-wide text-[#8a6a3f]">Vật phẩm đang bán</p>
          {stock.length === 0 ? (
            <p className="text-sm text-[#8a6a3f]">Cửa hàng đang trống — làm mới để xem hàng mới.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {stock.map((listing) => (
                <ListingCard key={listing.id} listing={listing} canAfford={currency >= listing.price} onBuy={() => buyListing(listing.id)} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === "sell" && (
        <>
          <p className="mt-3 mb-2 text-sm font-semibold uppercase tracking-wide text-[#8a6a3f]">Vũ khí đang có</p>
          {items.length === 0 ? (
            <p className="text-sm text-[#8a6a3f]">Chưa có vũ khí nào để bán.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {items.map((item) => (
                <SellCard key={item.id} item={item} equipped={equippedItemId === item.id} onSell={() => sellItem(item.id)} />
              ))}
            </div>
          )}
        </>
      )}
    </WuxiaModal>
  );
}
