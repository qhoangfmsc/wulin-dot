import type { MapModule } from "./types";

/** The player's first map — where the story intro's explosion drops them.
 * A hand-authored grid (see `mapGrid.ts` for the shorthand). This is real,
 * permanent content, not a placeholder: every map is its own module like
 * this one, never a "demo." */
export const startMap: MapModule = {
  id: "start",
  grid: [
    [0, "X", 1, "?"],
    [0, 1, 1, 1],
    [0, "S", 0, "B"],
  ],
  obstaclesByCell: {
    "0-1": [
      { xFrac: 0.35, yFrac: 0.55, width: 70, height: 70 },
      { xFrac: 0.62, yFrac: 0.72, width: 90, height: 60 },
    ],
  },
  subjectsByCell: {
    "0-1": [
      {
        xFrac: 0.5,
        yFrac: 0.18,
        width: 260,
        height: 240,
        spriteSrc: "/subject/company.png",
        dialogue: [
          {
            side: "right",
            name: "???",
            portraitSrc: "/character/ingame/turtle.png",
            text: "Another soul, spat out of a burning future.",
          },
          {
            side: "right",
            name: "???",
            portraitSrc: "/character/ingame/turtle.png",
            text: "The Wulin does not care where you came from — only whether you can survive it.",
          },
          { side: "left", name: "You", portraitSrc: "/character/ingame/dog.png", text: "..." },
        ],
      },
    ],
  },
  music: ["/music/background/start.mp3"],
  showTutorial: true,
};
