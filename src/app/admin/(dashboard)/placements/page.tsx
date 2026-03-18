import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import PlacementsAdminClient from '@/components/admin/PlacementsAdminClient'

export default async function AdminPlacementsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, departments(name, code)')
    .eq('id', user.id)
    .single()
  if (!profile) redirect('/admin/login')

  const { data: placements } = await supabase
    .from('placements')
    .select('*')
    .eq('dept_id', profile.dept_id)
    .order('created_at', { ascending: false })

  return <PlacementsAdminClient placements={placements ?? []} profile={profile} />
}
