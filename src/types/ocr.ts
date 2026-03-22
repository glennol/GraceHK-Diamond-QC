export type OCRMatchStatus = 'exact' | 'probable' | 'partial' | 'mismatch' | 'unreadable';

export interface OCRResult {
  id: string;
  inspectionId: string;
  assetId?: string;
  rawText: string;
  confidence: number;
  normalizedText: string;
  manualCorrection?: string;
  matchStatus?: OCRMatchStatus;
  matchTarget?: string;
  createdAt: string;
}
