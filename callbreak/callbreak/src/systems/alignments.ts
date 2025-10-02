import type { PlayerAlignment } from "../types/types.type";

export const anchors: Record<PlayerAlignment, [number, number]> = {
  midbottom: [0, 40],
  midtop: [0, -40],
  midleft: [-40, 0],
  midright: [50, 0],
};
