import { Suspense } from "react";
import Image from "next/image";
import { getAllCourses } from "@/lib/courses";
import CourseCard from "@/components/CourseCard";
import AnimatedSection from "@/components/AnimatedSection";
import CoursesFilter from "@/components/CoursesFilter";

interface PageProps {
  searchParams: Promise<{ level?: string; sector?: string }>;
}

export const metadata = {
  title: "Apprenticeship Programmes | BrightPeak",
  description: "Browse 19 government funded apprenticeship programmes across business, tech, and finance. Levels 2 to 5.",
};

export default async function CoursesPage({ searchParams }: PageProps) {
  const { level, sector } = await searchParams;
  const allCourses = getAllCourses();

  const filtered = allCourses.filter((c) => {
    if (level && c.level !== level) return false;
    if (sector && c.sector !== sector) return false;
    return true;
  });

  const levelLabels: Record<string, string> = {
    "2": "Foundation",
    "3": "Advanced",
    "4": "Higher",
    "5": "Higher",
  };

  return (
    <div className="bg-[#F4F6FF] min-h-screen">
      {/* Hero header */}
      <div className="relative pt-24 pb-20 overflow-hidden bg-[#040B18]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&q=60"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#040B18]/96 via-[#040B18]/85 to-[#040B18]/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <span className="text-sky-400 text-sm font-semibold uppercase tracking-widest">
              All Programmes
            </span>
            <h1 className="mt-3 font-display text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
              {level
                ? `Level ${level}: ${levelLabels[level] ?? ""} Apprenticeships`
                : sector
                ? `${sector.charAt(0).toUpperCase() + sector.slice(1)} Apprenticeships`
                : "Browse All Programmes"}
            </h1>
            <p className="text-white/55 text-lg max-w-2xl">
              {filtered.length} programme{filtered.length !== 1 ? "s" : ""} available,
              100% government funded, Levels 2 to 5, Business, Tech and Finance
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Filter + grid */}
      <div className="bg-[#F4F6FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AnimatedSection delay={0.1}>
            <Suspense>
              <CoursesFilter />
            </Suspense>
          </AnimatedSection>

          {filtered.length === 0 ? (
            <AnimatedSection className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-sky-400">
                  <path d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
              <h3 className="font-display text-slate-800 font-bold text-xl mb-2">No programmes match your filters</h3>
              <p className="text-slate-500">Adjust the level or sector filter above.</p>
            </AnimatedSection>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course, i) => (
                <AnimatedSection key={course.slug} delay={i * 0.07}>
                  <CourseCard course={course} variant="light" />
                </AnimatedSection>
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          <AnimatedSection className="mt-20 card-bold rounded-3xl p-8 md:p-12 text-center" delay={0.3}>
            <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mx-auto mb-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-sky-600">
                <path d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/>
              </svg>
            </div>
            <h3 className="font-display text-slate-900 font-black text-2xl mb-2">Can&apos;t find what you need?</h3>
            <p className="text-slate-500 mb-6 max-w-lg mx-auto">
              We offer 19 programmes and can tailor bespoke solutions for your organisation.
              Book a free skills audit to find the right fit.
            </p>
            <a
              href="https://apps.brightpeakgroup.com/book.html"
              className="btn-primary inline-flex"
            >
              Book Free Skills Audit
            </a>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
