import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import EventsAdminClient from '@/components/admin/EventsAdminClient'

export default async function AdminEventsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, departments(name, code)')
    .eq('id', user.id)
    .single()
  if (!profile) redirect('/admin/login')

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('dept_id', profile.dept_id)
    .order('date', { ascending: false })

  return <EventsAdminClient events={events ?? []} profile={profile} />
}
