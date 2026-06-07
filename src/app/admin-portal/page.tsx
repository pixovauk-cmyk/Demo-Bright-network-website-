import { createAdminClient } from '@/lib/supabase/admin-client'
import { getAllCourses, getCourseBySlug } from '@/lib/courses'
import Link from 'next/link'
import { Users, BookOpen, Award, TrendingUp, ArrowRight, Clock, AlertTriangle, UserPlus } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  const [
    { data: learners },
    { data: admins },
    { data: enrollments },
    { data: progress },
  ] = await Promise.all([
    supabase.from('profiles').select('id, full_name, email').eq('role', 'learner'),
    supabase.from('profiles').select('id').eq('role', 'admin'),
    supabase.from('enrollments').select('id, user_id, course_slug, enrolled_at, completed_at').order('enrolled_at', { ascending: false }),
    supabase.from('module_progress').select('user_id, course_slug, module_slug'),
  ])

  const totalLearners = learners?.length ?? 0
  const totalEnrollments = enrollments?.length ?? 0
  const completions = (enrollments ?? []).filter(e => e.completed_at)
  const completionRate = totalEnrollments > 0 ? Math.round((completions.length / totalEnrollments) * 100) : 0

  // At-risk: enrolled 5+ days ago, zero progress
  const now = Date.now()
  const atRisk = (enrollments ?? []).filter(e => {
    if (e.completed_at) return false
    const daysSince = (now - new Date(e.enrolled_at).getTime()) / 86400000
    if (daysSince < 5) return false
    const hasProgress = (progress ?? []).some(
      p => p.user_id === e.user_id && p.course_slug === e.course_slug
    )
    return !hasProgress
  })

  // Course breakdown
  const courses = getAllCourses()
  const courseStats = courses.map(c => {
    const enrolled = (enrollments ?? []).filter(e => e.course_slug === c.slug)
    const done = enrolled.filter(e => e.completed_at).length
    return { course: c, enrolled: enrolled.length, completed: done }
  }).filter(s => s.enrolled > 0).sort((a, b) => b.enrolled - a.enrolled)

  const learnerMap = new Map((learners ?? []).map(l => [l.id, l]))

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">{admins?.length ?? 0} admin{(admins?.length ?? 0) !== 1 ? 's' : ''} · {totalLearners} learner{totalLearners !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin-portal/invite" className="flex items-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
            <UserPlus className="w-3.5 h-3.5" /> Invite
          </Link>
          <Link href="/admin-portal/enrol" className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
            <BookOpen className="w-3.5 h-3.5" /> Enrol
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Learners', value: totalLearners, icon: Users, color: 'text-sky-600 bg-sky-50 border-sky-100' },
          { label: 'Enrolments', value: totalEnrollments, icon: BookOpen, color: 'text-violet-600 bg-violet-50 border-violet-100' },
          { label: 'Completions', value: completions.length, icon: Award, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Completion Rate', value: `${completionRate}%`, icon: TrendingUp, color: 'text-amber-600 bg-amber-50 border-amber-100' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* At-risk alert */}
          {atRisk.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h2 className="font-bold text-red-800 text-sm">{atRisk.length} learner{atRisk.length !== 1 ? 's' : ''} at risk — no progress in 5+ days</h2>
              </div>
              <div className="space-y-2">
                {atRisk.slice(0, 4).map((e, i) => {
                  const learner = learnerMap.get(e.user_id)
                  const course = getCourseBySlug(e.course_slug)
                  return (
                    <div key={i} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 border border-red-100">
                      <div>
                        <div className="text-sm font-medium text-slate-800">{learner?.full_name || learner?.email}</div>
                        <div className="text-xs text-slate-400">{course?.title}</div>
                      </div>
                      <span className="text-xs text-red-500 font-medium">
                        {Math.floor((now - new Date(e.enrolled_at).getTime()) / 86400000)}d idle
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Recent enrolments */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-sm">Recent Enrolments</h2>
              <Link href="/admin-portal/learners" className="text-xs text-sky-600 hover:underline font-medium flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {(enrollments ?? []).length === 0 ? (
                <div className="px-6 py-8 text-center text-slate-400 text-sm">No enrolments yet</div>
              ) : (
                (enrollments ?? []).slice(0, 6).map((e, i) => {
                  const learner = learnerMap.get(e.user_id)
                  const course = getCourseBySlug(e.course_slug)
                  const pct = (() => {
                    if (!course) return 0
                    const done = (progress ?? []).filter(p => p.user_id === e.user_id && p.course_slug === e.course_slug).length
                    return Math.round((done / course.modules.length) * 100)
                  })()
                  return (
                    <div key={i} className="px-6 py-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 text-sky-700 font-bold text-xs">
                          {(learner?.full_name || learner?.email || '?')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-800 truncate">{learner?.full_name || learner?.email}</div>
                          <div className="text-xs text-slate-400 truncate">{course?.title}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="hidden sm:flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : 'bg-sky-500'}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-slate-500 font-medium">{pct}%</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="w-3 h-3" />
                          {new Date(e.enrolled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-sm">Quick Actions</h2>
            </div>
            {[
              { href: '/admin-portal/enrol', icon: BookOpen, label: 'Enrol a Learner', color: 'text-sky-600 bg-sky-50' },
              { href: '/admin-portal/invite', icon: UserPlus, label: 'Invite Learner / Admin', color: 'text-violet-600 bg-violet-50' },
              { href: '/admin-portal/learners', icon: TrendingUp, label: 'Track Progress', color: 'text-emerald-600 bg-emerald-50' },
            ].map(({ href, icon: Icon, label, color }) => (
              <Link key={href} href={href} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 ml-auto transition-colors" />
              </Link>
            ))}
          </div>

          {/* Course breakdown */}
          {courseStats.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100">
                <h2 className="font-bold text-slate-900 text-sm">Courses</h2>
              </div>
              <div className="divide-y divide-slate-50">
                {courseStats.map(({ course, enrolled, completed }) => (
                  <div key={course.slug} className="px-5 py-3.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-slate-700 truncate max-w-[160px]">{course.title}</span>
                      <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{enrolled} enrolled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: enrolled > 0 ? `${Math.round((completed / enrolled) * 100)}%` : '0%' }}
                        />
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold flex-shrink-0">
                        {completed}/{enrolled} done
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
