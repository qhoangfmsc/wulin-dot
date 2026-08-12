"use client";

import { useState } from "react";
import { Swords, User, Shirt } from "lucide-react";
import { getClassConfig } from "@/modules/character/data";
import { useCharacterStore } from "@/modules/character/store";
import { CharacterPreview } from "@/modules/character/components/CharacterPreview";
import type { PlayerCharacter } from "@/modules/character/types";
import { EquipmentPanel } from "@/modules/inventory/components/EquipmentPanel";
import { getEquipmentBonus, useInventoryStore } from "@/modules/inventory/store";
import { useSkillStore } from "@/modules/skills/store";
import { mergeStatBonus } from "@/modules/stats/data";
import { StatsPanel } from "@/modules/stats/components/StatsPanel";
import { SceneBackdrop } from "./SceneBackdrop";

type Tab = "character" | "equipment";

/** Mobile-survival-game-style hub shown between runs: a persisted character
 * exists, but the player picks a tab (preview/stats vs. equipment) before
 * tapping "Vào Trận" to actually launch `HudShell`. Not a Phaser scene —
 * pure React/GSAP layer. NOTE: currently dormant — nothing in `page.tsx`
 * renders this (the crane/dragon/tiger class-select screen that used to
 * feed it was removed, see `docs/GAME_DESIGN.md` mục 0). Left in place in
 * case a "legendary character" unlock system revives this flow later. */
export function LobbyScreen({ character, onEnterRun }: { character: PlayerCharacter; onEnterRun: () => void }) {
  const [tab, setTab] = useState<Tab>("character");
  const classConfig = getClassConfig(character.classId);
  const accentColor = classConfig?.color ?? "#38bdf8";

  const items = useInventoryStore((s) => s.items);
  const equipped = useInventoryStore((s) => s.equipped);
  const bonus = getEquipmentBonus({ items, equipped });
  const effectiveCharacter: PlayerCharacter = { ...character, stats: mergeStatBonus(character.stats, bonus) };

  const resetCharacter = useCharacterStore((s) => s.resetCharacter);
  const resetSkills = useSkillStore((s) => s.resetSkills);
  const clearInventory = useInventoryStore((s) => s.clearInventory);

  function recreateCharacter() {
    resetCharacter();
    resetSkills();
    clearInventory();
  }

  if (!classConfig) return null;

  return (
    <div className="relative flex h-dvh flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 py-3 text-zinc-100">
      <SceneBackdrop src="/choose_character_background_screen.png" />

      <div className="relative z-10 mb-3 shrink-0 text-center">
        <p className="font-title text-xs uppercase tracking-[0.3em] text-zinc-400 drop-shadow">Wulin.io</p>
        <h1 className="font-title mt-1 text-xl font-bold drop-shadow-lg sm:text-2xl">Sảnh Chờ</h1>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-3 flex gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 p-1">
          <button
            type="button"
            onClick={() => setTab("character")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-medium transition-colors ${
              tab === "character" ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-200"
            }`}
            style={tab === "character" ? { backgroundColor: accentColor } : undefined}
          >
            <User className="h-3.5 w-3.5" /> Nhân Vật
          </button>
          <button
            type="button"
            onClick={() => setTab("equipment")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-medium transition-colors ${
              tab === "equipment" ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-200"
            }`}
            style={tab === "equipment" ? { backgroundColor: accentColor } : undefined}
          >
            <Shirt className="h-3.5 w-3.5" /> Trang Bị
          </button>
        </div>

        {tab === "character" ? (
          <>
            <CharacterPreview classConfig={classConfig} />
            <div className="mt-3 max-h-[calc(100dvh-24rem)] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 backdrop-blur-sm">
              <StatsPanel character={effectiveCharacter} />
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 backdrop-blur-sm">
            <EquipmentPanel accentColor={accentColor} />
          </div>
        )}

        <div className="mt-4 flex justify-between gap-3">
          <button
            type="button"
            onClick={recreateCharacter}
            className="rounded-full border border-zinc-700 px-4 py-2.5 text-xs text-zinc-400 hover:border-zinc-500"
          >
            Tạo Lại Nhân Vật
          </button>
          <button
            type="button"
            onClick={onEnterRun}
            className="flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: accentColor }}
          >
            Vào Trận <Swords className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
