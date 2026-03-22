import rules from '@/data/gradingRules.json'
import type { DiamondShape } from '@/types/inspection'

export interface RangeThreshold {
  excellent: [number, number]
  good: [number, number]
  fair: [number, number]
}

export interface ShapeRule {
  table: RangeThreshold
  depth: RangeThreshold
  girdle: string[]
  culet: string[]
  lengthToWidth: { min: number; max: number; label: string }
}

export type GradingRules = Record<string, ShapeRule>

const typedRules = rules.shapes as unknown as GradingRules

export function getRulesForShape(shape: DiamondShape): ShapeRule | undefined {
  return typedRules[shape]
}

export function evaluateInRange(
  value: number,
  threshold: RangeThreshold
): 'excellent' | 'good' | 'fair' | 'poor' {
  const [eMin, eMax] = threshold.excellent
  const [gMin, gMax] = threshold.good
  const [fMin, fMax] = threshold.fair
  if (value >= eMin && value <= eMax) return 'excellent'
  if (value >= gMin && value <= gMax) return 'good'
  if (value >= fMin && value <= fMax) return 'fair'
  return 'poor'
}

export function allShapes(): DiamondShape[] {
  return Object.keys(typedRules) as DiamondShape[]
}
