import { useState } from 'react'
import type { UploadedAsset } from '@/types/assets'
import { formatDate } from '@/lib/utils/dates'

interface Props {
  assets: UploadedAsset[]
  onDelete?: (id: string) => void
  onSelect?: (asset: UploadedAsset) => void
}

const TYPE_LABELS: Record<string, string> = {
  faceUp: 'Face Up',
  sideProfile: 'Side Profile',
  microscope: 'Microscope',
  certificate: 'Certificate',
  inscription: 'Inscription',
}

export default function AssetGallery({ assets, onDelete, onSelect }: Props) {
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all' ? assets : assets.filter(a => a.type === filter)
  const types = Array.from(new Set(assets.map(a => a.type)))

  if (assets.length === 0) {
    return (
      <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">No images uploaded yet.</p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === 'all' ? 'bg-gem-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
        >
          All ({assets.length})
        </button>
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === t ? 'bg-gem-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
          >
            {TYPE_LABELS[t] ?? t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map(asset => (
          <div
            key={asset.id}
            className="group relative bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-600 hover:border-gem-400 transition-colors"
            onClick={() => onSelect?.(asset)}
          >
            {asset.dataUrl ? (
              <img
                src={asset.dataUrl}
                alt={asset.filename}
                className="w-full aspect-square object-cover"
              />
            ) : (
              <div className="w-full aspect-square flex items-center justify-center text-slate-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="p-2">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{asset.filename}</p>
              <p className="text-xs text-slate-400">{TYPE_LABELS[asset.type] ?? asset.type} · {formatDate(asset.createdAt)}</p>
            </div>
            {onDelete && (
              <button
                onClick={e => { e.stopPropagation(); onDelete(asset.id) }}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
