import Image from "next/image";
import { getClassConfig } from "@/modules/character/data";
import type { PlayerCharacter } from "@/modules/character/types";
import { useWorldStore } from "@/modules/world/store";

function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-6 text-[10px] font-medium text-zinc-500">{label}</span>
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export function CharacterStatusBar({ character, spriteUrl }: { character: PlayerCharacter; spriteUrl?: string | null }) {
  const classConfig = getClassConfig(character.classId);
  const color = classConfig?.color ?? "#38bdf8";
  const avatar = spriteUrl ?? classConfig?.inGameSprite;
  const worldPlayer = useWorldStore((s) => s.player);
  const hp = worldPlayer.maxHp > 0 ? worldPlayer.hp : character.stats.hp;
  const maxHp = worldPlayer.maxHp > 0 ? worldPlayer.maxHp : character.stats.hp;
  const level = worldPlayer.level;
  const expPct = Math.min(100, Math.round((worldPlayer.exp / worldPlayer.expToNext) * 100));

  return (
    <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-2 backdrop-blur">
      <div
        className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full"
        style={{ backgroundColor: `${color}22`, border: `1px solid ${color}55` }}
      >
        {avatar && <Image src={avatar} alt={classConfig?.sectName ?? ""} fill sizes="40px" className="object-cover object-top" />}
      </div>
      <div>
        <p className="text-xs font-semibold text-zinc-100">
          {character.name} <span className="text-zinc-500">· Cấp {level}</span>
        </p>
        <div className="mt-1 flex flex-col gap-0.5">
          <MiniBar label="HP" value={hp} max={maxHp} color="#ef4444" />
          <MiniBar label="NL" value={character.stats.energy} max={character.stats.energy} color="#38bdf8" />
          <div className="flex items-center gap-1.5">
            <span className="w-6 text-[10px] font-medium text-zinc-500">EXP</span>
            <div className="h-1 w-24 overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full rounded-full bg-amber-400" style={{ width: `${expPct}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
