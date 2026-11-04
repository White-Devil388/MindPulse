import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Languages, Menu, X, BookOpen, Layers } from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('examprep_lang', nextLang);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-6 lg:px-8 py-3 transition-all duration-300">
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#1E2A5A]/90 backdrop-blur-md border border-white/20 shadow-xl shadow-blue-950/20'
            : 'bg-white/15 backdrop-blur-md border border-white/30 shadow-lg shadow-blue-950/10'
        }`}
      >
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2.5 group shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center shadow-md shadow-cyan-500/30 group-hover:scale-105 transition-transform">
            <span className="font-extrabold text-white text-base sm:text-lg">M</span>
          </div>
          <span className="text-base sm:text-xl font-extrabold tracking-tight text-white drop-shadow-sm flex items-center">
            Mind<span className="text-cyan-300 ml-0.5">Pulse</span>
          </span>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-semibold text-white">
          <Link
            to="/"
            className="hover:text-cyan-300 transition-colors drop-shadow-sm py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-cyan-300 hover:after:w-full after:transition-all"
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/exams"
            className="hover:text-cyan-300 transition-colors drop-shadow-sm py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-cyan-300 hover:after:w-full after:transition-all"
          >
            {t('nav.exams')}
          </Link>
          <Link
            to="/mock-tests"
            className="hover:text-cyan-300 transition-colors drop-shadow-sm py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-cyan-300 hover:after:w-full after:transition-all"
          >
            {t('nav.mockTests')}
          </Link>
          <Link
            to="/pyq"
            className="hover:text-cyan-300 transition-colors drop-shadow-sm py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-cyan-300 hover:after:w-full after:transition-all"
          >
            {t('nav.pyq')}
          </Link>
          <Link
            to="/dashboard"
            className="hover:text-cyan-300 transition-colors drop-shadow-sm py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-cyan-300 hover:after:w-full after:transition-all"
          >
            {t('nav.dashboard')}
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-[11px] sm:text-xs font-bold text-white backdrop-blur-sm border border-white/30 transition-all hover:scale-105 shadow-sm whitespace-nowrap"
            title="Switch Language (English / Hindi)"
          >
            <Languages className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
            <span>{i18n.language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Sign In Button */}
          <Link
            to="/login"
            className="px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white text-blue-900 font-bold text-xs sm:text-sm shadow-md shadow-blue-950/20 hover:bg-cyan-50 hover:shadow-cyan-400/20 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
          >
            {t('nav.signIn')}
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-7xl mx-auto rounded-3xl bg-[#1E2A5A]/95 backdrop-blur-xl border border-white/20 p-5 shadow-2xl text-white space-y-3 animate-in fade-in slide-in-from-top-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl hover:bg-white/10 font-semibold text-sm"
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/exams"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl hover:bg-white/10 font-semibold text-sm"
          >
            {t('nav.exams')}
          </Link>
          <Link
            to="/mock-tests"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl hover:bg-white/10 font-semibold text-sm"
          >
            {t('nav.mockTests')}
          </Link>
          <Link
            to="/pyq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl hover:bg-white/10 font-semibold text-sm"
          >
            {t('nav.pyq')}
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl hover:bg-white/10 font-semibold text-sm"
          >
            {t('nav.dashboard')}
          </Link>
        </div>
      )}
    </header>
  );
}
