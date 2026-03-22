import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useInspectionStore } from '@/store/useInspectionStore'
import type { SymmetryGuideState } from '@/types/symmetry'
import { computeSymmetryScore } from '@/lib/analysis/symmetryEngine'
import PageHeader from '@/components/layout/PageHeader'
import Card from '@/components/common/Card'
import SymmetryCanvas from '@/components/symmetry/SymmetryCanvas'
import SymmetryToolbar from '@/components/symmetry/SymmetryToolbar'
import GuideControls from '@/components/symmetry/GuideControls'
import ScorePanel from '@/components/symmetry/ScorePanel'
import OverlayShapeSelector from '@/components/symmetry/OverlayShapeSelector'
import Button from '@/components/common/Button'
import type { DiamondShape } from '@/types/inspection'

const DEFAULT_GUIDE: SymmetryGuideState = {
  center: { x: 300, y: 300 },
  rotation: 0,
  scale: 1,
  showVertical: true,
  showHorizontal: true,
  showDiagonals: false,
  showOutline: true,
  mode: 'normal',
}

export default function SymmetryPage() {
  const { id } = useParams<{ id: string }>()
  const { currentInspection, assets, symmetryAnalysis, loadInspection, setSymmetryAnalysis } = useInspectionStore()
  const [guide, setGuide] = useState<SymmetryGuideState>(
    symmetryAnalysis?.guideState ?? DEFAULT_GUIDE
  )
  const [notes, setNotes] = useState(symmetryAnalysis?.manualNotes ?? '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id && !currentInspection) loadInspection(id)
  }, [id, currentInspection, loadInspection])

  useEffect(() => {
    if (symmetryAnalysis) {
      setGuide(symmetryAnalysis.guideState)
      setNotes(symmetryAnalysis.manualNotes ?? '')
    }
  }, [symmetryAnalysis])

  const faceUpAsset = assets.find(a => a.type === 'faceUp')
  const shape: DiamondShape = currentInspection?.diamond.shape ?? 'Round'

  const handleScore = async () => {
    if (!id) return
    setSaving(true)
    try {
      const analysis = computeSymmetryScore({
        shape,
        guideState: guide,
        manualNotes: notes,
        inspectionId: id,
        assetId: faceUpAsset?.id,
      })
      await setSymmetryAnalysis(analysis)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title="Symmetry Analysis" subtitle={currentInspection?.name} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Card header="Canvas" padding={false}>
            <div className="p-4">
              <OverlayShapeSelector selected={shape} onChange={() => {}} />
            </div>
            <SymmetryCanvas
              imageUrl={faceUpAsset?.dataUrl}
              shape={shape}
              guide={guide}
              onGuideChange={setGuide}
              width={600}
              height={500}
            />
            <div className="p-4 space-y-3 border-t border-slate-200 dark:border-slate-700">
              <SymmetryToolbar guide={guide} onChange={setGuide} />
              <GuideControls guide={guide} onChange={setGuide} />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card header="Score">
            {symmetryAnalysis ? (
              <ScorePanel analysis={symmetryAnalysis} />
            ) : (
              <p className="text-sm text-slate-400 text-center py-6">Position the guides and click Score to evaluate symmetry.</p>
            )}
          </Card>

          <Card header="Notes">
            <textarea
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gem-400 resize-none"
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Observations about symmetry…"
            />
          </Card>

          <Button className="w-full" onClick={handleScore} loading={saving}>
            Calculate Score
          </Button>
        </div>
      </div>
    </div>
  )
}
