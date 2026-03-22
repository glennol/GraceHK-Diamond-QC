import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useInspectionStore } from '@/store/useInspectionStore'
import type { UploadedAsset, AssetType } from '@/types/assets'
import { generateId } from '@/lib/utils/ids'
import { now } from '@/lib/utils/dates'
import { fileToDataUrl } from '@/lib/images/imageUtils'
import PageHeader from '@/components/layout/PageHeader'
import Card from '@/components/common/Card'
import AssetUploader from '@/components/inspection/AssetUploader'
import AssetGallery from '@/components/inspection/AssetGallery'
import Modal from '@/components/common/Modal'
import ImageViewer from '@/components/viewer/ImageViewer'

export default function ImagesPage() {
  const { id } = useParams<{ id: string }>()
  const { currentInspection, assets, loadInspection, addAsset, removeAsset } = useInspectionStore()
  const [uploading, setUploading] = useState(false)
  const [selected, setSelected] = useState<UploadedAsset | null>(null)

  useEffect(() => {
    if (id && !currentInspection) loadInspection(id)
  }, [id, currentInspection, loadInspection])

  const handleUpload = async (file: File, type: AssetType) => {
    if (!id) return
    setUploading(true)
    try {
      const dataUrl = await fileToDataUrl(file)
      const asset: UploadedAsset = {
        id: generateId(),
        inspectionId: id,
        type,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        dataUrl,
        createdAt: now(),
      }
      await addAsset(asset)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Images"
        subtitle={currentInspection?.name ?? '…'}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card header="Upload Images" className="lg:col-span-1">
          <AssetUploader onUpload={handleUpload} uploading={uploading} />
        </Card>
        <Card header={`Gallery (${assets.length})`} className="lg:col-span-2">
          <AssetGallery
            assets={assets}
            onDelete={removeAsset}
            onSelect={setSelected}
          />
        </Card>
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.filename ?? 'Image'}
        maxWidth="max-w-3xl"
      >
        {selected?.dataUrl && <ImageViewer src={selected.dataUrl} alt={selected.filename} />}
      </Modal>
    </div>
  )
}
