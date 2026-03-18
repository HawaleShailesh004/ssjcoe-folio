import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import ApprovalsClient from '@/components/admin/ApprovalsClient'

export default async function ApprovalsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const TABLES = ['placements', 'research_papers', 'patents', 'events', 'achievements', 'faculty'] as const
  type TableName = typeof TABLES[number]
  type PendingItem = Record<string, unknown> & { _table: TableName; created_at?: string | null; updated_at?: string | null }

  const allPending = await Promise.all(
    TABLES.map(async (table) => {
      const { data } = await supabase
        .from(table)
        .select('*, departments(name, code), profiles!submitted_by(full_name, email)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
      return (data ?? []).map((row: Record<string, unknown>) => ({ ...row, _table: table }) as PendingItem)
    })
  )

  const items = allPending
    .flat()
    .sort((a, b) => {
      const bt = b.created_at ? new Date(b.created_at).getTime() : (b.updated_at ? new Date(b.updated_at).getTime() : 0)
      const at = a.created_at ? new Date(a.created_at).getTime() : (a.updated_at ? new Date(a.updated_at).getTime() : 0)
      return bt - at
    })

  return <ApprovalsClient items={items} reviewerId={user.id} />
}
