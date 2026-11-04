import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Tilt from 'react-parallax-tilt';
import { Search, ChevronRight, BookOpen, Layers, Award } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { EXAM_CATEGORIES, toSlug } from '../utils/examData';
import { useDebounce } from '../hooks/useDebounce';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import api from '../services/api';

const INITIAL_VISIBLE_COUNT = 3;

export default function Exams() {
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialSearch = searchParams.get('search') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchTerm, 250);
  const [selectedCat, setSelectedCat] = useState('all');
  const [categoriesList, setCategoriesList] = useState(EXAM_CATEGORIES);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const currentLang = i18n.language === 'hi' ? 'hi' : 'en';

  // Fetch categories from backend MongoDB Atlas with cancel cleanup
  useEffect(() => {
    let isMounted = true;
    api.getCategories().then((data) => {
      if (isMounted && data && Array.isArray(data) && data.length > 0) {
        setCategoriesList(data);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // useMemo: Filter categories and exams without recalculating on unrelated renders
  const filteredCategories = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();

    return categoriesList
      .map((cat) => {
        const matchesCategory = selectedCat === 'all' || selectedCat === cat.id;
        if (!matchesCategory) return null;

        const matchingExams = cat.exams.filter((exam) =>
          exam.toLowerCase().includes(query)
        );

        if (query && matchingExams.length === 0) return null;

        return {
          ...cat,
          filteredExams: query ? matchingExams : cat.exams,
        };
      })
      .filter(Boolean);
  }, [categoriesList, selectedCat, debouncedSearch]);

  // Reset visible infinite scroll count on search or category filter change
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [debouncedSearch, selectedCat]);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 2);
  }, []);

  const hasMore = visibleCount < filteredCategories.length;
  const { sentinelRef } = useInfiniteScroll(handleLoadMore, hasMore, false);

  const displayedCategories = useMemo(() => {
    return filteredCategories.slice(0, visibleCount);
  }, [filteredCategories, visibleCount]);

  const handleExamClick = useCallback(
    (categoryId, examName) => {
      navigate(`/exams/${categoryId}/${toSlug(examName)}`);
    },
    [navigate]
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="bg-hero-gradient pb-16">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 text-center text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Explore All Government & Competitive Exams
          </h1>
          <p className="mt-3 text-sm sm:text-base text-blue-100 max-w-2xl mx-auto">
            Choose from 10 main categories and 80+ examinations. Practice topic-wise MCQs, attempt full-length timed mock tests, and download PYQs.
          </p>

          {/* Search bar with debounced input */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search exam (e.g. UPSC, SSC CGL, IBPS, NDA)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white text-slate-800 placeholder:text-slate-400 shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 text-sm font-medium"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedCat('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCat === 'all'
                  ? 'bg-white text-blue-900 shadow-md'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              All Categories
            </button>
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCat === cat.id
                    ? 'bg-white text-blue-900 shadow-md'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {cat.name[currentLang] || cat.name.en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-12">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <p className="text-lg font-bold text-slate-700">No matching exams found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search query or clear filters.</p>
          </div>
        ) : (
          <>
            {displayedCategories.map((cat) => (
              <div key={cat.id} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-8 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <h2 className="text-xl sm:text-2xl font-bold text-[#1E2A5A]">
                      {cat.name[currentLang] || cat.name.en}
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                    {cat.filteredExams.length} Available
                  </span>
                </div>

                {/* Exam Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {cat.filteredExams.map((examName) => (
                    <Tilt
                      key={examName}
                      tiltMaxAngleX={8}
                      tiltMaxAngleY={8}
                      perspective={1000}
                      scale={1.02}
                      className="h-full"
                    >
                      <div
                        onClick={() => handleExamClick(cat.id, examName)}
                        className="cursor-pointer bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between h-full group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span
                              className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md text-white"
                              style={{ backgroundColor: cat.color }}
                            >
                              Govt Exam
                            </span>
                            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                              Free
                            </span>
                          </div>
                          <h3 className="font-bold text-[#1E2A5A] text-base group-hover:text-blue-600 transition-colors">
                            {examName}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">
                            Full Mock Tests • PYQ Papers • Topic Practice
                          </p>
                        </div>

                        <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                          <span>Start Practice</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Tilt>
                  ))}
                </div>
              </div>
            ))}

            {/* Sentinel for Infinite Scroll */}
            {hasMore && (
              <div ref={sentinelRef} className="py-6 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Loading more categories automatically...</span>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
