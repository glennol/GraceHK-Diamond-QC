import type { InclusionTag } from '@/types/clarity'

const TAGS: InclusionTag[] = ['feather','crystal','cloud','needle','pinpoints','cavity','chip','abrasion','indented natural','surface graining']

const TAG_COLORS: Partial<Record<InclusionTag, string>> = {
  feather: 'bg-red-500',
  crystal: 'bg-purple-500',
  cloud: 'bg-slate-400',
  needle: 'bg-amber-500',
  pinpoints: 'bg-indigo-500',
  cavity: 'bg-red-700',
  chip: 'bg-yellow-700',
  abrasion: 'bg-yellow-600',
  'indented natural': 'bg-emerald-600',
  'surface graining': 'bg-cyan-600',
}

interface Props {
  activeTag: InclusionTag
  onTagChange: (t: InclusionTag) => void
}

export default function AnnotationToolbar({ activeTag, onTagChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {TAGS.map(tag => (
        <button
          key={tag}
          onClick={() => onTagChange(tag)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
            activeTag === tag
              ? 'border-gem-500 bg-gem-50 dark:bg-gem-900/30 text-gem-700 dark:text-gem-300'
              : 'border-transparent bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${TAG_COLORS[tag] ?? 'bg-slate-400'}`} />
          {tag}
        </button>
      ))}
    </div>
  )
}
