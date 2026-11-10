import { SURAHS } from '../data/surahs';
import { Ayah, SurahDetail, SurahMeta } from '../types/quran';

// In-memory cache to prevent redundant network fetches
const surahCache = new Map<number, SurahDetail>();

export const AUDIO_RECITER = {
  name: 'Sheikh Mishary Rashid Alafasy',
  arabicName: 'الشيخ مشاري بن راشد العفاسي',
  edition: 'ar.alafasy',
};

export const URDU_TRANSLATOR = {
  name: 'Maulana Fateh Muhammad Jalandhry',
  urduName: 'مولانا فتح محمد جالندھری',
  edition: 'ur.jalandhry',
};

export const BISMILLAH_TEXT = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

/**
 * Returns list of all 114 Surahs metadata immediately from bundled verified data
 */
export function getAllSurahs(): SurahMeta[] {
  return SURAHS;
}

/**
 * Get metadata for a specific Surah by number (1-114)
 */
export function getSurahMeta(surahNumber: number): SurahMeta | undefined {
  return SURAHS.find((s) => s.number === surahNumber);
}

/**
 * Audio URL builder with primary CDN and backup
 */
export function getSurahAudioUrl(surahNumber: number): string {
  // Islamic Network 128kbps high quality full-surah audio by Mishary Rashid Alafasy
  return `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`;
}

export function getBackupSurahAudioUrl(surahNumber: number): string {
  const padded = String(surahNumber).padStart(3, '0');
  return `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${padded}.mp3`;
}

/**
 * Formats the Arabic verse text respecting Islamic Bismillah conventions:
 * - Surah 1 (Al-Fatiha): Ayah 1 is the Bismillah itself.
 * - Surah 9 (At-Tawbah): Does not have Bismillah.
 * - Surahs 2-114 (except 9): If Ayah 1 starts with Bismillah in quran-uthmani edition,
 *   when a dedicated Bismillah header is shown at the top of the Surah, we return the
 *   ayah's text without the duplicate Bismillah prefix.
 * - Surah 27 (An-Naml): Verse 30 contains internal Bismillah and remains completely untouched.
 */
export function cleanAyahText(surahNumber: number, ayahNumberInSurah: number, rawArabicText: string): string {
  if (surahNumber === 1 || surahNumber === 9) {
    return rawArabicText;
  }

  if (ayahNumberInSurah === 1) {
    // Check if raw text starts with Bismillah in uthmani orthography
    // Regex matches common variations of Bismillah with or without leading zero-width spaces/BOM
    const bismillahPrefixRegex = /^[\uFEFF\u200B\s]*بِسْمِ\s+ٱللَّهِ\s+ٱلرَّحْمَٰنِ\s+ٱلرَّحِيمِ\s*/u;
    if (bismillahPrefixRegex.test(rawArabicText)) {
      const stripped = rawArabicText.replace(bismillahPrefixRegex, '').trim();
      return stripped.length > 0 ? stripped : rawArabicText;
    }
  }

  return rawArabicText;
}

/**
 * Fetch full Surah details (Arabic Uthmani text + Maulana Fateh Muhammad Jalandhry Urdu translation)
 */
export async function getSurahDetail(surahNumber: number): Promise<SurahDetail> {
  if (surahNumber < 1 || surahNumber > 114) {
    throw new Error(`Invalid Surah number: ${surahNumber}. Must be between 1 and 114.`);
  }

  // Check in-memory cache first
  if (surahCache.has(surahNumber)) {
    return surahCache.get(surahNumber)!;
  }

  const meta = getSurahMeta(surahNumber);
  if (!meta) {
    throw new Error(`Surah ${surahNumber} not found.`);
  }

  const endpoint = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,ur.jalandhry`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      headers: {
        Accept: 'application/json',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error';
    throw new Error(`Failed to connect to Quran data service (${message}). Please check your internet connection.`);
  }

  if (!response.ok) {
    throw new Error(`Quran data service returned error (HTTP ${response.status}). Please try again.`);
  }

  const result = await response.json();

  if (result.code !== 200 || !Array.isArray(result.data) || result.data.length < 2) {
    throw new Error(result.status || 'Received incomplete response from Quran provider.');
  }

  const arabicData = result.data[0];
  const urduData = result.data[1];

  // Build a map of Urdu translations by numberInSurah for stable matching
  const urduByAyahNumber = new Map<number, string>();
  if (Array.isArray(urduData.ayahs)) {
    for (const item of urduData.ayahs) {
      if (item && typeof item.numberInSurah === 'number') {
        urduByAyahNumber.set(item.numberInSurah, item.text || '');
      }
    }
  }

  const ayahs: Ayah[] = (arabicData.ayahs || []).map((arAyah: {
    number: number;
    numberInSurah: number;
    text: string;
    juz?: number;
    manzil?: number;
    page?: number;
    ruku?: number;
    hizbQuarter?: number;
    sajda?: boolean | object;
  }) => {
    const rawArabic = arAyah.text || '';
    const formattedArabic = cleanAyahText(surahNumber, arAyah.numberInSurah, rawArabic);
    const urduTranslation = urduByAyahNumber.get(arAyah.numberInSurah) || '';

    return {
      number: arAyah.number,
      numberInSurah: arAyah.numberInSurah,
      text: formattedArabic,
      urduText: urduTranslation,
      juz: arAyah.juz,
      manzil: arAyah.manzil,
      page: arAyah.page,
      ruku: arAyah.ruku,
      hizbQuarter: arAyah.hizbQuarter,
      sajda: arAyah.sajda,
    };
  });

  const detail: SurahDetail = {
    ...meta,
    ayahs,
    urduTranslator: URDU_TRANSLATOR.name,
    reciterName: AUDIO_RECITER.name,
    audioUrl: getSurahAudioUrl(surahNumber),
  };

  // Cache in memory
  surahCache.set(surahNumber, detail);

  return detail;
}

/**
 * Normalizes text for search (ignoring case, common diacritics, and punctuation)
 * Note: Only applied to search query and search index, never alters displayed text!
 */
export function normalizeSearchTerm(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove latin diacritics
    .replace(/[\u064B-\u065F\u0670]/g, '') // remove Arabic tashkeel/harakat
    .replace(/[-_'.\s]/g, ''); // remove hyphens, spaces, apostrophes
}
