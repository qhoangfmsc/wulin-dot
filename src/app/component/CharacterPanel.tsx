"use client";

import { useState } from "react";
import Image from "next/image";
import { Gauge, Settings, UserRound, Volume2, VolumeX } from "lucide-react";
import { CHARACTERS, CHARACTER_IDS } from "@/modules/character/data";
import { allocateStat, getEffectiveStats, setCharacter, syncMaxHpToLiveHud, useCharacterStore } from "@/modules/character/store";
import type { CharacterConfig, CharacterId } from "@/modules/character/types";
import { WEAPON_TYPES } from "@/modules/inventory/data";
import { useInventoryStore } from "@/modules/inventory/store";
import { RARITY_CONFIG } from "@/modules/summon/data";
import { toggleMusicMuted, useSettingsStore } from "@/modules/settings/store";
import type { PanelId } from "./hubPanelId";
import { WuxiaModal } from "./WuxiaModal";
import { WuxiaTooltip } from "./WuxiaTooltip";
import { EdgeTab } from "./EdgeTab";

type Tab = "stats" | "character" | "settings";

function StatRow({
  label,
  value,
  onIncrement,
  disabled,
}: {
  label: string;
  value: string | number;
  onIncrement?: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b py-1.5" style={{ borderColor: "#7a523033" }}>
      <span className="text-sm font-semibold uppercase tracking-wide text-[#8a6a3f]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-base font-bold text-[#3f2a16]">{value}</span>
        {onIncrement && (
          <button
            type="button"
            disabled={disabled}
            onClick={onIncrement}
            className="flex h-6 w-6 items-center justify-center rounded-full border-2 text-sm font-bold leading-none disabled:opacity-30"
            style={{ borderColor: "#7a5230", color: "#5c3a21" }}
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}

function CharacterListItem({
  config,
  active,
  selected,
  onClick,
}: {
  config: CharacterConfig;
  active: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border-2 px-3 py-2 text-left transition-colors"
      style={{ borderColor: selected ? "#b8892f" : "#7a523033", background: selected ? "rgba(184,137,47,0.12)" : "transparent" }}
    >
      <div
        className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2"
        style={{ borderColor: active ? "#f2c66d" : "#7a523066", background: "radial-gradient(circle at 35% 30%, #f3e2bb, #d8bd8c)" }}
      >
        <Image src={config.spriteSrc} alt={config.name} fill className="object-contain p-1" />
      </div>
      <span className="flex-1 text-sm font-semibold text-[#3f2a16]">{config.name}</span>
      {active && (
        <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: "#b8892f" }}>
          Đang Dùng
        </span>
      )}
    </button>
  );
}

/** The Nhân Vật hub — thuần chỉ số + nhân vật + cài đặt, 3 tab. Mọi tính
 * năng khác (Túi Đồ/Kỹ Năng/Triệu Hồi/Thú Cưng/Thú Cưỡi/Bạn Bè) sống ở
 * `ShelfNav`/`SummonQuickButton`, không còn liệt kê ở đây — xem SKILL.md
 * mục 1. Tab switcher là `WuxiaModal`'s `edgeTabs` (bookmark ngoài rìa
 * modal) — KHÔNG phải hàng pill bên trong nội dung — yêu cầu rõ từ user:
 * đừng để Cài Đặt (hay bất kỳ tab nào) chen vào/che nội dung modal. */
export function CharacterPanel({ onNavigate, onClose }: { onNavigate: (panel: PanelId) => void; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("stats");
  const [previewId, setPreviewId] = useState<CharacterId>(useCharacterStore.getState().characterId);
  const character = useCharacterStore();
  const inventory = useInventoryStore();
  const musicMuted = useSettingsStore((s) => s.musicMuted);
  const stats = getEffectiveStats();
  const activeConfig = CHARACTERS[character.characterId];
  const previewConfig = CHARACTERS[previewId];
  const equippedItem = inventory.items.find((i) => i.id === inventory.equippedItemId) ?? null;
  const equippedWeapon = WEAPON_TYPES[equippedItem?.weaponTypeId ?? activeConfig.defaultWeaponId];
  const equippedRarity = equippedItem ? RARITY_CONFIG[equippedItem.rarity] : null;
  const expPct = Math.min(100, Math.round((character.exp / character.expToNext) * 100));

  function handleSetCharacter(id: CharacterId) {
    setCharacter(id);
    syncMaxHpToLiveHud();
  }

  return (
    <WuxiaModal
      title="Nhân Vật"
      onClose={onClose}
      edgeTabs={
        <>
          <EdgeTab icon={Gauge} label="Chỉ Số" active={tab === "stats"} onClick={() => setTab("stats")} />
          <EdgeTab icon={UserRound} label="Nhân Vật" active={tab === "character"} onClick={() => setTab("character")} />
          <EdgeTab icon={Settings} label="Cài Đặt" active={tab === "settings"} onClick={() => setTab("settings")} />
        </>
      }
    >
      {/* min-h khớp chiều cao tab "Chỉ Số" (tab mặc định) — Cài Đặt ngắn hơn
       * nhiều nên không có min-h modal sẽ co lại đột ngột mỗi lần đổi tab,
       * nhìn giật. Tab "Nhân Vật" vẫn tự cao hơn mức này khi cần (danh sách
       * nhân vật), min-h chỉ đặt SÀN chứ không giới hạn trần. */}
      <div className="min-h-97.5">
        {tab === "stats" && (
          <div>
            {/* Nhân vật đang dùng + vũ khí đang mặc, nối bằng 1 line — đọc-only,
             * bấm vào điều hướng sang BagPanel để đổi thật */}
            <div className="mb-4 flex items-center justify-center gap-3 rounded-xl border-2 p-3" style={{ borderColor: "#7a523033" }}>
              <div
                className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 shadow"
                style={{ borderColor: "#f2c66d", background: "radial-gradient(circle at 35% 30%, #f3e2bb, #d8bd8c)" }}
              >
                <Image src={activeConfig.spriteSrc} alt={activeConfig.name} fill className="object-contain p-1" />
              </div>
              <div className="h-0.5 w-6 shrink-0" style={{ background: "#7a523066" }} />
              <button
                type="button"
                onClick={() => onNavigate("bag")}
                aria-label="Xem Túi Đồ để đổi vũ khí"
                className="group relative flex items-center gap-2 rounded-xl border-2 px-2.5 py-1.5 transition-transform hover:z-30 hover:scale-105"
                style={{ borderColor: equippedRarity?.color ?? "#7a5230" }}
              >
                <WuxiaTooltip label="Xem Túi Đồ để đổi vũ khí" placement="top" />
                <div className="relative h-9 w-9 shrink-0">
                  <Image src={equippedWeapon.spriteSrc} alt={equippedWeapon.name} fill className="object-contain" />
                </div>
                <span className="text-xs font-semibold" style={{ color: equippedRarity?.color ?? "#5c3a21" }}>
                  {equippedWeapon.name}
                </span>
              </button>
            </div>

            <StatRow label="Cấp" value={character.level} />
            <div className="my-1.5 h-1.5 overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{ width: `${expPct}%`, background: "linear-gradient(90deg, #b8892f, #f2c66d)" }}
              />
            </div>

            <StatRow label="Máu" value={stats.maxHp} onIncrement={() => allocateStat("hp")} disabled={character.statPoints <= 0} />
            <StatRow
              label="Tấn Công"
              value={stats.attack}
              onIncrement={() => allocateStat("attack")}
              disabled={character.statPoints <= 0}
            />

            <div className="my-2 border-t" style={{ borderColor: "#7a523033" }} />

            <StatRow label="Bạc" value={inventory.currency} />
            <StatRow label="Thẻ Triệu Hồi" value={inventory.summonCards} />
            <StatRow label="Điểm chưa tiêu" value={character.statPoints} />
          </div>
        )}

        {tab === "character" && (
          <div>
            <div className="flex flex-col items-center rounded-xl border-2 p-4" style={{ borderColor: "#7a523033" }}>
              <div
                className="relative h-20 w-20 overflow-hidden rounded-full border-4 shadow-lg"
                style={{ borderColor: "#f2c66d", background: "radial-gradient(circle at 35% 30%, #f3e2bb, #d8bd8c)" }}
              >
                <Image src={previewConfig.spriteSrc} alt={previewConfig.name} fill className="object-contain p-2" />
              </div>
              <p className="mt-2 text-base font-bold text-[#3f2a16]">{previewConfig.name}</p>
              <div className="mt-2 flex gap-5 text-sm text-[#5c3a21]">
                <span>
                  Máu gốc: <b>{previewConfig.baseHp}</b>
                </span>
                <span>
                  Tấn Công gốc: <b>{previewConfig.baseAttack}</b>
                </span>
              </div>

              {previewId === character.characterId ? (
                <span className="mt-3 text-xs font-semibold text-[#8a6a3f]">Nhân vật đang dùng</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetCharacter(previewId)}
                  className="mt-3 rounded-full border-2 px-4 py-1.5 text-sm font-semibold"
                  style={{ borderColor: "#7a5230", color: "#5c3a21" }}
                >
                  Chọn Nhân Vật Này
                </button>
              )}
            </div>

            <div className="mt-3 flex max-h-56 flex-col gap-1.5 overflow-y-auto pr-1">
              {CHARACTER_IDS.map((id) => (
                <CharacterListItem
                  key={id}
                  config={CHARACTERS[id]}
                  active={character.characterId === id}
                  selected={previewId === id}
                  onClick={() => setPreviewId(id)}
                />
              ))}
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#8a6a3f]">Âm Thanh</p>
            <button
              type="button"
              onClick={toggleMusicMuted}
              className="flex w-full items-center justify-between rounded-xl border-2 px-3 py-2.5"
              style={{ borderColor: "#7a523066" }}
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-[#3f2a16]">
                {musicMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                Nhạc Nền
              </span>
              <span
                className="flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 transition-colors"
                style={{ background: musicMuted ? "#7a523066" : "#b8892f" }}
              >
                <span
                  className="h-4 w-4 rounded-full bg-white shadow transition-transform"
                  style={{ transform: musicMuted ? "translateX(0)" : "translateX(16px)" }}
                />
              </span>
            </button>
          </div>
        )}
      </div>
    </WuxiaModal>
  );
}
