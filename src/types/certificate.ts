export type FieldVerificationStatus = 'match' | 'mismatch' | 'unverified' | 'missing';

export interface CertificateExtraction {
  id: string;
  inspectionId: string;
  assetId?: string;
  rawText: string;
  extractedShape?: string;
  extractedMeasurements?: string;
  extractedCarat?: string;
  extractedColor?: string;
  extractedClarity?: string;
  extractedCut?: string;
  extractedPolish?: string;
  extractedSymmetry?: string;
  extractedFluorescence?: string;
  extractedInscription?: string;
  extractedCertNumber?: string;
  createdAt: string;
}

export interface CertificateFieldComparison {
  field: string;
  extracted: string | undefined;
  entered: string | undefined;
  status: FieldVerificationStatus;
}
