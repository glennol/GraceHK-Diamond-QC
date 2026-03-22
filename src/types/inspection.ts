export type DiamondShape =
  | 'Round'
  | 'Oval'
  | 'Cushion'
  | 'Emerald'
  | 'Pear'
  | 'Princess'
  | 'Marquise'
  | 'Radiant'
  | 'Asscher'
  | 'Heart';

export type GradeLevel = 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
export type FluorescenceLevel = 'None' | 'Faint' | 'Medium' | 'Strong' | 'Very Strong';
export type ClarityGrade = 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'SI1' | 'SI2' | 'I1' | 'I2' | 'I3';
export type ColorGrade = 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M';
export type RecommendationResult = 'pass' | 'review' | 'fail';
export type InspectionStatus = 'draft' | 'in-progress' | 'complete';

export interface DiamondProfile {
  shape: DiamondShape;
  caratWeight?: number;
  length?: number;
  width?: number;
  depth?: number;
  tablePercent?: number;
  depthPercent?: number;
  girdle?: string;
  culet?: string;
  polish?: GradeLevel;
  symmetry?: GradeLevel;
  fluorescence?: FluorescenceLevel;
  color?: ColorGrade;
  clarity?: ClarityGrade;
  serialNumber?: string;
  certificateNumber?: string;
  notes?: string;
}

export interface Inspection {
  id: string;
  name: string;
  status: InspectionStatus;
  diamond: DiamondProfile;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}
