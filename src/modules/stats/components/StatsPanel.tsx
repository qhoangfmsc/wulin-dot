import { getClassConfig } from "@/modules/character/data";
import type { PlayerCharacter } from "@/modules/character/types";
import { STAT_DEFS } from "../data";
import { StatBar } from "./StatBar";

export function StatsPanel({ character }: { character: PlayerCharacter }) {
  const classConfig = getClassConfig(character.classId);
  const color = classConfig?.color ?? "#38bdf8";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-100">{character.name}</p>
          <p className="text-xs text-zinc-500">
            {classConfig?.sectName} · Cấp {character.level}
          </p>
        </div>
        <div className="rounded-full border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400">
          EXP {character.exp}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {STAT_DEFS.map((def) => (
          <StatBar key={def.id} def={def} value={character.stats[def.id]} color={color} />
        ))}
      </div>
    </div>
  );
}
