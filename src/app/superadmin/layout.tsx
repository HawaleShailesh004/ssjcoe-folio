import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminFooter from '@/components/admin/AdminFooter'

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, departments(name, code)')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'superadmin') redirect('/admin/dashboard')

  return (
    <div className="min-h-screen bg-stone-100 flex">
      <AdminSidebar profile={profile} />
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <AdminHeader profile={profile} />
        <main className="flex-1 min-h-0 p-6 overflow-auto">
          {children}
        </main>
        <AdminFooter />
      </div>
    </div>
  )
}
