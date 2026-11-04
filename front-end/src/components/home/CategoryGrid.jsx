import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Tilt from 'react-parallax-tilt';
import {
  Landmark,
  FileCheck,
  Banknote,
  TrainFront,
  Shield,
  Siren,
  GraduationCap,
  Stethoscope,
  Trophy,
  Building2,
  ArrowRight
} from 'lucide-react';
import { EXAM_CATEGORIES } from '../../utils/examData';
import api from '../../services/api';

const iconMap = {
  landmark: Landmark,
  Landmark,
  'file-check': FileCheck,
  FileCheck,
  banknote: Banknote,
  Banknote,
  'train-front': TrainFront,
  TrainFront,
  shield: Shield,
  Shield,
  siren: Siren,
  Siren,
  'graduation-cap': GraduationCap,
  GraduationCap,
  stethoscope: Stethoscope,
  Stethoscope,
  trophy: Trophy,
  Trophy,
  'building-2': Building2,
  Building2,
};

export default function CategoryGrid() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = i18n.language === 'hi' ? 'hi' : 'en';

  const [categoriesList, setCategoriesList] = useState(EXAM_CATEGORIES);

  // Dynamic fetch categories from backend API / MongoDB Atlas
  useEffect(() => {
    let isMounted = true;
    api.getCategories().then((data) => {
      if (isMounted && data && Array.isArray(data) && data.length > 0) {
        setCategoriesList(data);
      }
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/50 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-blue-600">
            {t('categories.badge')}
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E2A5A] tracking-tight">
            {t('categories.heading')}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 font-normal">
            {t('categories.subheading')}
          </p>
        </div>

        {/* 3D Category Tiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 sm:gap-6">
          {categoriesList.map((cat, idx) => {
            const IconComponent = iconMap[cat.icon] || Landmark;

            return (
              <Tilt
                key={cat.id || idx}
                tiltMaxAngleX={12}
                tiltMaxAngleY={12}
                perspective={1000}
                scale={1.03}
                transitionSpeed={400}
                className="h-full"
              >
                <div
                  onClick={() => navigate(`/exams/${cat.id}`)}
                  className="cursor-pointer bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-blue-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all flex flex-col items-center text-center h-full group relative overflow-hidden"
                >
                  {/* Top Ambient Glow on Hover */}
                  <div
                    className="absolute -top-12 -right-12 w-28 h-28 rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur-xl"
                    style={{ backgroundColor: cat.color }}
                  />

                  {/* 3D Floating Icon Badge */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4 shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                    style={{ backgroundColor: cat.color }}
                  >
                    <IconComponent className="w-7 h-7" />
                  </div>

                  {/* Category Title */}
                  <h3 className="text-sm font-bold text-[#1E2A5A] group-hover:text-blue-600 transition-colors line-clamp-1">
                    {cat.name[currentLang] || cat.name.en}
                  </h3>

                  {/* Exam Count */}
                  <p className="text-[11px] text-slate-400 font-medium mt-1">
                    {cat.exams.length} {t('categories.examsCount')}
                  </p>

                  {/* Little Arrow Indicator */}
                  <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-center text-[11px] font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{t('categories.explore')}</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </Tilt>
            );
          })}
        </div>
      </div>
    </section>
  );
}
