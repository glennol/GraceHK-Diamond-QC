import type { SymmetryGuideState } from '@/types/symmetry'

interface Props {
  guide: SymmetryGuideState
  onChange: (g: SymmetryGuideState) => void
}

export default function SymmetryToolbar({ guide, onChange }: Props) {
  const btn = (active: boolean) =>
    `px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
      active
        ? 'bg-gem-500 text-white'
        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
    }`

  const setMode = (mode: SymmetryGuideState['mode']) => onChange({ ...guide, mode })

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mr-1">Mode:</span>
      <button className={btn(guide.mode === 'normal')} onClick={() => setMode('normal')}>Normal</button>
      <button className={btn(guide.mode === 'mirror-lr')} onClick={() => setMode('mirror-lr')}>Mirror L/R</button>
      <button className={btn(guide.mode === 'mirror-tb')} onClick={() => setMode('mirror-tb')}>Mirror T/B</button>

      <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1" />

      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mr-1">Rotation:</span>
      <input
        type="range"
        min={-180}
        max={180}
        value={guide.rotation}
        onChange={e => onChange({ ...guide, rotation: parseInt(e.target.value) })}
        className="w-28 accent-gem-500"
      />
      <span className="text-xs text-slate-500 dark:text-slate-400 w-10">{guide.rotation}°</span>

      <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1" />

      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mr-1">Scale:</span>
      <input
        type="range"
        min={20}
        max={200}
        value={Math.round(guide.scale * 100)}
        onChange={e => onChange({ ...guide, scale: parseInt(e.target.value) / 100 })}
        className="w-24 accent-gem-500"
      />
      <span className="text-xs text-slate-500 dark:text-slate-400 w-10">{Math.round(guide.scale * 100)}%</span>
    </div>
  )
}
