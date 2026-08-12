"use client";

import { Lock } from "lucide-react";
import { COMBAT_LOADOUTS, HEAL_POTION } from "@/modules/combat/data";
import type { CombatAbility } from "@/modules/combat/types";
import type { CharacterClassId } from "@/modules/character/types";
import { SKILL_TREES } from "@/modules/skills/data";
import { useSkillStore } from "@/modules/skills/store";
import { useWorldStore } from "@/modules/world/store";
import { DynamicIcon } from "./DynamicIcon";

function AbilitySlot({
  ability,
  icon,
  name,
  locked,
  accentColor,
}: {
  ability: CombatAbility;
  icon: string;
  name: string;
  locked: boolean;
  accentColor: string;
}) {
  const cooldown = useWorldStore((s) => s.cooldowns[ability.id]);
  const remainingMs = cooldown ? Math.max(0, cooldown.readyAt - cooldown.now) : 0;
  const pct = cooldown && cooldown.cooldownMs > 0 ? Math.min(1, remainingMs / cooldown.cooldownMs) : 0;

  return (
    <div
      title={locked ? `${name} — chưa mở khóa` : `${name} (${ability.key})`}
      className={`pointer-events-auto relative flex h-12 w-12 items-center justify-center rounded-xl border bg-zinc-950/85 backdrop-blur transition-opacity ${
        locked ? "opacity-45" : ""
      }`}
      style={{ borderColor: locked ? "#3f3f46" : `${accentColor}66` }}
    >
      <DynamicIcon name={icon} className="h-5 w-5" style={{ color: locked ? "#71717a" : accentColor }} />

      {!locked && pct > 0 && (
        <div
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            background: `conic-gradient(rgba(9,9,11,0.75) ${pct * 360}deg, transparent ${pct * 360}deg)`,
          }}
        />
      )}

      {locked && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-zinc-950/50">
          <Lock className="h-3.5 w-3.5 text-zinc-500" />
        </div>
      )}

      <span className="pointer-events-none absolute -bottom-1.5 -right-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-1 text-[9px] font-semibold text-zinc-300">
        {ability.key}
      </span>
    </div>
  );
}

function EmptySlot({ keyLabel }: { keyLabel: string }) {
  return (
    <div
      title="Chưa có vật phẩm — để dành cho bình/thuốc sau này"
      className="pointer-events-auto relative flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800/60 bg-zinc-950/50"
    >
      <Lock className="h-4 w-4 text-zinc-700" />
      <span className="pointer-events-none absolute -bottom-1.5 -right-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-1 text-[9px] font-semibold text-zinc-600">
        {keyLabel}
      </span>
    </div>
  );
}

export function AbilityBar({ classId, accentColor }: { classId: CharacterClassId; accentColor: string }) {
  const unlockedSkillIds = useSkillStore((s) => s.unlockedSkillIds);
  const loadout = COMBAT_LOADOUTS[classId];
  const tree = SKILL_TREES[classId];

  const nodeFor = (skillId: string) => tree.find((n) => n.id === skillId);
  const skill1Node = nodeFor(loadout.skill1.id);
  const skill2Node = nodeFor(loadout.skill2.id);
  const ultimateNode = nodeFor(loadout.ultimate.id);

  return (
    <div className="pointer-events-none absolute bottom-28 left-1/2 flex -translate-x-1/2 gap-2">
      {skill1Node && (
        <AbilitySlot
          ability={loadout.skill1}
          icon={skill1Node.icon}
          name={skill1Node.name}
          locked={!unlockedSkillIds.includes(loadout.skill1.id)}
          accentColor={accentColor}
        />
      )}
      {skill2Node && (
        <AbilitySlot
          ability={loadout.skill2}
          icon={skill2Node.icon}
          name={skill2Node.name}
          locked={!unlockedSkillIds.includes(loadout.skill2.id)}
          accentColor={accentColor}
        />
      )}
      {ultimateNode && (
        <AbilitySlot
          ability={loadout.ultimate}
          icon={ultimateNode.icon}
          name={ultimateNode.name}
          locked={!unlockedSkillIds.includes(loadout.ultimate.id)}
          accentColor={accentColor}
        />
      )}
      <AbilitySlot ability={HEAL_POTION} icon="HeartPulse" name="Bình Máu" locked={false} accentColor={accentColor} />
      <EmptySlot keyLabel="I" />
      <EmptySlot keyLabel="O" />
    </div>
  );
}
