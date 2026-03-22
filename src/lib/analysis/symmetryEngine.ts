import type { DiamondShape } from '@/types/inspection'
import type { SymmetryGuideState, SymmetrySubScore, SymmetryAnalysis } from '@/types/symmetry'
import { clamp } from '@/lib/utils/numbers'
import { generateId } from '@/lib/utils/ids'
import { now } from '@/lib/utils/dates'

export interface SymmetryInput {
  shape: DiamondShape
  guideState: SymmetryGuideState
  manualNotes?: string
  inspectionId: string
  assetId?: string
}

function scoreAxisAlignment(guide: SymmetryGuideState): number {
  // Perfect alignment is rotation close to 0, 90, 180, or 270
  const r = ((guide.rotation % 360) + 360) % 360
  const steps = [0, 90, 180, 270]
  const minDelta = steps.reduce((min, s) => Math.min(min, Math.abs(r - s)), 360)
  // Within 5 degrees = excellent (95+), within 15 degrees = good (70+)
  if (minDelta <= 2) return 98
  if (minDelta <= 5) return 90
  if (minDelta <= 10) return 78
  if (minDelta <= 15) return 65
  if (minDelta <= 20) return 50
  return clamp(30, 0, 100)
}

function scoreOutlineBalance(guide: SymmetryGuideState, shape: DiamondShape): number {
  // Shapes with predefined ideal L/W ratios get penalized if scale looks off
  const idealScales: Record<string, [number, number]> = {
    Round: [0.95, 1.05],
    Oval: [0.55, 0.75],
    Cushion: [0.90, 1.10],
    Emerald: [0.60, 0.80],
    Pear: [0.55, 0.70],
    Princess: [0.90, 1.10],
    Marquise: [0.40, 0.58],
    Radiant: [0.70, 1.00],
    Asscher: [0.90, 1.10],
    Heart: [0.90, 1.10],
  }
  const [minS, maxS] = idealScales[shape] ?? [0.7, 1.3]
  const s = guide.scale
  if (s >= minS && s <= maxS) return 95
  const delta = Math.min(Math.abs(s - minS), Math.abs(s - maxS))
  return clamp(Math.round(95 - delta * 80), 30, 100)
}

function scoreTipCornerBalance(guide: SymmetryGuideState): number {
  // Use guide mode as proxy – mirror mode suggests user is checking balance
  if (guide.mode === 'mirror-lr' || guide.mode === 'mirror-tb') return 88
  if (guide.showDiagonals) return 82
  return 75
}

function scoreTableCentering(guide: SymmetryGuideState): number {
  // Center deviation from image center (assume 300x300 canvas default center)
  const idealCx = 300
  const idealCy = 300
  const dx = Math.abs(guide.center.x - idealCx)
  const dy = Math.abs(guide.center.y - idealCy)
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist <= 10) return 97
  if (dist <= 25) return 88
  if (dist <= 50) return 75
  if (dist <= 80) return 60
  return clamp(Math.round(50 - dist / 5), 20, 100)
}

function interpretScore(score: number): SymmetryAnalysis['interpretation'] {
  if (score >= 90) return 'Excellent'
  if (score >= 78) return 'Very Good'
  if (score >= 65) return 'Good'
  if (score >= 50) return 'Fair'
  return 'Poor'
}

export function computeSymmetryScore(input: SymmetryInput): SymmetryAnalysis {
  const subScores: SymmetrySubScore = {
    axisAlignment: scoreAxisAlignment(input.guideState),
    outlineBalance: scoreOutlineBalance(input.guideState, input.shape),
    tipCornerBalance: scoreTipCornerBalance(input.guideState),
    tableCentering: scoreTableCentering(input.guideState),
  }

  const overall = Math.round(
    subScores.axisAlignment * 0.35 +
    subScores.outlineBalance * 0.30 +
    subScores.tipCornerBalance * 0.20 +
    subScores.tableCentering * 0.15
  )

  return {
    id: generateId(),
    inspectionId: input.inspectionId,
    assetId: input.assetId,
    overallScore: overall,
    subScores,
    interpretation: interpretScore(overall),
    guideState: input.guideState,
    manualNotes: input.manualNotes,
    createdAt: now(),
  }
}
