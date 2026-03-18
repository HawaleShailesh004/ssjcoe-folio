import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function SuperAdminDepartmentsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: departments } = await supabase
    .from('departments')
    .select('*')
    .order('code')

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Departments</h1>
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 text-stone-400 text-xs uppercase tracking-wide border-b border-stone-100">
              <th className="text-left px-5 py-3 font-medium">Code</th>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {(departments ?? []).map((d: { id: string; code: string; name: string; is_active: boolean }) => (
              <tr key={d.id} className="hover:bg-stone-50">
                <td className="px-5 py-3.5 font-mono text-stone-700">{d.code}</td>
                <td className="px-4 py-3.5 text-stone-700">{d.name}</td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>{d.is_active ? 'Yes' : 'No'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
