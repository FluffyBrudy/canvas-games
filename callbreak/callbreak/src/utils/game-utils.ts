import type { Coor } from "../types/types.type";

/**
 * compare coordinate int values by turncating floating points
 */
export function destReached(a: Coor, b: Coor, threshold = 0.5) {
  return Math.abs(b.x - a.x) < threshold && Math.abs(b.y - a.y) < threshold;
}

export function vecDirection(from: Coor, to: Coor): Coor {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const mag = Math.sqrt(dx * dx + dy * dy);
  if (mag === 0) return { x: 0, y: 0 };
  return { x: dx / mag, y: dy / mag };
}
