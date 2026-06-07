import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCourses, getCourseBySlug } from "@/lib/courses";
import { getLevelLabel, getLevelColor } from "@/lib/utils";
import VideoPlayer from "@/components/VideoPlayer";
import MarkCompleteButton from "@/components/MarkCompleteButton";
import {
  ChevronRight,
  Clock,
  CheckCircle,
  FileText,
  ArrowLeft,
  ArrowRight,
  PlayCircle,
  Lock,
  BookOpen,
  Download,
  Target,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string; moduleSlug: string }>;
}

export async function generateStaticParams() {
  const courses = getAllCourses();
  return courses.flatMap((c) =>
    (c.modules ?? []).map((m) => ({ slug: c.slug, moduleSlug: m.slug }))
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug, moduleSlug } = await params;
  const course = getCourseBySlug(slug);
  const mod = course?.modules.find((m) => m.slug === moduleSlug);
  if (!course || !mod) return {};
  return {
    title: `${mod.title} | ${course.title} | BrightPeak`,
    description: mod.description,
  };
}

export default async function ModulePage({ params }: Props) {
  const { slug, moduleSlug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const modIndex = course.modules.findIndex((m) => m.slug === moduleSlug);
  if (modIndex === -1) notFound();

  const mod = course.modules[modIndex];
  const prevMod = modIndex > 0 ? course.modules[modIndex - 1] : null;
  const nextMod = modIndex < course.modules.length - 1 ? course.modules[modIndex + 1] : null;
  const progress = Math.round(((modIndex + 1) / course.modules.length) * 100);
  const isLast = !nextMod;

  return (
    <div className="bg-[#F4F6FF] min-h-screen">

      {/* ── Fixed progress header ── */}
      <div className="fixed top-[56px] left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 min-w-0">
            <Link href="/courses" className="hover:text-slate-700 transition-colors whitespace-nowrap hidden sm:block">
              All Programmes
            </Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0 hidden sm:block" />
            <Link href={`/courses/${slug}`} className="hover:text-slate-700 transition-colors truncate max-w-36 sm:max-w-48">
              {course.title}
            </Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-slate-700 font-medium truncate max-w-28 sm:max-w-56">{mod.title}</span>
          </nav>

          <div className="hidden sm:flex items-center gap-3 flex-shrink-0 ml-4">
            <span className="text-xs text-slate-400 font-medium">
              {modIndex + 1} of {course.modules.length}
            </span>
            <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-bold text-sky-600">{progress}%</span>
          </div>
        </div>
        {/* Thin indigo progress line at base of header */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-sky-600 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* ── Page body ── */}
      <div className="pt-[112px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-6">

            {/* ── Sidebar ── */}
            <aside className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-[124px] card-bold rounded-2xl overflow-hidden">

                {/* Course header */}
                <div className="p-4 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
                  <Link
                    href={`/courses/${slug}`}
                    className="inline-flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-800 mb-3 font-medium transition-colors"
                  >
                    <BookOpen className="w-3 h-3" />
                    Back to course
                  </Link>
                  <h3 className="text-slate-900 font-bold text-sm leading-snug">{course.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getLevelColor(course.level)}`}>
                      {getLevelLabel(course.level)}
                    </span>
                    <span className="text-slate-400 text-[10px]">{course.duration}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Progress</span>
                      <span className="text-sky-600 font-bold">{progress}%</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-600 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>

                {/* Module list */}
                <div className="p-2 max-h-[52vh] overflow-y-auto">
                  {course.modules.map((m, i) => {
                    const isActive = m.slug === moduleSlug;
                    const isDone = i < modIndex;
                    return (
                      <Link
                        key={m.slug}
                        href={`/courses/${slug}/modules/${m.slug}`}
                        className={`flex items-start gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-150 ${
                          isActive
                            ? "bg-sky-50 border border-sky-100"
                            : "hover:bg-slate-50 border border-transparent"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isActive ? "bg-sky-600 text-white" :
                          isDone ? "bg-emerald-100 text-emerald-600" :
                          "bg-slate-100 text-slate-400"
                        } text-[10px] font-bold`}>
                          {isDone ? (
                            <CheckCircle className="w-3.5 h-3.5" />
                          ) : isActive ? (
                            <PlayCircle className="w-3.5 h-3.5" />
                          ) : (
                            String(i + 1)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-medium leading-snug line-clamp-2 ${
                            isActive ? "text-sky-700" : isDone ? "text-slate-500" : "text-slate-600"
                          }`}>
                            {m.title}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-400">
                            <Clock className="w-2.5 h-2.5" /> {m.duration}
                          </div>
                        </div>
                        {!isActive && !isDone && i > modIndex && (
                          <Lock className="w-3 h-3 text-slate-300 flex-shrink-0 mt-1" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* ── Main content ── */}
            <div className="lg:col-span-3 order-1 lg:order-2 space-y-4">

              {/* Module intro card */}
              <div className="card-bold rounded-2xl overflow-hidden">
                <div className="px-6 pt-6 pb-5 border-b border-[#040B18]/6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-sky-600 px-3 py-1.5 rounded-full">
                      Module {modIndex + 1} of {course.modules.length}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3 h-3" /> {mod.duration}
                    </span>
                    {isLast && (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                        Final Module
                      </span>
                    )}
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                    {mod.title}
                  </h1>
                </div>
                <div className="px-6 py-4">
                  <p className="text-slate-500 text-sm leading-relaxed">{mod.description}</p>
                </div>
              </div>

              {/* Video player — cinematic dark container */}
              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-900/20">
                <VideoPlayer videoUrl={mod.videoUrl} title={mod.title} />
              </div>

              {/* Two-col: takeaways + resources */}
              <div className={`grid gap-4 ${mod.resources.length > 0 ? "sm:grid-cols-2" : "grid-cols-1"}`}>

                {/* Key takeaways */}
                <div className="card-bold rounded-2xl p-6">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h3 className="font-display text-slate-900 font-bold text-base">Key Takeaways</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      `Understand the core concepts in ${mod.title}`,
                      "Apply learning in your workplace from the next working day",
                      "Complete the reflection activity to evidence off-the-job hours",
                      "Book a catch-up with your tutor if anything is unclear",
                    ].map((t, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                {mod.resources.length > 0 && (
                  <div className="card-bold rounded-2xl p-6">
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-sky-600" />
                      </div>
                      <h3 className="font-display text-slate-900 font-bold text-base">Module Resources</h3>
                    </div>
                    <div className="space-y-2">
                      {mod.resources.map((r, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50/40 transition-all cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:border-sky-200 transition-colors">
                            <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500 transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-slate-800 text-xs font-semibold line-clamp-1 group-hover:text-sky-700 transition-colors">{r}</div>
                            <div className="text-slate-400 text-[10px] flex items-center gap-1 mt-0.5">
                              <Download className="w-2.5 h-2.5" /> PDF
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Prev / Next navigation ── */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                {prevMod ? (
                  <Link
                    href={`/courses/${slug}/modules/${prevMod.slug}`}
                    className="flex items-center gap-3 card-bold rounded-2xl px-4 py-4 hover:border-[#040B18]/25 hover:shadow-md transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#F4F6FF] border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-100 transition-colors">
                      <ArrowLeft className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-slate-400 text-xs mb-0.5">Previous</div>
                      <div className="text-slate-800 text-sm font-semibold line-clamp-1">{prevMod.title}</div>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {nextMod ? (
                  <Link
                    href={`/courses/${slug}/modules/${nextMod.slug}`}
                    className="flex items-center justify-end gap-3 bg-sky-600 rounded-2xl border border-sky-700 shadow-md px-4 py-4 hover:bg-sky-700 transition-all group text-right"
                  >
                    <div className="min-w-0">
                      <div className="text-sky-200 text-xs mb-0.5">Next Module</div>
                      <div className="text-white text-sm font-semibold line-clamp-1">{nextMod.title}</div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 group-hover:bg-white/25 transition-colors">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </Link>
                ) : (
                  <Link
                    href={`/courses/${slug}`}
                    className="flex items-center justify-end gap-3 bg-emerald-600 rounded-2xl border border-emerald-700 shadow-md px-4 py-4 hover:bg-emerald-700 transition-all group text-right"
                  >
                    <div className="min-w-0">
                      <div className="text-emerald-200 text-xs mb-0.5">Programme Complete</div>
                      <div className="text-white text-sm font-bold">View your certificate</div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </Link>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      <MarkCompleteButton
        courseSlug={slug}
        moduleSlug={moduleSlug}
        totalModules={course.modules.length}
      />
    </div>
  );
}
