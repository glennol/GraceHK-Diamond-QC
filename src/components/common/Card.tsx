import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  header?: ReactNode
  className?: string
  padding?: boolean
}

export default function Card({ children, header, className = '', padding = true }: Props) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>
      {header && (
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-200">
          {header}
        </div>
      )}
      <div className={padding ? 'p-5' : ''}>{children}</div>
    </div>
  )
}
