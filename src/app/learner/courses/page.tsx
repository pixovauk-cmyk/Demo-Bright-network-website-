import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAllCourses } from '@/lib/courses'
import { Clock, BookOpen, CheckCircle, Lock } from 'lucide-react'

export default async function BrowseCoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_slug')
    .eq('user_id', user.id)

  const enrolledSlugs = new Set((enrollments ?? []).map(e => e.course_slug))
  const courses = getAllCourses()

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Browse Programmes</h1>
        <p className="text-slate-500 text-sm mt-1">Enrol onto an apprenticeship programme</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 mb-6 flex items-center gap-2 text-sm text-amber-800">
        <Lock className="w-4 h-4 flex-shrink-0" />
        Enrolment is managed by your administrator. Contact them to be enrolled on a programme.
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(course => {
          const isEnrolled = enrolledSlugs.has(course.slug)
          return (
            <div key={course.slug} className={`bg-white rounded-2xl border p-5 flex flex-col ${isEnrolled ? 'border-sky-200' : 'border-slate-200'}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded">
                    Level {course.level}
                  </span>
                  {isEnrolled && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                      <CheckCircle className="w-2.5 h-2.5" /> Enrolled
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1 leading-snug">{course.title}</h3>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{course.tagline}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> {course.modules.length} modules
                  </span>
                </div>
              </div>

              {isEnrolled && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <a
                    href={`/courses/${course.slug}/modules/${course.modules[0]?.slug}`}
                    className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                  >
                    Go to course
                  </a>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
