'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Shield, Users, BookOpen, UserPlus, LayoutDashboard, LogOut, FolderOpen } from 'lucide-react'

const navItems = [
  { href: '/admin-portal', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin-portal/learners', label: 'Users', icon: Users },
  { href: '/admin-portal/content', label: 'Content', icon: FolderOpen },
  { href: '/admin-portal/enrol', label: 'Enrol', icon: BookOpen },
  { href: '/admin-portal/invite', label: 'Invite', icon: UserPlus },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-sm">
            <div className="w-7 h-7 bg-sky-500 rounded-lg flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            BrightPeak Admin
          </div>
          <nav className="hidden sm:flex items-center gap-0.5">
            {navItems.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    active ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  )
}
