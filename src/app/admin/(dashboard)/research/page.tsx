import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import ResearchAdminClient from '@/components/admin/ResearchAdminClient'

export default async function AdminResearchPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles').select('*, departments(name, code)').eq('id', user.id).single()
  if (!profile) redirect('/admin/login')

  const { data: papers } = await supabase
    .from('research_papers').select('*').eq('dept_id', profile.dept_id).order('created_at', { ascending: false })

  return <ResearchAdminClient papers={papers ?? []} profile={profile} />
}
