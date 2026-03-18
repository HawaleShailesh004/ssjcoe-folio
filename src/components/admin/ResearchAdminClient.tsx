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

interface Paper {
  id: string
  title: string
  authors: string[]
  journal: string
  year: number
  doi?: string
  paper_url?: string
  pdf_url?: string | null
  publisher?: string
  publication_type: string
  is_scopus: boolean
  is_sci: boolean
  impact_factor?: number
  citation_count: number
  abstract?: string
  dept_id: string
  status: string
  reject_reason?: string | null
}

interface Faculty { id: string; name: string }
interface Props { papers: Paper[]; profile: any }

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-stone-100 text-stone-500', pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-600',
}

const PUB_TYPES = ['journal', 'conference', 'book_chapter']
const EMPTY = { title: '', authors: [] as string[], journal: '', year: new Date().getFullYear(), doi: '', paper_url: '', pdf_url: '', publisher: '', publication_type: 'journal', is_scopus: false, is_sci: false, impact_factor: 0, citation_count: 0, abstract: '' }

export default function ResearchAdminClient({ papers, profile }: Props) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Paper | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [authorSelect, setAuthorSelect] = useState('')
  const [otherAuthorName, setOtherAuthorName] = useState('')
  const [viewing, setViewing] = useState<Paper | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const PAGE_SIZE = 10
  const { page, setPage, totalPages, paginated } = usePagination(papers, PAGE_SIZE)

  useEffect(() => {
    supabase.from('faculty').select('id, name').eq('dept_id', profile.dept_id).eq('status', 'approved')
      .then(({ data }) => setFaculty(data ?? []))
  }, [profile.dept_id])

  function set(key: string, value: unknown) { setForm(f => ({ ...f, [key]: value })) }
  function toggleAuthor(name: string) { setForm(f => ({ ...f, authors: f.authors.includes(name) ? f.authors.filter(a => a !== name) : [...f.authors, name] })) }
  function addAuthorFromSelect(value: string) {
    if (!value || value === '__other__') return
    if (!form.authors.includes(value)) setForm(f => ({ ...f, authors: [...f.authors, value] }))
    setAuthorSelect('')
  }
  function addOtherAuthor() {
    const name = otherAuthorName.trim()
    if (!name) return
    if (!form.authors.includes(name)) setForm(f => ({ ...f, authors: [...f.authors, name] }))
    setOtherAuthorName('')
    setAuthorSelect('')
  }

  function openAdd() { setForm(EMPTY); setEditing(null); setSavedId(null); setShowForm(true); setError(null) }
  function openEdit(p: Paper) {
    if (p.status !== 'draft' && p.status !== 'rejected') return
    setForm({ title: p.title, authors: p.authors ?? [], journal: p.journal, year: p.year, doi: p.doi ?? '', paper_url: p.paper_url ?? '', pdf_url: p.pdf_url ?? '', publisher: p.publisher ?? '', publication_type: p.publication_type ?? 'journal', is_scopus: p.is_scopus ?? false, is_sci: p.is_sci ?? false, impact_factor: p.impact_factor ?? 0, citation_count: p.citation_count ?? 0, abstract: p.abstract ?? '' })
    setEditing(p); setSavedId(p.id); setShowForm(true); setError(null)
  }

  async function save() {
    setSaving(true); setError(null)
    if (!form.title || !form.journal || form.authors.length === 0) { setError('Title, journal and at least one author required.'); setSaving(false); return }
    const payload = { title: form.title, authors: form.authors, journal: form.journal, year: form.year, category: form.publication_type, doi: form.doi || null, paper_url: form.paper_url || null, pdf_url: form.pdf_url || null, publisher: form.publisher || null, publication_type: form.publication_type, is_scopus: form.is_scopus, is_sci: form.is_sci, impact_factor: form.impact_factor || null, citation_count: form.citation_count || 0, abstract: form.abstract || null }
    if (editing) {
      const { error: e } = await supabase.from('research_papers').update({ ...payload, status: 'draft', reject_reason: null }).eq('id', editing.id)
      if (e) { setError(e.message); setSaving(false); return }
      setSavedId(editing.id)
    } else {
      const { data, error: e } = await supabase.from('research_papers').insert({ ...payload, dept_id: profile.dept_id, submitted_by: profile.id, status: 'draft' }).select('id').single()
      if (e) { setError(e.message); setSaving(false); return }
      if (data) setSavedId(data.id)
    }
    setSaving(false); router.refresh()
  }

  async function handlePdfUpload(file: File) {
    if (!savedId) { setError('Save the record first before uploading.'); return }
    setUploading(true)
    const url = await uploadFile('research', savedId, file, 'paper')
    if (url) { set('pdf_url', url); await supabase.from('research_papers').update({ pdf_url: url }).eq('id', savedId); router.refresh() }
    setUploading(false)
  }

  async function submit(id: string) {
    await supabase.from('research_papers').update({ status: 'pending' }).eq('id', id)
    await supabase.from('audit_log').insert({ actor_id: profile.id, record_type: 'research_papers', action: 'submitted', record_id: id, actor_role: profile.role ?? 'hod' })
    router.refresh()
  }

  async function del(id: string) {
    setDeleting(id); await supabase.from('research_papers').delete().eq('id', id); setDeleting(null); router.refresh()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Research Papers</h1>
          <p className="text-stone-500 text-sm">{profile.departments?.name}</p>
        </div>
        <button type="button" onClick={openAdd} className="flex items-center gap-2 bg-[#E8820C] hover:bg-[#d4750b] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Paper
        </button>
      </div>

      <div ref={tableRef} className="space-y-4">
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-stone-400 text-xs uppercase tracking-wide border-b border-stone-100">
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Authors</th>
                <th className="text-left px-4 py-3 font-medium">Journal</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Indexed</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {papers.length === 0 && <tr><td colSpan={7} className="text-center py-12 text-stone-400">No research papers yet.</td></tr>}
              {paginated.map(p => (
                <tr key={p.id} className="hover:bg-stone-50 transition-colors cursor-pointer" onClick={() => setViewing(p)}>
                  <td className="px-5 py-3.5 text-stone-700 font-medium max-w-xs"><div className="truncate">{p.title}</div></td>
                  <td className="px-4 py-3.5 text-stone-500 text-xs max-w-[140px]"><div className="truncate">{(Array.isArray(p.authors) ? p.authors : []).join(', ')}</div></td>
                  <td className="px-4 py-3.5 text-stone-600 max-w-[120px]"><div className="truncate">{p.journal}</div></td>
                  <td className="px-4 py-3.5"><span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full capitalize">{(p.publication_type ?? '').replace('_', ' ')}</span></td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1">
                      {p.is_scopus && <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">Scopus</span>}
                      {p.is_sci && <span className="text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">SCI</span>}
                      {!p.is_scopus && !p.is_sci && <span className="text-stone-300 text-xs">—</span>}
                    </div>
                  </td>
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
        <PaginationBar page={page} totalPages={totalPages} onPageChange={p => { setPage(p); tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} totalItems={papers.length} pageSize={PAGE_SIZE} />
      </div>

      {viewing && (
        <AdminDetailModal title="Research paper details" onClose={() => setViewing(null)}>
          <DetailRow label="Title" value={viewing.title} />
          <DetailRow label="Authors" value={(Array.isArray(viewing.authors) ? viewing.authors : []).join(', ')} />
          <DetailRow label="Journal" value={viewing.journal} />
          <DetailRow label="Year" value={String(viewing.year)} />
          <DetailRow label="Publication type" value={viewing.publication_type} />
          <DetailRow label="Scopus" value={viewing.is_scopus ? 'Yes' : 'No'} />
          <DetailRow label="SCI" value={viewing.is_sci ? 'Yes' : 'No'} />
          <DetailRow label="Impact factor" value={viewing.impact_factor != null ? String(viewing.impact_factor) : null} />
          <DetailRow label="Citations" value={String(viewing.citation_count ?? 0)} />
          <DetailRow label="DOI" value={viewing.doi} />
          <DetailRow label="Abstract" value={viewing.abstract} />
          <DetailRow label="Status" value={viewing.status} />
          {viewing.reject_reason && <DetailRow label="Rejection reason" value={viewing.reject_reason} />}
        </AdminDetailModal>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center px-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-stone-800 font-semibold">{editing ? 'Edit Paper' : 'Add Research Paper'}</h2>
              <button type="button" onClick={() => { setShowForm(false); router.refresh() }}><X className="w-5 h-5 text-stone-400" /></button>
            </div>
            {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg"><AlertCircle className="w-4 h-4" />{error}</div>}
            {!savedId && <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-2 rounded-lg">Save the record first to enable PDF upload.</div>}

            <div>
              <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Title</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
            </div>

            <div>
              <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Authors</label>
              <div className="border border-stone-300 rounded-lg p-2 flex flex-wrap gap-1.5 min-h-[42px]">
                {form.authors.map(a => (
                  <span key={a} className="flex items-center gap-1 bg-[#E8820C]/10 text-[#E8820C] text-xs px-2 py-1 rounded-md">
                    {a}<button type="button" onClick={() => toggleAuthor(a)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                ))}
                {form.authors.length === 0 && <span className="text-stone-400 text-xs px-1 py-1">Select from dropdown or add Other</span>}
              </div>
              <div className="mt-1.5 space-y-2">
                <select
                  value={authorSelect}
                  onChange={e => {
                    const v = e.target.value
                    setAuthorSelect(v)
                    if (v && v !== '__other__') addAuthorFromSelect(v)
                  }}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C] bg-white"
                >
                  <option value="">Select author…</option>
                  {faculty.map(f => (
                    <option key={f.id} value={f.name}>{f.name}</option>
                  ))}
                  <option value="__other__">Other (not in faculty list)</option>
                </select>
                {authorSelect === '__other__' && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otherAuthorName}
                      onChange={e => setOtherAuthorName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addOtherAuthor())}
                      placeholder="Type author name"
                      className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]"
                    />
                    <button type="button" onClick={addOtherAuthor} className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm rounded-lg">
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Journal / Conference</label>
                <input value={form.journal} onChange={e => set('journal', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Publisher</label>
                <input value={form.publisher} onChange={e => set('publisher', e.target.value)} placeholder="e.g. IEEE, Elsevier" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Publication Type</label>
                <select value={form.publication_type} onChange={e => set('publication_type', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]">
                  {PUB_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Year</label>
                <input type="number" value={form.year} onChange={e => set('year', Number(e.target.value))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Impact Factor</label>
                <input type="number" step="0.01" value={form.impact_factor} onChange={e => set('impact_factor', Number(e.target.value))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">DOI</label>
                <input value={form.doi} onChange={e => set('doi', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Paper URL</label>
                <input value={form.paper_url} onChange={e => set('paper_url', e.target.value)} placeholder="https://..." className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div className="col-span-2 flex gap-6">
                <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
                  <input type="checkbox" checked={form.is_scopus} onChange={e => set('is_scopus', e.target.checked)} className="rounded" /> Scopus Indexed
                </label>
                <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
                  <input type="checkbox" checked={form.is_sci} onChange={e => set('is_sci', e.target.checked)} className="rounded" /> SCI Indexed
                </label>
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Abstract (optional)</label>
                <textarea value={form.abstract} onChange={e => set('abstract', e.target.value)} rows={3} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C] resize-none" />
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100">
              <FileUpload label="Paper PDF" accept=".pdf" currentUrl={form.pdf_url} uploading={uploading}
                hint="Upload the published paper PDF"
                onUpload={handlePdfUpload}
                onRemove={savedId ? () => set('pdf_url', '') : undefined} />
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
