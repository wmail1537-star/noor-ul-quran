import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type RouteType = 'home' | 'surahs' | 'reader' | 'bookmarks' | 'about';

export interface RouteMatch {
  type: RouteType;
  path: string;
  surahNumber?: number;
  targetAyah?: number;
  hash: string;
}

interface RouterContextValue {
  route: RouteMatch;
  navigate: (path: string, options?: { replace?: boolean; scroll?: boolean }) => void;
  jumpToAyah: (ayahNumber: number) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function parseRoute(pathname: string, hash: string): RouteMatch {
  // Check if hash-based routing is used (e.g. #/surah/18 or #ayah-5)
  let effectivePath = pathname;
  let effectiveHash = hash;

  if (hash.startsWith('#/')) {
    effectivePath = hash.slice(1); // remove '#'
    effectiveHash = '';
  }

  // Check for deep ayah hash like #ayah-255
  let targetAyah: number | undefined;
  const ayahHashMatch = (hash || effectiveHash).match(/^#ayah-(\d+)$/i);
  if (ayahHashMatch) {
    targetAyah = parseInt(ayahHashMatch[1], 10);
  }

  // Normalize path
  const normalized = effectivePath.replace(/\/+$/, '') || '/';

  if (normalized === '' || normalized === '/') {
    return { type: 'home', path: '/', hash: effectiveHash };
  }

  if (normalized === '/surahs') {
    return { type: 'surahs', path: '/surahs', hash: effectiveHash };
  }

  if (normalized === '/bookmarks') {
    return { type: 'bookmarks', path: '/bookmarks', hash: effectiveHash };
  }

  if (normalized === '/about') {
    return { type: 'about', path: '/about', hash: effectiveHash };
  }

  const surahMatch = normalized.match(/^\/surah\/(\d+)/i);
  if (surahMatch) {
    const surahNumber = parseInt(surahMatch[1], 10);
    return {
      type: 'reader',
      path: normalized,
      surahNumber,
      targetAyah,
      hash: effectiveHash,
    };
  }

  // Fallback to home
  return { type: 'home', path: '/', hash: effectiveHash };
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<RouteMatch>(() =>
    parseRoute(window.location.pathname, window.location.hash)
  );

  const updateRoute = useCallback(() => {
    setRoute(parseRoute(window.location.pathname, window.location.hash));
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      updateRoute();
    };

    const handleHashChange = () => {
      updateRoute();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [updateRoute]);

  const navigate = useCallback((targetUrl: string, options?: { replace?: boolean; scroll?: boolean }) => {
    const [pathPart, hashPart] = targetUrl.split('#');
    const fullHash = hashPart ? `#${hashPart}` : '';

    if (options?.replace) {
      window.history.replaceState({}, '', targetUrl);
    } else {
      window.history.pushState({}, '', targetUrl);
    }

    setRoute(parseRoute(pathPart || window.location.pathname, fullHash));

    if (options?.scroll !== false && !hashPart) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (hashPart) {
      // Allow DOM to settle, then scroll to anchor
      setTimeout(() => {
        const el = document.getElementById(hashPart);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const jumpToAyah = useCallback((ayahNumber: number) => {
    const hash = `ayah-${ayahNumber}`;
    window.history.replaceState({}, '', `#${hash}`);
    setRoute((prev) => ({
      ...prev,
      targetAyah: ayahNumber,
      hash: `#${hash}`,
    }));

    setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Add subtle focus ring / highlight
        el.classList.add('ring-2', 'ring-[#B49352]', 'ring-offset-2');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-[#B49352]', 'ring-offset-2');
        }, 2500);
      }
    }, 120);
  }, []);

  return (
    <RouterContext.Provider value={{ route, navigate, jumpToAyah }}>
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}
