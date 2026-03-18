'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { uploadFile } from '@/lib/storage'
import { Plus, Pencil, Trash2, Send, AlertCircle, X, Eye } from 'lucide-react'
import FileUpload from './FileUpload'
import { usePagination } from '@/hooks/usePagination'
import { PaginationBar } from '@/components/shared/PaginationBar'
import { AdminDetailModal, DetailRow } from './AdminDetailModal'

interface FacultyMember {
  id: string
  name: string
  designation: string
  qualification?: string
  education?: string
  specialization?: string | string[]
  experience_years?: number
  email?: string
  image_url?: string | null
  photo_url?: string | null
  cv_url?: string | null
  google_scholar_url?: string
  orcid_id?: string
  linkedin_url?: string
  dept_id: string
  status: string
  reject_reason?: string | null
}

interface Props { faculty: FacultyMember[]; profile: any }

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-stone-100 text-stone-500', pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-600',
}

const DESIGNATIONS = ['Professor', 'Associate Professor', 'Assistant Professor', 'HOD', 'Principal', 'Lab Instructor', 'Visiting Faculty']
const EMPTY = { name: '', designation: 'Assistant Professor', qualification: '', specialization: '', experience_years: 0, email: '', image_url: '', cv_url: '', google_scholar_url: '', orcid_id: '', linkedin_url: '' }

export default function FacultyAdminClient({ faculty, profile }: Props) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<FacultyMember | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  const [savedId, setSavedId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [viewing, setViewing] = useState<FacultyMember | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const PAGE_SIZE = 10
  const { page, setPage, totalPages, paginated } = usePagination(faculty, PAGE_SIZE)

  function set(key: string, value: unknown) { setForm(f => ({ ...f, [key]: value })) }

  function openAdd() { setForm(EMPTY); setEditing(null); setSavedId(null); setShowForm(true); setError(null) }
  function openEdit(f: FacultyMember) {
    if (f.status !== 'draft' && f.status !== 'rejected') return
    const spec = f.specialization != null ? (Array.isArray(f.specialization) ? f.specialization.join(', ') : String(f.specialization)) : ''
    setForm({ name: f.name, designation: f.designation, qualification: f.education ?? f.qualification ?? '', specialization: spec, experience_years: f.experience_years ?? 0, email: f.email ?? '', image_url: f.photo_url ?? f.image_url ?? '', cv_url: f.cv_url ?? '', google_scholar_url: f.google_scholar_url ?? '', orcid_id: f.orcid_id ?? '', linkedin_url: f.linkedin_url ?? '' })
    setEditing(f); setSavedId(f.id); setShowForm(true); setError(null)
  }

  async function save() {
    setSaving(true); setError(null)
    if (!form.name || !form.designation) { setError('Name and designation are required.'); setSaving(false); return }
    const specArray = form.specialization ? String(form.specialization).split(',').map(s => s.trim()).filter(Boolean) : []
    const payload = { name: form.name, designation: form.designation, education: form.qualification || null, specialization: specArray, email: form.email || null, photo_url: form.image_url || null, cv_url: form.cv_url || null, google_scholar_url: form.google_scholar_url || null, orcid_id: form.orcid_id || null, linkedin_url: form.linkedin_url || null }
    if (editing) {
      const { error: e } = await supabase.from('faculty').update({ ...payload, status: 'draft', reject_reason: null }).eq('id', editing.id)
      if (e) { setError(e.message); setSaving(false); return }
      setSavedId(editing.id)
    } else {
      const { data, error: e } = await supabase.from('faculty').insert({ ...payload, dept_id: profile.dept_id, submitted_by: profile.id, status: 'draft' }).select('id').single()
      if (e) { setError(e.message); setSaving(false); return }
      if (data) setSavedId(data.id)
    }
    setSaving(false); router.refresh()
  }

  async function handleUpload(field: 'image_url' | 'cv_url', file: File) {
    if (!savedId) { setError('Save first before uploading.'); return }
    setUploading(u => ({ ...u, [field]: true }))
    const fileName = field === 'image_url' ? 'headshot' : 'cv'
    const url = await uploadFile('faculty', savedId, file, fileName)
    if (url) {
      set(field, url)
      const dbField = field === 'image_url' ? 'photo_url' : 'cv_url'
      await supabase.from('faculty').update({ [dbField]: url }).eq('id', savedId)
      router.refresh()
    }
    setUploading(u => ({ ...u, [field]: false }))
  }

  async function submit(id: string) {
    await supabase.from('faculty').update({ status: 'pending' }).eq('id', id)
    await supabase.from('audit_log').insert({ actor_id: profile.id, record_type: 'faculty', action: 'submitted', record_id: id, actor_role: profile.role ?? 'hod' })
    router.refresh()
  }

  async function del(id: string) {
    setDeleting(id); await supabase.from('faculty').delete().eq('id', id); setDeleting(null); router.refresh()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Faculty</h1>
          <p className="text-stone-500 text-sm">{profile.departments?.name}</p>
        </div>
        <button type="button" onClick={openAdd} className="flex items-center gap-2 bg-[#E8820C] hover:bg-[#d4750b] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Faculty
        </button>
      </div>

      <div ref={tableRef} className="space-y-4">
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-stone-400 text-xs uppercase tracking-wide border-b border-stone-100">
                <th className="text-left px-5 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Designation</th>
                <th className="text-left px-4 py-3 font-medium">Qualification</th>
                <th className="text-left px-4 py-3 font-medium">Links</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {faculty.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-stone-400">No faculty yet.</td></tr>}
              {paginated.map(f => (
                <tr key={f.id} className="hover:bg-stone-50 transition-colors cursor-pointer" onClick={() => setViewing(f)}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {(f.photo_url ?? f.image_url)
                        ? <img src={f.photo_url ?? f.image_url ?? ''} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                        : <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 text-xs font-medium shrink-0">{f.name?.charAt(0) ?? '?'}</div>}
                      <span className="text-stone-700 font-medium">{f.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-stone-600 text-sm">{f.designation}</td>
                  <td className="px-4 py-3.5 text-stone-500 text-xs">{f.education ?? f.qualification ?? '—'}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1">
                      {f.google_scholar_url && <a href={f.google_scholar_url} target="_blank" rel="noopener noreferrer" className="text-xs bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded hover:bg-stone-200">Scholar</a>}
                      {f.linkedin_url && <a href={f.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-xs bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded hover:bg-stone-200">LinkedIn</a>}
                      {!f.google_scholar_url && !f.linkedin_url && <span className="text-stone-300 text-xs">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[f.status] ?? 'bg-stone-100 text-stone-500'}`}>{f.status}</span>
                    {f.status === 'rejected' && f.reject_reason && <div className="flex items-start gap-1 mt-1 text-xs text-red-500"><AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />{f.reject_reason}</div>}
                  </td>
                  <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1 justify-end">
                      <button type="button" onClick={() => setViewing(f)} className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg" title="View"><Eye className="w-3.5 h-3.5" /></button>
                      {(f.status === 'draft' || f.status === 'rejected') && (
                        <>
                          <button type="button" onClick={() => openEdit(f)} className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                          <button type="button" onClick={() => submit(f.id)} className="flex items-center gap-1 text-xs text-[#E8820C] hover:bg-[#E8820C]/10 px-2 py-1.5 rounded-lg"><Send className="w-3.5 h-3.5" />Submit</button>
                        </>
                      )}
                      {f.status === 'draft' && <button type="button" onClick={() => del(f.id)} disabled={deleting === f.id} className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationBar page={page} totalPages={totalPages} onPageChange={p => { setPage(p); tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} totalItems={faculty.length} pageSize={PAGE_SIZE} />
      </div>

      {viewing && (
        <AdminDetailModal title="Faculty details" onClose={() => setViewing(null)}>
          <DetailRow label="Name" value={viewing.name} />
          <DetailRow label="Designation" value={viewing.designation} />
          <DetailRow label="Qualification" value={viewing.education ?? viewing.qualification} />
          <DetailRow label="Specialization" value={Array.isArray(viewing.specialization) ? viewing.specialization.join(', ') : viewing.specialization} />
          <DetailRow label="Email" value={viewing.email} />
          <DetailRow label="Google Scholar" value={viewing.google_scholar_url ? <a href={viewing.google_scholar_url} target="_blank" rel="noopener noreferrer" className="text-[#E8820C] hover:underline">{viewing.google_scholar_url}</a> : null} />
          <DetailRow label="ORCID" value={viewing.orcid_id} />
          <DetailRow label="LinkedIn" value={viewing.linkedin_url ? <a href={viewing.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-[#E8820C] hover:underline">{viewing.linkedin_url}</a> : null} />
          <DetailRow label="Status" value={viewing.status} />
          {viewing.reject_reason && <DetailRow label="Rejection reason" value={viewing.reject_reason} />}
        </AdminDetailModal>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center px-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-stone-800 font-semibold">{editing ? 'Edit Faculty' : 'Add Faculty'}</h2>
              <button type="button" onClick={() => { setShowForm(false); router.refresh() }}><X className="w-5 h-5 text-stone-400" /></button>
            </div>
            {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg"><AlertCircle className="w-4 h-4" />{error}</div>}
            {!savedId && <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-2 rounded-lg">Save first to enable photo and CV upload.</div>}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Full Name</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Dr. Savita Sangam" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Designation</label>
                <select value={form.designation} onChange={e => set('designation', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]">
                  {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Qualification</label>
                <input value={form.qualification} onChange={e => set('qualification', e.target.value)} placeholder="e.g. Ph.D. Computer Science, M.E. VLSI" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Specialization</label>
                <input value={form.specialization} onChange={e => set('specialization', e.target.value)} placeholder="e.g. Machine Learning, VLSI Design" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Google Scholar URL</label>
                <input value={form.google_scholar_url} onChange={e => set('google_scholar_url', e.target.value)} placeholder="https://scholar.google.com/..." className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">ORCID ID</label>
                <input value={form.orcid_id} onChange={e => set('orcid_id', e.target.value)} placeholder="0000-0000-0000-0000" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">LinkedIn URL</label>
                <input value={form.linkedin_url} onChange={e => set('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/..." className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-100">
              <FileUpload label="Headshot Photo" accept="image/*" currentUrl={form.image_url} uploading={uploading.image_url}
                hint="Square crop, JPG or PNG preferred"
                onUpload={f => handleUpload('image_url', f)}
                onRemove={savedId ? () => set('image_url', '') : undefined} />
              <FileUpload label="CV / Resume (PDF)" accept=".pdf" currentUrl={form.cv_url} uploading={uploading.cv_url}
                hint="PDF only"
                onUpload={f => handleUpload('cv_url', f)}
                onRemove={savedId ? () => set('cv_url', '') : undefined} />
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
