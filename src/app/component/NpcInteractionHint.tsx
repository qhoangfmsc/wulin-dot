"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/** "Nhấn Space Để Trò Chuyện" — shown while the player is close enough to an
 * NPC to interact but hasn't opened its dialogue yet. `MapScreen.tsx` owns
 * the visibility decision (`nearbyNpcId` from `modules/npc/interactionHint`
 * AND no dialogue/modal already open) and passes it down as `visible` —
 * this component is a pure display, same reasoning as `MonsterTargetHud`
 * reading its own store directly EXCEPT here the "busy" check needs
 * `MapScreen`'s local dialogue state too, which isn't in a global store. */
export function NpcInteractionHint({ visible }: { visible: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (visible) {
      gsap.fromTo(ref.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center px-4">
      <p
        ref={ref}
        className="font-p22 rounded-full border-2 px-5 py-2 text-xl"
        style={{ borderColor: "#7a5230", background: "linear-gradient(160deg, rgba(42,32,20,0.92), rgba(20,15,10,0.92))", color: "#e6d3ad" }}
      >
        Nhấn Space Để Trò Chuyện
      </p>
    </div>
  );
}
