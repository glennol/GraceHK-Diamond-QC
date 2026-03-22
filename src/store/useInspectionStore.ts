import { create } from 'zustand'
import type { Inspection } from '@/types/inspection'
import type { UploadedAsset } from '@/types/assets'
import type { ClarityAnnotation } from '@/types/clarity'
import type { SymmetryAnalysis } from '@/types/symmetry'
import type { OCRResult } from '@/types/ocr'
import type { CertificateExtraction } from '@/types/certificate'
import type { FinalReport } from '@/types/report'
import {
  getInspection,
  saveInspection,
  getAssetsByInspection,
  saveAsset,
  deleteAsset as dbDeleteAsset,
  getClarityByInspection,
  saveClarityAnnotation,
  deleteClarityAnnotation as dbDeleteAnnotation,
  getSymmetryByInspection,
  saveSymmetryAnalysis,
  getOCRByInspection,
  saveOCRResult,
  getCertByInspection,
  saveCertExtraction,
  getReportByInspection,
  saveReport,
} from '@/lib/db/repositories'
import { now } from '@/lib/utils/dates'

interface InspectionStore {
  currentInspection: Inspection | null
  assets: UploadedAsset[]
  clarityAnnotations: ClarityAnnotation[]
  symmetryAnalysis: SymmetryAnalysis | null
  ocrResults: OCRResult[]
  certExtraction: CertificateExtraction | null
  report: FinalReport | null
  isLoading: boolean
  error: string | null

  loadInspection: (id: string) => Promise<void>
  updateInspection: (updates: Partial<Inspection>) => Promise<void>
  addAsset: (asset: UploadedAsset) => Promise<void>
  removeAsset: (id: string) => Promise<void>
  addAnnotation: (ann: ClarityAnnotation) => Promise<void>
  removeAnnotation: (id: string) => Promise<void>
  setSymmetryAnalysis: (analysis: SymmetryAnalysis) => Promise<void>
  addOCRResult: (result: OCRResult) => Promise<void>
  setCertExtraction: (cert: CertificateExtraction) => Promise<void>
  setReport: (report: FinalReport) => Promise<void>
  clear: () => void
}

export const useInspectionStore = create<InspectionStore>((set, get) => ({
  currentInspection: null,
  assets: [],
  clarityAnnotations: [],
  symmetryAnalysis: null,
  ocrResults: [],
  certExtraction: null,
  report: null,
  isLoading: false,
  error: null,

  loadInspection: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const [inspection, assets, clarity, symmetryList, ocr, certList, report] = await Promise.all([
        getInspection(id),
        getAssetsByInspection(id),
        getClarityByInspection(id),
        getSymmetryByInspection(id),
        getOCRByInspection(id),
        getCertByInspection(id),
        getReportByInspection(id),
      ])
      set({
        currentInspection: inspection ?? null,
        assets,
        clarityAnnotations: clarity,
        symmetryAnalysis: symmetryList[0] ?? null,
        ocrResults: ocr,
        certExtraction: certList[0] ?? null,
        report: report ?? null,
        isLoading: false,
      })
    } catch (e) {
      set({ error: String(e), isLoading: false })
    }
  },

  updateInspection: async (updates) => {
    const current = get().currentInspection
    if (!current) return
    const updated: Inspection = { ...current, ...updates, updatedAt: now() }
    await saveInspection(updated)
    set({ currentInspection: updated })
  },

  addAsset: async (asset) => {
    await saveAsset(asset)
    set(s => ({ assets: [...s.assets, asset] }))
  },

  removeAsset: async (id) => {
    await dbDeleteAsset(id)
    set(s => ({ assets: s.assets.filter(a => a.id !== id) }))
  },

  addAnnotation: async (ann) => {
    await saveClarityAnnotation(ann)
    set(s => ({ clarityAnnotations: [...s.clarityAnnotations, ann] }))
  },

  removeAnnotation: async (id) => {
    await dbDeleteAnnotation(id)
    set(s => ({ clarityAnnotations: s.clarityAnnotations.filter(a => a.id !== id) }))
  },

  setSymmetryAnalysis: async (analysis) => {
    await saveSymmetryAnalysis(analysis)
    set({ symmetryAnalysis: analysis })
  },

  addOCRResult: async (result) => {
    await saveOCRResult(result)
    set(s => ({ ocrResults: [...s.ocrResults, result] }))
  },

  setCertExtraction: async (cert) => {
    await saveCertExtraction(cert)
    set({ certExtraction: cert })
  },

  setReport: async (report) => {
    await saveReport(report)
    set({ report })
  },

  clear: () => set({
    currentInspection: null,
    assets: [],
    clarityAnnotations: [],
    symmetryAnalysis: null,
    ocrResults: [],
    certExtraction: null,
    report: null,
    isLoading: false,
    error: null,
  }),
}))
