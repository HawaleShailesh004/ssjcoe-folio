import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, BookOpen, FileText, Calendar, Award, Users, Plus, Clock, CheckCircle, XCircle, FileEdit } from 'lucide-react'

const CONTENT_TABLES = [
  { key: 'placements',   label: 'Placements',   icon: GraduationCap, href: '/admin/placements' },
  { key: 'research_papers', label: 'Research',  icon: BookOpen,       href: '/admin/research' },
  { key: 'patents',      label: 'Patents',       icon: FileText,       href: '/admin/patents' },
  { key: 'events',       label: 'Events',        icon: Calendar,       href: '/admin/events' },
  { key: 'achievements', label: 'Achievements',  icon: Award,          href: '/admin/achievements' },
  { key: 'faculty',      label: 'Faculty',       icon: Users,          href: '/admin/faculty' },
]

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, departments(name)')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/admin/login')

  // Fetch counts per table for this dept
  const counts = await Promise.all(
    CONTENT_TABLES.map(async ({ key }) => {
      const base = supabase.from(key).select('status', { count: 'exact', head: false })
      const q = profile.role === 'hod' ? base.eq('dept_id', profile.dept_id) : base
      const { data } = await q
      const rows = data ?? []
      return {
        key,
        draft:    rows.filter((r: { status: string }) => r.status === 'draft').length,
        pending:  rows.filter((r: { status: string }) => r.status === 'pending').length,
        approved: rows.filter((r: { status: string }) => r.status === 'approved').length,
        rejected: rows.filter((r: { status: string }) => r.status === 'rejected').length,
        total:    rows.length,
      }
    })
  )

  const totalPending  = counts.reduce((s, c) => s + c.pending, 0)
  const totalApproved = counts.reduce((s, c) => s + c.approved, 0)
  const totalDraft    = counts.reduce((s, c) => s + c.draft, 0)
  const totalRejected = counts.reduce((s, c) => s + c.rejected, 0)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Welcome back, {profile.full_name?.split(' ')[0]}
        </h1>
        <p className="text-stone-500 text-sm mt-0.5">
          {profile.departments?.name} · HOD Dashboard
        </p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Draft',    value: totalDraft,    icon: FileEdit,      color: 'text-stone-500', bg: 'bg-stone-100' },
          { label: 'Pending',  value: totalPending,  icon: Clock,         color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Approved', value: totalApproved, icon: CheckCircle,   color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Rejected', value: totalRejected, icon: XCircle,       color: 'text-red-500',   bg: 'bg-red-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4 flex items-center gap-3`}>
            <Icon className={`w-5 h-5 ${color}`} />
            <div>
              <div className={`text-2xl font-bold ${color}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>{value}</div>
              <div className="text-stone-500 text-xs">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Per-section table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100">
          <h2 className="text-stone-800 font-medium text-sm">Content Overview</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 text-stone-400 text-xs uppercase tracking-wide">
              <th className="text-left px-5 py-3 font-medium">Section</th>
              <th className="text-center px-4 py-3 font-medium">Draft</th>
              <th className="text-center px-4 py-3 font-medium">Pending</th>
              <th className="text-center px-4 py-3 font-medium">Approved</th>
              <th className="text-center px-4 py-3 font-medium">Rejected</th>
              <th className="text-right px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {CONTENT_TABLES.map(({ key, label, icon: Icon, href }) => {
              const c = counts.find(x => x.key === key)!
              return (
                <tr key={key} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-stone-400" />
                      <span className="text-stone-700 font-medium">{label}</span>
                    </div>
                  </td>
                  <td className="text-center px-4 py-3.5 text-stone-500 tabular-nums">{c.draft}</td>
                  <td className="text-center px-4 py-3.5">
                    {c.pending > 0
                      ? <span className="inline-block bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">{c.pending}</span>
                      : <span className="text-stone-300">—</span>
                    }
                  </td>
                  <td className="text-center px-4 py-3.5 text-green-600 tabular-nums">{c.approved}</td>
                  <td className="text-center px-4 py-3.5">
                    {c.rejected > 0
                      ? <span className="inline-block bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">{c.rejected}</span>
                      : <span className="text-stone-300">—</span>
                    }
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={href}
                      className="inline-flex items-center gap-1 text-xs text-[#E8820C] hover:underline font-medium"
                    >
                      <Plus className="w-3 h-3" /> Manage
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
