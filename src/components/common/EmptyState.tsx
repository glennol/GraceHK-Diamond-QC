import type { ReactNode } from 'react'

interface Props {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="w-16 h-16 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full mb-4 text-slate-400 dark:text-slate-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
