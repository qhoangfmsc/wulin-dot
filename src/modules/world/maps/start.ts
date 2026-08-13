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
  },
  subjectsByCell: {
    "0-0": [
      {
        xFrac: 0.15,
        yFrac: 0.25,
        width: 400,
        height: 400,
        spriteSrc: "/subject/company.png",
        dialogue: [
          {
            side: "right",
            name: "???",
            portraitSrc: "/character/ingame/turtle.png",
            text: "Lại thêm một người nữa lạc tới đây, từ một thế giới vừa sụp đổ.",
          },
          {
            side: "right",
            name: "???",
            portraitSrc: "/character/ingame/turtle.png",
            text: "Võ Lâm không quan tâm ngươi từ đâu tới. Chỉ quan tâm ngươi có sống nổi hay không.",
          },
          { side: "left", name: "Bạn", portraitSrc: "/character/ingame/dog.png", text: "..." },
        ],
      },
    ],
  },
  monstersByCell: {
    "0-1": [
      {
        xFrac: 0.4,
        yFrac: 0.4,
        spriteSrc: "/character/ingame/zombie.png",
        hp: 60,
        damage: 8,
        moveSpeed: 90,
        aggroRadius: 220,
        attackRadius: 50,
        attackIntervalMs: 1000,
        expReward: 20,
      },
      {
        xFrac: 0.65,
        yFrac: 0.65,
        spriteSrc: "/character/ingame/zombie.png",
        hp: 60,
        damage: 8,
        moveSpeed: 90,
        aggroRadius: 220,
        attackRadius: 50,
        attackIntervalMs: 1000,
        expReward: 20,
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
