import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AchievementsAdminClient from '@/components/admin/AchievementsAdminClient'

export default async function AdminAchievementsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, departments(name, code)')
    .eq('id', user.id)
    .single()
  if (!profile) redirect('/admin/login')

  const { data: achievements } = await supabase
    .from('achievements')
    .select('*')
    .eq('dept_id', profile.dept_id)
    .order('date', { ascending: false })

  return <AchievementsAdminClient achievements={achievements ?? []} profile={profile} />
}
