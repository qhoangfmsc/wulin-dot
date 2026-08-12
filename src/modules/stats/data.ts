import type { CharacterClassId } from "@/modules/character/types";
import type { StatBlock, StatDef, StatId } from "./types";

/** Concrete combat stats, not abstract RPG jargon — a player should be able
 * to read "Sát Thương Vật Lý: 42" and immediately know what it means. */
export const STAT_DEFS: StatDef[] = [
  {
    id: "hp",
    name: "Máu",
    shortName: "HP",
    unit: "",
    barMax: 1000000000,
    description: "Lượng máu tối đa. Cạn máu là gục ngã.",
  },
  {
    id: "armor",
    name: "Giáp",
    shortName: "Giáp",
    unit: "",
    barMax: 1000000000,
    description: "Giảm sát thương vật lý phải chịu khi trúng đòn.",
  },
  {
    id: "magicResist",
    name: "Kháng Phép",
    shortName: "Kháng Phép",
    unit: "",
    barMax: 1000000000,
    description: "Giảm sát thương phép và kháng các trạng thái bất lợi.",
  },
  {
    id: "physicalDamage",
    name: "Sát Thương Vật Lý",
    shortName: "STVL",
    unit: "",
    barMax: 1000000000,
    description: "Sát thương gây ra bởi đòn đánh thường và vũ khí.",
  },
  {
    id: "magicDamage",
    name: "Sát Thương Phép",
    shortName: "STP",
    unit: "",
    barMax: 1000000000,
    description: "Sát thương gây ra bởi nội công và chiêu thức.",
  },
  {
    id: "energy",
    name: "Năng Lượng",
    shortName: "NL",
    unit: "",
    barMax: 1000000000,
    description: "Nội lực tiêu hao khi thi triển kỹ năng chủ động.",
  },
  {
    id: "attackSpeed",
    name: "Tốc Độ Đánh",
    shortName: "TĐ Đánh",
    unit: "",
    barMax: 10,
    decimals: 2,
    description: "Số đòn đánh ra mỗi giây. Cơ bản 1.00, tối đa 10.00 hit/s.",
  },
  {
    id: "moveSpeed",
    name: "Tốc Độ Di Chuyển",
    shortName: "TĐ Di Chuyển",
    unit: "",
    barMax: 500,
    description: "Tốc độ di chuyển trên bản đồ. Cơ bản 200, tối đa 500.",
  },
  {
    id: "critRate",
    name: "Tỉ Lệ Chí Mạng",
    shortName: "Chí Mạng",
    unit: "%",
    barMax: 100,
    description: "Điểm chí mạng — càng cao thì đòn đánh càng dễ trở thành chí mạng.",
  },
  {
    id: "luck",
    name: "May Mắn",
    shortName: "May Mắn",
    unit: "%",
    barMax: 70,
    description: "Vận may giang hồ, tăng tỉ lệ nhận vật phẩm hiếm khi khám phá.",
  },
];

/** Inclusive [min, max] roll range per stat, per class — defines each
 * sect's identity (e.g. Cuồng Hổ Môn rolls high HP/Giáp/STVL, low STP). */
export const STAT_RANGES: Record<CharacterClassId, Record<StatId, [number, number]>> = {
  "crane": {
    hp: [380, 520],
    armor: [15, 30],
    magicResist: [15, 30],
    physicalDamage: [30, 48],
    magicDamage: [8, 18],
    energy: [60, 90],
    attackSpeed: [1.15, 1.45],
    moveSpeed: [230, 280],
    critRate: [18, 35],
    luck: [15, 30],
  },
  "dragon": {
    hp: [340, 460],
    armor: [10, 22],
    magicResist: [28, 45],
    physicalDamage: [8, 16],
    magicDamage: [34, 52],
    energy: [110, 160],
    attackSpeed: [0.85, 1.1],
    moveSpeed: [200, 230],
    critRate: [10, 22],
    luck: [15, 30],
  },
  "tiger": {
    hp: [560, 760],
    armor: [32, 55],
    magicResist: [20, 36],
    physicalDamage: [26, 42],
    magicDamage: [6, 14],
    energy: [50, 80],
    attackSpeed: [0.95, 1.2],
    moveSpeed: [190, 215],
    critRate: [8, 18],
    luck: [10, 22],
  },
};

export const MAX_STAT_ROLLS = 3;

const STAT_DECIMALS: Partial<Record<StatId, number>> = Object.fromEntries(
  STAT_DEFS.filter((def) => def.decimals).map((def) => [def.id, def.decimals]),
);

/** Whole-number stats round to an integer; decimal stats (e.g. attackSpeed)
 * round to their defined precision instead of always flooring to an int. */
function randomInRange([min, max]: [number, number], decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round((Math.random() * (max - min) + min) * factor) / factor;
}

export function rollStatBlock(classId: CharacterClassId): StatBlock {
  const ranges = STAT_RANGES[classId];
  return Object.fromEntries(
    (Object.keys(ranges) as StatId[]).map((id) => [id, randomInRange(ranges[id], STAT_DECIMALS[id] ?? 0)]),
  ) as StatBlock;
}

/** Applies a flat equipment bonus on top of rolled base stats — used to
 * compute the character's real in-run numbers (see `getEquipmentBonus` in
 * `modules/inventory/store.ts`). Rounds decimal stats back to their defined
 * precision so e.g. attackSpeed doesn't drift to extra decimal places. */
export function mergeStatBonus(base: StatBlock, bonus: Partial<StatBlock>): StatBlock {
  const merged = { ...base };
  for (const [id, amount] of Object.entries(bonus) as [StatId, number][]) {
    const decimals = STAT_DECIMALS[id] ?? 0;
    const factor = 10 ** decimals;
    merged[id] = Math.round((merged[id] + amount) * factor) / factor;
  }
  return merged;
}
