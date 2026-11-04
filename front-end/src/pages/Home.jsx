import React from 'react';
import Navbar from '../components/common/Navbar';
import HeroSection from '../components/home/HeroSection';
import ExamMarquee from '../components/home/ExamMarquee';
import CategoryGrid from '../components/home/CategoryGrid';
import FeatureCards from '../components/home/FeatureCards';
import StatsCard from '../components/home/StatsCard';
import Footer from '../components/common/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ExamMarquee />
        <CategoryGrid />
        <FeatureCards />
        <StatsCard />
      </main>
      <Footer />
    </div>
  );
}

