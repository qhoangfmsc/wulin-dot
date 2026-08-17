/** Every full-screen panel reachable from the HUD layer — `GameHud` owns
 * which one (if any) is currently open. Bạn Bè is NOT here — it opens as a
 * small dropdown anchored right at its `ShelfNav` bubble instead of a full
 * `WuxiaModal` (see `FriendsDropdown.tsx`), so it has no `PanelId`. Only
 * `CharacterPanel` still uses `onNavigate` (its equipped-weapon shortcut
 * jumps to "bag") — the other panels don't navigate anywhere, they only
 * close. */
export type PanelId = "character" | "bag" | "skills" | "summon" | "pet" | "mount" | "market";
