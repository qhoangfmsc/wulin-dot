/** No real gameplay effect from learning a skill yet (see `data.ts`) — this
 * shape only drives the tree layout + the level/prerequisite gate. */
export interface SkillNode {
  id: string;
  name: string;
  description: string;
  requiredLevel: number;
  /** 0-indexed tier/column — `SkillsPanel` lays out 1 row per tier, higher
   * tiers below, gated behind their `prerequisiteIds`. */
  tier: number;
  prerequisiteIds: string[];
}
