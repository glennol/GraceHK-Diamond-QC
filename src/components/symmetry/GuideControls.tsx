import type { SymmetryGuideState } from '@/types/symmetry'

interface Props {
  guide: SymmetryGuideState
  onChange: (g: SymmetryGuideState) => void
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 dark:text-slate-400">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 accent-gem-500"
      />
      {label}
    </label>
  )
}

export default function GuideControls({ guide, onChange }: Props) {
  const upd = (k: keyof SymmetryGuideState, v: unknown) => onChange({ ...guide, [k]: v })
  return (
    <div className="flex flex-wrap gap-4">
      <Toggle label="Vertical axis" checked={guide.showVertical} onChange={v => upd('showVertical', v)} />
      <Toggle label="Horizontal axis" checked={guide.showHorizontal} onChange={v => upd('showHorizontal', v)} />
      <Toggle label="Diagonals" checked={guide.showDiagonals} onChange={v => upd('showDiagonals', v)} />
      <Toggle label="Outline" checked={guide.showOutline} onChange={v => upd('showOutline', v)} />
    </div>
  )
}
