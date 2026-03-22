export interface Point {
  x: number;
  y: number;
}

export interface SymmetryGuideState {
  center: Point;
  rotation: number;
  scale: number;
  showVertical: boolean;
  showHorizontal: boolean;
  showDiagonals: boolean;
  showOutline: boolean;
  mode: 'normal' | 'mirror-lr' | 'mirror-tb';
}

export interface SymmetrySubScore {
  axisAlignment: number;
  outlineBalance: number;
  tipCornerBalance: number;
  tableCentering: number;
}

export interface SymmetryAnalysis {
  id: string;
  inspectionId: string;
  assetId?: string;
  overallScore: number;
  subScores: SymmetrySubScore;
  interpretation: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
  guideState: SymmetryGuideState;
  mismatchData?: number[][];
  manualNotes?: string;
  createdAt: string;
}
