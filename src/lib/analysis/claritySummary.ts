import type { ClarityAnnotation, ClaritySummary, InclusionTag } from '@/types/clarity'

const SEVERITY_WEIGHT: Record<string, number> = {
  minor: 1,
  moderate: 2,
  significant: 3,
}

const HIGH_IMPACT_TAGS: InclusionTag[] = ['feather', 'crystal', 'cavity', 'chip', 'indented natural']

function estimateGradeFromScore(score: number): string {
  if (score === 0) return 'FL/IF (estimated)'
  if (score <= 2) return 'VVS1–VVS2 (estimated)'
  if (score <= 5) return 'VS1–VS2 (estimated)'
  if (score <= 10) return 'SI1–SI2 (estimated)'
  return 'I1–I3 (estimated)'
}

export function generateClaritySummary(annotations: ClarityAnnotation[]): ClaritySummary {
  const byTag: Record<string, number> = {}
  let weightedScore = 0

  for (const ann of annotations) {
    byTag[ann.tag] = (byTag[ann.tag] ?? 0) + 1
    const severityMultiplier = SEVERITY_WEIGHT[ann.severity ?? 'minor'] ?? 1
    const tagMultiplier = HIGH_IMPACT_TAGS.includes(ann.tag) ? 1.5 : 1
    weightedScore += severityMultiplier * tagMultiplier
  }

  return {
    totalCount: annotations.length,
    byTag,
    estimatedGrade: estimateGradeFromScore(weightedScore),
    disclaimer:
      'This AI-assisted grade estimate is for reference only and does not replace a certified gemological assessment. Actual clarity grade requires professional loupe and microscope examination.',
  }
}
