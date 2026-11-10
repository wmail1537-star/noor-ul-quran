import React, { useState } from 'react';
import { BookOpen, Bookmark, Info, Menu, X, Compass, ArrowRight } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';

export const Navbar: React.FC = () => {
  const { route, navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/', active: route.type === 'home' },
    { label: 'All Surahs', path: '/surahs', active: route.type === 'surahs' || route.type === 'reader' },
    { label: 'My Bookmarks', path: '/bookmarks', active: route.type === 'bookmarks' },
    { label: 'About', path: '/about', active: route.type === 'about' },
  ];

  const handleLinkClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#123D32] text-white border-b border-[#123D32]/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          
          {/* Zone 1: Single text element wordmark with clean book icon */}
          <button
            onClick={() => handleLinkClick('/')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B49352] rounded-md px-1 py-1"
            aria-label="Noor-ul-Quran Home"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1E6652] flex items-center justify-center text-[#FAF8F3] border border-[#B49352]/30 shrink-0">
              <BookOpen className="w-4 h-4 text-[#FAF8F3]" strokeWidth={2.2} />
            </div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#FAF8F3] whitespace-nowrap">
              Noor-ul-Quran
            </span>
          </button>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium" aria-label="Main Navigation">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => handleLinkClick(item.path)}
                className={`relative py-1 text-sm tracking-wide transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  item.active
                    ? 'text-[#FAF8F3] font-semibold'
                    : 'text-[#FAF8F3]/75 hover:text-[#FAF8F3]'
                }`}
                aria-current={item.active ? 'page' : undefined}
              >
                {item.label}
                {item.active && (
                  <span className="absolute -bottom-2.5 left-0 right-0 h-0.5 bg-[#B49352] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleLinkClick('/surahs')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1E6652] hover:bg-[#1E6652]/85 active:bg-[#123D32] border border-[#B49352]/30 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B49352]"
            >
              <span>Read Quran</span>
              <ArrowRight className="w-4 h-4 text-[#B49352]" />
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#FAF8F3]/80 hover:text-white hover:bg-[#1E6652] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B49352]"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1E6652] bg-[#123D32] px-4 pt-3 pb-5 space-y-1">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => handleLinkClick(item.path)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-base font-medium transition-colors text-left ${
                item.active
                  ? 'bg-[#1E6652] text-white font-semibold'
                  : 'text-[#FAF8F3]/80 hover:bg-[#1E6652]/50 hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              {item.label === 'Home' && <BookOpen className="w-4 h-4 text-[#B49352]" />}
              {item.label === 'All Surahs' && <Compass className="w-4 h-4 text-[#B49352]" />}
              {item.label === 'My Bookmarks' && <Bookmark className="w-4 h-4 text-[#B49352]" />}
              {item.label === 'About' && <Info className="w-4 h-4 text-[#B49352]" />}
            </button>
          ))}
          <div className="pt-2">
            <button
              onClick={() => handleLinkClick('/surahs')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#1E6652] hover:bg-[#1E6652]/85 rounded-lg border border-[#B49352]/30"
            >
              <span>Start Reading</span>
              <ArrowRight className="w-4 h-4 text-[#B49352]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
