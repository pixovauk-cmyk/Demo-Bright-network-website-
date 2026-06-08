"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/courses";

interface Props {
  testimonials: Testimonial[];
}

const avatarMap: Record<string, string> = {
  "paul-co-op-bank":         "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
  "heather-leeds-building":  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80",
  "anthony-acorn-insurance": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
};

export default function TestimonialsSection({ testimonials }: Props) {
  if (!testimonials.length) return null;

  return (
    <section id="testimonials" className="bg-white py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-sky-600 text-sm font-semibold uppercase tracking-widest">What happened after they said yes</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-black text-[#040B18]">
            Don&apos;t take our word for it. Take theirs.
          </h2>
          <p className="mt-3 text-slate-500 text-lg max-w-lg mx-auto">
            Real outcomes from real organisations. Not marketing speak.
          </p>
        </div>

        {/* Cards — carousel mobile, 3-col grid desktop */}
        <div className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 pb-4 md:grid md:grid-cols-3 md:overflow-visible md:mx-0 md:px-0 md:pb-0">
          {testimonials.map((t) => {
            const img = avatarMap[t.slug];
            return (
              <div
                key={t.slug}
                className="snap-start flex-shrink-0 w-[82vw] sm:w-[60vw] md:w-auto"
              >
                <div className="rounded-3xl p-7 flex flex-col gap-5 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-200 h-full">
                  {/* Stars */}
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-slate-700 text-base leading-relaxed font-medium flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  {/* Result pill */}
                  {t.result && (
                    <div className="inline-flex self-start items-center gap-2 rounded-xl px-3 py-2 bg-sky-50 border border-sky-100">
                      <div className="w-2 h-2 rounded-full flex-shrink-0 bg-sky-400" />
                      <span className="text-xs font-bold text-sky-700">{t.result}</span>
                    </div>
                  )}

                  {/* Attribution */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                    {img ? (
                      <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 shadow-sm border-2 border-white">
                        <Image src={img} alt={t.name} width={44} height={44} className="object-cover w-full h-full" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 bg-sky-100 text-sky-700 border-2 border-white">
                        {t.name[0]}
                      </div>
                    )}
                    <div>
                      <div className="font-display font-bold text-[#040B18] text-sm leading-tight">{t.name}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{t.role}</div>
                      <div className="text-sky-600 text-xs font-semibold mt-0.5">{t.company}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Partner logos */}
        <div className="mt-14 pt-10 border-t border-slate-200/80 text-center">
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-7">Also trusted by</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Co-Operative Bank", "Leeds Building Society", "Acorn Insurance", "Morrisons", "Marriott Hotels", "Nando's"].map((name) => (
              <div
                key={name}
                className="px-5 py-2.5 rounded-xl border-2 border-[#040B18]/8 text-sm text-slate-400 font-medium bg-white hover:border-sky-200 hover:text-slate-600 transition-all"
              >
                {name}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
