"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DynamicIcon } from "@/app/component/DynamicIcon";
import { getClassConfig } from "@/modules/character/data";
import type { CharacterClassId } from "@/modules/character/types";
import { SKILL_TREES, getUltimateSkill } from "../data";
import { useSkillStore } from "../store";
import type { SkillNode } from "../types";

gsap.registerPlugin(useGSAP);

function isUnlockable(node: SkillNode, unlocked: string[], points: number) {
  if (unlocked.includes(node.id)) return false;
  if (points < node.cost) return false;
  return node.requires.every((r) => unlocked.includes(r));
}

export function SkillTreePanel({ classId }: { classId: CharacterClassId }) {
  const classConfig = getClassConfig(classId);
  const color = classConfig?.color ?? "#38bdf8";
  const tree = SKILL_TREES[classId];
  const { unlockedSkillIds, skillPoints, unlockSkill } = useSkillStore();
  const ultimate = getUltimateSkill(classId);
  const ultimateUnlocked = unlockedSkillIds.includes(ultimate.id);
  const sublimationRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ultimateUnlocked || !sublimationRef.current) return;
      gsap.fromTo(
        sublimationRef.current,
        { opacity: 0, scale: 0.85, y: 8 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" },
      );
    },
    { dependencies: [ultimateUnlocked] },
  );

  const tiers = [0, 1, 2, 3] as const;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-zinc-100">{classConfig?.sectName} — Võ Học</p>
        <div className="rounded-full border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400">
          Điểm kỹ năng: <span className="font-mono text-zinc-200">{skillPoints}</span>
        </div>
      </div>

      {ultimateUnlocked && classConfig?.inGameSublimation && (
        <div
          ref={sublimationRef}
          className="flex items-center gap-3 rounded-xl border p-2"
          style={{ borderColor: `${color}66`, backgroundColor: `${color}14`, boxShadow: `0 0 20px ${color}33` }}
        >
          <div className="relative h-12 w-12 shrink-0">
            <Image src={classConfig.inGameSublimation} alt="Đại thành" fill sizes="48px" className="object-contain" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color }}>
              Đại Thành — {ultimate.name}
            </p>
            <p className="text-[11px] text-zinc-400">Thân pháp đã hòa vào linh khí môn phái, hình dạng ngoại công đổi khác.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {tiers.map((tier) => {
          const nodes = tree.filter((n) => n.tier === tier);
          if (nodes.length === 0) return null;
          return (
            <div key={tier} className="flex flex-col gap-1">
              <p className="text-[10px] uppercase tracking-wide text-zinc-600">
                {tier === 0 ? "Bị động khởi đầu" : `Tầng ${tier}`}
              </p>
              <div className={`grid gap-1.5 ${nodes.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                {nodes.map((node) => {
                  const unlocked = unlockedSkillIds.includes(node.id);
                  const unlockable = isUnlockable(node, unlockedSkillIds, skillPoints);
                  return (
                    <button
                      key={node.id}
                      type="button"
                      disabled={!unlockable}
                      onClick={() => unlockSkill(node.id, node.cost)}
                      className={`flex items-start gap-2 rounded-lg border p-2 text-left transition-colors ${
                        unlocked
                          ? "border-transparent"
                          : unlockable
                            ? "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
                            : "cursor-not-allowed border-zinc-800/60 bg-zinc-900/40 opacity-50"
                      }`}
                      style={unlocked ? { backgroundColor: `${color}1a`, borderColor: `${color}55` } : undefined}
                    >
                      <DynamicIcon
                        name={node.icon}
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: unlocked ? color : "#71717a" }}
                      />
                      <div>
                        <p className="text-xs font-medium text-zinc-200">
                          {node.name}
                          <span className="ml-1 text-[10px] text-zinc-500">
                            {node.type === "passive" ? "(bị động)" : "(chủ động)"}
                          </span>
                          {!unlocked && node.cost > 0 && (
                            <span className="ml-1 text-[10px] text-zinc-600">— cần {node.cost} điểm</span>
                          )}
                        </p>
                        <p className="text-[11px] text-zinc-500">{node.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
