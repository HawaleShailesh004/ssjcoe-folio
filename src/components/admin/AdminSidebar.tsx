'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, BookOpen, Award, Calendar,
  FlaskConical, FileText, GraduationCap, CheckSquare,
  ClipboardList, Building2, ChevronRight
} from 'lucide-react'
import type { Profile } from '@/types'

interface Props {
  profile: Profile & { departments?: { name: string; code: string } | null }
}

const hodNav = [
  { href: '/admin/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/admin/placements',   label: 'Placements',   icon: GraduationCap },
  { href: '/admin/research',     label: 'Research',     icon: BookOpen },
  { href: '/admin/patents',      label: 'Patents',      icon: FileText },
  { href: '/admin/events',       label: 'Events',       icon: Calendar },
  { href: '/admin/achievements', label: 'Achievements', icon: Award },
  { href: '/admin/faculty',      label: 'Faculty',      icon: Users },
]

const superadminNav = [
  { href: '/superadmin/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/superadmin/approvals',   label: 'Approvals',   icon: CheckSquare },
  { href: '/superadmin/departments', label: 'Departments', icon: Building2 },
  { href: '/superadmin/users',       label: 'HOD Accounts',icon: Users },
  { href: '/superadmin/audit',       label: 'Audit Log',   icon: ClipboardList },
]

export default function AdminSidebar({ profile }: Props) {
  const pathname = usePathname()
  const isSuperAdmin = profile.role === 'superadmin'
  const nav = isSuperAdmin ? superadminNav : hodNav

  return (
    <aside className="w-60 max-h-screen sticky top-0 flex flex-col shrink-0 overflow-y-auto bg-stone-950" aria-label="Admin navigation">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#E8820C] rounded flex items-center justify-center shrink-0">
            <span className="font-bold text-white text-sm" style={{ fontFamily: 'Cormorant Garamond, serif' }}>S</span>
          </div>
          <div>
            <div className="text-white text-sm font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              SSJCOE <span className="text-[#E8820C]">FOLIO</span>
            </div>
            <div className="text-stone-600 text-[10px] tracking-widest uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {isSuperAdmin ? 'Principal' : 'HOD Portal'}
            </div>
          </div>
        </div>
      </div>

      {/* Dept badge for HOD */}
      {!isSuperAdmin && profile.departments && (
        <div className="mx-4 mt-4 px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg">
          <div className="text-stone-500 text-[10px] tracking-widest uppercase mb-0.5">Department</div>
          <div className="text-[#E8820C] text-sm font-medium">{profile.departments.name}</div>
          <div className="text-stone-600 text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{profile.departments.code}</div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group ${
                active
                  ? 'bg-[#E8820C]/15 text-[#E8820C]'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3 h-3 opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      <div className="px-4 py-4 border-t border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E8820C]/20 border border-[#E8820C]/30 flex items-center justify-center shrink-0">
            <span className="text-[#E8820C] text-xs font-semibold">
              {profile.full_name?.charAt(0) ?? '?'}
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-stone-300 text-xs font-medium truncate">{profile.full_name ?? 'Unknown'}</div>
            <div className="text-stone-600 text-[10px] truncate">{profile.email}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
