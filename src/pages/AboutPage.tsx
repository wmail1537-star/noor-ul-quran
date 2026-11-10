import React, { useEffect } from 'react';
import {
  BookOpen,
  Target,
  User,
  ShieldCheck,
  ExternalLink,
  HardDrive,
  Volume2
} from 'lucide-react';
import { DEVELOPER_CONFIG } from '../config/developer';
import { URDU_TRANSLATOR, AUDIO_RECITER } from '../services/quranService';

export const AboutPage: React.FC = () => {
  // Ensure hash anchors scroll into view smoothly when navigating to /about#developer, #objective, etc.
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1E6652] mb-2">
            <BookOpen className="w-3.5 h-3.5 text-[#B49352]" />
            <span>Academic Project Documentation</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#202923]">
            About Noor-ul-Quran
          </h1>
          <p className="mt-2 text-base text-[#66736C]">
            “Read, Listen &amp; Understand” — A university web development project designed for accessible Quran study.
          </p>
        </div>

        {/* Section 1: About Noor-ul-Quran */}
        <section className="bg-white rounded-xl p-7 sm:p-9 border border-[#DFE7DF] shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#123D32]">
            <BookOpen className="w-5 h-5 text-[#1E6652]" />
            <h2 className="text-xl font-bold">About Noor-ul-Quran</h2>
          </div>
          <p className="text-sm sm:text-base text-[#202923] leading-relaxed">
            Noor-ul-Quran is an educational website created to make Quran reading, Urdu translation, and audio recitation accessible through a simple and comfortable interface. It brings all 114 Surahs together in one place, with features that help users navigate, bookmark ayahs, and continue their reading at their own pace.
          </p>
        </section>

        {/* Section 2: Our Objective */}
        <section id="objective" className="bg-white rounded-xl p-7 sm:p-9 border border-[#DFE7DF] shadow-2xs space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2.5 text-[#123D32]">
            <Target className="w-5 h-5 text-[#1E6652]" />
            <h2 className="text-xl font-bold">Our Objective</h2>
          </div>
          <p className="text-sm sm:text-base text-[#202923] leading-relaxed">
            The objective of this university project is to support regular Quran reading and understanding through thoughtful web design. By combining Arabic text, Urdu translation, and recitation with straightforward navigation, Noor-ul-Quran aims to provide a focused and accessible reading experience across mobile, tablet, and desktop devices.
          </p>
        </section>

        {/* Section 3: Meet the Developer */}
        <section id="developer" className="bg-white rounded-xl p-7 sm:p-9 border border-[#DFE7DF] shadow-2xs space-y-6 scroll-mt-24">
          <div className="flex items-center gap-2.5 text-[#123D32]">
            <User className="w-5 h-5 text-[#1E6652]" />
            <h2 className="text-xl font-bold">Meet the Developer</h2>
          </div>

          {/* Developer Card Design: side-by-side on desktop, stacked on mobile */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 pt-1">
            
            {/* Initials Avatar "SM" */}
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#123D32] border-2 border-[#B49352]/40 text-[#FAF8F3] flex items-center justify-center font-serif text-3xl font-bold tracking-wider shadow-xs shrink-0 select-none"
              aria-label={`Initials avatar for ${DEVELOPER_CONFIG.name}`}
            >
              {DEVELOPER_CONFIG.initials}
            </div>

            {/* Developer Details & Bio */}
            <div className="space-y-3.5 text-center sm:text-left flex-1">
              <div>
                <h3 className="text-2xl font-bold text-[#123D32]">
                  {DEVELOPER_CONFIG.name}
                </h3>
                <p className="text-sm font-medium text-[#66736C] mt-0.5">
                  {DEVELOPER_CONFIG.role}
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#202923] leading-relaxed">
                {DEVELOPER_CONFIG.introduction}
              </p>

              <p className="text-sm sm:text-base text-[#202923] leading-relaxed">
                {DEVELOPER_CONFIG.supportingParagraph}
              </p>
            </div>

          </div>
        </section>

        {/* Section 4: Sources & Credits */}
        <section id="sources" className="bg-white rounded-xl p-7 sm:p-9 border border-[#DFE7DF] shadow-2xs space-y-6 scroll-mt-24">
          <div className="flex items-center gap-2.5 text-[#123D32]">
            <ShieldCheck className="w-5 h-5 text-[#1E6652]" />
            <h2 className="text-xl font-bold">Sources &amp; Credits</h2>
          </div>

          <p className="text-sm text-[#66736C] leading-relaxed">
            Noor-ul-Quran relies on established, verified open data sources for Quranic text, Urdu translation, and audio recitation. Website engineering and frontend design are conducted by <strong>Shamza Maqbool</strong>, which is distinct from the authorship, compilation, and scholarly review of the underlying third-party religious content, translations, and audio recordings. The developer makes no claim to scholarly religious authority or ownership over sacred texts.
          </p>

          <div className="space-y-4">
            
            {/* Arabic Quran Source */}
            <div className="p-4 rounded-lg bg-[#FAF8F3] border border-[#DFE7DF]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-[#123D32]">
                  1. Arabic Quran Text (Uthmani Orthography)
                </span>
                <span className="text-xs text-[#1E6652] font-mono">quran-uthmani</span>
              </div>
              <p className="text-xs text-[#66736C] mt-1.5 leading-relaxed">
                Retrieved via the Al-Quran Cloud API based on the verified digital Tanzil and King Fahd Complex texts. Preserves authentic diacritics and aya marks without modification.
              </p>
              <div className="mt-2 text-xs">
                <a
                  href="https://alquran.cloud/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#1E6652] hover:underline"
                >
                  <span>Al-Quran Cloud Documentation</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Urdu Translation Source */}
            <div className="p-4 rounded-lg bg-[#FAF8F3] border border-[#DFE7DF]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-[#123D32]">
                  2. Urdu Translation — Maulana Fateh Muhammad Jalandhry
                </span>
                <span className="text-xs text-[#1E6652] font-mono">ur.jalandhry</span>
              </div>
              <p className="text-xs text-[#66736C] mt-1.5 leading-relaxed">
                Authentic, widely accepted classical Urdu translation by <strong>Maulana Fateh Muhammad Jalandhry</strong> (فاتح محمد جالندھری), aligned verse-by-verse with the Quranic text.
              </p>
            </div>

            {/* Audio Recitation Source */}
            <div id="audio-credits" className="p-4 rounded-lg bg-[#FAF8F3] border border-[#DFE7DF] scroll-mt-24">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-[#123D32]">
                  3. Audio Recitation — Sheikh Mishary Rashid Alafasy
                </span>
                <span className="text-xs text-[#1E6652] font-mono">ar.alafasy</span>
              </div>
              <p className="text-xs text-[#66736C] mt-1.5 leading-relaxed">
                Full-Surah recitations by <strong>Sheikh Mishary Rashid Alafasy</strong> (مشاري بن راشد العفاسي) streamed via Islamic Network and QuranicAudio CDNs for non-commercial educational use.
              </p>
              <div className="mt-2 text-xs flex gap-4">
                <a
                  href="https://islamic.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#1E6652] hover:underline"
                >
                  <span>Islamic Network Audio CDN</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://quranicaudio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#1E6652] hover:underline"
                >
                  <span>QuranicAudio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* Section 5: Local Data Information */}
        <section className="bg-white rounded-xl p-7 sm:p-9 border border-[#DFE7DF] shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#123D32]">
            <HardDrive className="w-5 h-5 text-[#1E6652]" />
            <h2 className="text-xl font-bold">Local Data &amp; Privacy Information</h2>
          </div>
          <p className="text-sm text-[#202923] leading-relaxed">
            Noor-ul-Quran prioritizes user privacy. <strong>No personal data is collected, transmitted, or stored on external servers</strong>. All your bookmarks, reading progress (last-read position), and font sizing preferences are preserved solely in your local browser storage (<code className="text-xs bg-[#FAF8F3] px-1.5 py-0.5 rounded border border-[#DFE7DF]">localStorage</code>).
          </p>
          <p className="text-xs text-[#66736C] leading-relaxed">
            Because this data is stored in the browser, your bookmarks stay private to your device and do not synchronize between different devices or private browsing windows. You can remove any individual bookmark at any time from the “My Bookmarks” page.
          </p>
        </section>

      </div>
    </div>
  );
};
