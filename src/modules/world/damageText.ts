import Phaser from "phaser";

const RISE_DISTANCE = 40;
const DURATION_MS = 500;

/** Combat feedback shared by both directions (player hits monster, monster
 * hits player) — a number that rises and fades, then destroys itself. Not
 * owned by `Monster` or the scene specifically since both sides use it. */
export function spawnDamageText(scene: Phaser.Scene, x: number, y: number, text: string, color: string) {
  const label = scene.add
    .text(x, y, text, { fontFamily: "monospace", fontSize: "20px", color, fontStyle: "bold" })
    .setOrigin(0.5)
    .setDepth(20);
  scene.tweens.add({
    targets: label,
    y: y - RISE_DISTANCE,
    alpha: 0,
    duration: DURATION_MS,
    ease: "power1.out",
    onComplete: () => label.destroy(),
  });
}
