import type { StatBlock } from "@/modules/stats/types";

/** The 3 playable wuxia sects, keyed by their animal — English ids only, all
 * Vietnamese lore lives in display fields (sectName, title, description...).
 * Add new ids here when a new class is designed. */
export type CharacterClassId = "crane" | "dragon" | "tiger";

export type FacingDirection = "up" | "down" | "left" | "right";

/** Static identity + lore + theming for a class. No stats/skills/items here —
 * those live in their own modules and are joined by `id`. */
export interface CharacterClassConfig {
  id: CharacterClassId;
  sectName: string; // wuxia sect, e.g. "Bạch Hạc Môn"
  title: string; // flavorful full title, e.g. "Bạch Hạc Xạ Ảnh"
  role: string; // gameplay role, e.g. "Cung Thủ"
  animal: string; // themed animal, e.g. "Hạc"
  tagline: string;
  description: string;
  weapon: string;
  color: string; // primary hex, used for the top-down dot + UI accents
  accentColor: string; // secondary hex
  /** Placeholders — wire up real art later without touching game logic. */
  coverImage: string | null;
  inGameSprite: string | null;
  /** Powered-up form shown once the class's tier-3 ultimate skill is unlocked. */
  inGameSublimation: string | null;
}

export interface PlayerCharacter {
  name: string;
  classId: CharacterClassId;
  stats: StatBlock;
  level: number;
  exp: number;
  createdAt: number;
}
