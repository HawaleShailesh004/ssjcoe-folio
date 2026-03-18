'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { uploadFile } from '@/lib/storage'
import { Plus, Pencil, Trash2, Send, AlertCircle, X, Eye } from 'lucide-react'
import FileUpload from './FileUpload'
import { usePagination } from '@/hooks/usePagination'
import { PaginationBar } from '@/components/shared/PaginationBar'
import { AdminDetailModal, DetailRow, MediaValue } from './AdminDetailModal'

interface Event {
  id: string
  title: string
  event_type?: string
  type?: string
  date: string
  end_date?: string
  description?: string
  venue?: string
  location?: string
  chief_guest?: string
  attendance_count?: number
  highlights?: string
  banner_url?: string | null
  report_url?: string | null
  dept_id: string
  status: string
  reject_reason?: string | null
}

interface Props { events: Event[]; profile: any }

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-stone-100 text-stone-500', pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-600',
}

const EVENT_TYPES = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Competition', 'Other']
const EMPTY = { title: '', event_type: 'Technical', date: '', end_date: '', description: '', venue: '', chief_guest: '', attendance_count: 0, highlights: '', banner_url: '', report_url: '' }

export default function EventsAdminClient({ events, profile }: Props) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Event | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  const [savedId, setSavedId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [viewing, setViewing] = useState<Event | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const PAGE_SIZE = 10
  const { page, setPage, totalPages, paginated } = usePagination(events, PAGE_SIZE)

  function set(key: string, value: unknown) { setForm(f => ({ ...f, [key]: value })) }

  function openAdd() { setForm(EMPTY); setEditing(null); setSavedId(null); setShowForm(true); setError(null) }
  function openEdit(ev: Event) {
    if (ev.status !== 'draft' && ev.status !== 'rejected') return
    setForm({ title: ev.title, event_type: ev.event_type ?? ev.type ?? 'Technical', date: ev.date, end_date: ev.end_date ?? '', description: ev.description ?? '', venue: ev.venue ?? ev.location ?? '', chief_guest: ev.chief_guest ?? '', attendance_count: ev.attendance_count ?? 0, highlights: ev.highlights ?? '', banner_url: ev.banner_url ?? '', report_url: ev.report_url ?? '' })
    setEditing(ev); setSavedId(ev.id); setShowForm(true); setError(null)
  }

  async function save() {
    setSaving(true); setError(null)
    if (!form.title || !form.date) { setError('Title and date are required.'); setSaving(false); return }
    const eventTypeRaw = form.event_type?.toLowerCase() ?? 'technical'
    const type = ['technical', 'cultural', 'sports', 'official', 'workshop'].includes(eventTypeRaw) ? eventTypeRaw : 'workshop'
    const year = form.date ? new Date(form.date).getFullYear() : new Date().getFullYear()
    const payload = { title: form.title, type, location: form.venue || null, date: form.date, end_date: form.end_date || null, description: form.description || null, chief_guest: form.chief_guest || null, attendance_count: form.attendance_count || null, highlights: form.highlights || null, banner_url: form.banner_url || null, report_url: form.report_url || null, year }
    if (editing) {
      const { error: e } = await supabase.from('events').update({ ...payload, status: 'draft', reject_reason: null }).eq('id', editing.id)
      if (e) { setError(e.message); setSaving(false); return }
      setSavedId(editing.id)
    } else {
      const { data, error: e } = await supabase.from('events').insert({ ...payload, dept_id: profile.dept_id, submitted_by: profile.id, status: 'draft' }).select('id').single()
      if (e) { setError(e.message); setSaving(false); return }
      if (data) setSavedId(data.id)
    }
    setSaving(false); router.refresh()
  }

  async function handleUpload(field: 'banner_url' | 'report_url', file: File) {
    if (!savedId) { setError('Save first before uploading.'); return }
    setUploading(u => ({ ...u, [field]: true }))
    const fileName = field === 'banner_url' ? 'banner' : 'report'
    const url = await uploadFile('events', savedId, file, fileName)
    if (url) { set(field, url); await supabase.from('events').update({ [field]: url }).eq('id', savedId); router.refresh() }
    setUploading(u => ({ ...u, [field]: false }))
  }

  async function submit(id: string) {
    await supabase.from('events').update({ status: 'pending' }).eq('id', id)
    await supabase.from('audit_log').insert({ actor_id: profile.id, record_type: 'events', action: 'submitted', record_id: id, actor_role: profile.role ?? 'hod' })
    router.refresh()
  }

  async function del(id: string) {
    setDeleting(id); await supabase.from('events').delete().eq('id', id); setDeleting(null); router.refresh()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Events</h1>
          <p className="text-stone-500 text-sm">{profile.departments?.name}</p>
        </div>
        <button type="button" onClick={openAdd} className="flex items-center gap-2 bg-[#E8820C] hover:bg-[#d4750b] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      <div ref={tableRef} className="space-y-4">
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-stone-400 text-xs uppercase tracking-wide border-b border-stone-100">
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Venue</th>
                <th className="text-left px-4 py-3 font-medium">Attendance</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {events.length === 0 && <tr><td colSpan={7} className="text-center py-12 text-stone-400">No events yet.</td></tr>}
              {paginated.map(ev => (
                <tr key={ev.id} className="hover:bg-stone-50 transition-colors cursor-pointer" onClick={() => setViewing(ev)}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {ev.banner_url && <img src={ev.banner_url} alt="" className="w-8 h-8 rounded object-cover shrink-0" />}
                      <span className="text-stone-700 font-medium truncate max-w-[180px]">{ev.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full capitalize">{ev.event_type ?? ev.type ?? '—'}</span></td>
                  <td className="px-4 py-3.5 text-stone-500 text-xs tabular-nums">{ev.date ? new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                  <td className="px-4 py-3.5 text-stone-500 text-xs max-w-[100px]"><div className="truncate">{ev.venue ?? ev.location ?? '—'}</div></td>
                  <td className="px-4 py-3.5 text-stone-500 text-xs tabular-nums">{ev.attendance_count ?? '—'}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[ev.status] ?? 'bg-stone-100 text-stone-500'}`}>{ev.status}</span>
                    {ev.status === 'rejected' && ev.reject_reason && <div className="flex items-start gap-1 mt-1 text-xs text-red-500"><AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />{ev.reject_reason}</div>}
                  </td>
                  <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1 justify-end">
                      <button type="button" onClick={() => setViewing(ev)} className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg" title="View"><Eye className="w-3.5 h-3.5" /></button>
                      {(ev.status === 'draft' || ev.status === 'rejected') && (
                        <>
                          <button type="button" onClick={() => openEdit(ev)} className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                          <button type="button" onClick={() => submit(ev.id)} className="flex items-center gap-1 text-xs text-[#E8820C] hover:bg-[#E8820C]/10 px-2 py-1.5 rounded-lg"><Send className="w-3.5 h-3.5" />Submit</button>
                        </>
                      )}
                      {ev.status === 'draft' && <button type="button" onClick={() => del(ev.id)} disabled={deleting === ev.id} className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationBar page={page} totalPages={totalPages} onPageChange={p => { setPage(p); tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} totalItems={events.length} pageSize={PAGE_SIZE} />
      </div>

      {viewing && (
        <AdminDetailModal title="Event details" onClose={() => setViewing(null)}>
          <DetailRow label="Title" value={viewing.title} />
          <DetailRow label="Banner" value={<MediaValue url={viewing.banner_url} />} />
          <DetailRow label="Report" value={<MediaValue url={viewing.report_url} />} />
          <DetailRow label="Type" value={viewing.event_type ?? viewing.type} />
          <DetailRow label="Date" value={viewing.date ? new Date(viewing.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null} />
          <DetailRow label="End date" value={viewing.end_date ? new Date(viewing.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null} />
          <DetailRow label="Venue / Location" value={viewing.venue ?? viewing.location} />
          <DetailRow label="Chief guest" value={viewing.chief_guest} />
          <DetailRow label="Attendance" value={viewing.attendance_count != null ? String(viewing.attendance_count) : null} />
          <DetailRow label="Description" value={viewing.description} />
          <DetailRow label="Highlights" value={viewing.highlights} />
          <DetailRow label="Status" value={viewing.status} />
          {viewing.reject_reason && <DetailRow label="Rejection reason" value={viewing.reject_reason} />}
        </AdminDetailModal>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center px-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-stone-800 font-semibold">{editing ? 'Edit Event' : 'Add Event'}</h2>
              <button type="button" onClick={() => { setShowForm(false); router.refresh() }}><X className="w-5 h-5 text-stone-400" /></button>
            </div>
            {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg"><AlertCircle className="w-4 h-4" />{error}</div>}
            {!savedId && <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-2 rounded-lg">Save first to enable file uploads.</div>}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Title</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Event Type</label>
                <select value={form.event_type} onChange={e => set('event_type', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]">
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Venue</label>
                <input value={form.venue} onChange={e => set('venue', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Start Date</label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">End Date (optional)</label>
                <input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Chief Guest</label>
                <input value={form.chief_guest} onChange={e => set('chief_guest', e.target.value)} placeholder="Optional" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Attendance Count</label>
                <input type="number" value={form.attendance_count} onChange={e => set('attendance_count', Number(e.target.value))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Description</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C] resize-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Highlights / Outcome</label>
                <textarea value={form.highlights} onChange={e => set('highlights', e.target.value)} rows={2} placeholder="Key takeaways, outcomes, notable moments" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C] resize-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-100">
              <FileUpload label="Event Banner / Poster" accept="image/*" currentUrl={form.banner_url} uploading={uploading.banner_url}
                hint="JPG or PNG" onUpload={f => handleUpload('banner_url', f)} onRemove={savedId ? () => set('banner_url', '') : undefined} />
              <FileUpload label="Event Report (PDF)" accept=".pdf" currentUrl={form.report_url} uploading={uploading.report_url}
                hint="PDF only" onUpload={f => handleUpload('report_url', f)} onRemove={savedId ? () => set('report_url', '') : undefined} />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => { setShowForm(false); router.refresh() }} className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg">Close</button>
              <button type="button" onClick={save} disabled={saving} className="px-4 py-2 text-sm bg-[#E8820C] hover:bg-[#d4750b] text-white rounded-lg disabled:opacity-50">{saving ? 'Saving…' : savedId ? 'Update Draft' : 'Save as Draft'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
