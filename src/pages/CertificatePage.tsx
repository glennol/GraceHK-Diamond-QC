import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useInspectionStore } from '@/store/useInspectionStore'
import { runOCR } from '@/lib/ocr/tesseract'
import { parseCertificateText } from '@/lib/ocr/certificateParser'
import { compareInscription } from '@/lib/ocr/inscriptionParser'
import type { CertificateExtraction } from '@/types/certificate'
import type { CertificateFieldComparison } from '@/types/certificate'
import type { OCRResult } from '@/types/ocr'
import { generateId } from '@/lib/utils/ids'
import { now } from '@/lib/utils/dates'
import PageHeader from '@/components/layout/PageHeader'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import OCRTextPanel from '@/components/certificate/OCRTextPanel'
import CertificateFieldComparisonTable from '@/components/certificate/CertificateFieldComparison'
import ExtractionReviewTable from '@/components/certificate/ExtractionReviewTable'
import ImageViewer from '@/components/viewer/ImageViewer'

import type { Inspection } from '@/types/inspection'

function buildComparisons(
  extraction: CertificateExtraction,
  inspection: Inspection | null
): CertificateFieldComparison[] {
  if (!inspection) return []
  const d = inspection.diamond
  const fields: Array<{ field: string; extracted: string | undefined; entered: string | undefined }> = [
    { field: 'Cert Number', extracted: extraction.extractedCertNumber, entered: d.certificateNumber },
    { field: 'Shape', extracted: extraction.extractedShape, entered: d.shape },
    { field: 'Carat', extracted: extraction.extractedCarat, entered: d.caratWeight?.toString() },
    { field: 'Color', extracted: extraction.extractedColor, entered: d.color },
    { field: 'Clarity', extracted: extraction.extractedClarity, entered: d.clarity },
    { field: 'Polish', extracted: extraction.extractedPolish, entered: d.polish },
    { field: 'Symmetry', extracted: extraction.extractedSymmetry, entered: d.symmetry },
    { field: 'Fluorescence', extracted: extraction.extractedFluorescence, entered: d.fluorescence },
    { field: 'Inscription', extracted: extraction.extractedInscription, entered: d.serialNumber },
  ]
  return fields.map(f => {
    let status: CertificateFieldComparison['status'] = 'unverified'
    if (!f.extracted && !f.entered) status = 'unverified'
    else if (!f.extracted || !f.entered) status = 'missing'
    else {
      const { status: matchStatus } = compareInscription(f.extracted, f.entered)
      status = (matchStatus === 'exact' || matchStatus === 'probable') ? 'match' : 'mismatch'
    }
    return { ...f, status }
  })
}

export default function CertificatePage() {
  const { id } = useParams<{ id: string }>()
  const { currentInspection, assets, certExtraction, ocrResults, loadInspection, setCertExtraction, addOCRResult } = useInspectionStore()
  const [ocrProgress, setOcrProgress] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (id && !currentInspection) loadInspection(id)
  }, [id, currentInspection, loadInspection])

  const certAsset = assets.find(a => a.type === 'certificate')
  const inscriptionAsset = assets.find(a => a.type === 'inscription')

  const runCertOCR = async () => {
    if (!certAsset?.dataUrl || !id) return
    setRunning(true)
    setOcrProgress(0)
    try {
      const result = await runOCR(certAsset.dataUrl, setOcrProgress)
      const parsed = parseCertificateText(result.text)
      const ocrResult: OCRResult = {
        id: generateId(),
        inspectionId: id,
        assetId: certAsset.id,
        rawText: result.text,
        confidence: result.confidence,
        normalizedText: result.text.trim(),
        createdAt: now(),
      }
      await addOCRResult(ocrResult)
      const extraction: CertificateExtraction = {
        id: generateId(),
        inspectionId: id,
        assetId: certAsset.id,
        rawText: result.text,
        extractedCertNumber: parsed.certNumber,
        extractedShape: parsed.shape,
        extractedMeasurements: parsed.measurements,
        extractedCarat: parsed.carat,
        extractedColor: parsed.color,
        extractedClarity: parsed.clarity,
        extractedCut: parsed.cut,
        extractedPolish: parsed.polish,
        extractedSymmetry: parsed.symmetry,
        extractedFluorescence: parsed.fluorescence,
        extractedInscription: parsed.inscription,
        createdAt: now(),
      }
      await setCertExtraction(extraction)
    } finally {
      setRunning(false)
    }
  }

  const comparisons = certExtraction ? buildComparisons(certExtraction, currentInspection) : []
  const latestOcr = ocrResults[ocrResults.length - 1]

  return (
    <div>
      <PageHeader title="Certificate Verification" subtitle={currentInspection?.name} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          {certAsset?.dataUrl && (
            <Card header="Certificate Image">
              <ImageViewer src={certAsset.dataUrl} />
            </Card>
          )}

          {inscriptionAsset?.dataUrl && (
            <Card header="Inscription Image">
              <ImageViewer src={inscriptionAsset.dataUrl} />
            </Card>
          )}

          {!certAsset && (
            <Card>
              <div className="text-center py-8 text-slate-400">
                <p className="text-sm">Upload a certificate image in the Images section first.</p>
              </div>
            </Card>
          )}

          <Button
            onClick={runCertOCR}
            loading={running}
            disabled={!certAsset}
            className="w-full"
          >
            {running ? `Running OCR… ${ocrProgress}%` : 'Run OCR on Certificate'}
          </Button>
        </div>

        <div className="space-y-4">
          {latestOcr && (
            <Card header="OCR Output">
              <OCRTextPanel rawText={latestOcr.rawText} confidence={latestOcr.confidence} />
            </Card>
          )}

          {certExtraction && (
            <Card header="Extracted Fields">
              <ExtractionReviewTable extraction={certExtraction} />
            </Card>
          )}

          {comparisons.length > 0 && (
            <Card header="Field Comparison">
              <CertificateFieldComparisonTable comparisons={comparisons} />
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
