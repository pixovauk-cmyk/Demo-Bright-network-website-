import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLevelLabel(level: string) {
  const map: Record<string, string> = {
    "2": "Level 2",
    "3": "Level 3",
    "4": "Level 4",
    "5": "Level 5",
  };
  return map[level] ?? `Level ${level}`;
}

export function getSectorLabel(sector: string) {
  const map: Record<string, string> = {
    business: "Business & Admin",
    tech: "Digital & Tech",
    finance: "Finance",
    manufacturing: "Manufacturing",
    logistics: "Logistics",
    leadership: "Leadership",
  };
  return map[sector] ?? sector;
}

export function getLevelColor(level: string) {
  const map: Record<string, string> = {
    "2": "bg-emerald-900/40 text-emerald-400 border-emerald-700/40",
    "3": "bg-cyan-900/40 text-cyan-300 border-cyan-700/40",
    "4": "bg-sky-900/40 text-sky-300 border-sky-700/40",
    "5": "bg-amber-900/40 text-amber-300 border-amber-700/40",
  };
  return map[level] ?? "bg-white/10 text-white/60 border-white/15";
}

export function getSectorIcon(sector: string) {
  const map: Record<string, string> = {
    business: "📊",
    tech: "💻",
    finance: "💰",
    manufacturing: "🏭",
    logistics: "📦",
    leadership: "🎯",
  };
  return map[sector] ?? "📚";
}
