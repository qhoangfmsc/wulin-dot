import Phaser from "phaser";
import { Actor } from "@/modules/world/actor";
import { getQuestStatus } from "@/modules/quest/store";
import type { QuestStatus } from "@/modules/quest/types";
import { NPCS } from "./data";
import type { NpcId, NpcSpawnConfig } from "./types";

const DEFAULT_DISPLAY_SIZE = 64;
export const DEFAULT_TALK_RADIUS = 120;

const BUBBLE_WIDTH = 34;
const BUBBLE_HEIGHT = 28;
const BUBBLE_OFFSET_Y = -52;
const BUBBLE_IDLE_ALPHA = 0.7;
const BUBBLE_GLOW_MIN_ALPHA = 0.85;

const MARKER_BY_STATUS: Partial<Record<QuestStatus, { glyph: string; color: string }>> = {
  not_started: { glyph: "?", color: "#f2c66d" },
  active: { glyph: "…", color: "#f4e6c4" },
  ready_to_turn_in: { glyph: "!", color: "#f59e0b" },
};

/** Draws the "speech bubble" marker above an NPC's head as a reusable
 * function (not hand-rolled per instance) — a second NPC later only needs
 * data (`NpcConfig`), not its own drawing code. CSS-only-fallback spirit
 * (like `WuxiaTooltip`/HUD panels): a wood-brown rounded box + tail, no art
 * asset required. */
function createSpeechBubble(scene: Phaser.Scene, x: number, y: number) {
  const graphics = scene.add.graphics();
  graphics.fillStyle(0x3a2c1a, 0.94);
  graphics.fillRoundedRect(-BUBBLE_WIDTH / 2, -BUBBLE_HEIGHT / 2, BUBBLE_WIDTH, BUBBLE_HEIGHT, 8);
  graphics.lineStyle(2, 0x7a5230, 1);
  graphics.strokeRoundedRect(-BUBBLE_WIDTH / 2, -BUBBLE_HEIGHT / 2, BUBBLE_WIDTH, BUBBLE_HEIGHT, 8);
  graphics.fillTriangle(-5, BUBBLE_HEIGHT / 2 - 1, 5, BUBBLE_HEIGHT / 2 - 1, 0, BUBBLE_HEIGHT / 2 + 9);

  const glyph = scene.add
    .text(0, -1, "?", { fontFamily: "sans-serif", fontSize: "18px", fontStyle: "bold", color: "#f2c66d" })
    .setOrigin(0.5);

  const container = scene.add.container(x, y + BUBBLE_OFFSET_Y, [graphics, glyph]);
  container.setAlpha(BUBBLE_IDLE_ALPHA);
  return { container, glyph };
}

/** An interactable NPC placed via `MapModule.npcsByCell` — a stationary
 * `Actor` (see `world/actor.ts`, same "living sprite" primitive `Monster`
 * uses) plus a quest-status speech bubble above its head that doubles as
 * the in-range interaction cue: it glows/pulses while the player is close
 * enough to press Space (see `setInRange`). Kept in its own module rather
 * than folded into `world/monster.ts` — NPCs are a narrative-driven
 * concern, not combat, and expected to grow (more NPCs/quests) independent
 * of monster tuning. `mapScene.ts` only calls these methods, same
 * "orchestrator calls, entity owns its own state" split as `Monster`. */
export class Npc {
  readonly id: NpcId;
  readonly actor: Actor;
  readonly talkRadius: number;
  private readonly displaySize: number;
  private readonly bubble: ReturnType<typeof createSpeechBubble>;
  private glowTween: Phaser.Tweens.Tween | null = null;
  private inRange = false;

  constructor(scene: Phaser.Scene, spawn: NpcSpawnConfig, x: number, y: number, depth: number, textureKey: string | null) {
    this.id = spawn.npcId;
    this.talkRadius = spawn.talkRadius ?? DEFAULT_TALK_RADIUS;
    this.displaySize = spawn.displaySize ?? DEFAULT_DISPLAY_SIZE;
    this.actor = new Actor(scene, {
      x,
      y,
      textureKey,
      displaySize: this.displaySize,
      fallbackColor: 0x60a5fa,
      depth,
    });
    this.bubble = createSpeechBubble(scene, x, y);
    this.bubble.container.setDepth(depth + 1);
    this.refreshMarker();
  }

  get x() {
    return this.actor.x;
  }

  get y() {
    return this.actor.y;
  }

  /** Bounding box for the shared obstacle-collision check in
   * `mapScene.ts`'s `obstacleRects` — an NPC blocks movement like a real
   * person standing there, reusing existing collision math instead of a
   * separate one just for NPCs. */
  get collisionBox() {
    const half = this.displaySize / 2;
    return { left: this.x - half, right: this.x + half, top: this.y - half, bottom: this.y + half };
  }

  /** Re-reads quest status for every quest this NPC has and shows the most
   * urgent marker (ready-to-turn-in > active > not-started); hides the
   * bubble once every quest is completed. Cheap to call every frame —
   * `getQuestStatus` is a plain object read (`getState()`), no
   * subscription needed since a Phaser scene can't use hooks. */
  refreshMarker() {
    const status = this.mostUrgentStatus();
    const marker = status ? MARKER_BY_STATUS[status] : undefined;
    this.bubble.container.setVisible(Boolean(marker));
    if (marker) {
      this.bubble.glyph.setText(marker.glyph).setColor(marker.color);
    }
  }

  private mostUrgentStatus(): QuestStatus | null {
    const statuses = NPCS[this.id].questIds.map((id) => getQuestStatus(id));
    if (statuses.includes("ready_to_turn_in")) return "ready_to_turn_in";
    if (statuses.includes("active")) return "active";
    if (statuses.includes("not_started")) return "not_started";
    return null;
  }

  isInRange(playerX: number, playerY: number): boolean {
    return Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY) <= this.talkRadius;
  }

  /** Call once per frame with whether the player is currently in range —
   * starts/stops the "lit up" glow tween only on the false→true /
   * true→false edges, not every frame. */
  setInRange(scene: Phaser.Scene, inRange: boolean) {
    if (inRange === this.inRange) return;
    this.inRange = inRange;
    if (inRange) {
      this.glowTween = scene.tweens.add({
        targets: this.bubble.container,
        alpha: { from: BUBBLE_GLOW_MIN_ALPHA, to: 1 },
        scale: { from: 1, to: 1.08 },
        duration: 500,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    } else {
      this.glowTween?.stop();
      this.glowTween = null;
      this.bubble.container.setAlpha(BUBBLE_IDLE_ALPHA).setScale(1);
    }
  }

  destroy() {
    this.glowTween?.stop();
    this.bubble.container.destroy();
    this.actor.destroy();
  }
}
