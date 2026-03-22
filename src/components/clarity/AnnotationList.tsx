import type { ClarityAnnotation } from '@/types/clarity'
import { formatDate } from '@/lib/utils/dates'

interface Props {
  annotations: ClarityAnnotation[]
  onDelete?: (id: string) => void
  onSelect?: (id: string) => void
  selectedId?: string
}

export default function AnnotationList({ annotations, onDelete, onSelect, selectedId }: Props) {
  if (annotations.length === 0) {
    return <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">No annotations yet. Click on the image to add.</p>
  }
  return (
    <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin pr-1">
      {annotations.map(ann => (
        <div
          key={ann.id}
          onClick={() => onSelect?.(ann.id)}
          className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
            selectedId === ann.id
              ? 'bg-gem-50 dark:bg-gem-900/30 border border-gem-300 dark:border-gem-600'
              : 'bg-slate-50 dark:bg-slate-700/50 border border-transparent hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 capitalize">{ann.tag}</p>
            <p className="text-xs text-slate-400">{ann.severity ?? 'minor'} · ({Math.round(ann.x)}, {Math.round(ann.y)}) · {formatDate(ann.createdAt)}</p>
            {ann.notes && <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{ann.notes}</p>}
          </div>
          {onDelete && (
            <button
              onClick={e => { e.stopPropagation(); onDelete(ann.id) }}
              className="text-red-400 hover:text-red-600 text-xs shrink-0 p-1"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
