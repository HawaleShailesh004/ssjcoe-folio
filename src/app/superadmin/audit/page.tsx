import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AuditClient from '@/components/admin/AuditClient'

export default async function AuditPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: logs } = await supabase
    .from('audit_log')
    .select('*, profiles!actor_id(full_name, email)')
    .order('timestamp', { ascending: false })
    .limit(200)

  return <AuditClient logs={logs ?? []} />
}
