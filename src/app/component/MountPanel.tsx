"use client";

import Image from "next/image";
import { WuxiaModal } from "./WuxiaModal";

/** No mount is real yet (see `modules/mount/data.ts`) — a creature RIDDEN
 * for faster movement, DIFFERENT from `PetPanel` (a companion). Khi có data
 * thật, danh sách thú cưỡi nên dùng lại đúng pattern grid-item + hover
 * tooltip của `BagPanel.tsx`, không bịa layout mới. */
export function MountPanel({ onClose }: { onClose: () => void }) {
  return (
    <WuxiaModal title="Thú Cưỡi" onClose={onClose}>
      <div className="flex flex-col items-center gap-3 py-6 opacity-70">
        <div className="relative h-14 w-14">
          <Image src="/icon/mount.png" alt="" fill className="object-contain" />
        </div>
        <p className="text-center text-sm text-[#8a6a3f]">Thú Cưỡi sẽ sớm ra mắt.</p>
      </div>
    </WuxiaModal>
  );
}
