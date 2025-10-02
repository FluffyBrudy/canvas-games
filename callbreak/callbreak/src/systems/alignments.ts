import type { PlayerAlignment } from "../types/types.type";

export const anchors: Record<PlayerAlignment, [number, number]> = {
  midbottom: [0, 1],
  midtop: [0, -1],
  midleft: [-1, 0],
  midright: [1, 0],
};

export const textAlignmentMap: Record<
  PlayerAlignment,
  [CanvasTextAlign, CanvasTextBaseline]
> = {
  midbottom: ["center", "top"],
  midtop: ["center", "bottom"],
  midleft: ["right", "middle"],
  midright: ["left", "middle"],
};
