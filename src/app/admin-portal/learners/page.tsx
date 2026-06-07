import { createAdminClient } from '@/lib/supabase/admin-client'
import { getCourseBySlug } from '@/lib/courses'
import UnenrolButton from '@/components/UnenrolButton'
import Link from 'next/link'
import { CheckCircle, Clock, BookOpen, User, Shield, ChevronRight } from 'lucide-react'

export default async function LearnersPage() {
  const supabase = createAdminClient()

  const { data: learners } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .in('role', ['learner', 'admin'])
    .order('role')
    .order('full_name')

  const { data: allEnrollments } = await supabase
    .from('enrollments')
    .select('user_id, course_slug, enrolled_at, completed_at')

  const { data: allProgress } = await supabase
    .from('module_progress')
    .select('user_id, course_slug, module_slug')

  const learnerProfiles = (learners ?? []).filter(l => l.role === 'learner')
  const adminProfiles = (learners ?? []).filter(l => l.role === 'admin')

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <p className="text-slate-500 text-sm mt-1">
          {learnerProfiles.length} learner{learnerProfiles.length !== 1 ? 's' : ''} · {adminProfiles.length} admin{adminProfiles.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Admin team */}
      {adminProfiles.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Admin Team</h2>
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-50">
            {adminProfiles.map(admin => (
              <div key={admin.id} className="px-6 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{admin.full_name || '—'}</div>
                  <div className="text-xs text-slate-400">{admin.email}</div>
                </div>
                <span className="ml-auto text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">Admin</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learners */}
      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Learners</h2>
      {learnerProfiles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <User className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No learners yet. Invite one to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {learnerProfiles.map(learner => {
            const learnerEnrolments = (allEnrollments ?? []).filter(e => e.user_id === learner.id)
            const learnerProgress = (allProgress ?? []).filter(p => p.user_id === learner.id)
            const daysSinceLastActivity = learnerEnrolments.length > 0
              ? Math.floor((Date.now() - new Date(learnerEnrolments[0].enrolled_at).getTime()) / 86400000)
              : null

            return (
              <div key={learner.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <Link href={`/admin-portal/learners/${learner.id}`} className="flex items-center gap-3 flex-1 min-w-0 group">
                    <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sky-700 font-bold text-sm">
                        {(learner.full_name || learner.email || '?')[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 text-sm group-hover:text-sky-700 transition-colors flex items-center gap-1">
                        {learner.full_name || '—'}
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-500 transition-colors" />
                      </div>
                      <div className="text-xs text-slate-400">{learner.email}</div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-4 text-xs text-slate-500 flex-shrink-0">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {learnerEnrolments.length} course{learnerEnrolments.length !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {learnerEnrolments.filter(e => e.completed_at).length} complete
                    </span>
                    {learnerEnrolments.length > 0 && learnerProgress.length === 0 && daysSinceLastActivity !== null && daysSinceLastActivity > 3 && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                        At risk
                      </span>
                    )}
                  </div>
                </div>

                {learnerEnrolments.length === 0 ? (
                  <div className="px-6 py-4 text-xs text-slate-400">Not enrolled on any course yet</div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {learnerEnrolments.map(enrol => {
                      const course = getCourseBySlug(enrol.course_slug)
                      if (!course) return null

                      const completed = new Set(
                        learnerProgress
                          .filter(p => p.course_slug === enrol.course_slug)
                          .map(p => p.module_slug)
                      ).size
                      const total = course.modules.length
                      const pct = total > 0 ? Math.round((completed / total) * 100) : 0
                      const isDone = enrol.completed_at !== null

                      return (
                        <div key={enrol.course_slug} className="px-6 py-3.5 flex items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-800 truncate">{course.title}</div>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${isDone ? 'bg-emerald-500' : 'bg-sky-500'}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className={`text-xs font-semibold ${isDone ? 'text-emerald-600' : 'text-sky-600'}`}>{pct}%</span>
                              <span className="text-xs text-slate-400">{completed}/{total} modules</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {isDone ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
                                <CheckCircle className="w-3 h-3" /> Completed
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg">
                                <Clock className="w-3 h-3" /> In progress
                              </span>
                            )}
                            <UnenrolButton userId={learner.id} courseSlug={enrol.course_slug} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
