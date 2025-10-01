export type Coor = { x: number; y: number };
export interface InputState {
  mouseX: number;
  mouseY: number;
  leftPressed: boolean;
  rightPressed: boolean;
  keysDown: Set<string>;
}

export type PlayerAlignment = "midtop" | "midleft" | "midbottom" | "midright";
export type EventDepSpriteKwargs = Record<string, any> & {
  eventState?: InputState;
};

export type TPlayerLable = string;
export type TBid = number;
