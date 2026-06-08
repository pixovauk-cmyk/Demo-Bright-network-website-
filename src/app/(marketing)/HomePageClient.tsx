"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTina, tinaField } from "tinacms/dist/react";
import HeroSection from "@/components/HeroSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AnimatedSection from "@/components/AnimatedSection";
import StatCounter from "@/components/StatCounter";
import CourseCard from "@/components/CourseCard";
import type { Course, Testimonial } from "@/lib/courses";

/* ── Inline SVG icons ── */
const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);
const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);
const SparklesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);
const TrendingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M2.25 18 9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
  </svg>
);

const featureIcons = [BoltIcon, PersonIcon, SparklesIcon, TrendingIcon];

type StatItem = { value?: number | null; suffix?: string | null; label?: string | null };
type FeatureItem = { title?: string | null; desc?: string | null };
type StepItem = { title?: string | null; desc?: string | null };
type InsightItem = { tag?: string | null; title?: string | null; date?: string | null; read?: string | null; img?: string | null; href?: string | null };

type HomeData = {
  announcementText?: string | null;
  heroHeadline?: string | null;
  heroSubtext?: string | null;
  heroTrustLine1?: string | null;
  heroTrustLine2?: string | null;
  heroTrustLine3?: string | null;
  heroImage1?: string | null;
  heroImage2?: string | null;
  stats?: (StatItem | null)[] | null;
  employers?: (string | null)[] | null;
  whyHeadline?: string | null;
  whySubtext?: string | null;
  whyImage1?: string | null;
  whyImage2?: string | null;
  features?: (FeatureItem | null)[] | null;
  howHeadline?: string | null;
  howImage?: string | null;
  steps?: (StepItem | null)[] | null;
  insightsHeadline?: string | null;
  insights?: (InsightItem | null)[] | null;
  dualHeadline?: string | null;
  dualSubtext?: string | null;
  employerCardHeadline?: string | null;
  employerCardSubtext?: string | null;
  employerCardImage?: string | null;
  employerBullets?: (string | null)[] | null;
  learnerCardHeadline?: string | null;
  learnerCardSubtext?: string | null;
  learnerCardImage?: string | null;
  learnerBullets?: (string | null)[] | null;
  ctaHeadline?: string | null;
  ctaSubtext?: string | null;
  ctaPhone?: string | null;
  ctaEmail?: string | null;
};

interface Props {
  query: string;
  variables: { relativePath: string };
  data: { home: HomeData };
  featured: Course[];
  testimonials: Testimonial[];
}

export default function HomePageClient({ query, variables, data: initialData, featured, testimonials }: Props) {
  const { data } = useTina({ query, variables, data: initialData });
  const home = data.home;

  const stats = (home.stats ?? []).filter(Boolean) as StatItem[];
  const employers = (home.employers ?? []).filter(Boolean) as string[];
  const features = (home.features ?? []).filter(Boolean) as FeatureItem[];
  const steps = (home.steps ?? []).filter(Boolean) as StepItem[];
  const employerBullets = (home.employerBullets ?? []).filter(Boolean) as string[];
  const learnerBullets = (home.learnerBullets ?? []).filter(Boolean) as string[];

  return (
    <div>
      {/* Hero */}
      <HeroSection
        announcementText={home.announcementText}
        heroHeadline={home.heroHeadline}
        heroSubtext={home.heroSubtext}
        trustLine1={home.heroTrustLine1}
        trustLine2={home.heroTrustLine2}
        trustLine3={home.heroTrustLine3}
        heroImage1={home.heroImage1}
        heroImage2={home.heroImage2}
        tinaDocument={data.home}
      />

      {/* ── Stats bar ── */}
      <section className="bg-slate-50 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200 py-6">
            {stats.map((s, i) => (
              <AnimatedSection key={i} delay={i * 0.08} className="text-center px-6 py-4 md:py-2">
                <div className="font-display font-black text-3xl md:text-4xl text-[#040B18] leading-none">
                  <StatCounter
                    value={s.value ?? 0}
                    suffix={s.suffix ?? ""}
                    label=""
                    delay={i * 0.1}
                    numberClassName="font-display font-black text-3xl md:text-4xl text-[#040B18] leading-none"
                  />
                </div>
                <div
                  className="text-slate-500 text-xs font-semibold mt-1.5"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  data-tina-field={tinaField(s as any, "label")}
                >
                  {s.label}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trusted by — infinite marquee ── */}
      <section className="bg-white py-7 overflow-hidden border-b border-slate-100">
        <p className="text-center text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-5">
          The employers who stopped paying for training they could get funded
        </p>
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <div className="animate-marquee flex gap-3 whitespace-nowrap" style={{ width: "max-content" }}>
            {[...employers, ...employers].map((name, i) => (
              <span
                key={i}
                className="inline-flex items-center px-5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-600 flex-shrink-0"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why BrightPeak — dark bento ── */}
      <section id="why" className="bg-slate-950 py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <AnimatedSection className="mb-12">
            <p className="text-sky-400 text-sm font-semibold uppercase tracking-widest mb-3">Why 500+ employers choose us</p>
            <h2
              className="font-display text-4xl md:text-5xl font-black text-white leading-tight max-w-2xl"
              data-tina-field={tinaField(data.home, "whyHeadline")}
            >
              {home.whyHeadline ?? "Thirty years of delivery."}{" "}
              <span className="text-slate-400">Three Ofsted Good providers. One team looking after you.</span>
            </h2>
          </AnimatedSection>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Funding card — spans 2 cols */}
            <AnimatedSection delay={0.05} className="lg:col-span-2">
              <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden h-full">
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "20px 20px" }} aria-hidden />
                <div className="w-12 h-12 bg-sky-600 rounded-2xl flex items-center justify-center mb-6 flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h3 className="text-2xl font-black text-white mb-3">The government pays. You don&apos;t.</h3>
                <p
                  className="text-slate-400 leading-relaxed mb-6"
                  data-tina-field={tinaField(data.home, "whySubtext")}
                >
                  {home.whySubtext ?? "95 to 100 percent of all training costs are covered by the UK government's apprenticeship levy. Most employers pay nothing. Learners pay nothing. The training happens. The qualification is real. The only thing that costs you anything is the 20 minutes it takes to book a call."}
                </p>
                <div className="flex items-center gap-8 pt-6 border-t border-slate-800">
                  <div>
                    <div className="text-2xl font-black text-white">£0</div>
                    <div className="text-slate-500 text-xs font-semibold mt-0.5">What most employers pay</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">£0</div>
                    <div className="text-slate-500 text-xs font-semibold mt-0.5">Tuition — ever</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">100%</div>
                    <div className="text-slate-500 text-xs font-semibold mt-0.5">Covered by government funding</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Image card */}
            <AnimatedSection delay={0.1}>
              <div className="bg-sky-700 rounded-3xl overflow-hidden relative min-h-[280px] h-full">
                <Image
                  src={home.whyImage1 ?? "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&q=80"}
                  alt="Learner with tutor"
                  fill className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  data-tina-field={tinaField(data.home, "whyImage1")}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(3,105,161,0.92) 0%,transparent 55%)" }} />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-white font-black text-xl">One tutor. Your tutor.</div>
                  <div className="text-sky-200 text-sm mt-1">From first session to end point assessment — same person, every step.</div>
                </div>
              </div>
            </AnimatedSection>

            {/* Feature cards from CMS */}
            {features.slice(0, 2).map((f, i) => {
              const iconColors = ["text-emerald-400", "text-amber-400"];
              const iconBgs = ["bg-emerald-500/20", "bg-amber-500/20"];
              const Icon = featureIcons[i % featureIcons.length];
              return (
                <AnimatedSection key={i} delay={0.1 + i * 0.08}>
                  <div className="bg-slate-900 rounded-3xl p-7 h-full">
                    <div className={`w-10 h-10 ${iconBgs[i]} rounded-xl flex items-center justify-center mb-5 ${iconColors[i]}`}>
                      <Icon />
                    </div>
                    <h3
                      className="text-white font-bold text-lg mb-2"
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      data-tina-field={tinaField(f as any, "title")}
                    >
                      {f.title}
                    </h3>
                    <p
                      className="text-slate-400 text-sm leading-relaxed"
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      data-tina-field={tinaField(f as any, "desc")}
                    >
                      {f.desc}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}

            {/* 30+ years stat card */}
            <AnimatedSection delay={0.26}>
              <div className="bg-sky-950 border border-sky-900/60 rounded-3xl p-7 h-full">
                <div className="text-5xl font-black text-sky-400 mb-3">30+</div>
                <div className="text-white font-bold text-lg mb-2">
                  {features[3]?.title ?? "Three decades. We know what works."}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {features[3]?.desc ?? "Founded in 1995. Every funding model, every Ofsted framework overhauled. We adapted every time — because the employers and learners we work with needed us to."}
                </p>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section id="courses" className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-10">
            <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-3">Find your programme</p>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h2 className="font-display text-4xl md:text-5xl font-black text-[#040B18] leading-tight">
                The qualification<br />that gets you hired.
              </h2>
              <p className="text-slate-500 text-base max-w-xs leading-relaxed">
                Every course below is fully funded by the government. No fees. No debt. Just a real qualification with real employers.
              </p>
            </div>
          </AnimatedSection>

          <div className="flex gap-2 flex-wrap mb-10">
            <span className="px-5 py-2 rounded-full text-sm font-bold bg-slate-900 text-white cursor-default">All courses</span>
            {[
              { label: "Business & Admin", href: "/courses?sector=business" },
              { label: "Digital & Tech", href: "/courses?sector=tech" },
              { label: "Finance", href: "/courses?sector=finance" },
              { label: "Customer Service", href: "/courses?sector=service" },
            ].map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                className="px-5 py-2 rounded-full text-sm font-semibold border-2 border-slate-200 text-slate-500 hover:border-sky-300 hover:text-sky-600 transition-all bg-white"
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <div className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 pb-3 lg:grid lg:grid-cols-3 lg:overflow-visible lg:mx-0 lg:px-0 lg:pb-0">
            {featured.map((course) => (
              <div key={course.slug} className="snap-start flex-shrink-0 w-[80vw] sm:w-[55vw] md:w-[42vw] lg:w-auto">
                <CourseCard course={course} variant="light" />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/courses" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg">
              See all funded programmes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className="bg-white py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div>
              <AnimatedSection>
                <span className="text-sky-600 text-sm font-semibold uppercase tracking-widest">What happens next</span>
                <h2
                  className="mt-3 font-display text-4xl md:text-5xl font-black text-[#040B18] leading-tight mb-12"
                  data-tina-field={tinaField(data.home, "howHeadline")}
                >
                  {home.howHeadline ?? "From first call to qualified team member"}
                </h2>
              </AnimatedSection>

              <div className="relative">
                <div className="absolute left-5 top-10 bottom-10 w-px bg-slate-100" />
                {steps.map((step, i) => (
                  <AnimatedSection key={i} delay={i * 0.1}>
                    <div className="flex gap-5 relative pb-10 last:pb-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 relative z-10 shadow-sm ${i === steps.length - 1 ? "bg-sky-600 border-2 border-sky-600 text-white" : "bg-white border-2 border-slate-200 text-sky-600"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="pt-1.5 pb-1">
                        <h3
                          className="font-display text-slate-900 font-bold text-lg mb-1.5"
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          data-tina-field={tinaField(step as any, "title")}
                        >
                          {step.title}
                        </h3>
                        <p
                          className="text-slate-500 text-sm leading-relaxed"
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          data-tina-field={tinaField(step as any, "desc")}
                        >
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>

              <AnimatedSection delay={0.45} className="mt-10 ml-15">
                <Link href="/#cta" className="btn-primary inline-flex">
                  Start the conversation — it&apos;s free <ArrowRight className="w-4 h-4" />
                </Link>
              </AnimatedSection>
            </div>

            <AnimatedSection direction="right" className="relative">
              <div className="relative rounded-3xl overflow-hidden h-[500px] lg:h-[580px] shadow-2xl border-2 border-[#040B18]/8">
                <Image
                  src={home.howImage ?? "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=85"}
                  alt="Apprentice training session"
                  fill className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  data-tina-field={tinaField(data.home, "howImage")}
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/80 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-display text-slate-900 font-bold text-sm">Ofsted Good across all three providers</div>
                      <div className="text-slate-500 text-xs">Thirty years. Real results. Every time.</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl bg-sky-50 border border-sky-100 -z-10" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-xl bg-[#F4F6FF] -z-10" />
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <TestimonialsSection testimonials={testimonials} />

      {/* ── Dual Audience ── */}
      <section id="employers" className="bg-slate-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2
              className="font-display text-4xl md:text-5xl font-black text-[#040B18] leading-tight mb-4"
              data-tina-field={tinaField(data.home, "dualHeadline")}
            >
              {home.dualHeadline ?? <>Whether you&apos;re hiring<br />or <span className="text-sky-600">learning</span> — we&apos;ve got you.</>}
            </h2>
            <p
              className="text-slate-500 text-lg max-w-md mx-auto"
              data-tina-field={tinaField(data.home, "dualSubtext")}
            >
              {home.dualSubtext ?? "Two audiences. One platform. Fully funded by government."}
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6">
            <AnimatedSection delay={0.1} direction="left">
              <div className="rounded-3xl overflow-hidden h-full flex flex-col group border-2 border-slate-100 hover:border-sky-200 hover:shadow-xl transition-all duration-300 bg-white">
                <div className="relative h-64 overflow-hidden flex-shrink-0">
                  <Image
                    src={home.employerCardImage ?? "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=85"}
                    alt="Employer team meeting with apprentice"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    data-tina-field={tinaField(data.home, "employerCardImage")}
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(15,23,42,0.75),transparent 55%)" }} />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-sky-600 text-white">For Employers</span>
                  </div>
                  <div className="absolute bottom-5 left-6">
                    <div className="text-4xl font-black text-white">£0</div>
                    <div className="text-white/70 text-sm font-semibold">What most employers pay</div>
                  </div>
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <h3
                    className="font-display text-[#040B18] font-black text-2xl mb-2"
                    data-tina-field={tinaField(data.home, "employerCardHeadline")}
                  >
                    {home.employerCardHeadline ?? "Grow your team. Zero cost."}
                  </h3>
                  <p
                    className="text-slate-500 text-sm mb-5 leading-relaxed"
                    data-tina-field={tinaField(data.home, "employerCardSubtext")}
                  >
                    {home.employerCardSubtext ?? "We handle recruitment, training, and qualification — fully funded by the government. Most employers pay nothing."}
                  </p>
                  <ul className="space-y-3 mb-7 flex-1">
                    {employerBullets.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2.5 text-sm text-slate-600"
                        data-tina-field={tinaField(data.home, "employerBullets")}
                      >
                        <span className="text-sky-500 flex-shrink-0"><CheckIcon /></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/#cta" className="inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-3.5 rounded-full transition-all w-full">
                    Book your free discovery call <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2} direction="right">
              <div className="rounded-3xl overflow-hidden h-full flex flex-col group border-2 border-slate-100 hover:border-amber-200 hover:shadow-xl transition-all duration-300 bg-white">
                <div className="relative h-64 overflow-hidden flex-shrink-0">
                  <Image
                    src={home.learnerCardImage ?? "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=85"}
                    alt="Apprentices at laptops in training session"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    data-tina-field={tinaField(data.home, "learnerCardImage")}
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(15,23,42,0.75),transparent 55%)" }} />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500 text-white">For Learners</span>
                  </div>
                  <div className="absolute bottom-5 left-6">
                    <div className="text-4xl font-black text-white">£0</div>
                    <div className="text-white/70 text-sm font-semibold">Tuition. Now and always.</div>
                  </div>
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <h3
                    className="font-display text-[#040B18] font-black text-2xl mb-2"
                    data-tina-field={tinaField(data.home, "learnerCardHeadline")}
                  >
                    {home.learnerCardHeadline ?? "Get paid to learn. Build a career."}
                  </h3>
                  <p
                    className="text-slate-500 text-sm mb-5 leading-relaxed"
                    data-tina-field={tinaField(data.home, "learnerCardSubtext")}
                  >
                    {home.learnerCardSubtext ?? "Earn a salary, gain a qualification, and build real experience — all at the same time. No tuition fees."}
                  </p>
                  <ul className="space-y-3 mb-7 flex-1">
                    {learnerBullets.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2.5 text-sm text-slate-600"
                        data-tina-field={tinaField(data.home, "learnerBullets")}
                      >
                        <span className="text-emerald-500 flex-shrink-0"><CheckIcon /></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/courses" className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-full transition-all w-full">
                    Find my programme <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── CTA — dark navy, split audience ── */}
      <section id="cta" className="bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">

          <p className="text-sky-400 text-sm font-semibold uppercase tracking-widest mb-4">
            One call. That&apos;s all it takes.
          </p>
          <h2
            className="font-display text-4xl md:text-6xl font-black text-white leading-[1.05] mb-6"
            data-tina-field={tinaField(data.home, "ctaHeadline")}
          >
            {home.ctaHeadline ?? "The funding is sitting there. Your competitors already know about it."}
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            {home.ctaSubtext ?? "Every week you wait is another week of training you're not claiming. A 20-minute call is all it takes to find out what you're entitled to."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link href="/courses" className="inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold px-8 py-4 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-xl text-base">
              I want to learn — find my programme <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="https://apps.brightpeakgroup.com/book.html" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold px-8 py-4 rounded-full transition-all border border-white/10 hover:-translate-y-0.5 text-base">
              I&apos;m an employer — let&apos;s talk <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3 mb-8">
            <a
              href={`tel:${(home.ctaPhone ?? "01246918340").replace(/\s/g, "")}`}
              className="font-display font-black text-2xl text-white hover:text-sky-400 transition-colors"
              data-tina-field={tinaField(data.home, "ctaPhone")}
            >
              {home.ctaPhone ?? "01246 918 340"}
            </a>
            <span className="text-slate-700">·</span>
            <a
              href={`mailto:${home.ctaEmail ?? "contact@brightpeakgroup.com"}`}
              className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
              data-tina-field={tinaField(data.home, "ctaEmail")}
            >
              {home.ctaEmail ?? "contact@brightpeakgroup.com"}
            </a>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1 justify-center">
            {["Ofsted Good — all three providers", "Est. 1995", "85% pass first time", "Zero cost to most employers"].map((t) => (
              <span key={t} className="text-slate-600 text-xs font-medium flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-700 inline-block" />{t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
