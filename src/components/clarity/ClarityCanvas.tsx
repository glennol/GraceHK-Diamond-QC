import { useEffect, useState } from 'react'
import { Stage, Layer, Circle, Image as KonvaImage, Text } from 'react-konva'
import type { ClarityAnnotation, InclusionTag } from '@/types/clarity'

const TAG_COLORS: Record<InclusionTag, string> = {
  feather: '#ef4444',
  crystal: '#8b5cf6',
  cloud: '#94a3b8',
  needle: '#f59e0b',
  pinpoints: '#6366f1',
  cavity: '#dc2626',
  chip: '#b45309',
  abrasion: '#d97706',
  'indented natural': '#059669',
  'surface graining': '#0891b2',
}

interface Props {
  imageUrl?: string
  annotations: ClarityAnnotation[]
  activeTag: InclusionTag
  onAnnotate: (x: number, y: number) => void
  onSelect?: (id: string) => void
  width?: number
  height?: number
}

export default function ClarityCanvas({ imageUrl, annotations, activeTag, onAnnotate, onSelect, width = 600, height = 600 }: Props) {
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    if (!imageUrl) return
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setBgImage(img)
    img.src = imageUrl
  }, [imageUrl])

  const handleClick = (e: any) => {
    const stage = e.target.getStage()
    const pos = stage.getPointerPosition()
    if (!pos) return
    onAnnotate(pos.x, pos.y)
  }

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-900">
      <Stage width={width} height={height} onClick={handleClick} style={{ cursor: 'crosshair' }}>
        <Layer>
          {bgImage ? (
            <KonvaImage image={bgImage} x={0} y={0} width={width} height={height} />
          ) : (
            <Text
              x={width / 2 - 110} y={height / 2 - 10}
              text="Upload a microscope image to annotate inclusions"
              fill="#64748b"
              fontSize={12}
            />
          )}
          {annotations.map(ann => (
            <Circle
              key={ann.id}
              x={ann.x}
              y={ann.y}
              radius={ann.severity === 'significant' ? 14 : ann.severity === 'moderate' ? 10 : 7}
              fill={TAG_COLORS[ann.tag] + '99'}
              stroke={TAG_COLORS[ann.tag]}
              strokeWidth={2}
              onClick={() => onSelect?.(ann.id)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}
