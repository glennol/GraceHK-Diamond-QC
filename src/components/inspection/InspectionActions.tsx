import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Inspection } from '@/types/inspection'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'

interface Props {
  inspection: Inspection
  onDuplicate?: () => Promise<void>
  onDelete?: () => Promise<void>
}

export default function InspectionActions({ inspection, onDuplicate, onDelete }: Props) {
  const navigate = useNavigate()
  const [showDelete, setShowDelete] = useState(false)
  const [working, setWorking] = useState(false)

  const handleDuplicate = async () => {
    if (!onDuplicate) return
    setWorking(true)
    try { await onDuplicate() } finally { setWorking(false) }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    setWorking(true)
    try {
      await onDelete()
      navigate('/dashboard')
    } finally {
      setWorking(false)
      setShowDelete(false)
    }
  }

  return (
    <>
      <div className="flex gap-2">
        {onDuplicate && (
          <Button variant="secondary" size="sm" onClick={handleDuplicate} loading={working}>
            Duplicate
          </Button>
        )}
        {onDelete && (
          <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>
            Delete
          </Button>
        )}
      </div>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Inspection">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Are you sure you want to delete <strong>"{inspection.name}"</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} loading={working}>Delete</Button>
        </div>
      </Modal>
    </>
  )
}
