export interface WorldBlip {
  id: string;
  x: number;
  y: number;
  color: string;
}

export interface WorldPlayerState {
  x: number;
  y: number;
  angle: number; // radians, 0 = facing right — facing follows movement direction (WASD), held while idle
  isMoving: boolean;
  hp: number;
  maxHp: number;
  level: number;
  exp: number;
  expToNext: number;
}

/** Cooldown snapshot for one ability, synced from the Phaser scene so the
 * React ability bar can render a progress ring without owning a clock. */
export interface AbilityCooldownState {
  cooldownMs: number;
  readyAt: number; // scene.time.now value when usable again
  now: number; // scene.time.now at the moment this was synced
}

export const WORLD_WIDTH = 3000;
export const WORLD_HEIGHT = 3000;
