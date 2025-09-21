import dinoDeadCrash from "./assets/graphics/dino/dead/crash.png";
import dinoDead from "./assets/graphics/dino/dead/dead.png";
import dinoDuck1 from "./assets/graphics/dino/duck/duck1.png";
import dinoDuck2 from "./assets/graphics/dino/duck/duck2.png";
import dinoIdle from "./assets/graphics/dino/idle/idle.png";
import dinoRun1 from "./assets/graphics/dino/movement/first.png";
import dinoRun2 from "./assets/graphics/dino/movement/second.png";
import cactusLargeDouble from "./assets/graphics/cactus/largedouble.png";
import cactusLargeMany from "./assets/graphics/cactus/largemany.png";
import cactusManySmall from "./assets/graphics/cactus/manysmall.png";
import birdFlapDown from "./assets/graphics/bird/flapdown.png";
import birdFlapUp from "./assets/graphics/bird/flapup.png";
import envBackground from "./assets/graphics/environment/bg.png";
import envCloud from "./assets/graphics/environment/cloud.png";
import buttonRestart from "./assets/graphics/button/restart.png";

export const BG_COLOR = "#423f3fff";
export const MAX_SCREEN_WIDTH = 500;
export const MAX_SCREEN_HEIGHT = 500;
export const DINO_SIZE = 32;
export const DEFAULT_WORLD_SHIFT = 300;

export const DinoState = {
  IDLE: "idle",
  JUMP: "jump",
  RUN: "run",
  DUCK: "duck",
  DEAD: "dead",
} as const;

export const ASSETS = {
  dino: {
    dead: [dinoDeadCrash, dinoDead],
    duck: [dinoDuck1, dinoDuck2],
    idle: [dinoIdle],
    run: [dinoRun1, dinoRun2],
    jump: [dinoIdle],
  },
  cactus: {
    largeDouble: cactusLargeDouble,
    // largeMany: cactusLargeMany,
    // manySmall: cactusManySmall,
  },
  bird: {
    flap: [birdFlapDown, birdFlapUp],
  },
  environment: {
    bg: envBackground,
    cloud: envCloud,
  },
  button: {
    restart: buttonRestart,
  },
};

export type TDinoState = (typeof DinoState)[keyof typeof DinoState];
export type TKeyType = "UP" | "DOWN" | "RESET";

type ReplaceLeavesWithImage<T> = T extends object
  ? { [K in keyof T]: ReplaceLeavesWithImage<T[K]> }
  : HTMLImageElement;

export type TAssets = ReplaceLeavesWithImage<typeof ASSETS>;
