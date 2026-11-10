import React from 'react';
import { BookOpen, ArrowUp } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { DEVELOPER_CONFIG } from '../../config/developer';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-[#123D32] text-[#FAF8F3] border-t border-[#1E6652]/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        {/* Three Columns on Desktop, Stacked on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 mb-12">
          
          {/* Column 1 — Noor-ul-Quran */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#1E6652] flex items-center justify-center text-[#FAF8F3] border border-[#B49352]/30">
                <BookOpen className="w-4 h-4 text-[#FAF8F3]" strokeWidth={2} />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#FAF8F3]">
                Noor-ul-Quran
              </span>
            </div>
            <p className="text-sm font-medium text-[#B49352]">
              Read, Listen &amp; Understand.
            </p>
            <p className="text-sm text-[#FAF8F3]/75 leading-relaxed max-w-sm">
              A simple space to read the Quran, explore Urdu translation, and listen to recitation.
            </p>
          </div>

          {/* Column 2 — Explore */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#B49352] mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm text-[#FAF8F3]/80">
              <li>
                <button
                  onClick={() => handleNavigate('/')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('/surahs')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  All Surahs
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('/bookmarks')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  My Bookmarks
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3 — About & Sources */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#B49352] mb-4">
              About &amp; Sources
            </h3>
            <ul className="space-y-2.5 text-sm text-[#FAF8F3]/80">
              <li>
                <button
                  onClick={() => handleNavigate('/about#objective')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Project Objective
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('/about#developer')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Meet the Developer
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('/about#sources')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Quran Text &amp; Translation Sources
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('/about#audio-credits')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Audio Credits
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Subtle divider */}
        <div className="border-t border-[#1E6652]/70 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF8F3]/70">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-center sm:text-left">
              <span>Noor-ul-Quran · University Educational Project</span>
              <span aria-hidden="true">·</span>
              <span>
                Developed by{' '}
                <button
                  onClick={() => handleNavigate('/about#developer')}
                  className="text-[#FAF8F3] font-medium underline underline-offset-2 hover:text-[#B49352] transition-colors cursor-pointer"
                >
                  {DEVELOPER_CONFIG.name}
                </button>
              </span>
            </div>

            {/* Back to top control */}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1E6652]/60 hover:bg-[#1E6652] text-[#FAF8F3] transition-colors text-xs font-medium cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B49352]"
              aria-label="Back to top of page"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 text-[#B49352]" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
