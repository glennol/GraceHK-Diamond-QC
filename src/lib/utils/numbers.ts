export function round2(n: number): number {
  return Math.round(n * 100) / 100
}
export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max)
}
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}
