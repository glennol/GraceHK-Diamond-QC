import { useRef, useState, useEffect } from 'react'
import { Stage, Layer, Line, Circle, Image as KonvaImage, Group, Text } from 'react-konva'
import type { SymmetryGuideState } from '@/types/symmetry'
import type { DiamondShape } from '@/types/inspection'

interface Props {
  imageUrl?: string
  shape: DiamondShape
  guide: SymmetryGuideState
  onGuideChange: (g: SymmetryGuideState) => void
  width?: number
  height?: number
}

const W = 600
const H = 600

export default function SymmetryCanvas({ imageUrl, shape, guide, onGuideChange, width = W, height = H }: Props) {
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    if (!imageUrl) return
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setBgImage(img)
    img.src = imageUrl
  }, [imageUrl])

  const cx = guide.center.x
  const cy = guide.center.y
  const len = 280 * guide.scale
  const rad = guide.rotation * (Math.PI / 180)

  const rotX = (dx: number, dy: number) => cx + dx * Math.cos(rad) - dy * Math.sin(rad)
  const rotY = (dx: number, dy: number) => cy + dx * Math.sin(rad) + dy * Math.cos(rad)

  const dragCenter = (e: any) => {
    onGuideChange({ ...guide, center: { x: e.target.x(), y: e.target.y() } })
  }

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-900">
      <Stage width={width} height={height}>
        <Layer>
          {bgImage && (
            <KonvaImage
              image={bgImage}
              x={0} y={0}
              width={width} height={height}
              opacity={0.85}
            />
          )}
          {!bgImage && (
            <Text
              x={width / 2 - 100} y={height / 2 - 10}
              text="Upload an image to overlay guides"
              fill="#64748b"
              fontSize={13}
            />
          )}

          {/* Vertical axis */}
          {guide.showVertical && (
            <Line
              points={[rotX(0, -len), rotY(0, -len), rotX(0, len), rotY(0, len)]}
              stroke="#38bdf8"
              strokeWidth={1.5}
              dash={[8, 4]}
              opacity={0.85}
            />
          )}

          {/* Horizontal axis */}
          {guide.showHorizontal && (
            <Line
              points={[rotX(-len, 0), rotY(-len, 0), rotX(len, 0), rotY(len, 0)]}
              stroke="#f472b6"
              strokeWidth={1.5}
              dash={[8, 4]}
              opacity={0.85}
            />
          )}

          {/* Diagonals */}
          {guide.showDiagonals && (
            <>
              <Line
                points={[rotX(-len * 0.707, -len * 0.707), rotY(-len * 0.707, -len * 0.707), rotX(len * 0.707, len * 0.707), rotY(len * 0.707, len * 0.707)]}
                stroke="#a78bfa"
                strokeWidth={1}
                dash={[4, 6]}
                opacity={0.7}
              />
              <Line
                points={[rotX(len * 0.707, -len * 0.707), rotY(len * 0.707, -len * 0.707), rotX(-len * 0.707, len * 0.707), rotY(-len * 0.707, len * 0.707)]}
                stroke="#a78bfa"
                strokeWidth={1}
                dash={[4, 6]}
                opacity={0.7}
              />
            </>
          )}

          {/* Center control */}
          <Group
            x={cx} y={cy}
            draggable
            onDragEnd={dragCenter}
          >
            <Circle radius={10} fill="#0ea5e9" opacity={0.7} />
            <Circle radius={3} fill="#fff" />
          </Group>
        </Layer>
      </Stage>
    </div>
  )
}
