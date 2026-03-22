interface Props {
  scale: number
  rotation: number
  onZoomIn: () => void
  onZoomOut: () => void
  onRotateLeft: () => void
  onRotateRight: () => void
  onReset: () => void
}

export default function ViewerToolbar({ scale, rotation, onZoomIn, onZoomOut, onRotateLeft, onRotateRight, onReset }: Props) {
  const btn = 'px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors'
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button onClick={onZoomIn} className={btn}>Zoom +</button>
      <button onClick={onZoomOut} className={btn}>Zoom −</button>
      <button onClick={onRotateLeft} className={btn}>↺ 90°</button>
      <button onClick={onRotateRight} className={btn}>↻ 90°</button>
      <button onClick={onReset} className={btn}>Reset</button>
      <span className="ml-auto text-xs text-slate-400">{Math.round(scale * 100)}% · {rotation}°</span>
    </div>
  )
}
