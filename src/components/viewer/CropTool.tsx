import { useState, useRef } from 'react'

interface CropArea { x: number; y: number; w: number; h: number }

interface Props {
  width: number
  height: number
  onCrop?: (area: CropArea) => void
}

export default function CropTool({ width, height, onCrop }: Props) {
  const [start, setStart] = useState<{ x: number; y: number } | null>(null)
  const [crop, setCrop] = useState<CropArea | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const getPos = (e: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onMouseDown = (e: React.MouseEvent) => {
    const pos = getPos(e)
    setStart(pos)
    setCrop(null)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!start) return
    const pos = getPos(e)
    setCrop({
      x: Math.min(start.x, pos.x),
      y: Math.min(start.y, pos.y),
      w: Math.abs(pos.x - start.x),
      h: Math.abs(pos.y - start.y),
    })
  }

  const onMouseUp = () => {
    if (crop && onCrop) onCrop(crop)
    setStart(null)
  }

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="cursor-crosshair"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        {crop && (
          <>
            <rect
              x={crop.x} y={crop.y} width={crop.w} height={crop.h}
              fill="rgba(14,165,233,0.15)"
              stroke="#0ea5e9"
              strokeWidth={2}
              strokeDasharray="6 3"
            />
          </>
        )}
      </svg>
      {crop && (
        <div className="mt-1 text-xs text-slate-400">
          Selection: {Math.round(crop.w)} × {Math.round(crop.h)} px
        </div>
      )}
    </div>
  )
}
