'use client'

import { useState, useMemo, useRef } from 'react'
import { Search } from 'lucide-react'
import { usePagination } from '@/hooks/usePagination'
import { PaginationBar } from '@/components/shared/PaginationBar'

interface Log {
  id: string
  actor_id?: string
  action: string
  record_type: string
  record_id?: string
  actor_role?: string
  timestamp: string
  notes?: string
  profiles?: { full_name: string | null; email: string } | null
}

interface Props { logs: Log[] }

const ACTION_STYLES: Record<string, string> = {
  created:     'bg-blue-50 text-blue-600',
  updated:     'bg-stone-100 text-stone-600',
  submitted:   'bg-amber-100 text-amber-700',
  approved:    'bg-green-100 text-green-700',
  rejected:    'bg-red-100 text-red-600',
  deleted:     'bg-red-50 text-red-500',
  deactivated: 'bg-stone-200 text-stone-600',
  reactivated: 'bg-green-50 text-green-600',
}

const TABLE_LABELS: Record<string, string> = {
  placements: 'Placements', research_papers: 'Research', patents: 'Patents',
  events: 'Events', achievements: 'Achievements', faculty: 'Faculty', profiles: 'Users',
}
// Support both schema column names for display
function recordType(log: Log) { return log.record_type ?? (log as any).table_name ?? '' }

const ALL_ACTIONS = ['created', 'updated', 'submitted', 'approved', 'rejected', 'deleted', 'deactivated', 'reactivated']
const ALL_TABLES = ['placements', 'research_papers', 'patents', 'events', 'achievements', 'faculty', 'profiles']

export default function AuditClient({ logs }: Props) {
  const [search, setSearch] = useState('')
  const [filterAction, setFilterAction] = useState('')
  const [filterTable, setFilterTable] = useState('')

  const filtered = useMemo(() => {
    return logs.filter(l => {
      const actor = l.profiles?.full_name ?? l.profiles?.email ?? ''
      const matchSearch = !search || actor.toLowerCase().includes(search.toLowerCase()) || l.action.includes(search.toLowerCase()) || l.record_type.includes(search.toLowerCase())
      const matchAction = !filterAction || l.action === filterAction
      const matchTable = !filterTable || l.record_type === filterTable
      return matchSearch && matchAction && matchTable
    })
  }, [logs, search, filterAction, filterTable])

  const PAGE_SIZE = 15
  const { page, setPage, totalPages, paginated } = usePagination(filtered, PAGE_SIZE)
  const tableRef = useRef<HTMLDivElement>(null)

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Audit Log</h1>
        <p className="text-stone-500 text-sm">Last 200 actions across all departments</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by actor or action…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-[#E8820C] bg-white" />
        </div>
        <select value={filterAction} onChange={e => setFilterAction(e.target.value)}
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 focus:outline-none focus:border-[#E8820C] bg-white">
          <option value="">All actions</option>
          {ALL_ACTIONS.map(a => <option key={a} value={a} className="capitalize">{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
        </select>
        <select value={filterTable} onChange={e => setFilterTable(e.target.value)}
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 focus:outline-none focus:border-[#E8820C] bg-white">
          <option value="">All sections</option>
          {ALL_TABLES.map(t => <option key={t} value={t}>{TABLE_LABELS[t]}</option>)}
        </select>
      </div>

      <div className="text-xs text-stone-400">{filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}</div>

      <div ref={tableRef} className="space-y-4">
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-stone-400 text-xs uppercase tracking-wide border-b border-stone-100">
                <th className="text-left px-5 py-3 font-medium">Actor</th>
                <th className="text-left px-4 py-3 font-medium">Action</th>
                <th className="text-left px-4 py-3 font-medium">Section</th>
                <th className="text-left px-4 py-3 font-medium">Detail</th>
                <th className="text-right px-5 py-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-stone-400">No entries match your filters.</td></tr>
              )}
              {paginated.map(log => (
              <tr key={log.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="text-stone-700 font-medium text-xs">{log.profiles?.full_name ?? '—'}</div>
                  <div className="text-stone-400 text-xs">{log.profiles?.email ?? 'unknown'}</div>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${ACTION_STYLES[log.action] ?? 'bg-stone-100 text-stone-500'}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-stone-500 text-xs">{TABLE_LABELS[recordType(log)] ?? recordType(log)}</td>
                <td className="px-4 py-3.5 text-stone-400 text-xs font-mono">
                  {log.notes
                    ? <span className="text-red-400 not-italic font-sans">&quot;{log.notes}&quot;</span>
                    : log.record_id ? log.record_id.slice(0, 8) + '…' : '—'}
                </td>
                <td className="px-5 py-3.5 text-right text-stone-400 text-xs tabular-nums whitespace-nowrap">
                  {new Date(log.timestamp ?? (log as any).created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationBar page={page} totalPages={totalPages} onPageChange={p => { setPage(p); tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} totalItems={filtered.length} pageSize={PAGE_SIZE} />
      </div>
    </div>
  )
}
