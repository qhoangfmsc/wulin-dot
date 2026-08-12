"use client";

import dynamic from "next/dynamic";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { getClassConfig } from "@/modules/character/data";
import type { PlayerCharacter } from "@/modules/character/types";
import { InventoryPanel } from "@/modules/inventory/components/InventoryPanel";
import { getEquipmentBonus, useInventoryStore } from "@/modules/inventory/store";
import { getUltimateSkill } from "@/modules/skills/data";
import { SkillTreePanel } from "@/modules/skills/components/SkillTreePanel";
import { useSkillStore } from "@/modules/skills/store";
import { mergeStatBonus } from "@/modules/stats/data";
import { StatsPanel } from "@/modules/stats/components/StatsPanel";
import { AbilityBar } from "./AbilityBar";
import { CharacterStatusBar } from "./CharacterStatusBar";
import { PanelShell } from "./PanelShell";
import { PauseOverlay } from "./PauseOverlay";
import { Radar } from "./Radar";
import { RadialMenu, type RadialMenuItem } from "./RadialMenu";

const GameCanvas = dynamic(
  () => import("@/modules/world/components/GameCanvas").then((m) => m.GameCanvas),
  { ssr: false },
);

const MENU_ITEMS: RadialMenuItem[] = [
  { id: "inventory", label: "Balo", icon: "Backpack" },
  { id: "stats", label: "Chỉ Số", icon: "ListChecks" },
  { id: "skills", label: "Kỹ Năng", icon: "Sparkles" },
];

export function HudShell({ character, onExitToLobby }: { character: PlayerCharacter; onExitToLobby: () => void }) {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const classConfig = getClassConfig(character.classId);
  const accentColor = classConfig?.color ?? "#38bdf8";

  const unlockedSkillIds = useSkillStore((s) => s.unlockedSkillIds);
  const ultimate = getUltimateSkill(character.classId);
  const isSublimated = unlockedSkillIds.includes(ultimate.id);
  const spriteUrl = isSublimated ? classConfig?.inGameSublimation : classConfig?.inGameSprite;

  const inventoryItems = useInventoryStore((s) => s.items);
  const equipped = useInventoryStore((s) => s.equipped);
  const equipmentBonus = getEquipmentBonus({ items: inventoryItems, equipped });
  const effectiveCharacter: PlayerCharacter = { ...character, stats: mergeStatBonus(character.stats, equipmentBonus) };

  useEffect(() => {
    if (!rootRef.current) return;
    gsap.fromTo(
      rootRef.current,
      { clipPath: "circle(0% at 50% 50%)" },
      { clipPath: "circle(150% at 50% 50%)", duration: 0.9, ease: "power2.inOut" },
    );
  }, []);

  return (
    <div ref={rootRef} className="relative h-dvh w-dvw overflow-hidden bg-zinc-950">
      <GameCanvas classId={character.classId} classColor={accentColor} spriteUrl={spriteUrl} stats={effectiveCharacter.stats} />

      <div className="pointer-events-none absolute inset-0">
        <CharacterStatusBar character={effectiveCharacter} spriteUrl={spriteUrl} />
        <Radar accentColor={accentColor} />
        <AbilityBar classId={character.classId} accentColor={accentColor} />

        {activePanel === "inventory" && (
          <PanelShell title="Balo" onClose={() => setActivePanel(null)}>
            <InventoryPanel />
          </PanelShell>
        )}
        {activePanel === "stats" && (
          <PanelShell title="Chỉ Số" onClose={() => setActivePanel(null)}>
            <StatsPanel character={effectiveCharacter} />
          </PanelShell>
        )}
        {activePanel === "skills" && (
          <PanelShell title="Kỹ Năng" onClose={() => setActivePanel(null)}>
            <SkillTreePanel classId={character.classId} />
          </PanelShell>
        )}

        <RadialMenu
          items={MENU_ITEMS}
          activeId={activePanel}
          onSelect={(id) => setActivePanel((cur) => (cur === id ? null : id))}
          accentColor={accentColor}
        />

        <PauseOverlay accentColor={accentColor} onExitToLobby={onExitToLobby} />
      </div>
    </div>
  );
}
