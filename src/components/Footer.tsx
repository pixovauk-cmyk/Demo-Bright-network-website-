"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";

const IconX = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.733-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const IconLinkedIn = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);
const IconYouTube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);

const links = {
  Programmes: [
    { label: "Business & Admin", href: "/courses?sector=business" },
    { label: "Digital & Tech",   href: "/courses?sector=tech" },
    { label: "Finance",          href: "/courses?sector=finance" },
    { label: "All Courses",      href: "/courses" },
  ],
  Employers: [
    { label: "Why BrightPeak",   href: "/#why" },
    { label: "How It Works",     href: "/#how" },
    { label: "Levy Calculator",  href: "https://apps.brightpeakgroup.com/levy-calculator.html" },
    { label: "Book a Call",      href: "/#cta" },
  ],
  Learners: [
    { label: "Browse Vacancies", href: "https://apps.brightpeakgroup.com/vacancies.html" },
    { label: "CV Builder",       href: "https://apps.brightpeakgroup.com/cv-builder.html" },
    { label: "Off-the-Job",      href: "https://apps.brightpeakgroup.com/off-the-job.html" },
    { label: "Success Stories",  href: "/#testimonials" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  }

  return (
    <footer className="bg-[#F4F6FF] border-t border-slate-200">
      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">

          {/* Brand col — 2 cols wide */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6 hover:opacity-70 transition-opacity">
              <Image
                src="/bp_logo_original.png"
                alt="BrightPeak"
                width={150}
                height={42}
                className="object-contain h-9 w-auto"
              />
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-5">
              Government funded apprenticeships tailored to your business.
              Infrastructure of a large provider. Care of a small one.
            </p>

            {/* Contact */}
            <div className="space-y-2.5 mb-6">
              {[
                { Icon: Phone,  text: "01246 918 340" },
                { Icon: Mail,   text: "contact@brightpeakgroup.com" },
                { Icon: MapPin, text: "4 Babington Lane, Derby, DE1 1SU" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-xs font-medium text-slate-500">
                  <Icon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex gap-2 mb-6">
              {[
                { Icon: IconX,        label: "X (Twitter)",  href: "https://x.com/brightpeakgroup" },
                { Icon: IconLinkedIn, label: "LinkedIn",     href: "https://www.linkedin.com/company/brightpeak-group" },
                { Icon: IconYouTube,  label: "YouTube",      href: "https://www.youtube.com/@brightpeakgroup" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-white hover:bg-sky-600 hover:border-sky-600 transition-all shadow-sm"
                >
                  <Icon />
                </a>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Ofsted Good",  icon: <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-amber-500"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg> },
                { label: "30+ Years",    icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 text-sky-500"><circle cx="8" cy="8" r="6.5"/><path strokeLinecap="round" d="M8 4.5V8l2 2"/></svg> },
                { label: "85% Success", icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-emerald-500"><polyline points="1 11 5 7 9 9 15 3"/><polyline points="11 3 15 3 15 7"/></svg> },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-500 shadow-sm"
                >
                  {b.icon}
                  {b.label}
                </div>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section} className="lg:col-span-1">
              <h3 className="text-[#040B18] font-bold text-xs mb-5 uppercase tracking-widest">{section}</h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-slate-500 hover:text-sky-600 text-sm transition-colors duration-150"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter col */}
          <div className="lg:col-span-1">
            <h3 className="text-[#040B18] font-bold text-xs mb-5 uppercase tracking-widest">Subscribe</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-4">
              Policy updates, funding news, and sector insights. Monthly, no spam.
            </p>

            {subscribed ? (
              <div className="text-emerald-600 text-xs font-semibold flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm3.78-9.72a.75.75 0 0 0-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l4.5-4.5Z" clipRule="evenodd"/></svg>
                Subscribed! Check your inbox.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Your work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl placeholder-slate-400 text-sm font-medium text-[#040B18] focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-colors shadow-sm"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 text-white rounded-xl text-xs font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-1.5 hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)" }}
                >
                  Subscribe <ArrowRight className="w-3 h-3" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">© 2026 BrightPeak Group. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="https://apps.brightpeakgroup.com/privacy.html" className="text-slate-400 hover:text-sky-600 text-xs transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
