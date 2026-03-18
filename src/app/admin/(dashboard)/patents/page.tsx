import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import PatentsAdminClient from '@/components/admin/PatentsAdminClient'

export default async function AdminPatentsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles').select('*, departments(name, code)').eq('id', user.id).single()
  if (!profile) redirect('/admin/login')

  const { data: patents } = await supabase
    .from('patents').select('*').eq('dept_id', profile.dept_id).order('created_at', { ascending: false })

  return <PatentsAdminClient patents={patents ?? []} profile={profile} />
}
