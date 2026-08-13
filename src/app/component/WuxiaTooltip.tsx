"use client";

/** Instant, wuxia-styled hover tooltip — replaces the native `title`
 * attribute, which shows the browser's own plain tooltip only after a long
 * hover delay. Pure CSS (`group-hover`, no JS/timers) so it appears the
 * moment the pointer lands, styled like a small parchment tag instead.
 *
 * Usage: put `group` (and `relative`, unless the trigger is already
 * `fixed`/`absolute`) on the HOVERED element, then render this as its
 * sibling/child. If the trigger has `overflow-hidden` (e.g. to clip a
 * `fill` image to a rounded box, see `GridMinimap.tsx`), wrap trigger +
 * tooltip in an extra `group relative` container instead — placing the
 * tooltip inside an `overflow-hidden` ancestor clips it, same bug class as
 * `WuxiaModal.tsx`'s X button.
 *
 * **Also put `hover:z-30` on the trigger itself** (not just rely on this
 * component's own `z-30`) whenever the trigger sits next to another opaque
 * sibling (icon row next to `GridMinimap`, bubbles next to each other on
 * `ShelfNav`) — bug found in practice: a `hover:scale-*` transform on the
 * trigger creates its OWN stacking context the instant you hover it, which
 * strands this tooltip's `z-30` inside that local context instead of
 * comparing against the sibling. The sibling (later in DOM, `z-index:auto`)
 * then paints over the tooltip since DOM order breaks the tie among
 * `z-index:auto` positioned elements. Bumping the TRIGGER's own `z-index`
 * on hover (not the tooltip's) fixes it at the level that's actually
 * compared.
 *
 * **Pass `align` for a trigger sitting near the left/right edge of a
 * `WuxiaModal`** (e.g. a grid of items, see `BagPanel.tsx`'s `ItemSlot`) —
 * default `"center"` centers the tooltip on the trigger, which for a
 * near-edge trigger pushes the far side of a wide label past the modal's
 * boundary. `WuxiaModal`'s content pane is `overflow-y-auto`, which (per
 * CSS: one axis can't stay `visible` while the other isn't) forces
 * `overflow-x` to `auto` too — so that overflow silently clips instead of
 * just looking cramped, same bug class as its X button. `"start"`/`"end"`
 * anchor the tooltip to the trigger's near edge and grow away from the
 * modal boundary instead of centering through it. */
export function WuxiaTooltip({
  label,
  placement = "top",
  align = "center",
}: {
  label: string;
  placement?: "top" | "bottom";
  align?: "start" | "center" | "end";
}) {
  const verticalClass = placement === "top" ? "bottom-full mb-2" : "top-full mt-2";
  const horizontalClass = align === "center" ? "left-1/2 -translate-x-1/2" : align === "start" ? "left-0" : "right-0";
  return (
    <span
      className={`pointer-events-none absolute ${verticalClass} ${horizontalClass} z-30 whitespace-nowrap rounded-md border px-2 py-1 text-xs font-semibold opacity-0 shadow-lg transition-opacity duration-100 group-hover:opacity-100`}
      style={{ borderColor: "#5c3a21", background: "linear-gradient(160deg, #f4e6c4, #d9bd83)", color: "#3f2a16" }}
    >
      {label}
    </span>
  );
}
