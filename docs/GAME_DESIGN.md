# Wulin.io — Tài liệu thiết kế game

> Cập nhật lần cuối: 2026-08-11 (mỗi map giờ là 1 MODULE riêng dưới
> `modules/world/maps/` — bản đồ hiện tại chính thức là module `start`,
> KHÔNG BAO GIỜ gọi là "demo"; thêm vật thể cốt truyện `SubjectConfig` +
> `DialogueBox` wuxia (VD `company.png` kể chuyện bị đẩy về Wulin); nhạc nền
> theo map, loop qua `useMapMusic`; tutorial chỉ hiện theo map, to hơn, hiện
> cả WASD lẫn phím mũi tên; thêm HUD dưới cùng cho luồng LIVE
> (`ExperienceBar`/`LiveHudBar`, 3 ô Kỹ Năng/Nhân Vật/Thú Cưỡi đều khóa);
> minimap đổi sang phong cách giấy da/cuộn thư wuxia; thêm quy tắc bắt buộc
> "phong cách hình ảnh nghiêng wuxia" cho mọi UI mới (`SKILL.md` mục 4); gỡ
> phím `J`/`K`/`L`/`U`/`P` khỏi combat scene DORMANT — giờ thuần di chuyển,
> chuẩn bị nối combat vào luồng LIVE sau này).
> File này là nguồn thông tin sống — mỗi khi thêm tính năng mới, cập nhật lại
> phần "Đã có" và "Roadmap" tương ứng. Xem thêm quy ước bắt buộc ở
> `.claude/skills/wulin-design/SKILL.md` và `AGENTS.md`.

## 0. Trạng thái hiện tại — app chỉ có đúng 3 màn hình

`src/app/page.tsx` chỉ render `IntroExperience`
(`src/app/component/IntroExperience.tsx`), và đó là **toàn bộ app**: **Tap to
Start → story intro → game (map module `start`)** — xem mục "Luồng mở đầu
mới" bên dưới. Không có màn chọn môn phái nào cả.

Hệ thống crane/dragon/tiger cũ (từng có `CharacterCreationScreen` chọn 1
trong 3 môn phái) **đã bị xóa `CharacterCreationScreen.tsx` theo yêu cầu rõ
ràng** ("bỏ luôn screen chọn 3 nhân vật truyền thuyết đi"). Phần còn lại của
hệ thống đó — `LobbyScreen` (Sảnh Chờ, tab Trang Bị), `HudShell` (combat
wave-survivor đầy đủ, xem mục "Chiến đấu"), và toàn bộ module
`character`/`stats`/`skills`/`inventory`/`combat` — **vẫn còn nguyên trong
code, KHÔNG bị xóa**, chỉ đơn giản là không còn màn nào dẫn vào chúng nữa
(dormant). Lý do giữ lại: chủ dự án định hướng crane/dragon/tiger sẽ là
**"nhân vật truyền thuyết" mở khóa sau này**, nhưng **cơ chế mở khóa cụ thể
chưa được nêu rõ**, nên cố tình chưa xóa tiếp hay nối lại — nếu về sau xác
nhận không cần nữa, xóa dứt điểm cả cụm này (`LobbyScreen.tsx`, `HudShell.tsx`,
`EquipmentPanel.tsx`, `AbilityBar.tsx`, `PauseOverlay.tsx`, `Radar.tsx`,
`RadialMenu.tsx`, `PanelShell.tsx`, `CharacterStatusBar.tsx`,
`modules/{character,stats,skills,inventory,combat}/`, `modules/world/scene.ts`
+ `GameCanvas.tsx`) thay vì để mãi ở trạng thái nửa vời.

## 1. Ý tưởng cốt lõi

Game kiếm hiệp góc nhìn từ trên xuống (top-down), phong cách `.io` +
**survivor.io** (chấm tròn di chuyển trong thế giới mở, quái tự lao vào bạn
theo từng đợt): người chơi tạo nhân vật trong Sảnh Chờ, vào trận, WASD né
tránh trong khi nhân vật tự động tấn công quái gần nhất, dùng skill chủ động
để dọn quái nhanh hơn, cày cấp — không giới hạn cấp.

- **Input — bàn phím, không dùng chuột để chơi** (mô tả bên dưới là combat
  DORMANT, xem mục 0 — luồng LIVE hiện tại thuần di chuyển WASD, không có
  combat):
  - `W A S D` — di chuyển (8 hướng, chuẩn hóa vector).
  - **Đòn đánh thường tự động**: không có phím bắn — nhân vật tự nhắm quái
    còn sống **gần nhất** và bắn theo cooldown tính từ `attackSpeed`, đúng
    tinh thần "twin-stick auto-battler" của thể loại survivor.io.
  - **Cập nhật 2026-08-11**: các phím `J`/`K`/`L` (skill1/skill2/tuyệt kỹ),
    `U` (Bình Máu), `P` (tạm dừng) **đã bị gỡ bỏ** theo yêu cầu rõ ràng —
    scene combat DORMANT giờ thuần di chuyển, chuẩn bị cho việc nối combat
    vào luồng LIVE (map thật) sau này thay vì hồi sinh lại flow crane/
    dragon/tiger cũ. `I`/`O` vẫn là 2 ô khóa xám chưa gắn hành vi trên
    `AbilityBar` (xem Roadmap).
  - Camera luôn hướng Bắc cố định, không xoay theo nhân vật.
- **Phong cách hình ảnh — bắt buộc nghiêng wuxia cho mọi UI mới** (thêm
  2026-08-11): giấy da/cuộn thư, nét mực, dấu triện đỏ-vàng, khung gỗ, tông
  màu đất-đỏ-vàng ấm — thay cho UI game hiện đại phẳng chung chung. Chưa có
  art thật thì dùng CSS-only (gradient/border/shadow) làm giải pháp tạm —
  xem chi tiết + ví dụ ở `.claude/skills/wulin-design/SKILL.md` mục 4. HUD/
  panel zinc tối của Sảnh Chờ/combat DORMANT được miễn, không cần retrofit.
- **Xoay mặt theo hướng di chuyển — áp dụng cho MỌI nhân vật (người chơi lẫn
  quái)**: khác hẳn cơ chế "ngắm theo chuột" của bản trước, giờ **hướng mặt
  (facing) chỉ đổi khi đang thực sự di chuyển và luôn bằng hướng di chuyển
  đó** — đứng yên thì giữ nguyên hướng cuối cùng. Auto-target (đòn thường +
  skill) nhắm quái gần nhất độc lập với facing — nhân vật có thể quay lưng về
  phía mục tiêu mà vẫn bắn trúng, giống hầu hết game auto-battler khác. Logic
  này (xoay frame ảnh + nảy kiểu slime) nằm trong 1 class dùng chung —
  **`Actor`** (`modules/world/actor.ts`) — cả `MainScene` (player) lẫn từng
  quái đều tạo 1 instance thay vì viết lại animation riêng từng nơi. Xem chi
  tiết ở mục "Thế giới".
- Nhân vật (crane/dragon/tiger) vẫn là **object cấu hình**
  (`CharacterClassConfig`), 3 trường ảnh trỏ tới file thật trong
  `public/character/`, giờ tổ chức theo **3 folder con thay vì hậu tố tên
  file** (`<animal>_card.png` → `card/<animal>.png`, tương tự cho
  `ingame/`/`sublimation/`):
  - `coverImage` → `card/<animal>.png` — ảnh bìa dạng thẻ bài (portrait, dùng
    ở màn chọn môn phái).
  - `inGameSprite` → `ingame/<animal>.png` — ảnh bust trong game (nền trong
    suốt, dùng làm avatar world + status bar + form "Bình Thường" ở preview).
  - `inGameSublimation` → `sublimation/<animal>.png` — bản "Đại Thành"/**đột
    phá** (art có hào quang/lửa/sét bao quanh), tự động thay thế
    `inGameSprite` một khi người chơi mở khóa **skill tối thượng tầng 3** của
    môn phái (xem `getUltimateSkill` trong `modules/skills/data.ts`). Đây
    chính là hệ thống "đột phá" của game — không phải một cơ chế riêng, mà là
    phần thưởng thị giác + sức mạnh cho việc đi hết skill tree của môn phái.
  - `ingame/` còn có thêm ảnh **chưa gắn hết vào code**, để dành cho việc mở
    rộng sau: `dog.png` (nhân vật khởi đầu, dùng trong map module `start` —
    xem mục "Luồng mở đầu mới"), `turtle.png` (đã dùng làm portrait cho
    thoại "???" ở map `start` — xem mục đó), `deer.png`/
    `deer_injured.png`/`panda.png` (khả năng cao là NPC/bạn đồng hành cho map
    sau này), `zombie.png` (khả năng cao là loại quái mới, hợp với bối cảnh
    "thế giới đổi thay sau vụ nổ" — chưa thêm vào `MONSTER_CONFIGS`, chưa có
    yêu cầu cụ thể). Đừng tự ý gắn các ảnh chưa dùng này vào gameplay khi
    chưa có chỉ đạo rõ.
- **Background** màn tạo nhân vật/Sảnh Chờ là tranh minh họa núi non/sơn môn
  thật (`public/choose_character_background_screen.png`), không phải nền
  phẳng — xem `SceneBackdrop` ở mục Animation.
- **Font**: `BMXRadical-Bold.ttf` (`--font-bmx`, class Tailwind mặc định
  `font-sans`) dùng cho toàn bộ text thường của game (HUD, panel, mô tả);
  `P22 Slogan W00 Regular.ttf` (`--font-p22`, utility `.font-title`) chỉ dùng
  cho tiêu đề lớn và các màn giới thiệu/cutscene — xem `src/app/layout.tsx`.

## 2. Kiến trúc thư mục (modular theo domain)

```
public/
  choose_character_background_screen.png  # backdrop Sảnh Chờ + tạo nhân vật
  character/
    card/<animal>.png          # ảnh bìa thẻ bài (crane/dragon/tiger)
    ingame/<animal>.png        # bust trong game — có cả dog/deer/deer_injured/
                                # panda/turtle/zombie (xem mục 1, chưa gắn code)
    sublimation/<animal>.png   # bản "Đại Thành" (crane/dragon/tiger)
  villain/               # ảnh quái (ghost=thường, skull=tinh anh, spider=boss)
                         # — đặt tên <kind>_ingame.png
  ground/                 # texture map: dirt/grass/stone/stair/wooden_log.png
                          # (sàn, TileSprite) + log_wall.png/lava_wall.png/
                          # fire_wall.gif (tường — chỉ render ở cạnh phòng
                          # thực sự bị chặn, xem mục "Luồng mở đầu mới"; GIF
                          # không animate qua Phaser.load.image, coi như ảnh
                          # tĩnh). Hiện chỉ dirt/grass làm sàn,
                          # log_wall.png/lava_wall.png làm tường được dùng.
  story/
    explode_introduction.png  # ảnh vụ nổ cho StoryIntroScreen

src/
  assets/                 # font gốc (BMXRadical-Bold.ttf, P22 Slogan W00
                          # Regular.ttf), nạp qua next/font/local trong
                          # src/app/layout.tsx — KHÔNG phải public asset
  app/
    page.tsx            # entry — HIỆN chỉ render <IntroExperience />, xem mục
                        # 0. Luồng chọn môn phái/Sảnh Chờ/combat cũ vẫn còn
                        # nguyên trong code nhưng chưa được gọi từ đây.
    layout.tsx           # khai báo font BMX (--font-bmx, mặc định) + P22
                         # (--font-p22, dùng qua class `.font-title`)
    globals.css          # @keyframes dùng chung (drift, radar-sweep,
                          # scene-zoom, float-up cho hạt sáng, preview-pulse
                          # cho preview nhân vật) — animation thuần CSS
                          # (không cần JS tick) khai báo ở đây
    component/           # component "của root" — glue nhiều module lại,
                          # không thuộc riêng 1 domain
      DynamicIcon.tsx     # render lucide icon theo tên string (dùng chung)
      IntroExperience.tsx  # orchestrator luồng mở đầu: quản lý stage
                           # "tap"/"story"/"map", sở hữu chuyển cảnh chớp mắt
                           # (2 lid GSAP scaleY) phủ giữa StoryIntroScreen và
                           # MapScreen. Đây là component page.tsx render.
      TapToStartScreen.tsx  # màn tiêu đề tối giản, cả màn hình là 1 <button>
                            # (bấm bất kỳ đâu) + phím Space (window keydown
                            # listener) đều gọi onStart — không cần bấm trúng
                            # chữ "Chạm Để Bắt Đầu" (animate-pulse)
      StoryIntroScreen.tsx   # ảnh nổ + rung màn hình (GSAP timeline, KHÔNG
                             # dùng "random()" string) + lời dẫn chuyện
                             # fade-in từng dòng, sau đó CẢ root div (onClick)
                             # + phím Space đều gọi onContinue một khi prompt
                             # đã hiện — cùng quy ước tap-anywhere như
                             # TapToStartScreen
      TutorialOverlay.tsx     # callout to hơn bản đầu, hiện CẢ 2 cụm phím
                              # (WASD + mũi tên ↑↓←→) dưới nhãn "Move", tự
                              # fade sau ~6s hoặc tap vào là tắt ngay. `MapScreen`
                              # chỉ render nếu `MapModule.showTutorial` true
      GridMinimap.tsx           # minimap tĩnh góc trên phải, phong cách giấy
                                # da/cuộn thư wuxia (gradient tông đất/mực,
                                # KHÔNG có tia quét — khác `Radar` của combat).
                                # Component con `GridCells` tách riêng, dùng
                                # lại cho cả bản nhỏ lẫn overlay phóng to
                                # (dạng cuộn thư mở ra, 2 thanh gỗ trên/dưới)
                                # — chỉ khác `cellSize`. Luôn giữ khung tối
                                # thiểu `MIN_GRID` (5×5) dù lưới thật nhỏ hơn.
                                # Fog of war: ô chưa `visited` hiện tối/ẩn loại
                                # phòng (trừ `"unknown"` luôn hiện "?"), ô đã
                                # `visited`/đang đứng thì lộ icon thật
                                # (Skull=boss, Gem=đặc biệt)
      DialogueBox.tsx        # hộp thoại wuxia (giấy da, viền mực đôi) — 1
                               # dòng/lượt, portrait+tên đặt bên trái hoặc
                               # phải theo `DialogueLine.side`, tap/Space để
                               # tiếp tục. Dùng bởi thoại cốt truyện gắn ở
                               # `SubjectConfig.dialogue` (xem `modules/world/maps`)
      ExperienceBar.tsx      # thanh EXP full-width, fixed đáy màn hình cho
                               # luồng LIVE — đọc `modules/world/liveHud.ts`
      LiveHudBar.tsx          # HUD dưới cùng luồng LIVE: cấp độ + 3 ô Kỹ
                               # Năng/Nhân Vật/Thú Cưỡi — cả 3 hiện đều khóa
                               # (chưa hệ thống nào nối vào luồng LIVE), tái
                               # dùng pattern khóa/hover của `AbilityBar`
      MapScreen.tsx        # đọc `currentMapId` từ `useMapProgressStore`,
                               # render đúng `MapModule` (xem `modules/world/maps`)
                               # — mount MapCanvas (dynamic import, ssr:false)
                               # + GridMinimap + TutorialOverlay (nếu
                               # `showTutorial`) + DialogueBox (khi vào phòng
                               # có `SubjectConfig.dialogue` lần đầu) +
                               # LiveHudBar/ExperienceBar + `useMapMusic` +
                               # lớp fade đen (GSAP opacity) khi đổi phòng —
                               # xem mục "Luồng mở đầu mới"
      SceneBackdrop.tsx    # ảnh nền full-bleed + Ken Burns zoom + vignette +
                           # hạt sáng trôi (dùng cho LobbyScreen và
                           # TapToStartScreen)
      AmbientBackground.tsx # 3 blob màu mờ trôi chậm (CSS thuần) — tiện ích
                             # chung cho các màn khác chưa có background art
      LobbyScreen.tsx      # DORMANT (xem mục 0) — "Sảnh Chờ" — màn hub giữa
                           # các trận: tab "Nhân Vật" (CharacterPreview +
                           # StatsPanel, có cả bonus trang bị) / tab "Trang
                           # Bị" (EquipmentPanel), nút "Tạo Lại Nhân Vật"
                           # (reset character store) + nút "Vào Trận" để mount
                           # HudShell — không có màn nào render component này
      RadialMenu.tsx      # menu tròn mở Balo / Chỉ Số / Kỹ Năng, có breathing
                          # glow (animate-ping) quanh nút trung tâm khi đóng
      AbilityBar.tsx       # thanh ô kỹ năng (skill1/skill2/ultimate/Bình Máu
                           # + 2 ô khóa I/O) phía trên RadialMenu — icon +
                           # phím tắt + vòng cooldown (conic-gradient) + khóa
                           # nếu chưa mở khóa trong skill tree; đọc cooldown
                           # từ `world` store, đọc icon/tên từ `skills` module
      PanelShell.tsx      # khung modal dùng chung cho mọi panel, có GSAP
                          # enter/exit (slide + fade) khi mở/đóng
      PauseOverlay.tsx     # overlay "Tạm Dừng" khi `world` store có
                           # `paused: true` — bảng chú thích phím + nút Tiếp
                           # Tục / Về Sảnh Chờ. Phím `P` gọi `setPaused` đã bị
                           # gỡ khỏi `scene.ts` (2026-08-11, xem mục "Chiến đấu")
      CharacterStatusBar.tsx  # thanh trạng thái, avatar bust + tên/cấp + HP/
                              # NL/EXP góc trên trái — đọc trực tiếp từ `world`
                              # store (giá trị runtime, không phải tĩnh)
      Radar.tsx           # minimap tròn góc dưới phải, có tia quét
                          # (conic-gradient xoay liên tục qua .animate-radar-sweep),
                          # chấm quái (blips) màu theo tier: thường/tinh anh/boss
      HudShell.tsx         # ráp GameCanvas + toàn bộ HUD lại, tính avatar
                           # thường/sublimation + **stats hiệu lực = base +
                           # bonus trang bị** (`mergeStatBonus`), iris-wipe khi
                           # vào trận, nhận `onExitToLobby` từ `page.tsx`

  modules/
    character/            # định danh môn phái, nhân vật người chơi
      types.ts             # CharacterClassId, CharacterClassConfig (có
                            # coverImage/inGameSprite/inGameSublimation), PlayerCharacter
      data.ts               # CHARACTER_CLASSES (3 môn phái, đã gắn ảnh thật)
      store.ts              # zustand, persist localStorage: nhân vật hiện tại
      components/
        ClassCard.tsx        # thẻ bài chọn môn phái — ảnh coverImage, tilt 3D
                              # theo con trỏ chuột + glare (GSAP quickTo, xem
                              # lưu ý rotationX/Y ở mục Animation), pulse khi chọn
        CharacterPreview.tsx  # DORMANT cùng LobbyScreen (mục 0) — preview
                              # lớn, zoom-in khi mount, toggle "Bình Thường"/
                              # "Đại Thành" crossfade giữa inGameSprite/
                              # inGameSublimation + flash nhẹ khi đổi form +
                              # glow nền lặp vô hạn

    stats/                 # 10 chỉ số combat cụ thể + logic roll
      types.ts              # StatId, StatBlock, StatDef (có unit, barMax)
      data.ts                # STAT_DEFS, STAT_RANGES theo class, rollStatBlock,
                             # mergeStatBonus(base, bonus) — cộng bonus trang
                             # bị vào base stats, làm tròn đúng `decimals`
      components/
        StatBar.tsx           # 1 dòng chỉ số (thanh progress, tự scale theo barMax)
        StatsPanel.tsx        # panel "Chỉ Số" — dùng ở cả HUD lẫn Sảnh Chờ

    skills/                # skill tree theo môn phái — nguồn "sự thật" cho
                           # tên/mô tả/icon/trạng thái mở khóa của skill1/
                           # skill2/ultimate; số liệu combat (damage/cooldown/
                           # tầm bắn) tách riêng ra `modules/combat`
      types.ts              # SkillNode, SkillNodeType
      data.ts                # SKILL_TREES theo class + getPassiveSkill/getUltimateSkill
      store.ts               # zustand, persist: skill đã mở, điểm kỹ năng —
                             # nguồn điểm kỹ năng: giết quái
                             # (`addSkillPoints`, gọi từ `world/scene.ts`)
      components/
        SkillTreePanel.tsx    # panel "Kỹ Năng" — cây kỹ năng theo tầng, banner
                              # "Đại Thành" khi mở khóa tối thượng, GSAP pop-in

    inventory/              # đồ đạc / balo / trang bị
      types.ts               # InventoryItem (+ `slot?`, `statBonus?` cho vật
                             # phẩm trang bị được), ItemRarity, EquipSlot
                             # ("weapon"/"armor"/"accessory")
      data.ts                 # STARTER_INVENTORY theo class — vũ khí/giáp
                             # khởi đầu đã gắn `slot`+`statBonus`, còn lại
                             # (đan dược...) là tiêu hao, không có `slot`
      store.ts                # zustand, persist: danh sách item + `equipped`
                             # (item id theo từng slot), action
                             # equipItem/unequipSlot; export hàm thuần
                             # `getEquipmentBonus(state)` gộp statBonus của
                             # mọi item đang trang bị
      components/
        InventoryPanel.tsx     # panel "Balo" trong HUD — lưới 12 ô
        EquipmentPanel.tsx      # 3 ô trang bị (Vũ Khí/Giáp/Phụ Kiện) + danh
                                # sách item trang bị được — dùng trong tab
                                # "Trang Bị" của Sảnh Chờ

    combat/                 # số liệu chiến đấu — quái + ability, KHÔNG chứa
                            # component/Phaser code (logic thật chạy trong
                            # `world/scene.ts`, module này chỉ là data)
      types.ts               # MonsterConfig (spawnCount = TRẦN số lượng
                             # cùng lúc, không phải số lượng ban đầu),
                             # CombatAbility (+`healRatio?` cho kind "heal"),
                             # CombatLoadout, AbilityKind ("bolt" bay thẳng,
                             # "burst" nổ tức thời tại vị trí mục tiêu, gần
                             # nhất trong tầm, "ultimate" nổ quanh thân, "heal"
                             # hồi máu — không cần mục tiêu)
      data.ts                 # MONSTER_CONFIGS (ghost/skull/spider, hp/dmg là
                             # baseline cấp 1), HEAL_POTION (ability dùng
                             # chung mọi class, phím U), COMBAT_LOADOUTS theo
                             # class — `skill1`/`skill2`/`ultimate` dùng chung
                             # `id` với `SkillNode` tương ứng

    world/                  # thế giới game (Phaser canvas) — sở hữu toàn bộ
                            # logic combat runtime (di chuyển, auto-target,
                            # quái, đạn, va chạm, HP, cấp độ, wave spawner)
      actor.ts                 # class `Actor` DÙNG CHUNG cho player + mọi
                                # quái: container + ảnh billboard + bóng đổ,
                                # `update(dt, moveAngle)` xoay cả frame theo
                                # hướng di chuyển (giữ nguyên khi đứng yên) +
                                # nảy kiểu slime (squash-and-stretch theo
                                # `Math.abs(sin(hopPhase))`) — xem mục 1
      types.ts                # WorldPlayerState (x/y/angle-theo-di-chuyển/hp/
                              # maxHp/level/exp/expToNext), WorldBlip,
                              # AbilityCooldownState, kích thước world
      store.ts                 # zustand (KHÔNG persist) — vị trí/facing/HP/
                                # cấp/exp player, blips quái, cooldown ability,
                                # `paused` (đọc/ghi từ cả scene lẫn PauseOverlay
                                # — scene subscribe để pause/resume tweens theo)
      scene.ts                  # createMainScene({classId, classColor,
                                # spriteUrl, stats}) — factory tạo Phaser.Scene:
                                # WASD di chuyển, auto-attack tự nhắm quái gần
                                # nhất (`findNearestMonster`). **Cập nhật
                                # 2026-08-11**: phím J/K/L (skill)/U (Bình
                                # Máu)/P (pause) đã bị gỡ — scene giờ thuần di
                                # chuyển, `attemptFireGated()` (chỉ phục vụ 3
                                # phím skill) cũng đã xóa theo. Spawn quái
                                # theo WAVE (không còn spawn cố định + hồi
                                # sinh riêng lẻ — xem mục "Chiến đấu"), cấp
                                # quái = cấp người chơi + offset theo tier, cấp
                                # người chơi tăng qua EXP (giết quái)
      maps/                      # mỗi map là 1 module riêng — KHÔNG BAO GIỜ
                                 # "demo". `types.ts` (MapModule/SubjectConfig/
                                 # DialogueLine), `start.ts` (map hiện tại: grid,
                                 # obstaclesByCell, subjectsByCell với
                                 # `company.png` + thoại 3 dòng, music
                                 # `start.mp3`, showTutorial: true), `index.ts`
                                 # (MAP_MODULES/MAP_ORDER — thêm map mới = thêm
                                 # module + 1 dòng ở đây, không sửa `MapScreen`)
      mapProgress.ts              # zustand + persist (giống pattern
                                  # `character`/`inventory`/`skills` store):
                                  # `currentMapId`/`furthestMapId` — "map nào
                                  # nhân vật đã đi đến" được lưu ở đây
      useMapMusic.ts               # hook loop nhạc nền theo map qua `<audio>`
                                   # React thuần (KHÔNG phải Phaser sound
                                   # manager — `MapCanvas` destroy/recreate mỗi
                                   # lần đổi phòng, nhạc Phaser sẽ bị restart).
                                   # Keyed theo `mapKey` (map id), chỉ restart
                                   # khi đổi MAP chứ không phải đổi phòng
      liveHud.ts                   # zustand (KHÔNG persist) — level/exp/
                                   # expToNext cho `ExperienceBar`/`LiveHudBar`
                                   # của luồng LIVE, TÁCH BIỆT `store.ts` (đó
                                   # là của combat DORMANT)
      mapGrid.ts                  # THUẦN DATA/LOGIC (không Phaser) — parse
                                  # grid tác giả viết tay dạng
                                  # `GridSymbol[][]` (0=chặn, 1=phòng thường,
                                  # "X"=start, "B"=boss, "S"=đặc biệt,
                                  # "?"=chưa mở/fog) thành `ParsedGridMap`,
                                  # `getCellWalls(map,row,col)` tự suy ra 4
                                  # cạnh mở/chặn của 1 ô từ ô lân cận có tồn
                                  # tại hay không (không cấu hình tường thủ
                                  # công nữa), `generateRandomGridMap()` sinh
                                  # ngẫu nhiên (random walk + đặt boss ở ô xa
                                  # nhất) — chưa dùng làm mặc định, xem mục
                                  # "Luồng mở đầu mới". `MAX_GRID_SIZE = 10`.
      mapScene.ts            # createMapScene({floorSrc, spriteUrl,
                                 # walls, wallSrc, tint?, obstacles?,
                                 # roomScale?, spawnAt, onReachEdge}) —
                                 # Phaser.Scene RIÊNG, KHÔNG dùng chung với
                                 # `scene.ts` (không có combat/store/cấp độ,
                                 # chỉ WASD + `Actor` + sàn TileSprite + tường
                                 # + vật cản tĩnh). Kích thước phòng = canvas
                                 # thật × `roomScale` (mặc định 1.5, truyền
                                 # được — chuẩn bị sẵn cho map to/nhỏ khác
                                 # nhau sau này), tính lại mỗi lần `create()`
                                 # từ `this.scale.width/height`. Camera tự
                                 # zoom ra nhẹ khi gần biên bất kỳ
                                 # (`ZOOM_NEAR_EDGE`) để thấy rộng hơn + gợi ý
                                 # "còn gì đó ngoài biên". Biên nào
                                 # `walls[edge]` không phải `true` thì gọi
                                 # `onReachEdge(edge)` khi tới gần (map link,
                                 # xem mục "Luồng mở đầu mới"); biên có tường
                                 # thì render `wallSrc` (`TileSprite`, CHỈ ở
                                 # cạnh đó — không phải viền toàn phòng) và
                                 # chỉ clamp di chuyển, không sự kiện gì.
                                 # `obstacles` (`ObstacleConfig[]`, vị trí
                                 # theo tỉ lệ `xFrac`/`yFrac`) là vật cản
                                 # KHÔNG ở biên — va chạm tách trục X/Y
                                 # (`isBlockedByObstacle`) để trượt dọc vật
                                 # cản thay vì đứng khựng; chưa có
                                 # `spriteSrc` thì fallback hình chữ nhật xám.
                                 # `walls` do `MapScreen` tính sẵn qua
                                 # `getCellWalls()` rồi truyền vào — file này
                                 # không biết gì về khái niệm "grid".
      components/
        GameCanvas.tsx           # mount/unmount Phaser.Game (client-only),
                                 # nhận classId/classColor/spriteUrl/stats từ
                                 # HudShell (stats đã gồm bonus trang bị)
        MapCanvas.tsx         # mount/unmount Phaser.Game cho
                                  # `mapScene.ts`, props riêng (floorSrc/
                                  # spriteUrl/walls/wallSrc/tint/obstacles/
                                  # roomScale/spawnAt/onReachEdge), KHÔNG dùng
                                  # chung với GameCanvas vì scene/props khác
                                  # hẳn. Đo `container.clientWidth/
                                  # clientHeight` thật để tạo `Phaser.Game`
                                  # thay vì truyền chuỗi
                                  # `"100%"` — truyền `"100%"` cho Scale
                                  # config chỉ resolve 1 lần lúc boot, nếu
                                  # container chưa layout xong lúc đó thì
                                  # canvas bị khóa ở size nhỏ hơn thật, để lộ
                                  # 1 dải nền đen — bug đã gặp và sửa, xem mục
                                  # 5. Có thêm listener `window resize` gọi
                                  # `game.scale.resize()` để luôn khớp.

.claude/
  skills/wulin-design/SKILL.md  # quy ước bắt buộc: thiết kế, animation, cách
                                 # thêm class/skill/vật phẩm mới — đọc trước
                                 # khi làm việc trên phần gameplay/UI
```

**Nguyên tắc**: type & component riêng của một domain (VD: `StatBar` chỉ
`stats` module cần) thì nằm trong `modules/<domain>`. Cái gì là khung/HUD gộp
nhiều module lại (menu, thanh trạng thái, radar, panel shell, lobby, backdrop…)
thì nằm ở `src/app/component`. Trang nào cần gì thì import thẳng từ module đó
— không có một "god store" chung. `combat` là domain thuần data (giống
`stats`/`skills`) — component/logic Phaser thật thuộc về `world` vì đó là nơi
canvas thực sự chạy.

## 3. Đã có (tính đến bản này)

### Luồng mở đầu mới (`IntroExperience`) — toàn bộ `page.tsx`, đúng 3 màn
- **UI của cả luồng này dùng tiếng Anh, cỡ chữ lớn hơn bản đầu** (đổi
  2026-08-11 theo yêu cầu rõ ràng) — khác với phần Sảnh Chờ/combat DORMANT
  (vẫn tiếng Việt, không đụng tới vì không hiển thị cho người chơi). Thêm
  string UI mới cho luồng mở đầu thì viết tiếng Anh, cỡ chữ tối thiểu
  `text-sm`/`text-base` cho text phụ, `text-5xl`+ cho tiêu đề — đừng lặng lẽ
  quay lại tiếng Việt hay cỡ chữ nhỏ.
- **`TapToStartScreen`**: màn hình tiêu đề tối giản, chỉ có tên game + chữ
  "Tap to Start" nhấp nháy (`animate-pulse`). Không có menu/option nào khác.
- **`StoryIntroScreen`**: ảnh nổ full-bleed (`public/story/
  explode_introduction.png`) + rung màn hình khi vào (GSAP timeline dịch
  chuyển x/y giảm dần theo từng bước, KHÔNG dùng `"random(...)"` string của
  GSAP để giữ hiệu ứng xác định/dễ debug), sau đó 3 dòng lời dẫn chuyện (tiếng
  Anh) fade in từng dòng, cuối cùng hiện chữ "Tap to continue".
- **Input "tap anywhere" cho cả 2 màn trên** — quy ước chung, đừng phá khi sửa:
  bấm/chạm **bất kỳ đâu trên màn hình** (không cần trúng chữ) HOẶC nhấn
  **Space** đều kích hoạt. `TapToStartScreen` là 1 `<button>` phủ hết màn hình
  nên click tự nhiên hoạt động; `StoryIntroScreen` gắn `onClick` trên root
  `<div>` (chỉ bật sau khi `showPrompt` = true, tránh bỏ qua lời dẫn chuyện
  sớm) chứ không phải trên riêng dòng chữ. Cả hai đều có thêm 1
  `window.addEventListener("keydown", ...)` bắt `e.code === "Space"`.
- **Chuyển cảnh "chớp mắt"**: sở hữu bởi `IntroExperience` (không phải
  `StoryIntroScreen`) vì nó phải phủ lên CẢ 2 màn hình trước/sau — 2 `div`
  nửa màn hình neo top/bottom (`origin-top`/`origin-bottom`), animate
  `scaleY` 0→1 (nhắm mắt, phủ kín màn hình) → đổi `stage` React ẩn phía sau →
  `scaleY` 1→0 (mở mắt, lộ ra nội dung mới). Đây là kiểu chuyển cảnh RIÊNG,
  khác với iris-wipe (`HudShell`, vào combat) hay fade phẳng (đổi phòng, xem
  dưới) — mỗi kiểu chuyển cảnh dùng đúng chỗ nó được thiết kế cho, đừng dùng
  lẫn.
- **`TutorialOverlay`**: callout to hơn, hiện CẢ 2 cụm phím (WASD + mũi tên
  ↑↓←→) dưới nhãn "Move" (đổi 2026-08-11, trước đó chỉ 1 dòng chữ). Tự fade
  sau ~6s (`AUTO_DISMISS_MS`), hoặc tap vào là tắt ngay (cả panel là 1 vùng
  bấm được). `MapScreen` chỉ render nó khi `MapModule.showTutorial` là
  `true` — hiện tại chỉ map `start` có tutorial.
- **`MapScreen` = "game" hiện tại — render đúng 1 map MODULE, không phải
  "demo"** (đổi 2026-08-11: mỗi map giờ là 1 file riêng dưới
  `modules/world/maps/`, hardcode toàn bộ nội dung của đúng map đó — grid,
  vật cản, vật thể cốt truyện, nhạc, tutorial — xem `modules/world/maps` ở
  mục Kiến trúc thư mục). `MapScreen` đọc `currentMapId` từ
  `useMapProgressStore` (persist, mặc định `"start"`) rồi lấy đúng module từ
  `MAP_MODULES`. Nhân vật là `dog` (`ingame/dog.png`), dùng chung `Actor` y
  hệt player/quái trong combat world (xoay theo hướng WASD + nảy slime) —
  KHÔNG có stats, skill, combat, hay liên hệ gì với `character` store.
  - **Cấu hình bằng 1 lưới 2 chiều** (`grid` trong `modules/world/maps/
    start.ts`, kiểu `GridSymbol[][]`): `0` = ô trống/chặn, `1` = phòng
    thường, `"X"` =
    điểm bắt đầu (bắt buộc đúng 1 ô), `"B"` = phòng boss, `"S"` = phòng đặc
    biệt, `"?"` = phòng chưa mở/fog. `parseGridMap()` (`mapGrid.ts`) đọc lưới
    này, tìm ô `"X"` làm vị trí xuất phát. **Không cấu hình tường thủ công
    cho từng phòng nữa** — `getCellWalls(map, row, col)` tự soi 4 ô lân cận
    trong lưới: ô nào tồn tại (trong biên lưới và khác `0`) thì cạnh đó MỞ
    (link được); ô nào không tồn tại thì cạnh đó bị chặn (kẹt lại, không sự
    kiện gì). Đúng ý "chỉ cần cấu hình map lớn, map con tự biết chặn
    tường/di chuyển thế nào".
  - **Cạnh bị chặn giờ CÓ art tường thật** (đổi 2026-08-11 — trước đó cố tình
    không có art nào cả) — `mapScene.ts` chỉ render `TileSprite` tường
    (`wallSrc`, mặc định `ground/log_wall.png`) ở ĐÚNG những cạnh có
    `walls[edge] === true`, không phải viền quanh toàn map như thiết kế rất
    đầu. `MapScreen` chọn `wallSrc` khác nhau theo loại phòng — VD phòng boss
    dùng `ground/lava_wall.png` — nên khi thêm loại phòng mới muốn tường khác
    kiểu, chỉ cần đổi biểu thức tính `wallSrc`, không phải sửa `mapScene.ts`.
    Vùng đi lại được (`playMinX`/`playMaxX`/...) tự trừ thêm bề dày tường
    (`WALL_THICKNESS`) ở cạnh có tường, cạnh mở thì vẫn chỉ trừ `INSET` như
    cũ. (`ground/fire_wall.gif` — file GIF — cũng dùng được nhưng sẽ KHÔNG
    animate qua `Phaser.load.image`, coi như ảnh tĩnh.)
  - **Vật cản tĩnh trong phòng** (`ObstacleConfig`, mới) — chặn di chuyển
    KHÔNG cần nằm ở biên phòng. Vị trí khai báo theo **tỉ lệ** `xFrac`/`yFrac`
    (0-1 theo chiều rộng/cao phòng, không phải pixel cứng) để giữ đúng vị trí
    tương đối dù phòng đổi kích thước theo `roomScale`/viewport. Chưa có art
    riêng thì tự fallback về hình chữ nhật xám bo góc (đúng quy ước fallback
    của dự án — không sập, không chặn tiến độ chờ art). Va chạm tách trục
    X/Y (`isBlockedByObstacle`) nên đụng vật cản thì trượt dọc theo nó thay
    vì đứng khựng lại. Mỗi map module có `obstaclesByCell` (map theo
    `"row-col"`) — map `start` có 2 vật cản (chưa có art riêng, fallback hình
    chữ nhật xám) trong phòng bắt đầu (`"0-1"`).
  - **Vật thể cốt truyện (`SubjectConfig`, mới 2026-08-11)** — mở rộng
    `ObstacleConfig` (chặn di chuyển y hệt), thêm `dialogue?: DialogueLine[]`
    tùy chọn: nếu có, bắn 1 lần duy nhất qua `DialogueBox` khi người chơi tới
    đúng phòng chứa nó lần đầu (theo dõi bằng 1 `Set` session trong
    `MapScreen`, không persist). Khai báo ở `subjectsByCell` của map module.
    VD hiện có: `company.png` (tòa nhà "Future Tech" đổ nát,
    `public/subject/company.png`) đặt ở phòng bắt đầu map `start`, kể 3 dòng
    thoại về việc nhân vật bị đẩy về Wulin từ thế giới tương lai đổ nát —
    cùng hình ảnh với vụ nổ ở `StoryIntroScreen`.
  - **`DialogueBox`**: hộp thoại wuxia (giấy da gradient, viền mực đôi
    `#7a5230`), portrait tròn + tên đặt bên trái hoặc phải theo
    `DialogueLine.side` (mô phỏng hội thoại 2 phía đối mặt nhau), tap bất kỳ
    đâu hoặc Space để qua dòng tiếp — cùng quy ước tap-anywhere như
    `TapToStartScreen`/`StoryIntroScreen`. Component dùng chung, không đặc
    thù riêng map nào.
  - **Nhạc nền theo map, loop qua `useMapMusic(playlist, mapKey)`** (mới
    2026-08-11, `modules/world/useMapMusic.ts`) — dùng `<audio>` React thuần,
    KHÔNG phải Phaser sound manager, vì `MapCanvas` bị destroy/recreate mỗi
    lần đổi phòng (`key` theo `"row-col"`) nên nhạc do Phaser quản sẽ bị
    restart mỗi lần đổi phòng trong CÙNG 1 map. Hook mount ở `MapScreen`
    (ngoài subtree theo phòng), chỉ restart khi `mapKey` (map id) thực sự
    đổi; hết bài (`onended`) tự chuyển bài kế tiếp trong `music`, quay vòng
    lại đầu playlist. Map `start` hiện có 1 bài (`start.mp3`, loop chính nó).
  - **Đi sát 1 cạnh mở** → `MapScreen.handleReachEdge(edge)` tính ô lân cận
    qua `neighborCoords()`, fade đen toàn màn hình (GSAP opacity, KHÔNG phải
    chớp mắt) → đổi `position` sang ô đó + đánh dấu `visited` + tính
    `spawnAt` = cạnh ĐỐI DIỆN (`OPPOSITE_EDGE`, đủ cả 4 cặp `left↔right`/
    `up↔down`) → remount `MapCanvas` (prop `key` đổi theo `"row-col"`, tự tạo
    Phaser.Game mới ở phòng mới, xuất hiện đúng cạnh đối diện — cảm giác các
    phòng nối liền nhau) → fade mở ra.
  - **Sàn đổi luân phiên dirt/grass theo `(row+col)%2`** (chỉ cho vui mắt,
    không mang ý nghĩa gì); **phòng boss/đặc biệt có lớp phủ màu trong suốt**
    (đỏ/tím, `this.add.rectangle(...).setDepth(1)` phía trên sàn) để phân
    biệt ngay khi bước vào. **Lưu ý đã gặp bug**: đừng dùng
    `TileSprite.setTint()` cho việc này — tint nhân màu (multiply) trên
    texture nhiều màu như dirt/grass ra kết quả rất mờ/lem, gần như không
    thấy được; overlay trong suốt (alpha ~0.3) rõ ràng và dễ đoán màu hơn
    nhiều, xem mục Animation.
  - **`generateRandomGridMap(rows, cols, roomCount?)`** (`mapGrid.ts`) sinh
    lưới ngẫu nhiên bằng random walk (carve phòng liên thông từ 1 điểm bắt
    đầu ngẫu nhiên), đặt boss ở phòng xa nhất (BFS theo số bước), rải 1-2
    phòng đặc biệt — **CHƯA được dùng làm mặc định**, map module `start` vẫn
    dùng `grid` viết tay để test dễ đoán trước; đổi 1 dòng gọi hàm này thay
    `grid` tĩnh là dùng được ngay. `MAX_GRID_SIZE = 10` (cả 2 chiều) — mốc
    mềm, không phải giới hạn kỹ thuật cứng.
  - **`GridMinimap`** — phong cách giấy da/cuộn thư wuxia (đổi 2026-08-11,
    trước đó dark-zinc): gradient tông đất `#e2c98d`→`#c9a865`, viền mực
    `#5c3a21`. Góc trên phải, KHÔNG có tia quét (khác `Radar` combat vì đây
    là bản đồ tĩnh chứ không phải blip sống). Luôn giữ khung hiển thị
    **tối thiểu 5×5 ô** (`MIN_GRID`) dù lưới thật nhỏ hơn — ô thừa render rỗng
    — để minimap không bị co lại tí hin trên map nhỏ và giữ kích thước ổn
    định khi map lớn dần. **Bấm vào minimap để phóng to**, mở ra dạng "cuộn
    thư mở" (2 thanh gỗ tối bo tròn kẹp trên/dưới panel giấy da) — `GridCells`
    tách riêng, dùng lại y hệt cho bản nhỏ góc màn hình lẫn overlay phóng to
    giữa màn hình, chỉ khác `cellSize` — bấm ra ngoài overlay hoặc nút X để
    đóng. Ô chưa `visited` hiện tối, ẩn loại phòng thật (boss/đặc biệt không
    bị lộ trước khi tới, trừ `"unknown"` luôn hiện `?` vì đó chính là ý nghĩa
    của
    loại phòng này); ô đã `visited` hoặc đang đứng thì lộ icon thật
    (`Skull`=boss màu đỏ, `Gem`=đặc biệt màu tím); ô hiện tại có viền vàng +
    chấm sáng giữa ô.
  - **Camera**: mỗi phòng rộng `roomScale` (mặc định 1.5×, giờ là tham số có
    thể truyền vào `MapCanvas`/`createMapScene` — chuẩn bị sẵn cho việc cần
    map to/nhỏ khác nhau sau này, không hardcode nữa) × kích thước canvas
    thật — tính lại mỗi lần vào phòng từ `this.scale.width/height`. Camera
    tự zoom ra nhẹ (`ZOOM_NEAR_EDGE` = 0.8, lerp mượt) khi nhân vật đến gần
    BẤT KỲ cạnh nào (dù cạnh đó mở hay chặn) để thấy rộng hơn + gợi cảm giác
    "còn gì đó ngoài kia", zoom về 1.0 khi ở giữa phòng.
- **HUD dưới cùng cho luồng LIVE** (mới 2026-08-11, `ExperienceBar` +
  `LiveHudBar`, `src/app/component/`) — KHÔNG liên quan tới mục "HUD" bên
  dưới (đó là HUD của Sảnh Chờ/combat DORMANT). `ExperienceBar`: 1 line full
  width, fixed đáy màn hình, thanh EXP tông vàng-nâu. `LiveHudBar`: panel
  wuxia ngay trên thanh EXP, hiện cấp độ (`Cấp {level}`) + 3 ô **Kỹ Năng /
  Nhân Vật / Thú Cưỡi** — cả 3 hiện đều khóa (opacity + icon khóa + tooltip
  "Chưa mở khoá" khi hover, tái dùng đúng pattern của `AbilitySlot` trong
  `AbilityBar` DORMANT) vì chưa hệ thống nào trong số đó được nối vào luồng
  LIVE. Dữ liệu đọc từ `modules/world/liveHud.ts` (`useLiveHudStore`, KHÔNG
  persist, TÁCH BIỆT `world/store.ts` của combat DORMANT) — mặc định cấp 1 /
  0 EXP, chưa có nguồn nào cộng EXP (việc đó chờ combat/exploration thật
  được nối vào).

### Sảnh Chờ (Lobby) — DORMANT, xem mục 0
`LobbyScreen` (2 tab "Nhân Vật"/"Trang Bị" + nút "Vào Trận" → `HudShell`) vẫn
hoạt động về mặt code (`character`/`skills`/`inventory`/`stats` module vẫn có
nguyên) nhưng **không còn màn nào dẫn vào nó nữa** kể từ khi
`CharacterCreationScreen` (màn chọn crane/dragon/tiger) bị xóa — trước đó nó
là bước duy nhất tạo ra `character` để `LobbyScreen` có dữ liệu hiển thị. Chi
tiết hành vi (roll chỉ số, tab, trang bị...) không lặp lại ở đây nữa — đọc
trực tiếp code nếu cần hồi sinh flow này sau này.

### Thế giới / di chuyển
- Canvas Phaser 4, world 3000×3000, nền lưới kẻ ô sinh bằng texture procedural
  (không cần asset ảnh).
- **Di chuyển: WASD**, 8 hướng, vector chuẩn hóa. Tốc độ thật lấy trực tiếp từ
  chỉ số **Tốc Độ Di Chuyển** của nhân vật (`stats.moveSpeed`, KHÔNG scale
  theo cấp — xem mục Chiến đấu). Mặc định 200px/s nếu thiếu
  (`DEFAULT_PLAYER_SPEED` trong `modules/world/scene.ts`).
- **Class `Actor`** (`modules/world/actor.ts`) là nền cho MỌI nhân vật hiển
  thị trong world (player + từng quái): container + ảnh billboard + bóng đổ,
  gọi `actor.update(dt, moveAngle)` mỗi frame — `moveAngle` là hướng di
  chuyển hiện tại (radian) hoặc `null` nếu đứng yên. Actor tự:
  - Xoay cả frame ảnh theo `moveAngle`, **giữ nguyên hướng cuối khi đứng
    yên** (không snap về 0).
  - Nảy kiểu slime khi đang di chuyển (squash-and-stretch theo
    `Math.abs(sin(hopPhase))`), bóng đổ co giãn theo độ nảy.
  - Fallback hình khối màu (chấm + mũi tên) nếu texture chưa load được —
    không cần sửa code khi thiếu asset.
- **Ảnh nhân vật/quái được nạp qua Next.js Image Optimizer**
  (`optimizedSpriteUrl()` trong `modules/world/scene.ts`, gọi `/_next/image?
  url=...&w=256`) thay vì nạp thẳng file gốc — file gốc trong `public/` có độ
  phân giải rất lớn (1-3MB), nếu để Phaser tự downscale trực tiếp xuống vài
  chục px thì ảnh bị mờ/nhoè. Route qua optimizer để server resize gần với
  kích thước hiển thị thật trước, ảnh nét hẳn. **Khi thêm ảnh nhân vật/quái
  mới, không cần lo việc này — cứ thả ảnh gốc độ phân giải cao vào `public/`,
  scene tự tối ưu.**
- Camera bám nhân vật (`startFollow`, có lerp), luôn hướng Bắc cố định.
- Vào trận có hiệu ứng **iris wipe** (vòng tròn mở dần từ giữa màn hình bằng
  `clip-path: circle(...)`, GSAP) thay cho fade phẳng.

### Chiến đấu — wave quái, auto-target, cấp độ
- **Wave spawner** (thay hoàn toàn spawn cố định + hồi sinh riêng lẻ của bản
  trước): cứ mỗi `WAVE_INTERVAL_MS` (8s) lại spawn một đợt quái ngay ngoài rìa
  camera (vòng quanh người chơi), số lượng tăng dần theo số wave đã qua (trần
  `WAVE_SIZE_CAP`). Tỉ lệ loại quái trong mỗi đợt ưu tiên ghost, thỉnh thoảng
  skull, hiếm khi spider — và **không bao giờ vượt trần đồng thời** của từng
  loại (`MonsterConfig.spawnCount`, giờ là trần số lượng cùng lúc chứ không
  phải số lượng ban đầu).
- **Quái luôn lao thẳng vào người chơi** ngay khi xuất hiện — không còn khái
  niệm lang thang/tầm phát hiện/dây xích như bản trước, đúng tinh thần
  survivor.io. Tốc độ khác nhau theo loại (`MonsterConfig.moveSpeed`) tạo cảm
  giác "con nhanh con chậm".
- **Auto-target**: đòn thường + skill1/skill2/ultimate đều tự nhắm **quái còn
  sống gần người chơi nhất** (`findNearestMonster()`), không cần thao tác
  ngắm. Nếu không có quái nào còn sống, ability không bắn và KHÔNG bị trừ
  cooldown (đợi có mục tiêu mới thật sự dùng). `kind`:
  `"bolt"` (đạn bay thẳng theo hướng mục tiêu tại thời điểm bắn, xuyên được
  nếu `piercing: true`), `"burst"` (nổ tức thời tại vị trí mục tiêu, trong
  tầm `range`), `"ultimate"` (nổ quanh thân người chơi), `"heal"` (hồi máu,
  không cần mục tiêu — chỉ `HEAL_POTION`). **Lưu ý 2026-08-11**: phím kích
  hoạt skill1/skill2/ultimate/Bình Máu (`J`/`K`/`L`/`U`) đã bị gỡ khỏi
  `scene.ts` — mô tả `kind` ở trên vẫn đúng về mặt data/logic bắn, chỉ là
  hiện KHÔNG còn phím nào gọi tới chúng (chỉ đòn thường vẫn tự bắn).
- **Cấp độ — cả người chơi lẫn quái, không giới hạn**:
  - Người chơi: giết quái → cộng EXP (`MonsterConfig.expReward`) vào
    `playerExp`; đủ `expToNext` (công thức `20 * level^1.35`, tăng dần) thì
    lên cấp, hồi 1 phần máu. Cấp làm tăng Máu tối đa và sát thương gây ra
    (`levelMultiplier() = 1 + (level-1) * 6%`) — **không** ảnh hưởng tốc độ di
    chuyển (giữ nguyên theo `moveSpeed` roll được). Đây là tiến triển **runtime
    trong ván chơi** (sống trong `world` store, KHÔNG persist, KHÔNG ghi đè
    lên `character.level`/`exp` đã roll) — vào trận mới lại bắt đầu từ cấp 1.
  - Quái: cấp = cấp người chơi hiện tại + offset theo tier — **quái thường
    ngang cấp, tinh anh +3 cấp, boss +7 cấp** (`TIER_LEVEL_OFFSET`). HP tăng
    ~15%/cấp, sát thương chạm tăng ~8%/cấp so với baseline cấp 1 trong
    `MONSTER_CONFIGS`. Kích thước cũng lớn hơn theo tier (baseline
    `displaySize` trong data, không đổi theo cấp). Cấp quái hiện dưới dạng
    "Lv.N" phía trên thanh máu mỗi con.
- Trúng đòn: hiện số sát thương bay lên (Phaser text + tween), quái chớp
  trắng 1 khung (`actor.flashTint()`). Hết máu: tween thu nhỏ + mờ dần rồi bị
  xóa hẳn khỏi world (không hồi sinh riêng lẻ nữa — đợt wave tiếp theo sẽ bù
  lại), thưởng điểm kỹ năng + EXP.
- Quái chạm vào người chơi thì gây sát thương theo tick (`contactDamage`,
  0.5s/lần, đã scale theo cấp quái). HP người chơi là giá trị **runtime**
  (khởi tạo bằng `stats.hp * levelMultiplier()`, sống trong `world` store qua
  `WorldPlayerState.hp`) — về 0 thì hồi sinh tại tâm bản đồ, hồi đầy máu, có
  1.2s bất tử.
- **`AbilityBar`** (HUD, phía trên Radial Menu): 4 ô skill1/skill2/ultimate/
  Bình Máu — khóa xám + icon ổ khóa nếu skill tương ứng trong skill tree chưa
  mở (Bình Máu luôn mở, không thuộc skill tree), mỗi ô có vòng cooldown tối
  dần bằng `conic-gradient` đồng bộ từ `world` store, nhãn phím tắt hiện trên
  từng ô nhưng KHÔNG còn phím nào thật sự bắn được chúng nữa (xem lưu ý
  2026-08-11 ở mục "Chiến đấu" phía trên). 2 ô cuối (I/O) hiện khóa cố định —
  chưa có vật phẩm gắn vào, xem Roadmap.

### Trang bị
- `InventoryItem` có thêm `slot?: "weapon"|"armor"|"accessory"` và
  `statBonus?: Partial<StatBlock>` — chỉ vũ khí/giáp khởi đầu của mỗi môn
  phái có 2 field này (VD: Cung Trúc Cũ +6 Sát Thương Vật Lý), vật phẩm tiêu
  hao (đan dược...) thì không.
- `inventory` store thêm `equipped: Record<EquipSlot, string|null>` +
  `equipItem`/`unequipSlot`; hàm thuần `getEquipmentBonus(state)` gộp
  `statBonus` của mọi item đang trang bị thành 1 `Partial<StatBlock>`.
- `HudShell` và `LobbyScreen` đều tự tính **stats hiệu lực = base stats +
  bonus trang bị** (`mergeStatBonus`) trước khi đưa vào `GameCanvas`/
  `StatsPanel` — trang bị ảnh hưởng combat thật, không chỉ hiển thị.
- `EquipmentPanel` (tab "Trang Bị" trong Sảnh Chờ): 3 ô slot (bấm vào ô đã
  trang bị để tháo ra) + danh sách item trang bị được (bấm để trang bị).

### HUD
- **Thanh trạng thái** (góc trên trái): avatar bust thật, tên, **cấp độ sống
  (runtime)**, thanh HP (runtime)/Nội Lực/EXP (thanh mảnh riêng dưới NL).
- **Radar** (góc dưới phải): minimap tròn, chấm quái (màu theo tier: xám=
  thường, cam=tinh anh, đỏ=boss) + hướng nhân vật, có tia quét xoay liên tục
  (conic-gradient, `.animate-radar-sweep`), tự build bằng Tailwind.
- **AbilityBar** (giữa dưới, trên Radial Menu): xem mục Chiến đấu.
- **Radial Menu** (góc dưới giữa): nút trung tâm có breathing glow
  (`animate-ping`) mời gọi khi đóng, bung ra 3 nút Balo / Chỉ Số / Kỹ Năng
  theo cung tròn.
- **Panel** (Balo / Chỉ Số / Kỹ Năng): mở dạng modal góc trên phải, có
  animation trượt vào/ra bằng GSAP (`PanelShell`), dữ liệu lấy trực tiếp từ
  store của module tương ứng (Chỉ Số hiện stats **đã gồm bonus trang bị**).
- **PauseOverlay**: dim toàn màn hình, thẻ "Tạm Dừng" liệt kê chú thích phím,
  nút "Tiếp Tục" (resume) và "Về Sảnh Chờ" (`onExitToLobby` — unmount
  `HudShell`, quay lại `LobbyScreen`, tự reset `paused` về `false` để trận
  sau không bị dính trạng thái tạm dừng). **Lưu ý 2026-08-11**: phím `P` (và
  `J`/`K`/`L`/`U`) đã bị gỡ khỏi `scene.ts` — component này vẫn đọc/hiện đúng
  theo `paused` trong `world` store, nhưng hiện KHÔNG còn phím nào tự bật nó
  (chỉ còn hữu ích nếu có nơi khác gọi `setPaused(true)`).

### Skill tree
- Mỗi môn phái có 6 node: 1 bị động khởi đầu (miễn phí) + 2 node tầng 1 + 2
  node tầng 2 (mỗi node yêu cầu 1 node tầng 1 tương ứng) + 1 tuyệt kỹ tầng 3
  (yêu cầu cả 2 node tầng 2).
- Cơ chế mở khóa bằng điểm kỹ năng (`unlockSkill`) — nguồn phát điểm kỹ năng:
  giết quái trong world. Nhánh active tier1 → tier2 → tier3 của mỗi môn phái
  chính là skill1(J)/skill2(K)/ultimate(L) dùng được ngoài combat thật (đọc số
  liệu từ `modules/combat/data.ts`, cùng `id` với `SkillNode`).
- Khi mở khóa node tối thượng (tầng 3): panel "Kỹ Năng" hiện banner "Đại
  Thành" với ảnh `inGameSublimation` (pop-in bằng GSAP), đồng thời avatar
  ngoài world và ở thanh trạng thái cũng tự đổi sang ảnh sublimation — đây là
  hệ thống **"đột phá"** của game (xem mục 1).

## 4. 3 môn phái hiện có

| Môn phái | Vai trò | Linh vật | Màu chủ đạo | Bị động khởi đầu | Thiên hướng chỉ số |
|---|---|---|---|---|---|
| **Bạch Hạc Môn** | Cung Thủ | Hạc | Xám/trắng/bạc (`#d4d4d8`) — khớp tông art gốc | Độc Vũ Hạc Linh — đòn thường có cơ hội gây độc | Tốc Độ Đánh / Tốc Độ Di Chuyển / Chí Mạng cao |
| **Thanh Long Môn** | Pháp Sư | Rồng Xanh | Lam ngọc (`#22d3ee`) | Long Khí Hộ Thể — tự hồi Năng Lượng, giảm sát thương phép | Sát Thương Phép / Năng Lượng / Kháng Phép cao |
| **Cuồng Hổ Môn** | Chiến Binh | Hổ | Cam hổ phách (`#fb923c`) | Thiết Giáp Hổ Cốt — giảm % sát thương nhận, tăng phòng ngự khi máu thấp | Máu / Giáp / Sát Thương Vật Lý cao |

10 chỉ số dùng chung (định nghĩa ở `modules/stats/data.ts`) — **đặt tên theo
thuật ngữ combat cụ thể, không dùng jargon RPG trừu tượng**, để người chơi đọc
là hiểu ngay:

| Stat | Ý nghĩa | Đơn vị | Cơ bản → Tối đa (`barMax`) |
|---|---|---|---|
| Máu (`hp`) | Lượng máu tối đa | số | — |
| Giáp (`armor`) | Giảm sát thương vật lý | số | — |
| Kháng Phép (`magicResist`) | Giảm sát thương phép + kháng debuff | số | — |
| Sát Thương Vật Lý (`physicalDamage`) | Sát thương đòn thường/vũ khí | số | — |
| Sát Thương Phép (`magicDamage`) | Sát thương nội công/chiêu thức | số | — |
| Năng Lượng (`energy`) | Tài nguyên dùng kỹ năng chủ động | số | — |
| Tốc Độ Đánh (`attackSpeed`) | Số đòn đánh mỗi giây — **quyết định cooldown đòn đánh tự động thật** (`cooldownMs = 1000/attackSpeed`, xem `cooldownMsFor()` trong `world/scene.ts`) | số, 2 chữ số thập phân | 1.00 → 10.00 hit/s |
| Tốc Độ Di Chuyển (`moveSpeed`) | Tốc độ di chuyển — nối thẳng vào WASD trong `world/scene.ts`, **không** scale theo cấp | số nguyên (px/s) | 200 → 500 |
| Tỉ Lệ Chí Mạng (`critRate`) | Xác suất đòn chí mạng | % | 0 → 100 |
| May Mắn (`luck`) | Tỉ lệ nhận vật phẩm hiếm | % | 0 → 70 |

`StatDef` có field `unit` (hậu tố hiển thị — rỗng cho đa số, `"%"` cho Chí
Mạng/May Mắn) và `decimals` (số chữ số thập phân khi roll/hiển thị — chỉ
`attackSpeed` dùng, giá trị 2). `barMax` là mốc để scale progress bar, không
phải giới hạn gameplay cứng — riêng `attackSpeed`/`moveSpeed` thì `barMax`
trùng với mốc tối đa thiết kế (10.00 hit/s, 500 px/s). `mergeStatBonus(base,
bonus)` (dùng khi cộng bonus trang bị) làm tròn lại theo đúng `decimals` của
từng stat để tránh trôi số thập phân.

## 5. Animation — quy ước & vị trí

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
- `ClassCard` tilt 3D: `gsap.quickTo(el, "rotationX"/"rotationY", ...)` theo
  vị trí con trỏ chuột (pointermove), có `gsap.set(el, { transformPerspective:
  800 })`. **Lưu ý quan trọng**: `gsap.quickTo` ở bản GSAP đang dùng (3.15)
  KHÔNG resolve đúng alias `rotateX`/`rotateY` — phải dùng tên chuẩn
  `rotationX`/`rotationY`, nếu không quickTo sẽ chạy nhưng không tạo hiệu ứng
  gì (matrix vẫn identity, không lỗi console, rất khó nhận ra). `.to()`/`.set()`
  thường thì cả hai tên đều được, chỉ riêng `quickTo` là có vấn đề này.
- `RadialMenu`: breathing glow dùng thẳng utility `animate-ping` có sẵn của
  Tailwind (scale+fade lặp) — chỉ render khi menu đang đóng.
- `Radar`: tia quét là 1 lớp `conic-gradient` xoay bằng `.animate-radar-sweep`
  (CSS `@keyframes`, 4s/vòng), đặt dưới các chấm blip để không che chúng.
- `HudShell`: iris wipe khi vào trận — `gsap.fromTo(root, { clipPath:
  "circle(0% at 50% 50%)" }, { clipPath: "circle(150% at 50% 50%)" })`. Dùng
  150% (không phải 100%) để đảm bảo phủ hết góc màn hình ở mọi tỉ lệ khung
  hình.
- `PanelShell`/`PauseOverlay`: enter/exit bằng `useGSAP` (từ `@gsap/react`) —
  component nào dùng hook này thì tự gọi `gsap.registerPlugin(useGSAP)` ở đầu
  file (idempotent, không cần file khởi tạo riêng).
- `AmbientBackground`: 3 blob màu blur trôi chậm bằng CSS `@keyframes`
  (`drift-a/b/c`) — tiện ích dự phòng cho màn nào chưa có background art
  riêng, hiện chưa được gắn ở đâu (không xoá, giữ để dùng sau).
- `CharacterPreview`: zoom-in khi mount (GSAP, `opacity 0→1` + `scale 1.22→1`),
  crossfade giữa 2 lớp ảnh chồng nhau khi bấm toggle (GSAP `.to`/`.fromTo`) +
  flash một lần theo màu môn phái, glow nền lặp vô hạn không phụ thuộc state
  bằng CSS `@keyframes preview-pulse` (không dùng GSAP cho phần lặp này).
- **`Actor`** (`modules/world/actor.ts`) — animation Phaser thuần, KHÔNG dùng
  GSAP: xoay frame theo `moveAngle` + squash-and-stretch hop tính trực tiếp
  trong `update(dt, moveAngle)` mỗi frame. Đây là quy ước bắt buộc khi thêm
  bất kỳ nhân vật/quái mới nào trong world — dùng `Actor`, đừng viết lại logic
  xoay/nảy thủ công. **Lưu ý quan trọng (bug đã gặp và sửa)**: toàn bộ art
  nhân vật/quái trong game này được vẽ **nhìn thẳng về phía camera** (neutral
  pose = "hướng xuống"), KHÔNG phải hướng phải như quy ước góc `0` mặc định
  của `Math.atan2`/rotation trong Phaser. Set thẳng `target.rotation =
  this.facing` (facing = `moveAngle`) sẽ lệch góc 90° — biểu hiện cụ thể: đi
  xuống thì mặt quay trái, đi phải thì mặt quay xuống. Phải cộng thêm hằng số
  bù `FACING_ART_OFFSET = -Math.PI / 2`: `target.rotation = this.facing +
  FACING_ART_OFFSET`. Nếu sau này đổi bộ art khác có neutral pose khác (VD:
  hướng phải thay vì hướng xuống), chỉ cần đổi 1 hằng số này, không phải sửa
  công thức `moveAngle` hay logic gọi `Actor.update()` ở bất kỳ đâu khác.
- Combat VFX trong Phaser (`world/scene.ts`) — quả cầu bắn ra, vòng nổ
  burst/ultimate, số sát thương bay lên, chớp trắng khi trúng đòn (`Actor.
  flashTint()`) — đều dùng **Phaser tween** (`this.tweens.add`) và texture
  sinh bằng `Graphics.generateTexture` (cache theo màu ability), không dùng
  GSAP cho bất kỳ object nào bên trong canvas.
- **Bug đã gặp và sửa: canvas Phaser không phủ hết màn hình, hở 1 dải nền
  đen bên phải** (`GameCanvas.tsx`/`MapCanvas.tsx`) — nguyên nhân là
  truyền `width: "100%", height: "100%"` (chuỗi) vào `scale` config của
  `Phaser.Game`; Phaser chỉ resolve chuỗi `%` này ĐÚNG 1 LẦN lúc boot, và nếu
  container React chưa layout xong ở đúng khoảnh khắc đó (rất dễ xảy ra khi
  canvas được tạo trong `useEffect` ngay sau khi component vừa render), canvas
  bị khóa cứng ở kích thước cũ/nhỏ hơn thật và không tự sửa lại — dù
  `Phaser.Scale.RESIZE` đang bật. Fix: đo `container.clientWidth/
  clientHeight` (số thật, không phải chuỗi `%`) để tạo `Phaser.Game`, cộng
  thêm 1 listener `window.addEventListener("resize", ...)` gọi
  `game.scale.resize(container.clientWidth, container.clientHeight)` để chắc
  chắn luôn khớp sau này. Khi tạo `Phaser.Game` mới ở component khác, LUÔN
  làm theo pattern này — đừng quay lại truyền chuỗi `"100%"`.

## 6. Stack kỹ thuật

- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4.
- **Phaser 3-API-compatible (gói `phaser` v4)** cho canvas game — game loop,
  input, camera, tất cả chạy client-only (mount qua `next/dynamic({ ssr:
  false })` trong `HudShell`).
- **Zustand** cho state, tách theo module; các store cần giữ qua lần tải lại
  dùng middleware `persist` (localStorage); `world` store thì KHÔNG persist vì
  là state runtime của ván chơi (vị trí, HP, cấp/EXP, cooldown, paused — reset
  mỗi lần vào trận mới).
- **lucide-react** cho icon (không dùng SVG vẽ tay).
- **GSAP + `@gsap/react`** cho animation UI — xem quy ước chi tiết ở mục 5.
- **next/font/local** cho 2 font riêng của game (`src/assets/*.ttf`, khai báo
  trong `src/app/layout.tsx`) — KHÔNG dùng Google Fonts: `BMXRadical-Bold` là
  `--font-bmx`/`font-sans` mặc định, `P22 Slogan W00 Regular` là `--font-p22`,
  dùng qua class `.font-title` (chỉ tiêu đề lớn/màn giới thiệu).
- **next/image** cho ảnh trong DOM (portrait/backdrop); ảnh trong canvas Phaser
  đi qua endpoint `/_next/image` thủ công (`optimizedSpriteUrl`, xem mục 3)
  vì Phaser tự load bằng URL, không qua component `<Image>`.
- Không dùng Reverse UI (thư viện component trả phí) — các hiệu ứng
  Radar/Radial Menu/Backdrop/AbilityBar/Lobby được tự build bằng Tailwind +
  CSS + GSAP theo yêu cầu của chủ dự án.

## 7. Roadmap (chưa làm)

- [ ] **Nối luồng mới (Tap to Start/story/map) với hệ thống cũ** (chọn môn
      phái/Sảnh Chờ/combat, xem mục 0) — đang cố tình để rời nhau. Cần chốt
      trước khi nối: (a) map `start` chuyển sang màn nào tiếp theo (thẳng vào
      Sảnh Chờ? một map thật khác?), (b) `dog` có trở thành `CharacterClassId`
      thật (có stats/skill tree/combat loadout riêng) hay là nhân vật "ngoài
      hệ thống" mãi mãi, (c) cơ chế mở khóa crane/dragon/tiger ("nhân vật
      truyền thuyết") — mở bằng gì (nhiệm vụ? cấp độ? vật phẩm hiếm?). Combat
      DORMANT hiện đã bỏ hết phím skill/heal/pause (2026-08-11, thuần di
      chuyển) để chuẩn bị nối vào map thật thay vì hồi sinh flow cũ.
- [ ] **Vật phẩm cho 2 ô `I`/`O` trong `AbilityBar`** — hiện chỉ là placeholder
      khóa xám (`EmptySlot` trong `AbilityBar.tsx`). Cần chốt: là biến thể
      khác của Bình Máu (hồi Năng Lượng? buff tạm thời?) hay loại hoàn toàn
      khác — chưa có yêu cầu cụ thể nên cố tình chưa code hành vi giả.
- [ ] **Map thứ 2 trở đi** — kiến trúc module (`modules/world/maps/`,
      `MAP_MODULES`/`MAP_ORDER`, `useMapProgressStore`) đã sẵn sàng cho việc
      này (2026-08-11): thêm map mới chỉ cần 1 file module + 1 dòng
      `MAP_ORDER`, không sửa `MapScreen`. Còn thiếu: cơ chế "map `start` hoàn
      thành → chuyển map tiếp theo" thật sự (hiện chưa có điều kiện hoàn
      thành/exit nào được định nghĩa — `setCurrentMapId` đã có nhưng chưa có
      chỗ nào gọi nó), quái/nhiệm vụ trong map, và world combat chính
      (`scene.ts`) vẫn là 1 world mở duy nhất riêng biệt — 2 hệ thống map (map
      module và combat DORMANT) hiện KHÔNG liên quan nhau. Đây là phần còn
      thiếu để khớp đầy đủ gameplay loop "ra thành → nhận nhiệm vụ → vào map →
      đánh quái → nhặt đồ → nâng võ công → gặp NPC/giang hồ → boss → mở map
      mới" mà chủ dự án đã mô tả — Sảnh Chờ hiện đóng vai trò "ra thành" nhưng
      chưa có bảng nhiệm vụ hay NPC tương tác.
- [ ] **Zombie làm quái mới, deer/panda làm NPC** — ảnh đã có sẵn ở
      `public/character/ingame/` (xem mục 1; `turtle.png` đã dùng làm portrait
      thoại "???" ở map `start`) nhưng chưa gắn vào `MONSTER_CONFIGS` hay bất
      kỳ hệ thống NPC tương tác được nào (khác `SubjectConfig` — đó chỉ là vật
      thể tĩnh + thoại 1 lần, không phải NPC thật) — chờ chỉ đạo cụ thể hơn.
- [ ] **Art direction "Stylized Chinese ink painting + 3D nhẹ"** theo ảnh
      tham khảo chủ dự án gửi — giữ 2D ở phần nào đang là 2D, không đổi hết
      sang 3D thật. Cần asset thật trước khi làm sâu; hiện dùng tạm art có
      sẵn (chủ dự án sẽ bổ sung khi cần).
- [ ] **Thú cưỡi, cánh, hệ thống nâng cấp trang bị (rèn/nâng cấp độ hiếm)** —
      đã có nền tảng cơ bản (equip slot + statBonus phẳng), nhưng "nâng cấp"
      (tăng chỉ số của 1 item qua nhiều lần, đổi rarity...) và cánh/thú cưỡi
      thì chưa — chưa có spec cụ thể, cố tình chưa code để tránh nửa vời.
- [ ] Loading screen khi khởi tạo Phaser game (đặt ở `src/app/component`) —
      hiện avatar/canvas xuất hiện gần như ngay do ảnh đã qua tối ưu, nhưng
      nên có khi thêm nhiều asset hơn.
- [ ] Sprite theo hướng thật (4-8 hướng) nếu có thêm asset, để thay cho giải
      pháp "xoay cả frame ảnh bust theo hướng di chuyển" hiện tại (đánh đổi
      thẩm mỹ đã ghi ở mục 1) — chỉ cần đổi bên trong `Actor`, không cần sửa
      chỗ gọi.
- [ ] Thêm class thứ 4 trở lên nếu cần (chỉ cần thêm entry vào `data.ts` của
      `character`, `stats`, `skills`, `inventory`, `combat` — kiến trúc đã
      tách sẵn theo `CharacterClassId`). Xem checklist đầy đủ ở
      `.claude/skills/wulin-design/SKILL.md`.
- [ ] Thêm loại quái mới — chỉ cần thêm `MonsterConfig` + ảnh vào
      `public/villain/`, `world/scene.ts` tự preload/spawn qua wave.
- [ ] Vật phẩm rơi ra từ quái, hệ thống rarity đã có sẵn field nhưng chưa dùng
      (`ItemRarity`: common/rare/epic/legendary) — điểm móc nối tự nhiên là
      `killMonster()` trong `world/scene.ts`, chỗ đang cộng skill point + EXP.
- [ ] Âm thanh (bắn, nổ, quái chết, nhạc nền).
- [ ] Đồng bộ multiplayer (nếu muốn giữ đúng tinh thần `.io`) — hiện tại hoàn
      toàn single-player, lưu local.
