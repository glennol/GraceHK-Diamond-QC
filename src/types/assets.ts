export type AssetType = 'faceUp' | 'sideProfile' | 'microscope' | 'certificate' | 'inscription';

export interface UploadedAsset {
  id: string;
  inspectionId: string;
  type: AssetType;
  filename: string;
  mimeType: string;
  size: number;
  dataUrl?: string;
  createdAt: string;
  notes?: string;
}
