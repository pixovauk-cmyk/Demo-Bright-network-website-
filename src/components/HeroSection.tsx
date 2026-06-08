"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, Star } from "lucide-react";
import { tinaField } from "tinacms/dist/react";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease },
});

interface HeroProps {
  announcementText?: string | null;
  heroHeadline?: string | null;
  heroSubtext?: string | null;
  trustLine1?: string | null;
  trustLine2?: string | null;
  trustLine3?: string | null;
  heroImage1?: string | null;
  heroImage2?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tinaDocument?: any;
}

export default function HeroSection({
  announcementText,
  heroHeadline,
  heroSubtext,
  trustLine1,
  trustLine2,
  trustLine3,
  heroImage1,
  tinaDocument,
}: HeroProps = {}) {

  return (
    <section className="relative bg-white overflow-hidden pt-[52px]">

      {/* Announcement strip */}
      <div
        className="py-2.5 text-center text-xs font-semibold text-white/80 tracking-wide"
        style={{ background: "linear-gradient(90deg, #0F172A 0%, #1E293B 100%)" }}
        data-tina-field={tinaDocument ? tinaField(tinaDocument, "announcementText") : undefined}
      >
        <span className="text-amber-400 font-black">●</span>{" "}
        {announcementText ?? <>All three providers rated <strong className="text-white">Ofsted Good</strong> · <strong className="text-white">11,000+</strong> learners supported annually · 100% government funded</>}{" "}
        <Link href="/#cta" className="text-sky-400 underline underline-offset-2 hover:text-sky-300 transition-colors ml-2">
          Book free call →
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-0">
        <div className="grid lg:grid-cols-12 gap-10 xl:gap-16 items-end" style={{ minHeight: "82vh" }}>

          {/* ── Left col ── */}
          <div className="lg:col-span-6 space-y-7 pb-16">

            <motion.div {...fadeUp(0.05)}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                  September cohort filling fast — spaces are limited
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.12)}
              className="font-display text-5xl sm:text-6xl lg:text-[3.5rem] xl:text-[4rem] font-black leading-[1.05] tracking-tight text-slate-900"
              data-tina-field={tinaDocument ? tinaField(tinaDocument, "heroHeadline") : undefined}
            >
              {heroHeadline ?? "Start your career."}<br />
              The government<br />
              <span
                style={{
                  background: "linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                picks up the bill.
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.2)}
              className="text-xl text-slate-500 leading-relaxed max-w-lg"
              data-tina-field={tinaDocument ? tinaField(tinaDocument, "heroSubtext") : undefined}
            >
              {heroSubtext ?? <>Join <strong className="text-slate-800">11,000+ learners</strong> on the UK&apos;s leading government-funded apprenticeship platform. Real job. Real wage. Real qualification. <strong className="text-slate-800">Zero fees.</strong></>}
            </motion.p>

            {/* Trust row */}
            <motion.div {...fadeUp(0.26)} className="flex items-center gap-5 flex-wrap">
              {([
                { val: trustLine1 ?? "Ofsted Good — independently verified", field: "heroTrustLine1" },
                { val: trustLine2 ?? "85% qualification success rate", field: "heroTrustLine2" },
                { val: trustLine3 ?? "100% government funded — zero fees", field: "heroTrustLine3" },
              ] as const).map(({ val, field }, i) => (
                <React.Fragment key={field}>
                  {i > 0 && <span className="w-1 h-1 rounded-full bg-slate-300" />}
                  <div
                    className="flex items-center gap-1.5 text-sm text-slate-500 font-semibold"
                    data-tina-field={tinaDocument ? tinaField(tinaDocument, field) : undefined}
                  >
                    <CheckCircle className="text-sky-500 flex-shrink-0" style={{ width: 16, height: 16 }} />
                    {val}
                  </div>
                </React.Fragment>
              ))}
            </motion.div>

            {/* Two CTAs */}
            <motion.div {...fadeUp(0.34)} className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold px-8 py-4 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg text-base"
              >
                Find my apprenticeship
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/#cta"
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-8 py-4 rounded-full transition-all text-base"
              >
                I&apos;m an employer — show me how it works
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.p {...fadeUp(0.4)} className="text-xs text-slate-400 font-medium">
              No fees. No obligation. We call back within one working day.
            </motion.p>

          </div>

          {/* ── Right col — full-height image ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            className="lg:col-span-6 hidden lg:flex items-end relative"
            style={{ height: 600 }}
          >
            <div className="absolute inset-0 rounded-tl-3xl overflow-hidden">
              <Image
                src={heroImage1 ?? "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=85"}
                alt="Apprentices in training session"
                fill className="object-cover" priority sizes="50vw"
                data-tina-field={tinaDocument ? tinaField(tinaDocument, "heroImage1") : undefined}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 45%, rgba(15,23,42,0.55) 100%)" }} />
            </div>

            {/* Floating stat — outside left */}
            <div className="absolute -left-6 top-20 bg-white rounded-2xl shadow-xl border border-slate-100 px-5 py-4 z-10 animate-float">
              <div className="text-3xl font-black text-slate-900 leading-none">11,000+</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">People started their career with us this year</div>
            </div>

            {/* Ofsted badge — top right */}
            <div
              className="absolute top-16 right-6 bg-white rounded-2xl shadow-xl border border-slate-100 px-5 py-4 z-10 animate-float"
              style={{ animationDelay: "1.2s" }}
            >
              <div className="flex gap-0.5 mb-1">
                {[1,2,3,4,5].map((i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
              </div>
              <div className="font-black text-slate-900 text-sm">Ofsted Good</div>
              <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Delivering since 1995</div>
            </div>

            {/* Bottom enrolment card */}
            <div className="absolute bottom-8 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 z-10 border border-white/60 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Places available now</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">Business Administrator · Level 3 — Fully Funded</div>
                </div>
                <div className="bg-sky-600 text-white text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0">Apply today</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
