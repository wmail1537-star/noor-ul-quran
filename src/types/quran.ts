export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  number: number; // Global Quran ayah number (1 - 6236)
  numberInSurah: number; // Ayah number inside the surah (1 - numberOfAyahs)
  text: string; // Exact Arabic text from provider
  urduText?: string; // Matching Urdu translation text
  juz?: number;
  manzil?: number;
  page?: number;
  ruku?: number;
  hizbQuarter?: number;
  sajda?: boolean | object;
}

export interface SurahDetail extends SurahMeta {
  ayahs: Ayah[];
  urduTranslator: string;
  reciterName: string;
  audioUrl: string;
}

export interface Bookmark {
  id: string; // e.g. "surah-2-ayah-255"
  surahNumber: number;
  ayahNumber: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  arabicText: string;
  urduText: string;
  createdAt: number;
}

export interface LastReadPosition {
  surahNumber: number;
  ayahNumber: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  updatedAt: number;
}

export interface ReadingPreferences {
  showUrdu: boolean;
  arabicFontSize: number; // in pixels (e.g. 28)
  urduFontSize: number; // in pixels (e.g. 18)
  arabicFont: 'Amiri' | 'Scheherazade';
}
