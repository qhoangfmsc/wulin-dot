import Phaser from "phaser";
import { spawnDamageText } from "./damageText";

const FLIGHT_DURATION_MS = 350;
const SPIN_RADIANS = Math.PI * 3; // 1.5 full spins while in flight
const IMPACT_BURST_MS = 200;
const PROJECTILE_DISPLAY_SIZE = 65;
const IMPACT_BURST_RADIUS = 18;

export interface AttackConfig {
  fromX: number;
  fromY: number;
  /** Target position AT THE MOMENT OF FIRING — the projectile flies to
   * this fixed point, it doesn't home in on a moving target. */
  toX: number;
  toY: number;
  /** Preloaded texture key for the thrown item, or `null` to fall back to
   * a plain colored circle. */
  weaponTextureKey: string | null;
  fallbackColor: number;
  damage: number;
  /** Called once the throw lands (after flight + impact burst) — this is
   * where the caller should actually apply damage. Nothing about this
   * module assumes the target still exists by then; the caller must check. */
  onLand: (damage: number) => void;
}

/** The reusable "throw an item at a target" attack cycle: fly + spin toward
 * a fixed point, small burst + floating damage number on impact, THEN
 * `onLand` fires — that's what "ends one attack cycle" means here; damage
 * always lands after the throw animation finishes, never instantly when
 * fired. Written generically (texture/damage/callback are all parameters)
 * so a future monster or skill can reuse this instead of hand-rolling the
 * same tween/FX again — see SKILL.md mục 1 on giving a growing concern its
 * own module from the start. */
export function fireAttack(scene: Phaser.Scene, config: AttackConfig) {
  const projectile: Phaser.GameObjects.Image | Phaser.GameObjects.Arc = config.weaponTextureKey
    ? scene.add.image(config.fromX, config.fromY, config.weaponTextureKey).setDisplaySize(PROJECTILE_DISPLAY_SIZE, PROJECTILE_DISPLAY_SIZE)
    : scene.add.circle(config.fromX, config.fromY, PROJECTILE_DISPLAY_SIZE / 2, config.fallbackColor);
  projectile.setDepth(15);

  scene.tweens.add({
    targets: projectile,
    x: config.toX,
    y: config.toY,
    rotation: SPIN_RADIANS,
    duration: FLIGHT_DURATION_MS,
    ease: "power1.in",
    onComplete: () => {
      projectile.destroy();

      const burst = scene.add.circle(config.toX, config.toY, IMPACT_BURST_RADIUS, 0xffedbb, 0.85).setDepth(16);
      scene.tweens.add({
        targets: burst,
        scale: 2.2,
        alpha: 0,
        duration: IMPACT_BURST_MS,
        onComplete: () => burst.destroy(),
      });

      spawnDamageText(scene, config.toX, config.toY, `-${config.damage}`, "#f2c66d");
      config.onLand(config.damage);
    },
  });
}
