import React from 'react';
import { useTranslation } from 'react-i18next';
import Tilt from 'react-parallax-tilt';
import { Sparkles, Globe2, BookOpen, Clock, BarChart3, FileUp, ArrowUpRight } from 'lucide-react';

export default function FeatureCards() {
  const { t } = useTranslation();

  const features = [
    {
      id: 'f1',
      title: t('features.f1_title'),
      desc: t('features.f1_desc'),
      icon: Sparkles,
      gradient: 'from-blue-600 to-indigo-700',
      badgeColor: '#3B82F6',
      offsetClass: 'md:translate-y-0',
      tag: '100% Free',
      bgImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'f2',
      title: t('features.f2_title'),
      desc: t('features.f2_desc'),
      icon: Globe2,
      gradient: 'from-cyan-500 to-teal-600',
      badgeColor: '#06B6D4',
      offsetClass: 'md:translate-y-8',
      tag: 'Bilingual',
      bgImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'f3',
      title: t('features.f3_title'),
      desc: t('features.f3_desc'),
      icon: BookOpen,
      gradient: 'from-sky-500 to-blue-700',
      badgeColor: '#0284C7',
      offsetClass: 'md:translate-y-16',
      tag: 'PYQ 2015-2025',
      bgImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'f4',
      title: t('features.f4_title'),
      desc: t('features.f4_desc'),
      icon: Clock,
      gradient: 'from-violet-600 to-purple-700',
      badgeColor: '#8B5CF6',
      offsetClass: 'md:translate-y-0',
      tag: 'TCS-iON Engine',
      bgImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'f5',
      title: t('features.f5_title'),
      desc: t('features.f5_desc'),
      icon: BarChart3,
      gradient: 'from-amber-500 to-orange-600',
      badgeColor: '#F59E0B',
      offsetClass: 'md:translate-y-8',
      tag: 'AI Analytics',
      bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'f6',
      title: t('features.f6_title'),
      desc: t('features.f6_desc'),
      icon: FileUp,
      gradient: 'from-emerald-500 to-teal-700',
      badgeColor: '#10B981',
      offsetClass: 'md:translate-y-16',
      tag: 'Instant Generator',
      bgImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#EAF6FF]/80 relative overflow-hidden">
      {/* Background Floating Orbs */}
      <div className="absolute top-12 left-10 w-64 h-64 bg-cyan-200/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-16 right-10 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs uppercase font-bold tracking-widest text-blue-600">
            {t('features.badge')}
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#1E2A5A] tracking-tight">
            {t('features.heading')}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500">
            {t('features.subheading')}
          </p>
        </div>

        {/* Staggered Masonry Grid of 3D Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 pb-16 pt-10">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className={`${item.offsetClass} transition-transform`}>
                <Tilt
                  tiltMaxAngleX={10}
                  tiltMaxAngleY={10}
                  perspective={1200}
                  scale={1.02}
                  transitionSpeed={500}
                  className="h-full"
                >
                  <div
                    className="relative rounded-3xl p-6 sm:p-7 pt-16 shadow-2xl shadow-blue-950/20 border-2 border-white/80 flex flex-col justify-between h-full group preserve-3d overflow-visible"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* 100% Full Visibility Background Picture */}
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
                      <img
                        src={item.bgImage}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                      />
                      {/* Subtle dark tint to pop the white text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-slate-900/20" />
                    </div>

                    {/* Top Overflowing Circular 3D Gradient Badge */}
                    <div
                      className="absolute -top-10 left-8 w-20 h-20 rounded-full p-1.5 bg-white shadow-2xl shadow-black/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 z-20 border-2 border-white"
                      style={{ transform: 'translateZ(50px)' }}
                    >
                      <div
                        className={`w-full h-full rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-inner`}
                      >
                        <Icon className="w-8 h-8 drop-shadow-md" />
                      </div>
                    </div>

                    {/* Tag pill top right with glass effect */}
                    <div
                      className="self-end mb-4 text-[11px] font-bold text-white bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/30 shadow-md z-10"
                      style={{ transform: 'translateZ(25px)' }}
                    >
                      {item.tag}
                    </div>

                    {/* Glass Text Box - 100% clear readable on top of full image */}
                    <div
                      className="space-y-2.5 z-10 relative p-4 rounded-2xl bg-slate-950/40 backdrop-blur-md border border-white/15 shadow-lg mt-8"
                      style={{ transform: 'translateZ(30px)' }}
                    >
                      <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight group-hover:text-cyan-300 transition-colors drop-shadow-md">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-normal drop-shadow-sm">
                        {item.desc}
                      </p>
                    </div>

                    {/* Bottom Action Pill Button */}
                    <div className="pt-6 z-10 relative flex justify-start" style={{ transform: 'translateZ(40px)' }}>
                      <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-cyan-400 text-blue-950 hover:text-blue-950 text-xs font-bold shadow-lg hover:shadow-cyan-400/30 transition-all active:scale-95">
                        <span>Explore Feature</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </Tilt>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
