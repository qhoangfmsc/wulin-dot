import type { MapModule } from "./types";

/** The player's first map — where the story intro's explosion drops them.
 * A hand-authored grid (see `mapGrid.ts` for the shorthand). This is real,
 * permanent content, not a placeholder: every map is its own module like
 * this one, never a "demo." */
export const startMap: MapModule = {
  id: "start",
  grid: [
    ["X", 1, "?"],
    [0, 0, 1],
    [0, "B", "S"],
  ],
  obstaclesByCell: {
    "0-0": [
      { xFrac: 0.35, yFrac: 0.55, width: 80, height: 70, spriteSrc: "/subject/rock.png" },
      { xFrac: 0.62, yFrac: 0.72, width: 110, height: 100, spriteSrc: "/subject/big_bush.png" },
      { xFrac: 0.78, yFrac: 0.4, width: 60, height: 55, spriteSrc: "/subject/small_bush.png" },
    ],
    "1-2": [
      { xFrac: 0.08, yFrac: 0.2, width: 80, height: 70, spriteSrc: "/subject/rock.png" },
      { xFrac: 0.15, yFrac: 0.55, width: 110, height: 100, spriteSrc: "/subject/big_bush.png" },
      { xFrac: 0.25, yFrac: 0.9, width: 60, height: 55, spriteSrc: "/subject/small_bush.png" },
      { xFrac: 0.35, yFrac: 0.15, width: 80, height: 70, spriteSrc: "/subject/rock.png" },
      { xFrac: 0.5, yFrac: 0.5, width: 110, height: 100, spriteSrc: "/subject/big_bush.png" },
      { xFrac: 0.65, yFrac: 0.85, width: 60, height: 55, spriteSrc: "/subject/small_bush.png" },
      { xFrac: 0.85, yFrac: 0.15, width: 80, height: 70, spriteSrc: "/subject/rock.png" },
      { xFrac: 0.9, yFrac: 0.5, width: 110, height: 100, spriteSrc: "/subject/big_bush.png" },
      { xFrac: 0.45, yFrac: 0.05, width: 60, height: 55, spriteSrc: "/subject/small_bush.png" },
    ],
  },
  subjectsByCell: {
    "0-0": [
      {
        xFrac: 0.15,
        yFrac: 0.25,
        width: 400,
        height: 400,
        spriteSrc: "/subject/company.png",
      },
    ],
  },
  dialoguesByCell: {
    "0-0": [
      { side: "left", name: "Bạn", portraitSrc: "/character/ingame/dog.png", text: "Mới chấm công mà..." },
      { side: "left", name: "Bạn", portraitSrc: "/character/ingame/dog.png", text: "Rồi giờ tui đang ở cái chỗ khùng nào nữa đây?" },
    ],
    "0-1": [
      { side: "left", name: "Bạn", portraitSrc: "/character/ingame/dog.png", text: "Có 2 con quái kích thước khác nhau, chắc là sát thương và máu cũng tăng cùng kích thước!" },
    ],
    "0-2": [
      { side: "left", name: "Bạn", portraitSrc: "/character/ingame/dog.png", text: "Phù!! Nhưng chắc không phải con nào cũng nên đánh." },
      { side: "left", name: "Bạn", portraitSrc: "/character/ingame/dog.png", text: "Ơ... Có con rùa ở đây... Đến thử xem sao!" },
    ],
  },
  npcsByCell: {
    "0-2": [{ xFrac: 0.5, yFrac: 0.5, npcId: "turtle_guide" }],
  },
  monstersByCell: {
    "1-2": [
      { xFrac: 0.2, yFrac: 0.3, spriteSrc: "/villain/deer_injured.png", displaySize: 90, hp: 80, damage: 15, moveSpeed: 160, aggroRadius: 350, attackRadius: 90, attackIntervalMs: 1800, expReward: 40, questId: "first_deer_hunt" },
      { xFrac: 0.4, yFrac: 0.7, spriteSrc: "/villain/deer_injured.png", displaySize: 90, hp: 80, damage: 15, moveSpeed: 160, aggroRadius: 350, attackRadius: 90, attackIntervalMs: 1800, expReward: 40, questId: "first_deer_hunt" },
      { xFrac: 0.6, yFrac: 0.25, spriteSrc: "/villain/deer_injured.png", displaySize: 90, hp: 80, damage: 15, moveSpeed: 160, aggroRadius: 350, attackRadius: 90, attackIntervalMs: 1800, expReward: 40, questId: "first_deer_hunt" },
      { xFrac: 0.75, yFrac: 0.6, spriteSrc: "/villain/deer_injured.png", displaySize: 90, hp: 80, damage: 15, moveSpeed: 160, aggroRadius: 350, attackRadius: 90, attackIntervalMs: 1800, expReward: 40, questId: "first_deer_hunt" },
      { xFrac: 0.5, yFrac: 0.85, spriteSrc: "/villain/deer_injured.png", displaySize: 90, hp: 80, damage: 15, moveSpeed: 160, aggroRadius: 350, attackRadius: 90, attackIntervalMs: 1800, expReward: 40, questId: "first_deer_hunt" },
    ],
    "0-1": [
      {
        xFrac: 0.4,
        yFrac: 0.4,
        spriteSrc: "/villain/deer_injured.png",
        hp: 50,
        damage: 10,
        moveSpeed: 200,
        aggroRadius: 500,
        attackRadius: 100,
        attackIntervalMs: 5000,
        expReward: 200,
      },
      {
        xFrac: 0.65,
        yFrac: 0.65,
        spriteSrc: "/villain/deer_injured.png",
        displaySize: 120,
        hp: 100,
        damage: 100,
        moveSpeed: 200,
        aggroRadius: 500,
        attackRadius: 100,
        attackIntervalMs: 5000,
        expReward: 200,
      },
      {
        xFrac: 0.90,
        yFrac: 0.30,
        spriteSrc: "/villain/deer_injured.png",
        displaySize: 300,
        hp: 1000000,
        damage: 1000000,
        moveSpeed: 1000000,
        aggroRadius: 100,
        attackRadius: 100,
        attackIntervalMs: 1000000,
        expReward: 1000000,
      },
    ],
  },
  music: ["/music/background/start.mp3"],
  showTutorial: true,
  roomStyles: {
    empty: { floorSrc: "/ground/dirt.png", wallSrc: "/ground/log_wall.png" },
    normal: { floorSrc: "/ground/dirt.png", wallSrc: "/ground/log_wall.png" },
    unknown: { floorSrc: "/ground/dirt.png", wallSrc: "/ground/log_wall.png" },
    special: { floorSrc: "/ground/grass.png", wallSrc: "/ground/log_wall.png", tint: 0xa855f7 },
    boss: { floorSrc: "/ground/grass.png", wallSrc: "/ground/lava_wall.png", tint: 0xef4444 },
  },
  floorOverridesByCell: {
    "0-0": "/ground/dirt.png",
  },
};
