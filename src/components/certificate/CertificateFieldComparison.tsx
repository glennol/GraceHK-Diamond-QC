import type { CertificateFieldComparison } from '@/types/certificate'
import Badge from '@/components/common/Badge'

interface Props {
  comparisons: CertificateFieldComparison[]
}

const statusBadge: Record<string, { color: 'green' | 'red' | 'yellow' | 'default'; label: string }> = {
  match: { color: 'green', label: 'Match' },
  mismatch: { color: 'red', label: 'Mismatch' },
  unverified: { color: 'yellow', label: 'Unverified' },
  missing: { color: 'default', label: 'Missing' },
}

export default function CertificateFieldComparisonTable({ comparisons }: Props) {
  if (comparisons.length === 0) {
    return <p className="text-sm text-slate-400 text-center py-4">No field comparisons available.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
            <th className="pb-2 pr-4 font-medium">Field</th>
            <th className="pb-2 pr-4 font-medium">Extracted (OCR)</th>
            <th className="pb-2 pr-4 font-medium">Entered</th>
            <th className="pb-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {comparisons.map(c => {
            const s = statusBadge[c.status] ?? statusBadge.unverified
            return (
              <tr key={c.field}>
                <td className="py-2 pr-4 font-medium text-slate-700 dark:text-slate-300">{c.field}</td>
                <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">{c.extracted ?? '—'}</td>
                <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">{c.entered ?? '—'}</td>
                <td className="py-2"><Badge color={s.color}>{s.label}</Badge></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
