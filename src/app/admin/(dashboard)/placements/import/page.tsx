import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import BulkImportClient from '@/components/admin/BulkImportClient'

export default async function ImportPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles').select('*, departments(name, code)').eq('id', user.id).single()
  if (!profile) redirect('/admin/login')

  return <BulkImportClient profile={profile} />
}
