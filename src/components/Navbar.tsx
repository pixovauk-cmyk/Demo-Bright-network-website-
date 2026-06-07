"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Programmes", href: "/courses" },
  {
    label: "For Employers",
    href: "/#why",
    sub: [
      { label: "Why BrightPeak", href: "/#why" },
      { label: "How It Works",   href: "/#how" },
      { label: "Book a Call",    href: "/#cta" },
    ],
  },
  {
    label: "For Learners",
    href: "/courses",
    sub: [
      { label: "Browse Courses",              href: "/courses" },
      { label: "What is an Apprenticeship?",  href: "/#how" },
    ],
  },
  { label: "Success Stories", href: "/#testimonials" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setActiveDropdown(null); }, [pathname]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/96 backdrop-blur-md border-b border-slate-100 shadow-sm py-3"
          : "bg-transparent border-b border-transparent py-1.5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <Image
              src="/bp_logo_original.png"
              alt="BrightPeak Apprenticeships"
              width={148}
              height={46}
              className={cn(
                "w-auto object-contain transition-all duration-300",
                scrolled ? "h-8 opacity-90 group-hover:opacity-70" : "h-9 group-hover:opacity-80"
              )}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {nav.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.sub && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150",
                    pathname === item.href
                      ? "text-sky-600 bg-sky-50"
                      : "text-slate-600 hover:text-[#040B18] hover:bg-slate-50"
                  )}
                >
                  {item.label}
                  {item.sub && <ChevronDown className="w-3.5 h-3.5 opacity-40" />}
                </Link>

                {item.sub && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-2 w-54 bg-white border border-slate-100 rounded-xl shadow-xl shadow-black/6 py-1.5 z-50">
                    {item.sub.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className="block px-4 py-2.5 text-sm text-slate-500 hover:text-[#040B18] hover:bg-slate-50 transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/#cta" className="btn-primary text-sm py-2.5 px-5">
              Book Free Call
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {nav.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:text-[#040B18] hover:bg-slate-50 transition-colors"
                >
                  {item.label}
                </Link>
                {item.sub && (
                  <div className="pl-4 mt-0.5 space-y-0.5">
                    {item.sub.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setOpen(false)}
                        className="block px-4 py-2.5 rounded-lg text-xs text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3 border-t border-slate-100">
              <Link
                href="/#cta"
                onClick={() => setOpen(false)}
                className="block w-full text-center px-5 py-3.5 rounded-xl text-sm font-bold text-white transition-colors"
                style={{ background: "linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)" }}
              >
                Book Free Call
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
