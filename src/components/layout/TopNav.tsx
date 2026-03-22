import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '@/hooks/useTheme'

export default function TopNav() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const crumbs = location.pathname
    .split('/')
    .filter(Boolean)
    .map((seg, i, arr) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1),
      path: '/' + arr.slice(0, i + 1).join('/'),
    }))

  return (
    <header className="h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-4 shrink-0">
      <nav className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 flex-1">
        <Link to="/dashboard" className="hover:text-gem-500 transition-colors">Home</Link>
        {crumbs.map((c, i) => (
          <span key={c.path} className="flex items-center gap-1">
            <span>/</span>
            {i === crumbs.length - 1 ? (
              <span className="text-slate-700 dark:text-slate-200 font-medium">{c.label}</span>
            ) : (
              <Link to={c.path} className="hover:text-gem-500 transition-colors">{c.label}</Link>
            )}
          </span>
        ))}
      </nav>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
    </header>
  )
}
