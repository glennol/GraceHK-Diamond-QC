import { useState } from 'react'
import type { ClarityAnnotation, InclusionTag } from '@/types/clarity'
import Button from '@/components/common/Button'

const SEVERITY_OPTIONS = ['minor', 'moderate', 'significant'] as const

interface Props {
  annotation: ClarityAnnotation
  onSave: (updated: ClarityAnnotation) => void
  onClose: () => void
}

export default function AnnotationEditor({ annotation, onSave, onClose }: Props) {
  const [tag, setTag] = useState<InclusionTag>(annotation.tag)
  const [severity, setSeverity] = useState(annotation.severity ?? 'minor')
  const [notes, setNotes] = useState(annotation.notes ?? '')

  const TAGS: InclusionTag[] = ['feather','crystal','cloud','needle','pinpoints','cavity','chip','abrasion','indented natural','surface graining']

  const inputCls = 'w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gem-400'

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Inclusion Type</label>
        <select className={inputCls} value={tag} onChange={e => setTag(e.target.value as InclusionTag)}>
          {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Severity</label>
        <div className="flex gap-2">
          {SEVERITY_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setSeverity(s)}
              className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                severity === s ? 'bg-gem-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Notes</label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={2}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Optional note about this inclusion…"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={() => onSave({ ...annotation, tag, severity, notes })}>Save</Button>
      </div>
    </div>
  )
}
