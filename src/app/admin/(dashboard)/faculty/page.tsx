import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import FacultyAdminClient from '@/components/admin/FacultyAdminClient'

export default async function AdminFacultyPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, departments(name, code)')
    .eq('id', user.id)
    .single()
  if (!profile) redirect('/admin/login')

  const { data: faculty } = await supabase
    .from('faculty')
    .select('*')
    .eq('dept_id', profile.dept_id)
    .order('created_at', { ascending: false })

  return <FacultyAdminClient faculty={faculty ?? []} profile={profile} />
}
