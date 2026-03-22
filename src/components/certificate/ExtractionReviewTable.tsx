import type { CertificateExtraction } from '@/types/certificate'

interface Props {
  extraction: CertificateExtraction
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <tr>
      <td className="py-1.5 pr-4 text-xs font-medium text-slate-500 dark:text-slate-400 w-36">{label}</td>
      <td className="py-1.5 text-xs text-slate-800 dark:text-slate-200">{value ?? <span className="text-slate-400">—</span>}</td>
    </tr>
  )
}

export default function ExtractionReviewTable({ extraction }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
          <Row label="Cert Number" value={extraction.extractedCertNumber} />
          <Row label="Shape" value={extraction.extractedShape} />
          <Row label="Measurements" value={extraction.extractedMeasurements} />
          <Row label="Carat Weight" value={extraction.extractedCarat} />
          <Row label="Color" value={extraction.extractedColor} />
          <Row label="Clarity" value={extraction.extractedClarity} />
          <Row label="Cut" value={extraction.extractedCut} />
          <Row label="Polish" value={extraction.extractedPolish} />
          <Row label="Symmetry" value={extraction.extractedSymmetry} />
          <Row label="Fluorescence" value={extraction.extractedFluorescence} />
          <Row label="Inscription" value={extraction.extractedInscription} />
        </tbody>
      </table>
    </div>
  )
}
