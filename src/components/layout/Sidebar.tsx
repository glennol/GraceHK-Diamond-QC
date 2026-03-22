import { NavLink, useParams, useLocation } from 'react-router-dom'

const mainNav = [
  { to: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
]

const inspectionNav = [
  { suffix: '', label: 'Overview' },
  { suffix: '/images', label: 'Images' },
  { suffix: '/symmetry', label: 'Symmetry' },
  { suffix: '/clarity', label: 'Clarity' },
  { suffix: '/certificate', label: 'Certificate' },
  { suffix: '/report', label: 'Report' },
]

export default function Sidebar() {
  const { id } = useParams()
  const location = useLocation()
  const onInspection = location.pathname.includes('/inspection/')

  return (
    <aside className="w-56 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0">
      <div className="h-14 flex items-center gap-2 px-4 border-b border-slate-200 dark:border-slate-700">
        <div className="w-7 h-7 bg-gem-500 rounded-md flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L3 8v8l9 6 9-6V8L12 2z" />
          </svg>
        </div>
        <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Diamond QC</span>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {mainNav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-gem-50 dark:bg-gem-900/30 text-gem-600 dark:text-gem-400 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`
            }
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
            </svg>
            {item.label}
          </NavLink>
        ))}

        {onInspection && id && (
          <>
            <div className="pt-3 pb-1">
              <p className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Inspection
              </p>
            </div>
            {inspectionNav.map(item => (
              <NavLink
                key={item.suffix}
                to={`/inspection/${id}${item.suffix}`}
                end={item.suffix === ''}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-gem-50 dark:bg-gem-900/30 text-gem-600 dark:text-gem-400 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`
                }
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>
    </aside>
  )
}
