import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Inspection } from '@/types/inspection'
import { getAllInspections, deleteInspection, saveInspection } from '@/lib/db/repositories'
import { generateId } from '@/lib/utils/ids'
import { now } from '@/lib/utils/dates'
import { formatDateTime } from '@/lib/utils/dates'
import { demoInspections } from '@/data/demoInspections'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import EmptyState from '@/components/common/EmptyState'
import StatTile from '@/components/common/StatTile'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    const all = await getAllInspections()
    setInspections(all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const loadDemos = async () => {
    for (const d of demoInspections) {
      await saveInspection(d)
    }
    load()
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    if (!confirm('Delete this inspection?')) return
    await deleteInspection(id)
    setInspections(prev => prev.filter(i => i.id !== id))
  }

  const handleDuplicate = async (insp: Inspection, e: React.MouseEvent) => {
    e.preventDefault()
    const newId = generateId()
    const dup: Inspection = { ...insp, id: newId, name: `${insp.name} (copy)`, status: 'draft', createdAt: now(), updatedAt: now() }
    await saveInspection(dup)
    setInspections(prev => [dup, ...prev])
  }

  const filtered = inspections.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.diamond.shape ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const completed = inspections.filter(i => i.status === 'complete').length
  const inProgress = inspections.filter(i => i.status === 'in-progress').length

  const statusColor = (s: Inspection['status']) =>
    s === 'complete' ? 'green' as const : s === 'in-progress' ? 'yellow' as const : 'default' as const

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`${inspections.length} inspection${inspections.length !== 1 ? 's' : ''}`}
        actions={
          <div className="flex gap-2">
            {inspections.length === 0 && (
              <Button variant="ghost" size="sm" onClick={loadDemos}>Load Demos</Button>
            )}
            <Button onClick={() => navigate('/new')}>New Inspection</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatTile label="Total" value={inspections.length} />
        <StatTile label="Complete" value={completed} color="green" />
        <StatTile label="In Progress" value={inProgress} color="yellow" />
        <StatTile label="Draft" value={inspections.length - completed - inProgress} />
      </div>

      <div className="mb-4">
        <input
          type="search"
          placeholder="Search inspections…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gem-400"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-gem-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={search ? 'No results' : 'No inspections yet'}
          description={search ? 'Try a different search.' : 'Create your first inspection or load demo data.'}
          action={!search ? <Button onClick={() => navigate('/new')}>New Inspection</Button> : undefined}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map(insp => (
            <Link
              key={insp.id}
              to={`/inspection/${insp.id}`}
              className="flex items-center gap-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 hover:border-gem-300 dark:hover:border-gem-600 transition-colors group"
            >
              <div className="w-10 h-10 bg-gem-100 dark:bg-gem-900/30 rounded-lg flex items-center justify-center text-gem-600 dark:text-gem-400 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2L3 8v8l9 6 9-6V8L12 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 dark:text-slate-100 truncate">{insp.name}</p>
                <p className="text-xs text-slate-400">
                  {insp.diamond.shape} · {insp.diamond.caratWeight ? `${insp.diamond.caratWeight}ct` : '—'} · {formatDateTime(insp.updatedAt)}
                </p>
              </div>
              <Badge color={statusColor(insp.status)} size="sm">{insp.status}</Badge>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={e => handleDuplicate(insp, e)}
                  className="p-1.5 text-slate-400 hover:text-gem-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                  title="Duplicate"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={e => handleDelete(insp.id, e)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
