import { useState } from 'react'
import type { Inspection, DiamondProfile, DiamondShape, GradeLevel, FluorescenceLevel, ClarityGrade, ColorGrade } from '@/types/inspection'
import Button from '@/components/common/Button'

const SHAPES: DiamondShape[] = ['Round','Oval','Cushion','Emerald','Pear','Princess','Marquise','Radiant','Asscher','Heart']
const GRADES: GradeLevel[] = ['Excellent','Very Good','Good','Fair','Poor']
const FLUOR: FluorescenceLevel[] = ['None','Faint','Medium','Strong','Very Strong']
const CLARITY: ClarityGrade[] = ['FL','IF','VVS1','VVS2','VS1','VS2','SI1','SI2','I1','I2','I3']
const COLORS: ColorGrade[] = ['D','E','F','G','H','I','J','K','L','M']

interface Props {
  initial?: Partial<Inspection>
  onSave: (data: Pick<Inspection, 'name' | 'diamond' | 'tags'>) => void
  onCancel?: () => void
  saving?: boolean
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gem-400'

export default function InspectionForm({ initial, onSave, onCancel, saving }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [diamond, setDiamond] = useState<DiamondProfile>({
    shape: initial?.diamond?.shape ?? 'Round',
    caratWeight: initial?.diamond?.caratWeight,
    length: initial?.diamond?.length,
    width: initial?.diamond?.width,
    depth: initial?.diamond?.depth,
    tablePercent: initial?.diamond?.tablePercent,
    depthPercent: initial?.diamond?.depthPercent,
    girdle: initial?.diamond?.girdle ?? '',
    culet: initial?.diamond?.culet ?? '',
    polish: initial?.diamond?.polish,
    symmetry: initial?.diamond?.symmetry,
    fluorescence: initial?.diamond?.fluorescence,
    color: initial?.diamond?.color,
    clarity: initial?.diamond?.clarity,
    serialNumber: initial?.diamond?.serialNumber ?? '',
    certificateNumber: initial?.diamond?.certificateNumber ?? '',
    notes: initial?.diamond?.notes ?? '',
  })
  const [tagsStr, setTagsStr] = useState((initial?.tags ?? []).join(', '))

  const upd = (k: keyof DiamondProfile, v: unknown) => setDiamond(d => ({ ...d, [k]: v }))
  const numField = (k: keyof DiamondProfile) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    upd(k, isNaN(v) ? undefined : v)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      diamond,
      tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Field label="Inspection Name *">
        <input required className={inputCls} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Round 1.02ct – Client A" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Shape">
          <select className={inputCls} value={diamond.shape} onChange={e => upd('shape', e.target.value as DiamondShape)}>
            {SHAPES.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Carat Weight">
          <input type="number" step="0.01" className={inputCls} value={diamond.caratWeight ?? ''} onChange={numField('caratWeight')} placeholder="e.g. 1.02" />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Length (mm)">
          <input type="number" step="0.01" className={inputCls} value={diamond.length ?? ''} onChange={numField('length')} />
        </Field>
        <Field label="Width (mm)">
          <input type="number" step="0.01" className={inputCls} value={diamond.width ?? ''} onChange={numField('width')} />
        </Field>
        <Field label="Depth (mm)">
          <input type="number" step="0.01" className={inputCls} value={diamond.depth ?? ''} onChange={numField('depth')} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Table %">
          <input type="number" step="0.1" className={inputCls} value={diamond.tablePercent ?? ''} onChange={numField('tablePercent')} />
        </Field>
        <Field label="Depth %">
          <input type="number" step="0.1" className={inputCls} value={diamond.depthPercent ?? ''} onChange={numField('depthPercent')} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Color">
          <select className={inputCls} value={diamond.color ?? ''} onChange={e => upd('color', e.target.value || undefined)}>
            <option value="">—</option>
            {COLORS.map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Clarity">
          <select className={inputCls} value={diamond.clarity ?? ''} onChange={e => upd('clarity', e.target.value || undefined)}>
            <option value="">—</option>
            {CLARITY.map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Polish">
          <select className={inputCls} value={diamond.polish ?? ''} onChange={e => upd('polish', e.target.value || undefined)}>
            <option value="">—</option>
            {GRADES.map(g => <option key={g}>{g}</option>)}
          </select>
        </Field>
        <Field label="Symmetry">
          <select className={inputCls} value={diamond.symmetry ?? ''} onChange={e => upd('symmetry', e.target.value || undefined)}>
            <option value="">—</option>
            {GRADES.map(g => <option key={g}>{g}</option>)}
          </select>
        </Field>
        <Field label="Fluorescence">
          <select className={inputCls} value={diamond.fluorescence ?? ''} onChange={e => upd('fluorescence', e.target.value || undefined)}>
            <option value="">—</option>
            {FLUOR.map(f => <option key={f}>{f}</option>)}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Girdle">
          <input className={inputCls} value={diamond.girdle ?? ''} onChange={e => upd('girdle', e.target.value)} placeholder="e.g. Medium" />
        </Field>
        <Field label="Culet">
          <input className={inputCls} value={diamond.culet ?? ''} onChange={e => upd('culet', e.target.value)} placeholder="e.g. None" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Serial / Inscription">
          <input className={inputCls} value={diamond.serialNumber ?? ''} onChange={e => upd('serialNumber', e.target.value)} />
        </Field>
        <Field label="Certificate Number">
          <input className={inputCls} value={diamond.certificateNumber ?? ''} onChange={e => upd('certificateNumber', e.target.value)} />
        </Field>
      </div>

      <Field label="Tags (comma-separated)">
        <input className={inputCls} value={tagsStr} onChange={e => setTagsStr(e.target.value)} placeholder="e.g. gia, round, client-a" />
      </Field>

      <Field label="Notes">
        <textarea className={`${inputCls} resize-none`} rows={3} value={diamond.notes ?? ''} onChange={e => upd('notes', e.target.value)} />
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" loading={saving}>Save Inspection</Button>
      </div>
    </form>
  )
}
