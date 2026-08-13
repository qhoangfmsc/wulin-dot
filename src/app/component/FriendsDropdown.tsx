"use client";

import Image from "next/image";
import { useFriendsStore } from "@/modules/friends/store";

const INK_BORDER = "#5c3a21";

/** Bạn Bè opens as a small dropdown anchored right at its `ShelfNav`
 * bubble — a short list doesn't need a full-screen `WuxiaModal` takeover.
 * `ShelfNav` owns the open/close state + backdrop-click-to-close and
 * positions this `absolute` relative to the bubble; this component only
 * renders the card itself. No social/multiplayer backend yet, but
 * `useFriendsStore` (persisted, just empty) is real — not mock data. */
export function FriendsDropdown() {
  const friends = useFriendsStore((s) => s.friends);

  return (
    <div
      className="pointer-events-auto absolute bottom-full right-0 z-40 mb-2 w-56 rounded-xl border-2 p-3 shadow-2xl"
      style={{ borderColor: INK_BORDER, background: "linear-gradient(160deg, #f4e6c4 0%, #e6d1a1 55%, #d9bd83 100%)" }}
      onClick={(e) => e.stopPropagation()}
    >
      <p className="font-p22 mb-2 text-sm font-bold uppercase tracking-[0.1em] text-[#5c3a21]">Bạn Bè</p>

      {friends.length === 0 ? (
        <p className="text-xs leading-snug text-[#8a6a3f]">Chưa có bạn bè nào — tính năng sắp ra mắt.</p>
      ) : (
        <div className="flex max-h-56 flex-col gap-1.5 overflow-y-auto">
          {friends.map((friend) => (
            <div key={friend.id} className="flex items-center gap-2 rounded-lg border px-2 py-1.5" style={{ borderColor: "#7a523066" }}>
              <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border" style={{ borderColor: "#7a5230" }}>
                <Image src="/icon/friends.png" alt="" fill className="object-contain p-1" />
              </div>
              <span className="truncate text-sm font-semibold text-[#3f2a16]">{friend.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
