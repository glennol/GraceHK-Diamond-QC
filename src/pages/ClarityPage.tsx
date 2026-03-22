import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useInspectionStore } from '@/store/useInspectionStore'
import type { ClarityAnnotation, InclusionTag } from '@/types/clarity'
import type { ClaritySummary } from '@/types/clarity'
import { generateClaritySummary } from '@/lib/analysis/claritySummary'
import { generateId } from '@/lib/utils/ids'
import { now } from '@/lib/utils/dates'
import PageHeader from '@/components/layout/PageHeader'
import Card from '@/components/common/Card'
import ClarityCanvas from '@/components/clarity/ClarityCanvas'
import AnnotationToolbar from '@/components/clarity/AnnotationToolbar'
import AnnotationList from '@/components/clarity/AnnotationList'
import AnnotationEditor from '@/components/clarity/AnnotationEditor'
import Modal from '@/components/common/Modal'

export default function ClarityPage() {
  const { id } = useParams<{ id: string }>()
  const { currentInspection, assets, clarityAnnotations, loadInspection, addAnnotation, removeAnnotation } = useInspectionStore()
  const [activeTag, setActiveTag] = useState<InclusionTag>('feather')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [summary, setSummary] = useState<ClaritySummary | null>(null)

  useEffect(() => {
    if (id && !currentInspection) loadInspection(id)
  }, [id, currentInspection, loadInspection])

  useEffect(() => {
    setSummary(generateClaritySummary(clarityAnnotations))
  }, [clarityAnnotations])

  const microscopeAsset = assets.find(a => a.type === 'microscope') ?? assets.find(a => a.type === 'faceUp')

  const handleAnnotate = async (x: number, y: number) => {
    if (!id) return
    const ann: ClarityAnnotation = {
      id: generateId(),
      inspectionId: id,
      x, y,
      tag: activeTag,
      severity: 'minor',
      assetId: microscopeAsset?.id,
      createdAt: now(),
    }
    await addAnnotation(ann)
  }

  const selectedAnnotation = clarityAnnotations.find(a => a.id === selectedId)

  const handleSaveEdit = async (updated: ClarityAnnotation) => {
    await removeAnnotation(updated.id)
    await addAnnotation(updated)
    setSelectedId(null)
  }

  return (
    <div>
      <PageHeader title="Clarity Annotation" subtitle={currentInspection?.name} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Card header="Annotation Tools" padding={false}>
            <div className="p-4">
              <AnnotationToolbar activeTag={activeTag} onTagChange={setActiveTag} />
            </div>
            <ClarityCanvas
              imageUrl={microscopeAsset?.dataUrl}
              annotations={clarityAnnotations}
              activeTag={activeTag}
              onAnnotate={handleAnnotate}
              onSelect={id => setSelectedId(id)}
              width={600}
              height={500}
            />
          </Card>
        </div>

        <div className="space-y-4">
          <Card header="Inclusions">
            <AnnotationList
              annotations={clarityAnnotations}
              onDelete={removeAnnotation}
              onSelect={setSelectedId}
              selectedId={selectedId ?? undefined}
            />
          </Card>

          {summary && (
            <Card header="Grade Estimate">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Total Inclusions</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{summary.totalCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Estimated Grade</span>
                  <span className="font-semibold text-gem-600 dark:text-gem-400">{summary.estimatedGrade}</span>
                </div>
                <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-700">
                  {Object.entries(summary.byTag).map(([tag, count]) => (
                    <div key={tag} className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="capitalize">{tag}</span>
                      <span>{count}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 italic pt-2">{summary.disclaimer}</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Modal
        open={!!selectedAnnotation}
        onClose={() => setSelectedId(null)}
        title="Edit Annotation"
      >
        {selectedAnnotation && (
          <AnnotationEditor
            annotation={selectedAnnotation}
            onSave={handleSaveEdit}
            onClose={() => setSelectedId(null)}
          />
        )}
      </Modal>
    </div>
  )
}
