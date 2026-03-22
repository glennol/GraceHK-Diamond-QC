import { useState, useRef, useCallback } from 'react'

interface Props {
  src: string
  alt?: string
}

export default function ImageViewer({ src, alt = 'Diamond image' }: Props) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y }
  }, [offset])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !dragStart.current) return
    setOffset({
      x: dragStart.current.ox + e.clientX - dragStart.current.x,
      y: dragStart.current.oy + e.clientY - dragStart.current.y,
    })
  }, [dragging])

  const onMouseUp = useCallback(() => { setDragging(false); dragStart.current = null }, [])

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setScale(s => Math.min(8, Math.max(0.25, s - e.deltaY * 0.001)))
  }, [])

  const reset = () => { setScale(1); setRotation(0); setOffset({ x: 0, y: 0 }) }

  return (
    <div className="flex flex-col gap-2">
      <div
        className="relative overflow-hidden bg-slate-900 rounded-xl"
        style={{ height: 400, cursor: dragging ? 'grabbing' : 'grab' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="absolute select-none"
          style={{
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'center',
            maxWidth: 'none',
          }}
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => setScale(s => Math.min(8, s + 0.2))} className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">Zoom +</button>
        <button onClick={() => setScale(s => Math.max(0.25, s - 0.2))} className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">Zoom −</button>
        <button onClick={() => setRotation(r => r - 90)} className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">↺ 90°</button>
        <button onClick={() => setRotation(r => r + 90)} className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">↻ 90°</button>
        <button onClick={reset} className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">Reset</button>
        <span className="ml-auto text-xs text-slate-400">{Math.round(scale * 100)}% | {rotation}°</span>
      </div>
    </div>
  )
}
