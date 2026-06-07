"use client";

import { useState } from "react";
import { X, Mail, Lock, User, Building2, MessageSquare, ArrowRight, CheckCircle } from "lucide-react";

interface Props {
  courseTitle: string;
  courseLevel: string;
  onClose: () => void;
}

type Tab = "signin" | "request";
type UserType = "learner" | "employer";

export default function EnrollModal({ courseTitle, courseLevel, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("request");
  const [userType, setUserType] = useState<UserType>("learner");
  const [submitted, setSubmitted] = useState(false);

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  if (submitted) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(4,11,24,0.85)", backdropFilter: "blur(6px)" }}
        onClick={handleBackdrop}
      >
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-slate-900 font-extrabold text-2xl mb-2">Request received</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            A BrightPeak consultant will contact you within one working day to discuss your place on{" "}
            <span className="font-semibold text-slate-700">{courseTitle}</span>.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={onClose}
              className="btn-primary w-full justify-center"
              style={{ display: "flex" }}
            >
              Back to programme
            </button>
          </div>
          <p className="text-slate-400 text-xs mt-5">No commitment required. We&apos;ll never hard sell.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(4,11,24,0.85)", backdropFilter: "blur(6px)" }}
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">

        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-100 px-7 pt-7 pb-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs font-semibold text-sky-600 uppercase tracking-widest">{courseLevel}</span>
              <h2 className="text-slate-900 font-extrabold text-xl mt-1 leading-snug">{courseTitle}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors flex-shrink-0 ml-3"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1">
            <button
              onClick={() => setTab("request")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === "request"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Request a Place
            </button>
            <button
              onClick={() => setTab("signin")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === "signin"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-7 py-6">

          {tab === "request" && (
            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="space-y-4"
            >
              {/* I am a… toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["learner", "employer"] as UserType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setUserType(t)}
                      className={`py-2.5 rounded-xl text-sm font-semibold border transition-all capitalize ${
                        userType === t
                          ? "bg-sky-50 border-sky-300 text-sky-700"
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {t === "learner" ? "Learner / Applicant" : "Employer"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Jane Smith"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="jane@company.co.uk"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Organisation — shows for employer */}
              {userType === "employer" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Organisation
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Company name"
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Anything else? <span className="font-normal text-slate-400 normal-case">(optional)</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <textarea
                    rows={2}
                    placeholder={userType === "employer" ? "How many learners are you looking to enrol?" : "Tell us a bit about your current situation..."}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 text-slate-900 placeholder-slate-400 resize-none"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center mt-1" style={{ display: "flex" }}>
                Submit Request <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {tab === "signin" && (
            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@company.co.uk"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Password
                  </label>
                  <button type="button" className="text-xs text-sky-600 hover:text-sky-800 font-medium">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center" style={{ display: "flex" }}>
                Sign In <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-xs text-slate-400 pt-1">
                No account yet?{" "}
                <button
                  type="button"
                  onClick={() => setTab("request")}
                  className="text-sky-600 font-semibold hover:text-sky-800"
                >
                  Request a place
                </button>
              </p>
            </form>
          )}
        </div>

        {/* Footer trust */}
        <div className="px-7 pb-6">
          <div className="border-t border-slate-100 pt-4 flex flex-wrap justify-center gap-5 text-slate-400 text-xs">
            {["Ofsted Good", "100% Government Funded", "No cost to employer"].map((t) => (
              <span key={t} className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-sky-400 inline-block" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
