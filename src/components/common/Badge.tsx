type Color = 'default' | 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gem'

interface Props {
  children: React.ReactNode
  color?: Color
  size?: 'sm' | 'md'
}

const colorClasses: Record<Color, string> = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  green: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  gem: 'bg-gem-100 text-gem-700 dark:bg-gem-900/40 dark:text-gem-300',
}

export default function Badge({ children, color = 'default', size = 'sm' }: Props) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      } ${colorClasses[color]}`}
    >
      {children}
    </span>
  )
}
