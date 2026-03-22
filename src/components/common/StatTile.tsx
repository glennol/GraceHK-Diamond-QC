interface Props {
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  trendLabel?: string
  color?: 'default' | 'gem' | 'green' | 'yellow' | 'red'
}

const colorMap = {
  default: 'text-slate-900 dark:text-slate-100',
  gem: 'text-gem-600 dark:text-gem-400',
  green: 'text-green-600 dark:text-green-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  red: 'text-red-600 dark:text-red-400',
}

export default function StatTile({ label, value, trend, trendLabel, color = 'default' }: Props) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${colorMap[color]}`}>{value}</p>
      {trend && trendLabel && (
        <p className={`mt-1 text-xs ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-slate-400'}`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendLabel}
        </p>
      )}
    </div>
  )
}
