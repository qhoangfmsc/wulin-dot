import type { CharacterClassConfig } from "./types";

export const CHARACTER_CLASSES: CharacterClassConfig[] = [
  {
    id: "crane",
    sectName: "Bạch Hạc Môn",
    title: "Bạch Hạc Xạ Ảnh",
    role: "Cung Thủ",
    animal: "Hạc",
    tagline: "Một mũi tên, một sinh mệnh.",
    description:
      "Đệ tử Bạch Hạc Môn luyện thân pháp theo dáng hạc bay, ẩn mình trong sương rồi ra tay đoạt mạng từ xa. Tên của họ luôn tẩm độc dược bí truyền — trúng tên, chưa chắc chết ngay, nhưng chắc chắn không sống nổi tới canh hai.",
    weapon: "Cung Trúc",
    color: "#d4d4d8",
    accentColor: "#a1a1aa",
    coverImage: "/character/card/crane.png",
    inGameSprite: "/character/ingame/crane.png",
    inGameSublimation: "/character/sublimation/crane.png",
  },
  {
    id: "dragon",
    sectName: "Thanh Long Môn",
    title: "Thanh Long Pháp Sư",
    role: "Pháp Sư",
    animal: "Rồng Xanh",
    tagline: "Nội tức luân chuyển, trời đất đổi màu.",
    description:
      "Thanh Long Môn tu luyện nội công thượng thừa, mượn linh khí trời đất hóa thành chưởng lực băng hỏa. Đệ tử môn phái này ít khi giao đấu tay đôi, họ để chân khí và pháp thuật thay lời phân định thắng thua.",
    weapon: "Pháp Trượng",
    color: "#22d3ee",
    accentColor: "#6366f1",
    coverImage: "/character/card/dragon.png",
    inGameSprite: "/character/ingame/dragon.png",
    inGameSublimation: "/character/sublimation/dragon.png",
  },
  {
    id: "tiger",
    sectName: "Cuồng Hổ Môn",
    title: "Cuồng Hổ Chiến Tướng",
    role: "Chiến Binh",
    animal: "Hổ",
    tagline: "Một thân thiết giáp, vạn dặm xông pha.",
    description:
      "Cuồng Hổ Môn trấn tại vùng biên ải, đệ tử luyện ngoại công cương mãnh, da thịt tựa sắt thép. Họ không né đòn — họ đứng thẳng, hứng chịu, rồi phản đòn gấp mười lần đối phương vừa tung ra.",
    weapon: "Song Quyền",
    color: "#fb923c",
    accentColor: "#b45309",
    coverImage: "/character/card/tiger.png",
    inGameSprite: "/character/ingame/tiger.png",
    inGameSublimation: "/character/sublimation/tiger.png",
  },
];

export function getClassConfig(id: string): CharacterClassConfig | undefined {
  return CHARACTER_CLASSES.find((c) => c.id === id);
}
