import { jsPDF } from 'jspdf'
import type { FinalReport } from '@/types/report'
import type { Inspection } from '@/types/inspection'
import { formatDateTime } from '@/lib/utils/dates'

const BRAND_COLOR: [number, number, number] = [14, 165, 233]
const DARK: [number, number, number] = [15, 23, 42]
const MID: [number, number, number] = [71, 85, 105]
const LIGHT: [number, number, number] = [226, 232, 240]

function recommendationColor(r: string): [number, number, number] {
  if (r === 'pass') return [34, 197, 94]
  if (r === 'review') return [234, 179, 8]
  return [239, 68, 68]
}

export function buildPdf(report: FinalReport, inspection: Inspection): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210
  let y = 0

  // Header bar
  doc.setFillColor(...BRAND_COLOR)
  doc.rect(0, 0, W, 22, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Lab Diamond QC Report', 14, 14)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(formatDateTime(report.generatedAt), W - 14, 14, { align: 'right' })

  y = 32

  // Inspection info block
  doc.setTextColor(...DARK)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text(inspection.name, 14, y)
  y += 7

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...MID)
  const d = inspection.diamond
  doc.text(
    `Shape: ${d.shape}  |  Carat: ${d.caratWeight ?? '—'}ct  |  Color: ${d.color ?? '—'}  |  Clarity: ${d.clarity ?? '—'}`,
    14,
    y
  )
  y += 5
  doc.text(
    `Serial: ${d.serialNumber ?? '—'}  |  Cert #: ${d.certificateNumber ?? '—'}`,
    14,
    y
  )
  y += 8

  // Divider
  doc.setDrawColor(...LIGHT)
  doc.line(14, y, W - 14, y)
  y += 8

  // Recommendation badge
  const recColor = recommendationColor(report.recommendation)
  doc.setFillColor(...recColor)
  doc.roundedRect(14, y, 50, 12, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(report.recommendation.toUpperCase(), 39, y + 8, { align: 'center' })

  doc.setTextColor(...DARK)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Confidence: ${report.confidence}%`, 72, y + 8)
  y += 20

  // Summary text
  doc.setFontSize(9)
  doc.setTextColor(...MID)
  const summaryLines = doc.splitTextToSize(report.summary, W - 28)
  doc.text(summaryLines, 14, y)
  y += summaryLines.length * 5 + 6

  // Proportion Findings section
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...DARK)
  doc.text('Proportion Findings', 14, y)
  y += 6

  const statusColors: Record<string, [number, number, number]> = {
    excellent: [34, 197, 94],
    good: [14, 165, 233],
    fair: [234, 179, 8],
    poor: [239, 68, 68],
  }

  for (const f of report.proportionFindings) {
    const color = statusColors[f.status] ?? MID
    doc.setFillColor(...color)
    doc.roundedRect(14, y - 4, 3, 5, 0.5, 0.5, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...DARK)
    doc.text(`${f.field}: ${f.value}`, 20, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...MID)
    const noteLines = doc.splitTextToSize(f.note, W - 50)
    doc.text(noteLines, 90, y)
    y += Math.max(6, noteLines.length * 4.5)
    if (y > 270) {
      doc.addPage()
      y = 20
    }
  }

  y += 4
  doc.setDrawColor(...LIGHT)
  doc.line(14, y, W - 14, y)
  y += 8

  // Symmetry
  if (report.symmetryScore !== undefined) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...DARK)
    doc.text('Symmetry Analysis', 14, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...MID)
    doc.text(`Score: ${report.symmetryScore}/100  |  Interpretation: ${report.symmetryInterpretation ?? '—'}`, 14, y)
    y += 8
  }

  // Clarity
  if (report.clarityAnnotationCount !== undefined) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...DARK)
    doc.text('Clarity Annotations', 14, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...MID)
    doc.text(
      `Total inclusions marked: ${report.clarityAnnotationCount}  |  Estimated grade: ${report.clarityEstimatedGrade ?? '—'}`,
      14,
      y
    )
    y += 8
  }

  // Certificate discrepancies
  if (report.certificateDiscrepancies && report.certificateDiscrepancies.length > 0) {
    if (y > 230) { doc.addPage(); y = 20 }
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...DARK)
    doc.text('Certificate Field Comparison', 14, y)
    y += 6
    for (const c of report.certificateDiscrepancies) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      const statusLabel = c.status === 'match' ? '✓' : c.status === 'mismatch' ? '✗' : '?'
      const lineText = `${statusLabel}  ${c.field}: extracted="${c.extracted ?? '—'}"  entered="${c.entered ?? '—'}"`
      doc.setTextColor(c.status === 'mismatch' ? 239 : c.status === 'match' ? 34 : 71,
        c.status === 'mismatch' ? 68 : c.status === 'match' ? 197 : 85,
        c.status === 'mismatch' ? 68 : c.status === 'match' ? 94 : 105)
      doc.text(lineText, 14, y)
      y += 5.5
      if (y > 270) { doc.addPage(); y = 20 }
    }
  }

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7.5)
    doc.setTextColor(...MID)
    doc.text(
      'This report is generated by Lab Diamond Checker for reference only. Not a substitute for certified gemological appraisal.',
      W / 2,
      292,
      { align: 'center' }
    )
    doc.text(`Page ${i} of ${pageCount}`, W - 14, 292, { align: 'right' })
  }

  doc.save(`diamond-qc-${inspection.id}.pdf`)
}
