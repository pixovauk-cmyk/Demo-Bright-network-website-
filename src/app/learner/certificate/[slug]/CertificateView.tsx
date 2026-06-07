'use client'

import Link from 'next/link'
import { Award, ArrowLeft, Printer } from 'lucide-react'

interface Props {
  learnerName: string
  courseTitle: string
  courseLevel: string
  completionDate: string
  courseSlug: string
}

export default function CertificateView({ learnerName, courseTitle, courseLevel, completionDate, courseSlug }: Props) {
  const formattedDate = new Date(completionDate).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-6">
      {/* Actions */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/learner"
          className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      {/* Certificate */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-sky-600 print:shadow-none print:rounded-none print:border-4">

        {/* Top band */}
        <div className="bg-sky-600 px-10 py-6 flex items-center justify-between">
          <div>
            <div className="text-sky-200 text-xs font-semibold tracking-widest uppercase mb-1">BrightPeak Apprenticeships</div>
            <div className="text-white font-bold text-lg">Certificate of Completion</div>
          </div>
          <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
            <Award className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Body */}
        <div className="px-10 py-12 text-center">
          <p className="text-slate-500 text-sm mb-3 tracking-wide uppercase font-medium">This is to certify that</p>
          <h1 className="text-4xl font-black text-slate-900 mb-4" style={{ fontFamily: 'var(--font-jakarta)' }}>
            {learnerName}
          </h1>
          <p className="text-slate-500 text-sm mb-2">has successfully completed</p>
          <h2 className="text-xl font-bold text-sky-700 mb-1">{courseTitle}</h2>
          <p className="text-slate-400 text-sm mb-8">Level {courseLevel} Apprenticeship Programme</p>

          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-5 py-2.5 rounded-full mb-10">
            <Award className="w-4 h-4" /> All modules completed · {formattedDate}
          </div>

          {/* Signature line */}
          <div className="flex items-end justify-center gap-16 pt-6 border-t border-slate-100">
            <div className="text-center">
              <div className="text-2xl font-black text-slate-800 mb-1" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                BrightPeak
              </div>
              <div className="w-32 h-px bg-slate-300 mx-auto mb-1" />
              <div className="text-xs text-slate-400">Training Director</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-300 mb-1 font-mono">{courseSlug.toUpperCase()}</div>
              <div className="w-32 h-px bg-slate-300 mx-auto mb-1" />
              <div className="text-xs text-slate-400">Certificate Ref.</div>
            </div>
          </div>
        </div>

        {/* Footer band */}
        <div className="bg-slate-50 border-t border-slate-100 px-10 py-4 flex items-center justify-between text-xs text-slate-400">
          <span>Issued by BrightPeak Apprenticeships · brightpeakgroup.com</span>
          <span>Ofsted Good Rated</span>
        </div>
      </div>
    </div>
  )
}
