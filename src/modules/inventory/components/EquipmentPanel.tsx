import { DynamicIcon } from "@/app/component/DynamicIcon";
import { useInventoryStore } from "../store";
import type { EquipSlot } from "../types";

const SLOT_LABEL: Record<EquipSlot, string> = { weapon: "Vũ Khí", armor: "Giáp", accessory: "Phụ Kiện" };
const SLOT_ICON: Record<EquipSlot, string> = { weapon: "Sword", armor: "Shirt", accessory: "Gem" };
const SLOTS: EquipSlot[] = ["weapon", "armor", "accessory"];

export function EquipmentPanel({ accentColor }: { accentColor: string }) {
  const items = useInventoryStore((s) => s.items);
  const equipped = useInventoryStore((s) => s.equipped);
  const equipItem = useInventoryStore((s) => s.equipItem);
  const unequipSlot = useInventoryStore((s) => s.unequipSlot);

  const equippableItems = items.filter((i) => i.slot);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2">
        {SLOTS.map((slot) => {
          const itemId = equipped[slot];
          const item = itemId ? items.find((i) => i.id === itemId) : undefined;
          return (
            <button
              key={slot}
              type="button"
              onClick={() => item && unequipSlot(slot)}
              title={item ? `${item.name} — bấm để tháo` : `${SLOT_LABEL[slot]} — chưa trang bị`}
              className="flex flex-col items-center gap-1 rounded-lg border p-2 text-center transition-colors"
              style={{
                borderColor: item ? `${accentColor}55` : "#3f3f46",
                backgroundColor: item ? `${accentColor}0d` : undefined,
              }}
            >
              <DynamicIcon
                name={item?.icon ?? SLOT_ICON[slot]}
                className="h-5 w-5"
                style={{ color: item ? accentColor : "#52525b" }}
              />
              <span className="text-[10px] text-zinc-400">{SLOT_LABEL[slot]}</span>
            </button>
          );
        })}
      </div>

      <div>
        <p className="mb-1.5 text-xs text-zinc-500">Vật phẩm có thể trang bị</p>
        {equippableItems.length === 0 ? (
          <p className="text-[11px] text-zinc-600">Chưa có vật phẩm nào trang bị được — nhặt thêm trong lúc chơi.</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {equippableItems.map((item) => {
              const isEquipped = item.slot && equipped[item.slot] === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => equipItem(item)}
                  disabled={isEquipped}
                  className={`flex items-center gap-2 rounded-lg border p-2 text-left transition-colors ${
                    isEquipped ? "cursor-default" : "hover:border-zinc-600"
                  }`}
                  style={{
                    borderColor: isEquipped ? `${accentColor}66` : "#3f3f46",
                    backgroundColor: isEquipped ? `${accentColor}14` : undefined,
                  }}
                >
                  <DynamicIcon name={item.icon} className="h-4 w-4 shrink-0" style={{ color: accentColor }} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-zinc-200">
                      {item.name}
                      {isEquipped && <span className="ml-1 text-[10px] text-zinc-500">(đã trang bị)</span>}
                    </p>
                    <p className="truncate text-[10px] text-zinc-500">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
