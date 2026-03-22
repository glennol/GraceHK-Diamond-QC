import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Inspection } from '@/types/inspection'
import { saveInspection } from '@/lib/db/repositories'
import { generateId } from '@/lib/utils/ids'
import { now } from '@/lib/utils/dates'
import PageHeader from '@/components/layout/PageHeader'
import Card from '@/components/common/Card'
import InspectionForm from '@/components/inspection/InspectionForm'

export default function NewInspectionPage() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)

  const handleSave = async (data: Pick<Inspection, 'name' | 'diamond' | 'tags'>) => {
    setSaving(true)
    try {
      const inspection: Inspection = {
        id: generateId(),
        name: data.name,
        status: 'draft',
        diamond: data.diamond,
        tags: data.tags,
        createdAt: now(),
        updatedAt: now(),
      }
      await saveInspection(inspection)
      navigate(`/inspection/${inspection.id}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="New Inspection"
        subtitle="Enter diamond details to begin quality inspection"
      />
      <Card>
        <InspectionForm
          onSave={handleSave}
          onCancel={() => navigate('/dashboard')}
          saving={saving}
        />
      </Card>
    </div>
  )
}
