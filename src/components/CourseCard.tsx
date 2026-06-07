import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Star } from "lucide-react";
import { cn, getLevelLabel, getLevelColor, getSectorLabel, getSectorIcon } from "@/lib/utils";
import type { Course } from "@/lib/courses";

interface Props {
  course: Course;
  className?: string;
  variant?: "dark" | "light";
}

export default function CourseCard({ course, className, variant = "dark" }: Props) {
  const isLight = variant === "light";

  return (
    <Link
      href={`/courses/${course.slug}`}
      className={cn(
        "group block rounded-2xl overflow-hidden transition-all duration-300 h-full",
        isLight
          ? "card-bold hover:shadow-xl"
          : "card-dark hover:border-sky-600/40",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={course.heroImage || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Level badge */}
        <div className="absolute top-3 left-3">
          <span className={cn("text-xs font-bold px-2.5 py-1.5 rounded-lg border backdrop-blur-sm", getLevelColor(course.level))}>
            {getLevelLabel(course.level)}
          </span>
        </div>

        {course.featured && (
          <div className="absolute top-0 right-0 bg-amber-400 border-l-2 border-b-2 border-[#040B18] text-[#040B18] text-[9px] font-black px-3 py-1.5 rounded-bl-2xl uppercase tracking-wider">
            Popular
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Sector */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-sm">{getSectorIcon(course.sector)}</span>
          <span className={cn("text-xs font-semibold uppercase tracking-wide", isLight ? "text-slate-400" : "text-white/40")}>
            {getSectorLabel(course.sector)}
          </span>
        </div>

        <h3 className={cn(
          "font-display font-bold text-lg mb-1.5 line-clamp-2 group-hover:text-sky-600 transition-colors",
          isLight ? "text-[#040B18]" : "text-white"
        )}>
          {course.title}
        </h3>

        <p className={cn("text-sm mb-4 line-clamp-2 leading-relaxed", isLight ? "text-slate-500" : "text-white/50")}>
          {course.tagline}
        </p>

        {/* Star rating row */}
        {isLight && (
          <div className="flex items-center gap-1.5 mb-4">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs text-slate-400 font-semibold">5.0  Ofsted Good</span>
          </div>
        )}

        {/* Footer */}
        <div className={cn("flex items-center justify-between pt-4 border-t", isLight ? "border-slate-100" : "border-white/8")}>
          <div className="flex items-center gap-4">
            <div className={cn("flex items-center gap-1.5 text-xs", isLight ? "text-slate-400" : "text-white/40")}>
              <Clock className="w-3.5 h-3.5" />
              <span>{course.duration}</span>
            </div>
            {isLight && (
              <span className="text-xs font-black text-emerald-600">Free</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sky-600 text-xs font-semibold group-hover:gap-2 transition-all">
            Learn more <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
