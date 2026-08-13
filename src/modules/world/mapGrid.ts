import type { MapEdge, WallConfig } from "./mapScene";

/** Authoring shorthand for a world grid: `0` = no room (blocked), `1` =
 * normal room, `"X"` = start room (exactly one required), `"B"` = boss room,
 * `"S"` = special room, `"?"` = unknown room (shown as fog on the minimap
 * until the player actually walks into it). Write grids as plain nested
 * arrays — `mapGrid.ts` derives everything else (which edges are open,
 * where the player starts) from this one structure.
 *
 * Rows can be **jagged** (different lengths, including empty `[]`) — only
 * write the cells that actually exist. There's no need to pad a row with
 * trailing `0`s just to line it up with a longer row, and no need for a
 * fully-`0` row/column just to keep the array rectangular. A cell past the
 * end of its row (or a row past the end of the grid) is simply treated as
 * `0` (no room) — this is what makes maze-shaped maps cheap to author: only
 * the real rooms cost you a character. */
export type GridSymbol = 0 | 1 | "X" | "B" | "S" | "?";

export type GridCellKind = "empty" | "normal" | "boss" | "special" | "unknown";

export interface GridCell {
  kind: GridCellKind;
  row: number;
  col: number;
}

export interface ParsedGridMap {
  cells: GridCell[][]; // [row][col]
  rows: number;
  cols: number;
  start: { row: number; col: number };
}

/** Soft cap on grid dimensions — big enough for a real maze-shaped campaign
 * map, small enough that stuff stays cheap. Not a hard technical limit
 * (the minimap no longer renders the whole grid at once — see
 * `GridMinimap.tsx`'s player-centered viewport — so this isn't a rendering
 * constraint anymore, just a sane ceiling against typos). */
export const MAX_GRID_SIZE = 30;

function symbolToKind(symbol: GridSymbol): GridCellKind {
  switch (symbol) {
    case 0:
      return "empty";
    case 1:
    case "X":
      return "normal";
    case "B":
      return "boss";
    case "S":
      return "special";
    case "?":
      return "unknown";
  }
}

/** Turns an authored grid (jagged rows of `GridSymbol`) into a
 * `ParsedGridMap` — finds the single `"X"` start cell and converts every
 * symbol to a `GridCellKind`. Throws if there's no `"X"` or more than one,
 * or if the grid exceeds `MAX_GRID_SIZE` in either dimension — better to
 * fail loudly at startup than silently spawn the player somewhere wrong. */
export function parseGridMap(symbols: GridSymbol[][]): ParsedGridMap {
  const rows = symbols.length;
  const cols = symbols.reduce((max, row) => Math.max(max, row.length), 0);
  if (rows > MAX_GRID_SIZE || cols > MAX_GRID_SIZE) {
    throw new Error(`Grid map ${rows}x${cols} exceeds MAX_GRID_SIZE (${MAX_GRID_SIZE})`);
  }

  let start: { row: number; col: number } | null = null;
  const cells: GridCell[][] = symbols.map((rowSymbols, row) =>
    rowSymbols.map((symbol, col) => {
      if (symbol === "X") {
        if (start) throw new Error(`Grid map has more than one "X" start cell`);
        start = { row, col };
      }
      return { kind: symbolToKind(symbol), row, col };
    }),
  );

  if (!start) throw new Error(`Grid map has no "X" start cell`);
  return { cells, rows, cols, start };
}

const NEIGHBOR_OFFSET: Record<MapEdge, { dRow: number; dCol: number }> = {
  up: { dRow: -1, dCol: 0 },
  down: { dRow: 1, dCol: 0 },
  left: { dRow: 0, dCol: -1 },
  right: { dRow: 0, dCol: 1 },
};

export function neighborCoords(row: number, col: number, edge: MapEdge): { row: number; col: number } {
  const { dRow, dCol } = NEIGHBOR_OFFSET[edge];
  return { row: row + dRow, col: col + dCol };
}

export function cellAt(map: ParsedGridMap, row: number, col: number): GridCell | null {
  if (row < 0 || row >= map.rows || col < 0 || col >= map.cols) return null;
  // Rows are jagged — a row shorter than `col` simply has no cell there,
  // same as if it were never written at all (treated as "no room").
  return map.cells[row][col] ?? null;
}

/** A cell's wall config is entirely derived from grid adjacency — an edge
 * is open (no wall) only if the neighboring cell in that direction exists
 * (in bounds and not `"empty"`); otherwise it's walled. This is the whole
 * point of the grid format: author connectivity once, every room figures
 * out its own doors automatically. */
export function getCellWalls(map: ParsedGridMap, row: number, col: number): WallConfig {
  const walls: WallConfig = {};
  for (const edge of Object.keys(NEIGHBOR_OFFSET) as MapEdge[]) {
    const { row: nRow, col: nCol } = neighborCoords(row, col, edge);
    const neighbor = cellAt(map, nRow, nCol);
    walls[edge] = !neighbor || neighbor.kind === "empty";
  }
  return walls;
}

/** Random dungeon-style grid generator ("cho random nếu cần") — not wired
 * up as the default yet (see `MapScreen.tsx`), but ready to swap in.
 * Carves a connected tree of rooms via random walk from a start cell,
 * places one boss room at the carved cell farthest (in step count) from
 * start, and scatters a couple of special rooms among the rest. */
export function generateRandomGridMap(rows: number, cols: number, roomCount?: number): GridSymbol[][] {
  const clampedRows = clamp(rows, 2, MAX_GRID_SIZE);
  const clampedCols = clamp(cols, 2, MAX_GRID_SIZE);
  const targetRooms = clamp(roomCount ?? Math.round(clampedRows * clampedCols * 0.55), 3, clampedRows * clampedCols);

  const grid: GridSymbol[][] = Array.from({ length: clampedRows }, () => Array<GridSymbol>(clampedCols).fill(0));
  const startRow = Math.floor(Math.random() * clampedRows);
  const startCol = Math.floor(Math.random() * clampedCols);
  const distanceFromStart = new Map<string, number>();

  const carved: { row: number; col: number }[] = [{ row: startRow, col: startCol }];
  grid[startRow][startCol] = 1;
  distanceFromStart.set(`${startRow},${startCol}`, 0);

  const directions: [number, number][] = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  while (carved.length < targetRooms) {
    const from = carved[Math.floor(Math.random() * carved.length)];
    const [dRow, dCol] = directions[Math.floor(Math.random() * directions.length)];
    const row = from.row + dRow;
    const col = from.col + dCol;
    if (row < 0 || row >= clampedRows || col < 0 || col >= clampedCols) continue;
    if (grid[row][col] !== 0) continue;

    grid[row][col] = 1;
    carved.push({ row, col });
    distanceFromStart.set(`${row},${col}`, (distanceFromStart.get(`${from.row},${from.col}`) ?? 0) + 1);

    // Safety valve in case the random walk keeps picking already-full spots.
    if (carved.length > clampedRows * clampedCols) break;
  }

  grid[startRow][startCol] = "X";

  let bossKey = `${startRow},${startCol}`;
  let bossDist = -1;
  for (const [key, dist] of distanceFromStart) {
    if (dist > bossDist) {
      bossDist = dist;
      bossKey = key;
    }
  }
  const [bossRow, bossCol] = bossKey.split(",").map(Number);
  grid[bossRow][bossCol] = "B";

  const specialCandidates = carved.filter((c) => !(c.row === startRow && c.col === startCol) && !(c.row === bossRow && c.col === bossCol));
  const specialCount = Math.min(2, specialCandidates.length);
  for (let i = 0; i < specialCount; i++) {
    const pick = specialCandidates.splice(Math.floor(Math.random() * specialCandidates.length), 1)[0];
    grid[pick.row][pick.col] = "S";
  }

  return grid;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
