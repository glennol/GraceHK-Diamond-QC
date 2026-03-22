export type InclusionTag =
  | 'feather'
  | 'crystal'
  | 'cloud'
  | 'needle'
  | 'pinpoints'
  | 'cavity'
  | 'chip'
  | 'abrasion'
  | 'indented natural'
  | 'surface graining';

export interface ClarityAnnotation {
  id: string;
  inspectionId: string;
  assetId?: string;
  x: number;
  y: number;
  tag: InclusionTag;
  notes?: string;
  severity?: 'minor' | 'moderate' | 'significant';
  createdAt: string;
}

export interface ClaritySummary {
  totalCount: number;
  byTag: Record<string, number>;
  estimatedGrade: string;
  disclaimer: string;
}
