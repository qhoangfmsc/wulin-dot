import type { NpcConfig, NpcId } from "./types";

const TURTLE_PORTRAIT = "/character/ingame/turtle.png";

export const NPCS: Record<NpcId, NpcConfig> = {
  turtle_guide: {
    name: "???",
    spriteSrc: TURTLE_PORTRAIT,
    portraitSrc: TURTLE_PORTRAIT,
    questIds: ["first_deer_hunt"],
    introLines: [
      { side: "right", name: "???", portraitSrc: TURTLE_PORTRAIT, text: "Chào cậu. Ta... sẽ dẫn dắt những kẻ mới chân ướt chân ráo bước vào nơi này." },
      { side: "right", name: "???", portraitSrc: TURTLE_PORTRAIT, text: "Lạ lắm đúng không? Nhưng ta sẽ đồng hành cùng ngươi trên chặng đường sắp tới." },
      { side: "left", name: "Bạn", portraitSrc: "/character/ingame/dog.png", text: "Khoan đã... vậy tui đang ở đâu? tui là ai? Sao ông là con rùa?" },
      { side: "right", name: "???", portraitSrc: TURTLE_PORTRAIT, text: "Hahahaa... Nơi này có rất nhiều điều bí ẩn, ngươi sẽ cần phải khám phá dần dần đấy." },
      { side: "right", name: "???", portraitSrc: TURTLE_PORTRAIT, text: "Giờ thì, giúp ta một việc trước đã — có mấy con Nai bị biến đổi đang quậy phá gần đây, diệt giúp ta 5 con nhé?" },
    ],
    activeLines: [
      { side: "right", name: "???", portraitSrc: TURTLE_PORTRAIT, text: "Đám Nai đột biến kia diệt xong chưa? Cẩn thận đấy, chúng nguy hiểm hơn trông thấy." },
    ],
    turnInLines: [
      { side: "right", name: "???", portraitSrc: TURTLE_PORTRAIT, text: "Ồ, xong cả rồi à! Ngươi cũng khá đấy." },
      { side: "right", name: "Cụ Quy", portraitSrc: TURTLE_PORTRAIT, text: "Cầm lấy chút này gọi là cảm ơn. Tiện thể, cứ gọi ta là Cụ Quy nhé." },
    ],
    doneLines: [
      { side: "right", name: "Cụ Quy", portraitSrc: TURTLE_PORTRAIT, text: "Đi khám phá thế giới này đi..." },
    ],
  },
};
