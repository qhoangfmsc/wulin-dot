"use client";

import Phaser from "phaser";
import { useEffect, useRef } from "react";
import { createMapScene, MAP_SCENE_KEY, type MapEdge, type MapSceneInstance, type ObstacleConfig, type WallConfig } from "../mapScene";
import type { MonsterSpawnConfig } from "../monster";
import type { NpcId, NpcSpawnConfig } from "@/modules/npc/types";

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
  npcs?: NpcSpawnConfig[];
  roomScale?: number;
  spawnAt: MapEdge | null;
  onReachEdge: (edge: MapEdge) => void;
  onPlayerDeath: () => void;
  onNpcInteract: (npcId: NpcId) => void;
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
  npcs,
  roomScale,
  spawnAt,
  onReachEdge,
  onPlayerDeath,
  onNpcInteract,
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
    //
    // Scale mode is `NONE`, not `RESIZE` — Phaser has no built-in
    // devicePixelRatio handling (confirmed by reading
    // node_modules/phaser/src/scale/ScaleManager.js: `RESIZE` mode always
    // sets the canvas backing-store size equal to the CSS size and ignores
    // `zoom` entirely), so on a Retina display the canvas rasterizes at
    // CSS-pixel resolution and the browser stretches it, blurring
    // everything. `NONE` mode's `resize()` DOES respect `zoom`: we ask for
    // a backing store `dpr`× bigger than the CSS box, then set
    // `zoom: 1/dpr` so the CSS size (and therefore on-screen size) is
    // unchanged. `mapScene.ts` compensates by dividing `this.scale.width/
    // height` back down by `dpr` for room-bounds math and multiplying
    // camera zoom by `dpr` — see its `dpr` option — so no gameplay
    // coordinate (`xFrac`, aggro radius, room size, ...) has to change.
    const dpr = window.devicePixelRatio || 1;
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: container,
      backgroundColor: "#1c1917",
      scale: {
        mode: Phaser.Scale.NONE,
        zoom: 1 / dpr,
        width: container.clientWidth * dpr,
        height: container.clientHeight * dpr,
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
          npcs,
          roomScale,
          spawnAt,
          onReachEdge,
          onPlayerDeath,
          onNpcInteract,
          dpr,
        }),
      ],
    });
    gameRef.current = game;

    function handleResize() {
      game.scale.resize(container.clientWidth * dpr, container.clientHeight * dpr);
    }
    // `NONE` mode doesn't auto-size on boot the way `RESIZE` does — resize
    // once immediately so the very first frame already has the right
    // backing-store size and CSS style, not just subsequent window resizes.
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      game.destroy(true);
      gameRef.current = null;
    };
    // `spriteUrl`/`weaponSpriteSrc`/`playerAttackDamage` are DELIBERATELY
    // excluded — see the effect below. Everything else here is genuinely
    // tied to WHICH ROOM this is (layout/walls/monsters/entry point), so a
    // change legitimately means "throw the old scene away and build the
    // room fresh."
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floorSrc, walls, wallSrc, tint, obstacles, monsters, npcs, roomScale, spawnAt]);

  // Character/weapon/attack changes (picking a different character, equipping
  // a different weapon) used to be lumped into the effect above — which
  // rebuilt the ENTIRE Phaser scene (`game.destroy(true)` + `new
  // Phaser.Game()`) just because a cosmetic/stat prop changed, resetting the
  // whole room: monsters respawned, player snapped back to the entry point.
  // These 3 are cosmetic/stat values, not room identity, so they update the
  // ALREADY-RUNNING scene in place via `updateLoadout()` (see
  // `mapScene.ts`) instead of tearing anything down. No-ops harmlessly if
  // the scene hasn't finished `create()` yet (its own first frame already
  // used these same fresh values from the closure above).
  useEffect(() => {
    const scene = gameRef.current?.scene.getScene(MAP_SCENE_KEY) as MapSceneInstance | undefined;
    scene?.updateLoadout(spriteUrl, weaponSpriteSrc, playerAttackDamage);
  }, [spriteUrl, weaponSpriteSrc, playerAttackDamage]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
