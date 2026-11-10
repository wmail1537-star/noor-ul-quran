import { Bookmark, LastReadPosition, ReadingPreferences } from '../types/quran';

const BOOKMARKS_KEY = 'noorulquran_bookmarks_v1';
const LAST_READ_KEY = 'noorulquran_last_read_v1';
const PREFERENCES_KEY = 'noorulquran_preferences_v1';

export const DEFAULT_PREFERENCES: ReadingPreferences = {
  showUrdu: true,
  arabicFontSize: 28,
  urduFontSize: 18,
  arabicFont: 'Amiri',
};

// Safe localStorage helper
function safeGetItem(key: string): string | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`Could not save to localStorage key "${key}":`, e);
  }
}

function safeRemoveItem(key: string): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(key);
  } catch {
    // Ignore errors
  }
}

// ================= Bookmarks =================

export function getBookmarks(): Bookmark[] {
  const raw = safeGetItem(BOOKMARKS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

export function saveBookmark(bookmark: Bookmark): Bookmark[] {
  const list = getBookmarks();
  // Prevent duplicate bookmarks by Surah and Ayah number
  const filtered = list.filter(
    (b) => !(b.surahNumber === bookmark.surahNumber && b.ayahNumber === bookmark.ayahNumber)
  );
  const updated = [bookmark, ...filtered];
  safeSetItem(BOOKMARKS_KEY, JSON.stringify(updated));
  return updated;
}

export function removeBookmark(surahNumber: number, ayahNumber: number): Bookmark[] {
  const list = getBookmarks();
  const updated = list.filter(
    (b) => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)
  );
  safeSetItem(BOOKMARKS_KEY, JSON.stringify(updated));
  return updated;
}

export function isBookmarked(surahNumber: number, ayahNumber: number): boolean {
  const list = getBookmarks();
  return list.some((b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
}

// ================= Last Read Position =================

export function getLastRead(): LastReadPosition | null {
  const raw = safeGetItem(LAST_READ_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.surahNumber === 'number' && typeof parsed.ayahNumber === 'number') {
      return parsed as LastReadPosition;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveLastRead(position: LastReadPosition): void {
  safeSetItem(LAST_READ_KEY, JSON.stringify(position));
}

export function clearLastRead(): void {
  safeRemoveItem(LAST_READ_KEY);
}

// ================= Preferences =================

export function getPreferences(): ReadingPreferences {
  const raw = safeGetItem(PREFERENCES_KEY);
  if (!raw) return { ...DEFAULT_PREFERENCES };
  try {
    const parsed = JSON.parse(raw);
    return {
      showUrdu: typeof parsed.showUrdu === 'boolean' ? parsed.showUrdu : DEFAULT_PREFERENCES.showUrdu,
      arabicFontSize:
        typeof parsed.arabicFontSize === 'number'
          ? Math.max(20, Math.min(46, parsed.arabicFontSize))
          : DEFAULT_PREFERENCES.arabicFontSize,
      urduFontSize:
        typeof parsed.urduFontSize === 'number'
          ? Math.max(14, Math.min(30, parsed.urduFontSize))
          : DEFAULT_PREFERENCES.urduFontSize,
      arabicFont: parsed.arabicFont === 'Scheherazade' ? 'Scheherazade' : 'Amiri',
    };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function savePreferences(prefs: Partial<ReadingPreferences>): ReadingPreferences {
  const current = getPreferences();
  const updated: ReadingPreferences = {
    ...current,
    ...prefs,
  };
  safeSetItem(PREFERENCES_KEY, JSON.stringify(updated));
  return updated;
}
