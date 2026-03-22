export function normalize(s: string): string {
  return s.toLowerCase().replace(/[\s\-_.]/g, '')
}
export function titleCase(s: string): string {
  return s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase())
}
export function truncate(s: string, n = 40): string {
  return s.length > n ? s.slice(0, n) + '…' : s
}
