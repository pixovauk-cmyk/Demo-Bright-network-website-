"use client";

import Image from "next/image";
import Link from "next/link";
import { useTina, tinaField } from "tinacms/dist/react";
import { getLevelLabel, getLevelColor, getSectorLabel, getSectorIcon } from "@/lib/utils";
import AnimatedSection from "@/components/AnimatedSection";
import EnrollButton from "@/components/EnrollButton";
import type { Course } from "@/lib/courses";
import {
  Clock,
  CheckCircle,
  PlayCircle,
  ArrowRight,
  ChevronRight,
  Award,
  BookOpen,
  Users,
  Star,
  Lock,
  FileText,
} from "lucide-react";

type TinaCourse = {
  title?: string | null;
  level?: string | null;
  sector?: string | null;
  duration?: string | null;
  tagline?: string | null;
  description?: string | null;
  heroImage?: string | null;
  featured?: boolean | null;
  whatYouLearn?: (string | null)[] | null;
  employerBenefits?: (string | null)[] | null;
  modules?: ({
    title?: string | null;
    slug?: string | null;
    duration?: string | null;
    videoUrl?: string | null;
    description?: string | null;
    resources?: (string | null)[] | null;
  } | null)[] | null;
};

interface Props {
  query: string;
  variables: { relativePath: string };
  data: { course: TinaCourse };
  slug: string;
  related: Course[];
}

export default function CoursePageClient({ query, variables, data: initialData, slug, related }: Props) {
  const { data } = useTina({ query, variables, data: initialData });
  const c = data.course;

  const title = c.title ?? "";
  const level = c.level ?? "";
  const heroImage = c.heroImage ?? "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80";
  const tagline = c.tagline ?? "";
  const description = c.description ?? "";
  const duration = c.duration ?? "";
  const sector = c.sector ?? "";
  const whatYouLearn = (c.whatYouLearn ?? []).filter(Boolean) as string[];
  const employerBenefits = (c.employerBenefits ?? []).filter(Boolean) as string[];
  const modules = (c.modules ?? []).filter(Boolean) as NonNullable<NonNullable<TinaCourse["modules"]>[number]>[];

  const totalMinutes = modules.reduce((acc, m) => {
    const match = (m.duration ?? "").match(/(\d+)/);
    return acc + (match ? parseInt(match[1]) : 0);
  }, 0);

  return (
    <div className="bg-[#F4F6FF] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 pt-[56px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-400 py-3.5">
            <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/courses" className="hover:text-slate-700 transition-colors">All Programmes</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-700 font-medium line-clamp-1">{title}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0" data-tina-field={tinaField(data.course, "heroImage")}>
          <Image src={heroImage} alt={title} fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#040B18]/96 via-[#040B18]/88 to-[#040B18]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040B18]/80 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-2xl">
            <AnimatedSection>
              <div className="flex flex-wrap gap-2 mb-5">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${getLevelColor(level)}`}>
                  {getLevelLabel(level)}
                </span>
                <span className="text-xs font-bold px-3 py-1.5 rounded-lg border bg-emerald-900/50 text-emerald-300 border-emerald-700/40">
                  100% Government Funded
                </span>
                <span className="text-xs font-medium px-3 py-1.5 rounded-lg border border-white/15 text-white/60 bg-white/5 backdrop-blur-sm">
                  {getSectorIcon(sector)} {getSectorLabel(sector)}
                </span>
              </div>

              <h1
                className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight"
                data-tina-field={tinaField(data.course, "title")}
              >
                {title}
              </h1>
              <p
                className="text-white/60 text-xl mb-4 font-medium"
                data-tina-field={tinaField(data.course, "tagline")}
              >
                {tagline}
              </p>
              <p
                className="text-white/50 text-base leading-relaxed mb-8 max-w-lg"
                data-tina-field={tinaField(data.course, "description")}
              >
                {description}
              </p>

              <div className="flex flex-wrap gap-5 mb-8 text-sm text-white/55">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400" /> {duration}
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sky-400" /> {modules.length} modules
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-400" /> Employer + learner delivery
                </span>
                <span className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" /> Ofsted Good provider
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                <EnrollButton courseTitle={title} courseLevel={getLevelLabel(level)} label="Enrol on This Programme" className="btn-primary text-base" />
                <EnrollButton courseTitle={title} courseLevel={getLevelLabel(level)} label="Book Free Call" className="btn-outline-dark text-base" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left */}
          <div className="lg:col-span-2 space-y-6">

            <AnimatedSection>
              <div className="card-bold rounded-2xl p-7" data-tina-field={tinaField(data.course, "whatYouLearn")}>
                <h2 className="font-display text-slate-900 font-black text-xl mb-5">What you&apos;ll learn</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {whatYouLearn.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-sm leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="card-bold rounded-2xl p-7">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-slate-900 font-black text-xl">Programme Modules</h2>
                  {totalMinutes > 0 && <span className="text-slate-400 text-xs">~{totalMinutes} min total</span>}
                </div>
                <div className="space-y-2">
                  {modules.map((mod, i) => (
                    <Link
                      key={mod.slug ?? i}
                      href={`/courses/${slug}/modules/${mod.slug ?? i}`}
                      className="group flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50/40 transition-all duration-200"
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-100 text-slate-500 font-bold text-sm group-hover:bg-sky-600 group-hover:text-white transition-all">
                        {i === 0 ? <PlayCircle style={{width:18, height:18}} /> : String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-slate-800 font-semibold text-sm group-hover:text-sky-700 transition-colors line-clamp-1">
                          {mod.title}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-slate-400 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {mod.duration}
                          </span>
                          {(mod.resources ?? []).filter(Boolean).length > 0 && (
                            <span className="text-slate-400 text-xs flex items-center gap-1">
                              <FileText className="w-3 h-3" /> {(mod.resources ?? []).filter(Boolean).length} resources
                            </span>
                          )}
                        </div>
                      </div>
                      {i === 0 ? (
                        <ArrowRight className="w-4 h-4 text-sky-500 flex-shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {employerBenefits.length > 0 && (
              <AnimatedSection delay={0.2}>
                <div className="bg-amber-50 rounded-2xl border-2 border-amber-100 p-7">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center">
                      <Award className="text-amber-600" style={{width:18,height:18}} />
                    </div>
                    <h2 className="font-display text-slate-900 font-black text-xl">Employer Benefits</h2>
                  </div>
                  <div className="space-y-3">
                    {employerBenefits.map((b, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                        <span className="text-slate-600 text-sm leading-relaxed">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <AnimatedSection direction="right">
                <div className="card-bold rounded-2xl overflow-hidden">
                  <div className="h-2 bg-sky-600" />
                  <div className="p-6">
                    <div className="text-center mb-5 pb-5 border-b border-slate-100">
                      <div className="text-5xl font-black text-sky-600 mb-1">Free</div>
                      <div className="text-slate-400 text-sm">100% government funded</div>
                    </div>

                    <div className="space-y-3 mb-5">
                      {[
                        { label: "Level", value: getLevelLabel(level) },
                        { label: "Duration", value: duration },
                        { label: "Sector", value: getSectorLabel(sector) },
                        { label: "Modules", value: `${modules.length} modules` },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between text-sm">
                          <span className="text-slate-400">{item.label}</span>
                          <span className="text-slate-800 font-semibold">{item.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mb-5 pb-5 border-b border-slate-100">
                      <h4 className="text-slate-700 text-xs font-bold uppercase tracking-wide mb-3">What&apos;s included</h4>
                      <ul className="space-y-2">
                        {["Named account manager", "Free recruitment service", "Ofsted Good provider"].map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <EnrollButton courseTitle={title} courseLevel={getLevelLabel(level)} label="Enrol on This Programme" className="btn-primary w-full justify-center text-sm mb-2.5" />
                    <EnrollButton courseTitle={title} courseLevel={getLevelLabel(level)} label="Speak to a Consultant" className="btn-outline-light w-full justify-center text-sm" />

                    <div className="mt-5 pt-5 border-t border-slate-100 text-center">
                      <div className="flex justify-center gap-0.5 mb-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-slate-400 text-xs">Ofsted Good. 85% success rate.</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.1} direction="right">
                <div className="card-bold rounded-2xl p-5">
                  <h4 className="font-display text-slate-700 font-bold text-sm mb-4">Related Programmes</h4>
                  <div className="space-y-2">
                    {related.map((r) => (
                      <Link
                        key={r.slug}
                        href={`/courses/${r.slug}`}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-base flex-shrink-0">
                          {getSectorIcon(r.sector)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-slate-800 text-xs font-semibold line-clamp-1 group-hover:text-sky-600 transition-colors">
                            {r.title}
                          </div>
                          <div className="text-slate-400 text-[11px]">{r.duration}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link href="/courses" className="mt-3 flex items-center justify-center gap-1 text-sky-600 text-xs font-semibold hover:text-sky-800 transition-colors">
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
