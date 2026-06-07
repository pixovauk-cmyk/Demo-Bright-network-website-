'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BookOpen, LayoutDashboard, LogOut, FileText, Newspaper } from 'lucide-react'

interface Props {
  fullName: string
  email: string
}

export default function LearnerNav({ fullName, email }: Props) {
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/learner" className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <div className="w-7 h-7 bg-sky-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            BrightPeak
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            <Link
              href="/learner"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <Link
              href="/learner/courses"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Browse Courses
            </Link>
            <Link
              href="/learner/cv"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              CV Builder
            </Link>
            <Link
              href="/learner/articles"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <Newspaper className="w-3.5 h-3.5" />
              Industry News
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-semibold text-slate-800">{fullName || email}</div>
            <div className="text-[10px] text-slate-400">Learner</div>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  )
}
