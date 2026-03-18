'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { uploadFile } from '@/lib/storage'
import { Plus, Pencil, Trash2, Send, AlertCircle, X, Eye } from 'lucide-react'
import FileUpload from './FileUpload'
import { usePagination } from '@/hooks/usePagination'
import { PaginationBar } from '@/components/shared/PaginationBar'
import { AdminDetailModal, DetailRow } from './AdminDetailModal'

interface Patent {
  id: string
  title: string
  inventors: string[]
  patent_number?: string
  application_number?: string
  date?: string
  patent_status: string
  country: string
  patent_office: string
  co_applicant?: string
  certificate_url?: string | null
  dept_id: string
  status: string
  reject_reason?: string | null
}

interface Faculty { id: string; name: string }
interface Props { patents: Patent[]; profile: any }

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-stone-100 text-stone-500', pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-600',
}

const PATENT_STATUSES = ['filed', 'published', 'granted']
const PATENT_OFFICES = ['Indian Patent Office', 'USPTO', 'EPO', 'WIPO', 'Other']
const EMPTY = { title: '', inventors: [] as string[], patent_number: '', application_number: '', date: '', patent_status: 'filed', country: 'India', patent_office: 'Indian Patent Office', co_applicant: '', certificate_url: '' }

export default function PatentsAdminClient({ patents, profile }: Props) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Patent | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [viewing, setViewing] = useState<Patent | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const PAGE_SIZE = 10
  const { page, setPage, totalPages, paginated } = usePagination(patents, PAGE_SIZE)

  useEffect(() => {
    supabase.from('faculty').select('id, name').eq('dept_id', profile.dept_id).eq('status', 'approved')
      .then(({ data }) => setFaculty(data ?? []))
  }, [profile.dept_id])

  function set(key: string, value: unknown) { setForm(f => ({ ...f, [key]: value })) }
  function toggleInventor(name: string) { setForm(f => ({ ...f, inventors: f.inventors.includes(name) ? f.inventors.filter(i => i !== name) : [...f.inventors, name] })) }

  function openAdd() { setForm(EMPTY); setEditing(null); setSavedId(null); setShowForm(true); setError(null) }
  function openEdit(p: Patent) {
    if (p.status !== 'draft' && p.status !== 'rejected') return
    const row = p as Patent & { filing_date?: string; status_type?: string }
    setForm({ title: p.title, inventors: p.inventors ?? [], patent_number: p.patent_number ?? '', application_number: p.application_number ?? '', date: p.date ?? row.filing_date ?? '', patent_status: p.patent_status ?? row.status_type ?? 'filed', country: p.country ?? 'India', patent_office: p.patent_office ?? 'Indian Patent Office', co_applicant: p.co_applicant ?? '', certificate_url: p.certificate_url ?? '' })
    setEditing(p); setSavedId(p.id); setShowForm(true); setError(null)
  }

  async function save() {
    setSaving(true); setError(null)
    if (!form.title || form.inventors.length === 0) { setError('Title and at least one inventor required.'); setSaving(false); return }
    const payload = { title: form.title, inventors: form.inventors, patent_number: form.patent_number || null, application_number: form.application_number || null, date: form.date || null, patent_status: form.patent_status, country: form.country, patent_office: form.patent_office, co_applicant: form.co_applicant || null, certificate_url: form.certificate_url || null }
    if (editing) {
      const { error: e } = await supabase.from('patents').update({ ...payload, status: 'draft', reject_reason: null }).eq('id', editing.id)
      if (e) { setError(e.message); setSaving(false); return }
      setSavedId(editing.id)
    } else {
      const { data, error: e } = await supabase.from('patents').insert({ ...payload, dept_id: profile.dept_id, submitted_by: profile.id, status: 'draft' }).select('id').single()
      if (e) { setError(e.message); setSaving(false); return }
      if (data) setSavedId(data.id)
    }
    setSaving(false); router.refresh()
  }

  async function handleCertUpload(file: File) {
    if (!savedId) { setError('Save first before uploading.'); return }
    setUploading(true)
    const url = await uploadFile('patents', savedId, file, 'certificate')
    if (url) { set('certificate_url', url); await supabase.from('patents').update({ certificate_url: url }).eq('id', savedId); router.refresh() }
    setUploading(false)
  }

  async function submit(id: string) {
    await supabase.from('patents').update({ status: 'pending' }).eq('id', id)
    await supabase.from('audit_log').insert({ actor_id: profile.id, record_type: 'patents', action: 'submitted', record_id: id, actor_role: profile.role ?? 'hod' })
    router.refresh()
  }

  async function del(id: string) {
    setDeleting(id); await supabase.from('patents').delete().eq('id', id); setDeleting(null); router.refresh()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-stone-800">Patents</h1>
          <p className="text-stone-500 text-sm">{profile.departments?.name}</p>
        </div>
        <button type="button" onClick={openAdd} className="flex items-center gap-2 bg-[#E8820C] hover:bg-[#d4750b] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Patent
        </button>
      </div>

      <div ref={tableRef} className="space-y-4">
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-stone-400 text-xs uppercase tracking-wide border-b border-stone-100">
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Inventors</th>
                <th className="text-left px-4 py-3 font-medium">App. No.</th>
                <th className="text-left px-4 py-3 font-medium">Office</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {patents.length === 0 && <tr><td colSpan={7} className="text-center py-12 text-stone-400">No patents yet.</td></tr>}
              {paginated.map(p => (
                <tr key={p.id} className="hover:bg-stone-50 transition-colors cursor-pointer" onClick={() => setViewing(p)}>
                  <td className="px-5 py-3.5 text-stone-700 font-medium max-w-xs"><div className="truncate">{p.title}</div></td>
                  <td className="px-4 py-3.5 text-stone-500 text-xs max-w-[140px]"><div className="truncate">{(Array.isArray(p.inventors) ? p.inventors : []).join(', ')}</div></td>
                  <td className="px-4 py-3.5 text-stone-500 font-mono text-xs">{p.application_number || p.patent_number || '—'}</td>
                  <td className="px-4 py-3.5 text-stone-500 text-xs">{p.patent_office ?? '—'}</td>
                  <td className="px-4 py-3.5"><span className="text-xs capitalize bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">{p.patent_status ?? '—'}</span></td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[p.status] ?? 'bg-stone-100 text-stone-500'}`}>{p.status}</span>
                    {p.status === 'rejected' && p.reject_reason && <div className="flex items-start gap-1 mt-1 text-xs text-red-500"><AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />{p.reject_reason}</div>}
                  </td>
                  <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1 justify-end">
                      <button type="button" onClick={() => setViewing(p)} className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg" title="View"><Eye className="w-3.5 h-3.5" /></button>
                      {(p.status === 'draft' || p.status === 'rejected') && (
                        <>
                          <button type="button" onClick={() => openEdit(p)} className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                          <button type="button" onClick={() => submit(p.id)} className="flex items-center gap-1 text-xs text-[#E8820C] hover:bg-[#E8820C]/10 px-2 py-1.5 rounded-lg"><Send className="w-3.5 h-3.5" />Submit</button>
                        </>
                      )}
                      {p.status === 'draft' && <button type="button" onClick={() => del(p.id)} disabled={deleting === p.id} className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationBar page={page} totalPages={totalPages} onPageChange={p => { setPage(p); tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} totalItems={patents.length} pageSize={PAGE_SIZE} />
      </div>

      {viewing && (
        <AdminDetailModal title="Patent details" onClose={() => setViewing(null)}>
          <DetailRow label="Title" value={viewing.title} />
          <DetailRow label="Inventors" value={(Array.isArray(viewing.inventors) ? viewing.inventors : []).join(', ')} />
          <DetailRow label="Patent number" value={viewing.patent_number} />
          <DetailRow label="Application number" value={viewing.application_number} />
          <DetailRow label="Status" value={viewing.patent_status} />
          <DetailRow label="Date" value={viewing.date} />
          <DetailRow label="Country" value={viewing.country} />
          <DetailRow label="Patent office" value={viewing.patent_office} />
          <DetailRow label="Co-applicant" value={viewing.co_applicant} />
          <DetailRow label="Workflow status" value={viewing.status} />
          {viewing.reject_reason && <DetailRow label="Rejection reason" value={viewing.reject_reason} />}
        </AdminDetailModal>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center px-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-stone-800 font-semibold">{editing ? 'Edit Patent' : 'Add Patent'}</h2>
              <button type="button" onClick={() => { setShowForm(false); router.refresh() }}><X className="w-5 h-5 text-stone-400" /></button>
            </div>
            {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg"><AlertCircle className="w-4 h-4" />{error}</div>}
            {!savedId && <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-2 rounded-lg">Save first to enable certificate upload.</div>}

            <div>
              <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Title</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
            </div>

            <div>
              <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Inventors</label>
              <div className="border border-stone-300 rounded-lg p-2 flex flex-wrap gap-1.5 min-h-[42px]">
                {form.inventors.map(i => <span key={i} className="flex items-center gap-1 bg-[#E8820C]/10 text-[#E8820C] text-xs px-2 py-1 rounded-md">{i}<button type="button" onClick={() => toggleInventor(i)}><X className="w-3 h-3" /></button></span>)}
                {form.inventors.length === 0 && <span className="text-stone-400 text-xs px-1 py-1">Select faculty below</span>}
              </div>
              <div className="mt-1.5 border border-stone-200 rounded-lg divide-y divide-stone-100 max-h-32 overflow-y-auto">
                {faculty.map(f => (
                  <button key={f.id} type="button" onClick={() => toggleInventor(f.name)} className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors ${form.inventors.includes(f.name) ? 'bg-[#E8820C]/5 text-[#E8820C]' : 'text-stone-600 hover:bg-stone-50'}`}>
                    {f.name}{form.inventors.includes(f.name) && <span className="text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Patent Status</label>
                <select value={form.patent_status} onChange={e => set('patent_status', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]">
                  {PATENT_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Patent Office</label>
                <select value={form.patent_office} onChange={e => set('patent_office', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]">
                  {PATENT_OFFICES.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Application Number</label>
                <input value={form.application_number} onChange={e => set('application_number', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Patent Number</label>
                <input value={form.patent_number} onChange={e => set('patent_number', e.target.value)} placeholder="If granted" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Country</label>
                <input value={form.country} onChange={e => set('country', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Co-applicant Institution</label>
                <input value={form.co_applicant} onChange={e => set('co_applicant', e.target.value)} placeholder="Optional" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Date</label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100">
              <FileUpload label="Patent Certificate (PDF or Image)" accept=".pdf,image/*" currentUrl={form.certificate_url} uploading={uploading}
                hint="Upload grant certificate or filing acknowledgement"
                onUpload={handleCertUpload}
                onRemove={savedId ? () => set('certificate_url', '') : undefined} />
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
