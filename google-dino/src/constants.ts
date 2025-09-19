export const BG_COLOR = "#423f3fff";
export const MAX_SCREEN_WIDTH = 500;
export const MAX_SCREEN_HEIGHT = 500;
export const DINO_SIZE = 32;

export const DinoState = {
  IDLE: "idle",
  JUMP: "jump",
  RUN: "run",
  DUCK: "duck",
  DEAD: "dead",
} as const;
export type TDinoState = (typeof DinoState)[keyof typeof DinoState];
export type TKeyType = "UP" | "DOWN";
