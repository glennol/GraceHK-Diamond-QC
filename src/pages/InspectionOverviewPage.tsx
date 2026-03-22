import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useInspectionStore } from '@/store/useInspectionStore'
import { deleteInspection, saveInspection } from '@/lib/db/repositories'
import { generateId } from '@/lib/utils/ids'
import { now } from '@/lib/utils/dates'
import type { Inspection } from '@/types/inspection'
import PageHeader from '@/components/layout/PageHeader'
import Card from '@/components/common/Card'
import DiamondSummaryCard from '@/components/inspection/DiamondSummaryCard'
import InspectionForm from '@/components/inspection/InspectionForm'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'

const NAV_STEPS = [
  { suffix: '/images', label: '📷 Images', desc: 'Upload face-up, profile, and inscription images.' },
  { suffix: '/symmetry', label: '📐 Symmetry', desc: 'Overlay guides and score axis alignment.' },
  { suffix: '/clarity', label: '🔍 Clarity', desc: 'Annotate inclusions on microscope images.' },
  { suffix: '/certificate', label: '📄 Certificate', desc: 'OCR and verify the grading report.' },
  { suffix: '/report', label: '📊 Report', desc: 'Generate final QC recommendation.' },
]

export default function InspectionOverviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentInspection, isLoading, loadInspection, updateInspection } = useInspectionStore()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    if (id) loadInspection(id)
  }, [id, loadInspection])

  const handleSave = async (data: Pick<Inspection, 'name' | 'diamond' | 'tags'>) => {
    setSaving(true)
    try {
      await updateInspection({ ...data, status: 'in-progress' })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    setDeleting(true)
    try {
      await deleteInspection(id)
      navigate('/dashboard')
    } finally {
      setDeleting(false)
    }
  }

  const handleDuplicate = async () => {
    if (!currentInspection) return
    const newId = generateId()
    const dup: Inspection = { ...currentInspection, id: newId, name: `${currentInspection.name} (copy)`, status: 'draft', createdAt: now(), updatedAt: now() }
    await saveInspection(dup)
    navigate(`/inspection/${newId}`)
  }

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gem-500 border-t-transparent rounded-full animate-spin" /></div>
  }

  if (!currentInspection) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 mb-4">Inspection not found.</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={currentInspection.name}
        subtitle={`${currentInspection.diamond.shape} · ${currentInspection.diamond.caratWeight ?? '—'}ct`}
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleDuplicate}>Duplicate</Button>
            <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>Edit</Button>
            <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>Delete</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-1">
          <DiamondSummaryCard inspection={currentInspection} />
        </Card>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {NAV_STEPS.map(step => (
            <Link
              key={step.suffix}
              to={`/inspection/${id}${step.suffix}`}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-gem-300 dark:hover:border-gem-600 transition-colors"
            >
              <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{step.label}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{step.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Inspection" maxWidth="max-w-2xl">
        <InspectionForm
          initial={currentInspection}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
          saving={saving}
        />
      </Modal>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Inspection">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Are you sure you want to delete <strong>"{currentInspection.name}"</strong>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
