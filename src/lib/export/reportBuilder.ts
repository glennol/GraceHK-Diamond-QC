import type { FinalReport } from '@/types/report'
import type { Inspection } from '@/types/inspection'

export function buildReport(
  inspection: Inspection,
  proportionFindings: FinalReport['proportionFindings'],
  symmetryScore?: number,
  symmetryInterpretation?: string,
  clarityCount?: number,
  clarityGrade?: string,
  ocrStatus?: string,
  certDiscrepancies?: FinalReport['certificateDiscrepancies']
): FinalReport {
  const failCount = proportionFindings.filter(f => f.status === 'poor').length
  const reviewCount = proportionFindings.filter(f => f.status === 'fair').length

  let recommendation: FinalReport['recommendation'] = 'pass'
  if (failCount >= 2 || (symmetryScore !== undefined && symmetryScore < 40)) {
    recommendation = 'fail'
  } else if (failCount >= 1 || reviewCount >= 2 || (symmetryScore !== undefined && symmetryScore < 70)) {
    recommendation = 'review'
  }

  const confidence = Math.max(60, 100 - failCount * 15 - reviewCount * 8)

  return {
    id: `report-${inspection.id}`,
    inspectionId: inspection.id,
    recommendation,
    confidence,
    proportionFindings,
    symmetryScore,
    symmetryInterpretation,
    clarityAnnotationCount: clarityCount,
    clarityEstimatedGrade: clarityGrade,
    ocrMatchStatus: ocrStatus,
    certificateDiscrepancies: certDiscrepancies,
    summary: `Inspection of ${inspection.diamond.shape} ${inspection.diamond.caratWeight ?? '?'}ct diamond. Recommendation: ${recommendation.toUpperCase()}.`,
    generatedAt: new Date().toISOString(),
  }
}
