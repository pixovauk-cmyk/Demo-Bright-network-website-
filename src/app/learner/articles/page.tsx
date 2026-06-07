import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCourseBySlug } from '@/lib/courses'
import { Newspaper, ExternalLink, Clock } from 'lucide-react'

export default async function ArticlesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_slug')
    .eq('user_id', user.id)

  const sectors = [...new Set(
    (enrollments ?? [])
      .map(e => getCourseBySlug(e.course_slug)?.sector)
      .filter(Boolean) as string[]
  )]

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .in('sector', sectors.length > 0 ? sectors : ['business'])
    .order('indexed_at', { ascending: false })
    .limit(30)

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Industry News</h1>
        <p className="text-slate-500 text-sm mt-1">
          Latest articles from your field — updated every Monday
        </p>
        {sectors.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {sectors.map(s => (
              <span key={s} className="text-xs font-medium text-sky-700 bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-full capitalize">
                {s.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        )}
      </div>

      {(articles ?? []).length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Newspaper className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">No articles indexed yet</p>
          <p className="text-slate-400 text-xs mt-1">Articles are fetched every Monday. Ask your admin to trigger a refresh.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(articles ?? []).map(article => (
            <article key={article.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-sky-200 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded capitalize">
                      {article.sector.replace(/-/g, ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400">{article.source}</span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      {new Date(article.indexed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>

                  <h2 className="font-bold text-slate-900 text-sm mb-1 leading-snug">{article.title}</h2>
                  <p className="text-slate-500 text-xs mb-3">{article.summary}</p>

                  {Array.isArray(article.bullet_points) && article.bullet_points.length > 0 && (
                    <ul className="space-y-1">
                      {(article.bullet_points as string[]).map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <span className="text-sky-500 font-bold mt-0.5 flex-shrink-0">→</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {article.url && (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-100 px-3 py-1.5 rounded-xl transition-colors flex-shrink-0"
                  >
                    Read <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
