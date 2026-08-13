"use client";

import { useState } from "react";
import { Check, Lock, Sparkles } from "lucide-react";
import { useCharacterStore } from "@/modules/character/store";
import { SKILL_TIERS, SKILL_TREE, SKILL_TREE_BY_ID } from "@/modules/skills/data";
import { getLearnEligibility, learnSkill, useSkillsStore } from "@/modules/skills/store";
import type { SkillNode } from "@/modules/skills/types";
import { WuxiaModal } from "./WuxiaModal";

type NodeState = "learned" | "eligible" | "locked";

function SkillNodeButton({ node, state, selected, onClick }: { node: SkillNode; state: NodeState; selected: boolean; onClick: () => void }) {
  const bg =
    state === "learned"
      ? "linear-gradient(160deg, #f2c66d, #b8892f)"
      : state === "eligible"
        ? "linear-gradient(160deg, #e6d1a1, #c9a865)"
        : "linear-gradient(160deg, #cbb98f55, #a8916677)";
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-1">
      <div
        className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 shadow transition-transform hover:scale-105"
        style={{ borderColor: selected ? "#3f2a16" : "#7a5230", background: bg, opacity: state === "locked" ? 0.65 : 1 }}
      >
        {state === "learned" ? (
          <Check className="h-5 w-5 text-[#3f2a16]" />
        ) : state === "locked" ? (
          <Lock className="h-5 w-5 text-[#5c3a21]" />
        ) : (
          <Sparkles className="h-5 w-5 text-[#5c3a21]" />
        )}
      </div>
      <span className="w-16 text-center text-[10px] font-semibold leading-tight text-[#5c3a21]">{node.name}</span>
    </button>
  );
}

/** Skill TREE, not a grid of locked boxes — tiers laid out top→bottom
 * purely from `SkillNode.tier`/`prerequisiteIds` (`modules/skills/data.ts`),
 * click a node to see its "Học" (learn) requirement and act on it. Learning
 * doesn't grant a real gameplay bonus yet, but the level/prerequisite gate
 * and persisted progress (`modules/skills/store.ts`) are real. */
export function SkillsPanel({ onClose }: { onClose: () => void }) {
  const level = useCharacterStore((s) => s.level);
  const learnedSkillIds = useSkillsStore((s) => s.learnedSkillIds);
  const [selectedId, setSelectedId] = useState<string>(SKILL_TREE[0].id);

  const selected = SKILL_TREE_BY_ID[selectedId];
  const eligibility = getLearnEligibility(selectedId, level, learnedSkillIds);
  const isLearned = learnedSkillIds.includes(selectedId);
  const prereqNames = selected.prerequisiteIds.map((id) => SKILL_TREE_BY_ID[id].name);

  function nodeState(node: SkillNode): NodeState {
    if (learnedSkillIds.includes(node.id)) return "learned";
    return getLearnEligibility(node.id, level, learnedSkillIds).eligible ? "eligible" : "locked";
  }

  return (
    <WuxiaModal title="Kỹ Năng" onClose={onClose}>
      <div className="flex flex-col gap-1">
        {SKILL_TIERS.map((tier, tierIndex) => (
          <div key={tier}>
            {tierIndex > 0 && <div className="mx-auto h-4 w-0.5" style={{ background: "#7a523066" }} />}
            <div className="flex justify-center gap-6">
              {SKILL_TREE.filter((n) => n.tier === tier).map((node) => (
                <SkillNodeButton
                  key={node.id}
                  node={node}
                  state={nodeState(node)}
                  selected={selectedId === node.id}
                  onClick={() => setSelectedId(node.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border-2 p-3" style={{ borderColor: "#7a523033" }}>
        <p className="text-base font-bold text-[#3f2a16]">{selected.name}</p>
        <p className="mt-1 text-sm text-[#5c3a21]">{selected.description}</p>
        <p className="mt-2 text-xs text-[#8a6a3f]">
          Yêu cầu: Cấp {selected.requiredLevel}
          {prereqNames.length > 0 && ` · Học trước: ${prereqNames.join(", ")}`}
        </p>

        {isLearned ? (
          <p className="mt-3 text-sm font-semibold" style={{ color: "#b8892f" }}>
            Đã học
          </p>
        ) : (
          <button
            type="button"
            disabled={!eligibility.eligible}
            onClick={() => learnSkill(selectedId, level)}
            className="mt-3 w-full rounded-full border-2 px-4 py-2 text-sm font-semibold disabled:opacity-40"
            style={{ borderColor: "#7a5230", color: "#5c3a21" }}
          >
            {eligibility.eligible ? "Học" : eligibility.reason}
          </button>
        )}
      </div>
    </WuxiaModal>
  );
}
