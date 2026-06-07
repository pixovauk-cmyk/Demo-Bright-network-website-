import { createAdminClient } from '@/lib/supabase/admin-client'
import { getCourseBySlug } from '@/lib/courses'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import UnenrolButton from '@/components/UnenrolButton'
import {
  ArrowLeft, CheckCircle, Clock, BookOpen, Award,
  Mail, User, Calendar, AlertTriangle
} from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default async function LearnerDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: learner } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('id', id)
    .single()

  if (!learner || learner.role !== 'learner') notFound()

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_slug, enrolled_at, completed_at')
    .eq('user_id', id)
    .order('enrolled_at', { ascending: false })

  const { data: progress } = await supabase
    .from('module_progress')
    .select('course_slug, module_slug, completed_at')
    .eq('user_id', id)

  const totalCompleted = (enrollments ?? []).filter(e => e.completed_at).length
  const totalModulesDone = (progress ?? []).length

  // Auth user info (last sign in)
  const { data: { users } } = await supabase.auth.admin.listUsers()
  const authUser = users?.find(u => u.id === id)
  const lastSignIn = authUser?.last_sign_in_at

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Back */}
      <Link
        href="/admin-portal/learners"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> All users
      </Link>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sky-700 font-black text-xl">
                {(learner.full_name || learner.email || '?')[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{learner.full_name || 'No name set'}</h1>
              <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                {learner.email}
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-sky-600 bg-sky-50 border border-sky-100 px-3 py-1 rounded-full">
            Learner
          </span>
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">
          {[
            { icon: BookOpen, label: 'Enrolled', value: (enrollments ?? []).length },
            { icon: Award, label: 'Completed', value: totalCompleted },
            { icon: CheckCircle, label: 'Modules done', value: totalModulesDone },
            {
              icon: Calendar,
              label: 'Last login',
              value: lastSignIn
                ? new Date(lastSignIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'Never',
            },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label}>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Icon className="w-3.5 h-3.5" /> {label}
              </div>
              <div className="text-base font-bold text-slate-900">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Courses */}
      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Enrolled Courses</h2>

      {(enrollments ?? []).length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">Not enrolled on any course yet.</p>
          <Link
            href={`/admin-portal/enrol`}
            className="inline-flex items-center gap-1.5 mt-4 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" /> Enrol on a course
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {(enrollments ?? []).map(enrol => {
            const course = getCourseBySlug(enrol.course_slug)
            if (!course) return null

            const courseProgress = (progress ?? []).filter(p => p.course_slug === enrol.course_slug)
            const completedSlugs = new Set(courseProgress.map(p => p.module_slug))
            const completedCount = completedSlugs.size
            const totalModules = course.modules.length
            const pct = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0
            const isDone = enrol.completed_at !== null
            const daysSinceEnrol = Math.floor((Date.now() - new Date(enrol.enrolled_at).getTime()) / 86400000)
            const isAtRisk = !isDone && completedCount === 0 && daysSinceEnrol >= 5

            return (
              <div key={enrol.course_slug} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                {/* Course header */}
                <div className="px-6 py-4 border-b border-slate-100">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-slate-900">{course.title}</h3>
                        {isDone && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                            <Award className="w-3 h-3" /> Completed
                          </span>
                        )}
                        {isAtRisk && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" /> At risk
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>Level {course.level} · {course.duration}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Enrolled {new Date(enrol.enrolled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        {isDone && enrol.completed_at && (
                          <span className="flex items-center gap-1 text-emerald-600">
                            <CheckCircle className="w-3 h-3" />
                            Completed {new Date(enrol.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                    <UnenrolButton userId={id} courseSlug={enrol.course_slug} />
                  </div>

                  {/* Progress bar */}
                  <div className="flex items-center gap-3 mt-4">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isDone ? 'bg-emerald-500' : 'bg-sky-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold flex-shrink-0 ${isDone ? 'text-emerald-600' : 'text-sky-600'}`}>
                      {pct}%
                    </span>
                    <span className="text-xs text-slate-400 flex-shrink-0">
                      {completedCount}/{totalModules} modules
                    </span>
                  </div>
                </div>

                {/* Module breakdown */}
                <div className="p-4 grid sm:grid-cols-2 gap-2">
                  {course.modules.map((mod, i) => {
                    const done = completedSlugs.has(mod.slug)
                    const moduleProgress = courseProgress.find(p => p.module_slug === mod.slug)
                    return (
                      <div
                        key={mod.slug}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${
                          done ? 'border-emerald-100 bg-emerald-50' : 'border-slate-100 bg-slate-50'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                          done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {done ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-medium truncate ${done ? 'text-emerald-800' : 'text-slate-500'}`}>
                            {mod.title}
                          </div>
                          {done && moduleProgress?.completed_at && (
                            <div className="text-[10px] text-emerald-500 flex items-center gap-1 mt-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {new Date(moduleProgress.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
