import { getAllCourses } from '@/lib/courses'
import Link from 'next/link'
import { BookOpen, Clock, ChevronRight, Video, FileText, HelpCircle, Plus } from 'lucide-react'

export default function ContentPage() {
  const courses = getAllCourses()

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Course Content</h1>
          <p className="text-slate-500 text-sm mt-1">Manage videos, resources and quizzes for each programme</p>
        </div>
        <Link
          href="/admin-portal/content/new"
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> New Course
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(course => (
          <Link
            key={course.slug}
            href={`/admin-portal/content/${course.slug}`}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-sky-300 hover:shadow-md transition-all group flex flex-col"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-sky-600" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Level {course.level}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1 group-hover:text-sky-700 transition-colors">
              {course.title}
            </h3>
            <p className="text-xs text-slate-400 mb-4 line-clamp-2">{course.tagline}</p>

            <div className="mt-auto pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="w-3 h-3" /> {course.modules.length} modules
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500 transition-colors" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                {[
                  { icon: Video, label: 'Videos', count: course.modules.length },
                  { icon: FileText, label: 'Resources', count: course.modules.reduce((a, m) => a + m.resources.length, 0) },
                  { icon: HelpCircle, label: 'Quizzes', count: '—' },
                ].map(({ icon: Icon, label, count }) => (
                  <div key={label} className="flex-1 bg-slate-50 rounded-lg px-2 py-1.5 text-center">
                    <div className="text-xs font-bold text-slate-700">{count}</div>
                    <div className="text-[10px] text-slate-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
