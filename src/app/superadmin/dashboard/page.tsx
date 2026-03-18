import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckSquare, Clock, Users, Building2, AlertTriangle } from 'lucide-react'

const TABLES = ['placements', 'research_papers', 'patents', 'events', 'achievements', 'faculty']

export default async function SuperAdminDashboardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  // All pending across all tables
  const pendingCounts = await Promise.all(
    TABLES.map(async (t) => {
      const { count } = await supabase.from(t).select('*', { count: 'exact', head: true }).eq('status', 'pending')
      return { table: t, count: count ?? 0 }
    })
  )
  const totalPending = pendingCounts.reduce((s, c) => s + c.count, 0)

  const { count: totalHODs } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'hod')
  const { count: totalDepts } = await supabase.from('departments').select('*', { count: 'exact', head: true })

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Principal Dashboard
        </h1>
        <p className="text-stone-500 text-sm mt-0.5">SSJCOE Folio — Content Management Overview</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
          <Clock className="w-5 h-5 text-amber-600 mb-3" />
          <div className="text-3xl font-bold text-amber-700 tabular-nums" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{totalPending}</div>
          <div className="text-stone-500 text-sm mt-1">Pending approvals</div>
          <Link href="/superadmin/approvals" className="text-xs text-[#E8820C] hover:underline mt-2 inline-block">Review all →</Link>
        </div>
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
          <Users className="w-5 h-5 text-stone-500 mb-3" />
          <div className="text-3xl font-bold text-stone-700 tabular-nums" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{totalHODs}</div>
          <div className="text-stone-500 text-sm mt-1">Active HODs</div>
          <Link href="/superadmin/users" className="text-xs text-[#E8820C] hover:underline mt-2 inline-block">Manage →</Link>
        </div>
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
          <Building2 className="w-5 h-5 text-stone-500 mb-3" />
          <div className="text-3xl font-bold text-stone-700 tabular-nums" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{totalDepts}</div>
          <div className="text-stone-500 text-sm mt-1">Departments</div>
          <Link href="/superadmin/departments" className="text-xs text-[#E8820C] hover:underline mt-2 inline-block">View all →</Link>
        </div>
      </div>

      {/* Pending breakdown */}
      {totalPending > 0 && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="text-stone-800 font-medium text-sm">Pending by Section</h2>
          </div>
          <div className="divide-y divide-stone-100">
            {pendingCounts.filter(c => c.count > 0).map(({ table, count }) => (
              <div key={table} className="flex items-center justify-between px-5 py-3">
                <span className="text-stone-600 text-sm capitalize">{table.replace('_', ' ')}</span>
                <div className="flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2.5 py-0.5 rounded-full">{count} pending</span>
                  <Link href="/superadmin/approvals" className="text-xs text-[#E8820C] hover:underline">Review →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
