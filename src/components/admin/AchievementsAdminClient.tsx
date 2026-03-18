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

interface Achievement {
  id: string
  title: string
  student_name?: string
  achievement_level?: string
  award?: string
  year?: number
  achievement_type: string
  description?: string
  date: string
  sport?: string | null
  competition_name?: string
  organizing_institution?: string
  prize_position?: string
  prize_money?: number
  news_url?: string
  proof_url?: string | null
  dept_id: string
  status: string
  reject_reason?: string | null
}

interface Props { achievements: Achievement[]; profile: any }

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-stone-100 text-stone-500', pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-600',
}

const ACHIEVEMENT_TYPES = ['technical', 'sports', 'cultural', 'academic']
const ACHIEVEMENT_LEVELS = ['institute', 'state', 'national', 'international'] as const
type AchievementLevel = (typeof ACHIEVEMENT_LEVELS)[number]
const PRIZE_POSITIONS = ['1st Place', '2nd Place', '3rd Place', 'Runner-up', 'Finalist', 'Special Award', 'Participation']
const EMPTY: { title: string; student_name: string; achievement_level: AchievementLevel; award: string; year: number; achievement_type: string; description: string; date: string; sport: string; competition_name: string; organizing_institution: string; prize_position: string; prize_money: number; news_url: string; proof_url: string } = { title: '', student_name: '', achievement_level: 'institute', award: '', year: new Date().getFullYear(), achievement_type: 'technical', description: '', date: '', sport: '', competition_name: '', organizing_institution: '', prize_position: '1st Place', prize_money: 0, news_url: '', proof_url: '' }

export default function AchievementsAdminClient({ achievements, profile }: Props) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Achievement | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [viewing, setViewing] = useState<Achievement | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const PAGE_SIZE = 10
  const { page, setPage, totalPages, paginated } = usePagination(achievements, PAGE_SIZE)

  function set(key: string, value: unknown) { setForm(f => ({ ...f, [key]: value })) }

  function openAdd() { setForm(EMPTY); setEditing(null); setSavedId(null); setShowForm(true); setError(null) }
  function openEdit(a: Achievement) {
    if (a.status !== 'draft' && a.status !== 'rejected') return
    setForm({ title: a.title, student_name: a.student_name ?? '', achievement_level: (a.achievement_level ?? 'institute') as AchievementLevel, award: a.award ?? '', year: a.year ?? new Date().getFullYear(), achievement_type: a.achievement_type, description: a.description ?? '', date: a.date, sport: a.sport ?? '', competition_name: a.competition_name ?? '', organizing_institution: a.organizing_institution ?? '', prize_position: a.prize_position ?? '1st Place', prize_money: a.prize_money ?? 0, news_url: a.news_url ?? '', proof_url: a.proof_url ?? '' })
    setEditing(a); setSavedId(a.id); setShowForm(true); setError(null)
  }

  async function save() {
    setSaving(true); setError(null)
    if (!form.title || !form.date || !form.student_name?.trim() || !form.award?.trim()) { setError('Title, date, student name and award are required.'); setSaving(false); return }
    const payload = { title: form.title, student_name: form.student_name.trim(), achievement_level: form.achievement_level, award: form.award.trim(), year: form.year, achievement_type: form.achievement_type, description: form.description || null, date: form.date, sport: form.achievement_type === 'sports' ? form.sport || null : null, competition_name: form.competition_name || null, organizing_institution: form.organizing_institution || null, prize_position: form.prize_position || null, prize_money: form.prize_money || null, news_url: form.news_url || null, proof_url: form.proof_url || null }
    if (editing) {
      const { error: e } = await supabase.from('achievements').update({ ...payload, status: 'draft', reject_reason: null }).eq('id', editing.id)
      if (e) { setError(e.message); setSaving(false); return }
      setSavedId(editing.id)
    } else {
      const { data, error: e } = await supabase.from('achievements').insert({ ...payload, dept_id: profile.dept_id, submitted_by: profile.id, status: 'draft' }).select('id').single()
      if (e) { setError(e.message); setSaving(false); return }
      if (data) setSavedId(data.id)
    }
    setSaving(false); router.refresh()
  }

  async function handleProofUpload(file: File) {
    if (!savedId) { setError('Save first before uploading.'); return }
    setUploading(true)
    const url = await uploadFile('achievements', savedId, file, 'proof')
    if (url) { set('proof_url', url); await supabase.from('achievements').update({ proof_url: url }).eq('id', savedId); router.refresh() }
    setUploading(false)
  }

  async function submit(id: string) {
    await supabase.from('achievements').update({ status: 'pending' }).eq('id', id)
    await supabase.from('audit_log').insert({ actor_id: profile.id, record_type: 'achievements', action: 'submitted', record_id: id, actor_role: profile.role ?? 'hod' })
    router.refresh()
  }

  async function del(id: string) {
    setDeleting(id); await supabase.from('achievements').delete().eq('id', id); setDeleting(null); router.refresh()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Achievements</h1>
          <p className="text-stone-500 text-sm">{profile.departments?.name}</p>
        </div>
        <button type="button" onClick={openAdd} className="flex items-center gap-2 bg-[#E8820C] hover:bg-[#d4750b] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Achievement
        </button>
      </div>

      <div ref={tableRef} className="space-y-4">
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-stone-400 text-xs uppercase tracking-wide border-b border-stone-100">
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Position</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Proof</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
          <tbody className="divide-y divide-stone-100">
            {achievements.length === 0 && <tr><td colSpan={7} className="text-center py-12 text-stone-400">No achievements yet.</td></tr>}
            {paginated.map(a => (
              <tr key={a.id} className="hover:bg-stone-50 transition-colors cursor-pointer" onClick={() => setViewing(a)}>
                <td className="px-5 py-3.5 text-stone-700 font-medium max-w-xs"><div className="truncate">{a.title}</div></td>
                <td className="px-4 py-3.5"><span className="text-xs capitalize bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">{a.achievement_type}</span></td>
                <td className="px-4 py-3.5 text-stone-600 text-xs">{a.prize_position || '—'}</td>
                <td className="px-4 py-3.5 text-stone-500 text-xs tabular-nums">{a.date ? new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                <td className="px-4 py-3.5">
                  {a.proof_url
                    ? <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Uploaded</span>
                    : <span className="text-xs text-stone-400">—</span>}
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[a.status] ?? 'bg-stone-100 text-stone-500'}`}>{a.status}</span>
                  {a.status === 'rejected' && a.reject_reason && <div className="flex items-start gap-1 mt-1 text-xs text-red-500"><AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />{a.reject_reason}</div>}
                </td>
                <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-1 justify-end">
                    <button type="button" onClick={() => setViewing(a)} className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg" title="View"><Eye className="w-3.5 h-3.5" /></button>
                    {(a.status === 'draft' || a.status === 'rejected') && (
                      <>
                        <button type="button" onClick={() => openEdit(a)} className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => submit(a.id)} className="flex items-center gap-1 text-xs text-[#E8820C] hover:bg-[#E8820C]/10 px-2 py-1.5 rounded-lg"><Send className="w-3.5 h-3.5" />Submit</button>
                      </>
                    )}
                    {a.status === 'draft' && <button type="button" onClick={() => del(a.id)} disabled={deleting === a.id} className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <PaginationBar page={page} totalPages={totalPages} onPageChange={p => { setPage(p); tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} totalItems={achievements.length} pageSize={PAGE_SIZE} />
      </div>

      {viewing && (
        <AdminDetailModal title="Achievement details" onClose={() => setViewing(null)}>
          <DetailRow label="Title" value={viewing.title} />
          <DetailRow label="Proof / Media" value={<MediaValue url={viewing.proof_url} />} />
          <DetailRow label="News link" value={viewing.news_url ? <a href={viewing.news_url} target="_blank" rel="noopener noreferrer" className="text-[#E8820C] hover:underline break-all">{viewing.news_url}</a> : null} />
          <DetailRow label="Student" value={viewing.student_name} />
          <DetailRow label="Level" value={viewing.achievement_level} />
          <DetailRow label="Award" value={viewing.award} />
          <DetailRow label="Year" value={viewing.year != null ? String(viewing.year) : null} />
          <DetailRow label="Type" value={viewing.achievement_type} />
          <DetailRow label="Date" value={viewing.date ? new Date(viewing.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null} />
          <DetailRow label="Sport" value={viewing.sport} />
          <DetailRow label="Competition" value={viewing.competition_name} />
          <DetailRow label="Position" value={viewing.prize_position} />
          <DetailRow label="Description" value={viewing.description} />
          <DetailRow label="Status" value={viewing.status} />
          {viewing.reject_reason && <DetailRow label="Rejection reason" value={viewing.reject_reason} />}
        </AdminDetailModal>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center px-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-stone-800 font-semibold">{editing ? 'Edit Achievement' : 'Add Achievement'}</h2>
              <button type="button" onClick={() => { setShowForm(false); router.refresh() }}><X className="w-5 h-5 text-stone-400" /></button>
            </div>
            {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg"><AlertCircle className="w-4 h-4" />{error}</div>}
            {!savedId && <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-2 rounded-lg">Save first to enable proof upload.</div>}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Title</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Type</label>
                <select value={form.achievement_type} onChange={e => set('achievement_type', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]">
                  {ACHIEVEMENT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Date</label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Competition Name</label>
                <input value={form.competition_name} onChange={e => set('competition_name', e.target.value)} placeholder="e.g. Smart India Hackathon" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Prize Position</label>
                <select value={form.prize_position} onChange={e => set('prize_position', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]">
                  {PRIZE_POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Organizing Institution</label>
                <input value={form.organizing_institution} onChange={e => set('organizing_institution', e.target.value)} placeholder="e.g. IIT Bombay, AICTE" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              {form.achievement_type === 'sports' && (
                <div>
                  <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Sport</label>
                  <input value={form.sport} onChange={e => set('sport', e.target.value)} placeholder="e.g. Cricket, Athletics" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
                </div>
              )}
              <div className={form.achievement_type === 'sports' ? '' : 'col-span-2'}>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Prize Money (₹ optional)</label>
                <input type="number" value={form.prize_money} onChange={e => set('prize_money', Number(e.target.value))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">News / Media Link (optional)</label>
                <input value={form.news_url} onChange={e => set('news_url', e.target.value)} placeholder="https://..." className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Description (optional)</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C] resize-none" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Student Name *</label>
                <input value={form.student_name} onChange={e => set('student_name', e.target.value)} placeholder="e.g. John Doe" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Achievement Level *</label>
                <select value={form.achievement_level} onChange={e => set('achievement_level', e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]">
                  {ACHIEVEMENT_LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Award *</label>
                <input value={form.award} onChange={e => set('award', e.target.value)} placeholder="e.g. Gold Medal, 1st Prize" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Year *</label>
                <input type="number" value={form.year} onChange={e => set('year', Number(e.target.value))} min={2000} max={2100} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]" />
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100">
              <FileUpload label="Proof (Certificate / Photo)" accept="image/*,.pdf" currentUrl={form.proof_url} uploading={uploading}
                hint="Image or PDF of certificate / award"
                onUpload={handleProofUpload}
                onRemove={savedId ? () => set('proof_url', '') : undefined} />
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
