import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-hero-gradient-deep text-white pt-16 pb-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Top Wave */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none -translate-y-1">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-12 object-fill"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C360,40 1080,40 1440,0 L1440,0 L0,0 Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pt-6 pb-12 border-b border-white/10">
        {/* Brand */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center font-bold text-white shadow-md">
              M
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Mind<span className="text-cyan-300">Pulse</span>
            </span>
          </div>
          <p className="text-xs text-blue-200/80 leading-relaxed font-light">
            {t('footer.desc')}
          </p>
          <div className="flex items-center gap-2 text-xs text-cyan-300 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>100% Free & Open Practice</span>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold tracking-wider text-cyan-300 uppercase">
            {t('footer.categories')}
          </h4>
          <ul className="space-y-2 text-xs text-blue-100">
            <li><Link to="/exams/civil-services" className="hover:text-cyan-300 transition-colors">Civil Services (UPSC, State PSC)</Link></li>
            <li><Link to="/exams/ssc" className="hover:text-cyan-300 transition-colors">SSC (CGL, CHSL, MTS, GD)</Link></li>
            <li><Link to="/exams/banking" className="hover:text-cyan-300 transition-colors">Banking (IBPS, SBI, RBI)</Link></li>
            <li><Link to="/exams/railway" className="hover:text-cyan-300 transition-colors">Railway (RRB NTPC, ALP)</Link></li>
            <li><Link to="/exams/defence" className="hover:text-cyan-300 transition-colors">Defence (NDA, CDS, AFCAT)</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold tracking-wider text-cyan-300 uppercase">
            {t('footer.quickLinks')}
          </h4>
          <ul className="space-y-2 text-xs text-blue-100">
            <li><Link to="/exams" className="hover:text-cyan-300 transition-colors">All Examinations</Link></li>
            <li><Link to="/mock-tests" className="hover:text-cyan-300 transition-colors">Timed Mock Tests</Link></li>
            <li><Link to="/pyq" className="hover:text-cyan-300 transition-colors">Previous Year Papers</Link></li>
            <li><Link to="/daily-quiz" className="hover:text-cyan-300 transition-colors">Daily 10-Question Quiz</Link></li>
            <li><Link to="/pdf-mock-test" className="hover:text-cyan-300 transition-colors">PDF to Mock Test</Link></li>
          </ul>
        </div>

        {/* Free Commitment Card */}
        <div className="p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-3">
          <div className="flex items-center gap-2 text-yellow-300 text-sm font-bold">
            <HeartHandshake className="w-5 h-5" />
            <span>Community Driven</span>
          </div>
          <p className="text-xs text-blue-100 leading-relaxed">
            MindPulse will remain free forever for every student across India. No paywalls, no subscriptions.
          </p>
          <Link
            to="/exams"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-white transition-colors"
          >
            <span>Start Practice Today</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-blue-200/70 gap-4">
        <div>© 2026 MindPulse. {t('footer.rights')}</div>
        <div className="flex gap-6">
          <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/" className="hover:text-white transition-colors">Support & Feedback</Link>
        </div>
      </div>
    </footer>
  );
}

