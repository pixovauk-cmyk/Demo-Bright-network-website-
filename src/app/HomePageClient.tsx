"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Briefcase, Monitor, BarChart3, Users } from "lucide-react";
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

const features = [
  { Icon: BoltIcon,     bg: "#DBEAFE", iconColor: "text-sky-600",     title: "Total Programme Delivery", desc: "From job advert to qualification. We manage the entire process so your team focuses on the business, not the admin." },
  { Icon: PersonIcon,   bg: "#D1FAE5", iconColor: "text-emerald-600", title: "Named Account Manager", desc: "A dedicated person who knows your organisation. Direct contact, no ticketing systems, no call queues." },
  { Icon: SparklesIcon, bg: "#FEF3C7", iconColor: "text-amber-600",   title: "Tailored Programmes", desc: "Every programme is shaped around your culture and objectives. Not an off-the-shelf package that barely fits." },
  { Icon: TrendingIcon, bg: "#FCE7F3", iconColor: "text-rose-600",    title: "Measurable ROI", desc: "Our employer partners report a 30% average attrition reduction within 12 months. Numbers that matter at board level." },
];

const steps = [
  { title: "Free Skills Audit", desc: "We identify gaps in your team and map them to the right apprenticeship frameworks. No obligation, no sales pressure." },
  { title: "Programme Design", desc: "We tailor content, delivery schedule, and assessment to fit your organisation. Not the other way around." },
  { title: "We Handle Recruitment", desc: "Free job advertising, screening, and interview coordination. Qualified candidates delivered to your door." },
  { title: "Live Progress Tracking", desc: "Your employer portal shows milestones, attendance, and qualification progress in real time." },
];

const categories = [
  { name: "Business & Admin", href: "/courses?sector=business", bg: "#DBEAFE", Icon: Briefcase, desc: "Business Administrator, Project Manager, Business Analyst, HR Support" },
  { name: "Digital & Tech",   href: "/courses?sector=tech",     bg: "#EDE9FE", Icon: Monitor,   desc: "Cyber Security, Network Engineer, Digital Support, IT Solutions" },
  { name: "Finance & FS",     href: "/courses?sector=finance",  bg: "#D1FAE5", Icon: BarChart3,  desc: "Financial Services, Mortgage Advice, Regulatory Compliance" },
  { name: "Customer Service", href: "/courses?sector=service",  bg: "#FCE7F3", Icon: Users,      desc: "Customer Service Practitioner & Specialist — Levels 2 & 3" },
];

const employers = ["Co-Operative Bank", "Leeds Building Society", "Acorn Insurance", "Morrisons", "Marriott Hotels", "Nando's", "Costco", "Arriva Bus"];

const team = [
  { name: "Alex Glasner",   role: "Chief Executive Officer",       bio: "Leading BrightPeak Group's national apprenticeship strategy. 20+ years driving growth across skills and employment sectors.",                                   img: "/team/ajg_photo.jpg",  bg: "#DBEAFE", initials: "AG" },
  { name: "Anne Wright",    role: "Chief Executive Officer",       bio: "Experienced education leader helping shape BrightPeak Group's strategic direction across its portfolio of Ofsted Good training providers.",                       img: "/team/aw_photo.jpg",   bg: "#EDE9FE", initials: "AW" },
  { name: "Simon Corbett",  role: "Chief Revenue Officer",         bio: "Founder of Orangebox Training. 23 years in law enforcement before building one of the North East's most dynamic training providers.",                             img: "/team/sc_photo2.jpg",  bg: "#D1FAE5", initials: "SC" },
  { name: "Kylee Bates",    role: "Chief Operating Officer",       bio: "Driving operational excellence and quality across three Ofsted Good brands. Expert in scalable delivery models and end-to-end programme management.",             img: "/team/kb_photo.jpg",   bg: "#FCE7F3", initials: "KB" },
  { name: "Kirstie Wright", role: "Group Director of Excellence",  bio: "20 years in education, formerly CEO of WS Training. Specialist in Ofsted quality frameworks and learner outcomes.",                                               img: "/team/kw_photo.jpg",   bg: "#FEF3C7", initials: "KW" },
  { name: "George Boylin",  role: "Chief Financial Officer",       bio: "Deep experience in finance across skills and employment sectors. Ensures BrightPeak Group's financial strategy supports sustainable, high-quality delivery.",      img: "/team/gb_photo.jpg",   bg: "#DCFCE7", initials: "GB" },
  { name: "Neda Nazariyan", role: "Group People & Culture Lead",   bio: "Championing a values-driven culture across the BrightPeak Group. Specialist in talent development, wellbeing, and building high-performing teams.",              img: "/team/nn_photo.avif",  bg: "#FFE4E6", initials: "NN" },
];

type HomeData = {
  announcementText?: string | null;
  heroHeadline?: string | null;
  heroSubtext?: string | null;
  heroTrustLine1?: string | null;
  heroTrustLine2?: string | null;
  heroTrustLine3?: string | null;
  ctaHeadline?: string | null;
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
        tinaDocument={data.home}
      />

      {/* ── Stats widgets ── */}
      <section className="py-10 bg-[#F4F6FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 pb-3 lg:overflow-visible lg:mx-0 lg:px-0 lg:pb-0">
            {[
              {
                value: 30, suffix: "+", label: "Years Expertise",
                bg: "#DBEAFE", iconColor: "text-sky-600",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>,
              },
              {
                value: 85, suffix: "%", label: "Success Rate",
                bg: "#D1FAE5", iconColor: "text-emerald-600",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
              },
              {
                value: 21, suffix: "", label: "Programmes",
                bg: "#EDE9FE", iconColor: "text-violet-600",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
              },
              {
                value: 30, suffix: "%", label: "Less Attrition",
                bg: "#FEF3C7", iconColor: "text-amber-600",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
              },
            ].map((s, i) => (
              <AnimatedSection key={s.label} delay={i * 0.08} className="snap-start flex-shrink-0 w-[64vw] sm:w-[44vw] md:w-[36vw] lg:flex-1 lg:min-w-0">
                <div
                  className="flex items-center gap-4 px-5 py-4 border-2 border-[#040B18]/10 rounded-2xl hover:border-[#040B18]/25 hover:-translate-y-1 hover:shadow-md transition-all duration-200 group h-full"
                  style={{ backgroundColor: s.bg }}
                >
                  <div className={`w-11 h-11 rounded-full bg-white border-2 border-[#040B18]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all shadow-sm ${s.iconColor}`}>
                    {s.icon}
                  </div>
                  <div>
                    <StatCounter
                      value={s.value}
                      suffix={s.suffix}
                      label=""
                      delay={i * 0.1}
                      numberClassName="font-display font-black text-2xl text-[#040B18] leading-none"
                    />
                    <div className="text-slate-500 text-xs font-semibold mt-0.5">{s.label}</div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trusted by — infinite marquee ── */}
      <section className="bg-white py-8 overflow-hidden border-b border-slate-100">
        <p className="text-center text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-6">
          Trusted by leading UK employers
        </p>
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="animate-marquee flex gap-5 whitespace-nowrap" style={{ width: "max-content" }}>
            {[...employers, ...employers].map((name, i) => (
              <span
                key={i}
                className="inline-flex items-center px-5 py-2.5 rounded-xl bg-white border-2 border-[#040B18]/10 text-sm font-bold text-slate-500 flex-shrink-0"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Categories ── */}
      <section className="bg-[#F4F6FF] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-7">
            <h2 className="font-display text-4xl md:text-5xl font-black text-[#040B18]">
              Top Categories
            </h2>
            <p className="mt-3 text-slate-500 text-base max-w-lg mx-auto">
              Government funded across every major sector. Find the right track.
            </p>
          </AnimatedSection>

          <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 pb-3 lg:overflow-visible lg:mx-0 lg:px-0 lg:pb-0">
            {categories.map((c) => (
              <div key={c.name} className="snap-start flex-shrink-0 w-[64vw] sm:w-[44vw] md:w-[36vw] lg:flex-1 lg:min-w-0">
                <Link
                  href={c.href}
                  className="flex flex-col items-center gap-4 px-8 py-7 border-2 border-[#040B18]/10 rounded-3xl hover:border-[#040B18]/25 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-200 group h-full"
                  style={{ backgroundColor: c.bg }}
                >
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-[#040B18]/10 flex items-center justify-center group-hover:scale-110 group-hover:border-sky-300 transition-all shadow-sm">
                    <c.Icon className="w-6 h-6 text-[#040B18] group-hover:text-sky-600 transition-colors" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-display font-extrabold text-[#040B18] text-sm leading-tight group-hover:text-sky-700 transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-1.5 leading-snug">{c.desc}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why BrightPeak ── */}
      <section id="why" className="bg-white py-14 lg:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

            <AnimatedSection direction="left" className="relative order-2 lg:order-1 flex justify-center lg:justify-start">
              <div className="relative" style={{width: 340, height: 420}}>
                <div
                  className="absolute top-0 left-0 overflow-hidden shadow-2xl border-2 border-[#040B18]/8"
                  style={{ width: 260, height: 360, borderRadius: "46% 46% 20px 20px / 38% 38% 20px 20px" }}
                >
                  <Image
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=85"
                    alt="Apprentices in group training session"
                    fill className="object-cover" sizes="260px"
                  />
                </div>
                <div
                  className="absolute overflow-hidden border-4 border-white shadow-2xl z-10"
                  style={{ width: 148, height: 148, bottom: 0, right: 0, borderRadius: 20 }}
                >
                  <Image
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=220&q=85"
                    alt="BrightPeak consultant mentor"
                    fill className="object-cover" sizes="148px"
                  />
                </div>
                <div className="absolute -top-5 -left-6 bg-white rounded-2xl shadow-xl border-2 border-[#040B18]/8 px-5 py-4 z-20">
                  <div className="font-display text-3xl font-black text-slate-900 leading-none">85%</div>
                  <div className="text-xs text-slate-500 font-medium mt-1">Success rate</div>
                </div>
                <div
                  className="absolute rounded-xl shadow-lg px-4 py-2.5 hidden lg:block z-20"
                  style={{ top: 160, right: -16, background: "linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)" }}
                >
                  <div className="text-white text-xs font-bold leading-snug">100% Government</div>
                  <div className="text-sky-200 text-xs leading-snug">Funded Programme</div>
                </div>
              </div>
            </AnimatedSection>

            <div className="order-1 lg:order-2">
              <AnimatedSection direction="right">
                <span className="text-sky-600 text-sm font-semibold uppercase tracking-widest">Why BrightPeak</span>
                <h2 className="mt-3 font-display text-4xl md:text-5xl font-black text-[#040B18] leading-tight mb-5">
                  Infrastructure of a large provider.{" "}
                  <span className="text-slate-400">Care of a small one.</span>
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed mb-10">
                  Three decades of experience means we know what works. We build everything around your organisation, not our sales targets.
                </p>
                <div className="space-y-7">
                  {features.map((f, i) => (
                    <AnimatedSection key={f.title} delay={i * 0.08}>
                      <div className="flex gap-4">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-[#040B18]/10 ${f.iconColor}`}
                          style={{ backgroundColor: f.bg }}
                        >
                          <f.Icon />
                        </div>
                        <div>
                          <h3 className="font-display text-slate-900 font-bold text-base mb-1">{f.title}</h3>
                          <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </AnimatedSection>
            </div>

          </div>
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section className="bg-[#F4F6FF] py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex items-end justify-between gap-4 mb-7">
            <h2 className="font-display text-4xl md:text-5xl font-black text-[#040B18]">
              Popular Courses
            </h2>
            <Link href="/courses" className="text-sky-600 font-semibold text-sm flex items-center gap-1.5 hover:gap-3 transition-all whitespace-nowrap pb-1.5">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>

          <div className="flex gap-2 flex-wrap justify-center mb-10">
            <span className="px-5 py-2 rounded-full text-sm font-bold bg-[#040B18] text-white cursor-default">All</span>
            {[
              { label: "Apprenticeships", href: "/courses" },
              { label: "Business & Admin", href: "/courses?sector=business" },
              { label: "Digital & Tech", href: "/courses?sector=tech" },
              { label: "Finance", href: "/courses?sector=finance" },
            ].map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                className="px-5 py-2 rounded-full text-sm font-semibold border-2 border-[#040B18]/10 text-slate-500 hover:border-sky-300 hover:text-sky-600 transition-all bg-white"
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
            <Link href="/courses" className="btn-primary inline-flex">
              View All Programmes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Meet Our Team ── */}
      <section className="bg-[#F4F6FF] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="w-10 h-1 rounded-full bg-sky-500 mb-4" />
              <h2 className="font-display text-4xl md:text-5xl font-black text-[#040B18]">
                Meet Our Team
              </h2>
            </div>
            <p className="text-slate-500 text-sm max-w-xs md:text-right leading-relaxed">
              Dedicated specialists who know your sector inside out. One point of contact, start to finish.
            </p>
          </AnimatedSection>

          {/* Carousel — all breakpoints */}
          <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 pb-4">
            {team.map((c) => (
              <div key={c.name} className="snap-start flex-shrink-0 w-[68vw] sm:w-[44vw] md:w-[32vw] lg:w-[220px] xl:w-[240px]">
                <div
                  className="rounded-3xl p-6 text-center h-full flex flex-col border-2 border-[#040B18]/10 hover:border-[#040B18]/20 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-200 group"
                  style={{ backgroundColor: c.bg }}
                >
                  {/* Photo */}
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-500">
                    <Image
                      src={c.img}
                      alt={c.name}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="font-display font-black text-[#040B18] text-sm leading-tight">{c.name}</h3>
                  <p className="text-sky-700 text-[10px] font-bold mt-1 mb-3 uppercase tracking-wide leading-snug">{c.role}</p>
                  <p className="text-slate-500 text-[11px] leading-relaxed flex-1">{c.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className="bg-[#F4F6FF] py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div>
              <AnimatedSection>
                <span className="text-sky-600 text-sm font-semibold uppercase tracking-widest">Process</span>
                <h2 className="mt-3 font-display text-4xl md:text-5xl font-black text-[#040B18] leading-tight mb-12">
                  From first call to qualified team member
                </h2>
              </AnimatedSection>

              <div className="relative">
                <div className="absolute left-5 top-10 bottom-10 w-px bg-slate-100" />
                {steps.map((step, i) => (
                  <AnimatedSection key={step.title} delay={i * 0.1}>
                    <div className="flex gap-5 relative pb-10 last:pb-0">
                      <div className="w-10 h-10 rounded-full bg-white border-2 border-[#040B18]/10 flex items-center justify-center text-xs font-black text-sky-600 flex-shrink-0 relative z-10 shadow-sm">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="pt-1.5 pb-1">
                        <h3 className="font-display text-slate-900 font-bold text-lg mb-1.5">{step.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>

              <AnimatedSection delay={0.45} className="mt-10 ml-15">
                <Link href="/#cta" className="btn-primary inline-flex">
                  Start your free skills audit <ArrowRight className="w-4 h-4" />
                </Link>
              </AnimatedSection>
            </div>

            <AnimatedSection direction="right" className="relative">
              <div className="relative rounded-3xl overflow-hidden h-[500px] lg:h-[580px] shadow-2xl border-2 border-[#040B18]/8">
                <Image
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=85"
                  alt="Apprentice training session"
                  fill className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
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
                      <div className="font-display text-slate-900 font-bold text-sm">Ofsted Good</div>
                      <div className="text-slate-500 text-xs">30+ years delivering results across the UK</div>
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

      {/* ── Read Our Insights ── */}
      <section className="bg-[#F4F6FF] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-2">Latest</p>
              <h2 className="font-display text-4xl md:text-5xl font-black text-[#040B18]">
                Insights & Guidance
              </h2>
            </div>
            <Link href="https://apps.brightpeakgroup.com/" target="_blank" rel="noopener noreferrer" className="text-sky-600 font-semibold text-sm flex items-center gap-1.5 hover:gap-3 transition-all whitespace-nowrap pb-1.5">
              Read all <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>

          <div className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 pb-3 lg:grid lg:grid-cols-3 lg:overflow-visible lg:mx-0 lg:px-0 lg:pb-0">
            {[
              { tag: "Employers", title: "How the Apprenticeship Levy Works for Your Business", date: "12 May 2025", read: "5 min read", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80", href: "https://apps.brightpeakgroup.com/", bg: "#DBEAFE" },
              { tag: "Guidance", title: "Level 3 vs Level 4: Which Apprenticeship Is Right for Your Team?", date: "3 Apr 2025", read: "4 min read", img: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=600&q=80", href: "https://apps.brightpeakgroup.com/", bg: "#EDE9FE" },
              { tag: "Tips", title: "5 Signs Your Organisation Is Ready to Take On an Apprentice", date: "18 Mar 2025", read: "3 min read", img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80", href: "https://apps.brightpeakgroup.com/", bg: "#D1FAE5" },
            ].map((b, i) => (
              <AnimatedSection key={b.title} delay={i * 0.1} className="snap-start flex-shrink-0 w-[80vw] sm:w-[55vw] md:w-[42vw] lg:w-auto">
                <Link href={b.href} target="_blank" rel="noopener noreferrer"
                  className="rounded-3xl overflow-hidden group cursor-pointer h-full flex flex-col border-2 border-[#040B18]/10 hover:border-[#040B18]/20 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-200"
                  style={{ backgroundColor: b.bg }}
                >
                  <div className="relative h-48 overflow-hidden rounded-t-[22px] flex-shrink-0">
                    <Image src={b.img} alt={b.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 80vw, 33vw" />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-sky-600 text-white">{b.tag}</span>
                    </div>
                  </div>
                  <div className="p-5 flex-1">
                    <div className="flex items-center gap-3 text-slate-500 text-xs font-medium mb-3">
                      <span>{b.date}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-400/40" />
                      <span>{b.read}</span>
                    </div>
                    <h3 className="font-display font-bold text-[#040B18] text-base leading-snug group-hover:text-sky-700 transition-colors line-clamp-2">
                      {b.title}
                    </h3>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="https://apps.brightpeakgroup.com/" className="btn-outline-light inline-flex">
              Read More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Dual Audience ── */}
      <section className="bg-[#F4F6FF] py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-8">
            <h2 className="font-display text-4xl md:text-5xl font-black text-[#040B18]">
              For <span className="text-sky-600">employers.</span>{" "}
              For <span className="text-slate-400">learners.</span>
            </h2>
            <p className="mt-3 text-slate-500 text-base max-w-sm">
              Whether you&apos;re building a team or building a career — we deliver.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6">
            <AnimatedSection delay={0.1} direction="left">
              <div className="rounded-3xl overflow-hidden h-full flex flex-col group border-2 border-[#040B18]/10 hover:border-[#040B18]/20 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-200" style={{ backgroundColor: "#DBEAFE" }}>
                <div className="relative h-56 overflow-hidden flex-shrink-0">
                  <Image src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=85" alt="Employer team meeting with apprentice" fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040B18]/50 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-sky-600 text-white">For Employers</span>
                  </div>
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="font-display text-[#040B18] font-black text-2xl mb-2">Grow your team. Zero cost.</h3>
                  <p className="text-slate-500 text-sm mb-5 leading-relaxed">We handle recruitment, training, and qualification — fully funded by the government. Most employers pay nothing.</p>
                  <ul className="space-y-3 mb-7 flex-1">
                    {["Free recruitment service", "Government funded — no cost to most employers", "Named account manager from day one", "Real-time apprentice progress portal"].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                        <span className="text-sky-500 flex-shrink-0"><CheckIcon /></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/#cta" className="btn-primary inline-flex self-start">
                    Book Discovery Call <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2} direction="right">
              <div className="rounded-3xl overflow-hidden h-full flex flex-col group border-2 border-[#040B18]/10 hover:border-[#040B18]/20 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-200" style={{ backgroundColor: "#D1FAE5" }}>
                <div className="relative h-56 overflow-hidden flex-shrink-0">
                  <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=85" alt="Apprentices at laptops in training session" fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040B18]/40 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500 text-white">For Learners</span>
                  </div>
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="font-display text-[#040B18] font-black text-2xl mb-2">Get paid to learn. Build a career.</h3>
                  <p className="text-slate-500 text-sm mb-5 leading-relaxed">Earn a salary, gain a qualification, and build real experience — all at the same time. No tuition fees.</p>
                  <ul className="space-y-3 mb-7 flex-1">
                    {["Earn a salary while you qualify", "Real on-the-job experience from day one", "Dedicated tutor support throughout", "Levels 2–5 across multiple sectors"].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                        <span className="text-emerald-500 flex-shrink-0"><CheckIcon /></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/courses" className="btn-outline-light inline-flex self-start">
                    Browse Open Programmes <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta" className="relative overflow-hidden" style={{background: "linear-gradient(135deg, #0284C7 0%, #023E6B 100%)"}}>
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "24px 24px"}} aria-hidden />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-0">

            <div className="flex-1">
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Start today — it&apos;s free</p>
              <h2
                className="font-display text-2xl md:text-3xl font-black text-white leading-tight"
                data-tina-field={tinaField(data.home, "ctaHeadline")}
              >
                {home.ctaHeadline ?? "Build your best team with government funding."}
              </h2>
            </div>

            <div className="hidden lg:block w-px h-14 bg-white/15 mx-10 flex-shrink-0" />

            <div className="flex-shrink-0 text-center lg:text-left">
              <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-1">Call us</p>
              <a
                href={`tel:${(home.ctaPhone ?? "01246918340").replace(/\s/g, "")}`}
                className="font-display font-black text-2xl text-white hover:text-white/80 transition-colors block"
                data-tina-field={tinaField(data.home, "ctaPhone")}
              >
                {home.ctaPhone ?? "01246 918 340"}
              </a>
              <a
                href={`mailto:${home.ctaEmail ?? "contact@brightpeakgroup.com"}`}
                className="text-white/50 text-xs hover:text-white/80 transition-colors"
                data-tina-field={tinaField(data.home, "ctaEmail")}
              >
                {home.ctaEmail ?? "contact@brightpeakgroup.com"}
              </a>
            </div>

            <div className="hidden lg:block w-px h-14 bg-white/15 mx-10 flex-shrink-0" />

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0">
              <Link href="https://apps.brightpeakgroup.com/book.html" className="btn-primary text-sm px-6 py-3 whitespace-nowrap">
                Book Free Call <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/courses" className="btn-outline-light text-sm px-6 py-3 whitespace-nowrap text-center">
                Browse Programmes
              </Link>
            </div>

          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-7 pt-6 border-t border-white/10">
            {["Ofsted Good Provider", "30+ Years Delivering", "85% Success Rate", "No Cost to Most Employers"].map((t) => (
              <span key={t} className="text-white/40 text-xs font-medium flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-white/30 inline-block" />{t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
