import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Tilt from 'react-parallax-tilt';
import { useInView } from 'framer-motion';
import { TrendingUp, Users, BookCheck, Award, Sparkles } from 'lucide-react';
import api from '../../services/api';

function AnimatedCounter({ targetNumber, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = targetNumber;
    const totalFrames = Math.round(duration * 60);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
      const currentVal = Math.round(progress * end);
      setCount(currentVal);

      if (frame >= totalFrames) {
        setCount(end);
        clearInterval(timer);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, targetNumber, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsCard() {
  const { t } = useTranslation();
  const [liveStats, setLiveStats] = useState({
    totalQuestions: 2200,
    totalMockTests: 7,
    totalAspirants: 12400,
    totalExams: 88,
  });

  // Fetch dynamic live platform statistics directly from MongoDB Atlas
  useEffect(() => {
    let isMounted = true;
    api.getPlatformOverview().then((data) => {
      if (isMounted && data) {
        setLiveStats(data);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const stats = [
    {
      target: liveStats.totalQuestions || 2200,
      suffix: '+',
      label: t('stats.questions'),
      icon: BookCheck,
      gradient: 'from-blue-600 to-cyan-500',
    },
    {
      target: liveStats.totalMockTests || 7,
      suffix: '+',
      label: t('stats.mockTests'),
      icon: Award,
      gradient: 'from-indigo-600 to-blue-500',
    },
    {
      target: liveStats.totalAspirants || 12400,
      suffix: '+',
      label: t('stats.aspirants'),
      icon: Users,
      gradient: 'from-cyan-500 to-teal-500',
    },
    {
      target: liveStats.totalExams || 88,
      suffix: '+',
      label: t('stats.exams'),
      icon: TrendingUp,
      gradient: 'from-purple-600 to-indigo-500',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#EAF6FF]/80 via-white to-white relative overflow-hidden">
      {/* Background soft ambient glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-80 h-80 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <Tilt
          tiltMaxAngleX={4}
          tiltMaxAngleY={4}
          perspective={1200}
          glareEnable={false}
          className="w-full"
        >
          {/* Main 3D Card Container */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-12 lg:p-14 shadow-2xl shadow-blue-900/10 border border-white/80 ring-1 ring-slate-100">
            {/* Header Badge & Title */}
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>{t('stats.badge')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E2A5A] tracking-tight">
                {t('stats.heading')}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500">
                {t('stats.subheading')}
              </p>
            </div>

            {/* Metrics 4-Column Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center text-center group ${
                      idx > 1 ? 'pt-6 sm:pt-0' : ''
                    } ${idx % 2 !== 0 ? 'sm:border-l sm:border-slate-100' : ''}`}
                  >
                    {/* 3D Icon Bubble */}
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr ${stat.gradient} flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 mb-4`}
                    >
                      <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>

                    {/* Big Numbers */}
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E2A5A] tracking-tight">
                      <AnimatedCounter
                        targetNumber={stat.target}
                        suffix={stat.suffix}
                        duration={2.5}
                      />
                    </div>

                    {/* Metric Label */}
                    <div className="mt-1.5 text-xs sm:text-sm font-semibold text-slate-500">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Tilt>
      </div>
    </section>
  );
}
