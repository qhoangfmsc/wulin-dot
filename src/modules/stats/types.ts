export type StatId =
  | "hp"
  | "armor"
  | "magicResist"
  | "physicalDamage"
  | "magicDamage"
  | "energy"
  | "attackSpeed"
  | "moveSpeed"
  | "critRate"
  | "luck";

export type StatBlock = Record<StatId, number>;

export interface StatDef {
  id: StatId;
  name: string;
  shortName: string;
  description: string;
  /** Suffix shown after the number, e.g. "%" for rate-based stats. */
  unit: string;
  /** Visual ceiling used to scale the progress bar — not a hard gameplay cap. */
  barMax: number;
  /** Decimal places to round/display to, e.g. 2 for attack speed (1.35). Omit for whole numbers. */
  decimals?: number;
}
