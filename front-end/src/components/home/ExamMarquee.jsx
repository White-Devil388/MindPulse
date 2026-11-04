import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ExamMarquee() {
  const { t } = useTranslation();

  const exams = [
    'UPSC CSE', 'SSC CGL', 'IBPS PO', 'RRB NTPC', 'SBI PO',
    'CDS', 'NDA', 'NEET UG', 'JEE Main', 'MPPSC',
    'UPPSC', 'BPSC', 'CTET', 'UGC NET', 'AFCAT',
    'Delhi Police', 'GATE', 'CUET UG', 'ISRO'
  ];

  return (
    <section className="py-6 sm:py-8 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-3 text-center">
        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
          {t('hero.trustedBy')}
        </p>
      </div>

      <div className="relative w-full overflow-hidden flex items-center">
        {/* Gradient fades on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Marquee Track */}
        <div className="flex gap-4 animate-marquee whitespace-nowrap py-2">
          {exams.concat(exams).map((exam, idx) => (
            <div
              key={idx}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700 font-semibold text-xs sm:text-sm shadow-sm hover:border-blue-400 hover:text-blue-600 transition-all cursor-default select-none"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
              {exam}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

