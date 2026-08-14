"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import type { MapEdge } from "@/modules/world/mapScene";
import { cellAt, getCellWalls, neighborCoords, parseGridMap } from "@/modules/world/mapGrid";
import { MAP_MODULES } from "@/modules/world/maps";
import type { DialogueLine } from "@/modules/world/maps";
import { useMapProgressStore } from "@/modules/world/mapProgress";
import { useMapMusic } from "@/modules/world/useMapMusic";
import { gainExp, getEffectiveStats, syncMaxHpToLiveHud, useCharacterStore } from "@/modules/character/store";
import { addCurrency, useInventoryStore } from "@/modules/inventory/store";
import { NPCS } from "@/modules/npc/data";
import type { NpcId } from "@/modules/npc/types";
import { QUESTS } from "@/modules/quest/data";
import { completeQuest, getQuestStatus, startQuest } from "@/modules/quest/store";
import type { QuestId } from "@/modules/quest/types";
import { GameHud } from "./GameHud";
import { TutorialOverlay } from "./TutorialOverlay";
import { DialogueBox } from "./DialogueBox";
import { DeathNotice } from "./DeathNotice";
import { QuestOfferModal } from "./QuestOfferModal";
import { ExperienceBar } from "./ExperienceBar";

const MapCanvas = dynamic(() => import("@/modules/world/components/MapCanvas").then((m) => m.MapCanvas), { ssr: false });

const OPPOSITE_EDGE: Record<MapEdge, MapEdge> = { left: "right", right: "left", up: "down", down: "up" };

function cellKey(row: number, col: number) {
  return `${row}-${col}`;
}

/** World map — renders whichever map module is current (see
 * `modules/world/maps`; every map is a real, permanent module, never a
 * "demo"). A grid is a small hand-authored `GridSymbol[][]` (see
 * `mapGrid.ts` for the shorthand: 0 = blocked, 1 = normal, "X" = start,
 * "B" = boss, "S" = special, "?" = unknown/fog). `parseGridMap` derives the
 * start position; `getCellWalls` derives each room's open/walled edges from
 * adjacency — nothing here manually wires up doors. */
export function MapScreen() {
  const currentMapId = useMapProgressStore((s) => s.currentMapId);
  const map = MAP_MODULES[currentMapId];

  const parsed = useMemo(() => parseGridMap(map.grid), [map]);
  const [position, setPosition] = useState(parsed.start);
  const [visited, setVisited] = useState<Set<string>>(() => new Set([cellKey(parsed.start.row, parsed.start.col)]));
  const [spawnAt, setSpawnAt] = useState<MapEdge | null>(null);
  const [showTutorial, setShowTutorial] = useState(map.showTutorial);
  const [dialogueQueue, setDialogueQueue] = useState<DialogueLine[] | null>(null);
  const [lastCheckedKey, setLastCheckedKey] = useState<string | null>(null);
  const [dialogueShownFor, setDialogueShownFor] = useState<Set<string>>(() => new Set());
  const [deathNotice, setDeathNotice] = useState(false);
  const [respawnNonce, setRespawnNonce] = useState(0);
  const [npcDialogue, setNpcDialogue] = useState<{
    npcId: NpcId;
    questId: QuestId | null;
    lines: DialogueLine[];
    phase: "intro" | "active" | "turnIn" | "done";
  } | null>(null);
  const [questOffer, setQuestOffer] = useState<{ npcId: NpcId; questId: QuestId } | null>(null);
  const fadeRef = useRef<HTMLDivElement>(null);

  useMapMusic(map.music, currentMapId);

  // Subscribed (not just read via getState()) so this component re-renders
  // — and re-computes `stats` below — whenever leveling/stat allocation or
  // equipping a weapon changes them.
  useCharacterStore();
  useInventoryStore((s) => s.equippedItemId);
  const stats = getEffectiveStats();

  useEffect(() => {
    // One-time sync on mount: `liveHud.maxHp` isn't persisted, but
    // character/inventory progress is — re-derive it from whatever the
    // player already had equipped/allocated in a previous session.
    syncMaxHpToLiveHud();
  }, []);

  const posKey = cellKey(position.row, position.col);
  const cell = parsed.cells[position.row][position.col];
  const walls = useMemo(() => getCellWalls(parsed, position.row, position.col), [parsed, position]);
  // Every room's look is data declared on the map module, not a component
  // if-else — see `MapModule.roomStyles`/`floorOverridesByCell`.
  const roomStyle = map.roomStyles[cell.kind];
  const floorSrc = map.floorOverridesByCell?.[posKey] ?? roomStyle.floorSrc;
  const wallSrc = roomStyle.wallSrc;
  const tint = roomStyle.tint;
  // Memoized so the array reference only changes when the room actually
  // changes — `MapCanvas`'s effect depends on `obstacles` by reference, so a
  // freshly spread array on every render (e.g. from dismissing the dialogue
  // or tutorial, which just toggles unrelated state) would make it tear
  // down and rebuild the whole Phaser game every time, flashing the screen.
  const subjects = useMemo(() => map.subjectsByCell?.[posKey] ?? [], [map, posKey]);
  const obstacles = useMemo(
    () => [...(map.obstaclesByCell[posKey] ?? []), ...subjects],
    [map, posKey, subjects],
  );
  const monsters = useMemo(() => map.monstersByCell?.[posKey] ?? [], [map, posKey]);
  const npcs = useMemo(() => map.npcsByCell?.[posKey] ?? [], [map, posKey]);
  const roomDialogue = useMemo(() => map.dialoguesByCell?.[posKey], [map, posKey]);

  // Adjust state during render (not in an effect) so a room's dialogue
  // appears the moment that room is reached, exactly once per session — see
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (posKey !== lastCheckedKey) {
    setLastCheckedKey(posKey);
    if (!dialogueShownFor.has(posKey) && roomDialogue && roomDialogue.length > 0) {
      setDialogueShownFor((prev) => new Set(prev).add(posKey));
      setDialogueQueue(roomDialogue);
    }
  }

  function handleReachEdge(edge: MapEdge) {
    const next = neighborCoords(position.row, position.col, edge);
    const nextCell = cellAt(parsed, next.row, next.col);
    if (!nextCell || nextCell.kind === "empty" || !fadeRef.current) return; // shouldn't happen — walls already guard this

    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        setPosition(next);
        setVisited((prev) => new Set(prev).add(cellKey(next.row, next.col)));
        // Walked off an edge on this room -> appear at the matching
        // (opposite) edge of the next one, so it reads as one connected
        // space rather than a random teleport.
        setSpawnAt(OPPOSITE_EDGE[edge]);
        gsap.to(fadeRef.current, { opacity: 0, duration: 0.5, ease: "power2.out", delay: 0.15 });
      },
    });
  }

  function handlePlayerDeath() {
    if (!fadeRef.current) return;
    // Show the notice immediately, before the fade even starts, so the
    // fade-to-black that follows reads as a consequence of dying rather
    // than an unexplained blackout.
    setDeathNotice(true);

    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        setPosition(parsed.start);
        setSpawnAt(null);
        // `MapCanvas`'s key includes this so dying while already standing
        // in the start room still forces a fresh Phaser scene (recenters
        // the player, respawns that room's monsters) — a plain
        // `setPosition` to an unchanged `posKey` wouldn't remount it.
        setRespawnNonce((n) => n + 1);
        gsap.to(fadeRef.current, { opacity: 0, duration: 0.5, ease: "power2.out", delay: 0.15 });
      },
    });
  }

  /** Fired by `mapScene.ts`'s `onNpcInteract` on every Space-press-while-
   * in-range — not debounced on the Phaser side, so bail out here if
   * anything is already open (a room dialogue, another NPC's dialogue, or
   * the quest-offer modal), including subsequent Space presses that are
   * really meant to advance the dialogue currently open. */
  function handleNpcInteract(npcId: NpcId) {
    if (dialogueQueue || npcDialogue || questOffer) return;
    const npc = NPCS[npcId];
    // Most-urgent-first, same priority order `Npc.refreshMarker()` uses for
    // the bubble glyph — whichever quest the marker is currently showing is
    // the one talking to the NPC should act on.
    const readyToTurnIn = npc.questIds.find((id) => getQuestStatus(id) === "ready_to_turn_in");
    const active = npc.questIds.find((id) => getQuestStatus(id) === "active");
    const notStarted = npc.questIds.find((id) => getQuestStatus(id) === "not_started");

    if (readyToTurnIn) {
      setNpcDialogue({ npcId, questId: readyToTurnIn, lines: npc.turnInLines, phase: "turnIn" });
    } else if (active) {
      setNpcDialogue({ npcId, questId: active, lines: npc.activeLines, phase: "active" });
    } else if (notStarted) {
      setNpcDialogue({ npcId, questId: notStarted, lines: npc.introLines, phase: "intro" });
    } else {
      setNpcDialogue({ npcId, questId: null, lines: npc.doneLines, phase: "done" });
    }
  }

  function handleNpcDialogueDone() {
    const interaction = npcDialogue;
    setNpcDialogue(null);
    if (!interaction?.questId) return;

    if (interaction.phase === "intro") {
      setQuestOffer({ npcId: interaction.npcId, questId: interaction.questId });
    } else if (interaction.phase === "turnIn") {
      const quest = QUESTS[interaction.questId];
      completeQuest(quest.id);
      gainExp(quest.rewardExp);
      addCurrency(quest.rewardCurrency);
    }
  }

  function handleQuestAccept() {
    if (!questOffer) return;
    startQuest(questOffer.questId);
    setQuestOffer(null);
  }

  // `MapCanvas`'s effect deliberately excludes `onNpcInteract` from its
  // dependency array (same as `onReachEdge`/`onPlayerDeath`) so the Phaser
  // scene isn't torn down and rebuilt on every unrelated re-render — but
  // unlike those two (fire-once-ish per room), `handleNpcInteract` gets
  // called repeatedly across a single room visit and its correctness
  // depends on reading the LATEST `dialogueQueue`/`npcDialogue`/
  // `questOffer` each time (that's the whole point of its guard). A closure
  // frozen at mount would keep reacting to whatever those were the instant
  // the room loaded, forever. Route through a ref so the stable function
  // identity handed to Phaser always calls the freshest `handleNpcInteract`.
  const handleNpcInteractRef = useRef(handleNpcInteract);
  useEffect(() => {
    handleNpcInteractRef.current = handleNpcInteract;
  });
  const stableOnNpcInteract = useCallback((npcId: NpcId) => handleNpcInteractRef.current(npcId), []);

  return (
    <div className="relative h-dvh w-dvw overflow-hidden bg-zinc-950">
      <MapCanvas
        key={`${posKey}-${respawnNonce}`}
        floorSrc={floorSrc}
        spriteUrl={stats.characterSpriteSrc}
        weaponSpriteSrc={stats.weaponSpriteSrc}
        playerAttackDamage={stats.attack}
        walls={walls}
        wallSrc={wallSrc}
        tint={tint}
        obstacles={obstacles}
        monsters={monsters}
        npcs={npcs}
        spawnAt={spawnAt}
        onReachEdge={handleReachEdge}
        onPlayerDeath={handlePlayerDeath}
        onNpcInteract={stableOnNpcInteract}
      />

      {showTutorial && !dialogueQueue && !npcDialogue && !questOffer && (
        <TutorialOverlay onDismiss={() => setShowTutorial(false)} />
      )}

      {dialogueQueue && <DialogueBox lines={dialogueQueue} onDone={() => setDialogueQueue(null)} />}

      {npcDialogue && <DialogueBox lines={npcDialogue.lines} onDone={handleNpcDialogueDone} />}

      {questOffer && (
        <QuestOfferModal quest={QUESTS[questOffer.questId]} onAccept={handleQuestAccept} onDecline={() => setQuestOffer(null)} />
      )}

      {deathNotice && <DeathNotice onDismiss={() => setDeathNotice(false)} />}

      <GameHud cells={parsed.cells} position={position} visited={visited} />
      <ExperienceBar />

      <div ref={fadeRef} className="pointer-events-none absolute inset-0 z-30 bg-zinc-950 opacity-0" />
    </div>
  );
}
