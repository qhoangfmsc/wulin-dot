import type { StatDef } from "../types";

interface StatBarProps {
  def: StatDef;
  value: number;
  max?: number;
  color?: string;
}

export function StatBar({ def, value, max, color = "#38bdf8" }: StatBarProps) {
  const barMax = max ?? def.barMax;
  const pct = Math.min(100, Math.round((value / barMax) * 100));
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-28 shrink-0 truncate text-zinc-400" title={def.description}>
        {def.name}
      </span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-12 shrink-0 text-right font-mono text-zinc-300">
        {def.decimals ? value.toFixed(def.decimals) : value}
        {def.unit}
      </span>
    </div>
  );
}
