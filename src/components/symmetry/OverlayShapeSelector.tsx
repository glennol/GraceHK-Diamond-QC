import type { DiamondShape } from '@/types/inspection'

const SHAPES: DiamondShape[] = ['Round','Oval','Cushion','Emerald','Pear','Princess','Marquise','Radiant','Asscher','Heart']

interface Props {
  selected: DiamondShape
  onChange: (s: DiamondShape) => void
}

export default function OverlayShapeSelector({ selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {SHAPES.map(s => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${
            selected === s
              ? 'bg-gem-500 text-white'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  )
}
