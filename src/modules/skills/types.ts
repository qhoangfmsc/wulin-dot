export type SkillNodeType = "passive" | "active";

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  type: SkillNodeType;
  tier: 0 | 1 | 2 | 3;
  icon: string; // lucide-react icon name
  requires: string[]; // node ids that must already be unlocked
  cost: number; // skill points required (tier 0 is always free/auto-unlocked)
}
