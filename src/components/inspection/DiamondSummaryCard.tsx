import type { Inspection } from '@/types/inspection'
import Badge from '@/components/common/Badge'
import { formatDateTime } from '@/lib/utils/dates'

interface Props {
  inspection: Inspection
}

function Row({ label, value }: { label: string; value?: string | number }) {
  if (value === undefined || value === '') return null
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-medium text-slate-800 dark:text-slate-200">{value}</span>
    </div>
  )
}

function statusColor(s: Inspection['status']) {
  if (s === 'complete') return 'green' as const
  if (s === 'in-progress') return 'yellow' as const
  return 'default' as const
}

export default function DiamondSummaryCard({ inspection }: Props) {
  const d = inspection.diamond
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">{inspection.name}</h2>
        <Badge color={statusColor(inspection.status)}>{inspection.status}</Badge>
      </div>

      <div className="space-y-2">
        <Row label="Shape" value={d.shape} />
        <Row label="Carat Weight" value={d.caratWeight !== undefined ? `${d.caratWeight} ct` : undefined} />
        <Row label="Dimensions" value={d.length && d.width && d.depth ? `${d.length} × ${d.width} × ${d.depth} mm` : undefined} />
        <Row label="Table %" value={d.tablePercent} />
        <Row label="Depth %" value={d.depthPercent} />
        <Row label="Color" value={d.color} />
        <Row label="Clarity" value={d.clarity} />
        <Row label="Polish" value={d.polish} />
        <Row label="Symmetry" value={d.symmetry} />
        <Row label="Fluorescence" value={d.fluorescence} />
        <Row label="Girdle" value={d.girdle} />
        <Row label="Culet" value={d.culet} />
        <Row label="Serial / Inscription" value={d.serialNumber} />
        <Row label="Certificate #" value={d.certificateNumber} />
      </div>

      {d.notes && (
        <div className="pt-2 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
          {d.notes}
        </div>
      )}

      <p className="text-xs text-slate-400 dark:text-slate-500">
        Last updated: {formatDateTime(inspection.updatedAt)}
      </p>

      {inspection.tags && inspection.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {inspection.tags.map(t => <Badge key={t}>{t}</Badge>)}
        </div>
      )}
    </div>
  )
}
