"use client";

import Image from "next/image";
import { WuxiaModal } from "./WuxiaModal";

/** No pet is real yet (see `modules/pet/data.ts`) — companion creature that
 * follows the player, DIFFERENT from `MountPanel` (ridden for speed). Khi có
 * data thật, danh sách thú nuôi nên dùng lại đúng pattern grid-item + hover
 * tooltip của `BagPanel.tsx`, không bịa layout mới. */
export function PetPanel({ onClose }: { onClose: () => void }) {
  return (
    <WuxiaModal title="Thú Cưng" onClose={onClose}>
      <div className="flex flex-col items-center gap-3 py-6 opacity-70">
        <div className="relative h-14 w-14">
          <Image src="/icon/pet.png" alt="" fill className="object-contain" />
        </div>
        <p className="text-center text-sm text-[#8a6a3f]">Thú Cưng sẽ sớm ra mắt.</p>
      </div>
    </WuxiaModal>
  );
}
