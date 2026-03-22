import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useInspectionStore } from '@/store/useInspectionStore'
import { analyzeProportions } from '@/lib/analysis/proportionEngine'
import { generateClaritySummary } from '@/lib/analysis/claritySummary'
import { buildReport } from '@/lib/export/reportBuilder'
import type { CertificateFieldComparison } from '@/types/certificate'
import { compareInscription } from '@/lib/ocr/inscriptionParser'
import PageHeader from '@/components/layout/PageHeader'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import ReportSummary from '@/components/report/ReportSummary'
import ReportSection from '@/components/report/ReportSection'
import ExportPdfButton from '@/components/report/ExportPdfButton'
import Badge from '@/components/common/Badge'

export default function ReportPage() {
  const { id } = useParams<{ id: string }>()
  const {
    currentInspection, clarityAnnotations, symmetryAnalysis,
    certExtraction, ocrResults, report, loadInspection, setReport
  } = useInspectionStore()
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (id && !currentInspection) loadInspection(id)
  }, [id, currentInspection, loadInspection])

  const handleGenerate = async () => {
    if (!currentInspection) return
    setGenerating(true)
    try {
      const { findings } = analyzeProportions(currentInspection.diamond)
      const claritySummary = generateClaritySummary(clarityAnnotations)

      let certDiscrepancies: CertificateFieldComparison[] | undefined
      if (certExtraction && currentInspection.diamond.serialNumber) {
        const d = currentInspection.diamond
        certDiscrepancies = [
          { field: 'Cert Number', extracted: certExtraction.extractedCertNumber, entered: d.certificateNumber, status: compareStatus(certExtraction.extractedCertNumber, d.certificateNumber) },
          { field: 'Color', extracted: certExtraction.extractedColor, entered: d.color, status: compareStatus(certExtraction.extractedColor, d.color) },
          { field: 'Clarity', extracted: certExtraction.extractedClarity, entered: d.clarity, status: compareStatus(certExtraction.extractedClarity, d.clarity) },
          { field: 'Inscription', extracted: certExtraction.extractedInscription, entered: d.serialNumber, status: compareInscription(certExtraction.extractedInscription ?? '', d.serialNumber ?? '').status === 'exact' ? 'match' : 'mismatch' },
        ]
      }

      const latestOcr = ocrResults[ocrResults.length - 1]
      const generated = buildReport(
        currentInspection,
        findings,
        symmetryAnalysis?.overallScore,
        symmetryAnalysis?.interpretation,
        clarityAnnotations.length,
        claritySummary.estimatedGrade,
        latestOcr?.matchStatus,
        certDiscrepancies,
      )
      await setReport(generated)
    } finally {
      setGenerating(false)
    }
  }

  function compareStatus(a?: string, b?: string): CertificateFieldComparison['status'] {
    if (!a || !b) return 'missing'
    const { status } = compareInscription(a, b)
    return (status === 'exact' || status === 'probable') ? 'match' : 'mismatch'
  }

  const findingStatusConfig: Record<string, { color: 'green' | 'gem' | 'yellow' | 'red' }> = {
    excellent: { color: 'green' },
    good: { color: 'gem' },
    fair: { color: 'yellow' },
    poor: { color: 'red' },
  }

  return (
    <div>
      <PageHeader
        title="QC Report"
        subtitle={currentInspection?.name}
        actions={
          <div className="flex gap-2">
            {report && currentInspection && <ExportPdfButton report={report} inspection={currentInspection} />}
            <Button onClick={handleGenerate} loading={generating}>
              {report ? 'Regenerate' : 'Generate Report'}
            </Button>
          </div>
        }
      />

      {!report ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Complete the inspection steps (Proportions, Symmetry, Clarity, Certificate) then generate the final report.
            </p>
            <Button onClick={handleGenerate} loading={generating}>Generate Report</Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <ReportSummary report={report} />
          </Card>

          <ReportSection title="Proportion Findings">
            <div className="space-y-3">
              {report.proportionFindings.map(f => {
                const cfg = findingStatusConfig[f.status] ?? { color: 'default' as const }
                return (
                  <div key={f.field} className="flex items-start gap-3">
                    <Badge color={cfg.color} size="sm">{f.status}</Badge>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{f.field}: {f.value}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{f.note}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </ReportSection>

          {report.symmetryScore !== undefined && (
            <ReportSection title="Symmetry">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Score: <strong>{report.symmetryScore}/100</strong> — {report.symmetryInterpretation}
              </p>
            </ReportSection>
          )}

          {report.clarityAnnotationCount !== undefined && (
            <ReportSection title="Clarity">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {report.clarityAnnotationCount} inclusions annotated. Estimated grade: <strong>{report.clarityEstimatedGrade}</strong>
              </p>
            </ReportSection>
          )}

          {report.certificateDiscrepancies && report.certificateDiscrepancies.length > 0 && (
            <ReportSection title="Certificate Comparison">
              <div className="space-y-2">
                {report.certificateDiscrepancies.map(c => (
                  <div key={c.field} className="flex items-center gap-2 text-sm">
                    <Badge color={c.status === 'match' ? 'green' : c.status === 'mismatch' ? 'red' : 'default'} size="sm">
                      {c.status}
                    </Badge>
                    <span className="text-slate-700 dark:text-slate-300">{c.field}:</span>
                    <span className="text-slate-500 dark:text-slate-400">extracted="{c.extracted ?? '—'}" / entered="{c.entered ?? '—'}"</span>
                  </div>
                ))}
              </div>
            </ReportSection>
          )}
        </div>
      )}
    </div>
  )
}
