---
name: wulin-design
description: Quy ước bắt buộc khi làm việc trên game Wulin.io — kiến trúc module, cách đặt tên chỉ số, quy ước animation (GSAP/Phaser/CSS), phong cách hình ảnh wuxia bắt buộc, checklist thêm môn phái/skill/vật phẩm mới, và nguyên tắc gameplay. Dùng khi thêm tính năng, sửa UI, thêm animation, hoặc thêm class/nhân vật mới cho dự án này.
---

# Wulin.io — Quy ước thiết kế & xây dựng

Đọc file này trước khi đụng vào gameplay, UI, hoặc animation của Wulin.io.
Đây là quy tắc bắt buộc để giữ đồng nhất; **`docs/GAME_DESIGN.md`** mới là nơi
mô tả đầy đủ "hiện có những gì" — đọc cả hai, đừng chỉ đọc một trong hai.

## 1. Kiến trúc module — không thương lượng

- Type + component + data + store của một domain (character/stats/skills/
  inventory/combat/world) nằm trong `src/modules/<domain>/`. Không import
  chéo data layer giữa các module trừ khi qua `CharacterClassId` làm khóa nối
  (đó là lý do mọi `data.ts` đều `Record<CharacterClassId, ...>`).
- `combat` là domain THUẦN DATA (`MonsterConfig`, `CombatAbility`,
  `CombatLoadout`) — không có component, không có Phaser code. Logic runtime
  thật (spawn quái, bắn đạn, va chạm, HP) sống trong `world/scene.ts` vì đó là
  nơi Phaser canvas thực sự chạy; đừng tạo `combat/scene.ts` hay component
  Phaser riêng, `world` đã sở hữu toàn bộ canvas.
- `CombatLoadout.skill1`/`skill2`/`ultimate` PHẢI dùng chung `id` với đúng
  `SkillNode` tương ứng trong `modules/skills/data.ts` (nhánh active tier1 →
  tier2-con-của-tier1 → tier3) thay vì bịa id riêng — nhờ vậy tên/mô tả/icon/
  trạng thái mở khóa tự động đồng bộ giữa skill tree và combat, không phải
  duy trì 2 nguồn sự thật song song.
- Mọi nhân vật hiển thị trong `world` (player + quái) PHẢI dựng qua class
  `Actor` (`modules/world/actor.ts`), không viết lại logic xoay/nảy thủ công
  ở chỗ khác — xem mục 8.
- `inventory.InventoryItem` chỉ có `slot`/`statBonus` khi item đó thật sự
  trang bị được (vũ khí/giáp/phụ kiện); vật phẩm tiêu hao (đan dược...) không
  có 2 field này. `getEquipmentBonus()` trong `inventory/store.ts` là nơi
  DUY NHẤT gộp bonus trang bị — đừng cộng `statBonus` tay ở chỗ khác.
- Component nào gộp nhiều module lại (menu, panel shell, status bar, radar,
  backdrop…) thì nằm ở `src/app/component/`, KHÔNG nằm trong một module cụ
  thể nào — kể cả khi nó chỉ đang được 1 màn hình dùng.
- Không tạo `src/components/` hay `src/lib/` dùng chung chung — mọi thứ hoặc
  thuộc một module, hoặc thuộc `src/app/component/`.
- Trước khi thêm field/type mới, hỏi: field này có ý nghĩa với TẤT CẢ class
  không, hay chỉ đang cần cho 1 class? Nếu là đặc thù 1 class, đừng thêm vào
  `CharacterClassConfig` — nghĩ cách khác (VD: optional field, hoặc field
  namespaced).

## 2. Chỉ số nhân vật — luôn cụ thể, không jargon

Chỉ số (`src/modules/stats/`) PHẢI đọc hiểu ngay không cần giải thích: "Sát
Thương Vật Lý: 42" chứ không phải "Lực Đạo: 42". Khi thêm chỉ số mới:

- Đặt tên theo thứ người chơi thấy được: Máu, Giáp, Sát Thương Vật Lý/Phép,
  Năng Lượng, Tốc Độ Đánh, Tốc Độ Di Chuyển, Chí Mạng, May Mắn... KHÔNG dùng
  tên võ hiệp trừu tượng (Lực Đạo, Thân Pháp, Căn Cốt, Ngộ Tính...) làm tên
  chính — những từ đó chỉ được dùng trong lore/mô tả sect (tagline,
  description), không phải trong `StatDef.name`.
- Đa số chỉ số là **con số cụ thể, không %** (Máu, Giáp, Sát Thương, Năng
  Lượng, Tốc Độ Đánh, Tốc Độ Di Chuyển). Chỉ **Tỉ Lệ Chí Mạng** và **May
  Mắn** dùng `unit: "%"` vì bản chất là xác suất/tỉ lệ — đừng đổi 2 stat này
  sang số thuần và cũng đừng thêm `%` vào các stat còn lại.
- **Tốc Độ Đánh** (`attackSpeed`) là số thập phân (2 chữ số, field
  `decimals: 2` trong `StatDef`) đại diện cho hit/s, cơ bản quanh 1.00, trần
  thiết kế 10.00 — **quyết định cooldown đòn đánh tự động thật**
  (`cooldownMsFor()` trong `world/scene.ts` tính `1000 / stats.attackSpeed`,
  không dùng `cooldownMs` tĩnh trong data cho riêng ability này). **Tốc Độ Di
  Chuyển** (`moveSpeed`) là số nguyên px/s, cơ bản quanh 200, trần thiết kế
  500, và **đã nối thẳng vào WASD thật** trong Phaser
  (`createMainScene({ classId, classColor, spriteUrl, stats })` →
  `GameCanvas` → `HudShell` truyền stats **đã gồm bonus trang bị**) — cả 2
  stat này hiện ảnh hưởng gameplay thật, không chỉ hiển thị. `moveSpeed`
  KHÔNG scale theo cấp độ trong ván chơi (chỉ `hp`/damage mới scale — xem mục
  7); khi thêm class mới, roll range của `moveSpeed` nên nằm quanh 190–290
  (không gần trần 500, trần đó dành cho tăng trưởng sau này qua item).
- Mỗi `StatDef` phải có `unit` (hậu tố hiển thị) và `barMax` (mốc scale
  progress bar — không phải cap gameplay, trừ `attackSpeed`/`moveSpeed` nơi
  `barMax` trùng luôn với trần thiết kế).
- Khi sửa/thêm chỉ số, rà lại `modules/skills/data.ts` và
  `modules/inventory/data.ts` — mô tả skill/item hay nhắc tên chỉ số bằng chữ
  (VD: "Tăng Giáp và tốc độ hồi Máu"), phải khớp tên chỉ số hiện hành, không
  để sót tên cũ.

## 3. Animation — 3 hệ thống, không trộn

| Ở đâu | Dùng gì | Khi nào |
|---|---|---|
| React/DOM (UI, chuyển cảnh, hover, panel) | **GSAP** (+ `@gsap/react` cho component có mount/unmount rõ ràng) | Luôn |
| Bên trong Phaser canvas (bob, xoay mũi tên, di chuyển NPC) | **Phaser tự animate trong `update()`** | Luôn — không dùng GSAP để animate object trong canvas |
| Hiệu ứng lặp vô hạn, không phụ thuộc state (mist trôi, radar sweep, breathing glow) | **CSS `@keyframes`** trong `globals.css` | Ưu tiên trước GSAP nếu không cần điều khiển từ JS — rẻ hơn, không tốn JS tick |

Quy tắc cụ thể đã rút ra khi xây dựng:

- **Art nhân vật/quái trong game này vẽ nhìn thẳng về camera (neutral pose =
  "hướng xuống"), không phải hướng phải** — `Actor.update()` phải cộng bù
  `FACING_ART_OFFSET = -Math.PI / 2` khi set `rotation`, không được gán thẳng
  `rotation = moveAngle`. Thiếu bù sẽ lệch góc 90° (đi xuống → mặt quay trái,
  đi phải → mặt quay xuống) — bug này đã xảy ra thật, xem
  `modules/world/actor.ts` và mục 5 của `docs/GAME_DESIGN.md`.
- **`gsap.quickTo(el, "rotateX"/"rotateY", ...)` KHÔNG hoạt động** ở bản GSAP
  đang dùng (3.15) — alias không được resolve, animation chạy nhưng element
  không xoay (không có lỗi console, rất dễ bỏ sót). Luôn dùng tên chuẩn
  `"rotationX"`/`"rotationY"` khi gọi `quickTo`. `.to()`/`.set()` thì cả hai
  tên đều dùng được bình thường, vấn đề chỉ nằm ở `quickTo`. Nếu một hiệu ứng
  `quickTo` "chạy nhưng không thấy gì thay đổi", nghi ngờ đầu tiên là tên
  property.
- Component dùng hook `useGSAP` (từ `@gsap/react`) phải tự gọi
  `gsap.registerPlugin(useGSAP)` ở đầu file — không tạo file khởi tạo riêng,
  lệnh này idempotent.
- Hạt sáng / phần tử lặp lại nhiều instance (VD: `.mote` trong
  `SceneBackdrop`) phải tính vị trí/độ trễ **xác định theo index**, KHÔNG
  dùng `Math.random()` trong render — component chạy qua SSR trước khi
  hydrate, giá trị ngẫu nhiên khác nhau giữa server/client sẽ gây lỗi
  hydration mismatch.
- Chuyển cảnh toàn màn hình (VD: vào game) ưu tiên hiệu ứng có chủ đích (iris
  wipe, mask...) hơn là fade phẳng đơn thuần — xem `HudShell` làm ví dụ
  (`clip-path: circle()`, dùng 150% chứ không phải 100% để phủ hết góc màn
  hình ở mọi tỉ lệ khung hình). 3 kiểu chuyển cảnh hiện có, mỗi kiểu có ngữ
  cảnh riêng — **đừng dùng lẫn lộn khi thêm chuyển cảnh mới**: iris wipe
  (`HudShell`, vào combat), chớp mắt/eye-blink (`IntroExperience`, 2 lid
  `scaleY` phủ từ top/bottom — dùng cho chuyển cảnh "có ý nghĩa tường thuật",
  ví dụ đổi bối cảnh lớn), fade đen phẳng (`MapScreen`, đổi map — dùng khi
  chuyển cảnh chỉ là kỹ thuật, không cần kịch tính).
- Screen shake (VD: `StoryIntroScreen`) dùng 1 chuỗi `.to()` dịch chuyển
  x/y **giảm dần biên độ theo từng bước** thay vì cú pháp `"random(min,max)"`
  của GSAP — xác định/lặp lại được, dễ chỉnh/debug hơn giá trị ngẫu nhiên mỗi
  lần chạy.
- **`TileSprite.setTint(color)` KHÔNG phải cách hay để "phủ màu" 1 sàn/texture
  nhiều màu** (bug đã gặp và sửa, xem `mapScene.ts`) — tint mặc định là
  multiply-mode, nhân màu texture gốc với màu tint theo từng kênh; với
  texture đã nhiều màu sắc (dirt/grass...) kết quả ra rất mờ/lem, gần như
  không phân biệt được với màu gốc trong screenshot. Muốn 1 vùng "rõ ràng
  đổi màu" (VD: đánh dấu phòng boss/đặc biệt), dùng 1 `Rectangle` phủ trong
  suốt (`this.add.rectangle(x,y,w,h,color,alpha)`, alpha ~0.25-0.35) đặt
  DEPTH cao hơn sàn, đừng cố tint texture.
- Trước khi coi một animation "đã xong", **verify bằng cách đọc computed
  style/transform qua Playwright** (`getComputedStyle(el).transform` hoặc
  `.clipPath`), đừng chỉ tin vào việc code "trông đúng" hoặc chỉ nhìn
  screenshot tĩnh — hiệu ứng tinh vi (tilt vài độ, clip-path) rất khó thấy
  bằng mắt trên một ảnh chụp, nhưng sai một property name thì hiệu ứng im
  lặng không chạy.
- **Tạo `Phaser.Game` mới thì LUÔN đo `container.clientWidth/clientHeight`
  thật để truyền vào `scale.width/height`, đừng truyền chuỗi `"100%"`** —
  chuỗi `%` chỉ resolve 1 lần lúc boot, nếu container React chưa layout xong
  đúng lúc đó (dễ xảy ra vì `Phaser.Game` thường được tạo trong `useEffect`
  ngay sau render) thì canvas khóa cứng ở size nhỏ hơn thật, hở 1 dải nền đen
  — dù `Phaser.Scale.RESIZE` đang bật cũng không tự sửa. Bug này đã xảy ra
  thật ở cả `GameCanvas.tsx` lẫn `MapCanvas.tsx`, đã sửa — xem mục 5 của
  `docs/GAME_DESIGN.md`. Nhớ thêm `window.addEventListener("resize", () =>
  game.scale.resize(container.clientWidth, container.clientHeight))` để
  chắc chắn khớp cả khi viewport đổi sau này.

## 4. Phong cách hình ảnh — bắt buộc nghiêng wuxia

Mọi UI/component MỚI (HUD, panel, dialogue, minimap, overlay...) phải nghiêng
về thẩm mỹ wuxia — giấy da/cuộn thư cũ, nét mực thư pháp, dấu triện đỏ-vàng,
khung gỗ vân/2 đầu cuộn tròn, tông màu đất-đỏ-vàng ấm trầm — thay vì UI game
hiện đại phẳng chung chung (thanh neon phẳng, HUD kiểu corporate sans-serif).

- **Chưa có art thật thì dùng CSS-only làm giải pháp tạm** (gradient
  `linear-gradient`/`radial-gradient` tông giấy da, border màu mực nâu sậm
  `#5c3a21`/`#7a5230`, `box-shadow` inset để tạo cảm giác giấy cũ, 2 thanh gỗ
  bo tròn ở đầu/cuối để mô phỏng cuộn thư) — xem `DialogueBox.tsx`/
  `GridMinimap.tsx`/`TutorialOverlay.tsx`/`LiveHudBar.tsx` làm ví dụ. Đây là
  fallback được chấp nhận cho tới khi có asset thật (đối chiếu mục Roadmap
  "Stylized Chinese ink painting" trong `docs/GAME_DESIGN.md`) — đừng chặn
  việc ra UI mới chỉ vì chưa có ảnh.
- **HUD/panel zinc tối của Sảnh Chờ/combat DORMANT (mục 8) được miễn** — không
  cần retrofit lại phong cách wuxia cho chúng trừ khi thực sự động vào/sửa
  file đó vì lý do khác.
- Font hiện có (`--font-bmx`/`.font-sans`, `--font-p22`/`.font-title`) KHÔNG
  phải font thư pháp — vẫn dùng bình thường cho tới khi có font phù hợp hơn,
  đừng tự ý đổi font stack khi chỉ được yêu cầu đổi màu sắc/layout.

## 5. Checklist: thêm một môn phái (class) mới

**Lưu ý (2026-08-11)**: hệ thống crane/dragon/tiger (checklist dưới đây) hiện
là DORMANT — `page.tsx` không còn màn nào dẫn vào nó nữa (màn chọn môn phái
`CharacterCreationScreen` đã bị xóa, xem `docs/GAME_DESIGN.md` mục 0). Checklist
này vẫn đúng nếu sau này hồi sinh flow đó, nhưng đừng giả định nó đang chạy
trong app hiện tại.

1. `modules/character/data.ts` — thêm entry `CharacterClassConfig`: sectName,
   title, role, animal, tagline, description, weapon, `color`/`accentColor`
   (chọn tông màu khớp với art, xem cách làm với Bạch Hạc Môn — màu lấy theo
   tông chủ đạo của `coverImage`), `coverImage`/`inGameSprite`/
   `inGameSublimation`.
2. 3 ảnh vào `public/character/` — **theo folder, không theo hậu tố tên file**
   (đổi quy ước 2026-08-11): `card/<animal>.png` (portrait, dùng ở
   `ClassCard`), `ingame/<animal>.png` (bust nền trong suốt, dùng làm avatar),
   `sublimation/<animal>.png` (bản "Đại Thành", hiện khi mở khóa skill tối
   thượng). Thiếu ảnh nào cũng không sập app — `ClassCard`/`GameCanvas` tự
   fallback (ảnh rỗng hoặc hình khối màu), nhưng nên có đủ 3 để trải nghiệm
   trọn vẹn. `ingame/` cũng là chỗ chứa ảnh nhân vật KHÔNG thuộc hệ
   `CharacterClassId` (VD: `dog.png` dùng cho demo map) — không phải mọi ảnh
   trong `ingame/` đều gắn với một class.
3. `modules/stats/data.ts` — thêm `STAT_RANGES[classId]` cho đủ 10 stat, range
   phải thể hiện rõ bản sắc lối chơi (archer nhanh/chí mạng cao, mage sát
   thương phép/năng lượng cao, warrior máu/giáp cao...).
4. `modules/skills/data.ts` — thêm `SKILL_TREES[classId]`: đúng hình dạng 6
   node (1 passive tier 0 free + 2 tier 1 + 2 tier 2 mỗi node yêu cầu 1 node
   tier 1 tương ứng + 1 ultimate tier 3 yêu cầu cả 2 node tier 2). Mô tả dùng
   tên chỉ số hiện hành (mục 2).
5. `modules/inventory/data.ts` — thêm `STARTER_INVENTORY[classId]`: vũ khí
   khởi đầu + 1-2 vật phẩm tiêu hao, rarity `common`.
6. Không cần sửa `HudShell`, `ClassCard`, `SkillTreePanel`... — toàn bộ UI
   đọc theo `CharacterClassId`/data tự động.
7. Chạy `yarn lint && yarn build`, rồi test bằng Playwright (xem mục 7) trước
   khi báo hoàn thành.

## 6. Checklist: thêm skill node / vật phẩm mới

- Skill node: `id` phải prefix bằng `classId` (VD: `crane-...`) để tránh
  đụng độ giữa các cây kỹ năng. `requires` chỉ trỏ tới node cùng cây.
  `description` dùng tên chỉ số hiện hành nếu có nhắc tới cơ chế cụ thể.
- Vật phẩm: `icon` phải là tên hợp lệ trong `lucide-react` (kiểm tra bằng
  cách grep `declare const <Tên>:` trong
  `node_modules/lucide-react/dist/lucide-react.d.ts` — bộ icon có đổi tên
  giữa các version, đừng đoán từ trí nhớ).

## 7. Trước khi báo "xong"

- `yarn lint && yarn build` phải sạch.
- Với bất kỳ thay đổi UI/animation nào: chạy dev server, dùng Playwright
  (`chromium.launch()` qua script tạm trong thư mục scratchpad — xem cách làm
  trong lịch sử dự án) để đi qua luồng thật (tạo nhân vật → roll chỉ số → vào
  game → mở từng panel) và chụp ảnh kiểm tra bằng mắt, đồng thời check
  `console --errors`/`pageerror`/`requestfailed` rỗng.
- Cập nhật `docs/GAME_DESIGN.md` (mục "Đã có" + "Roadmap") nếu tính năng mới
  làm thay đổi hành vi đã mô tả ở đó.

## 8. Nguyên tắc gameplay (đừng phá vỡ khi thêm tính năng)

### Luồng mở đầu (tap/story/map) — ĐANG LIVE, đây là app hiện tại

- **UI tiếng Anh, cỡ chữ không quá nhỏ** — đổi 2026-08-11 theo yêu cầu rõ
  ràng, chỉ áp dụng cho luồng LIVE này (`TapToStartScreen`,
  `StoryIntroScreen`, `TutorialOverlay`, `MapScreen`/`GridMinimap`). Phần
  Sảnh Chờ/combat DORMANT bên dưới vẫn giữ tiếng Việt nguyên trạng — KHÔNG
  cần dịch (không hiển thị cho người chơi).
- **Tap-anywhere + Space**, không cần bấm trúng chữ: quy ước cho MỌI màn chờ
  người dùng "tiếp tục" (`TapToStartScreen`, `StoryIntroScreen`). Bấm/chạm ở
  bất kỳ đâu trên màn hình HOẶC nhấn phím Space đều kích hoạt — không được
  thu hẹp vùng bấm về đúng dòng chữ hướng dẫn. Nếu thêm màn chờ mới kiểu này,
  làm theo đúng pattern: `onClick` trên root container + `window.
  addEventListener("keydown", ...)` bắt `e.code === "Space"` trong `useEffect`.
- **Map là 1 lưới 2 chiều (`mapGrid.ts`), tường/link do lưới TỰ SUY RA —
  đừng cấu hình `walls` thủ công cho từng phòng nữa**: viết layout bằng
  `GridSymbol[][]` (`0`/`1`/`"X"`/`"B"`/`"S"`/`"?"`, xem docstring
  `mapGrid.ts`), gọi `parseGridMap()` rồi `getCellWalls(map, row, col)` —
  hàm này tự soi 4 ô lân cận trong lưới để quyết định cạnh nào mở/chặn. Cạnh
  có ô lân cận tồn tại (trong biên lưới, khác `0`) → MỞ, đi sát biên đó →
  chuyển phòng, xuất hiện ở cạnh ĐỐI DIỆN của phòng mới (`OPPOSITE_EDGE`, đủ
  cả 4 hướng). Cạnh không có ô lân cận → kẹt lại, render `wallSrc` (tường
  THẬT, xem dưới), không sự kiện gì. Nguyên tắc gốc "phải có tường mới không
  đi qua được" thể hiện ở CHÍNH cấu trúc lưới (ô `0` = tường) chứ không phải
  1 field `walls` viết tay — nếu thấy mình đang gõ `walls: {...}` thủ công ở
  đâu đó, dừng lại, sửa lưới thay vì patch riêng lẻ. `MAX_GRID_SIZE = 10`
  (`mapGrid.ts`) — mốc mềm cho kích thước lưới, không phải giới hạn cứng.
- **Tường có art thật (`wallSrc`), nhưng CHỈ render ở đúng cạnh bị chặn** —
  đổi 2026-08-11 (trước đó cố tình bỏ hẳn art tường theo yêu cầu "background
  trơn"; giờ quay lại nhưng đúng phạm vi, không phải viền toàn map như thiết
  kế gốc). `MapScreen` chọn `wallSrc` theo loại phòng (VD boss dùng
  `lava_wall.png` thay vì `log_wall.png` mặc định) — thêm loại phòng mới
  muốn tường riêng thì sửa biểu thức chọn `wallSrc`, không sửa `mapScene.ts`.
- **Vật cản trong phòng (`ObstacleConfig`) khai báo vị trí theo TỈ LỆ
  (`xFrac`/`yFrac`, 0-1), không phải pixel cứng** — giữ đúng vị trí tương
  đối khi phòng đổi size theo `roomScale`/viewport. Chưa có `spriteSrc` thì
  cứ để trống, tự fallback hình chữ nhật xám — đừng chặn việc thêm vật cản
  mới lại chỉ vì chưa có art.
- **Mỗi map là 1 module riêng dưới `modules/world/maps/`, KHÔNG BAO GIỜ là
  "demo"** (đổi 2026-08-11 theo yêu cầu rõ ràng) — mỗi file (VD: `start.ts`)
  tự hardcode `grid`, `obstaclesByCell`, `subjectsByCell`, `music`,
  `showTutorial` của đúng map đó, đăng ký vào `MAP_MODULES`/`MAP_ORDER`
  (`maps/index.ts`). `MapScreen` chỉ đọc `currentMapId` từ
  `useMapProgressStore` (persisted, giống pattern `character`/`inventory`/
  `skills` store) rồi render đúng module đó — thêm map mới = thêm 1 module +
  1 dòng `MAP_ORDER`, KHÔNG sửa `MapScreen`.
- **Vật thể cốt truyện (`SubjectConfig`, mở rộng từ `ObstacleConfig`)** —
  chặn đường giống obstacle bình thường, nhưng có thêm `dialogue?:
  DialogueLine[]` bắn 1 lần duy nhất qua `DialogueBox` khi người chơi đến
  đúng phòng chứa nó lần đầu (theo dõi bằng 1 `Set` session, không persist).
  VD hiện có: `company.png` ở phòng bắt đầu, kể chuyện nhân vật bị đẩy về
  Wulin từ thế giới tương lai đổ nát.
- **Nhạc nền theo map, loop bằng `<audio>` của React, KHÔNG phải Phaser sound
  manager** (`useMapMusic(playlist, mapKey)`, `modules/world/useMapMusic.ts`)
  — lý do: `MapCanvas` bị destroy/recreate mỗi lần đổi phòng
  (`key={cellKey(...)}`), nhạc do Phaser quản sẽ bị restart mỗi lần đổi
  phòng trong CÙNG 1 map. Hook này mount ở `MapScreen` (ngoài subtree theo
  phòng), chỉ restart khi `mapKey` (map id) thực sự đổi, và tự loop qua
  playlist khi hết bài (`onended`).
- **Tutorial chỉ hiện theo `MapModule.showTutorial`**, không unconditional
  nữa — panel to hơn, hiện rõ cả 2 cụm phím WASD và mũi tên (↑↓←→) thay vì 1
  dòng chữ.
- **HUD dưới cùng cho luồng LIVE**: `ExperienceBar` (thanh EXP full-width,
  fixed đáy màn hình) + `LiveHudBar` (cấp độ + 3 ô Kỹ Năng/Nhân Vật/Thú
  Cưỡi) — dùng store riêng `modules/world/liveHud.ts`
  (`useLiveHudStore`), TÁCH BIỆT với `useWorldStore` của combat DORMANT. Cả
  3 ô hiện đều khóa (chưa có hệ thống nào trong số đó được nối vào luồng
  LIVE) — tái dùng đúng pattern khóa/hover đã có ở `AbilityBar`'s
  `AbilitySlot` (opacity, icon khóa, tooltip "Chưa mở khoá"), đừng tự chế
  pattern khóa mới.
- Minimap (`GridMinimap`) và hộp thoại (`DialogueBox`) theo phong cách wuxia
  giấy da/cuộn thư — xem mục 4.

### Hệ thống combat/Sảnh Chờ (DORMANT — xem mục 5, không phải app hiện tại)

- **Input là bàn phím, không phải chuột**: `WASD` di chuyển; **đòn đánh
  thường tự động bắn**, không có phím riêng. **Cập nhật 2026-08-11**: các
  phím `J`/`K`/`L` (skill1/skill2/ultimate), `U` (Bình Máu), `P` (tạm dừng)
  đã bị GỠ BỎ theo yêu cầu rõ ràng — scene này giờ THUẦN DI CHUYỂN, chuẩn bị
  cho việc nối combat vào luồng LIVE sau này. `attemptFireGated()` (chỉ dùng
  cho 3 phím skill đã gỡ) cũng đã bị xóa hẳn theo cùng thay đổi — đừng thêm
  lại các phím này trừ khi được yêu cầu rõ ràng lúc wiring combat vào map
  thật. `I`/`O` vẫn là ô trống trong `AbilityBar` (chưa gắn hành vi).
- **Facing (hướng mặt) = hướng di chuyển hiện tại, giữ nguyên khi đứng yên**
  — áp dụng cho MỌI actor (player + quái) qua class `Actor`
  (`modules/world/actor.ts`). Gọi `actor.update(dt, moveAngle)` mỗi frame với
  `moveAngle` là hướng di chuyển (radian) hoặc `null` nếu không di chuyển —
  đừng tự tính rotation/hop thủ công ở nơi khác, thêm actor mới thì tạo 1
  `Actor` instance mới.
- **Auto-target, không có "ngắm"**: đòn thường + skill1/skill2/ultimate đều
  tự nhắm quái còn sống gần nhất qua `findNearestMonster()` — nhân vật có thể
  quay lưng về phía mục tiêu mà vẫn bắn trúng (facing và hướng bắn là 2 khái
  niệm tách biệt). Nếu không có quái nào, ability không bắn và KHÔNG bị trừ
  cooldown — đừng đổi thành "bắn khống" khi trống mục tiêu.
- Camera luôn hướng Bắc cố định, không xoay theo nhân vật — chỉ actor xoay,
  không xoay world.
- **Combat**: 4 "kind" ability dùng chung cho mọi class — `bolt` (đạn bay
  thẳng theo `projectileSpeed` hướng về mục tiêu tại thời điểm bắn, dừng/nổ
  khi trúng trừ khi `piercing: true`, hoặc biến mất khi hết `range`), `burst`
  (nổ tức thời tại vị trí mục tiêu, kẹp trong tầm `range` tính từ người chơi),
  `ultimate` (nổ tức thời quanh thân người chơi), `heal` (hồi `healRatio *
  maxHp`, không cần mục tiêu — hiện chỉ `HEAL_POTION` dùng kind này). Đừng
  thêm kind mới hay code riêng theo từng class trừ khi 4 kind này thực sự
  không mô tả được — giữ hệ thống data-driven dùng chung code cho cả 3 môn
  phái.
- **Wave spawner, không phải spawn cố định**: quái spawn theo đợt định kỳ
  (`WAVE_INTERVAL_MS`) ngay ngoài rìa camera quanh người chơi, số lượng tăng
  dần, và **luôn lao thẳng vào người chơi** ngay khi xuất hiện (không có
  trạng thái lang thang/aggro-range/leash — đã bỏ hẳn ở bản survivor.io này).
  `MonsterConfig.spawnCount` là **trần số lượng cùng lúc** của loại đó
  (`pickMonsterConfigForWave()` bỏ qua loại đã đầy trần), KHÔNG phải số lượng
  khởi tạo ban đầu — đừng hiểu nhầm khi đọc/sửa data. Quái chết bị xóa hẳn
  (không hồi sinh riêng lẻ) — đợt wave sau tự bù lại.
- Quái có 3 tier cố định: `normal` (ghost), `elite` (skull), `boss` (spider)
  — tier quyết định offset cấp so với người chơi (`TIER_LEVEL_OFFSET`: +0/+3/
  +7), màu blip trên radar (xám/cam/đỏ), và độ ưu tiên hiển thị (`setDepth`).
  Thêm quái mới thì gắn đúng 1 trong 3 tier này, đừng bịa tier mới nếu không
  thực sự cần.
- **Cấp độ — không giới hạn, riêng theo từng ván chơi (không persist)**:
  người chơi lên cấp qua EXP giết quái (`MonsterConfig.expReward`), quái được
  gán cấp = cấp người chơi + offset theo tier tại thời điểm spawn
  (`monsterLevelFor()`), rồi scale hp/dmg qua `scaledMonsterStats()`. Cấp
  người chơi chỉ tăng Máu tối đa + sát thương (`levelMultiplier()`), KHÔNG
  tăng `moveSpeed`. Toàn bộ state này sống trong scene + sync ra `world` store
  (`WorldPlayerState.level/exp/expToNext`) — KHÔNG ghi ngược vào
  `character.level`/`exp` đã persist (đó là số cố định roll lúc tạo nhân vật,
  không phải tiến trình runtime). Nếu sau này cần lưu tiến trình qua nhiều
  ván, thiết kế lại có chủ đích chứ đừng lặng lẽ đổi field đang dùng.
- Giết quái là nguồn phát điểm kỹ năng VÀ EXP duy nhất hiện tại
  (`MonsterConfig.skillPointReward`/`expReward` → `useSkillStore.
  addSkillPoints()`/`gainExp()` trong `killMonster()`) — nếu sau này thêm
  nguồn khác (nhiệm vụ...), cộng dồn qua cùng action đó, đừng tạo action mới
  trùng chức năng.
- **Trang bị ảnh hưởng combat thật**: `HudShell`/`LobbyScreen` luôn tính
  `mergeStatBonus(character.stats, getEquipmentBonus(...))` trước khi đưa vào
  `GameCanvas`/`StatsPanel` — đừng bao giờ truyền `character.stats` thô vào
  những chỗ này nữa, sẽ làm trang bị trông có tác dụng nhưng thực ra không.
- Đây là game **idle khám phá + chiến đấu auto-battler nhẹ kiểu survivor.io**
  — animation và feedback nên thiên về "đẹp, có trọng lượng" hơn là phản xạ
  cực nhanh, nhưng mật độ quái/tần suất wave được phép dồn dập hơn bản "idle
  khám phá" thuần trước đây.

## 9. Checklist: thêm quái mới hoặc ability mới

- Quái: thêm `MonsterConfig` vào `MONSTER_CONFIGS` (`modules/combat/data.ts`,
  `hp`/`contactDamage` là baseline CẤP 1, sẽ tự scale theo cấp lúc spawn),
  `kind` mới thì thêm luôn ảnh `<kind>_ingame.png` vào `public/villain/` —
  `world/scene.ts` tự `preload` theo `kind` xuất hiện trong danh sách và tự
  dựng `Actor` cho nó, không cần sửa code scene khi thêm quái (chỉ cần thêm
  data).
- Ability (skill1/skill2/ultimate): số liệu combat vào `COMBAT_LOADOUTS`
  (`modules/combat/data.ts`), `id` PHẢI trùng `SkillNode.id` tương ứng trong
  `modules/skills/data.ts` (xem mục 1). Chọn `kind` phù hợp flavor (đạn bay
  xa/xuyên táo → `bolt`; chưởng/cận chiến/mưa phép diện rộng → `burst`; tuyệt
  kỹ → luôn `ultimate`). Không cần sửa `AbilityBar`/`world/scene.ts` — cả hai
  đọc `COMBAT_LOADOUTS` theo `classId` tự động (phím J/K/L/tên/icon tự khớp
  theo skill tree).
