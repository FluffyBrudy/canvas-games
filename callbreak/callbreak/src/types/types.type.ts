export type Coor = { x: number; y: number };
export interface InputState {
  mouseX: number;
  mouseY: number;
  leftPressed: boolean;
  rightPressed: boolean;
  keysDown: Set<string>;
}
