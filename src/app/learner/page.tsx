import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCourseBySlug } from '@/lib/courses'
import Link from 'next/link'
import { BookOpen, CheckCircle, Clock, ArrowRight, Award, PlayCircle, Newspaper, ExternalLink } from 'lucide-react'

export default async function LearnerDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_slug, enrolled_at, completed_at')
    .eq('user_id', user.id)
    .order('enrolled_at', { ascending: false })

  const { data: allProgress } = await supabase
    .from('module_progress')
    .select('course_slug, module_slug')
    .eq('user_id', user.id)

  const enrolledCourses = (enrollments ?? []).map(enrol => {
    const course = getCourseBySlug(enrol.course_slug)
    if (!course) return null

    const completedSlugs = new Set(
      (allProgress ?? [])
        .filter(p => p.course_slug === enrol.course_slug)
        .map(p => p.module_slug)
    )
    const completedCount = completedSlugs.size
    const totalModules = course.modules.length
    const progressPct = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0
    const isComplete = completedCount >= totalModules

    const nextModule = course.modules.find(m => !completedSlugs.has(m.slug))

    return { course, enrol, completedCount, totalModules, progressPct, isComplete, nextModule }
  }).filter(Boolean) as NonNullable<ReturnType<typeof getCourseBySlug> extends null ? never : {
    course: NonNullable<ReturnType<typeof getCourseBySlug>>
    enrol: { course_slug: string; enrolled_at: string; completed_at: string | null }
    completedCount: number
    totalModules: number
    progressPct: number
    isComplete: boolean
    nextModule: { slug: string; title: string } | undefined
  }>[]

  const completedCount = enrolledCourses.filter(e => e.isComplete).length
  const inProgressCount = enrolledCourses.filter(e => !e.isComplete).length

  // Fetch 3 recent articles for the learner's sectors
  const sectors = [...new Set(
    enrolledCourses.map(e => e.course.sector).filter(Boolean) as string[]
  )]
  const { data: recentArticles } = await supabase
    .from('articles')
    .select('id, title, summary, url, source, sector, indexed_at')
    .in('sector', sectors.length > 0 ? sectors : ['business'])
    .order('indexed_at', { ascending: false })
    .limit(3)

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-slate-500 text-sm mt-1">Here&apos;s your learning progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Enrolled', value: enrolledCourses.length, icon: BookOpen, color: 'text-sky-600 bg-sky-50' },
          { label: 'In Progress', value: inProgressCount, icon: PlayCircle, color: 'text-amber-600 bg-amber-50' },
          { label: 'Completed', value: completedCount, icon: Award, color: 'text-emerald-600 bg-emerald-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Enrolled courses */}
      {enrolledCourses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h2 className="text-slate-700 font-semibold mb-1">No courses yet</h2>
          <p className="text-slate-400 text-sm mb-5">Browse our apprenticeship programmes to get started</p>
          <Link
            href="/learner/courses"
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Browse Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">My Courses</h2>
            <Link href="/learner/courses" className="text-xs text-sky-600 hover:underline font-medium">
              Browse more
            </Link>
          </div>
          <div className="space-y-3">
            {enrolledCourses.map(({ course, completedCount, totalModules, progressPct, isComplete, nextModule }) => (
              <div key={course.slug} className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 text-sm">{course.title}</h3>
                      {isComplete && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" /> Complete
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {course.duration}
                      </span>
                      <span>{completedCount} of {totalModules} modules done</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isComplete ? 'bg-emerald-500' : 'bg-sky-600'}`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold ${isComplete ? 'text-emerald-600' : 'text-sky-600'}`}>
                        {progressPct}%
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {isComplete ? (
                      <Link
                        href={`/learner/certificate/${course.slug}`}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                      >
                        <Award className="w-3.5 h-3.5" /> Certificate
                      </Link>
                    ) : nextModule ? (
                      <Link
                        href={`/courses/${course.slug}/modules/${nextModule.slug}`}
                        className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                      >
                        <PlayCircle className="w-3.5 h-3.5" /> Continue
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Industry News widget */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900">Industry News</h2>
          </div>
          <Link href="/learner/articles" className="text-xs text-sky-600 hover:underline font-medium flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {(recentArticles ?? []).length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center">
            <Newspaper className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">Articles are fetched every Monday</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-3">
            {(recentArticles ?? []).map(article => (
              <div key={article.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between hover:border-sky-200 hover:shadow-sm transition-all">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded capitalize">
                      {article.sector?.replace(/-/g, ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400">{article.source}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-xs leading-snug line-clamp-3 mb-2">{article.title}</h3>
                  <p className="text-slate-500 text-[11px] line-clamp-2">{article.summary}</p>
                </div>
                {article.url && (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-1 text-[11px] font-medium text-sky-600 hover:text-sky-800 transition-colors"
                  >
                    Read article <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
