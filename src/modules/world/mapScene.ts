import Phaser from "phaser";
import { Actor } from "./actor";

const DEFAULT_ROOM_SCALE = 1.5; // each room is ~1.5x the viewport by default, so there's real room to pan
const INSET = 20;
const WALL_THICKNESS = 56;
const EDGE_TRIGGER_MARGIN = 40;
const SPAWN_OFFSET = 70; // how far from the entry edge the player appears after linking
const PLAYER_DISPLAY_WIDTH = 56;
const MOVE_SPEED = 190;
const OBSTACLE_PADDING = 18; // roughly the player's collision radius
const SPRITE_LOAD_WIDTH = 256;
// Nearest width Next's default image optimizer will actually serve (its
// `imageSizes`/`deviceSizes` are a fixed allow-list — 16/32/48/64/96/128/...
// — arbitrary widths like the literal WALL_THICKNESS get rejected).
const WALL_TEXTURE_LOAD_WIDTH = 64;

// Camera pulls back a bit near any edge — gives a peek of "there's more
// room here, and something beyond it" instead of a hard, static crop.
const ZOOM_NEAR_EDGE = 0.8;
const ZOOM_CENTER = 1;
const ZOOM_TRIGGER_DIST = 240;
const ZOOM_LERP_SPEED = 4;

export type MapEdge = "up" | "down" | "left" | "right";

/** Which edges are blocked for a given room — `true` = wall (rendered with
 * `wallSrc`, movement clamps there, player gets stuck, no transition). An
 * edge missing from this record (or `false`) is OPEN by default: walking
 * into it links to another room. A wall must be explicitly configured to
 * block — nothing blocks "by accident". */
export type WallConfig = Partial<Record<MapEdge, boolean>>;

/** A static obstacle inside a room that blocks movement — position is a
 * FRACTION (0-1) of room width/height rather than raw pixels, so placement
 * stays consistent as room size varies with `roomScale`/viewport. Omit
 * `spriteSrc` to get a plain placeholder box (no art required to start
 * using these). */
export interface ObstacleConfig {
  xFrac: number;
  yFrac: number;
  width: number;
  height: number;
  spriteSrc?: string;
}

interface ObstacleRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/** Same reasoning as `optimizedSpriteUrl` in `scene.ts` — pre-shrink huge
 * source PNGs server-side via Next's image optimizer so Phaser doesn't have
 * to downscale them hard at runtime (looks soft otherwise). */
function optimizedSpriteUrl(src: string, width: number = SPRITE_LOAD_WIDTH): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

interface MapSceneOptions {
  floorSrc: string;
  spriteUrl: string;
  walls: WallConfig;
  /** Wall art for whichever edges are blocked (e.g. `/ground/log_wall.png`,
   * `/ground/lava_wall.png`) — only rendered on edges where `walls[edge]`
   * is `true`. */
  wallSrc: string;
  /** Flat color wash over the floor (e.g. a boss/special room tint) — hex
   * int like `0xef4444`, or omit for no tint. */
  tint?: number;
  /** Static blockers scattered around the room — empty array is fine. */
  obstacles?: ObstacleConfig[];
  /** Room size = viewport × this multiplier. Defaults to 1.5 — expose it so
   * a room can ask for something bigger/smaller later without touching
   * this file. */
  roomScale?: number;
  /** Where the player should appear on entry — `null` spawns at room center
   * (first load); an edge spawns just inside that edge (arriving from a
   * map-link transition on the opposite edge of the previous room). */
  spawnAt: MapEdge | null;
  onReachEdge: (edge: MapEdge) => void;
}

/** One walk-around room of the grid-based world map (see `mapGrid.ts` /
 * `MapScreen.tsx`) — no combat, no monsters, just movement + room-to-room
 * links + static obstacles.
 *
 * Room size is `roomScale` × the actual canvas size, computed fresh each
 * time from `this.scale.width/height` — bigger than the viewport on purpose
 * so the camera has real room to follow the player around instead of
 * sitting static. All 4 edges CAN link to another room (walk into one,
 * fade, appear just inside the matching edge of the next room) — but only
 * if that edge isn't walled per `walls` (auto-derived from the grid, see
 * `getCellWalls`). A walled edge renders `wallSrc` and is a dead end:
 * movement clamps there, the player gets stuck, no transition. */
export function createMapScene({
  floorSrc,
  spriteUrl,
  walls,
  wallSrc,
  tint,
  obstacles = [],
  roomScale = DEFAULT_ROOM_SCALE,
  spawnAt,
  onReachEdge,
}: MapSceneOptions) {
  return class MapScene extends Phaser.Scene {
    private playerActor!: Actor;
    private keys!: {
      up: Phaser.Input.Keyboard.Key;
      left: Phaser.Input.Keyboard.Key;
      down: Phaser.Input.Keyboard.Key;
      right: Phaser.Input.Keyboard.Key;
      upArrow: Phaser.Input.Keyboard.Key;
      leftArrow: Phaser.Input.Keyboard.Key;
      downArrow: Phaser.Input.Keyboard.Key;
      rightArrow: Phaser.Input.Keyboard.Key;
    };
    private triggered = false;
    private playMinX = 0;
    private playMaxX = 0;
    private playMinY = 0;
    private playMaxY = 0;
    private obstacleRects: ObstacleRect[] = [];

    constructor() {
      super("map-scene");
    }

    preload() {
      this.load.image("room-floor", optimizedSpriteUrl(floorSrc, 640));
      this.load.image("room-player", optimizedSpriteUrl(spriteUrl));
      // Loaded near WALL_THICKNESS (square) — these are seamless tileable
      // textures, not pre-cut strips, so the TileSprite tiles them ~1:1 with
      // the rendered wall thickness. Loading at some unrelated fixed width
      // (e.g. 256) made the TileSprite show only a cropped sliver of the
      // texture instead of the intended tiled pattern.
      if (Object.values(walls).some(Boolean)) this.load.image("room-wall", optimizedSpriteUrl(wallSrc, WALL_TEXTURE_LOAD_WIDTH));
      obstacles.forEach((o, i) => {
        if (o.spriteSrc) this.load.image(`obstacle-${i}`, optimizedSpriteUrl(o.spriteSrc, 256));
      });
    }

    create() {
      const roomWidth = Math.round(this.scale.width * roomScale);
      const roomHeight = Math.round(this.scale.height * roomScale);

      const leftInset = walls.left ? WALL_THICKNESS + INSET : INSET;
      const rightInset = walls.right ? WALL_THICKNESS + INSET : INSET;
      const topInset = walls.up ? WALL_THICKNESS + INSET : INSET;
      const bottomInset = walls.down ? WALL_THICKNESS + INSET : INSET;
      this.playMinX = leftInset;
      this.playMaxX = roomWidth - rightInset;
      this.playMinY = topInset;
      this.playMaxY = roomHeight - bottomInset;

      this.cameras.main.setBounds(0, 0, roomWidth, roomHeight);

      this.add.tileSprite(0, 0, roomWidth, roomHeight, "room-floor").setOrigin(0, 0);
      // A translucent color rect reads far more clearly as "this room is
      // special" than TileSprite.setTint() — multiply-mode tint against a
      // busy, already-colorful texture (grass/dirt) comes out as a muddy,
      // barely-visible smear rather than an obvious color cue.
      if (tint !== undefined) {
        this.add.rectangle(0, 0, roomWidth, roomHeight, tint, 0.3).setOrigin(0, 0).setDepth(1);
      }

      if (this.textures.exists("room-wall")) {
        if (walls.up) this.add.tileSprite(0, 0, roomWidth, WALL_THICKNESS, "room-wall").setOrigin(0, 0).setDepth(6);
        if (walls.down) {
          this.add.tileSprite(0, roomHeight - WALL_THICKNESS, roomWidth, WALL_THICKNESS, "room-wall").setOrigin(0, 0).setDepth(6);
        }
        if (walls.left) this.add.tileSprite(0, 0, WALL_THICKNESS, roomHeight, "room-wall").setOrigin(0, 0).setDepth(6);
        if (walls.right) {
          this.add.tileSprite(roomWidth - WALL_THICKNESS, 0, WALL_THICKNESS, roomHeight, "room-wall").setOrigin(0, 0).setDepth(6);
        }
      }

      this.obstacleRects = obstacles.map((o, i) => {
        const x = o.xFrac * roomWidth;
        const y = o.yFrac * roomHeight;
        const key = `obstacle-${i}`;
        if (this.textures.exists(key)) {
          this.add.image(x, y, key).setDisplaySize(o.width, o.height).setDepth(4);
        } else {
          this.add
            .rectangle(x, y, o.width, o.height, 0x44403c)
            .setStrokeStyle(2, 0x78716c)
            .setDepth(4);
        }
        return { left: x - o.width / 2, right: x + o.width / 2, top: y - o.height / 2, bottom: y + o.height / 2 };
      });

      let startX = roomWidth / 2;
      let startY = roomHeight / 2;
      if (spawnAt === "left") startX = this.playMinX + SPAWN_OFFSET;
      else if (spawnAt === "right") startX = this.playMaxX - SPAWN_OFFSET;
      else if (spawnAt === "up") startY = this.playMinY + SPAWN_OFFSET;
      else if (spawnAt === "down") startY = this.playMaxY - SPAWN_OFFSET;

      this.playerActor = new Actor(this, {
        x: startX,
        y: startY,
        textureKey: this.textures.exists("room-player") ? "room-player" : null,
        displaySize: PLAYER_DISPLAY_WIDTH,
        fallbackColor: 0xf59e0b,
        depth: 10,
      });
      this.cameras.main.startFollow(this.playerActor.container, true, 0.15, 0.15);
      this.cameras.main.setZoom(ZOOM_CENTER);

      this.keys = this.input.keyboard!.addKeys({
        up: "W",
        left: "A",
        down: "S",
        right: "D",
        upArrow: "UP",
        leftArrow: "LEFT",
        downArrow: "DOWN",
        rightArrow: "RIGHT",
      }) as typeof this.keys;
    }

    private isBlockedByObstacle(x: number, y: number): boolean {
      return this.obstacleRects.some(
        (r) =>
          x > r.left - OBSTACLE_PADDING &&
          x < r.right + OBSTACLE_PADDING &&
          y > r.top - OBSTACLE_PADDING &&
          y < r.bottom + OBSTACLE_PADDING,
      );
    }

    update(_time: number, delta: number) {
      const dt = Math.min(delta / 1000, 0.05);

      let vx = 0;
      let vy = 0;
      if (this.keys.left.isDown || this.keys.leftArrow.isDown) vx -= 1;
      if (this.keys.right.isDown || this.keys.rightArrow.isDown) vx += 1;
      if (this.keys.up.isDown || this.keys.upArrow.isDown) vy -= 1;
      if (this.keys.down.isDown || this.keys.downArrow.isDown) vy += 1;
      const isMoving = vx !== 0 || vy !== 0;
      let moveAngle: number | null = null;

      if (isMoving) {
        const len = Math.hypot(vx, vy);
        vx /= len;
        vy /= len;

        // Axis-separated collision so bumping into an obstacle slides you
        // along it instead of just freezing dead in your tracks.
        const desiredX = Phaser.Math.Clamp(this.playerActor.x + vx * MOVE_SPEED * dt, this.playMinX, this.playMaxX);
        const desiredY = Phaser.Math.Clamp(this.playerActor.y + vy * MOVE_SPEED * dt, this.playMinY, this.playMaxY);
        const finalX = this.isBlockedByObstacle(desiredX, this.playerActor.y) ? this.playerActor.x : desiredX;
        const finalY = this.isBlockedByObstacle(finalX, desiredY) ? this.playerActor.y : desiredY;
        this.playerActor.setPosition(finalX, finalY);
        moveAngle = Math.atan2(vy, vx);
      }
      this.playerActor.update(dt, moveAngle);

      const nearestEdgeDist = Math.min(
        this.playerActor.x - this.playMinX,
        this.playMaxX - this.playerActor.x,
        this.playerActor.y - this.playMinY,
        this.playMaxY - this.playerActor.y,
      );
      const t = Phaser.Math.Clamp(nearestEdgeDist / ZOOM_TRIGGER_DIST, 0, 1);
      const targetZoom = Phaser.Math.Linear(ZOOM_NEAR_EDGE, ZOOM_CENTER, t);
      this.cameras.main.zoom = Phaser.Math.Linear(this.cameras.main.zoom, targetZoom, Math.min(1, dt * ZOOM_LERP_SPEED));

      if (!this.triggered) {
        const nearEdges: [MapEdge, boolean][] = [
          ["left", this.playerActor.x <= this.playMinX + EDGE_TRIGGER_MARGIN],
          ["right", this.playerActor.x >= this.playMaxX - EDGE_TRIGGER_MARGIN],
          ["up", this.playerActor.y <= this.playMinY + EDGE_TRIGGER_MARGIN],
          ["down", this.playerActor.y >= this.playMaxY - EDGE_TRIGGER_MARGIN],
        ];
        for (const [edge, isNear] of nearEdges) {
          if (!isNear || walls[edge]) continue; // walled edge: no event, just stuck
          this.triggered = true;
          onReachEdge(edge);
          break;
        }
      }
    }
  };
}
