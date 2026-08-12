import Phaser from "phaser";

const HOP_SPEED = 10;
const HOP_EASE = 10;

/** All character/monster art is drawn front-facing (neutral pose looks
 * "down", i.e. toward the camera) rather than facing right. `moveAngle`
 * (from `Math.atan2`) uses the standard convention where 0 = right, so the
 * rotation actually applied to the sprite needs this fixed offset — without
 * it, facing comes out rotated 90° off (e.g. moving down shows the sprite
 * facing left). Verified against the reported symptom: moving right (angle
 * 0) must show the neutral "facing down" pose, i.e. rotation = -90°. */
const FACING_ART_OFFSET = -Math.PI / 2;

export interface ActorOptions {
  x: number;
  y: number;
  /** Preloaded texture key, or `null` to fall back to a colored shape. */
  textureKey: string | null;
  displaySize: number;
  fallbackColor: number;
  depth: number;
  /** Hop height as a fraction of displaySize. */
  hopHeightRatio?: number;
}

/** Shared "living sprite" for both the player and monsters: a container +
 * billboard image + ground shadow that rotates its whole frame to face
 * whatever direction it's currently moving in, plus a slime-style
 * squash-and-stretch hop while moving. Both the player and every monster
 * drive one of these instead of hand-rolling the same rotate/hop math
 * twice — see `.claude/skills/wulin-design/SKILL.md` for the convention
 * this replaced (mouse-aim + direction ring). */
export class Actor {
  readonly container: Phaser.GameObjects.Container;
  readonly image: Phaser.GameObjects.Image | null;
  private readonly fallbackBody: Phaser.GameObjects.Container | null;
  private readonly shadow: Phaser.GameObjects.Ellipse;
  private readonly baseScaleX: number;
  private readonly baseScaleY: number;
  private readonly hopHeight: number;
  private facing = 0;
  private hopPhase: number;
  private hopValue = 0;

  constructor(scene: Phaser.Scene, opts: ActorOptions) {
    const hasTexture = Boolean(opts.textureKey && scene.textures.exists(opts.textureKey));
    this.shadow = scene.add.ellipse(
      0,
      opts.displaySize * 0.32,
      opts.displaySize * 0.6,
      opts.displaySize * 0.2,
      0x000000,
      0.35,
    );
    this.hopHeight = opts.displaySize * (opts.hopHeightRatio ?? 0.12);
    this.hopPhase = Math.random() * Math.PI; // desync actors' bounce cycles

    if (hasTexture) {
      const image = scene.add.image(0, 0, opts.textureKey!);
      const ratio = image.height / image.width;
      image.setDisplaySize(opts.displaySize, opts.displaySize * ratio);
      this.baseScaleX = image.scaleX;
      this.baseScaleY = image.scaleY;
      this.image = image;
      this.fallbackBody = null;
      this.container = scene.add.container(opts.x, opts.y, [this.shadow, image]);
    } else {
      const r = opts.displaySize / 4;
      const body = scene.add.circle(0, 0, r, opts.fallbackColor).setStrokeStyle(2, 0xffffff, 0.9);
      const nose = scene.add.triangle(0, 0, r, 0, -r / 2, -r / 2, -r / 2, r / 2, 0xffffff, 0.95);
      const fallback = scene.add.container(0, 0, [body, nose]);
      this.fallbackBody = fallback;
      this.image = null;
      this.baseScaleX = 1;
      this.baseScaleY = 1;
      this.container = scene.add.container(opts.x, opts.y, [this.shadow, fallback]);
    }
    this.container.setDepth(opts.depth);
  }

  get x() {
    return this.container.x;
  }

  get y() {
    return this.container.y;
  }

  setPosition(x: number, y: number) {
    this.container.setPosition(x, y);
  }

  setDepth(depth: number) {
    this.container.setDepth(depth);
  }

  /** Call once per frame with the actor's current movement direction in
   * radians, or `null` while idle — updates facing (held while idle) and
   * advances the hop cycle. */
  update(dt: number, moveAngle: number | null) {
    const isMoving = moveAngle !== null;
    if (isMoving) {
      this.facing = moveAngle;
      this.hopPhase += dt * HOP_SPEED;
      this.hopValue = Math.abs(Math.sin(this.hopPhase));
    } else {
      this.hopValue = Phaser.Math.Linear(this.hopValue, 0, Math.min(1, dt * HOP_EASE));
    }

    const target = this.image ?? this.fallbackBody;
    if (target) {
      target.rotation = this.facing + FACING_ART_OFFSET;
      target.y = -this.hopValue * this.hopHeight;
    }
    if (this.image) {
      const stretch = this.hopValue;
      this.image.setScale(this.baseScaleX * (1 - stretch * 0.12), this.baseScaleY * (1 + stretch * 0.18));
    }
    this.shadow.setScale(1 - this.hopValue * 0.3);
    this.shadow.setAlpha(0.35 * (1 - this.hopValue * 0.5));
  }

  /** Brief white flash (hit feedback) — no-op for the shapeless fallback. */
  flashTint(scene: Phaser.Scene, ms = 80) {
    if (!this.image) return;
    const img = this.image;
    img.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
    scene.time.delayedCall(ms, () => img.clearTint());
  }

  destroy() {
    this.container.destroy();
  }
}
