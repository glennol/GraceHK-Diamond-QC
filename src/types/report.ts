import type { RecommendationResult } from './inspection'
import type { CertificateFieldComparison } from './certificate'

export interface ProportionFinding {
  field: string;
  value: number | string;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  note: string;
}

export interface FinalReport {
  id: string;
  inspectionId: string;
  recommendation: RecommendationResult;
  confidence: number;
  proportionFindings: ProportionFinding[];
  symmetryScore?: number;
  symmetryInterpretation?: string;
  clarityAnnotationCount?: number;
  clarityEstimatedGrade?: string;
  ocrMatchStatus?: string;
  certificateDiscrepancies?: CertificateFieldComparison[];
  summary: string;
  generatedAt: string;
}
