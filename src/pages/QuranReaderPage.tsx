import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Type,
  RotateCcw,
  BookOpen,
  Info,
  Loader2,
  AlertTriangle,
  Compass
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import {
  getSurahDetail,
  getSurahMeta,
  BISMILLAH_TEXT,
  URDU_TRANSLATOR,
  AUDIO_RECITER,
} from '../services/quranService';
import {
  getBookmarks,
  saveBookmark,
  removeBookmark,
  isBookmarked,
  saveLastRead,
  getPreferences,
  savePreferences,
} from '../services/storageService';
import { Ayah, SurahDetail, ReadingPreferences } from '../types/quran';
import { AudioPlayer } from '../components/audio/AudioPlayer';

interface QuranReaderPageProps {
  surahNumber: number;
}

export const QuranReaderPage: React.FC<QuranReaderPageProps> = ({ surahNumber }) => {
  const { navigate, jumpToAyah, route } = useRouter();

  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User reading preferences
  const [prefs, setPrefs] = useState<ReadingPreferences>(() => getPreferences());
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<number>>(new Set());

  // Show / hide Introduction card
  const [showIntro, setShowIntro] = useState(false);

  // Jump to Ayah selection
  const [selectedJumpAyah, setSelectedJumpAyah] = useState<string>('');

  // Toast feedback for bookmark action
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load bookmarks set for current surah
  const refreshBookmarksState = useCallback(() => {
    const list = getBookmarks();
    const currentSurahAyahs = new Set<number>();
    for (const b of list) {
      if (b.surahNumber === surahNumber) {
        currentSurahAyahs.add(b.ayahNumber);
      }
    }
    setBookmarkedAyahs(currentSurahAyahs);
  }, [surahNumber]);

  // Load Surah details
  const fetchSurah = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSurahDetail(surahNumber);
      setSurah(data);
      refreshBookmarksState();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while loading Surah text.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [surahNumber, refreshBookmarksState]);

  useEffect(() => {
    fetchSurah();
  }, [fetchSurah]);

  // Scroll to target ayah if deep-linked via hash or router (e.g. #ayah-255)
  useEffect(() => {
    if (!loading && surah && route.targetAyah) {
      setTimeout(() => {
        jumpToAyah(route.targetAyah!);
      }, 200);
    }
  }, [loading, surah, route.targetAyah, jumpToAyah]);

  // Meaningful reading tracking: IntersectionObserver saves last read position
  // only when an ayah is actually viewed in reading viewport
  useEffect(() => {
    if (!surah || loading) return;

    let timeoutId: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const ayahId = entry.target.getAttribute('data-ayah-num');
            if (ayahId) {
              const ayahNum = parseInt(ayahId, 10);
              // Debounce to ensure reader is genuinely reading this verse
              clearTimeout(timeoutId);
              timeoutId = setTimeout(() => {
                saveLastRead({
                  surahNumber: surah.number,
                  ayahNumber: ayahNum,
                  surahNameArabic: surah.name,
                  surahNameEnglish: surah.englishName,
                  updatedAt: Date.now(),
                });
              }, 1800);
            }
          }
        }
      },
      {
        rootMargin: '-20% 0px -40% 0px',
        threshold: 0.5,
      }
    );

    const ayahElements = document.querySelectorAll('.ayah-row');
    ayahElements.forEach((el) => observer.observe(el));

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [surah, loading]);

  // Bookmark toggle handler
  const handleToggleBookmark = (ayah: Ayah) => {
    if (!surah) return;
    const isCurrentlyBookmarked = bookmarkedAyahs.has(ayah.numberInSurah);

    if (isCurrentlyBookmarked) {
      removeBookmark(surah.number, ayah.numberInSurah);
      setToastMessage(`Removed bookmark for Ayah ${ayah.numberInSurah}`);
    } else {
      saveBookmark({
        id: `surah-${surah.number}-ayah-${ayah.numberInSurah}`,
        surahNumber: surah.number,
        ayahNumber: ayah.numberInSurah,
        surahNameArabic: surah.name,
        surahNameEnglish: surah.englishName,
        arabicText: ayah.text,
        urduText: ayah.urduText || '',
        createdAt: Date.now(),
      });
      setToastMessage(`Saved bookmark for Ayah ${ayah.numberInSurah}`);
    }

    refreshBookmarksState();

    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Preference update handlers
  const updatePreference = (updated: Partial<ReadingPreferences>) => {
    const next = savePreferences(updated);
    setPrefs(next);
  };

  const handlePrevSurah = () => {
    if (surahNumber > 1) {
      navigate(`/surah/${surahNumber - 1}`);
    }
  };

  const handleNextSurah = () => {
    if (surahNumber < 114) {
      navigate(`/surah/${surahNumber + 1}`);
    }
  };

  const handleJumpSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedJumpAyah(val);
    if (val) {
      jumpToAyah(parseInt(val, 10));
    }
  };

  // Check if opening Bismillah banner should be rendered
  // Surah 1: Ayah 1 is Bismillah.
  // Surah 9 (At-Tawbah): No Bismillah by Islamic convention.
  // Surahs 2-114 (except 9): Render centered calligraphic Bismillah header before Ayah 1.
  const shouldRenderBismillahHeader = surahNumber !== 1 && surahNumber !== 9;

  return (
    <div className="min-h-screen bg-[#FAF8F3] pb-24">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#123D32] text-white px-4 py-2.5 rounded-lg shadow-lg border border-[#B49352]/40 text-xs sm:text-sm flex items-center gap-2 transition-all">
          <BookmarkCheck className="w-4 h-4 text-[#B49352]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Surah Header Container */}
      <div className="bg-white border-b border-[#DFE7DF] shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          
          {/* Top Back and Navigation Bar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/surahs')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#123D32] hover:text-[#1E6652] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Surahs</span>
            </button>

            {/* Previous and Next Surah Navigation */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevSurah}
                disabled={surahNumber <= 1}
                className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                  surahNumber <= 1
                    ? 'border-[#DFE7DF] text-[#66736C]/40 cursor-not-allowed bg-transparent'
                    : 'border-[#DFE7DF] text-[#123D32] hover:bg-[#FAF8F3] active:bg-[#DFE7DF]/30'
                }`}
                aria-label="Go to previous Surah"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev Surah</span>
              </button>

              <button
                type="button"
                onClick={handleNextSurah}
                disabled={surahNumber >= 114}
                className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                  surahNumber >= 114
                    ? 'border-[#DFE7DF] text-[#66736C]/40 cursor-not-allowed bg-transparent'
                    : 'border-[#DFE7DF] text-[#123D32] hover:bg-[#FAF8F3] active:bg-[#DFE7DF]/30'
                }`}
                aria-label="Go to next Surah"
              >
                <span className="hidden sm:inline">Next Surah</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Surah Main Title Area */}
          <div className="text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F3] border border-[#B49352]/40 text-[#123D32] text-sm font-bold flex items-center justify-center mx-auto tabular-nums">
              {surahNumber}
            </div>

            <h1 className="font-arabic text-4xl sm:text-5xl text-[#123D32] leading-relaxed" dir="rtl">
              {surah ? surah.name : '...'}
            </h1>

            <div className="text-xl sm:text-2xl font-bold text-[#202923]">
              Surah {surah ? surah.englishName : `Surah ${surahNumber}`}
            </div>

            <p className="text-sm text-[#66736C]">
              {surah ? surah.englishNameTranslation : ''}
            </p>

            {/* Surah Metadata Line (Zero-Pill Discipline with Typographic Separators) */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-[#66736C] pt-1">
              <span>{surah ? `${surah.numberOfAyahs} Verses` : '...'}</span>
              <span aria-hidden="true">·</span>
              <span>{surah?.revelationType === 'Meccan' ? 'Meccan / مکی' : 'Medinan / مدنی'}</span>
              <span aria-hidden="true">·</span>
              <span>Urdu: {URDU_TRANSLATOR.name}</span>
              <span aria-hidden="true">·</span>
              <span>Reciter: {AUDIO_RECITER.name}</span>
            </div>

            {/* Toggle Surah Context / Info */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowIntro(!showIntro)}
                className="inline-flex items-center gap-1.5 text-xs text-[#1E6652] hover:text-[#123D32] underline underline-offset-4 cursor-pointer font-medium"
              >
                <Info className="w-3.5 h-3.5 text-[#B49352]" />
                <span>{showIntro ? 'Hide Surah Context' : 'Surah Introduction & Context'}</span>
              </button>
            </div>
          </div>

          {/* Sourced Surah Introduction & Context Section */}
          {showIntro && surah && (
            <section
              aria-label="Surah introduction and context"
              className="mt-6 p-5 sm:p-6 bg-[#FAF8F3] rounded-xl border border-[#DFE7DF] text-left text-sm space-y-3"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#123D32]">
                <BookOpen className="w-4 h-4 text-[#B49352]" />
                <span>Verified Surah Context</span>
              </div>
              <p className="text-[#202923] leading-relaxed">
                <strong>{surah.englishName}</strong> ({surah.name}) is the <strong>{surah.number}th</strong> Surah of the Holy Quran, revealed in{' '}
                <strong>{surah.revelationType === 'Meccan' ? 'Makkah Al-Mukarramah' : 'Madinah Al-Munawwarah'}</strong>. It contains <strong>{surah.numberOfAyahs}</strong> verses.
              </p>
              <div className="text-xs text-[#66736C] border-t border-[#DFE7DF] pt-3">
                <span>Classification: {surah.revelationType}</span>
                <span className="mx-2">·</span>
                <span>Name Meaning: “{surah.englishNameTranslation}”</span>
                <span className="mx-2">·</span>
                <span>Urdu Translator: {URDU_TRANSLATOR.name}</span>
              </div>
            </section>
          )}

          {/* Integrated Authentic Audio Recitation Player */}
          <div className="mt-8">
            <AudioPlayer
              surahNumber={surahNumber}
              surahNameArabic={surah ? surah.name : ''}
              surahNameEnglish={surah ? surah.englishName : ''}
            />
          </div>

        </div>
      </div>

      {/* Sticky Reading Controls Bar */}
      <div className="sticky top-16 z-30 bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[#DFE7DF] py-2.5 px-4 shadow-2xs">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Left Controls: Urdu Translation Visibility Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updatePreference({ showUrdu: !prefs.showUrdu })}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                prefs.showUrdu
                  ? 'bg-[#1E6652] text-white border-[#1E6652]'
                  : 'bg-white text-[#66736C] border-[#DFE7DF] hover:text-[#202923]'
              }`}
              aria-label={prefs.showUrdu ? 'Hide Urdu Translation' : 'Show Urdu Translation'}
            >
              {prefs.showUrdu ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Urdu Translation</span>
            </button>
          </div>

          {/* Middle Controls: Separate Font Sizing for Arabic and Urdu */}
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Arabic Font Size */}
            <div className="flex items-center gap-1.5 bg-white border border-[#DFE7DF] rounded-lg px-2.5 py-1">
              <span className="text-[#66736C] font-semibold text-[11px]">ع Arabic:</span>
              <button
                type="button"
                onClick={() => updatePreference({ arabicFontSize: Math.max(20, prefs.arabicFontSize - 2) })}
                disabled={prefs.arabicFontSize <= 20}
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#FAF8F3] text-xs font-bold disabled:opacity-30 cursor-pointer"
                aria-label="Decrease Arabic font size"
              >
                -
              </button>
              <span className="tabular-nums text-[11px] font-medium text-[#123D32] min-w-[24px] text-center">
                {prefs.arabicFontSize}px
              </span>
              <button
                type="button"
                onClick={() => updatePreference({ arabicFontSize: Math.min(46, prefs.arabicFontSize + 2) })}
                disabled={prefs.arabicFontSize >= 46}
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#FAF8F3] text-xs font-bold disabled:opacity-30 cursor-pointer"
                aria-label="Increase Arabic font size"
              >
                +
              </button>
            </div>

            {/* Urdu Font Size (Visible when Urdu is shown) */}
            {prefs.showUrdu && (
              <div className="flex items-center gap-1.5 bg-white border border-[#DFE7DF] rounded-lg px-2.5 py-1">
                <span className="text-[#66736C] font-semibold text-[11px]">اردو Urdu:</span>
                <button
                  type="button"
                  onClick={() => updatePreference({ urduFontSize: Math.max(14, prefs.urduFontSize - 2) })}
                  disabled={prefs.urduFontSize <= 14}
                  className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#FAF8F3] text-xs font-bold disabled:opacity-30 cursor-pointer"
                  aria-label="Decrease Urdu font size"
                >
                  -
                </button>
                <span className="tabular-nums text-[11px] font-medium text-[#123D32] min-w-[24px] text-center">
                  {prefs.urduFontSize}px
                </span>
                <button
                  type="button"
                  onClick={() => updatePreference({ urduFontSize: Math.min(30, prefs.urduFontSize + 2) })}
                  disabled={prefs.urduFontSize >= 30}
                  className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#FAF8F3] text-xs font-bold disabled:opacity-30 cursor-pointer"
                  aria-label="Increase Urdu font size"
                >
                  +
                </button>
              </div>
            )}
          </div>

          {/* Right Controls: Jump to Ayah */}
          {surah && (
            <div className="flex items-center gap-1.5">
              <label htmlFor="jump-ayah-select" className="text-[#66736C] font-medium text-[11px]">
                Jump:
              </label>
              <select
                id="jump-ayah-select"
                value={selectedJumpAyah}
                onChange={handleJumpSelection}
                className="bg-white border border-[#DFE7DF] rounded-lg px-2.5 py-1 text-xs text-[#202923] focus:outline-hidden focus:border-[#1E6652] cursor-pointer"
              >
                <option value="">Ayah...</option>
                {Array.from({ length: surah.numberOfAyahs }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    Ayah {num}
                  </option>
                ))}
              </select>
            </div>
          )}

        </div>
      </div>

      {/* Main Reading Canvas */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl p-16 text-center border border-[#DFE7DF] shadow-2xs space-y-4">
            <Loader2 className="w-8 h-8 text-[#1E6652] animate-spin mx-auto" />
            <p className="text-sm font-medium text-[#202923]">
              Loading Surah {surahNumber} text and Urdu translation...
            </p>
            <p className="text-xs text-[#66736C]">
              Connecting to verified Uthmani script and Maulana Fateh Muhammad Jalandhry translation.
            </p>
          </div>
        )}

        {/* Error State with Retry Button */}
        {error && !loading && (
          <div className="bg-white rounded-xl p-10 text-center border border-red-200 shadow-2xs space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-[#202923]">
              Unable to load Quran text
            </h3>
            <p className="text-sm text-[#66736C] leading-relaxed">
              {error}
            </p>
            <button
              type="button"
              onClick={fetchSurah}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#1E6652] hover:bg-[#1E6652]/90 rounded-lg cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Content View */}
        {!loading && !error && surah && (
          <div className="space-y-6">
            
            {/* Opening Bismillah Banner */}
            {shouldRenderBismillahHeader && (
              <div className="my-8 py-6 text-center bg-white rounded-xl border border-[#DFE7DF] shadow-2xs">
                <div className="font-arabic text-3xl sm:text-4xl text-[#123D32] leading-relaxed" dir="rtl">
                  {BISMILLAH_TEXT}
                </div>
                <div className="text-xs text-[#66736C] font-urdu mt-1" dir="rtl">
                  شروع الله کا نام لے کر جو بڑا مہربان نہایت رحم والا ہے
                </div>
              </div>
            )}

            {/* Ayahs List */}
            <div className="space-y-5">
              {surah.ayahs.map((ayah) => {
                const bookmarked = bookmarkedAyahs.has(ayah.numberInSurah);

                return (
                  <article
                    key={ayah.numberInSurah}
                    id={`ayah-${ayah.numberInSurah}`}
                    data-ayah-num={ayah.numberInSurah}
                    className="ayah-row bg-white rounded-xl p-5 sm:p-7 border border-[#DFE7DF] hover:border-[#B49352]/50 shadow-2xs transition-all relative group"
                    aria-label={`Ayah ${ayah.numberInSurah}`}
                  >
                    {/* Top Verse Utility Bar: Ayah Number & Bookmark Toggle */}
                    <div className="flex items-center justify-between border-b border-[#DFE7DF]/70 pb-3 mb-4 text-xs text-[#66736C]">
                      
                      {/* Left: Ayah Identifier Badge */}
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-md bg-[#FAF8F3] border border-[#DFE7DF] flex items-center justify-center font-bold text-[#123D32] tabular-nums text-xs">
                          {ayah.numberInSurah}
                        </span>
                        <span className="font-medium text-[#202923]">
                          {surah.englishName} : {ayah.numberInSurah}
                        </span>
                        {ayah.juz && (
                          <span className="hidden sm:inline text-[#66736C]/70">
                            · Para {ayah.juz}
                          </span>
                        )}
                      </div>

                      {/* Right: Accessible Bookmark Action */}
                      <button
                        type="button"
                        onClick={() => handleToggleBookmark(ayah)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs font-medium focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B49352] ${
                          bookmarked
                            ? 'bg-[#1E6652]/10 text-[#1E6652] font-semibold border border-[#1E6652]/30'
                            : 'text-[#66736C] hover:text-[#123D32] hover:bg-[#FAF8F3]'
                        }`}
                        aria-label={
                          bookmarked
                            ? `Remove bookmark for Ayah ${ayah.numberInSurah}`
                            : `Bookmark Ayah ${ayah.numberInSurah}`
                        }
                        title={bookmarked ? 'Bookmarked' : 'Add bookmark'}
                      >
                        {bookmarked ? (
                          <>
                            <BookmarkCheck className="w-4 h-4 text-[#1E6652]" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-4 h-4 text-[#66736C]" />
                            <span className="hidden sm:inline">Bookmark</span>
                          </>
                        )}
                      </button>

                    </div>

                    {/* Arabic Text Display */}
                    <div
                      className="font-arabic text-[#202923] text-right leading-[2.3] select-text tracking-wide pt-2 pb-3"
                      dir="rtl"
                      style={{ fontSize: `${prefs.arabicFontSize}px` }}
                    >
                      {ayah.text}
                      {/* Ayah End Symbol with number */}
                      <span className="ayah-end-marker mx-2.5 text-[#B49352] text-sm align-middle inline-flex items-center justify-center w-7 h-7 rounded-full border border-[#B49352]/70 font-sans tabular-nums font-semibold select-none">
                        {ayah.numberInSurah}
                      </span>
                    </div>

                    {/* Urdu Translation Display */}
                    {prefs.showUrdu && ayah.urduText && (
                      <div className="mt-4 pt-4 border-t border-[#DFE7DF]/60">
                        <div
                          className="font-urdu text-[#202923]/90 text-right leading-[2.4] select-text"
                          dir="rtl"
                          style={{ fontSize: `${prefs.urduFontSize}px` }}
                        >
                          {ayah.urduText}
                        </div>
                      </div>
                    )}

                  </article>
                );
              })}
            </div>

            {/* Bottom Surah Navigation Bar */}
            <div className="pt-8 pb-12 flex items-center justify-between border-t border-[#DFE7DF] mt-10">
              <button
                type="button"
                onClick={handlePrevSurah}
                disabled={surahNumber <= 1}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors cursor-pointer ${
                  surahNumber <= 1
                    ? 'border-[#DFE7DF] text-[#66736C]/40 cursor-not-allowed bg-transparent'
                    : 'border-[#DFE7DF] bg-white text-[#123D32] hover:bg-[#FAF8F3] shadow-2xs'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Surah</span>
              </button>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-xs font-medium text-[#1E6652] hover:underline"
              >
                Back to top
              </button>

              <button
                type="button"
                onClick={handleNextSurah}
                disabled={surahNumber >= 114}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors cursor-pointer ${
                  surahNumber >= 114
                    ? 'border-[#DFE7DF] text-[#66736C]/40 cursor-not-allowed bg-transparent'
                    : 'border-[#DFE7DF] bg-white text-[#123D32] hover:bg-[#FAF8F3] shadow-2xs'
                }`}
              >
                <span>Next Surah</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};
