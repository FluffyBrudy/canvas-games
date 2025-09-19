export function randint(min: number, max: number): number {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error("Both min and max must be integers.");
  }

  if (min > max) {
    throw new Error("Domain error: min cannot be greater than max.");
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randfloat(min: number, max: number): number {
  if (min > max)
    throw new Error("Domain error: min cannot be greater than max.");
  return Math.random() * (max - min) + min;
}
