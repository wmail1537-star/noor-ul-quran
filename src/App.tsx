import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { AllSurahsPage } from './pages/AllSurahsPage';
import { QuranReaderPage } from './pages/QuranReaderPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { AboutPage } from './pages/AboutPage';

const AppContent: React.FC = () => {
  const { route } = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#202923]">
      <Navbar />
      <main className="flex-1">
        {route.type === 'home' && <HomePage />}
        {route.type === 'surahs' && <AllSurahsPage />}
        {route.type === 'reader' && (
          <QuranReaderPage surahNumber={route.surahNumber || 1} />
        )}
        {route.type === 'bookmarks' && <BookmarksPage />}
        {route.type === 'about' && <AboutPage />}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
