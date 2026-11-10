import React, { useEffect, useState } from 'react';
import { BookOpen, Bookmark, Volume2, ArrowRight, BookMarked, Compass, GraduationCap, Sparkles } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { getLastRead } from '../services/storageService';
import { LastReadPosition } from '../types/quran';

export const HomePage: React.FC = () => {
  const { navigate, jumpToAyah } = useRouter();
  const [lastRead, setLastRead] = useState<LastReadPosition | null>(null);

  useEffect(() => {
    setLastRead(getLastRead());
  }, []);

  const handleContinueReading = () => {
    if (!lastRead) return;
    navigate(`/surah/${lastRead.surahNumber}#ayah-${lastRead.ayahNumber}`);
    setTimeout(() => {
      jumpToAyah(lastRead.ayahNumber);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-[#DFE7DF] bg-gradient-to-b from-white to-[#FAF8F3]">
        {/* Subtle geometric framing */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
          <div className="w-[800px] h-[800px] rounded-full border-[30px] border-[#123D32]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E6652]/10 border border-[#1E6652]/20 text-[#123D32] text-xs font-semibold tracking-wide uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#B49352]" />
            <span>Academic &amp; University Project</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#202923] text-balance leading-tight sm:leading-tight">
            Read, Listen &amp; Understand the Quran
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#66736C] max-w-2xl mx-auto leading-relaxed text-balance">
            Explore the complete Quran with Urdu translation, listen to recitation, and continue your reading at your own pace.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/surahs')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#1E6652] hover:bg-[#1E6652]/90 active:bg-[#123D32] rounded-lg shadow-xs transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B49352]"
            >
              <span>Start Reading</span>
              <ArrowRight className="w-4 h-4 text-[#B49352]" />
            </button>

            <button
              onClick={() => navigate('/bookmarks')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-[#123D32] bg-white hover:bg-[#FAF8F3] border border-[#DFE7DF] rounded-lg shadow-2xs transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B49352]"
            >
              <Bookmark className="w-4 h-4 text-[#B49352]" />
              <span>View Bookmarks</span>
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* 2. Continue Reading Section (Only rendered when last read position exists) */}
        {lastRead && (
          <section
            aria-labelledby="continue-reading-title"
            className="rounded-xl p-6 sm:p-7 bg-white border border-[#B49352]/40 shadow-xs transition-all hover:border-[#B49352]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FAF8F3] border border-[#DFE7DF] flex items-center justify-center text-[#1E6652] shrink-0">
                  <BookMarked className="w-6 h-6 text-[#1E6652]" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#B49352]">
                    Continue Your Reading
                  </div>
                  <h2 id="continue-reading-title" className="text-xl font-bold text-[#202923] mt-0.5">
                    Surah {lastRead.surahNameEnglish}{' '}
                    <span className="font-serif text-[#123D32] font-normal mr-1">
                      ({lastRead.surahNameArabic})
                    </span>
                  </h2>
                  <p className="text-sm text-[#66736C] mt-1">
                    Saved at Ayah {lastRead.ayahNumber} · Surah {lastRead.surahNumber}
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <button
                  onClick={handleContinueReading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1E6652] hover:bg-[#1E6652]/90 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <span>Continue Reading</span>
                  <ArrowRight className="w-4 h-4 text-[#B49352]" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 3. Main Features */}
        <section aria-labelledby="features-heading">
          <div className="text-center mb-10">
            <h2 id="features-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#202923]">
              Core Project Features
            </h2>
            <p className="text-sm text-[#66736C] mt-2">
              Designed for a serene, uncluttered, and comfortable long-form study experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1: Complete Quran */}
            <div className="bg-white rounded-xl p-6 sm:p-7 border border-[#DFE7DF] shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-[#FAF8F3] border border-[#DFE7DF] flex items-center justify-center text-[#1E6652] mb-5">
                <BookOpen className="w-5 h-5 text-[#1E6652]" />
              </div>
              <h3 className="text-lg font-bold text-[#202923] mb-2">
                Complete Quran
              </h3>
              <p className="text-sm text-[#66736C] leading-relaxed">
                Full text of all 114 Surahs preserved in authentic Uthmani script with clear ayah markers and comfortable typography.
              </p>
            </div>

            {/* Feature 2: Urdu Translation */}
            <div className="bg-white rounded-xl p-6 sm:p-7 border border-[#DFE7DF] shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-[#FAF8F3] border border-[#DFE7DF] flex items-center justify-center text-[#1E6652] mb-5">
                <Compass className="w-5 h-5 text-[#1E6652]" />
              </div>
              <h3 className="text-lg font-bold text-[#202923] mb-2">
                Urdu Translation
              </h3>
              <p className="text-sm text-[#66736C] leading-relaxed">
                Authentic Urdu translation by Maulana Fateh Muhammad Jalandhry rendered in elegant, non-clipping Nastaliq script.
              </p>
            </div>

            {/* Feature 3: Audio Recitation */}
            <div className="bg-white rounded-xl p-6 sm:p-7 border border-[#DFE7DF] shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-[#FAF8F3] border border-[#DFE7DF] flex items-center justify-center text-[#1E6652] mb-5">
                <Volume2 className="w-5 h-5 text-[#1E6652]" />
              </div>
              <h3 className="text-lg font-bold text-[#202923] mb-2">
                Audio Recitation
              </h3>
              <p className="text-sm text-[#66736C] leading-relaxed">
                Full-Surah recitations by Sheikh Mishary Rashid Alafasy with playback, seek control, and independent volume adjustment.
              </p>
            </div>

          </div>
        </section>

        {/* 4. Project Introduction */}
        <section className="bg-white rounded-xl p-7 sm:p-8 border border-[#DFE7DF] shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1E6652]">
                <GraduationCap className="w-4 h-4" />
                <span>University Educational Initiative</span>
              </div>
              <h2 className="text-xl font-bold text-[#202923]">
                About the Noor-ul-Quran Project
              </h2>
              <p className="text-sm text-[#66736C] leading-relaxed">
                Noor-ul-Quran was built as an educational university software engineering project to provide an accessible, dignified digital environment for reading the Holy Quran with Urdu translation and audio recitation.
              </p>
            </div>

            <button
              onClick={() => navigate('/about')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#123D32] bg-[#FAF8F3] hover:bg-white border border-[#DFE7DF] rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              <span>Learn About the Project</span>
              <ArrowRight className="w-4 h-4 text-[#B49352]" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
