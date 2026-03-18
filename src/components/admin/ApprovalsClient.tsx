'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { CheckCircle, XCircle, Building2, User, Clock } from 'lucide-react'

interface Props {
  items: Record<string, unknown>[]
  reviewerId: string
}

const TABLE_LABELS: Record<string, string> = {
  placements: 'Placement', research_papers: 'Research Paper',
  patents: 'Patent', events: 'Event', achievements: 'Achievement', faculty: 'Faculty',
}

function getTitle(item: Record<string, unknown>): string {
  return (item.student_name ?? item.title ?? item.name ?? item.company ?? '—') as string
}

function getSubtitle(item: Record<string, unknown>): string {
  return (item.company ?? item.journal ?? item.event_type ?? item.achievement_type ?? item.designation ?? '') as string
}

export default function ApprovalsClient({ items, reviewerId }: Props) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [loading, setLoading] = useState<string | null>(null)
  const [rejectModal, setRejectModal] = useState<{ id: string; table: string } | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  async function approve(id: string, table: string) {
    setLoading(id)
    await supabase.from(table).update({
      status: 'approved',
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    }).eq('id', id)

    await supabase.from('audit_log').insert({
      user_id: reviewerId, action: 'approved', table_name: table, record_id: id,
    })
    setLoading(null)
    router.refresh()
  }

  async function reject() {
    if (!rejectModal) return
    setLoading(rejectModal.id)
    await supabase.from(rejectModal.table).update({
      status: 'rejected',
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
      reject_reason: rejectReason,
    }).eq('id', rejectModal.id)

    await supabase.from('audit_log').insert({
      user_id: reviewerId, action: 'rejected', table_name: rejectModal.table,
      record_id: rejectModal.id, new_data: { reason: rejectReason },
    })
    setLoading(null)
    setRejectModal(null)
    setRejectReason('')
    router.refresh()
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-2xl font-semibold text-stone-800 mb-6">Approvals</h1>
        <div className="bg-white border border-stone-200 rounded-xl p-12 text-center">
          <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
          <p className="text-stone-500">All caught up. No pending approvals.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-stone-800">Approvals</h1>
        <span className="bg-amber-100 text-amber-700 text-sm font-medium px-3 py-1 rounded-full">{items.length} pending</span>
      </div>

      {items.map((item) => (
        <div key={`${item._table as string}-${item.id as string}`} className="bg-white border border-stone-200 rounded-xl p-5 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium bg-stone-100 text-stone-500 px-2 py-0.5 rounded">
                {TABLE_LABELS[item._table as string]}
              </span>
              {item.departments ? (
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> {(item.departments as { code: string }).code}
                </span>
              ) : null}
            </div>
            <div className="text-stone-800 font-medium truncate">{getTitle(item)}</div>
            {getSubtitle(item) && <div className="text-stone-500 text-sm">{getSubtitle(item)}</div>}
            <div className="flex items-center gap-3 mt-2 text-xs text-stone-400">
              {item.profiles ? (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" /> {(item.profiles as { full_name?: string; email: string }).full_name ?? (item.profiles as { email: string }).email}
                </span>
              ) : null}
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date((item.created_at as string)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => { setRejectModal({ id: item.id as string, table: item._table as string }); setRejectReason('') }}
              disabled={loading === item.id}
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" /> Reject
            </button>
            <button
              onClick={() => approve(item.id as string, item._table as string)}
              disabled={loading === item.id}
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              {loading === item.id ? 'Approving…' : 'Approve'}
            </button>
          </div>
        </div>
      ))}

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-stone-800 font-semibold mb-1">Reject submission</h3>
            <p className="text-stone-500 text-sm mb-4">Provide a reason so the HOD can correct and resubmit.</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g. Package figure appears incorrect, please verify and resubmit."
              rows={3}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C] resize-none"
            />
            <div className="flex gap-2 mt-4 justify-end">
              <button onClick={() => setRejectModal(null)} className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg">Cancel</button>
              <button
                onClick={reject}
                disabled={!rejectReason.trim() || !!loading}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
              >
                {loading ? 'Rejecting…' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
