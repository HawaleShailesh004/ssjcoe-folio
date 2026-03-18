'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { uploadFile } from '@/lib/storage'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Send, AlertCircle, X, Upload, Eye } from 'lucide-react'
import FileUpload from './FileUpload'
import { usePagination } from '@/hooks/usePagination'
import { PaginationBar } from '@/components/shared/PaginationBar'
import { AdminDetailModal, DetailRow } from './AdminDetailModal'

interface Placement {
  id: string
  student_name: string
  company: string
  role: string
  package_lpa: number
  year: number
  batch_year?: number
  is_internship: boolean
  ctc_fixed?: number
  ctc_variable?: number
  location?: string
  linkedin_url?: string
  headshot_url?: string | null
  offer_letter_url?: string | null
  dept_id: string
  status: string
  reject_reason?: string | null
}

interface Props { placements: Placement[]; profile: any }

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-stone-100 text-stone-500', pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-600',
}

const EMPTY = {
  student_name: '', company: '', role: '', package_lpa: 0, year: new Date().getFullYear(),
  batch_year: new Date().getFullYear(), is_internship: false, ctc_fixed: 0, ctc_variable: 0,
  location: '', linkedin_url: '', headshot_url: '', offer_letter_url: '',
}

export default function PlacementsAdminClient({ placements, profile }: Props) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Placement | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [viewing, setViewing] = useState<Placement | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const PAGE_SIZE = 10
  const { page, setPage, totalPages, paginated } = usePagination(placements, PAGE_SIZE)

  function set(key: string, value: unknown) { setForm(f => ({ ...f, [key]: value })) }

  function openAdd() { setForm(EMPTY); setEditing(null); setSavedId(null); setShowForm(true); setError(null) }
  function openEdit(p: Placement) {
    if (p.status !== 'draft' && p.status !== 'rejected') return
    setForm({ student_name: p.student_name, company: p.company, role: p.role, package_lpa: p.package_lpa, year: p.year, batch_year: p.batch_year ?? p.year, is_internship: p.is_internship ?? false, ctc_fixed: p.ctc_fixed ?? 0, ctc_variable: p.ctc_variable ?? 0, location: p.location ?? '', linkedin_url: p.linkedin_url ?? '', headshot_url: p.headshot_url ?? '', offer_letter_url: p.offer_letter_url ?? '' })
    setEditing(p); setSavedId(p.id); setShowForm(true); setError(null)
  }

  async function save() {
    setSaving(true); setError(null)
    if (!form.student_name || !form.company || !form.role) { setError('Student name, company and role are required.'); setSaving(false); return }
    const payload = { student_name: form.student_name, company: form.company, role: form.role, package_lpa: form.package_lpa, year: form.year, batch_year: form.batch_year || null, is_internship: form.is_internship, ctc_fixed: form.ctc_fixed || null, ctc_variable: form.ctc_variable || null, location: form.location || null, linkedin_url: form.linkedin_url || null, headshot_url: form.headshot_url || null, offer_letter_url: form.offer_letter_url || null }
    if (editing) {
      const { error: e } = await supabase.from('placements').update({ ...payload, status: 'draft', reject_reason: null }).eq('id', editing.id)
      if (e) { setError(e.message); setSaving(false); return }
      setSavedId(editing.id)
    } else {
      const { data, error: e } = await supabase.from('placements').insert({ ...payload, dept_id: profile.dept_id, submitted_by: profile.id, status: 'draft' }).select('id').single()
      if (e) { setError(e.message); setSaving(false); return }
      if (data) setSavedId(data.id)
    }
    setSaving(false); router.refresh()
  }

  async function handleUpload(field: 'headshot_url' | 'offer_letter_url', file: File) {
    if (!savedId) { setError('Save the record first before uploading files.'); return }
    setUploading(u => ({ ...u, [field]: true }))
    const fileName = field === 'headshot_url' ? 'headshot' : 'offer_letter'
    const url = await uploadFile('placements', savedId, file, fileName)
    if (url) {
      set(field, url)
      await supabase.from('placements').update({ [field]: url }).eq('id', savedId)
      router.refresh()
    }
    setUploading(u => ({ ...u, [field]: false }))
  }

  async function submit(id: string) {
    await supabase.from('placements').update({ status: 'pending' }).eq('id', id)
    await supabase.from('audit_log').insert({ actor_id: profile.id, record_type: 'placements', action: 'submitted', record_id: id, actor_role: profile.role ?? 'hod' })
    router.refresh()
  }

  async function del(id: string) {
    setDeleting(id); await supabase.from('placements').delete().eq('id', id); setDeleting(null); router.refresh()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-stone-800">Placements</h1>
          <p className="text-stone-500 text-sm">{profile.departments?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/placements/import"
            className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-800 border border-stone-200 hover:border-stone-300 px-4 py-2.5 rounded-lg transition-colors">
            <Upload className="w-4 h-4" /> Bulk Import
          </Link>
          <button type="button" onClick={openAdd} className="flex items-center gap-2 bg-[#E8820C] hover:bg-[#d4750b] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> Add Placement
          </button>
        </div>
      </div>

      <div ref={tableRef} className="space-y-4">
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-stone-400 text-xs uppercase tracking-wide border-b border-stone-100">
                <th className="text-left px-5 py-3 font-medium">Student</th>
                <th className="text-left px-4 py-3 font-medium">Company / Role</th>
                <th className="text-left px-4 py-3 font-medium">Package</th>
                <th className="text-left px-4 py-3 font-medium">Year</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {placements.length === 0 && <tr><td colSpan={7} className="text-center py-12 text-stone-400">No placements yet.</td></tr>}
              {paginated.map(p => (
                <tr
                  key={p.id}
                  className="hover:bg-stone-50 transition-colors cursor-pointer"
                  onClick={() => setViewing(p)}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {p.headshot_url
                        ? <img src={p.headshot_url} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                        : <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 text-xs font-medium shrink-0">{p.student_name.charAt(0)}</div>
                      }
                      <span className="text-stone-700 font-medium">{p.student_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><div className="text-stone-700">{p.company}</div><div className="text-stone-400 text-xs">{p.role}</div></td>
                  <td className="px-4 py-3.5 text-stone-600 tabular-nums">₹{p.package_lpa} LPA</td>
                  <td className="px-4 py-3.5 text-stone-500">{p.year}</td>
                  <td className="px-4 py-3.5"><span className={`text-xs px-2 py-0.5 rounded-full ${p.is_internship ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-700'}`}>{p.is_internship ? 'Intern' : 'Full-time'}</span></td>
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
        <PaginationBar page={page} totalPages={totalPages} onPageChange={p => { setPage(p); tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} totalItems={placements.length} pageSize={PAGE_SIZE} />
      </div>

      {viewing && (
        <AdminDetailModal title="Placement details" onClose={() => setViewing(null)}>
          <DetailRow label="Student" value={viewing.student_name} />
          <DetailRow label="Company" value={viewing.company} />
          <DetailRow label="Role" value={viewing.role} />
          <DetailRow label="Package (LPA)" value={`₹${viewing.package_lpa}`} />
          <DetailRow label="Year" value={String(viewing.year)} />
          <DetailRow label="Type" value={viewing.is_internship ? 'Internship' : 'Full-time'} />
          <DetailRow label="Location" value={viewing.location} />
          <DetailRow label="LinkedIn" value={viewing.linkedin_url ? <a href={viewing.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-[#E8820C] hover:underline">{viewing.linkedin_url}</a> : null} />
          <DetailRow label="Status" value={viewing.status} />
          {viewing.reject_reason && <DetailRow label="Rejection reason" value={viewing.reject_reason} />}
        </AdminDetailModal>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center px-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-stone-800 font-semibold">{editing ? 'Edit Placement' : 'Add Placement'}</h2>
              <button type="button" onClick={() => { setShowForm(false); router.refresh() }}><X className="w-5 h-5 text-stone-400" /></button>
            </div>
            {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg"><AlertCircle className="w-4 h-4" />{error}</div>}
            {!savedId && <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-2 rounded-lg">Save the record first to enable file uploads.</div>}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Student Name</label>
                <input value={form.student_name} onChange={e => set('student_name', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Company</label>
                <input value={form.company} onChange={e => set('company', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Role</label>
                <input value={form.role} onChange={e => set('role', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Package LPA (₹)</label>
                <input type="number" value={form.package_lpa} onChange={e => set('package_lpa', Number(e.target.value))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Year</label>
                <input type="number" value={form.year} onChange={e => set('year', Number(e.target.value))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">CTC Fixed (₹ LPA)</label>
                <input type="number" value={form.ctc_fixed} onChange={e => set('ctc_fixed', Number(e.target.value))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">CTC Variable (₹ LPA)</label>
                <input type="number" value={form.ctc_variable} onChange={e => set('ctc_variable', Number(e.target.value))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Location</label>
                <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Pune, Mumbai" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">LinkedIn URL</label>
                <input value={form.linkedin_url} onChange={e => set('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/..." className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div className="col-span-2 flex items-center gap-3">
                <input type="checkbox" id="is_internship" checked={form.is_internship} onChange={e => set('is_internship', e.target.checked)} className="rounded" />
                <label htmlFor="is_internship" className="text-sm text-stone-600">This is an internship (not full-time)</label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-100">
              <FileUpload label="Student Headshot" accept="image/*" currentUrl={form.headshot_url} uploading={uploading.headshot_url}
                hint="JPG or PNG, square crop preferred"
                onUpload={f => handleUpload('headshot_url', f)}
                onRemove={savedId ? () => set('headshot_url', '') : undefined} />
              <FileUpload label="Offer Letter (PDF)" accept=".pdf" currentUrl={form.offer_letter_url} uploading={uploading.offer_letter_url}
                hint="PDF only"
                onUpload={f => handleUpload('offer_letter_url', f)}
                onRemove={savedId ? () => set('offer_letter_url', '') : undefined} />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => { setShowForm(false); router.refresh() }} className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg">Close</button>
              <button type="button" onClick={save} disabled={saving} className="px-4 py-2 text-sm bg-[#E8820C] hover:bg-[#d4750b] text-white rounded-lg disabled:opacity-50">
                {saving ? 'Saving…' : savedId ? 'Update Draft' : 'Save as Draft'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
