"use client";

import React, { useState } from "react";
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
  heroImage2,
  tinaDocument,
}: HeroProps = {}) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (email.trim()) {
      setSent(true);
      setTimeout(() => setSent(false), 4500);
    }
  }

  return (
    <section className="relative bg-white overflow-hidden pt-[52px]">

      {/* Announcement strip */}
      <div
        className="py-2.5 text-center text-xs font-semibold text-white/90 tracking-wide"
        style={{ background: "linear-gradient(90deg, #0284C7 0%, #0369A1 100%)" }}
        data-tina-field={tinaDocument ? tinaField(tinaDocument, "announcementText") : undefined}
      >
        {announcementText ?? <><span className="font-bold">Ofsted Good Provider. Est. 1995.</span>{" "}Government funded. No cost to most employers.</>}{" "}
        <Link href="/#cta" className="underline underline-offset-2 hover:text-white transition-colors">
          Book a free call
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 lg:pt-16 lg:pb-20">
        <div className="grid lg:grid-cols-12 gap-10 xl:gap-16 items-center">

          {/* ── Left col ── */}
          <div className="lg:col-span-6 space-y-7">

            <motion.div {...fadeUp(0.05)}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sky-50 border border-sky-100 rounded-full">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
                  Hiring? We handle everything.
                </span>
              </div>
            </motion.div>

            {/* Headline with highlighted word */}
            <motion.h1
              {...fadeUp(0.12)}
              className="font-display text-5xl sm:text-6xl lg:text-[3.25rem] xl:text-[3.75rem] font-extrabold leading-[1.1] tracking-tight text-[#040B18]"
              data-tina-field={tinaDocument ? tinaField(tinaDocument, "heroHeadline") : undefined}
            >
              {heroHeadline ?? "Build your team."}
              <br />
              The government
              <br />
              <span
                className="text-white inline-block"
                style={{
                  background: "linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)",
                  padding: "2px 14px 10px",
                  borderRadius: "10px",
                  transform: "rotate(1.5deg)",
                  display: "inline-block",
                  marginTop: "6px",
                }}
              >
                pays.
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.2)}
              className="text-xl text-slate-500 leading-relaxed max-w-lg font-medium"
              data-tina-field={tinaDocument ? tinaField(tinaDocument, "heroSubtext") : undefined}
            >
              {heroSubtext ?? <>We handle everything — recruitment, training, qualification.{" "}<strong className="text-[#040B18]">You get the talent. Zero cost.</strong></>}
            </motion.p>

            {/* Compact trust row */}
            <motion.div {...fadeUp(0.26)} className="flex items-center gap-5 flex-wrap">
              {([
                { val: trustLine1 ?? "Named account manager", field: "heroTrustLine1" },
                { val: trustLine2 ?? "Ofsted Good",           field: "heroTrustLine2" },
                { val: trustLine3 ?? "100% funded",           field: "heroTrustLine3" },
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

            {/* Email form */}
            <motion.div {...fadeUp(0.34)} className="space-y-2.5">
              {sent ? (
                <div className="flex items-center gap-2.5 text-sm text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-5 py-3.5 rounded-full max-w-md">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Done! A consultant will reach out within one working day.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
                  <input
                    type="email"
                    required
                    placeholder="Enter your work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-5 py-3.5 text-sm border-2 border-slate-200 rounded-full focus:outline-none focus:border-sky-400 placeholder-slate-400 font-medium text-[#040B18] bg-white transition-colors"
                  />
                  <button type="submit" className="btn-primary whitespace-nowrap text-sm py-3.5">
                    Book Free Call <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
              <p className="text-xs text-slate-400 font-medium ml-1">
                Free 30 min discovery call. No commitment.
              </p>
            </motion.div>

          </div>

          {/* ── Right col — tilted card composition ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            className="lg:col-span-6 hidden lg:flex justify-center items-center py-8"
          >
            <div className="relative" style={{ width: 420, height: 480 }}>

              {/* Decorative dot — top right */}
              <div className="absolute rounded-full pointer-events-none" style={{ width: 14, height: 14, background: "#FB923C", top: 10, right: 40 }} aria-hidden />
              {/* Decorative dot — bottom left */}
              <div className="absolute rounded-full pointer-events-none" style={{ width: 10, height: 10, background: "#34D399", bottom: 30, left: 10 }} aria-hidden />

              {/* ── Main card — tilted left ── */}
              <div
                className="absolute overflow-hidden shadow-2xl"
                style={{
                  width: 340, height: 420,
                  top: 20, left: 0,
                  borderRadius: 28,
                  transform: "rotate(-3deg)",
                  border: "5px solid white",
                }}
              >
                <Image
                  src={heroImage1 ?? "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&q=85"}
                  alt="Team training session"
                  fill className="object-cover" priority sizes="340px"
                  data-tina-field={tinaDocument ? tinaField(tinaDocument, "heroImage1") : undefined}
                />
                {/* Subtle dark overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040B18]/30 via-transparent to-transparent" />
              </div>

              {/* ── Second card — bottom-right, counter-tilted ── */}
              <div
                className="absolute overflow-hidden shadow-xl z-10"
                style={{
                  width: 168, height: 188,
                  bottom: 0, right: 0,
                  borderRadius: 20,
                  transform: "rotate(2.5deg)",
                  border: "5px solid white",
                }}
              >
                <Image
                  src={heroImage2 ?? "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=350&q=85"}
                  alt="Apprentice professional"
                  fill className="object-cover object-top" sizes="168px"
                  data-tina-field={tinaDocument ? tinaField(tinaDocument, "heroImage2") : undefined}
                />
              </div>

              {/* Floating badge — top right, outside main card */}
              <div
                className="absolute bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 z-20 animate-float"
                style={{ top: 30, right: 0 }}
              >
                <div className="flex gap-0.5 mb-1">
                  {[1,2,3,4,5].map((i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                </div>
                <div className="text-[12px] font-black text-[#040B18]">Ofsted Good</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Est. 1995</div>
              </div>

              {/* Floating badge — left, mid-card */}
              <div
                className="absolute bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 z-20 animate-float"
                style={{ bottom: 110, left: 0, animationDelay: "0.8s" }}
              >
                <div className="text-sky-600 font-black text-xl leading-none">85%</div>
                <div className="text-[11px] text-slate-500 font-semibold mt-1">Success Rate</div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
