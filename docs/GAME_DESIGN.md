# Wulin.io — Tài liệu thiết kế game

> Cập nhật lần cuối: 2026-08-19 (đợt 23) — User bác thẳng cách sửa đợt 22
> ("không muốn h-52/h-28 gì hết, nó là cheat chứ không giải quyết vấn đề
> thật") — đổi hẳn sang giải pháp gốc rễ: `ItemDetailCard.tsx` (hover card
> vũ khí Túi Đồ) giờ `createPortal` ra `document.body` + `position: fixed`
> đo bằng `getBoundingClientRect()` lúc hover thật, KHÔNG còn dựa vào CSS
> `group-hover` lồng trong `WuxiaModal`'s `overflow-y-auto` — nên KHÔNG
> CẦN spacer nào nữa, xoá sạch `h-52`/`h-28` khỏi `BagPanel.tsx`. Đảo
> ngược quyết định "cố tình không dùng portal" từng chốt ở đợt 16/20 (đúng
> lúc đó cho popover NHỎ, sai với popover LỚN như card này — "dành chỗ
> trống" chỉ có 2 kết cục: đoán sai (đợt 16/20, 2 lần) hoặc đoán đúng
> nhưng lộ khoảng trắng vô cớ, đợt 22). Nhân tiện tăng `GRID_ROWS` 2→3
> (`PAGE_SIZE` 12→18, theo đề xuất user) — giờ hoàn toàn không ảnh hưởng gì
> tới việc card có bị cắt hay không nữa. Xem mục 3's "Portal hoá hover card
> Túi Đồ (đợt 23)".
>
> Cập nhật trước đó (2026-08-19, đợt 22) — User hỏi thẳng cái spacer
> `h-52` cuối lưới Túi Đồ "để làm gì, trông như bug vậy" — đúng, đang
> OVER-RESERVE: đo chính xác bằng `getBoundingClientRect()` (không đoán)
> thì card cần ~193px chỗ trống dưới hàng 0, nhưng hàng 1 (nếu tồn tại,
> đầy hay không cũng vậy — track CSS Grid tự tính theo ô cao nhất) đã TỰ
> góp ~68px rồi, chỉ còn thiếu ~101px thật sự cần bù thêm — không phải
> 208px cố định như cũ. Spacer giờ ĐỘNG: `h-28` (112px) khi trang có đủ 2
> hàng, `h-52` (208px) chỉ khi trang có đúng 1 hàng (không có gì bên dưới
> để "mượn" chiều cao) — giảm đúng một nửa khoảng trắng nhìn-như-bug cho
> trường hợp phổ biến nhất (trang đầy 12 món). Xem mục 3's "Thu nhỏ spacer
> Túi Đồ (đợt 22)".
>
> Cập nhật trước đó (2026-08-19, đợt 21) — `BagPanel.tsx` đổi từ cuộn
> (`overflow-y-auto` vô hạn) sang PHÂN TRANG, theo yêu cầu chủ động đón
> đầu lúc túi đồ nhiều món sau này. 1 trang = đúng 2 hàng (`PAGE_SIZE =
> 12`) — chốt số này không tuỳ ý, mà để giữ logic hover-card
> (`cardPlacement`/spacer, đợt 16/20) LUÔN đúng tuyệt đối thay vì "đủ dùng
> tuỳ trường hợp" như thiết kế cuộn cũ. Nút trang trước/sau + "Trang X/Y"
> chỉ hiện khi > 1 trang; `page` state tự CLAMP về khoảng hợp lệ mỗi
> render (không qua `useEffect`) để không có frame nào hiện trang rỗng khi
> tổng số món tụt xuống (bán đồ) trong lúc panel đang mở. Đã xác minh
> trước khi làm rằng hàng KHÔNG PHẢI hàng đầu chưa từng bị cắt (kể cả cuộn
> sâu) — chỉ hàng đầu có rủi ro, phân trang loại bỏ hẳn thay vì vá thêm.
> Xem mục 3's "Túi Đồ phân trang (đợt 21)".
>
> Cập nhật trước đó (2026-08-19, đợt 20) — Bug thật: `BagPanel.tsx`'s
> `ItemDetailCard` hover card ở HÀNG ĐẦU vẫn bị `WuxiaModal`'s
> `overflow-y-auto` cắt mất trong 1 ca đợt 16 chưa lường tới — túi đồ có
> vài hàng nhưng hàng CUỐI ngắn (VD 8 món = hàng 1 đủ 6 + hàng 2 chỉ 2)
> không cho đủ chiều cao tự nhiên (~82px thay vì ~193px cần) để card hàng
> đầu bật xuống không bị cắt. Sửa bằng cách bỏ điều kiện
> `items.length <= GRID_COLS` trên spacer dự phòng — giờ LUÔN dành sẵn
> ~208px sau lưới vật phẩm bất kể có bao nhiêu món, đúng trong mọi trường
> hợp thay vì chỉ đúng với ĐÚNG 1 hàng. Xem mục 3's "Sửa clip hover card
> Túi Đồ (đợt 20)".
>
> Cập nhật trước đó (2026-08-19, đợt 19) — Layout lại Tiệm Triệu Hồi/Chợ
> Trời/Túi Đồ theo yêu cầu cụ thể: `WuxiaModal` thêm prop `titleRight`
> (tiêu đề + value Bạc/Thẻ Triệu Hồi cùng hàng, space-between); Tiệm Triệu
> Hồi thêm nút "+" xanh lá mua thẻ trực tiếp (modal chồng modal,
> `BuySummonCardsModal.tsx` mới, `buySummonCards()` mới ở
> `modules/summon/store.ts` — giá mua thẻ dời từ Chợ Trời sang đây, 200
> Bạc/thẻ); Chợ Trời bỏ nút mua thẻ cũ, nút "Làm Mới" đổi thành icon+giá
> cạnh tiêu đề mục, quà ngày đổi thành icon quà lúc lắc/toả sáng (chỉ hiện
> khi còn quà) + toast chúc mừng thay vì nút chữ; `SellCard` bỏ chữ "(Đang
> mặc)" đổi thành badge tick + khoá nút Bán cho vũ khí đang trang bị; Túi
> Đồ bỏ khung viền quanh Bạc/Thẻ Triệu Hồi, chỉ còn icon + số trần. Xem
> mục 3's "Layout lại Tiệm Triệu Hồi/Chợ Trời/Túi Đồ (đợt 19)".
>
> Cập nhật trước đó (2026-08-19, đợt 18) — Áp dụng quy ước đợt 14 ("hạn chế
> từ ngữ mang tính value, ưu tiên icon") THẬT SỰ vào Tiệm Triệu Hồi + Chợ
> Trời, theo yêu cầu cụ thể — trước đó quy ước mới chỉ ghi vào tài liệu +
> dùng ở nội dung mới, chưa retrofit UI cũ. Component dùng chung mới
> `CurrencyValue.tsx` (icon + số) thay cho chữ "N Bạc"/"N Thẻ Triệu Hồi" ở
> `SummonPanel.tsx` (số thẻ hiện có) và `MarketPanel.tsx` (số Bạc đầu
> trang, nút làm mới cửa hàng, nút mua thẻ, nút nhận quà ngày, giá mua/bán
> từng vật phẩm). Cố tình chừa lại "Cấp N" và nhãn `+N Máu`/`+N Tấn Công`
> (không phải currency, không có icon tương ứng). Xem mục 3's "Icon hoá
> value ở Tiệm Triệu Hồi/Chợ Trời (đợt 18)".
>
> Cập nhật trước đó (2026-08-17, đợt 17) — Bug thật: màu "Huyền Thoại"
> (`RARITY_CONFIG.legendary.color`, `modules/summon/data.ts`) đổi từ
> `#f2c66d` (vàng nhạt) sang `#b8892f` (vàng đậm) — màu cũ gần như cùng độ
> sáng với nền giấy da `WuxiaModal` dùng khắp app, khiến chữ/badge "Huyền
> Thoại" hoà vào nền, không đọc được ở bất kỳ đâu nó xuất hiện
> (`ItemDetailCard.tsx`, `SummonRatesModal.tsx`, `MarketPanel.tsx`,
> `SummonPanel.tsx`). Sửa đúng 1 chỗ vì mọi nơi trên đều đọc chung từ
> `RARITY_CONFIG`. Xem mục 3's "Sửa màu Huyền Thoại (đợt 17)".
>
> Cập nhật trước đó (2026-08-17, đợt 16) — 2 bug/tính năng theo phản hồi
> thực tế: (1) đổi nhân vật/vũ khí (`CharacterPanel`) không còn làm reset
> cả phòng nữa — bug thật: `MapCanvas.tsx`'s rebuild effect gộp chung
> `spriteUrl`/`weaponSpriteSrc`/`playerAttackDamage` với các prop THẬT SỰ
> gắn danh tính phòng, nên đổi nhân vật/vũ khí cũng `game.destroy(true)` +
> `new Phaser.Game()` y hệt đổi phòng (quái hồi sinh, người chơi bật về
> điểm vào phòng); sửa bằng cách tách 3 giá trị đó sang cập nhật LIVE trên
> scene đang chạy (`mapScene.ts`'s `updateLoadout()`, mới — texture key
> giờ động theo src ảnh; `Actor.setTexture()`, mới); (2) hover xem vũ khí ở
> Túi Đồ đổi từ `WuxiaTooltip` 1 dòng sang `ItemDetailCard.tsx` (mới) — bug
> thật: tooltip cũ chỉ hiện ĐÚNG 1 trong 2 stat khi vật phẩm có cả
> `hp`+`attack` cùng lúc, âm thầm mất thông tin; card mới hiện đủ mọi stat
> + xử lý luôn bug tràn/cắt khi panel ít đồ. Xem mục 3's "2 bug/tính năng
> (đợt 16)".
>
> Cập nhật trước đó (2026-08-17, đợt 15) — sửa lại đợt 14: hoàn thành
> `first_deer_hunt` giờ CHỈ mở khoá Túi Đồ, không còn mở kèm Tiệm Triệu
> Hồi/Chợ Trời nữa (user muốn 2 tính năng đó "để sau", chưa quyết định
> trigger nào) — bỏ 2 dòng `unlockFeature("summonStore")`/
> `unlockFeature("market")` khỏi `MapScreen.tsx`, `summonStore`/`market`
> giờ ở đúng nhóm "khoá, chưa có trigger" với `skills`/`pet`/`mount`/
> `friends`. Nội dung tour (`modules/unlocks/guides.ts`) giữ nguyên, chỉ
> chưa có gì gọi tới. Xem mục 3's "Chỉ mở khoá Túi Đồ... (đợt 15)".
>
> Cập nhật trước đó (2026-08-17, đợt 14) — quy ước UI mới (SKILL.md mục 2:
> hạn chế từ ngữ mang tính value như "Bạc"/"Thẻ", ưu tiên icon/hình ảnh) +
> Túi Đồ giờ cũng khoá từ đầu, mở cùng lúc với Tiệm Triệu Hồi/Chợ Trời qua
> `first_deer_hunt` (`UnlockableFeature` thêm `"bag"`) + mini "onboarding
> tour" mỗi khi mở khoá tính năng — không còn chỉ chào mừng suông:
> `FeatureUnlockOverlay.tsx` giờ đi qua TỪNG tính năng vừa mở (tên + mô tả
> + `ImageCarousel.tsx` mới, duyệt thủ công không tự chạy), nội dung lấy
> từ file MỚI `modules/unlocks/guides.ts`'s `FEATURE_GUIDES` — file tổng
> quát DUY NHẤT chứa tên/mô tả/carousel ảnh cho từng tính năng, đúng yêu
> cầu người dùng. `announcement.ts` đổi cơ chế đóng từ "xoá sạch hàng đợi"
> sang "duyệt qua từng phần tử" (`dismissCurrentAnnouncement`) để hỗ trợ
> tour nhiều tính năng cùng lúc. Xem mục 3's "Túi Đồ khoá + mini onboarding
> tour (đợt 14)".
>
> Cập nhật trước đó (2026-08-17, đợt 13) — 5 việc theo phản hồi thực tế:
> (1) tính năng chưa mở (Tiệm Triệu Hồi/Chợ Trời/Kỹ Năng/Thú Cưng/Thú
> Cưỡi/Bạn Bè) giờ LUÔN hiện, chỉ mờ đi + tooltip "chưa mở" thay vì biến
> mất hẳn khỏi HUD — cố ý không dùng `disabled` native (giết `:hover`,
> hỏng tooltip), chỉ no-op `onClick`; (2) `liveHud.ts`'s `hp` giờ persist
> qua reload/login lại (trước đó luôn tụt về mặc định `100` rồi hồi dần,
> sai với nhân vật `maxHp` khác 100 như gấu trúc 150); (3) Kỹ Năng/Thú
> Cưng/Thú Cưỡi/Bạn Bè khoá "cho giai đoạn này" cùng cơ chế với (1),
> `UnlockableFeature` thêm 4 giá trị mới; (4) `QuestOfferModal` hiện
> preview phần thưởng (EXP/Bạc/vật phẩm nếu có) ngay lúc mời nhận nhiệm
> vụ, qua component dùng chung mới `QuestRewardPreview.tsx`; (5)
> `QuestTracker` cho bấm vào dòng nhiệm vụ để mở lại chi tiết đầy đủ
> (`QuestDetailModal.tsx`, mới — cố ý render ở `GameHud.tsx` top-level,
> không lồng trong `QuestTracker`, để tránh bug modal bị ghim lệch do
> containing-block của wrapper `fixed`). Xem mục 3's "5 việc theo phản
> hồi thực tế (đợt 13)".
>
> Cập nhật trước đó (2026-08-17, đợt 12) — User tự tay refactor
> `public/character/` (trước đó gọi `ingame/`) thành 3 thư mục theo VAI TRÒ:
> **`player/`** (nhân vật chọn được thật — roster rút từ 7 xuống còn 3:
> `dog`/`tiger`/`panda`, `CharacterId` ở `modules/character/types.ts` sửa
> theo), **`npc/`** (nhân vật không chọn được, chỉ đứng/nói chuyện —
> `turtle.png` dùng thật cho Cụ Quy; 4 nhân vật cũ rút khỏi roster
> (`crane`/`deer`/`dragon`) + bộ Tứ Tượng "thiện" mới thêm, chưa gắn NPC
> nào), **`villain/`** (dọn hẳn từ `public/villain/` cũ vào đây — cùng lúc
> có thêm bộ Tứ Tượng "hắc hoá" đối xứng với bộ NPC thiện, chưa gắn quái
> nào). Đã review lại toàn bộ: `tsc`/`lint`/`build` sạch, quét mọi đường dẫn
> ảnh tham chiếu trong code đều trỏ đúng file tồn tại (trừ
> `pvz_chili.png` — bug thiếu asset có từ đợt 11, không liên quan đợt
> này). Xem mục 1 (`public/character/` section) đã viết lại đầy đủ.
>
> Cập nhật trước đó (2026-08-14, đợt 11) — 8 việc: sửa bug tooltip Túi Đồ bị
> cắt ở cột cuối (`GRID_COLS` lệch với `grid-cols-6` thật); `QuestTracker`
> hover ra card mô tả đầy đủ; hint "Nhấn Space Để Trò Chuyện" khi gần NPC
> (store mới `modules/npc/interactionHint.ts`); `DialogueBox` thêm thanh
> countdown 5s trực quan (GSAP, dùng lại scope fade-in sẵn có); Triệu Hồi
> thêm quay x10 (`performSummonBatch`), bảng tỉ lệ đổi từ khung mở-rộng
> sang icon mở modal (`SummonRatesModal.tsx`), cấp tiệm giờ tự lên theo số
> lượt quay tích luỹ (`summonExp`/`rollsForLevel`, không cần nút nâng cấp
> tay); **Chợ Trời (mới, `modules/market/`)** — mua/bán vũ khí, làm mới
> cửa hàng, mua Thẻ Triệu Hồi, nhận 3 thẻ miễn phí mỗi ngày, đặt cạnh Tiệm
> Triệu Hồi ở HUD; **hệ thống mở khoá tính năng (mới, `modules/unlocks/`)**
> — Tiệm Triệu Hồi + Chợ Trời đều bắt đầu khoá (`false`), hoàn thành nhiệm
> vụ đầu tiên mở khoá cả hai kèm overlay ăn mừng lấp lánh
> (`FeatureUnlockOverlay.tsx`, z cao nhất app); nhiệm vụ giờ thưởng được cả
> vật phẩm, không chỉ vàng/exp (`QuestDef.rewardItem`) — nhiệm vụ đầu tiên
> thưởng thêm 1 khẩu huyền thoại. Xem mục "Đã có".
>
> Cập nhật trước đó (2026-08-14, đợt 10) — Hệ thống NPC + Nhiệm vụ (2 module
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
> `public/character/player/` trừ `zombie.png`/`deer_injured.png`), mỗi nhân
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
- **`public/character/` chia 3 thư mục theo VAI TRÒ, không theo "nhân vật
  nào" — đợt 12** (trước đó gộp chung 1 thư mục `ingame/`, tách ra vì
  roster người chơi đã thu hẹp lại còn 3 trong khi số NPC/quái đang tăng):
  - **`player/`** — nhân vật CÓ THỂ chọn/đổi qua lại thật sự (roster ở
    `modules/character/data.ts`, hiện 3: `dog`/`tiger`/`panda`). Thêm nhân
    vật chọn được mới = thêm ảnh vào ĐÚNG thư mục này + 1 dòng
    `CHARACTERS`, không phải bạ đâu bỏ đó.
  - **`npc/`** — ảnh cho nhân vật KHÔNG chọn được, chỉ đứng/nói chuyện
    (`turtle.png` đã dùng thật, là Cụ Quy ở map `start` — xem
    `modules/npc/data.ts`). Còn `crane.png`/`deer.png`/`dragon.png` (3
    nhân vật cũ từng ở roster chọn được, nay rút khỏi player) và bộ Tứ
    Tượng "thiện" `azure_dragon.png`/`black_tortoise.png`/`red_dragon.png`/
    `vermilion_bird.png`/`white_tiger.png` — CHƯA gắn vào NPC nào, để dành
    cho map/cốt truyện sau. Đừng tự ý gắn khi chưa có chỉ đạo rõ.
  - **`villain/`** — art quái/phản diện (`deer_injured.png` đã dùng thật ở
    map `start`, xem mục Combat). Còn `zombie.png`/`ghost.png`/
    `skull.png`/`spider.png` và bộ Tứ Tượng "hắc hoá"
    `dark_azure_dragon.png`/`dark_black_tortoise.png`/`dark_king.png`/
    `dark_red_dragon.png`/`dark_vermilion_bird.png`/`dark_white_tiger.png`
    — CHƯA gắn vào quái nào; cặp "thiện" (`npc/`) ↔ "hắc hoá" (`villain/`)
    cùng tên rõ ràng là ý đồ NPC-guardian/boss-đối-nghịch cho sau này, chưa
    phải chỉ đạo để tự ý lắp vào gameplay.
- **Background** màn tap-to-start là tranh minh hoạ núi non thật
  (`public/choose_character_background_screen.png`), không phải nền phẳng —
  xem `SceneBackdrop` ở mục Animation. Minimap dùng art thật
  (`public/minimap.png`).

## 2. Kiến trúc thư mục (modular theo domain)

```
public/
  choose_character_background_screen.png  # backdrop TapToStartScreen
  minimap.png              # art thật cho GridMinimap (phong cách cuộn thư)
  character/player/        # bust nhân vật — dog.png (player hiện tại),
  character/npc/            # turtle.png (portrait thoại), deer/panda/zombie
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
      BagPanel.tsx              # Túi Đồ — Bạc/Thẻ Triệu Hồi qua `CurrencyValue`
                               # trần (đợt 21, bỏ khung viền `ResourceStat` cũ)
                               # rồi GRID icon vuông (đổi đợt 5) —
                               # `inventory.items`, PHÂN TRANG (đợt 21, 3
                               # hàng/trang = `PAGE_SIZE` 18 — đợt 23 tăng từ
                               # 2 lên 3 hàng, KHÔNG còn ảnh hưởng gì tới việc
                               # hover card bị cắt hay không nữa) thay vì
                               # `overflow-y-auto` cuộn vô hạn. Viền màu theo
                               # `RARITY_CONFIG`, tên/phẩm chất/cấp/MỌI
                               # statBonus (đợt 16 — đổi từ `WuxiaTooltip` 1
                               # dòng, hay mất stat khi vật phẩm có cả
                               # hp+attack) hiện qua `ItemDetailCard.tsx` khi
                               # hover — đợt 23: PORTAL ra `document.body` +
                               # `position: fixed` đo bằng
                               # `getBoundingClientRect()` lúc hover thật
                               # (KHÔNG còn CSS `group-hover` lồng trong
                               # `overflow-y-auto`, KHÔNG còn spacer dành chỗ
                               # trống nào — xem mục 3 đợt 23), `BagPanel` giữ
                               # state "đang hover item nào", mỗi ô chỉ báo
                               # `onHover`/`onUnhover`. Đồ ĐANG trang bị có
                               # badge dấu tick (`Check`, lucide) góc trên-phải
                               # thay vì nút chữ "Đang Dùng"/"Trang Bị" dài —
                               # nơi DUY NHẤT trang bị/tháo vũ khí (`equipItem`
                               # + `syncMaxHpToLiveHud`). Không còn nút
                               # "← Nhân Vật" (đợt 5 — panel này không còn mở
                               # TỪ `CharacterPanel` nữa)
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
                               # `ItemDetailCard.tsx`-kiểu hover card của
                               # `BagPanel.tsx` (đợt 16 — không phải
                               # `WuxiaTooltip` nữa, xem mục 3 đợt 16)
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
                                # `Math.abs(sin(hopPhase))`) — xem mục 1.
                                # `setTexture(key)` (đợt 16) — swap ảnh
                                # KHÔNG dựng lại actor, dùng khi đổi nhân
                                # vật/vũ khí mid-room, xem mục 3 đợt 16
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
      liveHud.ts                   # zustand persist (CHỈ field `hp`, đợt 13
                                   # — xem mục "Đã có") — `maxHp`/Nộ vẫn
                                   # KHÔNG persist, tính lại mỗi mount. Cấp/
                                   # exp/điểm chỉ số KHÔNG ở đây (dời sang
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
                                 # `updateLoadout(spriteUrl, weaponSpriteSrc,
                                 # attackDamage)` (đợt 16) — cập nhật LIVE
                                 # trên scene đang chạy khi đổi nhân vật/vũ
                                 # khí, KHÔNG rebuild scene (trước đó
                                 # `MapCanvas.tsx` rebuild toàn bộ, reset cả
                                 # phòng — bug thật, xem mục 3 đợt 16). Export
                                 # thêm `MAP_SCENE_KEY`/`MapSceneInstance`.
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
      types.ts                  # CharacterId — CHỈ 3 giá trị từ đợt 12
                                # (dog/tiger/panda, rút gọn từ 7 — xem
                                # "public/character/" ở mục 1), CharacterConfig
                                # (spriteSrc/defaultWeaponId/baseHp/baseAttack
                                # — mỗi nhân vật RIÊNG, không còn hằng số
                                # toàn cục)
      data.ts                    # CHARACTERS — 3 nhân vật CHỌN ĐƯỢC (Cẩu
                                 # Nhi/Hổ Nhi/Gấu Trúc), ảnh trong
                                 # `public/character/player/`. 4 nhân vật cũ
                                 # (turtle/deer/dragon/crane) đã rút khỏi
                                 # roster chọn được, ảnh dời sang
                                 # `public/character/npc/` (đợt 12) — turtle
                                 # giờ là Cụ Quy (NPC thật, không chọn được
                                 # nữa). Mỗi nhân vật còn lại
                                 # `baseHp`/`baseAttack` khác nhau theo
                                 # flavor. STAT_POINTS_PER_LEVEL=2
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
  lấy đúng module từ `MAP_MODULES`. Nhân vật mặc định là `dog`
  (`character/player/dog.png`), dùng chung `Actor` (xoay theo hướng
  WASD/mũi tên + nảy slime).
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
  `modules/world/liveHud.ts` (`useLiveHudStore` — `hp` PERSIST từ đợt 13,
  `maxHp`/Nộ vẫn không).
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
  `deer_injured` (`character/villain/deer_injured.png`, `displaySize` 100-120) ở phòng
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
  toàn bộ ảnh trong `public/character/player/` TRỪ `zombie.png` (đã là art
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
  tiên `"turtle_guide"` = Cụ Quy (`character/npc/turtle.png`), đặt ở
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

### 8 việc theo phản hồi thực tế (2026-08-14 đợt 11)

- **Bug thật đã tìm và sửa — tooltip Túi Đồ bị cắt ở cột cuối**:
  `BagPanel.tsx`'s hằng số `GRID_COLS = 4` lệch với className thật `grid
  grid-cols-6` — `tooltipAlign` (quyết định tooltip mở về hướng nào để
  không tràn khỏi `WuxiaModal`) tính theo `i % GRID_COLS`, nên với lưới 6
  cột thật mà chia dư theo 4, cột 5/6 không bao giờ nhận `align="end"`.
  Sửa `GRID_COLS` thành `6`, thêm comment cảnh báo Tailwind không
  interpolate được `grid-cols-${GRID_COLS}` nên 2 con số này phải tự tay
  giữ đồng bộ. Verify bằng Playwright: hover item cột cuối cùng — tooltip
  hiện đầy đủ, không cắt.
- **`QuestTracker.tsx` hover ra card mô tả đầy đủ** — `QuestDef` đã có sẵn
  `objectiveLabel` (mô tả dài), không cần thêm field. Card riêng (không
  phải `WuxiaTooltip`, vốn ép `whitespace-nowrap` chỉ hợp 1 dòng), mở sang
  PHẢI (`left-full`) vì tracker đứng cố định ở mép trái màn hình, không có
  ancestor `overflow-y-auto` nào để lo bug tràn cạnh.
- **Hint "Nhấn Space Để Trò Chuyện" khi gần NPC** — làm phía REACT (không
  vẽ trong Phaser, để chữ không co giãn theo camera zoom động của phòng).
  `modules/npc/interactionHint.ts` (store mới, session-only, đúng bridge
  pattern `combatTarget.ts`): `mapScene.ts`'s `updateNpcInteraction()` ghi
  `nearbyNpcId` mỗi frame ngay tại chỗ đã tính `nearest` (không thêm vòng
  lặp mới). `NpcInteractionHint.tsx` (mới) chỉ hiện khi có NPC gần VÀ
  KHÔNG có dialogue/modal nào đang mở — `MapScreen.tsx` tính điều kiện đó
  (component chỉ nhận `visible` làm prop) vì chỉ `MapScreen` biết cả state
  Phaser (`nearbyNpcId`) lẫn state hội thoại React.
- **`DialogueBox.tsx` thêm thanh countdown 5s trực quan** — tận dụng GSAP
  đã dùng cho fade-in panel (`useGSAP` khoá theo `[index]`), thêm 1 tween
  `scaleX 1→0` đúng bằng `AUTO_ADVANCE_MS/1000` giây trong CÙNG scope —
  tự huỷ/tạo lại mỗi khi đổi dòng hoặc dialogue đóng, không cần thêm
  `setInterval`/state đếm số riêng.
- **Triệu Hồi mở rộng (`SummonPanel.tsx`, `modules/summon/store.ts`)**:
  - Nút "Triệu Hồi x10" cạnh nút x1 — `performSummonBatch(level, 10)` gọi
    `performSummon` lặp lại (không nhân bản logic reward), 1 lượt animation
    quay chung (không lặp 10 lần), kết quả hiện dạng lưới 5 cột thay vì 1
    thẻ.
  - Cấp Tiệm giờ TỰ lên theo lượt quay tích luỹ, không còn tĩnh mãi ở 1:
    state mới `summonExp`, hàm `rollsForLevel(level) = level × 10`
    (đường cong tuyến tính, số thử nghiệm dễ đổi), `recordSummonRoll()`
    (nội bộ, gọi sau MỖI roll thành công dù x1 hay x10) cộng dồn và tự lên
    cấp khi đủ ngưỡng, giữ phần dư (không reset về 0). Thanh EXP nhỏ hiện
    ngay dưới "Cấp Tiệm: X".
  - "Xem Tỉ Lệ Rớt Đồ" đổi từ khung mở-rộng-tại-chỗ (hiện cấp hiện tại +
    cấp kế) sang 1 icon `%` nhỏ mở `SummonRatesModal.tsx` (mới) — liệt kê
    MỌI cấp có ý nghĩa, dừng khi 2 cấp liên tiếp cho ra đúng cùng % (đã
    chạm sàn `MIN_COMMON_WEIGHT` của `getRarityWeights`) thay vì hardcode
    số cấp tối đa.
  - `EdgeTab.tsx` tách từ local trong `CharacterPanel.tsx` ra file dùng
    chung (`src/app/component/EdgeTab.tsx`) — `MarketPanel.tsx` (xem dưới)
    cũng cần "bookmark" tab kiểu đó, 2 nơi dùng là ngưỡng tách theo quy
    ước dự án.
- **Chợ Trời (mới, `modules/market/`)** — tính năng thương mại thứ 2, đặt
  cạnh Tiệm Triệu Hồi ở HUD (`MarketQuickButton.tsx`, icon
  `/icon/market.png`, badge chấm đỏ nhấp nháy khi chưa nhận quà ngày).
  `store.ts` (persist): `stock: MarketListing[]` (6 vũ khí ngẫu nhiên +
  giá, roll rarity qua `rollRarity(1)` — CỐ Ý độc lập với `storeLevel` của
  Tiệm Triệu Hồi, 2 hệ thống tách biệt). `MarketPanel.tsx` 2 tab
  "bookmark" Mua/Bán:
  - Tab Mua: "Làm Mới Cửa Hàng" (tốn Bạc, roll lại toàn bộ `stock`), "Mua
    Thẻ Triệu Hồi" (giá cố định), "Nhận 3 Thẻ Triệu Hồi Miễn Phí" (disable
    nếu đã nhận trong ngày — so `"YYYY-MM-DD"` hôm nay với lần nhận gần
    nhất), lưới `stock` với giá + nút mua từng món.
  - Tab Bán: lưới vũ khí người chơi đang có, giá bán riêng (công thức rẻ
    hơn giá mua) + nút bán từng món.
  - `inventory/store.ts` thêm 2 hàm mới phục vụ Chợ Trời: `removeItem(id)`
    (trước đây CHỈ có `addItem`, chưa có xoá — tự `equipItem(null)` nếu
    xoá đúng món đang mặc, tránh `equippedItemId` trỏ vào vật phẩm không
    còn tồn tại) và `spendCurrency(amount): boolean` (guard "đủ tiền mới
    trừ, báo có trừ được không" — cùng dạng `spendSummonCard()`).
- **Hệ thống mở khoá tính năng (`modules/unlocks/`)** — Túi Đồ, Tiệm Triệu
  Hồi, Chợ Trời đều bắt đầu **khoá** (`false`) cho user mới (Túi Đồ gia
  nhập nhóm này ở đợt 14 — trước đó luôn mở sẵn). `types.ts`'s
  `UnlockableFeature` (value tiếng Anh — MỌI tên biến/hằng trong code đều
  value tiếng Anh, chỉ hiện tiếng Việt ở UI, đúng quy ước xuyên suốt dự
  án) có 7 giá trị: `"bag"` (mở thật, mô tả dưới đây) +
  `"summonStore"`/`"market"`/`"skills"`/`"pet"`/`"mount"`/`"friends"`
  (khoá "cho giai đoạn này" — CHƯA có trigger mở nào. `summonStore`/
  `market` từng unlock CÙNG `bag` từ `first_deer_hunt` ở đợt 14, nhưng
  đợt 15 tách riêng ra theo yêu cầu user — "để sau", chờ 1 trigger khác
  chưa xác định; 4 cái còn lại xem đợt 13). `data.ts`'s
  `UNLOCK_FEATURE_NAMES` là DUY NHẤT chỗ ánh xạ sang tên hiển thị tiếng
  Việt; `LOCKED_FEATURE_HINT` là câu tooltip dùng CHUNG mọi nút khoá.
  `store.ts` (persist) giữ cờ `unlocked` thật, dùng `merge` TÙY CHỈNH
  (không phải shallow-merge mặc định của `persist`) vì `unlocked` là
  object lồng — cần merge sâu 1 cấp để field mới thêm sau không bị mất
  khi đọc lại localStorage cũ; `announcement.ts` (KHÔNG persist) giữ hàng
  đợi `pending: UnlockableFeature[]` "vừa mở khoá, cần chào mừng" TÁCH
  RIÊNG khỏi cờ thật — lỡ reload giữa chừng thì mất thông báo (chấp nhận
  được) thay vì overlay tự bật lại mỗi lần load trang. `unlockFeature()`
  idempotent — gọi lại khi đã mở khoá rồi thì im lặng, không đẩy thêm vào
  hàng đợi.
  - **`FeatureUnlockOverlay.tsx` — mini "onboarding tour", không chỉ chào
    mừng suông (đợt 14)**: chỉ hiện ĐÚNG `pending[0]` (1 tính năng 1 lúc) —
    mở NHIỀU tính năng cùng lúc (cơ chế hỗ trợ sẵn, dù hiện tại chỉ có
    `bag` unlock nên luôn chỉ 1 thẻ — xem đợt 15 dưới) sẽ đi qua lần lượt
    từng thẻ thay vì dồn hết tên vào 1 card như trước. Mỗi thẻ: tên tính
    năng + mô tả ngắn + `ImageCarousel.tsx` (mới, `app/component/` — mũi
    tên trái/phải + chấm tròn, không tự chạy, duyệt thủ công, clamp không
    lặp vòng) lấy nội dung từ `modules/unlocks/guides.ts`'s
    `FEATURE_GUIDES` (file MỚI, DUY NHẤT chỗ chứa tên/mô tả/carousel —
    `Partial<Record<UnlockableFeature, FeatureGuide>>`; `summonStore`/
    `market` vẫn giữ entry dù chưa có trigger — nội dung vẫn đúng bất kể
    lúc nào trigger đó được thêm; không có entry thì overlay tự rơi về
    chỉ hiện tên, không crash). Nút đổi chữ theo hàng đợi còn lại: "Tiếp
    Theo" nếu còn thẻ sau, "Tiếp Tục" nếu là thẻ cuối; dòng phụ "còn N
    tính năng mới nữa" khi > 1. z-index CAO NHẤT toàn app (`z-[60]`, vượt
    cả `DeathNotice`'s `z-50`), card lấp lánh LIÊN TỤC (GSAP glow pulse
    lặp vô hạn — khác hẳn `DeathNotice` chỉ fade-in rồi đứng yên), đóng
    bằng click (backdrop hoặc nút) HOẶC phím Space — dismiss giờ gọi
    `dismissCurrentAnnouncement()` (bỏ phần tử đầu hàng đợi) thay vì xoá
    sạch hàng đợi.
  - **Nội dung carousel ưu tiên HÌNH ẢNH, hạn chế liệt kê từ ngữ mang tính
    value (đợt 14 — xem SKILL.md mục 2's rule mới)**: `FEATURE_GUIDES`
    dùng lại icon/sprite đã có sẵn trong app (`coins.png`, `summon_card.png`,
    sprite vũ khí `weapon-display/`, ...) thay vì cần art mới, mô tả text đi
    kèm giữ ngắn, không liệt kê tên các loại tiền/vật phẩm lặp đi lặp lại.
  - **Trigger hiện tại (đợt 15 — sửa lại từ đợt 14)**: hoàn thành nhiệm vụ
    `first_deer_hunt` (trả cho Cụ Quy) CHỈ mở khoá `bag` — đợt 14 ban đầu
    mở cả `summonStore`/`market` cùng lúc, nhưng user muốn 2 tính năng đó
    "để sau" (chưa xác định trigger nào), nên đã bỏ 2 dòng
    `unlockFeature("summonStore")`/`unlockFeature("market")` khỏi
    `MapScreen.tsx`, chỉ còn `unlockFeature("bag")` — hardcode ngay tại
    điểm gọi (`if (quest.id === "first_deer_hunt") { unlockFeature("bag") }`),
    KHÔNG phải field tổng quát trong `QuestDef`, vì mới có đúng 1 quest —
    chưa đủ ví dụ để biết hình dạng tổng quát đúng. **`GameHud.tsx`/
    `ShelfNav.tsx` LUÔN render nút của tính năng chưa mở (đổi ở đợt 13) —
    không còn ẩn hẳn như trước; Túi Đồ (đợt 14) giờ đi qua đúng cơ chế
    này ở `ShelfNav.tsx` thay vì luôn mở sẵn.**
- **Nhiệm vụ thưởng được vật phẩm, không chỉ vàng/exp** — `QuestDef` thêm
  field tuỳ chọn `rewardItem?: InventoryItem`. `first_deer_hunt` giờ
  thưởng thêm 1 khẩu `vlr_primevandal` huyền thoại (Cụ Quy cho mượn,
  `statBonus` cả `attack` lẫn `hp` cùng lúc — chỉ roll ngẫu nhiên mới luôn
  chọn 1 trong 2, vật phẩm thưởng tay thì không bị giới hạn đó).
  `MapScreen.tsx`'s `handleNpcDialogueDone`'s nhánh `"turnIn"` gọi thẳng
  `addItem(quest.rewardItem)` cạnh `gainExp`/`addCurrency` đã có —
  `InventoryItem` vốn đã luôn cho phép tạo thủ công (không bắt buộc phải
  roll ngẫu nhiên qua Triệu Hồi), không cần cơ chế mới.
- **Bug có sẵn từ trước, phát hiện lúc test Triệu Hồi x10 (không liên quan
  đợt này)**: `public/weapon-display/pvz_chili.png` bị thiếu file dù
  `WeaponTypeId "pvz_chili"` đã khai trong `inventory/data.ts` — roll
  đúng loại vũ khí đó thì ảnh lỗi 400. Chưa sửa (không có file ảnh đúng để
  thêm) — cần cung cấp asset hoặc bỏ hẳn entry này khỏi
  `WEAPON_TYPE_IDS`/`WEAPON_TYPES`.

### 5 việc theo phản hồi thực tế (2026-08-17 đợt 13)

- **Tính năng chưa mở LUÔN hiện, chỉ mờ đi (đổi hành vi từ đợt 11)** —
  `SummonQuickButton.tsx`/`MarketQuickButton.tsx` đổi từ `{unlocked &&
  <Button/>}` (ẩn hẳn) sang props `unlocked: boolean` luôn render, mờ
  `opacity ~0.5` + icon `grayscale` khi khoá, tooltip đổi thành
  `LOCKED_FEATURE_HINT` ("Tiếp tục khám phá để mở khoá tính năng này").
  **Cố ý KHÔNG dùng attribute `disabled` native** — nút `disabled` không
  nhận `:hover` ở hầu hết trình duyệt, mà tooltip dựng bằng CSS
  `group-hover` nên sẽ im theo, hỏng đúng mục đích "hover để biết chưa
  mở"; thay vào đó nút vẫn enabled thật, chỉ `onClick={locked ? undefined
  : onOpen}` no-op khi khoá.
- **Kỹ Năng/Thú Cưng/Thú Cưỡi/Bạn Bè cũng khoá "cho giai đoạn này"** —
  cùng cơ chế/pattern như trên, `ShelfNav.tsx`'s `Bubble` thêm prop
  `locked`. `modules/unlocks/types.ts`'s `UnlockableFeature` thêm 4 giá
  trị mới (`skills`/`pet`/`mount`/`friends`) — khác `summonStore`/`market`
  ở chỗ CHƯA có trigger nào gọi `unlockFeature()` cho 4 cái này, chúng
  khoá vĩnh viễn cho tới khi 1 bản cập nhật sau thêm trigger thật. Túi Đồ
  (`bag`) KHÔNG nằm trong hệ thống khoá — quản lý đồ đạc cơ bản không có
  lý do gì để chặn.
- **`liveHud.ts`'s `hp` giờ PERSIST** (`wulin-live-hud`, chỉ field `hp`
  qua `partialize` — `maxHp`/`rage`/`maxRage` vẫn KHÔNG persist, tính lại
  mỗi mount) — bug thật: trước đó `hp` mặc định hardcode `100` mỗi lần
  reload/login lại rồi để regen 1/s tick dần lên, sai rõ với nhân vật có
  `maxHp` khác 100 (VD gấu trúc 150 máu gốc) — hiện tụt xuống 100/150 rồi
  mới hồi từ từ lên thay vì giữ nguyên máu của phiên trước. Giờ máu giữ
  nguyên qua reload (hoặc full nếu chưa từng chơi, vì mặc định store vẫn
  là nhân vật `dog` có `baseHp` đúng bằng 100).
- **`QuestOfferModal.tsx` + `QuestTracker.tsx` hiện phần thưởng preview
  ("Phần Thưởng")** — component dùng chung mới `QuestRewardPreview.tsx`
  (`app/component/`): badge `+N EXP`, badge Bạc (icon `coins.png`), và
  nếu `QuestDef.rewardItem` có thật thì thêm 1 badge icon+viền-màu-phẩm-
  chất (tái dùng đúng style icon-slot của `BagPanel.tsx`'s `ItemSlot`,
  không bịa layout mới) — hiện NGAY khi mời nhận nhiệm vụ, trước khi
  người chơi bấm "Nhận Nhiệm Vụ".
- **`QuestTracker.tsx` cho bấm vào để mở lại chi tiết nhiệm vụ** — mỗi
  dòng quest giờ là `<button>` (giữ nguyên hover-card mô tả ngắn có sẵn từ
  đợt 11), bấm vào gọi `onSelectQuest(id)` (prop mới) mở
  `QuestDetailModal.tsx` (mới) — tiêu đề + mô tả đầy đủ + tiến độ +
  `QuestRewardPreview`. **Bug thật gặp lúc build, đã sửa**:
  `QuestDetailModal` PHẢI render ở `GameHud.tsx`'s top level (ngang hàng
  `BagPanel`/`SkillsPanel`/...), KHÔNG được render lồng bên trong
  `QuestTracker.tsx` — `QuestTracker` sống bên trong wrapper `fixed
  left-4 top-4` của `GameHud`, wrapper `fixed` đó tự trở thành containing
  block, nên `WuxiaModal`'s `absolute inset-0` nếu lồng bên trong sẽ tính
  kích thước theo cái wrapper NHỎ đó thay vì toàn màn hình — screenshot
  test thấy modal bị ghim/cắt ở góc trên-trái thay vì hiện giữa màn hình
  full-viewport như mọi hub panel khác. Sửa bằng cách nâng state
  `questDetailId` lên `GameHud.tsx`, `QuestTracker` chỉ còn gọi callback —
  đúng pattern `onOpenCharacter`/`activePanel` mọi hub panel khác đã dùng
  sẵn.

### Túi Đồ khoá + mini onboarding tour cho tính năng mới mở (2026-08-17 đợt 14)

- **Quy ước UI mới — hạn chế từ ngữ mang tính value, ưu tiên icon/hình
  ảnh**: xem SKILL.md mục 2's bullet mới. Áp dụng ngay trong đợt này ở
  nội dung carousel bên dưới — chưa đụng lại các panel cũ (`BagPanel`/
  `MarketPanel`/`SummonPanel`) vì chúng vốn đã ghép icon+số+nhãn ngắn,
  đúng tinh thần quy ước; việc retrofit toàn diện (nếu cần) để dành cho
   lúc có yêu cầu rõ ràng hơn, tránh sửa lại UI đã verify mà không ai yêu
  cầu.
- **Túi Đồ giờ cũng khoá từ đầu, mở cùng lúc với Tiệm Triệu Hồi/Chợ Trời**
  — trước đó Túi Đồ là tính năng DUY NHẤT không nằm trong hệ thống khoá
  (quản lý đồ đạc cơ bản). `UnlockableFeature` thêm `"bag"`,
  `ShelfNav.tsx`'s Túi Đồ bubble đổi `feature: null` → `feature: "bag"`,
  `MapScreen.tsx`'s `first_deer_hunt` turn-in giờ gọi thêm
  `unlockFeature("bag")` cạnh 2 dòng cũ. Trước khi hoàn thành nhiệm vụ đầu
  tiên, người chơi chỉ chiến đấu bằng vũ khí mặc định (`CHARACTERS`'s
  `defaultWeaponId`) — không mở được Túi Đồ để xem/đổi vũ khí, đúng ý đồ
  "Cụ Quy dạy cách quản lý đồ đạc" cùng lúc với việc giới thiệu 2 tính
  năng thương mại.
- **Mini onboarding tour khi mở khoá — không chỉ chào mừng suông nữa**:
  xem mục 3's bullet "Hệ thống mở khoá tính năng" ở trên đã viết lại đầy
  đủ (`FeatureUnlockOverlay.tsx` tour từng tính năng 1 lúc,
  `ImageCarousel.tsx` mới, `modules/unlocks/guides.ts` — **file nội dung
  tổng quát DUY NHẤT** mô tả tên/mô tả/carousel ảnh cho từng tính năng,
  người dùng yêu cầu cụ thể file này để phục vụ việc hướng dẫn). Ví dụ nội
  dung: Túi Đồ mô tả "xem tài sản đang có, lướt qua từng món vũ khí, rồi
  trang bị món hợp nhất trước khi đối đầu quái/trùm" kèm carousel icon túi
  + Bạc + Thẻ Triệu Hồi + 1 sprite vũ khí huyền thoại (chính là phần
  thưởng vừa nhận từ Cụ Quy — cố ý chọn ảnh liên quan trực tiếp thay vì
  ảnh minh hoạ chung chung).
- **`announcement.ts` đổi từ "xoá sạch hàng đợi" sang "duyệt qua từng
  phần tử"** — `clearAnnouncement()` (xoá hết `pending` cùng lúc) đổi
  thành `dismissCurrentAnnouncement()` (`pending.slice(1)`, bỏ đúng phần
  tử đầu) — cần thiết vì giờ 1 lần mở khoá có thể có NHIỀU tính năng
  (VD 3 cái cùng lúc từ `first_deer_hunt`) và tour phải đi qua từng cái,
  không dồn hết vào 1 card như đợt 11-13.
- **Xác minh bằng Playwright**: do phòng `0-1` (đường tới Cụ Quy) là
  "phòng test nguy hiểm" user tự chỉnh số liệu quái (sát thương/aggro rất
  cao) khiến việc lái nhân vật đi qua bằng script khó tin cậy và rủi ro
  chết giữa chừng, verify UI lần này dùng 1 debug hook TẠM (query param
  `?debugUnlock=1` gọi thẳng `unlockFeature()` cho cả 3 tính năng ở
  `MapScreen.tsx`'s mount effect) thay vì đi hết đường — đã xoá hoàn toàn
  hook này khỏi code trước khi hoàn tất, `git diff` chỉ còn đúng
  `unlockFeature("bag")`/`unlockFeature("summonStore")`/
  `unlockFeature("market")` như mô tả ở trên. Xác nhận: overlay hiện đúng
  3 thẻ theo thứ tự Túi Đồ → Tiệm Triệu Hồi → Chợ Trời, carousel bấm mũi
  tên/chấm tròn chuyển ảnh đúng, nút đổi "Tiếp Theo"/"Tiếp Tục" đúng lúc,
  sau khi đóng hết cả 3 thẻ thì cả 3 tính năng mở được thật. **Lưu ý: 2
  dòng `unlockFeature("summonStore")`/`unlockFeature("market")` đã bị bỏ
  ở đợt 15 ngay sau đó — xem mục con dưới đây.**

### Chỉ mở khoá Túi Đồ từ `first_deer_hunt`, Tiệm Triệu Hồi/Chợ Trời để sau (2026-08-17 đợt 15)

- User phản hồi ngay sau đợt 14: hoàn thành `first_deer_hunt` chỉ nên mở
  khoá Túi Đồ — Tiệm Triệu Hồi và Chợ Trời "để sau" (chưa quyết định
  trigger nào). Sửa: bỏ `unlockFeature("summonStore")`/
  `unlockFeature("market")` khỏi `MapScreen.tsx`'s `first_deer_hunt`
  turn-in, chỉ giữ `unlockFeature("bag")`.
- `summonStore`/`market` giờ ở đúng nhóm với `skills`/`pet`/`mount`/
  `friends` — khoá, KHÔNG có trigger mở nào trong code hiện tại (xem
  `types.ts` doc comment) — nút HUD tương ứng vẫn hiện, chỉ mờ đi +
  tooltip `LOCKED_FEATURE_HINT`, đúng cơ chế đợt 13, không cần sửa gì ở
  `SummonQuickButton.tsx`/`MarketQuickButton.tsx`.
- `modules/unlocks/guides.ts`'s `FEATURE_GUIDES` GIỮ NGUYÊN entry cho
  `summonStore`/`market` dù chưa có trigger — nội dung carousel vẫn đúng,
  chỉ cần thêm `unlockFeature(...)` ở đâu đó trong tương lai là tour tự
  hoạt động, không cần viết lại nội dung.
- **Xác minh lại bằng debug hook tạm** (cùng kỹ thuật đợt 14, chỉ gọi
  `unlockFeature("bag")`): overlay giờ chỉ hiện ĐÚNG 1 thẻ Túi Đồ, nút
  ngay từ đầu là "Tiếp Tục" (không phải "Tiếp Theo", vì hàng đợi chỉ có 1
  phần tử); sau khi đóng, Túi Đồ mở được, nhưng Tiệm Triệu Hồi vẫn mờ +
  bấm không mở panel (đúng, vẫn khoá). Xoá sạch debug hook trước khi
  hoàn tất — `git diff` cuối cùng chỉ còn đúng 1 dòng `unlockFeature("bag")`
  thay thế 2 dòng cũ.

### 2 bug/tính năng theo phản hồi thực tế (2026-08-17 đợt 16)

- **Bug thật đã tìm và sửa — đổi nhân vật/vũ khí làm reset cả phòng
  (quái hồi sinh, người chơi bật về điểm vào phòng)**: nguyên nhân là
  `MapCanvas.tsx`'s rebuild `useEffect` có `spriteUrl`/`weaponSpriteSrc`/
  `playerAttackDamage` chung dependency array với các prop THẬT SỰ gắn
  danh tính phòng (`floorSrc`/`walls`/`monsters`/`npcs`/`spawnAt`/...) —
  nên bất kỳ thay đổi nào ở 3 giá trị đó (đổi nhân vật hoặc vũ khí ở
  `CharacterPanel`) cũng khiến effect chạy lại `game.destroy(true)` + `new
  Phaser.Game(...)` y hệt lúc đổi phòng thật, dù CHẲNG CÓ GÌ về phòng thay
  đổi cả.
  - **Sửa**: tách `spriteUrl`/`weaponSpriteSrc`/`playerAttackDamage` khỏi
    effect rebuild — effect đó giờ chỉ phụ thuộc các prop thật sự là danh
    tính phòng. Thêm effect THỨ HAI, gọi `mapScene.ts`'s `updateLoadout()`
    (method mới trên class scene) mỗi khi 3 giá trị này đổi, cập nhật
    scene ĐANG CHẠY thay vì rebuild:
    - `currentAttackDamage` (field mới) thay cho việc `fireAttack()` đọc
      thẳng biến closure `playerAttackDamage` — giờ luôn dùng giá trị mới
      nhất.
    - Texture người chơi/vũ khí đổi từ key CỐ ĐỊNH (`"room-player"`/
      `"weapon"`) sang key ĐỘNG theo chính src ảnh
      (`player:${src}`/`weapon:${src}`) — đổi qua lại nhiều lần (VD thử
      hết 3 nhân vật) tái dùng texture đã load thay vì load lại mỗi lần;
      texture MỚI (chưa từng load) thì `this.load.image(...)` +
      `this.load.start()` (loader chỉ tự chạy 1 lần lúc boot, phải gọi
      tay cho bất kỳ thứ gì thêm vào SAU `preload()`), xong mới
      `setTexture()`.
    - `Actor` (`modules/world/actor.ts`) thêm method `setTexture(key)` —
      swap ảnh + tính lại `baseScaleX`/`baseScaleY` theo tỉ lệ ảnh mới
      (cần cho animation hop/squash trong `update()` đo đúng baseline),
      không đụng gì khác của actor (vị trí, facing, shadow, ...).
    - `mapScene.ts` export thêm `MAP_SCENE_KEY`/`MapSceneInstance` để
      `MapCanvas.tsx` lấy đúng instance scene đang chạy qua
      `game.scene.getScene(MAP_SCENE_KEY)` có type, gọi `updateLoadout()`
      không cần ép kiểu `any`.
  - **Xác minh**: dùng `console.log` tạm đếm số lần `new Phaser.Game()`
    được gọi — đổi nhân vật trong `CharacterPanel`: số lần rebuild KHÔNG
    đổi (0 lần rebuild thêm, xác nhận qua Playwright); đi sang phòng khác
    thật sự: số lần rebuild TĂNG đúng như trước (xác nhận effect tách
    riêng không phá behavior rebuild-khi-đổi-phòng vốn có). Xoá log tạm
    trước khi hoàn tất.
- **Hover xem vũ khí trong Túi Đồ đổi từ `WuxiaTooltip` (1 dòng) sang
  `ItemDetailCard.tsx` (mới, `app/component/`)**:
  - **Bug thật phát hiện lúc sửa**: tooltip cũ dùng
    `item.statBonus.hp ? hpLine : attackLine` — chỉ hiện ĐÚNG 1 trong 2
    stat, dù `InventoryItem.statBonus` có thể có CẢ `hp` LẪN `attack`
    cùng lúc (VD vật phẩm thưởng nhiệm vụ đầu tiên: `{ attack: 150, hp:
    400 }`) — âm thầm mất thông tin, người chơi không bao giờ thấy được
    stat còn lại qua hover.
  - Card mới hiện ảnh vũ khí (to hơn hẳn icon nhỏ trong ô) + tên + phẩm
    chất (màu theo `RARITY_CONFIG`) + cấp + MỌI stat có giá trị (không
    còn ternary either/or). `BagPanel.tsx`'s `ItemSlot` dùng lại —
    `cardAlign` theo CỘT như tooltip cũ (cột đầu "start"/cột cuối "end",
    tránh tràn cạnh `WuxiaModal`), thêm mới `cardPlacement` theo HÀNG
    (hàng đầu `"bottom"` — bật xuống dưới thay vì lên trên như mặc định).
  - **Bug thật thứ 2 phát hiện lúc test**: card cao hơn hẳn tooltip cũ
    (~190px so với ~24px), nên panel ít đồ (VD vừa mở khoá Túi Đồ, chỉ có
    đúng 1 món — tình huống PHỔ BIẾN NHẤT thực tế, không phải hiếm) khiến
    card tràn ra khỏi biên `WuxiaModal`'s content pane
    (`overflow-y-auto`) và bị CẮT CỨNG — thử đổi hướng bật lên/xuống chỉ
    đổi biên nào bị cắt (lên: đè che vùng tiêu đề modal; xuống: cắt ở
    đáy panel), pane quá ngắn để chứa đủ CHO DÙ hướng nào (đây là đúng
    bug class "`overflow-y-auto` ép `overflow-x` cũng `auto`, cắt luôn
    thay vì chỉ trông chật" đã ghi trong `WuxiaTooltip.tsx`'s doc
    comment, chỉ là lần này card đủ cao để lộ rõ ra, tooltip cũ nhỏ nên
    chưa từng bị thấy).
    - **Sửa**: dành sẵn "flow-height" THẬT (không phải `position:
      absolute`, để `overflow-y-auto` tính nó vào chiều cao thật của
      pane) — `BagPanel.tsx` thêm 1 spacer `<div className="h-52" />`
      ngay sau lưới vật phẩm, CHỈ render khi `items.length <=
      GRID_COLS` (đúng 1 hàng — trường hợp không có hàng thứ 2 bên dưới
      để "mượn" chiều cao tự nhiên cho card bật xuống). Có ≥ 2 hàng thì
      hàng thứ 2 trở đi đã tự cho đủ khoảng trống, spacer không cần
      thiết nữa (không render, tránh khoảng trắng thừa vô cớ).
    - Cố tình KHÔNG dùng portal đo vị trí bằng JS — giữ đúng convention
      "hover card thuần CSS" (`group`/`group-hover:opacity-100`) mà
      `WuxiaTooltip.tsx`/`QuestTracker.tsx`'s hover card đã dùng.

### Sửa màu "Huyền Thoại" bị chìm vào nền giấy da (2026-08-17 đợt 17)

- **Bug thật đã tìm và sửa**: `RARITY_CONFIG.legendary.color`
  (`modules/summon/data.ts`) là `#f2c66d` — 1 màu vàng nhạt được chọn vì
  hợp Ý NGHĨA ("gold = huyền thoại"), nhưng độ SÁNG của nó gần bằng hệt nền
  giấy da mà `WuxiaModal` dùng khắp app (gradient `#f4e6c4`→`#d9bd83`) —
  chênh lệch độ sáng quá nhỏ để mắt phân biệt được chữ với nền, nên mọi chữ/
  badge màu "Huyền Thoại" gần như vô hình bất kể xuất hiện ở đâu:
  `ItemDetailCard.tsx` (tên phẩm chất), `SummonRatesModal.tsx` (cột tỉ lệ),
  `MarketPanel.tsx` (nhãn phẩm chất trong lưới mua/bán), `SummonPanel.tsx`
  (thẻ kết quả quay).
- **Sửa**: đổi thành `#b8892f` — vàng ĐẬM hơn hẳn, đủ tương phản với nền
  giấy da. Chỉ cần sửa ĐÚNG 1 chỗ (`RARITY_CONFIG`) vì mọi component trên
  đều đọc màu qua đây (`rarity.color`), không có component nào tự định
  nghĩa lại màu riêng. Không phải màu tự bịa — `#b8892f` đã được dùng làm
  màu CHỮ trên đúng nền giấy da này ở nơi khác trong app
  (`SkillsPanel.tsx`'s nhãn yêu cầu tiên quyết), nên biết chắc đọc được
  trước khi áp dụng, không phải đoán.
- **Quy tắc rút ra cho lần sau** (đã ghi vào SKILL.md mục 4): chọn màu chữ/
  badge mới phải kiểm tra tương phản với nền THẬT nó sẽ nằm trên (đa số UI
  wuxia trong app dùng nền giấy da SÁNG qua `WuxiaModal`, không phải nền
  tối của HUD) — 2 màu khác hue nhưng gần nhau về độ sáng vẫn coi như
  "trùng màu" về mặt đọc được, đặc biệt dễ mắc với nhóm màu vàng/nhạt/sáng
  vì cả bảng màu wuxia của app vốn đã ấm/vàng-nâu.
- **Xác minh bằng Playwright**: seed 1 vật phẩm huyền thoại vào Túi Đồ,
  hover ra `ItemDetailCard` — dòng "Huyền Thoại · Cấp N" đọc rõ; mở
  "Xem Tỉ Lệ Rớt Đồ" ở Tiệm Triệu Hồi — cột "HUYỀN THOẠI" và các số % của
  nó đọc rõ, không còn lẫn vào nền giấy da.

### Icon hoá value ở Tiệm Triệu Hồi/Chợ Trời (2026-08-19 đợt 18)

- User yêu cầu áp dụng THẬT SỰ quy ước "hạn chế từ ngữ mang tính value,
  ưu tiên icon" (đã ghi vào SKILL.md từ đợt 14 nhưng lúc đó chỉ mới dùng
  cho nội dung MỚI viết — carousel mở khoá tính năng — chưa sửa lại UI cũ
  của Tiệm Triệu Hồi/Chợ Trời).
- **`CurrencyValue.tsx` (mới, `app/component/`)** — icon + số, tổng quát
  hoá đúng pattern `SummonQuickButton.tsx`'s badge số lượng Thẻ Triệu Hồi
  (icon + số, không chữ) vốn đã có sẵn trong app. Chỉ nhận `iconSrc` trực
  tiếp (không dựng enum loại tiền) vì chỉ có đúng 2 loại "tiền" thật trong
  game: Bạc (`coins.png`) và Thẻ Triệu Hồi (`summon_card.png`).
- **`SummonPanel.tsx`**: "Thẻ Triệu Hồi: N" (chữ + số) đổi thành
  `CurrencyValue` (icon thẻ + số).
- **`MarketPanel.tsx`**: đổi TẤT CẢ chỗ hiện "N Bạc"/"N Thẻ Triệu Hồi"
  dạng chữ sang `CurrencyValue` — số Bạc đầu trang, nút "Làm Mới Cửa
  Hàng" (giá), nút "Mua Thẻ Triệu Hồi" (cả số lượng mua VÀ giá — 2
  `CurrencyValue` trong 1 nút), nút nhận quà ngày (số thẻ miễn phí),
  `ListingCard`'s nút mua (giá), `SellCard`'s nút bán (giá).
- **Cố tình KHÔNG đổi** (đúng phạm vi quy ước — chỉ áp dụng cho VALUE
  tiền/số lượng, không phải mọi con số trong UI):
  - "Cấp Tiệm: N" — không phải currency, là chỉ số tier/level; không có
    icon "cấp độ" nào trong `public/icon/`, và mọi nơi khác trong app
    (VD `ItemDetailCard`, `CharacterPanel`) đều hiện "Cấp N" dạng chữ,
    đổi riêng ở đây sẽ lệch quy ước chung.
  - Nhãn `+N Máu`/`+N Tấn Công` trên vật phẩm — đây là TÊN CHỈ SỐ (stat),
    không phải "giá trị tiền tệ"; không có icon Máu/Tấn Công sẵn có, tự
    vẽ icon mới cho việc này là vượt phạm vi được yêu cầu.
  - Tiêu đề mục ("Vật phẩm đang bán", "Vũ khí đang có") — nhãn mục đọc 1
    lần, không lặp lại nhiều số như 1 giá trị currency thật sự cần đơn
    giản hoá.
- **Xác minh bằng Playwright**: mở cả 2 panel, seed sẵn Bạc/Thẻ Triệu Hồi/
  1 vật phẩm huyền thoại — xác nhận mọi nơi hiện giá trị đều có icon kèm
  số, không còn chữ "Bạc"/"Thẻ Triệu Hồi" viết tay ở bất kỳ đâu đang hiện
  GIÁ TRỊ thật (số dư, giá mua/bán, số lượng nhận được); không lỗi
  console.

### Layout lại Tiệm Triệu Hồi/Chợ Trời/Túi Đồ (2026-08-19 đợt 19)

- **`WuxiaModal.tsx` thêm prop `titleRight`** — `ReactNode` render CÙNG
  hàng với tiêu đề (`justify-between`) thay vì bên dưới. `SummonPanel.tsx`/
  `MarketPanel.tsx` dùng để hiện Bạc/Thẻ Triệu Hồi ngay cạnh tiêu đề, nhìn
  thấy ngay không cần đọc xuống nội dung panel.
- **Tiệm Triệu Hồi — mua Thẻ Triệu Hồi trực tiếp, không cần sang Chợ
  Trời**: nút "+" tròn xanh lá cạnh số thẻ (trong `titleRight`) mở
  `BuySummonCardsModal.tsx` (mới) — MODAL CHỒNG MODAL (Tiệm Triệu Hồi vẫn
  còn phía sau, không bị thay thế), chọn số lượng bằng nút +/- (clamp
  `[1,99]`), xem tổng giá, "Xác Nhận Mua" gọi `buySummonCards(count)`
  (mới, `modules/summon/store.ts`) — check TOÀN BỘ chi phí (`count ×
  SUMMON_CARD_BUY_PRICE`) upfront rồi mới trừ/cộng, không loop mua từng
  cái 1 (tránh mua dở dang nếu hết tiền giữa chừng). `SUMMON_CARD_BUY_PRICE`
  dời từ `modules/market/data.ts` sang `modules/summon/data.ts` — 200
  Bạc/thẻ (trước đó 100, ở Chợ Trời) — vì hành động "mua thẻ" giờ thuộc
  hẳn về domain Tiệm Triệu Hồi.
- **Chợ Trời layout lại theo yêu cầu cụ thể**:
  - Bỏ hẳn nút "Mua Thẻ Triệu Hồi" — dời sang Tiệm Triệu Hồi (mục trên).
  - Nút "Làm Mới" (reset danh sách bán) đổi từ nút to đứng riêng sang icon
    `RotateCw` + giá, đặt space-between ngay cạnh tiêu đề mục "VẬT PHẨM
    ĐANG BÁN" thay vì 1 hàng nút riêng phía trên.
  - **Quà ngày đổi hẳn cách thể hiện**: từ nút chữ "Nhận N Thẻ Triệu Hồi
    Miễn Phí"/"Đã Nhận Quà Hôm Nay" sang 1 icon quà (`Gift`, lucide —
    chưa có art riêng trong `public/icon/`) lúc lắc nhẹ + toả sáng LIÊN
    TỤC (GSAP — `DailyGiftButton`, timeline xoay qua lại + glow pulse vô
    hạn) đặt trong `titleRight`, NGAY TRƯỚC value Bạc. CHỈ hiện khi
    `!claimed` — đã nhận (hoặc không có quà) thì biến mất hẳn, không còn
    trạng thái xám "đã nhận" chiếm chỗ trên UI như trước. Bấm vào hiện
    toast "Chúc mừng! Nhận [icon]N" — GSAP fade-in rồi tự fade-out sau
    ~1.6 giây, KHÔNG dùng `position: absolute` cho toast (tránh đúng bug
    class `overflow-y-auto` cắt nội dung tràn đã gặp nhiều lần trong dự
    án này — toast nằm trong flow bình thường, đẩy nội dung bên dưới
    xuống tạm thời thay vì chồng lên).
- **`SellCard` (Chợ Trời/tab Bán)** — bỏ chữ "(Đang mặc)" nối vào tên vũ
  khí, đổi thành badge dấu tick góc trên-phải (đúng pattern
  `BagPanel.tsx`'s `ItemSlot`) khi đang trang bị, VÀ nút "Bán" tự khoá
  (`disabled`, mờ 40%) — bán nhầm vũ khí đang cầm giữa trận là điều không
  ai muốn bấm nhầm, chặn hẳn thay vì chỉ cảnh báo bằng chữ.
- **`BagPanel.tsx`** — bỏ `ResourceStat` (khung viền 2px + icon + nhãn chữ
  + số) cho Bạc/Thẻ Triệu Hồi, thay bằng `CurrencyValue` trần (chỉ icon +
  số, không khung/viền/nhãn) — theo đúng yêu cầu "đơn giản hoá", vẫn liệt
  kê đủ 2 giá trị, chỉ bỏ phần trang trí khung.
- **Xác minh bằng Playwright**: mua 3 Thẻ Triệu Hồi qua modal chồng modal
  (Bạc/thẻ đúng số sau khi trừ/cộng — 200×3=600 Bạc trừ đúng, +3 thẻ cộng
  đúng); nhận quà ngày hiện toast rồi tự biến mất, icon quà tự ẩn ngay sau
  khi nhận; `SellCard` khoá đúng item đang trang bị (nút mờ, không bấm
  được), item khác vẫn bán bình thường; không lỗi console trong toàn bộ
  luồng.

### Sửa clip hover card Túi Đồ (2026-08-19 đợt 20)

- **Bug thật đã tìm và sửa**: đợt 16 từng sửa `ItemDetailCard` (hover card
  vũ khí trong `BagPanel.tsx`) bị `WuxiaModal`'s `overflow-y-auto` cắt khi
  túi đồ chỉ có ĐÚNG 1 hàng vật phẩm — thêm 1 spacer `h-52` dành chỗ,
  nhưng điều kiện render spacer đó (`items.length <= GRID_COLS`) hoá ra
  vẫn còn lỗ hổng: item ở HÀNG ĐẦU luôn bật card xuống CÁCH 1 KHOẢNG CỐ
  ĐỊNH (~193px) tính từ chính hàng đó — khoảng cách này KHÔNG phụ thuộc
  còn bao nhiêu hàng phía dưới. Với túi đồ có 2+ hàng nhưng hàng CUỐI
  ngắn (VD 8 món = hàng 1 đủ 6 + hàng 2 chỉ 2 món), hàng 2 chỉ cho thêm
  ~82px chiều cao thật (1 ô vuông + khoảng cách hàng) — không đủ 193px
  cần thiết, nên card hàng đầu vẫn bị cắt y hệt trước khi sửa đợt 16, dù
  đã có "hàng thứ 2". Phải có ĐỦ hàng ĐẦY (~3 hàng, 24+ món) may ra mới
  đủ chiều cao tự nhiên — con số gần như không bao giờ đạt ở giai đoạn
  chơi sớm, tức bug này ảnh hưởng HẦU HẾT túi đồ có nhiều hơn 1 hàng
  trong thực tế.
- **Sửa**: bỏ hẳn điều kiện `items.length <= GRID_COLS` — spacer giờ LUÔN
  render khi `items.length > 0`, không cần tính "bao nhiêu hàng là đủ" cho
  từng trường hợp cụ thể nữa. Đổi lại là 1 khoảng trắng cố định ~208px
  luôn xuất hiện cuối lưới vật phẩm (kể cả khi đã có nhiều hàng, vô hại) —
  đơn giản và đúng trong MỌI trường hợp, chấp nhận đánh đổi 1 chút khoảng
  trắng thừa để không còn edge case nào bị bỏ sót.
- **Xác minh bằng Playwright**: seed 8 món (đúng ca lỗi — hàng 2 ngắn) —
  hover cả 3 vị trí cột (trái/giữa/phải) của hàng đầu đều hiện đầy đủ ảnh
  + tên + phẩm chất + cấp + chỉ số, không còn bị cắt. Test thêm với 20
  món (nhiều hàng đầy hơn) — hover hàng đầu, hàng giữa, món cuối cùng đều
  đúng, không món nào bị cắt hay tràn ra ngoài modal.

### Túi Đồ phân trang (2026-08-19 đợt 21)

- User chủ động yêu cầu đón đầu — chưa cần thiết ngay, nhưng lo túi đồ
  nhiều món dần theo thời gian chơi sẽ lại phát sinh vấn đề tương tự đợt
  16/20 (hoặc đơn giản là cuộn dài khó dùng). Trước khi đổi, đã kiểm chứng
  bằng Playwright: hover hàng KHÔNG PHẢI hàng đầu (`cardPlacement="top"`)
  chưa từng bị cắt trong thiết kế cuộn cũ, kể cả khi cuộn xuống tận đáy
  danh sách dài — card đó luôn bật LÊN vào phần nội dung đã render sẵn
  phía trên, vốn dĩ luôn đủ chỗ. Chỉ hàng ĐẦU (`cardPlacement="bottom"`)
  từng có rủi ro thật, và đợt 20 đã sửa triệt để bằng spacer luôn render.
- **`BagPanel.tsx` đổi từ `overflow-y-auto` cuộn vô hạn sang phân trang
  thật** — `PAGE_SIZE = GRID_COLS × GRID_ROWS = 12` (đúng 2 hàng đầy).
  Không phải số tuỳ chọn ngẫu nhiên: cố định đúng 2 hàng mỗi trang khiến
  logic hover-card trở nên ĐÚNG TUYỆT ĐỐI theo cấu trúc (hàng đầu LUÔN bật
  xuống, hàng còn lại — tối đa 1 hàng nữa — LUÔN bật lên vào hàng đầu đã
  có sẵn) thay vì "đủ dùng tuỳ vào túi đồ đang có bao nhiêu món" như thiết
  kế cuộn cũ.
- **`page` state luôn CLAMP lại `[0, maxPage]` NGAY TẠI CHỖ mỗi lần render**
  (không phải qua `useEffect` reset sau đó) — tổng số trang (`maxPage`) có
  thể tụt xuống bất kỳ lúc nào nếu người chơi bán bớt vật phẩm trong khi
  panel Túi Đồ vẫn đang mở; clamp trực tiếp trong lúc render đảm bảo không
  có 1 frame nào hiện trang rỗng hoặc vượt quá tổng số trang thật trước khi
  1 effect kịp chạy để sửa lại.
- Nút trang trước/trang sau (`ChevronLeft`/`ChevronRight`) + chữ
  "Trang X/Y" đặt space-between với tiêu đề mục "Vũ Khí Đã Có" — CHỈ hiện
  khi `items.length > PAGE_SIZE` (đúng 1 trang thì không cần điều hướng,
  ẩn hẳn thay vì hiện nút mờ vô dụng).
- Spacer dự phòng `h-52` (đợt 20, dành chỗ cho card hàng đầu bật xuống)
  giờ tính theo `pageItems.length` (số món TRÊN TRANG HIỆN TẠI) thay vì
  `items.length` (tổng số món toàn túi đồ) — về bản chất luôn ĐÚNG y hệt
  trước (mỗi trang luôn có hàng đầu cần spacer khi có ít nhất 1 món), chỉ
  đổi biến đọc cho khớp đúng ngữ nghĩa mới.
- **Xác minh bằng Playwright**: seed 27 món (chia đúng 3 trang: 12/12/3) —
  đếm đúng số ô hiện trên mỗi trang, nút "Trang Sau" tự vô hiệu ở trang
  cuối; hover hàng đầu VÀ hàng cuối ở CẢ trang đầy (12 món) lẫn trang ngắn
  (3 món, trang cuối) đều hiện đầy đủ, không bị cắt; không lỗi console.

### Thu nhỏ spacer Túi Đồ (2026-08-19 đợt 22)

- User hỏi thẳng: cái spacer `h-52` cuối lưới vật phẩm để làm gì — nhìn
  như 1 khoảng trắng vô cớ, giống bug. Đúng vậy — kiểm tra lại thì spacer
  đang OVER-RESERVE: cố định `h-52` (208px) bất kể trang có 1 hay 2 hàng,
  trong khi hàng thứ 2 (nếu tồn tại) đã tự đóng góp một phần chiều cao thật
  rồi, không cần bù đủ 208px nữa.
- **Đo chính xác bằng Playwright's `getBoundingClientRect()`** (không đoán
  bằng mắt): `ItemDetailCard` cần ~193px chỗ trống bên dưới hàng 0 (bản
  thân card cao ~185px + `mt-2` 8px). Khi trang có hàng 1, hàng đó tự góp
  ~68px chiều cao thật (56px ô vuông + `gap-3` 12px) — ĐÚNG NHƯ VẬY dù
  hàng 1 đầy 6 món hay chỉ có 1 món, vì track hàng của CSS Grid tự tính
  theo Ô CAO NHẤT trong hàng, không theo SỐ Ô có mặt. Vậy thực tế chỉ còn
  thiếu ~101px cần spacer bù thêm, không phải nguyên 208px.
- **Sửa**: spacer đổi từ cố định sang ĐỘNG theo `pageItems.length >
  GRID_COLS` (có hàng 2 hay không) — `h-28` (112px, dư ~11px an toàn) khi
  có hàng 2, giữ nguyên `h-52` (208px) khi trang chỉ có 1 hàng (không có
  gì bên dưới để "mượn" chiều cao). Giảm đúng MỘT NỬA khoảng trắng cho
  trường hợp phổ biến nhất — trang đầy 12 món (2 hàng) — trong khi trang
  ngắn (1 hàng, VD trang cuối cùng lẻ) vẫn giữ đủ chỗ như cũ.
- **Xác minh lại bằng `getBoundingClientRect()`**: hover cả 3 vị trí cột
  (trái/giữa/phải) của hàng 0 trên 1 trang đầy 12 món — toạ độ card luôn
  nằm gọn trong pane (không vượt biên trên lẫn dưới), khớp với con số đo
  được ở trên.

### Portal hoá hover card Túi Đồ (2026-08-19 đợt 23)

- User bác thẳng cách sửa đợt 22 (spacer động `h-28`/`h-52`) — "không
  muốn có h-52 hay h-28 như hiện tại, nó là cheat chứ không thực sự giải
  quyết vấn đề". Đúng: dù đã đo chính xác và giảm được một nửa, bản chất
  vẫn là "dành sẵn 1 khoảng trống DỰ ĐOÁN sẽ đủ" — không phải cách CSS
  thuần nào có thể giải quyết triệt để, vì nhu cầu "cần bao nhiêu chỗ
  trống" phụ thuộc VỊ TRÍ của item đang hover trong lưới, mà CSS
  `group-hover` không có cách nào biết trước.
- **Giải pháp gốc rễ**: `ItemDetailCard.tsx` đổi từ `position: absolute` +
  CSS `group-hover:opacity-100` (định vị TƯƠNG ĐỐI so với trigger, nằm
  LỒNG trong `WuxiaModal`'s `overflow-y-auto`) sang
  `createPortal(..., document.body)` + `position: fixed`, toạ độ tính từ
  `triggerRect = button.getBoundingClientRect()` lúc `onMouseEnter` THẬT
  SỰ (hàm mới `computeItemDetailCardPosition()`) — ưu tiên bật xuống dưới
  trigger, tự LẬT lên trên nếu không đủ khoảng trống bên dưới (so sánh
  `window.innerHeight - triggerRect.bottom` với chiều cao card ước tính),
  tự KẸP theo chiều ngang trong viewport (không tràn 2 bên). Vì portal
  thoát ra khỏi cây DOM của `WuxiaModal` hoàn toàn, card không còn nằm
  trong `overflow-y-auto` nào cả — KHÔNG CẦN dành chỗ trống ở bất kỳ đâu
  nữa. Xoá sạch spacer `h-52`/`h-28` khỏi `BagPanel.tsx`.
- **Đổi cách quản lý state hover**: trước đó mỗi `ItemSlot` tự vẽ
  `ItemDetailCard` của chính nó (CSS `group-hover`, không cần React state).
  Giờ `BagPanel` là nơi DUY NHẤT giữ `hovered: { item, position } | null`
  và render ĐÚNG 1 `ItemDetailCard` — mỗi `ItemSlot` chỉ gọi
  `onHover(rect)`/`onUnhover()` lúc `onMouseEnter`/`onMouseLeave`, không tự
  quản gì cả. Đơn giản hơn hẳn so với việc mỗi ô tự tính `cardAlign`/
  `cardPlacement` theo vị trí cột/hàng như thiết kế cũ (đợt 16 — nay bỏ
  hẳn, không còn cần thiết vì vị trí giờ tính từ toạ độ THẬT, không phải
  suy luận "cột mấy/hàng mấy").
- **Đảo ngược 1 quyết định trước đó** (đợt 16/20: "cố tình không dùng
  portal đo vị trí bằng JS, giữ convention hover thuần CSS") — quyết định
  đó vẫn ĐÚNG cho popover NHỎ (VD `WuxiaTooltip.tsx` 1 dòng, `QuestTracker`'s
  card mô tả) nơi "dành chỗ trống" chỉ tốn vài px không đáng bận tâm. Với
  popover LỚN như `ItemDetailCard` (~190px), "dành chỗ trống" luôn dẫn tới
  1 trong 2 kết cục xấu: đoán THIẾU (bug thật gặp 2 lần, đợt 16 và đợt 20)
  hoặc đoán ĐỦ nhưng lộ ra khoảng trắng nhìn vô cớ (đợt 22, user tự phát
  hiện) — cheat theo đúng nghĩa, không phải sửa tận gốc.
- **Nhân tiện tăng `GRID_ROWS` từ 2 lên 3** (`PAGE_SIZE` 12→18, theo đề
  xuất trực tiếp của user) — con số hàng/trang giờ HOÀN TOÀN không còn
  ảnh hưởng gì tới việc hover card có bị cắt hay không nữa (khác hẳn thiết
  kế cũ, nơi số hàng phải tính cẩn thận để "đủ mượn" chiều cao cho hàng
  đầu) — chỉ còn là lựa chọn thẩm mỹ layout thuần tuý.
- **Xác minh bằng Playwright + `getBoundingClientRect()`**: pane nội dung
  co lại khít với nội dung thật (không còn đuôi trắng ~208px như trước);
  card luôn nằm gọn trong viewport (đo toạ độ thật, không suy đoán) ở MỌI
  vị trí thử — hàng đầu cột trái/phải, hàng cuối cùng, trang đầy 18 món,
  trang ngắn chỉ 2 món; không lỗi console trong toàn bộ luồng.

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
      `public/npc/player/` (xem mục 1; `turtle.png` đã dùng làm
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
