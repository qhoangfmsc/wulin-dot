# Wulin.io — Tài liệu thiết kế game

> Cập nhật lần cuối: 2026-08-14 (đợt 10) — Hệ thống NPC + Nhiệm vụ (2 module
> mới: `modules/npc/`, `modules/quest/`) + 4 sửa theo playtest thật. NPC đầu
> tiên "Cụ Quy" (rùa) ở phòng `0-2` — lại gần bấm Space nói chuyện, bubble
> thoại trên đầu vừa là marker trạng thái quest (?/…/!) vừa nhấp nháy khi
> vào tầm; nhận nhiệm vụ "Diệt 5 Con Nai Đột Biến" qua `QuestOfferModal`,
> quái ở phòng `1-2` tag `questId` nên chết mới cộng tiến trình, trả nhiệm
> vụ tự động phát thưởng khi dialogue đóng. Bug thật đã gặp và sửa: callback
> `onNpcInteract` bị đóng băng state cũ (React) do `useEffect` không đưa nó
> vào dependency array (giống `onReachEdge` cố ý) nhưng — khác 2 callback
> đó — nó bắn nhiều lần/phòng và cần đọc state MỚI mỗi lần; sửa bằng ref
> pattern chuẩn của React (`useRef` cập nhật mỗi render + `useCallback([])`
> làm cầu nối ổn định). Bonus: HUD dời lên góc trên-trái
> (`PlayerStatusPanel` không còn tự định vị), `QuestTracker.tsx` (theo dõi
> nhiệm vụ) + `MonsterTargetHud.tsx` (quái đang trong tầm đánh, mới) đặt
> cạnh/dưới nó. 4 sửa theo phản hồi: tutorial di chuyển không còn che
> dialogue NPC; màn "Đùng... một vụ nổ lớn" có nút Bỏ Qua; mọi khung thoại
> tự chuyển câu sau 5s nếu quên bấm Space, hết thoại tự tắt. Xem mục "Đã
> có".
>
> Cập nhật trước đó (2026-08-14, đợt 9) — 3 việc: (1) quái chỉnh kích thước
> qua `MonsterSpawnConfig.displaySize` (px, đã có sẵn field, chỉ cần set —
> quái `deer_injured` ở `start.ts` giờ 100-120px thay vì mặc định 52px);
> (2) sửa ảnh vỡ nét trên màn Retina — Phaser không tự xử lý
> `devicePixelRatio`, `MapCanvas.tsx` đổi sang `Phaser.Scale.NONE` + tự
> resize canvas backing-store lớn hơn CSS size theo `dpr` (`zoom: 1/dpr` giữ
> nguyên kích thước hiển thị), `mapScene.ts` bù lại bằng cách chia
> `this.scale.width/height` cho `dpr` khi tính kích thước phòng và nhân
> camera zoom với `dpr` — mọi toạ độ gameplay khác không đổi; kèm
> `SPRITE_LOAD_WIDTH` 256→384 để nguồn ảnh có thêm chi tiết trước khi thu
> nhỏ; (3) chết (HP về 0) giờ hiện noti `DeathNotice` ("Bạn Đã Gục Ngã") rồi
> fade đen về respawn tại đúng Ô "X" (ô xuất phát) của map, không còn lặng
> lẽ dịch về giữa phòng vừa chết như trước — qua callback `onPlayerDeath`
> mới (cùng pattern `onReachEdge`). Xem mục "Đã có".
>
> Cập nhật trước đó (2026-08-13, đợt 8) — Dialogue-khi-vào-phòng tách hẳn
> khỏi `SubjectConfig` (vật thể trang trí). Trước đây phải gắn 1 vật thể
> (VD `company.png`) mới bắn được lời thoại — phòng trống không nói chuyện
> được, dù lời thoại là sự kiện của PHÒNG chứ không phải của vật trang trí
> trong đó. `SubjectConfig` giờ chỉ còn = `ObstacleConfig` (thuần vật cản).
> `MapModule` có thêm `dialoguesByCell?: Record<string, DialogueLine[]>`,
> ngang hàng `obstaclesByCell`/`subjectsByCell`/`monstersByCell` — bất kỳ
> cell nào cũng khai được, kể cả cell không có obstacle/subject nào.
> Semantics giữ nguyên: 1 lần/session, theo dõi bằng `Set`, không persist.
> Bước 1 của thiết kế lớn hơn (NPC tương tác theo khoảng cách + hệ thống
> quest) — bước đó chưa làm. Xem mục "Đã có".
>
> Cập nhật trước đó (2026-08-13, đợt 7) — `CharacterPanel`'s khối nội dung
> tab bọc thêm `min-h-97.5` (=390px, đo bằng Playwright, khớp chiều cao tab
> "Chỉ Số") — tab "Cài Đặt" ngắn hơn nhiều (1 hàng toggle) nên trước đó đổi
> tab làm modal co/giãn đột ngột ("giật"). Chỉ đặt SÀN chiều cao, tab "Nhân
> Vật" (danh sách nhân vật) vẫn tự cao hơn khi cần, vẫn bị `max-h-[85vh]`
> của `WuxiaModal` chặn lại như cũ.
>
> Cập nhật trước đó (2026-08-13, đợt 6) — thêm Cài Đặt (tắt/mở nhạc nền) vào
> modal "Nhân Vật" dưới dạng tab thứ 3, nhưng KHÔNG phải hàng pill-tab BÊN
> TRONG modal (yêu cầu rõ 2 lần — lần 2 chốt: cả 3 tab phải nằm NGOÀI RÌA
> modal kiểu "dấu trang sách"). `WuxiaModal.tsx` đổi prop `cornerAction` (bản
> đầu, đã bỏ) thành `edgeTabs` — 1 CỘT nút "bookmark" thò ra rìa TRÁI modal
> (`right-full` + `items-end`, mỗi tab tự quyết định độ "thò ra" bằng width
> riêng — tab active rộng/sáng màu hơn, giống bookmark trang đang mở). Cả 3
> tab của `CharacterPanel` (Chỉ Số/Nhân Vật/Cài Đặt) đều là `EdgeTab` —
> `SettingsButton.tsx` (bản dropdown-ở-góc, đã bỏ) không còn, Cài Đặt giờ là
> 1 pane nội dung thật y hệt 2 tab kia. `modules/settings/` (mới) —
> `useSettingsStore` persist `{ musicMuted: boolean }`; `useMapMusic.ts` set
> `audio.muted` (không `pause()`, giữ nguyên tiến trình bài hát) mỗi khi đổi.
> Xem mục "Đã có" + SKILL.md mục 1/6.
>
> Cập nhật trước đó (2026-08-13, đợt 5) — `WuxiaTooltip.tsx` (mới) thay toàn
> bộ `title` gốc của trình duyệt trên icon HUD (`ShelfNav`/
> `SummonQuickButton`/`GridMinimap`/`PlayerStatusPanel`/nút vũ khí trong
> `CharacterPanel`) bằng tooltip style giấy da, hiện ngay lập tức (CSS
> `group-hover`, không delay như `title`). 2 bug "bị clip cạnh" đã gặp và
> sửa: trigger có `hover:scale-*` tự tạo stacking context riêng làm z-index
> tooltip không so được với sibling (sửa bằng `hover:z-30` trên trigger);
> tooltip trong `WuxiaModal` (có `overflow-y-auto`, tự kéo theo `overflow-x`
> ẩn) bị cắt cụt gần mép panel (sửa bằng prop `align: "start"|"center"|
> "end"`). Bạn Bè đổi từ panel modal sang **dropdown neo ngay tại bubble**
> trên `ShelfNav` (`FriendsDropdown.tsx`, thay `FriendsPanel.tsx` — state
> cục bộ trong `ShelfNav`, không còn qua `PanelId`/`activePanel`). Nút "←
> Nhân Vật" bị xoá khỏi Túi Đồ/Kỹ Năng/Triệu Hồi/Thú Cưng/Thú Cưỡi — các
> panel này không còn mở TỪ `CharacterPanel` nữa nên back-to-Nhân-Vật không
> còn hợp lý; chỉ `CharacterPanel` còn giữ `onNavigate`. `BagPanel` đổi từ
> list dòng dài sang GRID icon vuông — tên/phẩm chất/chỉ số chuyển hẳn vào
> `WuxiaTooltip` khi hover, đồ ĐANG trang bị chỉ còn 1 badge dấu tick góc
> trên-phải (không còn nút chữ dài). Xem mục "Đã có" + SKILL.md mục 1/6.
>
> Cập nhật trước đó (2026-08-13, đợt 4) — loạt sửa UI/gameplay theo phản hồi
> cụ thể. HUD góc dưới-trái hiện số `value/max` cho Máu/Nộ (không chỉ
> thanh); máu tự hồi 1/giây khi còn sống và chưa đầy, LUÔN theo `maxHp` hiện
> tại (không hardcode 100). `ShelfNav` dời xuống góc phải-dưới, thu nhỏ hẳn.
> Góc phải-trên xếp lại: `GridMinimap` luôn ở vị trí trên-cùng cố định,
> `SummonQuickButton` (+ chỗ cho icon nhanh khác sau này) nằm bên trái minimap
> trong 1 hàng tự `flex-wrap` xuống dòng nếu dài. Nút X của `WuxiaModal` sửa
> lỗi bị cắt cụt (dời ra làm sibling của khung cuộn nội dung thay vì con bên
> trong). Roster nhân vật mở rộng từ 1 lên 7 (toàn bộ ảnh trong
> `public/character/ingame/` trừ `zombie.png`/`deer_injured.png`), mỗi nhân
> vật có `baseHp`/`baseAttack` RIÊNG. `CharacterPanel` tab "Chỉ Số" thêm hàng
> nối nhân vật-vũ khí đang dùng ở đầu; tab "Nhân Vật" đổi thành danh sách
> chọn (xem chỉ số gốc trước khi đổi thật). `BagPanel`'s item row gọn lại,
> hover mới lộ chỉ số. `FriendsPanel` có store thật (rỗng), list dọc 1
> bạn/hàng khi có data. `SkillsPanel` đổi từ lưới ô khoá sang CÂY kỹ năng
> thật — node theo tier/tiên quyết, nút "Học" gate theo cấp (chưa có bonus
> gameplay). `SummonPanel` thêm hiệu ứng quay trước khi lộ kết quả + nút
> "Xem Tỉ Lệ Rớt Đồ" hiện bảng % theo cấp tiệm hiện tại/kế tiếp. Xem mục
> "Đã có" + SKILL.md mục 1/6.
>
> Cập nhật trước đó (2026-08-13, đợt 3) — HUD tách rời thành nhiều mảnh, hub
> "Nhân Vật" gọn lại còn 2 tab. State "panel nào đang mở" dời từ
> `PlayerStatusPanel` sang component mới `GameHud.tsx` (gom toàn bộ layer
> HUD của `MapScreen`). Túi Đồ/Kỹ Năng/Thú Cưng/Thú Cưỡi/Bạn Bè mở trực tiếp
> từ 1 "kệ" wuxia mới (`ShelfNav.tsx`, art thật `public/shell.png`) đặt
> giữa-trên màn hình — mỗi tính năng 1 "quả cầu bong bóng" tròn. Triệu Hồi
> tách thành nút riêng góc trên-phải (`SummonQuickButton.tsx`), xếp ngay
> trên `GridMinimap`. HUD góc dưới-trái gọn lại còn avatar + Máu/Nộ — CẢ
> khối giờ là 1 nút mở thẳng `CharacterPanel`, hiện badge đỏ số điểm chỉ số
> chưa tiêu khi > 0. `CharacterPanel` bỏ hẳn dải nút điều hướng 6 tính năng,
> chỉ còn 2 tab: "Chỉ Số" (mọi `StatRow`) và "Nhân Vật" (portrait + đổi nhân
> vật + vũ khí đang mặc). Icon lucide tạm cho Thú Cưng/Thú Cưỡi/Bạn Bè đã
> đổi sang ảnh thật; icon Bạc trong `BagPanel` sửa từ nhầm `bag.png` sang
> `coins.png`. Xem mục "Đã có" + SKILL.md mục 1/6.
>
> Cập nhật trước đó (2026-08-13, đợt 2) — "Nhân Vật" thành HUB TRUNG TÂM.
> `IntroExperience`/`StoryIntroScreen`/`TapToStartScreen` dời sang
> `modules/intro/components/` (chỉ phục vụ vài giây đầu game). `CharacterPanel`
> làm lại bố cục 2 cột (trái: nhân vật + vũ khí đang mặc nối bằng 1 đường
> line; phải: dòng chỉ số tên-trái/giá-trị-phải + dải nút điều hướng), dùng
> khung dùng chung mới `WuxiaModal.tsx`. Tách ra 6 panel/module riêng: Túi Đồ
> (`BagPanel`, nơi DUY NHẤT đổi vũ khí), Kỹ Năng/Thú Cưng/Thú Cưỡi/Bạn Bè
> (`skills`/`pet`/`mount`/`friends` — dàn UI trước, chưa có cơ chế thật), và
> Triệu Hồi (`SummonPanel`/`modules/summon/`) — **thay hẳn cơ chế rớt đồ
> trực tiếp cũ**: quái chết giờ chỉ rớt Bạc (50%) hoặc Thẻ Triệu Hồi (15%,
> KHÔNG còn rớt item nữa); đồ chỉ ra được bằng cách tiêu thẻ ở Tiệm Triệu
> Hồi, có **phẩm chất** (Thường/Hiếm/Sử Thi/Huyền Thoại) quyết định hệ số
> nhân chỉ số, tỉ lệ ra phẩm chất cao phụ thuộc cấp tiệm (`storeLevel`).
> HUD góc dưới-trái giờ chỉ còn 1 nút ("Nhân Vật") thay vì nhiều ô khoá rời.
> Xem mục "Đã có" + SKILL.md mục 1/6.
>
> Cập nhật trước đó (2026-08-13, đợt 1): nhân vật/vũ khí đổi được + cộng
> điểm chỉ số khi lên cấp — `character`/`inventory` dựng lại từ đầu
> (persist). Đòn tự động không còn trừ máu tức thời — đi qua
> `modules/world/attack.ts`'s `fireAttack()`: ném vật phẩm bay + xoay vào
> quái, nổ + hiện số khi chạm rồi mới áp sát thương thật. `liveHud.ts` tách
> đôi: chỉ còn hp/Nộ (runtime), cấp/exp/điểm chỉ số dời sang
> `character/store.ts` (persist).
>
> Cập nhật trước đó (2026-08-12): dọn dẹp lớn xoá hẳn hệ thống chọn môn
> phái/Sảnh Chờ/combat wave cũ (xem git history nếu cần khôi phục); map
> `grid` cho phép hàng jagged (không cần độn `0`, `MAX_GRID_SIZE` = 30);
> `GridMinimap` đổi thành viewport luôn lấy người chơi làm tâm; combat nhẹ
> đầu tiên trong map (`Monster` module riêng, tầm đánh, Nộ tích/xả); font
> đổi tên theo tên thật (`font-vl`/`font-bmx`/`font-p22`) + nội dung tiếng
> Việt toàn bộ; fix wall texture bị cắt cụt.
> File này là nguồn thông tin sống — mỗi khi thêm tính năng mới, cập nhật lại
> phần "Đã có" và "Roadmap" tương ứng. Xem thêm quy ước bắt buộc ở
> `.claude/skills/wulin-design/SKILL.md` và `AGENTS.md`.

## 0. Trạng thái hiện tại — app chỉ có đúng 3 màn hình

`src/app/page.tsx` chỉ render `IntroExperience`
(`src/app/component/IntroExperience.tsx`), và đó là **toàn bộ app**: **Tap to
Start → story intro → game (map module `start`)** — xem mục "Đã có" bên dưới.

Hệ thống chọn môn phái crane/dragon/tiger cũ (màn chọn nhân vật, Sảnh Chờ,
combat wave-survivor đầy đủ) từng được giữ lại ở trạng thái "dormant" (còn
code nhưng không màn nào dẫn vào) sau khi màn chọn môn phái bị xoá. Đến
**2026-08-12**, chủ dự án xác nhận không cần hệ thống đó nữa — toàn bộ đã bị
**xoá hẳn khỏi repo** (component, module `character`/`stats`/`skills`/
`inventory`/`combat`, `world/scene.ts`/`store.ts`/`types.ts`/
`GameCanvas.tsx`), chỉ giữ lại các file ảnh trong `public/`. Nếu sau này cần
hồi sinh hệ thống này, xem lại git history trước commit dọn dẹp — đừng cố
đoán lại từ tài liệu này, các mục mô tả nó đã bị xoá khỏi file này luôn.

## 1. Ý tưởng cốt lõi

Game kiếm hiệp (wuxia) khám phá bản đồ góc nhìn từ trên xuống (top-down),
phong cách `.io`. Người chơi chạm màn hình để bắt đầu, xem đoạn cốt truyện mở
đầu (nhân vật bị một vụ nổ đẩy về thế giới võ lâm), rồi vào bản đồ thật —
di chuyển bằng WASD hoặc phím mũi tên qua từng phòng nối nhau, gặp vật thể cốt
truyện có thoại, nghe nhạc nền theo từng bản đồ.

- **Input — bàn phím**: `W A S D` HOẶC phím mũi tên (↑↓←→) đều di chuyển được,
  8 hướng, chuẩn hoá vector. Không có combat/skill nào trong luồng hiện tại —
  bản đồ hiện tại thuần khám phá + thoại.
- **Ngôn ngữ & font — bắt buộc tiếng Việt**: toàn bộ nội dung hiển thị cho
  người chơi là tiếng Việt, câu ngắn, dễ hiểu ngay, tránh ẩn dụ/chơi chữ. 3
  font khai báo ở `src/app/layout.tsx` (`src/assets/*.ttf`), đặt tên theo
  đúng tên font thật: `font-vl` (VL TypewriterBasiX, mặc định cho mọi văn bản
  đọc), `font-bmx` (BMX Radical, chỉ tên thương hiệu game + chữ "impact" cỡ
  lớn), `font-p22` (P22 Slogan, tiêu đề/thông báo ngắn). Cỡ chữ văn bản chính
  ~28px, không cần biến thể responsive (chỉ nhắm desktop) — xem chi tiết ở
  `SKILL.md` mục 2.
- **Phong cách hình ảnh — bắt buộc nghiêng wuxia cho mọi UI mới**: giấy da/
  cuộn thư, nét mực, dấu triện đỏ-vàng, khung gỗ, tông màu đất-đỏ-vàng ấm —
  thay cho UI game hiện đại phẳng chung chung. Chưa có art thật thì dùng
  CSS-only (gradient/border/shadow) làm giải pháp tạm — xem chi tiết + ví dụ ở
  `.claude/skills/wulin-design/SKILL.md` mục 4.
- **Xoay mặt theo hướng di chuyển**: hướng mặt (facing) chỉ đổi khi đang thực
  sự di chuyển và luôn bằng hướng di chuyển đó — đứng yên thì giữ nguyên
  hướng cuối cùng. Logic này (xoay frame ảnh + nảy kiểu slime) nằm trong 1
  class dùng chung — **`Actor`** (`modules/world/actor.ts`).
- Nhân vật hiện tại là `dog` (`public/character/ingame/dog.png`) — không gắn
  với hệ thống class/stats nào, chỉ là 1 sprite hiển thị qua `Actor`.
  `public/character/ingame/` còn có ảnh **chưa gắn hết vào code**, để dành
  cho việc mở rộng sau: `turtle.png` (đã dùng làm portrait cho thoại "???" ở
  map `start`), `deer.png`/`deer_injured.png`/`panda.png` (khả năng cao là
  NPC/bạn đồng hành cho map sau này), `zombie.png` (khả năng cao là loại quái
  mới nếu sau này thêm combat vào map thật). Đừng tự ý gắn các ảnh chưa dùng
  này vào gameplay khi chưa có chỉ đạo rõ.
- **Background** màn tap-to-start là tranh minh hoạ núi non thật
  (`public/choose_character_background_screen.png`), không phải nền phẳng —
  xem `SceneBackdrop` ở mục Animation. Minimap dùng art thật
  (`public/minimap.png`).

## 2. Kiến trúc thư mục (modular theo domain)

```
public/
  choose_character_background_screen.png  # backdrop TapToStartScreen
  minimap.png              # art thật cho GridMinimap (phong cách cuộn thư)
  character/ingame/        # bust nhân vật — dog.png (player hiện tại),
                            # turtle.png (portrait thoại), deer/panda/zombie
                            # (chưa gắn code, xem mục 1)
  subject/company.png      # vật thể cốt truyện ở phòng bắt đầu map `start`
  weapon-display/           # ảnh vũ khí ném (dress_shoe.png, flip_flop.png)
                            # — dùng làm sprite bay trong `fireAttack()` VÀ
                            # ảnh hiện trong `CharacterPanel`
  ground/                  # texture map: dirt/grass.png (sàn, TileSprite),
                            # log_wall.png/lava_wall.png (tường — chỉ render
                            # ở cạnh phòng thực sự bị chặn)
  story/
    explode_introduction.png  # ảnh vụ nổ cho StoryIntroScreen
  music/background/        # nhạc nền theo map (VD start.mp3)

src/
  assets/                  # font gốc, nạp qua next/font/local trong
                            # src/app/layout.tsx — KHÔNG phải public asset:
                            # VL TypewriterBasiX-Regular.ttf (mặc định),
                            # BMXRadical-Bold.ttf (tên game/impact),
                            # P22 Slogan W00 Regular.ttf (tiêu đề ngắn)
  app/
    page.tsx              # entry — chỉ render <IntroExperience /> (từ
                          # `modules/intro/components/`, xem dưới)
    layout.tsx             # khai báo 3 font (--vl-typewriter/--bmx-radical/
                           # --p22-slogan), map sang --font-vl/--font-bmx/
                           # --font-p22 qua @theme trong globals.css
    globals.css            # @theme font mapping + @keyframes dùng chung
                           # (drift, radar-sweep, scene-zoom, float-up cho
                           # hạt sáng, preview-pulse)
    component/             # component "của root" — glue nhiều module lại,
                           # không thuộc riêng 1 domain. KHÔNG chứa
                           # IntroExperience/StoryIntroScreen/TapToStartScreen
                           # nữa — 3 file đó dời sang `modules/intro/
                           # components/` (đổi 2026-08-13 đợt 2) vì chỉ phục
                           # vụ vài giây đầu game, không dùng xuyên suốt như
                           # mọi thứ còn lại ở đây
      hubPanelId.ts          # `type PanelId = "character"|"bag"|"skills"|
                             # "summon"|"pet"|"mount"` — KHÔNG còn "friends"
                             # (đợt 5 — Bạn Bè mở dropdown, không phải panel
                             # full-screen, xem `FriendsDropdown.tsx`). Dùng
                             # cho prop `onNavigate` — giờ CHỈ `CharacterPanel`
                             # còn nhận prop này (cần nhảy sang "bag" từ nút
                             # vũ khí); 5 panel còn lại chỉ nhận `onClose`
      WuxiaModal.tsx          # khung modal dùng chung cho 6 panel hub —
                             # backdrop + 2 thanh gỗ + panel giấy da + tiêu
                             # đề + nút X (`title`/`onClose`/`children`/
                             # `maxWidthClassName?`/`edgeTabs?`). Panel nào
                             # cũng viết lại y hệt khung này trước khi tách —
                             # giờ chỉ viết nội dung riêng, bọc trong
                             # `<WuxiaModal>`. Nút X là sibling của khung
                             # `overflow-y-auto` cuộn nội dung, KHÔNG phải con
                             # bên trong nó (đợt 4 — bug bị cắt cụt, xem mục
                             # "Đã có"). `edgeTabs` (đợt 6, thay hẳn
                             # `cornerAction` bản đầu — đã bỏ) — 1 CỘT nút
                             # "bookmark" thò ra khỏi rìa TRÁI modal
                             # (`right-full` + `items-end`, mỗi tab tự quyết
                             # độ "thò ra" bằng width riêng, không offset tay)
                             # cho panel cần NHIỀU pane nội dung chuyển qua
                             # lại mà không muốn hàng tab-pill chiếm chỗ bên
                             # trong (VD `CharacterPanel`'s `EdgeTab`). Chỉ là
                             # chỗ định vị — component truyền vào tự quản
                             # state tab đang chọn
      WuxiaTooltip.tsx      # (MỚI, đợt 5) tooltip hover style giấy da dùng
                             # chung, thay `title` gốc trình duyệt (delay dài)
                             # — CSS `group-hover` thuần, hiện ngay lập tức.
                             # Prop `placement` ("top"/"bottom") +
                             # `align` ("start"/"center"/"end", mặc định
                             # center) — `align` cần chỉnh khi trigger gần mép
                             # trái/phải 1 `WuxiaModal` để tránh bị cắt cụt
                             # (xem `BagPanel.tsx`'s `ItemSlot`). Trigger có
                             # `hover:scale-*` PHẢI thêm `hover:z-30` trên
                             # CHÍNH NÓ (không chỉ trên tooltip) nếu đứng cạnh
                             # 1 sibling đối lập, nếu không z-index của
                             # tooltip không so được với sibling đó lúc hover
                             # (đọc kỹ doc comment đầu file trước khi dùng)
      GameHud.tsx           # (MỚI, đợt 3) gom TOÀN BỘ layer HUD của
                             # `MapScreen` vào 1 chỗ — giữ ĐÚNG 1 state
                             # `activePanel: PanelId | null`, render
                             # `PlayerStatusPanel`/`ShelfNav`/cột
                             # `SummonQuickButton`+`GridMinimap`, và đúng 1
                             # trong 6 panel hub đang mở (Bạn Bè KHÔNG ở đây,
                             # xem `ShelfNav.tsx`). `MapScreen` chỉ truyền
                             # `cells`/`position`/`visited` xuống, không tự
                             # biết gì về hub nữa
      ShelfNav.tsx          # "kệ" wuxia NHỎ góc phải-dưới (đổi đợt 4 — trước
                             # đó to, giữa-trên), art thật `public/shell.png`
                             # — 5 nút tròn "quả cầu bong bóng" (viền kính,
                             # radial-gradient trong suốt), icon ảnh thật cho
                             # cả 5 (`bag.png`/`skills.png`/`pet.png`/
                             # `mount.png`/`friends.png`). 4/5 bubble (Túi Đồ/
                             # Kỹ Năng/Thú Cưng/Thú Cưỡi) gọi `onNavigate(id)`
                             # mở panel full-screen; bubble Bạn Bè KHÁC (đổi
                             # đợt 5) — toggle state cục bộ `friendsOpen`, mở
                             # `FriendsDropdown` neo tại chính nó
      FriendsDropdown.tsx   # (MỚI, đợt 5, thay `FriendsPanel.tsx` dạng
                             # `WuxiaModal` cũ) — Bạn Bè mở như dropdown NHỎ
                             # neo tại bubble của nó trên `ShelfNav`, không
                             # phải panel full-screen. Đóng bằng bấm lại
                             # bubble hoặc click ra ngoài (`ShelfNav` render 1
                             # lớp backdrop `fixed inset-0` trong suốt).
                             # `useFriendsStore` (`modules/friends/store.ts`,
                             # persist, mặc định rỗng) — list DỌC 1 bạn/hàng
                             # khi có data, empty-state khi rỗng
      SummonQuickButton.tsx # nút Triệu Hồi riêng, xếp BÊN TRÁI `GridMinimap`
                             # trong 1 hàng `flex-wrap` góc trên-phải (đổi
                             # đợt 4 — trước đó xếp TRÊN minimap theo cột;
                             # giờ minimap LUÔN cố định trên-cùng-ngoài-cùng,
                             # hàng icon nhanh bên trái tự rớt xuống dòng 2
                             # nếu dài, không đẩy minimap dịch chỗ) — tách
                             # khỏi `ShelfNav` vì tần suất bấm cao hơn hẳn
                             # (ngay sau khi rớt thẻ giữa combat). Hiện badge
                             # tím số thẻ triệu hồi đang có nếu > 0
      TutorialOverlay.tsx     # callout hiện CẢ 2 cụm phím (WASD + mũi tên
                              # ↑↓←→) dưới nhãn "Di Chuyển", TỰ fade sau ~4s
                              # (`AUTO_DISMISS_MS`, đổi 2026-08-13 từ 6s —
                              # không đợi người chơi tap mới tắt), tap vào
                              # cũng tắt sớm được. `MapScreen` chỉ render nếu
                              # `MapModule.showTutorial` true
      GridMinimap.tsx           # minimap tĩnh, art thật `public/minimap.png`
                                # làm backdrop + scrim tối phía trên để giữ độ
                                # đọc cho lưới ô. KHÔNG còn tự định vị
                                # (`absolute right-4 top-4`) từ đợt 3 — nhận
                                # vị trí từ wrapper `fixed right-4 top-4`
                                # trong `GameHud` (xếp chung cột với
                                # `SummonQuickButton`); overlay phóng to dùng
                                # `fixed inset-0` (độc lập wrapper) để luôn
                                # full-screen. LÀ 1 VIEWPORT LUÔN LẤY NGƯỜI
                                # CHƠI LÀM TÂM (`VIEWPORT_RADIUS`), không
                                # render nguyên lưới — map lớn/mê cung cỡ nào
                                # cũng không làm minimap phình to. Component
                                # con `GridCells` tách riêng, dùng lại cho cả
                                # bản nhỏ lẫn overlay phóng to (dạng cuộn thư
                                # mở ra, 2 thanh gỗ trên/dưới) — chỉ khác
                                # `cellSize`/`viewportRadius`. Fog of war: ô
                                # chưa `visited` hiện tối/ẩn loại phòng (trừ
                                # `"unknown"` luôn hiện "?"), ô đã
                                # `visited`/đang đứng thì lộ icon thật
                                # (Skull=boss, Gem=đặc biệt)
      DialogueBox.tsx        # hộp thoại wuxia (giấy da, viền mực đôi) — 1
                               # dòng/lượt, portrait+tên đặt bên trái hoặc
                               # phải theo `DialogueLine.side`, tap/Space để
                               # tiếp tục. Dùng bởi thoại vào-phòng khai ở
                               # `MapModule.dialoguesByCell` (xem `modules/world/maps`)
      ExperienceBar.tsx      # thanh EXP full-width, fixed đáy màn hình —
                               # đọc `modules/world/liveHud.ts`
      PlayerStatusPanel.tsx   # HUD góc dưới-trái: avatar (ảnh nhân vật đang
                               # chọn) + cấp độ + 2 thanh Máu/Nộ, MỖI thanh
                               # hiện cả số `value/max` (đổi đợt 4, không chỉ
                               # thanh) — CẢ khối là 1 `<button>` (đổi đợt 3,
                               # không còn icon "Nhân Vật" riêng bên trong),
                               # bấm mở `CharacterPanel` qua prop
                               # `onOpenCharacter` (do `GameHud` truyền). Khi
                               # `statPoints > 0` hiện badge đỏ `+N`
                               # (animate-pulse) góc trên-phải khối. Không tự
                               # giữ state panel nào đang mở nữa — đọc
                               # `liveHud.ts` (hp/Nộ) + `character/store.ts`
                               # (cấp/statPoints, qua `getEffectiveStats()`)
      CharacterPanel.tsx       # Hub THUẦN CHỈ SỐ + NHÂN VẬT + CÀI ĐẶT, 3 tab
                               # (đổi đợt 3 — không còn bố cục 2 cột + dải nút
                               # điều hướng 6 tính năng của đợt 2; đợt 6 thêm
                               # tab thứ 3). Bộ chọn tab là `EdgeTab` truyền
                               # vào `WuxiaModal`'s `edgeTabs` (bookmark thò
                               # rìa trái modal, đợt 6) — KHÔNG phải hàng pill
                               # bên trong content như trước đó. Khối nội dung
                               # 3 tab bọc trong 1 `div.min-h-97.5` (đợt 7) —
                               # tab "Cài Đặt" ngắn hơn nhiều nên không có
                               # min-h thì đổi tab làm modal giật cao/thấp đột
                               # ngột; chỉ đặt sàn, tab "Nhân Vật" vẫn tự cao
                               # hơn khi cần. Tab "Chỉ Số":
                               # hàng đầu nối nhân vật ĐANG dùng ↔ vũ khí ĐANG
                               # mặc (đọc-only, đổi đợt 4), rồi `StatRow` (tên
                               # trái/giá trị phải) — Cấp+EXP, Máu (nút +),
                               # Tấn Công (nút +), rồi Bạc/Thẻ Triệu Hồi/Điểm
                               # chưa tiêu (số thuần). Tab "Nhân Vật" (đổi đợt
                               # 4 — giờ là DANH SÁCH chọn, không chỉ hiện 1
                               # nhân vật): preview ở trên (portrait +
                               # `baseHp`/`baseAttack` của nhân vật đang XEM,
                               # local state `previewId`, không nhất thiết
                               # đang DÙNG) + nút "Chọn Nhân Vật Này" (chỉ
                               # bấm nút này mới gọi `setCharacter()` thật —
                               # bấm 1 dòng trong list chỉ đổi preview); danh
                               # sách toàn bộ `CHARACTER_IDS` bên dưới, badge
                               # "Đang Dùng" trên nhân vật thật đang chọn. Tab
                               # "Cài Đặt" (mới đợt 6): 1 hàng "Nhạc Nền"
                               # dạng toggle switch gọi `toggleMusicMuted()`
                               # (`modules/settings/store.ts`)
      BagPanel.tsx              # Túi Đồ — Bạc (`icon/coins.png`, sửa từ nhầm
                               # `bag.png` ở đợt 3) + Thẻ Triệu Hồi
                               # (`summon_card.png`) rồi GRID icon vuông (đổi
                               # đợt 5, thay list dòng dài của đợt 4) —
                               # `inventory.items`, viền màu theo
                               # `RARITY_CONFIG`, tên/phẩm chất/`Cấp X ·
                               # statBonus` chỉ hiện qua `WuxiaTooltip` khi
                               # hover, đồ ĐANG trang bị có badge dấu tick
                               # (`Check`, lucide) góc trên-phải thay vì nút
                               # chữ "Đang Dùng"/"Trang Bị" dài. Cột đầu/cuối
                               # của grid truyền `align="start"/"end"` cho
                               # tooltip (không bị cắt cụt ở mép modal) — nơi
                               # DUY NHẤT trang bị/tháo vũ khí (`equipItem` +
                               # `syncMaxHpToLiveHud`). Không còn nút "←
                               # Nhân Vật" (đợt 5 — panel này không còn mở TỪ
                               # `CharacterPanel` nữa)
      SkillsPanel.tsx           # CÂY kỹ năng thật (đổi đợt 4, thay hẳn lưới
                               # ô khoá cũ) — layout hoàn toàn từ
                               # `SKILL_TREE` (`modules/skills/data.ts`,
                               # node có `tier`/`prerequisiteIds`/
                               # `requiredLevel`), nhóm theo tier, KHÔNG
                               # hardcode node nào trong component. Bấm 1
                               # node → panel dưới hiện mô tả + yêu cầu + nút
                               # "Học" (`getLearnEligibility()` trong
                               # `skills/store.ts` vừa disable nút vừa cho
                               # nhãn lý do khi chưa học được). `learnSkill()`
                               # ghi `learnedSkillIds` persist — CHƯA cộng
                               # bonus gameplay thật nào. Không còn nút "←
                               # Nhân Vật" (đợt 5)
      SummonPanel.tsx           # Tiệm Triệu Hồi — ảnh `icon/summon_store.png`,
                               # hiện Thẻ Triệu Hồi + Cấp Tiệm, nút "Triệu
                               # Hồi" giờ chơi 1 hiệu ứng QUAY trước (đổi đợt
                               # 4 — `gsap.timeline()` xoay/phóng icon tiệm
                               # ~950ms, disable nút suốt lúc quay) rồi mới
                               # gọi `performSummon()`
                               # (`modules/summon/store.ts`), hiện kết quả
                               # (tween GSAP scale-in) theo màu phẩm chất.
                               # Nút "Xem Tỉ Lệ Rớt Đồ" (mới, đợt 4) mở bảng
                               # % thật theo `getRarityWeights`/
                               # `getRarityPercentages` (CÙNG hàm
                               # `rollRarity()` roll thật dùng), hiện cả cấp
                               # tiệm hiện tại và cấp+1 để thấy rõ tác dụng
                               # nâng cấp. Không còn nút "← Nhân Vật" (đợt 5)
      PetPanel.tsx / MountPanel.tsx  # đều dạng "sắp ra mắt", icon ảnh thật
                               # (`pet.png`/`mount.png`, đổi từ lucide ở đợt
                               # 3), không còn nút "← Nhân Vật" (đợt 5) — Thú
                               # Cưng (bạn đồng hành) và Thú Cưỡi (cưỡi để di
                               # chuyển nhanh hơn) là 2 khái niệm KHÁC NHAU,
                               # module riêng (`modules/pet/`, `modules/mount/`).
                               # Chưa có data thật nên vẫn là empty-state — khi
                               # có, nên dùng lại đúng pattern grid-item +
                               # `WuxiaTooltip` của `BagPanel.tsx`
      MapScreen.tsx        # đọc `currentMapId` từ `useMapProgressStore`,
                               # render đúng `MapModule` (xem `modules/world/maps`)
                               # — mount MapCanvas (dynamic import, ssr:false)
                               # + TutorialOverlay (nếu `showTutorial`) +
                               # DialogueBox (khi vào phòng có
                               # `MapModule.dialoguesByCell` lần đầu) +
                               # `GameHud`/`ExperienceBar` + `useMapMusic` +
                               # lớp fade đen (GSAP opacity) khi đổi phòng.
                               # `floorSrc`/`wallSrc`/`tint` của mỗi phòng
                               # tra thẳng từ `map.roomStyles[cell.kind]` +
                               # `map.floorOverridesByCell` — không tự tính
                               # bằng if-else trong component này
      SceneBackdrop.tsx    # ảnh nền full-bleed + Ken Burns zoom + vignette +
                           # hạt sáng trôi (dùng cho TapToStartScreen)
      AmbientBackground.tsx # 3 blob màu mờ trôi chậm (CSS thuần) — tiện ích
                             # chung cho các màn khác chưa có background art,
                             # hiện chưa gắn ở đâu (giữ để dùng sau)

  modules/
    world/                  # domain duy nhất hiện tại — bản đồ khám phá
      actor.ts                 # class `Actor` DÙNG CHUNG cho mọi nhân vật
                                # hiển thị trong world: container + ảnh
                                # billboard + bóng đổ, `update(dt, moveAngle)`
                                # xoay cả frame theo hướng di chuyển (giữ
                                # nguyên khi đứng yên) + nảy kiểu slime
                                # (squash-and-stretch theo
                                # `Math.abs(sin(hopPhase))`) — xem mục 1
      monster.ts                 # class `Monster` — quái, bọc quanh 1 `Actor`
                                 # + thanh máu nổi + AI/combat riêng (aggro,
                                 # cooldown đánh, chết). Module riêng, KHÔNG
                                 # gộp vào `mapScene.ts` dù hiện chỉ có 1 loại
                                 # quái — xem SKILL.md mục 1. Export luôn
                                 # `MonsterSpawnConfig` (kiểu cấu hình khai báo
                                 # trong map module)
      damageText.ts               # `spawnDamageText(scene,x,y,text,color)` —
                                  # số sát thương bay lên + mờ dần, dùng chung
                                  # cho cả người chơi đánh quái lẫn quái đánh
                                  # người chơi
      attack.ts                    # `fireAttack(scene, config)` — module CƠ
                                   # CHẾ TẤN CÔNG dùng chung: ném 1 sprite vật
                                   # phẩm bay + xoay tới toạ độ mục tiêu (chụp
                                   # tại thời điểm bắn, không đuổi theo), nổ +
                                   # `spawnDamageText` khi chạm, RỒI mới gọi
                                   # `onLand(damage)` — đó là lúc sát thương
                                   # thật sự áp dụng. Viết chung chung (texture/
                                   # damage/callback đều là tham số) để dùng
                                   # lại được cho quái/skill sau này
      maps/                      # mỗi map là 1 module riêng — KHÔNG BAO GIỜ
                                 # "demo". `types.ts` (MapModule/SubjectConfig/
                                 # DialogueLine/RoomVisualStyle), `start.ts`
                                 # (map hiện tại: grid, obstaclesByCell,
                                 # subjectsByCell với `company.png` (thuần
                                 # vật cản), dialoguesByCell với thoại 2
                                 # dòng tiếng Việt ở phòng bắt đầu, roomStyles
                                 # theo loại phòng, floorOverridesByCell,
                                 # music `start.mp3`, showTutorial: true),
                                 # `index.ts` (MAP_MODULES/MAP_ORDER — thêm
                                 # map mới = thêm module + 1 dòng ở đây,
                                 # không sửa `MapScreen`)
      mapProgress.ts              # zustand + persist: `currentMapId`/
                                  # `furthestMapId` — "map nào nhân vật đã
                                  # đi đến" được lưu ở đây
      useMapMusic.ts               # hook loop nhạc nền theo map qua `<audio>`
                                   # React thuần (KHÔNG phải Phaser sound
                                   # manager — `MapCanvas` destroy/recreate mỗi
                                   # lần đổi phòng, nhạc Phaser sẽ bị restart).
                                   # Keyed theo `mapKey` (map id), chỉ restart
                                   # khi đổi MAP chứ không phải đổi phòng. Đọc
                                   # `modules/settings/store.ts`'s
                                   # `musicMuted` (đợt 6) — set `audio.muted`
                                   # mỗi khi đổi, KHÔNG `pause()`, giữ nguyên
                                   # tiến trình bài hát
      liveHud.ts                   # zustand (KHÔNG persist) — CHỈ state
                                   # runtime-1-mạng: hp/maxHp/Nộ. Cấp/exp/
                                   # điểm chỉ số KHÔNG còn ở đây nữa (dời sang
                                   # `modules/character/store.ts`, persist —
                                   # xem mục "Đã có"). Action
                                   # `damagePlayer`/`respawnPlayer`/`addRage`/
                                   # `setMaxHp`/`healPlayer` (đợt 4 — hồi máu,
                                   # clamp theo `maxHp` HIỆN TẠI chứ không
                                   # hardcode) gọi trực tiếp từ
                                   # `mapScene.ts`/`Monster`/`character/store.ts`
                                   # qua `getState()`/`setState()` — cầu nối
                                   # giữa Phaser (không phải React) và store
      mapGrid.ts                  # THUẦN DATA/LOGIC (không Phaser) — parse
                                  # grid tác giả viết tay dạng
                                  # `GridSymbol[][]` (0=chặn, 1=phòng thường,
                                  # "X"=start, "B"=boss, "S"=đặc biệt,
                                  # "?"=chưa mở/fog) thành `ParsedGridMap`.
                                  # Hàng JAGGED (độ dài khác nhau, không cần
                                  # độn 0 để vừa hình chữ nhật — ô ngoài độ
                                  # dài hàng tự hiểu là 0). `getCellWalls
                                  # (map,row,col)` tự suy ra 4 cạnh mở/chặn
                                  # của 1 ô từ ô lân cận có tồn tại hay
                                  # không, `generateRandomGridMap()` sinh
                                  # ngẫu nhiên (random walk + đặt boss ở ô xa
                                  # nhất) — chưa dùng làm mặc định.
                                  # `MAX_GRID_SIZE = 30`.
      mapScene.ts            # createMapScene({floorSrc, spriteUrl,
                                 # weaponSpriteSrc, playerAttackDamage, walls,
                                 # wallSrc, tint?, obstacles?, monsters?,
                                 # roomScale?, spawnAt, onReachEdge}) —
                                 # Phaser.Scene: WASD + phím mũi tên + `Actor`
                                 # + sàn TileSprite + tường + vật cản tĩnh.
                                 # Kích thước phòng = canvas thật × `roomScale`
                                 # (mặc định 1.5), tính lại mỗi lần `create()`
                                 # từ `this.scale.width/height`. Camera tự
                                 # zoom ra nhẹ khi gần biên bất kỳ
                                 # (`ZOOM_NEAR_EDGE`). Biên nào `walls[edge]`
                                 # không phải `true` thì gọi `onReachEdge(edge)`
                                 # khi tới gần (map link); biên có tường thì
                                 # render `wallSrc` (`TileSprite`, CHỈ ở cạnh
                                 # đó) và chỉ clamp di chuyển.
                                 # `obstacles` (`ObstacleConfig[]`, vị trí
                                 # theo tỉ lệ `xFrac`/`yFrac`) là vật cản
                                 # KHÔNG ở biên — va chạm tách trục X/Y
                                 # (`isBlockedByObstacle`) để trượt dọc vật
                                 # cản thay vì đứng khựng. `walls` do
                                 # `MapScreen` tính sẵn qua `getCellWalls()`
                                 # rồi truyền vào — file này không biết gì về
                                 # khái niệm "grid".
      components/
        MapCanvas.tsx         # mount/unmount Phaser.Game cho `mapScene.ts`
                                  # (client-only), props (floorSrc/spriteUrl/
                                  # walls/wallSrc/tint/obstacles/roomScale/
                                  # spawnAt/onReachEdge). Đo
                                  # `container.clientWidth/clientHeight` thật
                                  # để tạo `Phaser.Game` thay vì truyền chuỗi
                                  # `"100%"` (bug đã gặp và sửa, xem mục 5).
                                  # `useEffect` re-run khi bất kỳ prop nào đổi
                                  # REFERENCE — nếu `MapScreen` tạo mảng mới
                                  # bằng spread mỗi render mà không `useMemo`,
                                  # canvas sẽ bị destroy/recreate lặp không
                                  # cần thiết (bug "chớp màn hình" đã gặp và
                                  # sửa, xem mục 5).

    character/                # nhân vật + tiến trình cấp độ (persist) —
                              # dựng lại từ đầu 2026-08-13, KHÔNG phải khôi
                              # phục module cũ đã xoá
      types.ts                  # CharacterId (7 giá trị, đợt 4), CharacterConfig
                                # (spriteSrc/defaultWeaponId/baseHp/baseAttack
                                # — mỗi nhân vật RIÊNG, không còn hằng số
                                # toàn cục)
      data.ts                    # CHARACTERS — 7 nhân vật (dog/turtle/deer/
                                 # tiger/dragon/panda/crane, dùng hết ảnh
                                 # trong `public/character/ingame/` TRỪ
                                 # `zombie.png` [đã là art quái] và
                                 # `deer_injured.png` [biến thể bị thương
                                 # của deer, không phải nhân vật riêng]),
                                 # mỗi nhân vật `baseHp`/`baseAttack` khác
                                 # nhau theo flavor (rùa/gấu trúc máu trâu
                                 # đánh nhẹ, hạc máu giấy đánh mạnh...).
                                 # STAT_POINTS_PER_LEVEL=5
      store.ts                   # zustand + persist: characterId, level,
                                 # exp, expToNext, statPoints, bonusHp,
                                 # bonusAttack. `setCharacter`/`gainExp`
                                 # (mỗi lần lên cấp +5 statPoints)/
                                 # `allocateStat("hp"|"attack")` (trừ 1 điểm,
                                 # cộng bonus tương ứng, tự đồng bộ
                                 # `liveHud.maxHp`). `getEffectiveStats()` —
                                 # NGUỒN SỰ THẬT DUY NHẤT cho máu tối đa/tấn
                                 # công thật (base + bonus + vũ khí đang
                                 # trang bị, đọc thêm `inventory` store) —
                                 # `mapScene.ts`/`PlayerStatusPanel`/
                                 # `CharacterPanel` đều gọi hàm này, không tự
                                 # cộng tay. `syncMaxHpToLiveHud()` đẩy
                                 # `maxHp` hiệu lực sang `liveHud` — gọi sau
                                 # `allocateStat` (tự động) và sau
                                 # `setCharacter`/`inventory.equipItem` (gọi
                                 # tay từ nơi đang dùng cả 2 store, xem SKILL.md
                                 # mục 1 — tránh vòng lặp import
                                 # character↔inventory)

    inventory/                 # túi đồ/vũ khí/tiền/thẻ triệu hồi (persist)
                               # — dựng lại từ đầu 2026-08-13
      types.ts                  # WeaponTypeId, WeaponTypeConfig,
                                # InventoryItem (id/weaponTypeId/level/
                                # rarity/statBonus — `rarity` thêm ở đợt 2,
                                # kiểu `Rarity` import từ `modules/summon`)
      data.ts                    # WEAPON_TYPES (`dress_shoe`="Giày Da",
                                 # `flip_flop`="Dép Lê", ảnh trong
                                 # `public/weapon-display/`)
      store.ts                   # zustand + persist: items[], equippedItemId,
                                 # currency (Bạc), summonCards (đợt 2).
                                 # `addItem`/`equipItem`/`addCurrency`/
                                 # `addSummonCard`/`spendSummonCard`.
                                 # `rollDrop()` — gọi từ `mapScene.ts` khi
                                 # quái chết: 50% Bạc (random 5–15), độc lập
                                 # 15% Thẻ Triệu Hồi. **Đợt 2: KHÔNG còn tự
                                 # sinh `InventoryItem` nữa** — việc đó dời
                                 # hẳn sang `modules/summon/` (đồ chỉ ra được
                                 # từ Triệu Hồi, không rớt trực tiếp nữa)

    summon/                    # phẩm chất + cơ chế Triệu Hồi (persist cấp
                               # tiệm) — MỚI 2026-08-13 đợt 2
      types.ts                  # `Rarity = "common"|"rare"|"epic"|"legendary"`
      data.ts                    # RARITY_CONFIG (tên/màu/`statMultiplier`
                                 # từng bậc: Thường ×1, Hiếm ×1.5, Sử Thi
                                 # ×2.5, Huyền Thoại ×4)
      store.ts                   # zustand + persist: `storeLevel` (mặc định
                                 # 1, CHƯA có nút nâng cấp). `getRarityWeights
                                 # (storeLevel)` (đợt 4 — tách ra từ
                                 # `rollRarity`) là NGUỒN SỰ THẬT DUY NHẤT
                                 # cho trọng số — trọng số cơ bản
                                 # {common:70,rare:24,epic:5,legendary:1},
                                 # mỗi level trên 1 dịch 3% từ common sang
                                 # epic(+2)/legendary(+1), common không dưới
                                 # 20. `getRarityPercentages(storeLevel)`
                                 # (đợt 4) chuẩn hoá thành % nguyên tổng đúng
                                 # 100 (phần dư luôn rơi vào common) — dùng
                                 # để hiện bảng tỉ lệ trong `SummonPanel`,
                                 # KHÔNG tính lại công thức riêng.
                                 # `rollRarity(storeLevel)` giờ chỉ gọi
                                 # `getRarityWeights` rồi roll — cùng 1 nguồn
                                 # số với UI hiện tỉ lệ, không thể lệch nhau.
                                 # `performSummon(characterLevel)` — tiêu
                                 # 1 thẻ (`inventory.spendSummonCard()`), roll
                                 # rarity + loại vũ khí ngẫu nhiên, tính
                                 # `statBonus` theo công thức cũ (Máu
                                 # `level*8` / Tấn Công `level*2`) nhân
                                 # `statMultiplier`, `inventory.addItem()`,
                                 # trả item để UI hiện kết quả

    skills/                    # CÂY kỹ năng thật (đợt 4, thay hẳn
                               # `SKILL_SLOT_COUNT` cũ — MỚI 2026-08-13 đợt 2)
      types.ts                   # `SkillNode { id, name, description,
                                 # requiredLevel, tier, prerequisiteIds }`
      data.ts                     # `SKILL_TREE: SkillNode[]` (5 node, 3
                                 # tier: Thiết Quyền/Khinh Công → Kim Cang
                                 # Thân/Ảo Ảnh Chưởng → Long Ngâm Công) +
                                 # `SKILL_TREE_BY_ID`/`SKILL_TIERS` — thêm
                                 # node mới chỉ cần sửa file này, component
                                 # tự vẽ lại layout
      store.ts                    # zustand + persist: `learnedSkillIds`.
                                 # `getLearnEligibility(skillId, level,
                                 # learnedSkillIds)` — nguồn sự thật DUY NHẤT
                                 # cho việc học được hay chưa (đã học/chưa đủ
                                 # cấp/thiếu tiên quyết), trả kèm `reason`
                                 # tiếng Việt để làm nhãn nút luôn.
                                 # `learnSkill()` chỉ ghi nếu eligible. KHÔNG
                                 # có bonus gameplay thật nào từ việc học

    pet/ · mount/               # MỚI 2026-08-13 đợt 2 — vẫn chỉ dàn UI tối
                               # giản, CHƯA có cơ chế/data gameplay thật (xem
                               # panel tương ứng ở mục 2 trên và mục "Đã có")
      pet/types.ts + data.ts      # `PetConfig` rỗng (`PETS = {}`) — bạn
                                 # đồng hành, KHÁC `mount`
      mount/types.ts + data.ts    # `MountConfig` rỗng (`MOUNTS = {}`) —
                                 # cưỡi để di chuyển nhanh hơn, KHÁC `pet`

    friends/                    # MỚI 2026-08-13 đợt 2, có store thật từ đợt 4
      types.ts                    # `Friend { id, name }`
      store.ts                    # (MỚI đợt 4) zustand + persist:
                                 # `friends: Friend[]` (mặc định rỗng) —
                                 # chưa có hạ tầng multiplayer/flow thêm bạn
                                 # nào ghi vào đây, nhưng `FriendsDropdown.tsx`
                                 # (`app/component/`, đổi tên từ `FriendsPanel`
                                 # ở đợt 5) đọc store THẬT này chứ không còn
                                 # hoàn toàn tĩnh

    settings/                   # MỚI 2026-08-13 đợt 6 — cài đặt người chơi,
                               # riêng domain dù hiện chỉ 1 field vì kiểu này
                               # gần như luôn phình to dần (âm lượng SFX,
                               # ngôn ngữ...)
      store.ts                    # zustand + persist: `musicMuted: boolean`
                                 # (mặc định false), `toggleMusicMuted()`.
                                 # Đọc bởi `useMapMusic.ts`
                                 # (`modules/world/`), ghi bởi tab "Cài Đặt"
                                 # trong `CharacterPanel.tsx` (`app/component/`)

    intro/                     # MỚI 2026-08-13 đợt 2 — luồng mở đầu, KHÔNG
                               # có domain data, chỉ `components/`
      components/
        IntroExperience.tsx      # orchestrator: quản lý stage "tap"/"story"/
                                 # "map", sở hữu chuyển cảnh chớp mắt (2 lid
                                 # GSAP scaleY) phủ giữa StoryIntroScreen và
                                 # MapScreen. `page.tsx` render component này.
                                 # NGOẠI LỆ CÓ CHỦ ĐÍCH: import `MapScreen` từ
                                 # `@/app/component/MapScreen` (tuyệt đối) —
                                 # đây là điểm bàn giao DUY NHẤT giữa module
                                 # intro và phần còn lại của app, đừng lặp lại
                                 # kiểu "modules nhìn ngược app/component" này
                                 # ở chỗ khác
        TapToStartScreen.tsx      # màn tiêu đề tối giản, cả màn hình là 1
                                 # <button> (bấm bất kỳ đâu) + phím Space đều
                                 # gọi onStart. Import `SceneBackdrop` từ
                                 # `@/app/component/SceneBackdrop` (dùng
                                 # chung, không riêng cho intro)
        StoryIntroScreen.tsx      # ảnh nổ + rung màn hình (GSAP timeline,
                                 # KHÔNG dùng "random()" string) + lời dẫn
                                 # chuyện fade-in từng dòng, sau đó
                                 # tap-anywhere/Space

.claude/
  skills/wulin-design/SKILL.md  # quy ước bắt buộc: kiến trúc, font/ngôn ngữ,
                                 # animation, phong cách hình ảnh, nguyên tắc
                                 # gameplay — đọc trước khi làm việc trên phần
                                 # gameplay/UI
```

**Nguyên tắc**: type & component riêng của một domain thì nằm trong
`modules/<domain>`. Cái gì là khung/HUD gộp nhiều module lại (HUD, dialogue,
minimap, backdrop…) thì nằm ở `src/app/component`. Không có một "god store"
chung. Nếu sau này thêm domain mới (character/stats/skills/inventory/
combat...), giữ đúng cấu trúc thư mục này.

## 3. Đã có (tính đến bản này)

### Luồng mở đầu (`IntroExperience`) — toàn bộ `page.tsx`, đúng 3 màn
- **Toàn bộ UI là tiếng Việt, câu ngắn dễ hiểu, cỡ chữ ~28px** cho văn bản
  chính (tiêu đề, thoại, prompt, nhãn quan trọng), không có biến thể
  responsive (game hiện chỉ chơi trên máy tính) — xem quy tắc đầy đủ ở
  `SKILL.md` mục 2.
- **`TapToStartScreen`**: màn hình tiêu đề tối giản, tên game "Wulin Animal"
  (`font-bmx`) + chữ "Chạm Để Bắt Đầu" nhấp nháy (`font-p22`,
  `animate-pulse`). Không có menu/option nào khác.
- **`StoryIntroScreen`**: ảnh nổ full-bleed (`public/story/
  explode_introduction.png`) + rung màn hình khi vào (GSAP timeline dịch
  chuyển x/y giảm dần theo từng bước, KHÔNG dùng `"random(...)"` string của
  GSAP để giữ hiệu ứng xác định/dễ debug), sau đó 3 dòng lời dẫn chuyện
  (tiếng Việt, đơn giản dễ hiểu) fade in từng dòng, cuối cùng hiện chữ "Chạm
  để tiếp tục".
- **Input "tap anywhere" cho mọi màn chờ tiếp tục** — quy ước chung, đừng phá
  khi sửa: bấm/chạm **bất kỳ đâu trên màn hình** (không cần trúng chữ) HOẶC
  nhấn **Space** đều kích hoạt. `TapToStartScreen` là 1 `<button>` phủ hết
  màn hình nên click tự nhiên hoạt động; `StoryIntroScreen`/`DialogueBox` gắn
  `onClick` trên root `<div>` chứ không phải trên riêng dòng chữ. Đều có thêm
  1 `window.addEventListener("keydown", ...)` bắt `e.code === "Space"`.
- **Chuyển cảnh "chớp mắt"**: sở hữu bởi `IntroExperience` (không phải
  `StoryIntroScreen`) vì nó phải phủ lên CẢ 2 màn hình trước/sau — 2 `div`
  nửa màn hình neo top/bottom (`origin-top`/`origin-bottom`), animate
  `scaleY` 0→1 (nhắm mắt, phủ kín màn hình) → đổi `stage` React ẩn phía sau →
  `scaleY` 1→0 (mở mắt, lộ ra nội dung mới). Đây là kiểu chuyển cảnh RIÊNG,
  khác với fade phẳng (đổi phòng trong map, xem dưới) — mỗi kiểu chuyển cảnh
  dùng đúng chỗ nó được thiết kế cho, đừng dùng lẫn.
- **`TutorialOverlay`**: callout to, hiện CẢ 2 cụm phím (WASD + mũi tên
  ↑↓←→) dưới nhãn "Di Chuyển". TỰ fade sau ~4s (`AUTO_DISMISS_MS`, đổi
  2026-08-13 từ 6s — không đợi người chơi tap mới tắt), tap vào cũng tắt
  sớm được (cả panel là 1 vùng bấm được). `MapScreen` chỉ render nó khi
  `MapModule.showTutorial` là `true` — hiện tại chỉ map `start` có tutorial.
- **`MapScreen` = "game" hiện tại — render đúng 1 map MODULE, không phải
  "demo"**: mỗi map là 1 file riêng dưới `modules/world/maps/`, hardcode
  toàn bộ nội dung của đúng map đó — grid, vật cản, vật thể cốt truyện,
  nhạc, tutorial, và cả **style hình ảnh của từng loại phòng**
  (`roomStyles`/`floorOverridesByCell`, xem dưới). `MapScreen` đọc
  `currentMapId` từ `useMapProgressStore` (persist, mặc định `"start"`) rồi
  lấy đúng module từ `MAP_MODULES`. Nhân vật là `dog` (`ingame/dog.png`),
  dùng chung `Actor` (xoay theo hướng WASD/mũi tên + nảy slime).
  - **Cấu hình bằng 1 lưới 2 chiều** (`grid` trong `modules/world/maps/
    start.ts`, kiểu `GridSymbol[][]`): `0` = ô trống/chặn, `1` = phòng
    thường, `"X"` = điểm bắt đầu (bắt buộc đúng 1 ô), `"B"` = phòng boss,
    `"S"` = phòng đặc biệt, `"?"` = phòng chưa mở/fog. `parseGridMap()`
    (`mapGrid.ts`) đọc lưới này, tìm ô `"X"` làm vị trí xuất phát. Không cấu
    hình tường thủ công cho từng phòng — `getCellWalls(map, row, col)` tự
    soi 4 ô lân cận trong lưới: ô nào tồn tại (trong biên lưới và khác `0`)
    thì cạnh đó MỞ (link được); ô nào không tồn tại thì cạnh đó bị chặn (kẹt
    lại, không sự kiện gì). **Hàng được phép JAGGED** (đổi 2026-08-12) — độ
    dài mỗi hàng độc lập, không cần độn `0` để hàng nào cũng dài bằng nhau
    hay giữ hình chữ nhật; ô ngoài độ dài hàng của nó tự hiểu là `0`. Map
    `start` đã bỏ hẳn cột đầu toàn `0` (chỉ tồn tại để "vừa hình" trước đây)
    — key `"row-col"` của `obstaclesByCell`/`subjectsByCell`/
    `monstersByCell`/`floorOverridesByCell` dịch theo đúng cột mới. Muốn map
    to hơn/mê cung phức tạp hơn thì cứ viết thêm hàng/cột thật, không cần lo
    "độn cho đủ hình chữ nhật" nữa — `MAX_GRID_SIZE = 30` là mốc mềm duy
    nhất còn lại.
  - **Ảnh sàn/tường/tint của mỗi phòng là DỮ LIỆU khai báo trong map module,
    không phải if-else trong component** (đổi 2026-08-12): `MapModule.
    roomStyles: Record<GridCellKind, RoomVisualStyle>` gán `floorSrc`/
    `wallSrc`/`tint?` cho từng loại phòng (`empty`/`normal`/`boss`/
    `special`/`unknown`) — VD phòng boss dùng `ground/lava_wall.png` + tint
    đỏ, phòng thường dùng `ground/log_wall.png` không tint.
    `MapModule.floorOverridesByCell?: Record<string, string>` ép ảnh sàn cho
    1 ô cụ thể bất kể loại phòng (VD ô bắt đầu luôn là `dirt.png`).
    `MapScreen` chỉ tra `map.roomStyles[cell.kind]` +
    `map.floorOverridesByCell?.[posKey]` — thêm loại phòng mới muốn ảnh
    riêng thì sửa `roomStyles` của map đó, không sửa `MapScreen`/
    `mapScene.ts`. Tường chỉ render ở ĐÚNG cạnh bị chặn (`walls[edge] ===
    true`), không phải viền toàn map.
  - **Vật cản tĩnh trong phòng** (`ObstacleConfig`) — chặn di chuyển KHÔNG
    cần nằm ở biên phòng. Vị trí khai báo theo **tỉ lệ** `xFrac`/`yFrac`
    (0-1) để giữ đúng vị trí tương đối dù phòng đổi kích thước theo
    `roomScale`/viewport. Chưa có art riêng thì tự fallback về hình chữ nhật
    xám bo góc. Va chạm tách trục X/Y (`isBlockedByObstacle`) nên đụng vật
    cản thì trượt dọc theo nó thay vì đứng khựng lại. Mỗi map module có
    `obstaclesByCell` (map theo `"row-col"`) — map `start` có 2 vật cản
    (fallback hình chữ nhật xám) trong phòng bắt đầu (`"0-1"`).
  - **Vật thể trang trí (`SubjectConfig`)** — nay chỉ còn = `ObstacleConfig`
    (thuần vật cản, không mang dialogue — xem đợt 8 ở đầu file). Khai báo ở
    `subjectsByCell` của map module. VD hiện có: `company.png` (tòa nhà đổ
    nát, `public/subject/company.png`) đặt ở phòng bắt đầu map `start`.
  - **Dialogue vào-phòng (`MapModule.dialoguesByCell`)** — 1 chuỗi
    `DialogueLine[]` khai theo `"row-col"`, bắn 1 lần duy nhất qua
    `DialogueBox` khi người chơi tới đúng phòng đó lần đầu (theo dõi bằng 1
    `Set` session trong `MapScreen`, không persist). Là thuộc tính của
    PHÒNG — không cần vật thể nào đặt trong phòng để bắn được, phòng trống
    vẫn khai được. VD hiện có: phòng bắt đầu map `start` kể 2 câu thoại
    tiếng Việt đơn giản về việc nhân vật bị đẩy về Wulin.
  - **`DialogueBox`**: hộp thoại wuxia (giấy da gradient, viền mực đôi
    `#7a5230`), portrait tròn (LUÔN hiện — icon người mặc định nếu không có
    `portraitSrc`, kể cả lời thoại của chính người chơi) + tên đặt bên trái
    hoặc phải theo `DialogueLine.side`, tap bất kỳ đâu hoặc Space để qua
    dòng tiếp. Component dùng chung, không đặc thù riêng map nào.
  - **Nhạc nền theo map, loop qua `useMapMusic(playlist, mapKey)`**
    (`modules/world/useMapMusic.ts`) — dùng `<audio>` React thuần, KHÔNG
    phải Phaser sound manager, vì `MapCanvas` bị destroy/recreate mỗi lần
    đổi phòng (`key` theo `"row-col"`) nên nhạc do Phaser quản sẽ bị restart
    mỗi lần đổi phòng trong CÙNG 1 map. Hook mount ở `MapScreen` (ngoài
    subtree theo phòng), chỉ restart khi `mapKey` (map id) thực sự đổi; hết
    bài (`onended`) tự chuyển bài kế tiếp trong `music`, quay vòng lại đầu
    playlist. Map `start` hiện có 1 bài (`start.mp3`, loop chính nó).
  - **Đi sát 1 cạnh mở** → `MapScreen.handleReachEdge(edge)` tính ô lân cận
    qua `neighborCoords()`, fade đen toàn màn hình (GSAP opacity, KHÔNG phải
    chớp mắt) → đổi `position` sang ô đó + đánh dấu `visited` + tính
    `spawnAt` = cạnh ĐỐI DIỆN (`OPPOSITE_EDGE`) → remount `MapCanvas` (prop
    `key` đổi theo `"row-col"`, tự tạo Phaser.Game mới ở phòng mới, xuất
    hiện đúng cạnh đối diện) → fade mở ra.
  - **`obstacles`/`subjects` truyền vào `MapCanvas` PHẢI `useMemo`** theo
    `[map, posKey]` trong `MapScreen` — nếu tạo mảng mới bằng spread mỗi
    render mà không memo, `MapCanvas`'s `useEffect` (phụ thuộc các prop này
    theo reference) sẽ coi là "đã đổi" trên MỌI re-render (kể cả những
    render không liên quan, VD đóng dialogue/tutorial), destroy/recreate
    toàn bộ `Phaser.Game` → chớp màn hình. Bug này đã xảy ra thật và đã sửa.
  - **`generateRandomGridMap(rows, cols, roomCount?)`** (`mapGrid.ts`) sinh
    lưới ngẫu nhiên bằng random walk, đặt boss ở phòng xa nhất, rải 1-2
    phòng đặc biệt — **CHƯA được dùng làm mặc định**, map module `start`
    vẫn dùng `grid` viết tay để test dễ đoán trước.
  - **`GridMinimap`** — phong cách giấy da/cuộn thư wuxia, dùng art thật
    `public/minimap.png` làm backdrop (scrim tối phía trên để giữ độ đọc
    của lưới ô fog-of-war). Góc trên phải, KHÔNG có tia quét. **Là 1 khung
    nhìn (viewport) LUÔN LẤY NGƯỜI CHƠI LÀM TÂM** (đổi 2026-08-12,
    `VIEWPORT_RADIUS` — bản nhỏ 5×5, overlay phóng to 7×7), không còn render
    nguyên lưới nữa — đi tới đâu minimap chỉ pan khung nhìn quanh vị trí hiện
    tại, map to/mê cung cỡ nào cũng không làm ô co lại hay minimap phình to.
    Bấm vào minimap để phóng to, mở ra dạng "cuộn thư mở" (2 thanh gỗ tối bo
    tròn kẹp trên/dưới panel) — `GridCells` dùng lại y hệt cho bản nhỏ lẫn
    overlay phóng to, chỉ khác `cellSize`/`viewportRadius`. Ô chưa `visited`
    hiện tối, ẩn loại phòng thật (trừ `"unknown"` luôn hiện `?`); ô đã
    `visited`/đang đứng thì lộ icon thật (`Skull`=boss đỏ, `Gem`=đặc biệt
    tím); ô hiện tại (luôn ở chính giữa khung nhìn) có viền vàng + chấm sáng
    giữa ô.
  - **Camera**: mỗi phòng rộng `roomScale` (mặc định 1.5×, truyền được) ×
    kích thước canvas thật — tính lại mỗi lần vào phòng. Camera tự zoom ra
    nhẹ (`ZOOM_NEAR_EDGE` = 0.8, lerp mượt) khi nhân vật đến gần bất kỳ cạnh
    nào, zoom về 1.0 khi ở giữa phòng.
- **HUD góc dưới-trái CHỈ còn avatar + Máu/Nộ, CẢ KHỐI là 1 nút** (đổi
  2026-08-13 đợt 3 — trước đó `PlayerStatusPanel` có thêm 1 icon "Nhân Vật"
  riêng bên trong): `PlayerStatusPanel.tsx` không tự giữ state panel nào
  đang mở nữa (dời sang `GameHud.tsx`, xem "Hub Nhân Vật" bên dưới) — bấm
  bất kỳ đâu trên khối HUD mở thẳng `CharacterPanel`. Khi `statPoints > 0`
  (vừa lên cấp hoặc còn điểm chưa tiêu) hiện badge đỏ `+N` (animate-pulse)
  góc trên-phải khối, tự ẩn khi tiêu hết. Dữ liệu hp/Nộ đọc từ
  `modules/world/liveHud.ts` (`useLiveHudStore`, KHÔNG persist).
  `ExperienceBar`: 1 line full width, fixed đáy màn hình, tách riêng khỏi
  khối HUD góc trái.
- **Nộ tăng khi đánh, tự tuột nếu ngừng đánh** (`addRage()` trong
  `modules/world/liveHud.ts`, gọi từ `mapScene.ts`'s `updateCombat()`): mỗi
  đòn tự động của người chơi trúng quái +10 Nộ (trần `maxRage` = 100). Không
  đánh trúng đòn nào trong `RAGE_DECAY_DELAY_MS` (5s) thì Nộ tự tuột dần
  (`RAGE_DECAY_PER_SECOND` = 20/s, không phải reset về 0 ngay). Chưa có cơ
  chế tiêu Nộ — thanh này hiện chỉ tích/xả, chờ tính năng dùng tới sau.

### Thế giới / di chuyển
- Canvas Phaser 4, mỗi phòng là 1 `Phaser.Game` riêng (`MapCanvas`, mount/
  unmount theo `key`), KHÔNG phải 1 world liên tục 3000×3000.
- **Di chuyển: WASD hoặc phím mũi tên**, 8 hướng, vector chuẩn hoá, tốc độ cố
  định (`MOVE_SPEED` trong `mapScene.ts`) — chưa có hệ thống stats nào can
  thiệp vào tốc độ này.
- **Class `Actor`** (`modules/world/actor.ts`) là nền cho nhân vật hiển thị
  trong world: container + ảnh billboard + bóng đổ, gọi
  `actor.update(dt, moveAngle)` mỗi frame — `moveAngle` là hướng di chuyển
  hiện tại (radian) hoặc `null` nếu đứng yên. Actor tự:
  - Xoay cả frame ảnh theo `moveAngle`, **giữ nguyên hướng cuối khi đứng
    yên** (không snap về 0).
  - Nảy kiểu slime khi đang di chuyển (squash-and-stretch theo
    `Math.abs(sin(hopPhase))`), bóng đổ co giãn theo độ nảy.
  - Fallback hình khối màu (chấm + mũi tên) nếu texture chưa load được.
- **Ảnh nhân vật được nạp qua Next.js Image Optimizer**
  (`optimizedSpriteUrl()` trong `mapScene.ts`, gọi `/_next/image?url=...&w=`)
  thay vì nạp thẳng file gốc — file gốc trong `public/` có độ phân giải rất
  lớn, nếu để Phaser tự downscale trực tiếp xuống vài chục px thì ảnh bị
  mờ/nhoè. Tường cũng nạp qua route này — `WALL_THICKNESS = 64` (2026-08-12,
  đổi từ 56) dùng LUÔN làm width nạp ảnh, 2 giá trị này PHẢI bằng nhau: nạp ở
  1 width rồi vẽ `TileSprite` ở bề dày khác (VD nạp 64 nhưng vẽ dày 56) khiến
  mỗi lần lặp texture chỉ hiện 1 phần rồi bị cắt cụt trước khi sang lần lặp
  kế — bug đã gặp và sửa bằng cách gộp 2 hằng số riêng biệt trước đó thành 1.
- Camera bám nhân vật (`startFollow`, có lerp), luôn hướng Bắc cố định.

### Combat nhẹ trong map (2026-08-12, cập nhật 2026-08-13)
- **Auto-attack theo tầm, không cần phím**: người chơi có 1 vòng tròn tầm
  đánh mờ quanh nhân vật (`ATTACK_RANGE_RADIUS` trong `mapScene.ts`, dựng qua
  `Actor`'s `rangeRadius` — luôn đi theo nhân vật vì là con của cùng 1
  container, không cần đồng bộ vị trí thủ công). Quái còn sống gần nhất
  trong vòng đó bị "bắn" mỗi `PLAYER_ATTACK_INTERVAL_MS`.
- **Đòn đánh là 1 chu kỳ NÉM vật phẩm, KHÔNG trừ máu tức thời** (đổi
  2026-08-13) — `updateCombat()` gọi `fireAttack()` (`modules/world/
  attack.ts`, xem mục 2 + SKILL.md mục 1) với toạ độ quái TẠI THỜI ĐIỂM BẮN;
  bên trong đó vật phẩm bay + xoay ~350ms, chạm đích mới nổ + hiện số sát
  thương (`spawnDamageText`) RỒI mới gọi callback `onLand` — đây là chỗ sát
  thương thật sự áp dụng (`monster.takeDamage()`), không phải lúc bắn. Vật
  phẩm ném ra là vũ khí đang trang bị hoặc vũ khí mặc định của nhân vật
  (`getEffectiveStats().weaponSpriteSrc`, xem mục "Nhân vật/vũ khí" dưới).
  Sát thương gây ra = `playerAttackDamage` = `getEffectiveStats().attack`
  (base + điểm cộng + bonus vũ khí), không còn hằng số cứng.
- **Quái là class `Monster`** (`modules/world/monster.ts`, module riêng —
  xem SKILL.md mục 1) bọc quanh 1 `Actor` + thanh máu nổi phía trên (2
  `Rectangle`, tự update theo tỉ lệ hp/hp tối đa) + state combat riêng
  (aggro, cooldown đánh, đã chết hay chưa). `mapScene.ts` chỉ orchestrate:
  gọi `monster.update()`/`monster.tryAttack()`/`monster.takeDamage()` mỗi
  frame rồi phản ứng theo giá trị trả về, không tự tay tính khoảng cách/aggro.
  - Quái đứng yên cho tới khi người chơi vào `aggroRadius` CỦA QUÁI ĐÓ, hoặc
    tới khi bị đánh trúng (`takeDamage()` luôn ép `aggro = true` dù đang
    ngoài `aggroRadius`) — một khi đã aggro thì rượt theo suốt phòng, không
    có leash/bỏ cuộc.
  - Khi đủ gần người chơi (`attackRadius`) và hết cooldown riêng
    (`attackIntervalMs`), quái tự gây `damage` sát thương — trừ máu thật qua
    `damagePlayer()` (`modules/world/liveHud.ts`).
  - Hết máu: tween scale/alpha nhỏ dần rồi tự huỷ, người chơi nhận
    `expReward` qua `character/store.ts`'s `gainExp()` (tự cộng dồn EXP, lên
    cấp khi đủ ngưỡng, +5 điểm chỉ số mỗi cấp, tăng dần `expToNext`), đồng
    thời roll rớt đồ (xem dưới).
- **Máu người chơi là state thật** (`useLiveHudStore`'s `hp`, không còn mock
  tĩnh) — về 0 thì `handlePossibleDeath()` (`mapScene.ts`) hồi đầy máu +
  `RESPAWN_INVULN_MS` (1.2s) bất tử NGAY (đồng bộ, chặn trigger lặp), rồi
  gọi `onPlayerDeath()` để React lo phần còn lại: hiện `DeathNotice`
  ("Bạn Đã Gục Ngã", tự tắt sau 2.5s) rồi fade đen về **Ô "X"
  (ô xuất phát) của map** — KHÔNG còn hồi sinh giữa phòng vừa chết như bản
  cũ (2026-08-14 đợt 9, xem thêm subsection riêng dưới). `maxHp` không tự
  đứng một mình — đồng bộ từ `character/store.ts`'s
  `getEffectiveStats().maxHp` qua `setMaxHp()` mỗi khi lên cấp/cộng điểm/đổi
  vũ khí/đổi nhân vật.
- **Khai báo quái trong map module** qua `MapModule.monstersByCell` (giống
  hệt `obstaclesByCell`/`subjectsByCell`, key `"row-col"`) —
  `MonsterSpawnConfig` (vị trí theo tỉ lệ, sprite, `displaySize?` tuỳ chọn —
  px width, mặc định 52 nếu bỏ trống — hp/damage/moveSpeed/aggroRadius/
  attackRadius/attackIntervalMs/expReward). Map `start` có 3 con
  `deer_injured` (`villain/deer_injured.png`, `displaySize` 100-120) ở phòng
  `"0-1"`.
- **Canvas Phaser render Retina-sharp, không phải 1:1 CSS px** (đợt 9) —
  `MapCanvas.tsx` dùng `Phaser.Scale.NONE` + tự resize canvas backing-store
  lớn hơn CSS size theo `window.devicePixelRatio`, `zoom: 1/dpr` giữ nguyên
  kích thước hiển thị trên màn hình. `mapScene.ts` nhận option `dpr`, chia
  `this.scale.width/height` cho `dpr` khi tính `roomWidth/roomHeight` (để
  mọi toạ độ gameplay không đổi) và nhân camera zoom với `dpr` (để lấp đầy
  backing-store lớn hơn đó) — xem SKILL.md đợt 9 nếu cần đụng lại 2 chỗ này.
- **Vật cản trong phòng bắt đầu dùng ảnh thật** thay vì khối xám placeholder:
  `rock.png`/`big_bush.png`/`small_bush.png` (`public/subject/`).

### Nhân vật/vũ khí đổi được, cộng điểm chỉ số (2026-08-13 đợt 1)
- **Nhân vật** (`modules/character/`, persist) — `CHARACTERS` (hiện chỉ
  `dog`, tên hiển thị "Cẩu Nhi") gồm ảnh trong map + vũ khí mặc định
  (`defaultWeaponId`). Đổi nhân vật qua `CharacterPanel` (`setCharacter()`).
- **Vũ khí — CHỈ 1 slot, không giáp/phụ kiện** (`modules/inventory/`,
  persist) — `WEAPON_TYPES` (`dress_shoe`="Giày Da", `flip_flop`="Dép Lê").
  Chưa trang bị gì thì dùng vũ khí mặc định của nhân vật; trang bị 1 item đã
  có (`equipItem(id)`, qua `BagPanel`) thì item đó thay thế cả sprite ném
  lẫn cộng `statBonus` của nó vào chỉ số hiệu lực.
- **Lên cấp cho 5 điểm chỉ số** (`STAT_POINTS_PER_LEVEL`), tiêu vào Máu hoặc
  Tấn Công (`allocateStat("hp" | "attack")`, mỗi lần bấm 1 điểm) qua
  `CharacterPanel`. Chỉ 2 chỉ số này tồn tại hiện nay (không Giáp/Chí Mạng/...
  — cố tình đơn giản, xem Roadmap nếu cần mở rộng).

### Hub "Nhân Vật" + Túi Đồ/Triệu Hồi/Kỹ Năng/Thú Cưng/Thú Cưỡi/Bạn Bè (2026-08-13 đợt 2)
- **Giết quái roll rớt 1 LẦN** (`rollDrop()` trong `inventory/store.ts`, gọi
  từ `mapScene.ts` khi `Monster.takeDamage()` trả về đã chết) — 50% Bạc
  (random 5–15), ĐỘC LẬP 15% Thẻ Triệu Hồi. **KHÔNG còn rớt đồ (item) trực
  tiếp nữa** (đổi từ đợt 1's 10% — xem "Triệu Hồi" bên dưới để biết đồ ra từ
  đâu). Rớt gì thì hiện chữ nổi báo (`spawnDamageText` màu khác).
- **Túi Đồ (`BagPanel.tsx`)** — hiện Bạc + Thẻ Triệu Hồi rồi danh sách
  `inventory.items` (màu theo phẩm chất) — nơi DUY NHẤT trang bị/tháo vũ
  khí, `CharacterPanel` chỉ hiện thứ ĐANG mặc, không tự đổi tại đó nữa.
- **Triệu Hồi (`SummonPanel.tsx`, `modules/summon/`)** — tiêu 1 Thẻ Triệu
  Hồi (`inventory.spendSummonCard()`) ra 1 vũ khí ngẫu nhiên có **phẩm chất**
  (`Rarity`: Thường/Hiếm/Sử Thi/Huyền Thoại — `RARITY_CONFIG` trong
  `summon/data.ts`, mỗi bậc có `statMultiplier` riêng ×1/×1.5/×2.5/×4 nhân
  vào công thức chỉ số cũ Máu `level*8`/Tấn Công `level*2`). Tỉ lệ ra phẩm
  chất cao phụ thuộc `storeLevel` của Tiệm (`rollRarity()` — trọng số cơ bản
  {common:70,rare:24,epic:5,legendary:1}, mỗi level trên 1 dịch 3% từ common
  sang epic(+2)/legendary(+1)). `storeLevel` CÓ persist nhưng CHƯA có nút
  nâng cấp — mặc định 1 mãi cho tới khi có tính năng nâng cấp thật.
- **Kỹ Năng/Thú Cưng/Thú Cưỡi/Bạn Bè — dàn UI trước, chưa có cơ chế thật**
  (`SkillsPanel`/`PetPanel`/`MountPanel`/`FriendsPanel`, mỗi thứ 1 domain
  module tối giản `modules/skills|pet|mount|friends/`) — nút điều hướng bấm
  được bình thường (KHÔNG dùng pattern khoá `Lock` cũ nữa), nội dung bên
  trong panel chỉ nói "sắp ra mắt". Thú Cưng (bạn đồng hành) và Thú Cưỡi
  (cưỡi để di chuyển nhanh hơn) là 2 khái niệm khác nhau, 2 module riêng.

### HUD tách rời + hub 2 tab (2026-08-13 đợt 3)
- **`GameHud.tsx`** thay `PlayerStatusPanel` làm chủ state `activePanel:
  PanelId | null` — component này giờ gom TOÀN BỘ layer HUD của
  `MapScreen`: status box góc dưới-trái, `ShelfNav` giữa-trên, cột
  `SummonQuickButton`+`GridMinimap` góc trên-phải, và panel đang mở. Mọi
  trigger (bấm khối HUD, bấm 1 quả cầu trên kệ, bấm nút Triệu Hồi, hay
  `onNavigate` từ trong 1 panel) đều chỉ set lại `activePanel` này.
- **`ShelfNav.tsx`** — "kệ" wuxia art thật (`public/shell.png`) đặt giữa-trên
  màn hình, 5 nút tròn "quả cầu bong bóng" (viền kính, radial-gradient trong
  suốt, icon ảnh thật ở giữa) mở Túi Đồ/Kỹ Năng/Thú Cưng/Thú Cưỡi/Bạn Bè —
  5 tính năng này KHÔNG còn nằm trong dải nút của `CharacterPanel` nữa.
- **`SummonQuickButton.tsx`** — nút Triệu Hồi tách riêng, xếp NGAY TRÊN
  `GridMinimap` trong 1 cột chung góc trên-phải (do `GameHud` dựng) — tách
  khỏi 5 tính năng trên `ShelfNav` vì tần suất bấm cao hơn hẳn (ngay sau khi
  rớt thẻ giữa combat). Hiện badge tím số thẻ triệu hồi đang có nếu > 0.
  `GridMinimap` không còn tự định vị `absolute right-4 top-4` — nhận vị trí
  từ wrapper của `GameHud`; overlay phóng to dùng `fixed inset-0` để luôn
  full-screen bất kể wrapper.
- **`CharacterPanel.tsx` đổi từ bố cục 2 cột sang 2 TAB** — không còn dải
  nút điều hướng 6 tính năng. Tab **"Chỉ Số"**: mọi `StatRow` — Cấp+EXP, Máu
  (nút +), Tấn Công (nút +), rồi Bạc/Thẻ Triệu Hồi/Điểm chưa tiêu (số
  thuần). Tab **"Nhân Vật"**: portrait, đổi nhân vật (nếu có > 1
  `CHARACTER_IDS`), nối bằng đường line xuống vũ khí ĐANG mặc (đọc-only,
  bấm vào điều hướng sang `BagPanel`).
- Icon lucide fallback cho Thú Cưng/Thú Cưỡi/Bạn Bè (`PawPrint`/`Rabbit`/
  `Users`) đã đổi hết sang ảnh thật vừa upload (`pet.png`/`mount.png`/
  `friends.png`) — không còn icon lucide nào trong panel/nav nữa. Icon Bạc
  trong `BagPanel` sửa từ nhầm dùng `bag.png` sang đúng `coins.png`.

### Sửa UI/gameplay theo phản hồi cụ thể (2026-08-13 đợt 4)
- **HUD hiện số `value/max` cho Máu/Nộ** (`PlayerStatusPanel.tsx`'s
  `VitalBar`) — trước đó chỉ có thanh, không có số.
- **Máu tự hồi 1/giây** khi còn sống và chưa đầy (`healPlayer()` trong
  `liveHud.ts`, tick trong `mapScene.ts`'s `updateCombat()`) — LUÔN clamp
  theo `maxHp` hiện tại (đọc từ store), không hardcode 100, nên tự đúng khi
  lên cấp/cộng điểm/đổi vũ khí/đổi nhân vật thay đổi `maxHp`.
- **`ShelfNav` dời xuống góc phải-dưới, thu nhỏ hẳn** (trước đó to,
  giữa-trên màn hình).
- **Góc phải-trên xếp lại**: `GridMinimap` LUÔN ở vị trí trên-cùng cố định;
  `SummonQuickButton` (+ chỗ cho icon nhanh khác sau này, VD sự kiện) xếp
  BÊN TRÁI minimap trong 1 hàng `flex-wrap` — dài quá thì tự rớt xuống dòng
  2, không đẩy minimap dịch chỗ.
- **`WuxiaModal`'s nút X hết bị cắt cụt** — dời ra làm sibling của khung
  `overflow-y-auto` thay vì con bên trong nó. Nguyên nhân: 1 phần tử set
  `overflow-y: auto` mà không set `overflow-x` tường minh sẽ bị trình duyệt
  tự ép `overflow-x` cũng thành `auto` (theo spec CSS, không cho 1 trục
  `visible` còn trục kia không) — nút định vị thò ra ngoài biên
  (`-right-3 -top-3`) bị trục X đó cắt cụt theo.
- **Roster nhân vật mở rộng từ 1 lên 7** (`modules/character/data.ts`) —
  toàn bộ ảnh trong `public/character/ingame/` TRỪ `zombie.png` (đã là art
  quái) và `deer_injured.png` (biến thể bị thương của `deer`, không phải
  nhân vật riêng): Cẩu Nhi/Quy Nhi/Lộc Nhi/Hổ Nhi/Long Nhi/Gấu Trúc/Hạc Nhi.
  Mỗi nhân vật có `baseHp`/`baseAttack` RIÊNG (không còn hằng số toàn cục
  `BASE_HP`/`BASE_ATTACK`) — `getEffectiveStats()` đọc từ
  `CHARACTERS[characterId]` thay vì hằng số.
- **`CharacterPanel` tab "Chỉ Số"** thêm hàng nối nhân vật ĐANG dùng ↔ vũ
  khí ĐANG mặc ở đầu (đọc-only, y hệt connector cũ nhưng giờ nằm trong tab
  Chỉ Số thay vì tab Nhân Vật). **Tab "Nhân Vật"** đổi hẳn thành danh sách
  CHỌN — preview 1 nhân vật (portrait + `baseHp`/`baseAttack` GỐC, chưa cộng
  điểm/vũ khí) trước, bấm "Chọn Nhân Vật Này" mới thật sự đổi
  (`setCharacter()`); bấm vào 1 dòng trong list chỉ đổi preview, tránh đổi
  nhầm nhân vật khi chỉ đang xem thử.
- **`BagPanel`'s item row gọn lại, hover mới lộ chỉ số** (`Cấp X ·
  statBonus`) — CSS `grid-template-rows: 0fr` → `1fr` trên `.group:hover`,
  animate height mượt không cần đoán `max-h`. Pattern này nên dùng lại y hệt
  cho Thú Cưng/Thú Cưỡi khi có data thật.
- **`FriendsPanel` có `useFriendsStore` thật** (persist, mặc định rỗng)
  thay vì hoàn toàn tĩnh — list DỌC 1 bạn/hàng khi có data, vẫn đúng
  empty-state cũ khi rỗng.
- **`SkillsPanel` đổi từ lưới ô khoá sang CÂY kỹ năng thật**
  (`modules/skills/`) — `SKILL_TREE` (node có `tier`/`prerequisiteIds`/
  `requiredLevel`) quyết định toàn bộ layout, component chỉ nhóm theo tier.
  Bấm 1 node → panel chi tiết hiện mô tả + yêu cầu + nút "Học"
  (`getLearnEligibility()` là nguồn sự thật DUY NHẤT cho việc học được hay
  chưa, vừa disable nút vừa cho nhãn lý do). `learnSkill()` ghi
  `learnedSkillIds` persist — **học kỹ năng CHƯA cộng bonus gameplay thật
  nào**, chỉ mỗi cơ chế Học + gate cấp/tiên quyết là thật.
- **`SummonPanel` thêm hiệu ứng quay trước khi lộ kết quả** — bấm "Triệu
  Hồi" chạy 1 `gsap.timeline()` xoay/phóng icon tiệm (~950ms), nút disable
  suốt lúc quay, xong mới gọi `performSummon()`. **Nút "Xem Tỉ Lệ Rớt Đồ"**
  mở bảng % thật theo `getRarityWeights`/`getRarityPercentages`
  (`summon/store.ts`) — CÙNG hàm `rollRarity()` dùng để roll thật, không
  tính riêng 1 công thức khác. Hiện cả cấp tiệm hiện tại VÀ cấp+1 (nếu nâng
  cấp) để thấy rõ tác động của việc lên cấp.

### Tooltip wuxia dùng chung + dọn UI hub theo phản hồi (2026-08-13 đợt 5)
- **`WuxiaTooltip.tsx`** (mới) thay `title` gốc trình duyệt trên mọi icon
  HUD (`ShelfNav`/`SummonQuickButton`/`GridMinimap`/`PlayerStatusPanel`/nút
  vũ khí trong `CharacterPanel`) — CSS `group-hover` thuần, hiện ngay lập
  tức, style giấy da (không delay dài + không style mặc định xấu của
  `title`). 2 bug lớp "bị clip cạnh" đã gặp và sửa khi xây tooltip này:
  - Trigger có `hover:scale-*` tự tạo stacking context riêng lúc hover, làm
    z-index của tooltip không còn so được với sibling (VD `GridMinimap` đè
    lên tooltip của `SummonQuickButton` dù tooltip có `z-30`) — sửa bằng
    `hover:z-30` trên chính TRIGGER (không chỉ trên tooltip).
  - Tooltip nằm trong 1 `WuxiaModal` (có `overflow-y-auto`, tự kéo theo
    `overflow-x` ẩn theo spec CSS) bị cắt cụt nếu trigger ở gần mép trái/
    phải panel — `WuxiaTooltip` có prop `align: "start"|"center"|"end"` để
    neo tooltip theo mép gần trigger thay vì luôn căn giữa qua mép đó.
- **Bạn Bè đổi từ panel modal sang dropdown neo ngay tại nút**
  (`FriendsDropdown.tsx`, thay `FriendsPanel.tsx`) — bấm bubble "Bạn Bè"
  trên `ShelfNav` toggle 1 state cục bộ (`friendsOpen`), KHÔNG còn qua
  `activePanel`/`PanelId` của `GameHud`. `"friends"` đã bị xoá khỏi
  `PanelId`.
- **Nút "← Nhân Vật" bị xoá khỏi Túi Đồ/Kỹ Năng/Triệu Hồi/Thú Cưng/Thú
  Cưỡi** — các panel này không còn được mở TỪ `CharacterPanel` nữa (mở
  thẳng từ `ShelfNav`/`SummonQuickButton`), nên "quay lại Nhân Vật" không
  còn hợp lý. Cả 5 panel giờ chỉ nhận prop `onClose` — CHỈ `CharacterPanel`
  còn giữ `onNavigate` (cần nó để nhảy sang "bag" từ nút vũ khí ở tab Chỉ
  Số).
- **`BagPanel` đổi từ list dòng dài sang GRID icon vuông** (`grid-cols-4`)
  — tên/phẩm chất/`Cấp X · statBonus` chuyển hẳn vào `WuxiaTooltip` khi
  hover thay vì hiện sẵn trong DOM. Đồ ĐANG trang bị chỉ còn 1 badge dấu
  tick (`Check`, lucide) góc trên-phải, không còn nút chữ "Đang Dùng"/
  "Trang Bị" dài. Cột đầu/cuối của grid truyền `align="start"`/`"end"` cho
  tooltip của ô đó để không bị cắt cụt ở mép modal.

### Cài Đặt — tắt/mở nhạc nền, 3 tab dạng "dấu trang sách" (2026-08-13 đợt 6)
- **Cả 3 tab của `CharacterPanel` (Chỉ Số/Nhân Vật/Cài Đặt) đều nằm NGOÀI
  RÌA modal, không phải bên trong** — yêu cầu rõ 2 lần: lần đầu chỉ nói
  Cài Đặt đừng chen vào dải tab cũ (dẫn tới bản đầu — icon góc mở dropdown,
  đã bỏ), lần chỉnh lại chốt rõ hơn: TẤT CẢ tab (kể cả Chỉ Số/Nhân Vật vốn
  đã có) phải là các ô vuông thò ra rìa modal kiểu "dấu trang sách"
  (bookmark) — không còn hàng pill-tab bên trong content nữa.
- **`WuxiaModal.tsx` đổi prop `cornerAction?: ReactNode` (bản đầu) thành
  `edgeTabs?: ReactNode`** — 1 CỘT nút "bookmark" thò ra khỏi rìa TRÁI modal,
  định vị bằng `right-full` (đặt sát bên trái card) + `items-end` (căn phải
  trong cột đó) chứ KHÔNG offset pixel thủ công — nhờ vậy mỗi tab tự quyết
  định nó "thò ra" bao nhiêu chỉ bằng WIDTH riêng của chính nó: tab đang
  active rộng hơn (52px) + màu giấy da sáng, tab không active hẹp hơn (42px)
  + màu gỗ tối, đúng cảm giác trang có bookmark đang mở tự nhiên nhô ra hơn.
  Sibling của khung `overflow-y-auto` (không bị clip, cùng nguyên tắc với
  nút X — xem mục "Đã có" đợt 4). Chỉ là chỗ định vị thuần, component truyền
  vào tự quản state tab đang chọn.
- **`EdgeTab`** (trong `CharacterPanel.tsx`) — icon-only (không nhét chữ vào
  ô vuông nhỏ), `WuxiaTooltip` hiện tên tab lúc hover thay cho nhãn chữ. 3
  icon: `Gauge` (Chỉ Số), `UserRound` (Nhân Vật), `Settings` (Cài Đặt).
- **Tab "Cài Đặt" giờ là 1 pane nội dung THẬT, không phải dropdown** —
  `SettingsButton.tsx` (bản dropdown-ở-góc, đã bỏ hẳn) không còn tồn tại;
  nội dung của nó (1 hàng "Nhạc Nền" dạng toggle switch, gọi
  `toggleMusicMuted()`) chuyển thẳng vào nhánh `tab === "settings"` của
  `CharacterPanel`, y hệt cách 2 tab kia render nội dung của chúng.
- **`modules/settings/`** — `useSettingsStore` persist
  `{ musicMuted: boolean }`, domain riêng dù hiện chỉ 1 field (cài đặt kiểu
  này gần như luôn phình to dần theo thời gian). `useMapMusic.ts` đọc
  `musicMuted`, set `audio.muted` (KHÔNG `audio.pause()`) mỗi khi đổi — giữ
  nguyên vị trí/tiến trình bài hát đang phát, unmute lên là nghe tiếp chứ
  không phát lại từ đầu.

### `CharacterPanel` min-height chống giật khi đổi tab (2026-08-13 đợt 7)
- **Vấn đề**: 3 tab của `CharacterPanel` cao rất khác nhau — đo bằng
  Playwright: Chỉ Số ~473px, Nhân Vật ~552px (chạm trần `max-h-[85vh]`), Cài
  Đặt chỉ ~192px. Đổi sang tab Cài Đặt làm modal co lại đột ngột hơn 300px,
  nhìn giật.
- **Sửa**: bọc khối `{tab === ...}` bên trong `CharacterPanel` bằng 1
  `<div className="min-h-97.5">` (97.5 × 4px = 390px, khớp chiều cao nội
  dung tab Chỉ Số — đo lại bằng `getBoundingClientRect().height` qua
  Playwright, không đoán số). Đây là SÀN chứ không phải TRẦN — tab Nhân Vật
  vẫn tự cao hơn khi cần (bị `WuxiaModal`'s `max-h-[85vh]` chặn như cũ), chỉ
  tab Cài Đặt (ngắn nhất) được đẩy lên bằng mức Chỉ Số. Muốn đổi tab mặc
  định hoặc thêm tab mới cao/thấp hơn hẳn thì đo lại mốc này, đừng giữ
  nguyên số cũ mà không kiểm tra.

### Hệ thống NPC + Nhiệm vụ (2026-08-14 đợt 10)

- **`modules/npc/`** (mới) — `types.ts`: `NpcId` (literal union), `NpcConfig`
  (`name`/`spriteSrc`/`portraitSrc`/`questIds: QuestId[]` — MẢNG để nhận
  thêm quest sau không đổi type — /`introLines`/`activeLines`/
  `turnInLines`/`doneLines`, mỗi bộ là `DialogueLine[]`), `NpcSpawnConfig`
  (`xFrac`/`yFrac`/`npcId`/`displaySize?`/`talkRadius?`). `data.ts`: NPC đầu
  tiên `"turtle_guide"` = Cụ Quy (`character/ingame/turtle.png`), đặt ở
  `start.ts`'s `npcsByCell["0-2"]`. `npc.ts`: lớp Phaser `Npc` — bọc 1
  `Actor` (như `Monster`), vẽ 1 "bubble thoại" phía trên đầu qua hàm dùng
  lại được `createSpeechBubble()` (Graphics bo góc + đuôi trỏ xuống, không
  cần asset ảnh, cùng tinh thần CSS-only-fallback của `WuxiaTooltip`). Bubble
  gộp CHUNG 2 việc: hiện glyph trạng thái quest "khẩn cấp nhất" trong số
  `questIds` của NPC (`refreshMarker()`: `?` vàng = chưa nhận, `…` trắng =
  đang làm, `!` cam = sẵn sàng trả, ẩn hẳn nếu mọi quest đã xong) VÀ nhấp
  nháy sáng lên (`setInRange()`, tween alpha/scale yoyo lặp) khi người chơi
  đứng trong `talkRadius` (mặc định 120px) — báo "bấm Space nói chuyện
  được" mà không cần chữ hint riêng.
- **`modules/quest/`** (mới) — `types.ts`: `QuestId`, `QuestStatus =
  "not_started"|"active"|"ready_to_turn_in"|"completed"`, `QuestDef` dạng
  "đếm số tới ngưỡng" (`targetCount`/`rewardExp`/`rewardCurrency`) — CHƯA
  xây hệ "loại mục tiêu" tổng quát (hộ tống, khảo sát...) vì chưa có ví dụ
  thật thứ 2, cố tình để dành. `data.ts`: quest đầu tiên `"first_deer_hunt"` =
  "Diệt 5 Con Nai Đột Biến". `store.ts` (persist): `getQuestStatus`/
  `startQuest`/`reportQuestProgress` (chỉ cộng khi status hiện tại là
  `"active"` — quái chết trước khi nhận nhiệm vụ không tự tính; tự chuyển
  `"ready_to_turn_in"` khi đạt `targetCount`)/`completeQuest`.
- **Gắn vào world runtime**: `MapModule` thêm `npcsByCell`; `MonsterSpawnConfig`
  thêm `questId?: QuestId` (quái tag quest nào, chết mới gọi
  `reportQuestProgress(questId, 1)`, trong đúng nhánh giết-quái sẵn có cạnh
  `gainExp`/`rollDrop`). `mapScene.ts` đăng ký thêm phím `space`; mỗi frame
  `updateNpcInteraction()` tìm NPC gần nhất trong tầm (mirror
  `findNearestAliveMonsterInRange`), gọi `refreshMarker()`/`setInRange()`
  cho MỌI NPC trong phòng, và nếu có NPC trong tầm + Space vừa nhấn
  (`Phaser.Input.Keyboard.JustDown`) thì gọi callback `onNpcInteract(npcId)`
  — thêm mới, xuyên `MapCanvas.tsx` vào `MapScreen.tsx`, cùng pattern
  `onReachEdge`/`onPlayerDeath`. NPC cũng được đẩy vào `obstacleRects` —
  chặn đường như người thật, dùng lại collision có sẵn.
- **Luồng hội thoại → nhận/trả nhiệm vụ ở `MapScreen.tsx`**:
  `handleNpcInteract` chọn quest "khẩn cấp nhất" của NPC (ưu tiên
  `ready_to_turn_in` > `active` > `not_started`, hết thì dùng `doneLines`),
  set state `npcDialogue` (tái dùng nguyên `DialogueBox`, không sửa file
  đó). `handleNpcDialogueDone`: hết thoại giới thiệu (`phase==="intro"`) →
  mở `QuestOfferModal.tsx` (mới, dựa `WuxiaModal`, 2 nút "Nhận Nhiệm Vụ"/
  "Để Sau"); hết thoại trả nhiệm vụ (`phase==="turnIn"`) → `completeQuest` +
  phát thưởng (`gainExp`/`addCurrency` theo số trong `QuestDef`) NGAY khi
  đóng, không cần modal xác nhận riêng cho lượt trả.
- **Bug thật đã gặp và sửa: `onNpcInteract` đóng băng state cũ (stale
  closure)** — `MapCanvas.tsx`'s `useEffect` không đưa callback prop vào
  dependency array, y hệt cách `onReachEdge`/`onPlayerDeath` đã làm (tránh
  Phaser scene bị rebuild liên tục mỗi lần state đổi). NHƯNG 2 callback đó
  chỉ bắn ~1 lần/phòng và không cần đọc state React thay đổi giữa các lần
  gọi, còn `onNpcInteract` bắn NHIỀU LẦN trong 1 lượt ở phòng (mỗi lần bấm
  Space gần NPC) và tính đúng-sai của nó phụ thuộc HOÀN TOÀN vào đọc đúng
  `dialogueQueue`/`npcDialogue`/`questOffer` MỚI NHẤT mỗi lần — do đóng
  băng closure lúc Phaser scene mount, nó mãi mãi thấy state của đúng
  khoảnh khắc phòng vừa load (gần như luôn `null`), khiến dialogue set xong
  bị guard chặn ngay sau đó ở LẦN GỌI TIẾP THEO trong cùng closure cũ —
  debug bằng cách thêm `console.log` tạm trong `updateNpcInteraction()`
  mới lộ ra: Phaser vẫn gọi `onNpcInteract` đúng, chỉ là React nhận nhầm
  state. **Sửa bằng ref pattern chuẩn của React**: `handleNpcInteractRef`
  (một `useRef`) được gán lại giá trị mới nhất mỗi render qua 1
  `useEffect(() => { ref.current = handleNpcInteract; })` (KHÔNG gán trực
  tiếp lúc render — React 19 chặn "Cannot access refs during render"), còn
  hàm THẬT SỰ đưa vào Phaser (`stableOnNpcInteract`, tạo bằng
  `useCallback(..., [])`) chỉ gọi `handleNpcInteractRef.current(npcId)` —
  identity không đổi (Phaser không rebuild) nhưng luôn thực thi bản mới
  nhất. **Bài học chung**: loại trừ 1 callback khỏi dependency array chỉ an
  toàn khi callback đó KHÔNG cần đọc state thay đổi nhiều lần trong cùng 1
  lượt mount — nếu có, phải qua ref như trên, không phải "theo đúng
  pattern cũ" là xong.
- **Bonus — HUD dời góc trên-trái + theo dõi nhiệm vụ + HUD quái đang
  đánh**: `PlayerStatusPanel.tsx` bỏ tự định vị (`fixed bottom-4 left-4` →
  chỉ còn `relative`) — comment cập nhật "Not self-positioned", đúng pattern
  `GridMinimap` đã có. `GameHud.tsx` bọc nó trong wrapper `fixed left-4
  top-4 z-20 flex flex-col`, hàng đầu là `flex` ngang gồm
  `PlayerStatusPanel` + `MonsterTargetHud.tsx` (mới, quái gần nhất trong
  tầm auto-attack — đọc `modules/world/combatTarget.ts`, store session-only
  mới, `mapScene.ts` ghi `setCombatTarget(hp, maxHp, spriteSrc)`/
  `clearCombatTarget()` mỗi frame trong `updateCombat()` dựa
  `findNearestAliveMonsterInRange()`; `Monster` thêm getter public `hp` —
  field private đổi tên thành `currentHp` để không đụng tên với getter),
  `QuestTracker.tsx` (mới, chỉ hiện quest `active`/`ready_to_turn_in`,
  không vẽ khung khi rỗng) nằm dưới hàng đó.
- **4 sửa theo phản hồi playtest thật**:
  1. `TutorialOverlay` trước chỉ ẩn khi có `dialogueQueue` (thoại phòng) —
     thiếu `npcDialogue`/`questOffer` nên nói chuyện NPC có thể vô tình kéo
     tutorial hướng dẫn di chuyển ra cùng lúc. Thêm 2 điều kiện vào guard ở
     `MapScreen.tsx`.
  2. `StoryIntroScreen.tsx` (màn "Đùng... một vụ nổ lớn") thêm nút "Bỏ Qua"
     góc trên-phải — bấm là `onContinue()` ngay, không cần đợi hết
     shake+fade-in+prompt "Chạm để tiếp tục".
  3. `DialogueBox.tsx` thêm `AUTO_ADVANCE_MS = 5000` — tự sang câu kế tiếp
     nếu người chơi không bấm Space trong 5s, hết dòng cuối thì tự tắt luôn
     (giống hệt cách `TutorialOverlay` tự tắt) — tránh kẹt màn hình vô hạn
     nếu quên bấm.
  4. `MonsterTargetHud.tsx` — xem mục Bonus ở trên.
- **Map**: `start.ts` thêm `npcsByCell["0-2"]` (Cụ Quy), `monstersByCell["1-2"]`
  (5 con `deer_injured`, mỗi con `questId: "first_deer_hunt"`, rải khắp phòng),
  `obstaclesByCell["1-2"]` (9 đá/bụi trang trí) — KHÔNG đụng
  `monstersByCell["0-1"]` (chỗ user tự chỉnh số liệu để test riêng).

## 4. Animation — quy ước & vị trí

Nguyên tắc chia việc: **GSAP animate lớp React/DOM (UI, chuyển cảnh, hover)**;
**Phaser tự animate bên trong canvas** (`Actor.update()`, tween) trong
`update()`; **animation lặp/atmosphere không cần state** thì viết `@keyframes`
CSS thuần trong `globals.css` (rẻ hơn, không tốn JS tick) — không trộn 3 hệ
thống vào cùng một hiệu ứng.

- `SceneBackdrop` (`src/app/component/SceneBackdrop.tsx`): ảnh nền full-bleed
  + `.animate-scene-zoom` (Ken Burns chậm, CSS) + vignette 2 lớp (scrim phẳng
  + radial gradient) + hạt sáng (`.mote`, CSS `@keyframes float-up`). **Hạt
  sáng dùng vị trí/độ trễ tính toán xác định theo index (không `Math.random()`
  trong render)** để tránh lệch hydration giữa server/client.
- `DialogueBox`/`TutorialOverlay`: fade-in khi mount (`useGSAP`,
  `opacity 0→1, y 16→0`), fade-out TRƯỚC khi unmount (`gsap.to(..., {
  onComplete: onDone })` thay vì gọi callback ngay) — tránh cắt cứng gây cảm
  giác giật khi đóng.
- `AmbientBackground`: 3 blob màu blur trôi chậm bằng CSS `@keyframes`
  (`drift-a/b/c`) — tiện ích dự phòng cho màn nào chưa có background art
  riêng, hiện chưa được gắn ở đâu (không xoá, giữ để dùng sau).
- **`Actor`** (`modules/world/actor.ts`) — animation Phaser thuần, KHÔNG dùng
  GSAP: xoay frame theo `moveAngle` + squash-and-stretch hop tính trực tiếp
  trong `update(dt, moveAngle)` mỗi frame. Đây là quy ước bắt buộc khi thêm
  bất kỳ nhân vật mới nào trong world — dùng `Actor`, đừng viết lại logic
  xoay/nảy thủ công. **Lưu ý quan trọng (bug đã gặp và sửa)**: toàn bộ art
  nhân vật trong game này được vẽ **nhìn thẳng về phía camera** (neutral
  pose = "hướng xuống"), KHÔNG phải hướng phải như quy ước góc `0` mặc định
  của `Math.atan2`/rotation trong Phaser. Set thẳng `target.rotation =
  this.facing` (facing = `moveAngle`) sẽ lệch góc 90°. Phải cộng thêm hằng số
  bù `FACING_ART_OFFSET = -Math.PI / 2`: `target.rotation = this.facing +
  FACING_ART_OFFSET`.
- **Bug đã gặp và sửa: canvas Phaser không phủ hết màn hình, hở 1 dải nền
  đen bên phải** (`MapCanvas.tsx`) — nguyên nhân là truyền
  `width: "100%", height: "100%"` (chuỗi) vào `scale` config của
  `Phaser.Game`; Phaser chỉ resolve chuỗi `%` này ĐÚNG 1 LẦN lúc boot, và nếu
  container React chưa layout xong ở đúng khoảnh khắc đó, canvas bị khóa
  cứng ở kích thước cũ/nhỏ hơn thật. Fix: đo `container.clientWidth/
  clientHeight` (số thật) để tạo `Phaser.Game`, cộng thêm 1 listener
  `window.addEventListener("resize", ...)` gọi
  `game.scale.resize(container.clientWidth, container.clientHeight)`.
- **Bug đã gặp và sửa: "chớp màn hình" khi đóng dialogue/tutorial** —
  KHÔNG phải lỗi animation/opacity (đã verify bằng cách poll
  `getComputedStyle(el).opacity` qua Playwright, fade mượt bình thường).
  Nguyên nhân thật: `MapScreen` tạo `obstacles`/`subjects` bằng array spread
  mới trên MỌI render (không `useMemo`) → `MapCanvas`'s `useEffect` (phụ
  thuộc theo reference) coi là "đã đổi" ngay cả khi chỉ có 1 `setState`
  không liên quan (đóng dialogue) → destroy/recreate toàn bộ `Phaser.Game`.
  Verify bằng cách đếm Phaser boot log (`/Phaser v/i` trong console)
  trước/sau hành động dismiss — tăng thêm nghĩa là đang re-mount canvas thật
  sự, không phải cảm giác chủ quan. Fix: `useMemo` các mảng này theo
  `[map, posKey]`.

## 5. Stack kỹ thuật

- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4.
- **Phaser 3-API-compatible (gói `phaser` v4)** cho canvas game — mount qua
  `next/dynamic({ ssr: false })` trong `MapScreen` (`MapCanvas`).
- **Zustand** cho state; `mapProgress` dùng middleware `persist`
  (localStorage) để nhớ map đã đi đến; `liveHud` KHÔNG persist (chỉ mock
  giá trị hiển thị, chưa có hệ thống nào ghi vào runtime).
- **lucide-react** cho icon (không dùng SVG vẽ tay).
- **GSAP + `@gsap/react`** cho animation UI — xem quy ước chi tiết ở mục 4.
- **next/font/local** cho 3 font riêng của game (`src/assets/*.ttf`, khai báo
  trong `src/app/layout.tsx`) — KHÔNG dùng Google Fonts: `VL TypewriterBasiX`
  là `font-vl` (mặc định), `BMXRadical-Bold` là `font-bmx` (tên game/impact),
  `P22 Slogan W00 Regular` là `font-p22` (tiêu đề ngắn) — tên biến/class đặt
  theo đúng tên font thật, xem `SKILL.md` mục 2.
- **next/image** cho ảnh trong DOM (backdrop/minimap/portrait); ảnh trong
  canvas Phaser đi qua endpoint `/_next/image` thủ công (`optimizedSpriteUrl`,
  xem mục 3) vì Phaser tự load bằng URL, không qua component `<Image>`.
- Không dùng thư viện UI trả phí — HUD/minimap/dialogue/tutorial đều tự build
  bằng Tailwind + CSS + GSAP.

## 6. Roadmap (chưa làm)

- [ ] **Map thứ 2 trở đi** — kiến trúc module (`modules/world/maps/`,
      `MAP_MODULES`/`MAP_ORDER`, `useMapProgressStore`) đã sẵn sàng: thêm
      map mới chỉ cần 1 file module (grid + obstacles + subjects + music +
      roomStyles) + 1 dòng `MAP_ORDER`, không sửa `MapScreen`. Còn thiếu: cơ
      chế "map `start` hoàn thành → chuyển map tiếp theo" thật sự (hiện chưa
      có điều kiện hoàn thành/exit nào được định nghĩa — `setCurrentMapId`
      đã có nhưng chưa có chỗ nào gọi nó).
- [ ] **Zombie làm quái mới, deer/panda làm NPC** — ảnh đã có sẵn ở
      `public/character/ingame/` (xem mục 1; `turtle.png` đã dùng làm
      portrait thoại "???" ở map `start`) nhưng chưa gắn vào hệ thống nào —
      chờ chỉ đạo cụ thể hơn (kể cả việc có xây lại combat hay không).
- [ ] **Art direction "Stylized Chinese ink painting + 3D nhẹ"** theo ảnh
      tham khảo chủ dự án gửi — giữ 2D ở phần nào đang là 2D, không đổi hết
      sang 3D thật. Cần asset thật trước khi làm sâu; hiện dùng tạm art có
      sẵn (chủ dự án sẽ bổ sung khi cần).
- [ ] Loading screen khi khởi tạo Phaser game (đặt ở `src/app/component`) —
      hiện avatar/canvas xuất hiện gần như ngay do ảnh đã qua tối ưu, nhưng
      nên có khi thêm nhiều asset hơn.
- [ ] Sprite theo hướng thật (4-8 hướng) nếu có thêm asset, để thay cho giải
      pháp "xoay cả frame ảnh bust theo hướng di chuyển" hiện tại — chỉ cần
      đổi bên trong `Actor`, không cần sửa chỗ gọi.
- [ ] Cơ chế thật cho Kỹ Năng/Thú Cưng/Thú Cưỡi/Bạn Bè — 4 panel này hiện chỉ
      dàn UI + module tối giản (xem mục "Hub Nhân Vật..."), điều hướng bấm
      được nhưng nội dung chỉ nói "sắp ra mắt". Nộ hiện chỉ tích/xả, chưa có
      cơ chế tiêu — có thể là chỗ móc nối tự nhiên cho 1 skill chủ động sau
      này. Thiết kế lại từ đầu khi có yêu cầu cụ thể, đừng cố khôi phục
      nguyên trạng hệ thống cũ đã xoá — xem mục 0.
- [ ] Nút nâng cấp Tiệm Triệu Hồi (`summon.storeLevel` đã persist nhưng
      chưa có cách tăng), vật phẩm rớt/triệu hồi ra HIỆN TRÊN SÀN để đi nhặt
      (thay vì cộng thẳng vào túi đồ như hiện tại), quái có cấp độ riêng
      (hiện `characterLevel` truyền vào `performSummon()` là cấp NHÂN VẬT,
      không phải cấp quái — quái chưa có field cấp), giáp/phụ kiện ngoài vũ
      khí, thêm nhân vật/loại vũ khí/phẩm chất thứ n — tất cả đều chỉ cần
      thêm entry vào `CHARACTERS`/`WEAPON_TYPES`/`RARITY_CONFIG`, kiến trúc
      đã sẵn sàng.
- [ ] Âm thanh hiệu ứng (bước chân, mở cửa, tương tác vật thể...) — hiện chỉ
      có nhạc nền theo map.
- [ ] Đồng bộ multiplayer (nếu muốn giữ đúng tinh thần `.io`) — hiện tại hoàn
      toàn single-player, lưu local.
