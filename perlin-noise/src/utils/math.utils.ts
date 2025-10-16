export function lerp(a: number, b: number, t: number) {
  return a + t * (b - a);
}

export function grad2(hash: number, x: number, y: number): number {
  const [gx, gy] = GRAD2[hash & 7];
  return gx * x + gy * y;
}

export function grad1(hash: number, x: number): number {
  const h = hash & 1;
  const sign = h === 0 ? 1 : -1;

  return sign * x;
}

const GRAD2 = Object.freeze([
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const);
