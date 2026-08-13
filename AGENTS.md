<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Wulin.io — project rules

This is a wuxia idle-exploration `.io`-style game (top-down, Phaser canvas +
React/Next.js HUD). Before touching gameplay, UI, or animation code, read
**`.claude/skills/wulin-design/SKILL.md`** (invoke it as a skill) — it has the
binding rules for module architecture, stat naming, animation conventions
(including a known `gsap.quickTo` alias gotcha), and checklists for adding a
new character class, skill, or item. `docs/GAME_DESIGN.md` describes what
currently exists; the skill describes how to build on it consistently.

Quick summary (see the skill for the full, current version):

- Domain code (currently just `world`) lives under `src/modules/<domain>/`.
  Cross-module glue (HUD, dialogue, minimap, backdrops) lives under
  `src/app/component/`. Don't create a catch-all `src/components/` or
  `src/lib/`.
- All player-facing text is Vietnamese — short, literal sentences, no
  wordplay. Three fonts, named after the actual font (not `font-title`-style
  aliases): `font-vl` (default reading font), `font-bmx` (game name/impact
  text only), `font-p22` (short notification/prompt titles). Readable text
  sizes run ~28px. Desktop-only for now — don't add `sm:`/`md:` responsive
  variants unless asked. See the skill's font/ngôn ngữ section for the full
  rule.
- Animation: GSAP for React/DOM, Phaser's own `update()` for anything inside
  the canvas, plain CSS `@keyframes` for state-independent looping effects.
  Don't mix systems for one effect.
- Run `yarn lint && yarn build` and smoke-test through Playwright before
  calling a UI/gameplay change done.
