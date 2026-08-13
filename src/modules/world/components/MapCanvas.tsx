"use client";

import Phaser from "phaser";
import { useEffect, useRef } from "react";
import { createMapScene, type MapEdge, type ObstacleConfig, type WallConfig } from "../mapScene";
import type { MonsterSpawnConfig } from "../monster";

interface MapCanvasProps {
  floorSrc: string;
  spriteUrl: string;
  weaponSpriteSrc: string;
  playerAttackDamage: number;
  walls: WallConfig;
  wallSrc: string;
  tint?: number;
  obstacles?: ObstacleConfig[];
  monsters?: MonsterSpawnConfig[];
  roomScale?: number;
  spawnAt: MapEdge | null;
  onReachEdge: (edge: MapEdge) => void;
}

export function MapCanvas({
  floorSrc,
  spriteUrl,
  weaponSpriteSrc,
  playerAttackDamage,
  walls,
  wallSrc,
  tint,
  obstacles,
  monsters,
  roomScale,
  spawnAt,
  onReachEdge,
}: MapCanvasProps) {
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
      backgroundColor: "#1c1917",
      scale: {
        mode: Phaser.Scale.RESIZE,
        width: container.clientWidth,
        height: container.clientHeight,
      },
      scene: [
        createMapScene({
          floorSrc,
          spriteUrl,
          weaponSpriteSrc,
          playerAttackDamage,
          walls,
          wallSrc,
          tint,
          obstacles,
          monsters,
          roomScale,
          spawnAt,
          onReachEdge,
        }),
      ],
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
  }, [floorSrc, spriteUrl, weaponSpriteSrc, playerAttackDamage, walls, wallSrc, tint, obstacles, monsters, roomScale, spawnAt]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
