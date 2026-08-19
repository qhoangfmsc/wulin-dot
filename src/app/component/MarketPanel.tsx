"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, Coins, Gift, RotateCw, ShoppingCart } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCharacterStore } from "@/modules/character/store";
import { useInventoryStore } from "@/modules/inventory/store";
import { WEAPON_TYPES } from "@/modules/inventory/data";
import type { InventoryItem } from "@/modules/inventory/types";
import { RARITY_CONFIG } from "@/modules/summon/data";
import { buyListing, claimDailyFreeCards, ensureStock, isDailyFreeClaimed, resetStock, sellItem, useMarketStore } from "@/modules/market/store";
import { BASE_SELL_PRICE, DAILY_FREE_SUMMON_CARDS, RESET_STOCK_COST } from "@/modules/market/data";
import type { MarketListing } from "@/modules/market/types";
import { WuxiaModal } from "./WuxiaModal";
import { EdgeTab } from "./EdgeTab";
import { CurrencyValue } from "./CurrencyValue";
import { WuxiaTooltip } from "./WuxiaTooltip";

gsap.registerPlugin(useGSAP);

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
        className="mt-1 flex w-full items-center justify-center rounded-full border px-2 py-1 text-[11px] font-bold disabled:opacity-40"
        style={{ borderColor: "#7a5230", color: "#5c3a21" }}
      >
        <CurrencyValue amount={listing.price} iconSrc="/icon/coins.png" size={13} />
      </button>
    </div>
  );
}

/** Vũ khí ĐANG mặc hiện dấu tick (đúng pattern `BagPanel.tsx`'s `ItemSlot`)
 * thay vì chữ "(Đang mặc)", và nút "Bán" tự khoá (đợt 19) — bán mất vũ khí
 * đang cầm giữa trận là điều không ai muốn bấm nhầm, disable hẳn thay vì
 * chỉ cảnh báo bằng chữ. */
function SellCard({ item, equipped, onSell }: { item: InventoryItem; equipped: boolean; onSell: () => void }) {
  const weapon = WEAPON_TYPES[item.weaponTypeId];
  const rarity = RARITY_CONFIG[item.rarity];
  const price = Math.round(BASE_SELL_PRICE * rarity.statMultiplier * item.level);
  return (
    <div
      className="relative flex flex-col items-center gap-1 rounded-xl border-2 p-2"
      style={{ borderColor: equipped ? "#b8892f" : rarity.color, background: equipped ? "rgba(184,137,47,0.15)" : `${rarity.color}15` }}
    >
      {equipped && (
        <span
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border shadow"
          style={{ borderColor: "#7a1f1f", background: "#b8892f", color: "#fff" }}
        >
          <Check className="h-3 w-3" />
        </span>
      )}
      <div className="relative h-14 w-14">
        <Image src={weapon.spriteSrc} alt={weapon.name} fill className="object-contain" />
      </div>
      <p className="text-center text-[11px] font-semibold leading-tight" style={{ color: rarity.color }}>
        {weapon.name}
      </p>
      <button
        type="button"
        disabled={equipped}
        onClick={onSell}
        className="mt-1 flex w-full items-center justify-center gap-1 rounded-full border px-2 py-1 text-[11px] font-bold disabled:opacity-40"
        style={{ borderColor: "#7a5230", color: "#5c3a21" }}
      >
        Bán · <CurrencyValue amount={price} iconSrc="/icon/coins.png" size={13} />
      </button>
    </div>
  );
}

const GIFT_GLOW = "0 0 18px 4px rgba(242,198,109,0.65)";

/** Nút quà ngày — thay hẳn nút chữ "Nhận N Thẻ Triệu Hồi Miễn Phí" cũ bằng
 * 1 icon quà lúc lắc + toả sáng liên tục (đợt 19), CHỈ hiện khi còn quà
 * chưa nhận (`!claimed`) — đã nhận rồi thì biến mất hẳn khỏi UI, không còn
 * trạng thái "Đã Nhận Quà Hôm Nay" xám xịt chiếm chỗ nữa. */
function DailyGiftButton({ onClaim }: { onClaim: () => void }) {
  const giftRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap
      .timeline({ repeat: -1, repeatDelay: 1 })
      .to(giftRef.current, { rotate: 10, duration: 0.1, ease: "power1.inOut" })
      .to(giftRef.current, { rotate: -10, duration: 0.1, ease: "power1.inOut", repeat: 3, yoyo: true })
      .to(giftRef.current, { rotate: 0, duration: 0.1, ease: "power1.inOut" });
    gsap.fromTo(glowRef.current, { opacity: 0.4, scale: 1 }, { opacity: 1, scale: 1.15, duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
  }, []);

  return (
    <button type="button" aria-label="Nhận quà mỗi ngày" onClick={onClaim} className="group relative flex h-8 w-8 items-center justify-center">
      <WuxiaTooltip label="Nhận quà mỗi ngày" placement="bottom" align="start" />
      <div ref={glowRef} className="pointer-events-none absolute inset-0 rounded-full" style={{ boxShadow: GIFT_GLOW }} />
      <div ref={giftRef} className="relative flex h-7 w-7 items-center justify-center rounded-full" style={{ background: "#f2c66d", color: "#3a2c1a" }}>
        <Gift className="h-4 w-4" />
      </div>
    </button>
  );
}

/** Chợ Trời — mua/bán vũ khí, đặt cạnh Tiệm Triệu Hồi ở HUD (cả hai đều mở
 * khoá bằng nhau, xem `modules/unlocks/`). 2 tab "bookmark" (`EdgeTab`,
 * dùng chung với `CharacterPanel`) thay vì nhồi cả mua lẫn bán vào 1 trang
 * dài. Mua: làm mới danh sách (tốn Bạc), nhận quà ngày, và lưới vật phẩm
 * đang bán — KHÔNG còn mua Thẻ Triệu Hồi ở đây nữa (đợt 19, dời hẳn sang
 * `SummonPanel.tsx`'s nút "+", xem đó). Bán: lưới vật phẩm người chơi đang
 * có, mỗi ô ra giá riêng theo `modules/market/store.ts`'s công thức (độc
 * lập với giá mua). */
export function MarketPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("buy");
  const level = useCharacterStore((s) => s.level);
  const stock = useMarketStore((s) => s.stock);
  // Subscribed so the daily-claim button/badge update live the instant
  // `claimDailyFreeCards()` fires, not just on next open.
  useMarketStore((s) => s.lastDailyClaimAt);
  const { items, currency, equippedItemId } = useInventoryStore();
  const claimed = isDailyFreeClaimed();
  const [claimToast, setClaimToast] = useState(false);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureStock(level);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGSAP(
    () => {
      if (!claimToast) return;
      gsap
        .timeline()
        .fromTo(toastRef.current, { opacity: 0, y: -8, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.7)" })
        .to(toastRef.current, { opacity: 0, y: -8, duration: 0.3, ease: "power2.in", delay: 1.3, onComplete: () => setClaimToast(false) });
    },
    { dependencies: [claimToast] },
  );

  function handleClaimGift() {
    if (claimDailyFreeCards()) setClaimToast(true);
  }

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
      titleRight={
        <div className="flex items-center gap-2">
          {!claimed && <DailyGiftButton onClaim={handleClaimGift} />}
          <CurrencyValue amount={currency} iconSrc="/icon/coins.png" size={22} />
        </div>
      }
    >
      {claimToast && (
        <div
          ref={toastRef}
          className="mb-3 flex items-center justify-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-sm font-bold"
          style={{ borderColor: "#22c55e", background: "#22c55e22", color: "#166534" }}
        >
          Chúc mừng! Nhận <CurrencyValue amount={DAILY_FREE_SUMMON_CARDS} iconSrc="/icon/summon_card.png" size={16} />
        </div>
      )}

      {tab === "buy" && (
        <>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#8a6a3f]">Vật phẩm đang bán</p>
            <button
              type="button"
              aria-label="Làm mới cửa hàng"
              disabled={currency < RESET_STOCK_COST}
              onClick={() => resetStock(level)}
              className="group relative flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-bold disabled:opacity-40"
              style={{ borderColor: "#7a5230", color: "#5c3a21" }}
            >
              <WuxiaTooltip label="Làm mới cửa hàng" placement="top" align="end" />
              <RotateCw className="h-3 w-3" />
              <CurrencyValue amount={RESET_STOCK_COST} iconSrc="/icon/coins.png" size={13} />
            </button>
          </div>

          {stock.length === 0 ? (
            <p className="mt-2 text-sm text-[#8a6a3f]">Cửa hàng đang trống — làm mới để xem hàng mới.</p>
          ) : (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {stock.map((listing) => (
                <ListingCard key={listing.id} listing={listing} canAfford={currency >= listing.price} onBuy={() => buyListing(listing.id)} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === "sell" && (
        <>
          <p className="mt-1 mb-2 text-sm font-semibold uppercase tracking-wide text-[#8a6a3f]">Vũ khí đang có</p>
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
