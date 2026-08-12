import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StatBlock } from "@/modules/stats/types";
import type { EquipSlot, InventoryItem } from "./types";

type EquippedState = Record<EquipSlot, string | null>;

const EMPTY_EQUIPPED: EquippedState = { weapon: null, armor: null, accessory: null };

interface InventoryStoreState {
  items: InventoryItem[];
  equipped: EquippedState;
  setStarterItems: (items: InventoryItem[]) => void;
  addItem: (item: InventoryItem) => void;
  removeItem: (id: string, amount?: number) => void;
  clearInventory: () => void;
  equipItem: (item: InventoryItem) => void;
  unequipSlot: (slot: EquipSlot) => void;
}

export const useInventoryStore = create<InventoryStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      equipped: EMPTY_EQUIPPED,
      setStarterItems: (items) => set({ items, equipped: EMPTY_EQUIPPED }),
      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (id, amount = 1) => {
        set({
          items: get()
            .items.map((i) => (i.id === id ? { ...i, quantity: i.quantity - amount } : i))
            .filter((i) => i.quantity > 0),
        });
      },
      clearInventory: () => set({ items: [], equipped: EMPTY_EQUIPPED }),
      equipItem: (item) => {
        if (!item.slot) return;
        set({ equipped: { ...get().equipped, [item.slot]: item.id } });
      },
      unequipSlot: (slot) => set({ equipped: { ...get().equipped, [slot]: null } }),
    }),
    { name: "wulin-inventory" },
  ),
);

/** Sums the `statBonus` of every currently-equipped item into one partial
 * stat block — used to compute the character's real in-run stats on top of
 * their rolled base stats (see `HudShell`). Not a hook: takes the store
 * state directly so it can be called from both React and plain code. */
export function getEquipmentBonus(state: Pick<InventoryStoreState, "items" | "equipped">): Partial<StatBlock> {
  const bonus: Partial<StatBlock> = {};
  for (const itemId of Object.values(state.equipped)) {
    if (!itemId) continue;
    const item = state.items.find((i) => i.id === itemId);
    if (!item?.statBonus) continue;
    for (const [stat, amount] of Object.entries(item.statBonus) as [keyof StatBlock, number][]) {
      bonus[stat] = (bonus[stat] ?? 0) + amount;
    }
  }
  return bonus;
}
