import { normalize } from './strings'

export function fuzzyMatch(a: string, b: string): number {
  const na = normalize(a.replace(/[O]/g, '0').replace(/[I]/g, '1'))
  const nb = normalize(b.replace(/[O]/g, '0').replace(/[I]/g, '1'))
  if (na === nb) return 1
  let matches = 0
  const longer = na.length > nb.length ? na : nb
  const shorter = na.length > nb.length ? nb : na
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) matches++
  }
  return matches / longer.length
}

export function classifyMatch(score: number): 'exact' | 'probable' | 'partial' | 'mismatch' {
  if (score >= 0.99) return 'exact'
  if (score >= 0.85) return 'probable'
  if (score >= 0.5) return 'partial'
  return 'mismatch'
}
