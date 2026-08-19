/** English values in code, Vietnamese only at display time (see
 * `data.ts`'s `UNLOCK_FEATURE_NAMES`) — literal union, extend as new gated
 * features get added.
 *
 * `bag` unlocks for real via `first_deer_hunt`'s turn-in (see
 * `MapScreen.tsx`) — joined the unlock system at đợt 14 (used to be
 * always-unlocked). `summonStore`/`market`/`skills`/`pet`/`mount`/
 * `friends` currently have NO unlock trigger anywhere — `summonStore`/
 * `market` USED to unlock alongside `bag` from that same quest (đợt 14)
 * but were deliberately unhooked at đợt 15 ("để sau" — user wants them
 * saved for a later, still-undecided trigger); the other 4 are gated "for
 * now" at this stage of the game (content isn't built out yet). All 6
 * stay locked until a future update adds a real trigger and calls
 * `unlockFeature` for them. */
export type UnlockableFeature = "bag" | "summonStore" | "market" | "skills" | "pet" | "mount" | "friends";
