import { useRef, useState } from 'react'
import type { AssetType } from '@/types/assets'
import Button from '@/components/common/Button'

const ASSET_TYPES: { value: AssetType; label: string }[] = [
  { value: 'faceUp', label: 'Face Up' },
  { value: 'sideProfile', label: 'Side Profile' },
  { value: 'microscope', label: 'Microscope' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'inscription', label: 'Inscription' },
]

interface Props {
  onUpload: (file: File, type: AssetType) => Promise<void>
  uploading?: boolean
}

export default function AssetUploader({ onUpload, uploading }: Props) {
  const [type, setType] = useState<AssetType>('faceUp')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files) return
    for (const f of Array.from(files)) {
      if (f.type.startsWith('image/')) {
        await onUpload(f, type)
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {ASSET_TYPES.map(t => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              type === t.value
                ? 'bg-gem-500 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragging
            ? 'border-gem-400 bg-gem-50 dark:bg-gem-900/20'
            : 'border-slate-300 dark:border-slate-600 hover:border-gem-300'
        }`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
        <svg className="w-10 h-10 mx-auto text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Drop images here or <span className="text-gem-500 cursor-pointer">browse</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">Uploading as: <strong>{ASSET_TYPES.find(t2 => t2.value === type)?.label}</strong></p>
      </div>

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="w-4 h-4 border-2 border-gem-400 border-t-transparent rounded-full animate-spin" />
          Uploading…
        </div>
      )}
    </div>
  )
}
