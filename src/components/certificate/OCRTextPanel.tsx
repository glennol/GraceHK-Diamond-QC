import { useState } from 'react'
import Button from '@/components/common/Button'

interface Props {
  rawText: string
  confidence?: number
  onEdit?: (corrected: string) => void
}

export default function OCRTextPanel({ rawText, confidence, onEdit }: Props) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(rawText)

  const save = () => {
    onEdit?.(text)
    setEditing(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">OCR Output</span>
          {confidence !== undefined && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              confidence >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
              : confidence >= 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
              : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
            }`}>
              {Math.round(confidence)}% confidence
            </span>
          )}
        </div>
        {onEdit && !editing && (
          <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>Edit</Button>
        )}
      </div>

      {editing ? (
        <div className="space-y-2">
          <textarea
            className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gem-400 resize-none"
            rows={6}
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="ghost" onClick={() => { setText(rawText); setEditing(false) }}>Cancel</Button>
            <Button size="sm" onClick={save}>Save Correction</Button>
          </div>
        </div>
      ) : (
        <pre className="text-xs font-mono bg-slate-50 dark:bg-slate-900 rounded-lg p-3 overflow-auto max-h-48 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
          {text || '(no text extracted)'}
        </pre>
      )}
    </div>
  )
}
