'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, LogOut } from 'lucide-react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import type { Profile } from '@/types'

interface Props {
  profile: Profile
}

const roleLabelMap: Record<string, { label: string; color: string }> = {
  hod:        { label: 'HOD',       color: 'bg-[#E8820C]/15 text-[#E8820C] border-[#E8820C]/30' },
  superadmin: { label: 'Principal', color: 'bg-stone-800 text-stone-300 border-stone-700' },
}

export default function AdminHeader({ profile }: Props) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const roleStyle = roleLabelMap[profile.role] ?? roleLabelMap.hod

  return (
    <header className="h-14 bg-white border-b border-stone-200 flex items-center justify-between px-6 shrink-0" role="banner">
      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${roleStyle.color}`}>
          {roleStyle.label}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 text-xs px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View site
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-stone-500 hover:text-red-600 text-xs px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          aria-label="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </header>
  )
}
