import { getCourseBySlug } from '@/lib/courses'
import { createAdminClient } from '@/lib/supabase/admin-client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ModuleCard from './ModuleCard'
import AddModuleButton from './AddModuleButton'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CourseContentPage({ params }: Props) {
  const { slug } = await params
  const course = getCourseBySlug(slug)
  if (!course) notFound()

  const supabase = createAdminClient()
  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('*')
    .eq('course_slug', slug)
    .order('created_at')

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link
        href="/admin-portal/content"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> All courses
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded">
            Level {course.level}
          </span>
          <span className="text-xs text-slate-400">{course.duration}</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
        <p className="text-slate-500 text-sm mt-1">{course.tagline}</p>
      </div>

      <div className="space-y-4">
        {course.modules.map((mod, index) => {
          const moduleQuizzes = (quizzes ?? []).filter(q => q.module_slug === mod.slug)
          return (
            <ModuleCard
              key={mod.slug}
              courseSlug={slug}
              module={mod}
              index={index}
              quizzes={moduleQuizzes}
            />
          )
        })}
        <AddModuleButton courseSlug={slug} nextIndex={course.modules.length + 1} />
      </div>
    </div>
  )
}
