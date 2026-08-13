---
name: wulin-design
description: Quy ước bắt buộc khi làm việc trên game Wulin.io — kiến trúc module, quy ước animation (GSAP/Phaser/CSS), phong cách hình ảnh wuxia bắt buộc, quy ước font/ngôn ngữ (tiếng Việt), và nguyên tắc gameplay của luồng chơi hiện tại (tap/story/map). Dùng khi thêm tính năng, sửa UI, thêm animation, hoặc thêm map mới cho dự án này.
---

# Wulin.io — Quy ước thiết kế & xây dựng

Đọc file này trước khi đụng vào gameplay, UI, hoặc animation của Wulin.io.
Đây là quy tắc bắt buộc để giữ đồng nhất; **`docs/GAME_DESIGN.md`** mới là nơi
mô tả đầy đủ "hiện có những gì" — đọc cả hai, đừng chỉ đọc một trong hai.

**2026-08-12**: toàn bộ hệ thống chọn môn phái/Sảnh Chờ/combat wave (module
`character`/`inventory`/`skills`/`stats`/`combat`, component `LobbyScreen`,
`HudShell`, `PauseOverlay`, `RadialMenu`, `AbilityBar`, `CharacterStatusBar`,
`Radar`, `PanelShell`, `DynamicIcon`, và `world/scene.ts`/`world/store.ts`/
`world/types.ts`/`world/components/GameCanvas.tsx`) đã bị **xoá hẳn** khỏi
repo — không còn là "dormant" nữa. App hiện tại chỉ còn đúng luồng
Tap→Story→Map mô tả ở mục 6. Nếu cần khôi phục hệ thống cũ, xem git history
trước commit dọn dẹp này; đừng giả định các quy ước/checklist của hệ thống đó
vẫn còn áp dụng.

**2026-08-13**: `character`/`inventory` được dựng LẠI TỪ ĐẦU (không phải khôi
phục code cũ ở trên) — nhân vật/vũ khí đổi được, cộng điểm chỉ số khi lên
cấp, túi đồ + tiền (Bạc) rớt từ quái. Đòn tự động giờ đi qua
`fireAttack()` (`modules/world/attack.ts`) — ném vật phẩm bay/xoay vào quái,
sát thương chỉ áp dụng khi chạm, không còn tức thời. Xem mục 1 và mục 6.

**2026-08-13 (đợt 2)**: `IntroExperience`/`StoryIntroScreen`/
`TapToStartScreen` dời sang `modules/intro/components/` (chỉ phục vụ vài
giây đầu game, không phải thứ dùng xuyên suốt). "Nhân Vật" trong HUD giờ là
**hub trung tâm** (`CharacterPanel`, bố cục 2 cột) điều hướng sang mọi tính
năng khác — Túi Đồ (`BagPanel`, tách khỏi `CharacterPanel`), Kỹ Năng, Triệu
Hồi (`SummonPanel`, dùng Thẻ Triệu Hồi ra đồ theo phẩm chất), Thú Cưng, Thú
Cưỡi, Bạn Bè — mỗi thứ 1 domain module riêng (`summon`/`skills`/`pet`/
`mount`/`friends`) + 1 panel riêng, dùng chung khung `WuxiaModal.tsx`. Rớt
đồ trực tiếp từ quái đã BỎ — giờ rớt Thẻ Triệu Hồi (15%), đồ chỉ ra được từ
Triệu Hồi. Xem mục 1 và mục 6.

**2026-08-13 (đợt 3)**: State "panel nào đang mở" dời từ `PlayerStatusPanel`
sang component mới `GameHud.tsx` — component này giờ là nơi DUY NHẤT gom
toàn bộ layer HUD (status box + shelf + summon/minimap + panel đang mở).
Túi Đồ/Kỹ Năng/Thú Cưng/Thú Cưỡi/Bạn Bè không còn nằm trong dải nút của
`CharacterPanel` nữa — mở trực tiếp từ 1 "kệ" wuxia mới (`ShelfNav.tsx`,
art thật `public/shell.png`) đặt giữa-trên màn hình, mỗi tính năng 1 "quả
cầu bong bóng". Triệu Hồi tách riêng thành nút góc trên-phải
(`SummonQuickButton.tsx`), xếp ngay trên `GridMinimap` (minimap không còn
tự định vị `absolute right-4 top-4` nữa, để `GameHud` xếp chung 1 cột với
nút Triệu Hồi). HUD góc dưới-trái (`PlayerStatusPanel.tsx`) gọn lại còn
avatar + Máu/Nộ — không còn nút "Nhân Vật" riêng, CẢ khối giờ là 1 `<button>`
mở thẳng `CharacterPanel`, hiện badge đỏ số điểm chỉ số chưa tiêu khi > 0.
`CharacterPanel` bỏ hẳn dải nút điều hướng 6 tính năng cũ, chỉ còn 2 tab:
"Chỉ Số" (mọi `StatRow`) và "Nhân Vật" (portrait + đổi nhân vật + vũ khí
đang mặc, đọc-only). Icon lucide tạm cho Thú Cưng/Thú Cưỡi/Bạn Bè đã đổi
sang ảnh thật vừa upload (`pet.png`/`mount.png`/`friends.png`); icon Bạc
trong `BagPanel` sửa từ nhầm `bag.png` sang `coins.png`. Xem mục 1 và mục 6.

**2026-08-13 (đợt 4)**: Loạt sửa UI/gameplay theo phản hồi cụ thể. HUD: hiện
số máu/Nộ dạng `value/max` (không chỉ thanh); máu tự hồi 1/giây khi còn sống
và chưa đầy (`healPlayer()` trong `liveHud.ts`, tick trong `mapScene.ts`),
LUÔN hồi theo `maxHp` hiện tại chứ không hardcode 100. `ShelfNav` dời xuống
góc phải-dưới, thu nhỏ hẳn (trước đó to, giữa-trên). Góc phải-trên xếp lại:
`GridMinimap` LUÔN ở trên cùng, hàng icon nhanh (hiện chỉ có
`SummonQuickButton`, còn chỗ cho sau này VD sự kiện) nằm BÊN TRÁI minimap,
tự wrap xuống dòng nếu dài. `WuxiaModal`'s nút X dời ra làm sibling của
khung `overflow-y-auto` thay vì con bên trong nó — nút bị con overflow-y-auto
kéo theo `overflow-x: auto` ẩn luôn, cắt cụt nút nằm ngoài biên
(`-right-3 -top-3`). Nhân vật: roster mở rộng từ 1 lên 7 (toàn bộ ảnh trong
`public/character/ingame/` trừ `zombie.png`/`deer_injured.png` — xem
`character/data.ts`), MỖI nhân vật có `baseHp`/`baseAttack` RIÊNG (không còn
hằng số `BASE_HP`/`BASE_ATTACK` toàn cục). `CharacterPanel` tab "Chỉ Số"
thêm hàng nối nhân vật-vũ khí ở đầu; tab "Nhân Vật" đổi hẳn thành danh sách
chọn (preview chỉ số gốc trước, bấm "Chọn Nhân Vật Này" mới đổi thật).
`BagPanel`'s item row giờ gọn, hover mới lộ dòng chỉ số (CSS grid-rows
0fr→1fr) — pattern này cũng áp dụng cho Pet/Mount khi có data thật.
`FriendsPanel` có `useFriendsStore` thật (rỗng, persist) thay vì hoàn toàn
tĩnh, list dọc 1 bạn/hàng khi có data. `SkillsPanel` đổi hẳn từ lưới ô khoá
sang CÂY kỹ năng thật (`modules/skills/`) — node theo tier/prerequisite,
bấm node có nút "Học" (gate theo cấp + kỹ năng tiên quyết, KHÔNG có bonus
gameplay thật). `SummonPanel` thêm hiệu ứng quay (GSAP timeline xoay/phóng
icon tiệm) trước khi lộ kết quả, và nút "Xem Tỉ Lệ Rớt Đồ" hiện bảng % theo
`getRarityWeights`/`getRarityPercentages` (`summon/store.ts`) — CÙNG hàm
`rollRarity` dùng để roll thật, không tính riêng 2 lần. Xem mục 1 và mục 6.

**2026-08-13 (đợt 5)**: `WuxiaTooltip.tsx` (mới) thay toàn bộ `title` gốc của
trình duyệt (delay dài, style mặc định xấu) trên các icon HUD (`ShelfNav`,
`SummonQuickButton`, `GridMinimap`, `PlayerStatusPanel`, nút vũ khí trong
`CharacterPanel`) — CSS `group-hover` thuần, hiện ngay lập tức, style giấy
da. 2 bug lớp "clip cạnh" đã gặp và sửa khi làm tooltip này (đọc kỹ
`WuxiaTooltip.tsx`'s doc comment trước khi thêm tooltip mới): (1) trigger có
`hover:scale-*` tự tạo stacking context riêng lúc hover, làm z-index của
tooltip không còn so được với sibling (VD `GridMinimap` đè lên tooltip của
`SummonQuickButton`) — sửa bằng `hover:z-30` trên chính TRIGGER, không phải
chỉ trên tooltip; (2) tooltip nằm trong `WuxiaModal` (có `overflow-y-auto`)
bị cắt cụt nếu trigger ở gần mép trái/phải panel — `WuxiaTooltip` có prop
`align: "start"|"center"|"end"` để neo tooltip theo mép gần trigger thay vì
luôn căn giữa. Song song đó: Bạn Bè đổi từ panel modal sang **dropdown neo
ngay tại nút** trên `ShelfNav` (`FriendsDropdown.tsx`, state cục bộ trong
`ShelfNav`, KHÔNG còn qua `activePanel`/`PanelId` — `"friends"` đã bị xoá
khỏi `PanelId`). Nút "← Nhân Vật" bị xoá khỏi Túi Đồ/Kỹ Năng/Triệu Hồi/Thú
Cưng/Thú Cưỡi — các panel này không còn mở TỪ `CharacterPanel` nữa (mở
thẳng từ `ShelfNav`/`SummonQuickButton`) nên back-to-Nhân-Vật không còn hợp
lý; các panel đó giờ chỉ nhận `onClose`, không nhận `onNavigate` nữa (chỉ
`CharacterPanel` còn giữ `onNavigate` — cần nó để nhảy sang "bag" từ nút vũ
khí). `BagPanel` đổi từ list dòng dài sang GRID icon vuông — tên/phẩm chất/
chỉ số chuyển hẳn vào `WuxiaTooltip` khi hover, đồ ĐANG trang bị chỉ còn 1
badge dấu tick góc trên-phải (không còn nút chữ "Đang Dùng"/"Trang Bị" dài).
Xem mục 1 và mục 6.

**2026-08-13 (đợt 6)**: Thêm Cài Đặt (tắt/mở nhạc nền) vào `CharacterPanel`
— nhưng KHÔNG phải hàng pill-tab bên TRONG modal (yêu cầu rõ 2 lần: lần đầu
"đừng chen vào dải tab Chỉ Số/Nhân Vật", lần chỉnh lại "cả 3 tab đều phải
nằm ngoài rìa modal kiểu dấu trang sách"). Kết quả cuối: `WuxiaModal` có
thêm prop `edgeTabs` — 1 CỘT nút "bookmark" thò ra khỏi rìa TRÁI modal (định
vị bằng `right-full` + `items-end`, không phải offset tay), tab đang active
tự rộng ra/sáng màu hơn (parchment) còn tab không active hẹp/tối màu (gỗ) —
đúng cảm giác "dấu trang sách". Cả 3 tab của `CharacterPanel` (Chỉ Số/Nhân
Vật/Cài Đặt) đều là `EdgeTab` — không còn hàng pill-tab bên trong modal nữa,
Cài Đặt cũng không còn là icon-góc-mở-dropdown (bản đầu tiên, đã bỏ) mà là 1
tab thật đổi nội dung y hệt 2 tab kia. `modules/settings/` (mới) —
`useSettingsStore` persist `{ musicMuted: boolean }`; `useMapMusic.ts` tự
set `audio.muted = musicMuted` (không `pause()`, giữ nguyên tiến trình bài
hát) mỗi khi giá trị đổi. Xem mục 1 và mục 6.

**2026-08-13 (đợt 7)**: `CharacterPanel`'s khối nội dung tab bọc thêm
`min-h-97.5` (=390px, đo bằng Playwright — khớp chiều cao tab "Chỉ Số", tab
mặc định) — tab "Cài Đặt" ngắn hơn nhiều (chỉ 1 hàng toggle) nên trước đó
đổi tab làm modal co/giãn đột ngột ("giật"). `min-h` chỉ đặt SÀN, không giới
hạn trần — tab "Nhân Vật" (danh sách nhân vật) vẫn tự cao hơn khi cần, vẫn
bị `max-h-[85vh]` của `WuxiaModal` chặn lại như cũ. Muốn đổi mốc chiều cao
này thì đo lại bằng Playwright (`getBoundingClientRect().height` trên từng
tab) chứ đừng đoán số.

## 1. Kiến trúc module — không thương lượng

- Domain code nằm trong `src/modules/<domain>/`: `world` (bản đồ, di chuyển,
  combat, HUD runtime), `character` (nhân vật + tiến trình cấp/điểm chỉ số,
  persist — roster 7 nhân vật, mỗi nhân vật `baseHp`/`baseAttack` riêng, xem
  `data.ts`), `inventory` (vũ khí/túi đồ/tiền/thẻ triệu hồi, persist),
  `summon` (phẩm chất + cơ chế triệu hồi, persist cấp tiệm), `skills` (cây kỹ
  năng thật — node/tier/prerequisite trong `data.ts`, `learnedSkillIds`
  persist trong `store.ts`, chưa có bonus gameplay thật), `friends`
  (`useFriendsStore` persist, rỗng cho tới khi có hạ tầng multiplayer),
  `intro` (luồng tap/story mở đầu, KHÔNG có domain data — chỉ `components/`),
  `pet`/`mount` (mỗi thứ hiện chỉ 1-2 file `types.ts`/`data.ts` rỗng/tối
  giản, chưa có cơ chế/data thật — xem mục 6). Type + component + data + store của 1
  domain nằm trong thư mục riêng của nó, không import chéo data layer bừa
  giữa các domain — hướng import CHỈ ĐƯỢC 1 CHIỀU khi 1 domain cần đọc domain
  khác (VD `character/store.ts` → `inventory` để cộng bonus vũ khí,
  `summon/store.ts` → `inventory` để tiêu thẻ/thêm đồ) — domain bị đọc
  KHÔNG được import ngược lại (tránh vòng lặp). Nơi nào cần đồng bộ 2 chiều
  (VD trang bị đồ xong cần đồng bộ máu tối đa) thì gọi từ nơi THỨ BA đang
  dùng cả hai (component, hoặc `mapScene.ts`), không phải từ trong chính 1
  trong 2 store đó.
- **6 panel hub (Character/Bag/Skills/Summon/Pet/Mount) dùng CHUNG 1 khung
  modal** — `src/app/component/WuxiaModal.tsx` (backdrop + 2 thanh gỗ + panel
  giấy da + tiêu đề + nút X). Thêm panel mới (cỡ full-screen) thì bọc nội
  dung trong `<WuxiaModal>`, đừng viết lại khung này lần nữa. **Bạn Bè KHÔNG
  nằm trong nhóm này** — nó mở dạng dropdown nhỏ neo tại nút, không phải
  panel full-screen (xem `FriendsDropdown.tsx`, mục 6), nên không có trong
  `PanelId` (đổi đợt 5). Chỉ `CharacterPanel` còn nhận prop
  `onNavigate(panel: PanelId)` (`hubPanelId.ts`) — nó cần nhảy sang "bag" từ
  nút vũ khí; 5 panel còn lại chỉ nhận `onClose` (đổi đợt 5 — trước đó cả 6
  đều nhận `onNavigate` để tự vẽ nút back). Không panel nào tự quản state
  "panel nào đang mở" (chỗ đó là `GameHud.tsx`, xem mục 6).
- **`WuxiaModal`'s prop `edgeTabs`** (mới, đợt 6) — 1 CỘT nút "bookmark" thò
  ra khỏi rìa TRÁI modal (`right-full` + `items-end`, KHÔNG offset pixel tay
  — mỗi tab tự quyết định nó "thò ra" bao nhiêu bằng width riêng của chính
  nó, tab active rộng hơn/sáng màu hơn tab không active). Dùng khi 1 panel
  cần NHIỀU pane nội dung chuyển qua lại nhưng không muốn hàng tab-pill
  chiếm chỗ bên trong modal (VD `CharacterPanel`'s Chỉ Số/Nhân Vật/Cài Đặt —
  `EdgeTab` trong `CharacterPanel.tsx`). Chỉ là chỗ định vị thuần — component
  truyền vào (`ReactNode`) tự quản state tab đang chọn, `WuxiaModal` không
  biết gì về nó. Khác `PanelId`/`onNavigate` (mục điều hướng GIỮA CÁC panel
  khác nhau) — `edgeTabs` là chuyển pane BÊN TRONG CÙNG 1 panel.
- **`modules/settings/`** (mới, đợt 6) — `useSettingsStore` persist
  (`{ musicMuted: boolean }`), domain riêng dù hiện chỉ có 1 field vì cài
  đặt kiểu này gần như luôn phình to dần theo thời gian (âm lượng SFX, ngôn
  ngữ...). `useMapMusic.ts` (`modules/world/`) đọc store này, set
  `audio.muted` (KHÔNG `pause()`) mỗi khi đổi — giữ nguyên vị trí bài hát
  đang phát, unmute lên tiếp tục chứ không phát lại từ đầu.
- **`WuxiaTooltip.tsx`** — tooltip hover style giấy da DÙNG CHUNG, thay
  `title` gốc của trình duyệt trên MỌI icon HUD không có nhãn chữ đi kèm
  (`ShelfNav`/`SummonQuickButton`/`GridMinimap`/`PlayerStatusPanel`/nút vũ
  khí trong `CharacterPanel`). Đọc kỹ doc comment đầu file trước khi thêm
  tooltip mới ở đâu đó — có 2 bug lớp "bị clip cạnh" đã gặp và ghi lại cách
  né: (1) trigger có `hover:scale-*` tự tạo stacking context riêng lúc hover
  → phải thêm `hover:z-30` trên chính TRIGGER (không chỉ trên tooltip) nếu
  trigger đứng cạnh 1 sibling đối lập (VD `GridMinimap`); (2) tooltip nằm
  trong 1 `WuxiaModal` (có `overflow-y-auto`, tự kéo theo `overflow-x` ẩn)
  bị cắt cụt nếu trigger gần mép trái/phải panel → dùng prop `align:
  "start"|"center"|"end"` thay vì luôn để mặc định `"center"`.
- `GameHud.tsx` là component gom TOÀN BỘ layer HUD của `MapScreen`:
  `PlayerStatusPanel` (status box góc dưới-trái) + `ShelfNav` (kệ tính năng,
  NHỎ, góc phải-dưới — đổi 2026-08-13 đợt 4, trước đó to/giữa-trên) + hàng
  góc phải-trên (`GridMinimap` LUÔN trên cùng, `SummonQuickButton` + icon
  nhanh khác sau này nằm BÊN TRÁI minimap, tự `flex-wrap` xuống dòng nếu dài)
  + panel đang mở. `MapScreen` chỉ truyền `cells`/`position`/`visited`
  xuống, không tự biết gì về hub — thêm 1 nút mở panel mới thì sửa
  `GameHud`/`ShelfNav`, không sửa `MapScreen`.
- `liveHud.ts` (`modules/world/`) CHỈ chứa state runtime-1-mạng (hp hiện tại,
  Nộ) — tiến trình PERSIST (cấp, exp, điểm chỉ số, vũ khí trang bị) sống ở
  `character`/`inventory`. Đừng gộp lại 2 loại state này vào 1 store — mất
  ý nghĩa "cái gì sống qua reload, cái gì reset mỗi mạng".
- Mọi nhân vật hiển thị trong `world` (player, quái) PHẢI dựng qua class
  `Actor` (`modules/world/actor.ts`), không viết lại logic xoay/di chuyển thủ
  công ở chỗ khác — xem mục 3.
- **Một concern có khả năng phình to/đa dạng hoá sau này PHẢI có module/class
  riêng ngay từ lần đầu viết, dù bản đầu tiên chỉ có đúng 1 trường hợp cụ
  thể** — đừng viết gộp tạm vào file đang orchestrate nó chỉ vì hiện tại nó
  còn nhỏ. Ví dụ tham chiếu: `Monster` (`modules/world/monster.ts`) — quái sẽ
  còn nhiều loại hình dáng/hành vi khác nhau, nên tách hẳn khỏi
  `mapScene.ts` ngay từ con quái đầu tiên, dù lúc đó chỉ có 1 loại; tương tự
  `Actor` đã tách khỏi scene ngay từ đầu vì player + quái đều cần dùng
  chung. `mapScene.ts` chỉ còn là orchestrator mỏng gọi method của các class
  này, không tự tay cầm state/logic thuộc về chúng. Ngược lại, 1 hàm tiện ích
  dùng chung, không có state, không có khả năng phình to (VD
  `spawnDamageText` trong `modules/world/damageText.ts`) vẫn nên tách file
  riêng nếu dùng ở nhiều nơi — nhưng không cần dựng thành class. Cơ chế "ném
  vật phẩm tấn công" cũng theo nguyên tắc này: `fireAttack()`
  (`modules/world/attack.ts`) là module DÙNG CHUNG cho mọi đòn ném (người
  chơi hiện tại, quái/skill sau này) — đừng viết tween ném đồ + nổ + số sát
  thương tay thêm 1 lần nữa ở nơi khác, luôn gọi hàm này.
- Component nào gộp nhiều module lại (HUD, dialogue, minimap, backdrop…) thì
  nằm ở `src/app/component/`, KHÔNG nằm trong một module cụ thể nào — kể cả
  khi nó chỉ đang được 1 màn hình dùng.
- Không tạo `src/components/` hay `src/lib/` dùng chung chung — mọi thứ hoặc
  thuộc một module, hoặc thuộc `src/app/component/`.
- Mỗi map là 1 module tự chứa dưới `modules/world/maps/`, KHÔNG import config
  hình ảnh/logic riêng vào component — xem mục 6.

## 2. Font & ngôn ngữ — bắt buộc

- **Toàn bộ nội dung hiển thị cho người chơi là tiếng Việt** — tiêu đề, thoại,
  cốt truyện, nhãn HUD, tooltip, nút bấm. Viết câu ngắn, nghĩa rõ ngay lần đọc
  đầu tiên, tránh ẩn dụ/chơi chữ/hoa mỹ khó hiểu — đọc phát hiểu luôn, không
  bắt người chơi đoán ý.
- 3 font khai báo ở `src/app/layout.tsx` (`src/assets/*.ttf`), đặt tên biến
  CSS/class Tailwind theo đúng tên font thật — KHÔNG dùng tên ẩn dụ kiểu
  `font-title`/`font-sans` (khó kiểm soát chỗ nào dùng font gì):
  - **`font-vl`** (VL TypewriterBasiX) — font mặc định của toàn trang
    (`body` không cần gắn class), dùng cho MỌI văn bản đọc: thoại, cốt
    truyện, nhãn HUD, tooltip. Chỉ cần gắn `font-vl` thủ công khi đang ở
    trong 1 phần tử bị cha đổi sang font khác và cần ép về lại mặc định.
  - **`font-bmx`** (BMX Radical) — CHỈ dùng cho tên thương hiệu game
    ("Wulin Animal" ở `TapToStartScreen`) và chữ "impact" cỡ cực lớn để nhấn
    mạnh 1 khoảnh khắc (kiểu "FIGHT"/"DIED" trong game đối kháng — hiện chưa
    có trong code, đây chỉ là quy ước dành sẵn, đừng tự dựng tính năng đó khi
    chưa được yêu cầu).
  - **`font-p22`** (P22 Slogan) — tiêu đề/thông báo ngắn, đơn giản: prompt
    "Chạm Để Bắt Đầu"/"Chạm để tiếp tục", nhãn "Di Chuyển" trong
    `TutorialOverlay`, tên người nói trong `DialogueBox`.
- **Cỡ chữ văn bản đọc được nhắm khoảng ~28px** (`text-[28px]`, hoặc bậc gần
  nhất của Tailwind — `text-xl`/`text-2xl` cho phần phụ) — không dùng
  `text-xs`/`text-sm` cho nội dung chính (tiêu đề, thoại, prompt, nhãn quan
  trọng), nhưng cũng đừng đẩy lên quá to (`text-3xl`+) cho văn bản đọc dài,
  chỉ tiêu đề thương hiệu (`font-bmx`) mới cần lớn hơn hẳn. Ngoại lệ hợp lý:
  glyph 1 ký tự trong ô phím nhỏ (`KeyCap` trong `TutorialOverlay`) và số liệu
  trong HUD góc màn hình — những chỗ này giữ nhỏ hơn 28px vì là UI phụ, không
  phải văn bản đọc chính.
- **Game hiện chỉ chơi trên máy tính — không cần tối ưu responsive.** Đừng
  thêm biến thể `sm:`/`md:`/... cho cỡ chữ hay kích thước trừ khi được yêu
  cầu rõ ràng; chọn 1 giá trị cố định phù hợp cho màn hình desktop.

## 3. Animation — 3 hệ thống, không trộn

| Ở đâu | Dùng gì | Khi nào |
|---|---|---|
| React/DOM (UI, chuyển cảnh, hover, panel) | **GSAP** (+ `@gsap/react` cho component có mount/unmount rõ ràng) | Luôn |
| Bên trong Phaser canvas (bob, xoay mũi tên, di chuyển NPC) | **Phaser tự animate trong `update()`** | Luôn — không dùng GSAP để animate object trong canvas |
| Hiệu ứng lặp vô hạn, không phụ thuộc state (mist trôi, radar sweep, breathing glow) | **CSS `@keyframes`** trong `globals.css` | Ưu tiên trước GSAP nếu không cần điều khiển từ JS — rẻ hơn, không tốn JS tick |

Quy tắc cụ thể đã rút ra khi xây dựng:

- **Art nhân vật vẽ nhìn thẳng về camera (neutral pose = "hướng xuống"),
  không phải hướng phải** — `Actor.update()` phải cộng bù
  `FACING_ART_OFFSET = -Math.PI / 2` khi set `rotation`, không được gán thẳng
  `rotation = moveAngle`. Thiếu bù sẽ lệch góc 90° — bug này đã xảy ra thật,
  xem `modules/world/actor.ts`.
- **`gsap.quickTo(el, "rotateX"/"rotateY", ...)` KHÔNG hoạt động** ở bản GSAP
  đang dùng (3.15) — alias không được resolve, animation chạy nhưng element
  không xoay (không có lỗi console, rất dễ bỏ sót). Luôn dùng tên chuẩn
  `"rotationX"`/`"rotationY"` khi gọi `quickTo`. `.to()`/`.set()` thì cả hai
  tên đều dùng được bình thường, vấn đề chỉ nằm ở `quickTo`.
- Component dùng hook `useGSAP` (từ `@gsap/react`) phải tự gọi
  `gsap.registerPlugin(useGSAP)` ở đầu file — không tạo file khởi tạo riêng,
  lệnh này idempotent.
- Hạt sáng / phần tử lặp lại nhiều instance (VD: `.mote` trong
  `SceneBackdrop`) phải tính vị trí/độ trễ **xác định theo index**, KHÔNG
  dùng `Math.random()` trong render — component chạy qua SSR trước khi
  hydrate, giá trị ngẫu nhiên khác nhau giữa server/client sẽ gây lỗi
  hydration mismatch.
- Chuyển cảnh toàn màn hình ưu tiên hiệu ứng có chủ đích (mask, iris, blink…)
  hơn là fade phẳng đơn thuần khi khoảnh khắc đó có ý nghĩa tường thuật. Hiện
  có 2 kiểu, mỗi kiểu ngữ cảnh riêng — đừng dùng lẫn lộn: chớp mắt/eye-blink
  (`IntroExperience`, 2 lid `scaleY` phủ từ top/bottom — dùng khi đổi bối
  cảnh lớn, có ý nghĩa tường thuật), fade đen phẳng (`MapScreen`, đổi phòng
  trong map — dùng khi chuyển cảnh chỉ là kỹ thuật, không cần kịch tính).
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
  `.clipPath`/`.opacity`), đừng chỉ tin vào việc code "trông đúng" hoặc chỉ
  nhìn screenshot tĩnh — hiệu ứng tinh vi (tilt vài độ, clip-path) rất khó
  thấy bằng mắt trên một ảnh chụp, nhưng sai một property name thì hiệu ứng
  im lặng không chạy. Nếu nghi ngờ một `useEffect` đang re-mount cả canvas
  Phaser thay vì chỉ animate DOM (triệu chứng: "chớp màn hình" khi chỉ đổi
  state không liên quan), đếm số lần Phaser boot log (`/Phaser v/i` trong
  console) trước/sau hành động — tăng thêm nghĩa là effect đang re-run vì 1
  dependency (thường là array/object literal tạo mới mỗi render) chứ không
  phải do animation.
- **Tạo `Phaser.Game` mới thì LUÔN đo `container.clientWidth/clientHeight`
  thật để truyền vào `scale.width/height`, đừng truyền chuỗi `"100%"`** —
  chuỗi `%` chỉ resolve 1 lần lúc boot, nếu container React chưa layout xong
  đúng lúc đó (dễ xảy ra vì `Phaser.Game` thường được tạo trong `useEffect`
  ngay sau render) thì canvas khóa cứng ở size nhỏ hơn thật, hở 1 dải nền đen
  — dù `Phaser.Scale.RESIZE` đang bật cũng không tự sửa. Bug này đã xảy ra
  thật ở `MapCanvas.tsx`, đã sửa. Nhớ thêm `window.addEventListener("resize",
  () => game.scale.resize(container.clientWidth, container.clientHeight))`
  để chắc chắn khớp cả khi viewport đổi sau này.

## 4. Phong cách hình ảnh — bắt buộc nghiêng wuxia

Mọi UI/component MỚI (HUD, panel, dialogue, minimap, overlay...) phải nghiêng
về thẩm mỹ wuxia — giấy da/cuộn thư cũ, nét mực thư pháp, dấu triện đỏ-vàng,
khung gỗ vân/2 đầu cuộn tròn, tông màu đất-đỏ-vàng ấm trầm — thay vì UI game
hiện đại phẳng chung chung (thanh neon phẳng, HUD kiểu corporate sans-serif).

- **Chưa có art thật thì dùng CSS-only làm giải pháp tạm** (gradient
  `linear-gradient`/`radial-gradient` tông giấy da, border màu mực nâu sậm
  `#5c3a21`/`#7a5230`, `box-shadow` inset để tạo cảm giác giấy cũ, 2 thanh gỗ
  bo tròn ở đầu/cuối để mô phỏng cuộn thư) — xem `DialogueBox.tsx`/
  `TutorialOverlay.tsx`/`PlayerStatusPanel.tsx` làm ví dụ. Đây là fallback
  được chấp nhận cho tới khi có asset thật (đối chiếu mục Roadmap "Stylized
  Chinese ink painting" trong `docs/GAME_DESIGN.md`) — đừng chặn việc ra UI
  mới chỉ vì chưa có ảnh.
- `GridMinimap` dùng art thật (`public/minimap.png`) làm backdrop — khi có
  thêm art thật cho panel khác, ưu tiên thay CSS-only bằng ảnh thật theo đúng
  cách đã làm ở đây (scrim tối phía trên để giữ độ đọc được của nội dung).
- Font dùng cho UI wuxia là `font-vl`/`font-bmx`/`font-p22` — xem mục 2 để
  biết ngữ cảnh dùng font nào, đừng tự đổi font stack khi chỉ được yêu cầu
  đổi màu sắc/layout.

## 5. Trước khi báo "xong"

- `yarn lint && yarn build` phải sạch.
- Với bất kỳ thay đổi UI/animation nào: chạy dev server, dùng Playwright
  (`chromium.launch()` qua script tạm trong thư mục scratchpad) để đi qua
  luồng thật (Tap để bắt đầu → đọc cốt truyện → vào map → di chuyển → mở
  minimap → kích hoạt thoại/tutorial nếu có) và chụp ảnh kiểm tra bằng mắt,
  đồng thời check `console --errors`/`pageerror`/`requestfailed` rỗng.
- Cập nhật `docs/GAME_DESIGN.md` (mục "Đã có" + "Roadmap") nếu tính năng mới
  làm thay đổi hành vi đã mô tả ở đó.

## 6. Nguyên tắc gameplay (đừng phá vỡ khi thêm tính năng)

Đây là toàn bộ app hiện tại — luồng Tap→Story→Map, không còn phần combat/Sảnh
Chờ song song nào khác.

- **Tap-anywhere + Space**, không cần bấm trúng chữ: quy ước cho MỌI màn chờ
  người dùng "tiếp tục" (`TapToStartScreen`, `StoryIntroScreen`,
  `DialogueBox`). Bấm/chạm ở bất kỳ đâu trên màn hình HOẶC nhấn phím Space
  đều kích hoạt — không được thu hẹp vùng bấm về đúng dòng chữ hướng dẫn. Nếu
  thêm màn chờ mới kiểu này, làm theo đúng pattern: `onClick` trên root
  container + `window.addEventListener("keydown", ...)` bắt `e.code ===
  "Space"` trong `useEffect`.
- **Map là 1 lưới 2 chiều (`mapGrid.ts`), tường/link do lưới TỰ SUY RA —
  đừng cấu hình `walls` thủ công cho từng phòng**: viết layout bằng
  `GridSymbol[][]` (`0`/`1`/`"X"`/`"B"`/`"S"`/`"?"`, xem docstring
  `mapGrid.ts`), gọi `parseGridMap()` rồi `getCellWalls(map, row, col)` —
  hàm này tự soi 4 ô lân cận trong lưới để quyết định cạnh nào mở/chặn. Cạnh
  có ô lân cận tồn tại (trong biên lưới, khác `0`) → MỞ, đi sát biên đó →
  chuyển phòng, xuất hiện ở cạnh ĐỐI DIỆN của phòng mới (`OPPOSITE_EDGE`, đủ
  cả 4 hướng). Cạnh không có ô lân cận → kẹt lại, render `wallSrc`, không sự
  kiện gì.
- **Hàng trong `grid` được phép JAGGED (độ dài khác nhau, kể cả `[]` rỗng) —
  đừng độn `0` chỉ để hàng nào cũng dài bằng nhau hoặc để giữ hình chữ nhật.**
  Ô nằm ngoài độ dài hàng của nó (hoặc hàng ngoài số hàng của lưới) tự hiểu
  là `0` (không có phòng) — chỉ cần ghi đúng những ô có phòng thật, mê cung
  hình dạng bất kỳ vẫn viết được mà không tốn ký tự cho phần "không có gì".
  `MAX_GRID_SIZE = 30` (`mapGrid.ts`) — mốc mềm chống lỗi gõ nhầm, không phải
  giới hạn kỹ thuật (minimap không còn render nguyên lưới, xem mục HUD dưới
  cùng).
- **Mỗi map là 1 module tự chứa dưới `modules/world/maps/`, KHÔNG BAO GIỜ là
  "demo"** — mỗi file (VD: `start.ts`) tự hardcode `grid`, `obstaclesByCell`,
  `subjectsByCell`, `music`, `showTutorial`, `roomStyles` (ảnh
  sàn/tường/tint theo TỪNG LOẠI phòng — `empty`/`normal`/`boss`/`special`/
  `unknown`) và `floorOverridesByCell` (ép ảnh sàn cho 1 ô cụ thể, VD ô bắt
  đầu luôn là đất) của đúng map đó, đăng ký vào `MAP_MODULES`/`MAP_ORDER`
  (`maps/index.ts`). `MapScreen` chỉ đọc `currentMapId` từ
  `useMapProgressStore` (persisted) rồi tra `map.roomStyles[cell.kind]` +
  `map.floorOverridesByCell` để lấy `floorSrc`/`wallSrc`/`tint` — **component
  không tự quyết "phòng loại X trông ra sao" bằng ternary/if-else, mọi quyết
  định đó là dữ liệu khai báo trong map module**. Thêm map mới = thêm 1
  module + 1 dòng `MAP_ORDER`, KHÔNG sửa `MapScreen`. Thêm loại phòng mới có
  ảnh riêng thì thêm entry vào `roomStyles` của map đó, không sửa
  `MapScreen`/`mapScene.ts`.
- **Vật cản trong phòng (`ObstacleConfig`) khai báo vị trí theo TỈ LỆ
  (`xFrac`/`yFrac`, 0-1), không phải pixel cứng** — giữ đúng vị trí tương
  đối khi phòng đổi size theo `roomScale`/viewport. Chưa có `spriteSrc` thì
  cứ để trống, tự fallback hình chữ nhật xám.
- **Vật thể cốt truyện (`SubjectConfig`, mở rộng từ `ObstacleConfig`)** —
  chặn đường giống obstacle bình thường, nhưng có thêm `dialogue?:
  DialogueLine[]` bắn 1 lần duy nhất qua `DialogueBox` khi người chơi đến
  đúng phòng chứa nó lần đầu (theo dõi bằng 1 `Set` session, không persist).
  VD hiện có: `company.png` ở phòng bắt đầu.
- **Nhạc nền theo map, loop bằng `<audio>` của React, KHÔNG phải Phaser sound
  manager** (`useMapMusic(playlist, mapKey)`, `modules/world/useMapMusic.ts`)
  — lý do: `MapCanvas` bị destroy/recreate mỗi lần đổi phòng
  (`key={cellKey(...)}`), nhạc do Phaser quản sẽ bị restart mỗi lần đổi
  phòng trong CÙNG 1 map. Hook này mount ở `MapScreen` (ngoài subtree theo
  phòng), chỉ restart khi `mapKey` (map id) thực sự đổi, và tự loop qua
  playlist khi hết bài (`onended`).
- **`MapScreen`'s `obstacles`/`subjects` PHẢI được `useMemo` theo
  `[map, posKey]`** — `MapCanvas`'s `useEffect` phụ thuộc các mảng này theo
  reference; nếu tạo mảng mới bằng spread (`[...a, ...b]`) trên mỗi render
  mà không memo, MỌI `setState` không liên quan (VD: đóng dialogue/tutorial)
  sẽ khiến React coi `obstacles` là "đã đổi", destroy/recreate toàn bộ
  `Phaser.Game` → chớp màn hình. Bug này đã xảy ra thật và đã sửa — nếu thêm
  field mới vào object truyền cho `MapCanvas`, luôn cân nhắc có cần `useMemo`
  hay không.
- **Tutorial chỉ hiện theo `MapModule.showTutorial`**, không unconditional —
  panel to, hiện rõ cả 2 cụm phím WASD và mũi tên (↑↓←→).
- **HUD góc dưới-trái (`PlayerStatusPanel.tsx`) CHỈ còn avatar + Máu/Nộ, CẢ
  KHỐI là 1 `<button>`** (đổi 2026-08-13, đợt 3) — không còn icon "Nhân Vật"
  riêng bên trong nữa, bấm bất kỳ đâu trên khối cũng mở `CharacterPanel`
  (qua prop `onOpenCharacter`, do `GameHud` truyền xuống). Khi
  `character.statPoints > 0` (vừa lên cấp hoặc còn điểm chưa tiêu), CẢ khối
  hiện 1 badge tròn đỏ góc trên-phải ghi số điểm (`+N`, `animate-pulse`) —
  đừng làm badge này chỉ thoáng qua lúc lên cấp, nó phải còn hiện chừng nào
  `statPoints` còn > 0. Mỗi thanh Máu/Nộ hiện CẢ số `value/max` (không chỉ
  thanh, đổi đợt 4) — `VitalBar` trong `PlayerStatusPanel.tsx`. `hp`/`maxHp`/
  Nộ đọc từ `modules/world/liveHud.ts`, cấp/exp/statPoints đọc từ
  `modules/character/store.ts` (2 store khác nhau — xem mục 1).
  `ExperienceBar` (thanh EXP full-width) luôn nằm riêng, fixed sát đáy màn
  hình, tách biệt khỏi khối HUD góc trái để không bị che.
- **Máu tự hồi 1/giây** (đổi đợt 4) — `healPlayer()` trong `liveHud.ts`,
  tick trong `mapScene.ts`'s `updateCombat()` (field riêng
  `lastHpRegenTickAt`, hằng `HP_REGEN_TICK_MS = 1000`), chỉ chạy khi
  `hp > 0 && hp < maxHp`. LUÔN clamp theo `maxHp` HIỆN TẠI (đọc từ store,
  không phải hằng số cứng) — tự đúng khi `maxHp` đổi do lên cấp/cộng điểm/
  đổi vũ khí/đổi nhân vật, không cần sửa gì thêm ở chỗ gọi.
- **Mọi tính năng khác không còn nằm trong `PlayerStatusPanel`/`CharacterPanel`
  nữa — mỗi thứ có vị trí HUD riêng, tất cả do `GameHud.tsx` xếp**:
  - **`ShelfNav.tsx`** (kệ NHỎ góc phải-dưới — đổi đợt 4, trước đó to/
    giữa-trên; art thật `public/shell.png`, 5 "quả cầu bong bóng" tròn
    trong suốt kiểu kính) — 4/5 bubble (Túi Đồ/Kỹ Năng/Thú Cưng/Thú Cưỡi)
    gọi `onNavigate(id)` để mở panel full-screen tương ứng; bubble thứ 5
    (Bạn Bè) KHÁC — bấm vào toggle `friendsOpen` cục bộ, mở
    `FriendsDropdown` neo tại chính nó thay vì đi qua `onNavigate` (đổi đợt
    5, xem mục 1). Icon dùng ảnh thật cho cả 5: `bag.png`/`skills.png`/
    `pet.png`/`mount.png`/`friends.png` — không còn icon lucide fallback nào
    trong panel/nav nữa kể từ đợt 3, toàn bộ đã có art thật.
  - **`SummonQuickButton.tsx`** (góc phải-trên, xếp BÊN TRÁI `GridMinimap`
    trong 1 hàng `flex-wrap` do `GameHud` dựng — đổi đợt 4, trước đó xếp
    TRÊN minimap theo cột dọc; giờ minimap LUÔN ở vị trí trên-cùng-ngoài-
    cùng cố định, hàng icon nhanh bên trái tự rớt xuống dòng 2 nếu sau này
    thêm icon khác VD sự kiện, không đẩy minimap dịch chỗ) mở `SummonPanel`
    trực tiếp — Triệu Hồi tách khỏi 5 tính năng kia vì tần suất bấm cao hơn
    hẳn (ngay sau khi rớt thẻ giữa combat), không đáng để lùi vào kệ/hub.
    Hiện badge tím số thẻ triệu hồi đang có nếu > 0.
  - `GridMinimap` KHÔNG còn tự định vị (`absolute right-4 top-4`) — nhận vị
    trí từ wrapper `fixed right-4 top-4` trong `GameHud`, overlay phóng to
    dùng `fixed inset-0` (độc lập với wrapper) để luôn full-screen.
- **`CharacterPanel.tsx` là hub thuần chỉ số + nhân vật + cài đặt, 3 tab**
  (đổi 2026-08-13, đợt 3 — không còn bố cục 2 cột + dải nút điều hướng 6
  tính năng của đợt 2 nữa; đợt 6 thêm tab thứ 3). **Bộ chọn tab là
  `EdgeTab`/`WuxiaModal`'s `edgeTabs` (bookmark thò ra rìa trái modal, xem
  mục 1) — KHÔNG phải hàng pill bên trong nội dung như trước đợt 6.** Tab
  **"Chỉ Số"**: hàng đầu nối nhân vật ĐANG dùng với
  vũ khí ĐANG mặc bằng 1 line ngắn, đọc-only (đổi đợt 4 — trước đó chỉ có ở
  tab Nhân Vật cũ, giờ luôn hiện ở đây để biết "đang dùng ai + vũ khí gì ra
  chỉ số này"), rồi mọi `StatRow` full-width kiểu "tên trái — giá trị phải"
  — Cấp (+ thanh EXP nhỏ), Máu (nút **+**), Tấn Công (nút **+**), rồi nhóm số
  thuần không có nút cộng (Bạc, Thẻ Triệu Hồi, Điểm chưa tiêu). Tab **"Nhân
  Vật"** (đổi đợt 4 — giờ là danh sách CHỌN nhân vật, không chỉ hiện 1 nhân
  vật): panel preview ở trên (portrait + `Máu gốc`/`Tấn Công gốc` của nhân
  vật đang XEM, không nhất thiết đang DÙNG — local state `previewId`) + nút
  "Chọn Nhân Vật Này" (ẩn nếu đang xem đúng nhân vật đang dùng, hiện chữ
  "Nhân vật đang dùng" thay vào đó); bên dưới là list toàn bộ `CHARACTER_IDS`
  (`CharacterListItem`, bấm để đổi preview, badge "Đang Dùng" trên nhân vật
  thật sự đang chọn). Bấm "Chọn Nhân Vật Này" mới thật sự gọi
  `setCharacter()` — bấm vào 1 dòng trong list chỉ đổi preview, KHÔNG tự
  chuyển nhân vật ngay (tránh đổi nhầm). Tab **"Cài Đặt"** (mới đợt 6): hiện
  chỉ 1 hàng "Nhạc Nền" dạng toggle switch gọi `toggleMusicMuted()`
  (`modules/settings/store.ts`) — thêm tuỳ chọn cài đặt mới thì thêm hàng
  vào ĐÚNG tab này, đừng tạo tab/panel riêng trừ khi được yêu cầu rõ. Không
  còn `NavButton`/dải nút sang Túi Đồ/Kỹ Năng/Triệu Hồi/Thú Cưng/Thú Cưỡi/
  Bạn Bè trong panel này nữa — 5 tính năng đó giờ mở từ `ShelfNav`, Triệu Hồi
  mở từ `SummonQuickButton` (xem trên).
- **Nộ tăng khi đòn tự động trúng quái (+10, trần 100), tự tuột dần nếu 5s
  không trúng đòn nào nữa** (`addRage()` trong `modules/world/liveHud.ts`,
  gọi từ `mapScene.ts`'s `updateCombat()`) — chưa có cơ chế tiêu Nộ, thanh
  này hiện chỉ tích/xả. Tuột theo tick nguyên (`RAGE_DECAY_TICK_MS`), KHÔNG
  phải số thập phân mỗi frame — giữ số hiển thị luôn là số nguyên sạch.
- **Đòn tự động của người chơi là 1 chu kỳ ném vật phẩm, KHÔNG trừ máu tức
  thời khi bắn** — `updateCombat()` gọi `fireAttack()` (mục 1) với
  `toX/toY` là vị trí quái TẠI THỜI ĐIỂM BẮN (snapshot, không đuổi theo);
  sát thương chỉ thật sự áp dụng trong callback `onLand` sau khi bay + nổ
  xong. Vũ khí ném (ảnh) đến từ `getEffectiveStats().weaponSpriteSrc` — vũ
  khí đang trang bị (`inventory.equippedItemId`) hoặc vũ khí mặc định của
  nhân vật (`CharacterConfig.defaultWeaponId`) nếu chưa trang bị gì.
- **Giết quái roll rớt 1 LẦN DUY NHẤT** (không phải mỗi đòn trúng) — 50% Bạc,
  độc lập 15% Thẻ Triệu Hồi (`rollDrop()` trong `modules/inventory/store.ts`)
  — **KHÔNG còn rớt đồ (item) trực tiếp nữa**, đồ chỉ ra được từ Triệu Hồi
  (xem dưới). Rớt gì thì cộng thẳng vào túi đồ + hiện chữ nổi báo
  (`spawnDamageText` màu khác).
- **Triệu Hồi (`SummonPanel.tsx`, `modules/summon/`)** — tiêu 1 Thẻ Triệu
  Hồi (`spendSummonCard()`) ra 1 vũ khí ngẫu nhiên có **phẩm chất**
  (`Rarity`: Thường/Hiếm/Sử Thi/Huyền Thoại, `RARITY_CONFIG` trong
  `summon/data.ts` — mỗi bậc có `statMultiplier` riêng nhân vào công thức
  chỉ số cũ). Tỉ lệ ra phẩm chất cao phụ thuộc `storeLevel` của Tiệm Triệu
  Hồi (`rollRarity()`) — level càng cao, trọng số dịch từ Thường sang Sử
  Thi/Huyền Thoại. `storeLevel` CÓ persist nhưng CHƯA có nút nâng cấp (chưa
  được yêu cầu) — đừng tự thêm khi chưa có spec rõ. **Bấm "Triệu Hồi" chơi 1
  hiệu ứng quay TRƯỚC khi lộ kết quả** (đổi đợt 4) — `gsap.timeline()` xoay/
  phóng icon tiệm (~950ms, hằng `ROLL_DURATION_MS`) rồi mới gọi
  `performSummon()` ở `.call()` cuối timeline, nút "Triệu Hồi" disable suốt
  lúc quay (`rolling` state) tránh double-click phá timeline. **Nút "Xem Tỉ
  Lệ Rớt Đồ" mở bảng % thật** — `getRarityWeights(storeLevel)`/
  `getRarityPercentages(storeLevel)` (`summon/store.ts`) là hàm CÙNG
  `rollRarity()` gọi để roll thật, panel chỉ hiển thị lại, không tính riêng
  1 công thức khác dễ lệch. Hiện cả cấp hiện tại VÀ cấp+1 (nếu nâng cấp) để
  thấy rõ tác động của việc lên cấp tiệm.
- **`BagPanel` là GRID icon vuông (đổi đợt 5, thay hẳn list dòng dài của đợt
  4)** — mỗi ô chỉ có icon + viền màu phẩm chất, tên/phẩm chất/`Cấp X ·
  statBonus` chuyển hẳn sang `WuxiaTooltip` khi hover (không còn hiện sẵn
  trong DOM chờ CSS lộ ra). Đồ ĐANG trang bị chỉ còn 1 badge dấu tick
  (`Check` từ lucide) góc trên-phải — không còn nút chữ "Đang Dùng"/"Trang
  Bị" dài. Grid `grid-cols-4`: cột đầu/cuối truyền `align="start"`/`"end"`
  cho `WuxiaTooltip` (xem mục 1) để tooltip không tràn/bị cắt ở mép panel.
  Pet/Mount NÊN dùng lại đúng pattern grid-item + tooltip này khi có data
  thật (xem comment trong `PetPanel.tsx`/`MountPanel.tsx`), đừng bịa layout
  khác.
- **`FriendsDropdown.tsx`** (đổi đợt 5, thay hẳn `FriendsPanel.tsx` dạng
  `WuxiaModal` cũ) — Bạn Bè mở như 1 dropdown NHỎ neo ngay tại bubble của nó
  trên `ShelfNav`, không phải panel full-screen. State mở/đóng
  (`friendsOpen`) sống cục bộ trong `ShelfNav`, KHÔNG qua `activePanel` của
  `GameHud` — đóng bằng cách bấm lại bubble hoặc click ra ngoài (1 lớp
  backdrop `fixed inset-0` trong suốt, giống các dropdown/overlay khác trong
  app). `useFriendsStore` (`modules/friends/store.ts`, persist, mặc định
  rỗng) thay vì hoàn toàn tĩnh — render list DỌC, 1 bạn/hàng khi
  `friends.length > 0`, vẫn hiện đúng empty-state cũ khi rỗng.
- **`SkillsPanel` là CÂY kỹ năng thật, không phải lưới ô khoá** (đổi đợt 4,
  thay hẳn `SKILL_SLOT_COUNT` cũ) — `modules/skills/data.ts`'s `SKILL_TREE`
  (mảng `SkillNode { tier, prerequisiteIds, requiredLevel }`) quyết định
  toàn bộ layout, component chỉ nhóm theo `tier` rồi render, KHÔNG hardcode
  node nào trong component. Bấm 1 node → panel chi tiết bên dưới hiện mô
  tả + "Yêu cầu: Cấp N" + nút **"Học"** — `getLearnEligibility()`
  (`skills/store.ts`) là nguồn sự thật DUY NHẤT cho việc node có học được
  không (đã học / chưa đủ cấp / thiếu tiên quyết), dùng chung để vừa
  disable nút vừa hiện lý do làm nhãn nút luôn (không cần chuỗi lỗi riêng).
  `learnSkill()` ghi vào `learnedSkillIds` (persist) — **học kỹ năng KHÔNG
  cộng bonus gameplay thật nào** (vẫn đúng tinh thần "chưa mở hệ thống môn
  phái" cũ), chỉ mỗi cơ chế Học + gate là thật.
- **Nút X của `WuxiaModal` phải là sibling của khung `overflow-y-auto`, KHÔNG
  phải con bên trong nó** (bug đã gặp và sửa đợt 4) — CSS: nếu 1 phần tử có
  `overflow-y: auto` mà không set `overflow-x` tường minh, trình duyệt tự
  ép `overflow-x` cũng thành `auto` (theo spec, không được để 1 trục
  `visible` còn trục kia không) — nút X định vị `-right-3 -top-3` (thò ra
  ngoài biên cha) sẽ bị trục X đó cắt cụt luôn. Bài học chung: bất kỳ phần
  tử nào định vị `absolute` THÒ RA NGOÀI biên của 1 cha có set `overflow-*`
  (kể cả chỉ set 1 trục) đều phải kiểm tra kỹ, không giả định "chỉ set
  overflow-y thì trục x vẫn `visible`".
- Minimap (`GridMinimap`) và hộp thoại (`DialogueBox`) theo phong cách wuxia
  giấy da/cuộn thư — xem mục 4.
- **Minimap là 1 khung nhìn (viewport) LUÔN LẤY NGƯỜI CHƠI LÀM TÂM, không
  render nguyên cái lưới** (`VIEWPORT_RADIUS` trong `GridMinimap.tsx`) —
  bản nhỏ hiện `(radius*2+1)²` ô quanh vị trí hiện tại, đi đâu cũng chỉ là
  pan khung nhìn, không phải phóng to/thu nhỏ toàn bộ minimap. Nhờ vậy lưới
  map lớn/mê cung cỡ nào cũng không làm minimap phình to hay ô co lại — đừng
  quay lại cách tính `rows`/`cols` từ toàn bộ `cells` như bản cũ.
