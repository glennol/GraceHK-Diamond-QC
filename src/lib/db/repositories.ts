import { getDb } from './indexedDb'
import type { Inspection } from '@/types/inspection'
import type { UploadedAsset } from '@/types/assets'
import type { OCRResult } from '@/types/ocr'
import type { ClarityAnnotation } from '@/types/clarity'
import type { SymmetryAnalysis } from '@/types/symmetry'
import type { CertificateExtraction } from '@/types/certificate'
import type { FinalReport } from '@/types/report'

// Inspections
export async function getAllInspections(): Promise<Inspection[]> {
  const db = await getDb()
  return db.getAll('inspections')
}
export async function getInspection(id: string): Promise<Inspection | undefined> {
  const db = await getDb()
  return db.get('inspections', id)
}
export async function saveInspection(inspection: Inspection): Promise<void> {
  const db = await getDb()
  await db.put('inspections', inspection)
}
export async function deleteInspection(id: string): Promise<void> {
  const db = await getDb()
  await db.delete('inspections', id)
}

// Assets
export async function getAssetsByInspection(inspectionId: string): Promise<UploadedAsset[]> {
  const db = await getDb()
  return db.getAllFromIndex('assets', 'byInspection', inspectionId)
}
export async function saveAsset(asset: UploadedAsset): Promise<void> {
  const db = await getDb()
  await db.put('assets', asset)
}
export async function deleteAsset(id: string): Promise<void> {
  const db = await getDb()
  await db.delete('assets', id)
}

// OCR Results
export async function getOCRByInspection(inspectionId: string): Promise<OCRResult[]> {
  const db = await getDb()
  return db.getAllFromIndex('ocrResults', 'byInspection', inspectionId)
}
export async function saveOCRResult(result: OCRResult): Promise<void> {
  const db = await getDb()
  await db.put('ocrResults', result)
}

// Clarity Annotations
export async function getClarityByInspection(inspectionId: string): Promise<ClarityAnnotation[]> {
  const db = await getDb()
  return db.getAllFromIndex('clarityAnnotations', 'byInspection', inspectionId)
}
export async function saveClarityAnnotation(ann: ClarityAnnotation): Promise<void> {
  const db = await getDb()
  await db.put('clarityAnnotations', ann)
}
export async function deleteClarityAnnotation(id: string): Promise<void> {
  const db = await getDb()
  await db.delete('clarityAnnotations', id)
}

// Symmetry Analyses
export async function getSymmetryByInspection(inspectionId: string): Promise<SymmetryAnalysis[]> {
  const db = await getDb()
  return db.getAllFromIndex('symmetryAnalyses', 'byInspection', inspectionId)
}
export async function saveSymmetryAnalysis(analysis: SymmetryAnalysis): Promise<void> {
  const db = await getDb()
  await db.put('symmetryAnalyses', analysis)
}

// Certificate Extractions
export async function getCertByInspection(inspectionId: string): Promise<CertificateExtraction[]> {
  const db = await getDb()
  return db.getAllFromIndex('certExtractions', 'byInspection', inspectionId)
}
export async function saveCertExtraction(cert: CertificateExtraction): Promise<void> {
  const db = await getDb()
  await db.put('certExtractions', cert)
}

// Reports
export async function getReportByInspection(inspectionId: string): Promise<FinalReport | undefined> {
  const db = await getDb()
  const results = await db.getAllFromIndex('reports', 'byInspection', inspectionId)
  return results[0]
}
export async function saveReport(report: FinalReport): Promise<void> {
  const db = await getDb()
  await db.put('reports', report)
}

// Settings
export async function getSetting<T>(key: string): Promise<T | undefined> {
  const db = await getDb()
  const row = await db.get('settings', key)
  return row?.value as T | undefined
}
export async function setSetting(key: string, value: unknown): Promise<void> {
  const db = await getDb()
  await db.put('settings', { key, value })
}
