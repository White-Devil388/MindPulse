import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import HeroScene from '../three/HeroScene';

export default function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/exams?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/exams');
    }
  };

  const examBadges = ['UPSC', 'SSC CGL', 'IBPS PO', 'RRB NTPC', 'NDA', 'NEET UG'];

  return (
    <section className="relative bg-hero-gradient pt-24 sm:pt-28 md:pt-32 pb-28 md:pb-36 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
      {/* Background Decorative 3D Spheres / Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none -z-0" />
      
      {/* Floating 3D Diamond / Geometry Shapes */}
      <div className="absolute top-24 left-1/4 w-4 h-4 bg-white/40 rotate-45 rounded-sm animate-pulse pointer-events-none" />
      <div className="absolute bottom-40 left-12 w-6 h-6 border-2 border-cyan-300/60 rotate-12 rounded-sm pointer-events-none" />
      <div className="absolute top-1/3 right-12 w-5 h-5 bg-cyan-200/50 rotate-45 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: Headline, subtext, search bar, badges */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Subtle Tagline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-cyan-200 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>{t('hero.tagline')}</span>
          </div>

          {/* Big Bold Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white drop-shadow-sm">
            {t('hero.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
            {t('hero.subtitle')}
          </p>

          {/* Input + CTA Action Container (matching reference image pill row) */}
          <form
            onSubmit={handleSubmit}
            className="p-1 sm:p-1.5 bg-white rounded-full shadow-2xl shadow-blue-950/30 flex items-center max-w-xl mx-auto lg:mx-0 border border-white/80 transition-all hover:shadow-cyan-500/10"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('hero.inputPlaceholder')}
              className="flex-1 min-w-0 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-slate-800 text-xs sm:text-sm font-medium focus:outline-none placeholder:text-slate-400 bg-transparent"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-indigo-500/25 active:scale-95 transition-all whitespace-nowrap shrink-0"
            >
              <span>{t('hero.cta')}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </form>

          {/* Partner / Exam Badges */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 text-xs text-blue-100 font-medium">
            <span className="opacity-90">Popular exams:</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {examBadges.map((badge) => (
                <button
                  key={badge}
                  onClick={() => navigate(`/exams?search=${encodeURIComponent(badge)}`)}
                  className="px-2.5 py-1 rounded-md bg-white/15 hover:bg-white/25 border border-white/20 transition-colors text-white font-semibold text-[11px]"
                >
                  {badge}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Video Scene */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="w-full relative">
            <HeroScene />
          </div>
        </div>
      </div>

      {/* Curved SVG Wave Divider at bottom (matches reference) */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 sm:h-16 md:h-24 object-fill"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32L60,42.7C120,53,240,75,360,80C480,85,600,75,720,58.7C840,43,960,21,1080,21.3C1200,21,1320,43,1380,53.3L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  );
}
