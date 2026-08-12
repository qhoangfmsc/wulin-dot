import { DynamicIcon } from "@/app/component/DynamicIcon";
import { useInventoryStore } from "../store";
import type { ItemRarity } from "../types";

const RARITY_COLOR: Record<ItemRarity, string> = {
  common: "#a1a1aa",
  rare: "#38bdf8",
  epic: "#a855f7",
  legendary: "#f59e0b",
};

const SLOT_COUNT = 12;

export function InventoryPanel() {
  const items = useInventoryStore((s) => s.items);
  const emptySlots = Math.max(0, SLOT_COUNT - items.length);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-zinc-100">Balo</p>
        <p className="text-[10px] text-zinc-500">
          {items.length}/{SLOT_COUNT}
        </p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            title={item.description}
            className="group relative flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border p-1.5"
            style={{ borderColor: `${RARITY_COLOR[item.rarity]}55`, backgroundColor: `${RARITY_COLOR[item.rarity]}0d` }}
          >
            <DynamicIcon name={item.icon} className="h-5 w-5" style={{ color: RARITY_COLOR[item.rarity] }} />
            <span className="absolute bottom-0.5 right-1 text-[10px] font-mono text-zinc-400">
              {item.quantity > 1 ? item.quantity : ""}
            </span>
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden w-max max-w-[10rem] -translate-x-1/2 rounded border border-zinc-700 bg-zinc-900 p-1.5 text-[10px] text-zinc-300 shadow-lg group-hover:block">
              <p className="font-medium text-zinc-100">{item.name}</p>
              <p className="text-zinc-500">{item.description}</p>
            </div>
          </div>
        ))}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square rounded-lg border border-dashed border-zinc-800" />
        ))}
      </div>
    </div>
  );
}
