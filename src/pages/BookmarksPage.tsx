import React, { useEffect, useState } from 'react';
import { Bookmark, Trash2, ArrowRight, BookOpen, Compass, ExternalLink } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { getBookmarks, removeBookmark } from '../services/storageService';
import { Bookmark as BookmarkItem } from '../types/quran';

export const BookmarksPage: React.FC = () => {
  const { navigate, jumpToAyah } = useRouter();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const handleOpenBookmark = (surahNumber: number, ayahNumber: number) => {
    navigate(`/surah/${surahNumber}#ayah-${ayahNumber}`);
    setTimeout(() => {
      jumpToAyah(ayahNumber);
    }, 150);
  };

  const handleRemoveBookmark = (surahNumber: number, ayahNumber: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = removeBookmark(surahNumber, ayahNumber);
    setBookmarks(updated);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1E6652] mb-2">
            <Bookmark className="w-3.5 h-3.5 text-[#B49352]" />
            <span>Saved Verses</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#202923]">
            My Bookmarks
          </h1>
          <p className="mt-2 text-sm text-[#66736C]">
            Quickly return to verses you have saved during your reading sessions. All bookmarks are stored locally in your browser.
          </p>
        </div>

        {/* Empty State */}
        {bookmarks.length === 0 ? (
          <div className="bg-white rounded-xl p-10 sm:p-14 text-center border border-[#DFE7DF] shadow-2xs max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#FAF8F3] border border-[#DFE7DF] flex items-center justify-center text-[#B49352] mx-auto mb-5">
              <Bookmark className="w-6 h-6 text-[#1E6652]" />
            </div>
            <h2 className="text-xl font-bold text-[#202923] mb-2">
              No bookmarks saved yet
            </h2>
            <p className="text-sm text-[#66736C] leading-relaxed mb-6">
              When reading any Surah, click the bookmark icon on any ayah to save it here for fast reference.
            </p>
            <button
              type="button"
              onClick={() => navigate('/surahs')}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#1E6652] hover:bg-[#1E6652]/90 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#B49352]" />
              <span>Start Reading</span>
            </button>
          </div>
        ) : (
          /* Bookmarks List */
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#66736C] px-1 mb-2">
              <span>{bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'} saved</span>
              <span>Saved locally in browser</span>
            </div>

            {bookmarks.map((b) => (
              <div
                key={b.id}
                onClick={() => handleOpenBookmark(b.surahNumber, b.ayahNumber)}
                className="group bg-white rounded-xl p-5 sm:p-6 border border-[#DFE7DF] hover:border-[#B49352] shadow-2xs hover:shadow-xs transition-all cursor-pointer relative"
              >
                <div className="flex items-start justify-between gap-4 border-b border-[#DFE7DF]/70 pb-3 mb-3">
                  
                  {/* Surah Name & Ayah Number */}
                  <div>
                    <h2 className="text-base font-bold text-[#202923] group-hover:text-[#123D32] transition-colors flex items-center gap-2">
                      <span>Surah {b.surahNameEnglish}</span>
                      <span className="text-[#66736C] font-normal text-xs">
                        (Ayah {b.ayahNumber})
                      </span>
                    </h2>
                    <p className="text-xs text-[#66736C] mt-0.5">
                      Surah {b.surahNumber} · {b.surahNameArabic}
                    </p>
                  </div>

                  {/* Actions: Open & Remove */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenBookmark(b.surahNumber, b.ayahNumber)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#1E6652] hover:bg-[#1E6652]/90 rounded-md transition-colors cursor-pointer shadow-2xs"
                      aria-label={`Open Surah ${b.surahNumber} Ayah ${b.ayahNumber}`}
                    >
                      <span>Open Ayah</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#B49352]" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleRemoveBookmark(b.surahNumber, b.ayahNumber, e)}
                      className="p-1.5 text-[#66736C] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                      title="Remove bookmark"
                      aria-label={`Remove bookmark for Surah ${b.surahNumber} Ayah ${b.ayahNumber}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

                {/* Exact Arabic Preview */}
                <div className="font-arabic text-[#202923] text-right text-xl leading-relaxed py-1 line-clamp-2" dir="rtl">
                  {b.arabicText}
                </div>

                {/* Urdu Translation Preview */}
                {b.urduText && (
                  <div className="font-urdu text-[#66736C] text-right text-sm leading-relaxed pt-2 mt-2 border-t border-[#DFE7DF]/50 line-clamp-2" dir="rtl">
                    {b.urduText}
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
