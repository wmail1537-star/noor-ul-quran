import React, { useMemo, useState } from 'react';
import { Search, X, Compass, ChevronRight, BookOpen } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { getAllSurahs, normalizeSearchTerm } from '../services/quranService';
import { SurahMeta } from '../types/quran';

export const AllSurahsPage: React.FC = () => {
  const { navigate } = useRouter();
  const allSurahs = useMemo(() => getAllSurahs(), []);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Meccan' | 'Medinan'>('all');

  const filteredSurahs = useMemo(() => {
    let list = allSurahs;

    // Filter by revelation classification
    if (filterType !== 'all') {
      list = list.filter((s) => s.revelationType === filterType);
    }

    // Filter by search query (number, Arabic name, English name, translation)
    if (searchQuery.trim()) {
      const q = normalizeSearchTerm(searchQuery);
      const rawQuery = searchQuery.trim();

      list = list.filter((s) => {
        // Match Surah number directly
        if (s.number.toString() === rawQuery) return true;

        // Match normalized English name
        const normEnglish = normalizeSearchTerm(s.englishName);
        if (normEnglish.includes(q)) return true;

        // Match normalized translation meaning
        const normTrans = normalizeSearchTerm(s.englishNameTranslation);
        if (normTrans.includes(q)) return true;

        // Match normalized Arabic name
        const normArabic = normalizeSearchTerm(s.name);
        if (normArabic.includes(q) || s.name.includes(rawQuery)) return true;

        return false;
      });
    }

    return list;
  }, [allSurahs, searchQuery, filterType]);

  const handleCardClick = (surahNumber: number) => {
    navigate(`/surah/${surahNumber}`);
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setFilterType('all');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Context Header */}
        <div className="mb-8 sm:mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1E6652] mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>The Holy Quran</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#202923]">
            All 114 Surahs
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#66736C]">
            Select any Surah to begin reading with authentic Arabic text, Urdu translation, and recitation audio.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#DFE7DF] shadow-2xs mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#66736C]">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Surah name, number (e.g. 18, Kahf, يس)..."
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-[#FAF8F3] border border-[#DFE7DF] rounded-lg text-[#202923] placeholder-[#66736C]/60 focus:bg-white focus:outline-hidden focus:border-[#1E6652] focus:ring-1 focus:ring-[#1E6652] transition-colors"
                aria-label="Search Surahs by number, Arabic name, or transliteration"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#66736C] hover:text-[#202923]"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Tabs (Interactive Segmented Control) */}
            <div className="flex items-center gap-1 p-1 bg-[#FAF8F3] rounded-lg border border-[#DFE7DF] w-full md:w-auto">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`flex-1 md:flex-initial px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-white text-[#123D32] shadow-2xs border border-[#DFE7DF]'
                    : 'text-[#66736C] hover:text-[#202923]'
                }`}
              >
                All (114)
              </button>
              <button
                type="button"
                onClick={() => setFilterType('Meccan')}
                className={`flex-1 md:flex-initial px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  filterType === 'Meccan'
                    ? 'bg-white text-[#123D32] shadow-2xs border border-[#DFE7DF]'
                    : 'text-[#66736C] hover:text-[#202923]'
                }`}
              >
                Meccan / مکی (86)
              </button>
              <button
                type="button"
                onClick={() => setFilterType('Medinan')}
                className={`flex-1 md:flex-initial px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  filterType === 'Medinan'
                    ? 'bg-white text-[#123D32] shadow-2xs border border-[#DFE7DF]'
                    : 'text-[#66736C] hover:text-[#202923]'
                }`}
              >
                Medinan / مدنی (28)
              </button>
            </div>

          </div>
        </div>

        {/* Empty State */}
        {filteredSurahs.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center border border-[#DFE7DF] max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F3] border border-[#DFE7DF] flex items-center justify-center text-[#66736C] mx-auto mb-4">
              <Search className="w-6 h-6 text-[#66736C]" />
            </div>
            <h3 className="text-lg font-bold text-[#202923] mb-1">
              No Surahs match your search
            </h3>
            <p className="text-sm text-[#66736C] mb-6">
              We couldn't find any Surahs matching “{searchQuery}”. You can search by Surah number, English name, or Arabic letters.
            </p>
            <button
              type="button"
              onClick={handleResetSearch}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#1E6652] hover:bg-[#1E6652]/90 rounded-lg cursor-pointer"
            >
              <span>Reset Search</span>
            </button>
          </div>
        ) : (
          /* Surah Cards Grid (3 columns on desktop, 2 on tablet, 1 on mobile) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5">
            {filteredSurahs.map((surah) => (
              <div
                key={surah.number}
                onClick={() => handleCardClick(surah.number)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(surah.number);
                  }
                }}
                role="button"
                tabIndex={0}
                className="group relative bg-white hover:bg-[#FAF8F3]/60 rounded-xl p-5 border border-[#DFE7DF] hover:border-[#B49352]/70 shadow-2xs hover:shadow-xs transition-all cursor-pointer text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B49352]"
                aria-label={`Surah ${surah.number}: ${surah.englishName}, ${surah.name}, ${surah.numberOfAyahs} verses, ${surah.revelationType}`}
              >
                <div className="flex items-start justify-between gap-3">
                  
                  {/* Left: Surah Number and English Info */}
                  <div className="flex items-start gap-3.5">
                    {/* Surah Number Icon */}
                    <div className="w-9 h-9 rounded-lg bg-[#FAF8F3] group-hover:bg-white border border-[#DFE7DF] group-hover:border-[#B49352]/50 flex items-center justify-center text-xs font-bold text-[#123D32] shrink-0 tabular-nums">
                      {surah.number}
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-[#202923] group-hover:text-[#123D32] transition-colors leading-snug">
                        {surah.englishName}
                      </h2>
                      <p className="text-xs text-[#66736C] mt-0.5">
                        {surah.englishNameTranslation}
                      </p>
                      
                      {/* Quiet Unboxed Metadata with Typographic Separator */}
                      <div className="flex items-center gap-1.5 text-xs text-[#66736C] mt-2">
                        <span>{surah.numberOfAyahs} Ayahs</span>
                        <span aria-hidden="true">·</span>
                        <span className={surah.revelationType === 'Meccan' ? 'text-[#1E6652]' : 'text-[#B49352]'}>
                          {surah.revelationType === 'Meccan' ? 'Meccan (مكي)' : 'Medinan (مدني)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Traditional Arabic Calligraphy Name */}
                  <div className="text-right shrink-0">
                    <span className="font-arabic text-xl sm:text-2xl text-[#123D32] block group-hover:text-[#1E6652] transition-colors leading-loose" dir="rtl">
                      {surah.name}
                    </span>
                    <span className="inline-flex items-center text-xs text-[#66736C] group-hover:text-[#1E6652] opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Read</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
