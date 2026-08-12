"use client";

import Phaser from "phaser";
import { useEffect, useRef } from "react";
import type { CharacterClassId } from "@/modules/character/types";
import type { StatBlock } from "@/modules/stats/types";
import { createMainScene } from "../scene";

interface GameCanvasProps {
  classId: CharacterClassId;
  classColor: string;
  spriteUrl?: string | null;
  stats: StatBlock;
}

export function GameCanvas({ classId, classColor, spriteUrl, stats }: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Passing "100%" strings to Phaser's Scale config only gets resolved
    // once, at boot — if the container hasn't settled into its final layout
    // size yet at that instant, the canvas locks onto a stale (too-small)
    // size and never fully fills the parent, leaving a visible gap. Measure
    // the actual pixel size instead, and keep it in sync on window resize.
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: container,
      backgroundColor: "#09090b",
      scale: {
        mode: Phaser.Scale.RESIZE,
        width: container.clientWidth,
        height: container.clientHeight,
      },
      scene: [createMainScene({ classId, classColor, spriteUrl, stats })],
    });
    gameRef.current = game;

    function handleResize() {
      game.scale.resize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      game.destroy(true);
      gameRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, classColor, spriteUrl]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
