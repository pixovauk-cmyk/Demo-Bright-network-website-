"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

const levels = [
  { value: "", label: "All Levels" },
  { value: "2", label: "Level 2" },
  { value: "3", label: "Level 3" },
  { value: "4", label: "Level 4" },
  { value: "5", label: "Level 5" },
];

const sectors = [
  { value: "", label: "All Sectors" },
  { value: "business", label: "Business & Admin" },
  { value: "tech", label: "Digital & Tech" },
  { value: "finance", label: "Finance" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "logistics", label: "Logistics" },
];

export default function CoursesFilter() {
  const router = useRouter();
  const params = useSearchParams();
  const level = params.get("level") ?? "";
  const sector = params.get("sector") ?? "";

  const update = useCallback(
    (key: string, value: string) => {
      const p = new URLSearchParams(params.toString());
      if (value) p.set(key, value);
      else p.delete(key);
      router.push(`/courses?${p.toString()}`);
    },
    [params, router]
  );

  return (
    <div className="flex flex-wrap gap-2 mb-10 pb-8 border-b border-slate-200">
      {/* Levels */}
      <div className="flex flex-wrap gap-2">
        {levels.map((l) => (
          <button
            key={l.value}
            onClick={() => update("level", l.value)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200",
              level === l.value
                ? "bg-peak text-white border-transparent shadow-md shadow-sky-200"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900"
            )}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="w-px bg-slate-200 hidden sm:block mx-1" />

      {/* Sectors */}
      <div className="flex flex-wrap gap-2">
        {sectors.map((s) => (
          <button
            key={s.value}
            onClick={() => update("sector", s.value)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200",
              sector === s.value
                ? "bg-amber text-white border-transparent shadow-md shadow-amber-100"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900"
            )}
            style={sector === s.value ? { backgroundColor: '#D97706' } : {}}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
