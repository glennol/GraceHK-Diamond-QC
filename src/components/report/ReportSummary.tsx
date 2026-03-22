import type { FinalReport } from '@/types/report'
import Badge from '@/components/common/Badge'

interface Props {
  report: FinalReport
}

const recConfig: Record<string, { color: 'green' | 'yellow' | 'red'; label: string; desc: string }> = {
  pass: { color: 'green', label: 'PASS', desc: 'This diamond meets quality standards based on available measurements.' },
  review: { color: 'yellow', label: 'REVIEW', desc: 'One or more metrics are borderline. Further inspection is recommended.' },
  fail: { color: 'red', label: 'FAIL', desc: 'Multiple metrics fall outside acceptable ranges. Professional review required.' },
}

export default function ReportSummary({ report }: Props) {
  const cfg = recConfig[report.recommendation]
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Badge color={cfg.color} size="md">{cfg.label}</Badge>
        <div>
          <p className="text-sm text-slate-700 dark:text-slate-300">{cfg.desc}</p>
          <p className="text-xs text-slate-400 mt-0.5">Confidence: {report.confidence}%</p>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400">{report.summary}</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        {report.symmetryScore !== undefined && (
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{report.symmetryScore}</p>
            <p className="text-xs text-slate-400 mt-0.5">Symmetry Score</p>
          </div>
        )}
        {report.clarityAnnotationCount !== undefined && (
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{report.clarityAnnotationCount}</p>
            <p className="text-xs text-slate-400 mt-0.5">Inclusions Marked</p>
          </div>
        )}
        {report.proportionFindings && (
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {report.proportionFindings.filter(f => f.status === 'excellent' || f.status === 'good').length}
              /{report.proportionFindings.length}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Proportions OK</p>
          </div>
        )}
        {report.certificateDiscrepancies && (
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {report.certificateDiscrepancies.filter(c => c.status === 'mismatch').length}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Cert Mismatches</p>
          </div>
        )}
      </div>
    </div>
  )
}
