# Noor-ul-Quran (نور القرآن)
> **Tagline:** *Read, Listen & Understand.*

A complete, responsive Quran reading and study web application built for a university software engineering project. Noor-ul-Quran provides an ad-free, respectful, and aesthetically serene environment for reading all 114 Surahs with authentic Uthmani script, authentic Urdu translation, and full-surah recitation audio.

---

## 1. Project Overview & Features

- **All 114 Surahs:** Complete directory in canonical Quranic sequence with instant search by number, Arabic name, or transliteration.
- **Urdu Translation:** Complete verse-by-verse Urdu translation by Maulana Fateh Muhammad Jalandhry, rendered in clear, non-clipping Nastaliq typography.
- **Authentic Audio Recitation:** Verified full-Surah audio streaming by Sheikh Mishary Rashid Alafasy with play/pause, seek, elapsed time, duration, and volume controls.
- **Reading Controls:** Independent Arabic font size (20–46px) and Urdu font size (14–30px) adjustments, plus Urdu translation toggle.
- **Bookmarks & Last Read:** Bookmark individual ayahs and continue reading from your exact saved position.
- **Bismillah Integrity:** Respects classical Islamic conventions (Surah 1 Al-Fatiha has Bismillah as Ayah 1; Surah 9 At-Tawbah has no Bismillah; Surahs 2–114 display a distinguished opening Bismillah banner without duplicating text inside Ayah 1).
- **Zero-Login & Privacy:** All preferences, bookmarks, and reading progress are stored locally in the browser's `localStorage`—no cookies, user tracking, or backend database required.

---

## 2. Tech Stack

- **Framework:** React 19 (TypeScript)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Typography:** Google Fonts (`Plus Jakarta Sans`, `Amiri`, `Scheherazade New`, `Noto Nastaliq Urdu`)
- **Build Tool:** Vite 8

---

## 3. Project Structure

```text
├── index.html                   # HTML entry point with web fonts & metadata
├── metadata.json                # Project identity & description
├── package.json                 # Dependencies & scripts
├── README.md                    # Project documentation
├── src/
│   ├── App.tsx                  # Main app layout & page routing
│   ├── main.tsx                 # React DOM mount
│   ├── index.css                # Tailwind CSS & Quranic typography rules
│   ├── config/
│   │   └── developer.ts         # Editable student & university profile
│   ├── context/
│   │   └── RouterContext.tsx    # SPA routing with deep linking & anchor support
│   ├── data/
│   │   └── surahs.ts            # Bundled canonical metadata for all 114 Surahs
│   ├── services/
│   │   ├── quranService.ts      # API integration, text normalization & Bismillah handling
│   │   └── storageService.ts    # Safe localStorage bookmarks & preferences
│   ├── components/
│   │   ├── audio/
│   │   │   └── AudioPlayer.tsx  # Full-Surah audio player with seek & volume
│   │   └── layout/
│   │       ├── Navbar.tsx       # Top Bar Contract compliant navigation
│   │       └── Footer.tsx       # 3-column footer with credits & anchors
│   └── pages/
│       ├── HomePage.tsx         # Hero, continue reading & core features
│       ├── AllSurahsPage.tsx    # 114 Surahs grid with search & filters
│       ├── QuranReaderPage.tsx  # Reader canvas, controls & ayah cards
│       ├── BookmarksPage.tsx    # Saved verses list & quick jump
│       └── AboutPage.tsx        # Project objective, developer & sources
```

---

## 4. Content Providers & Data Sources

| Asset | Provider / Source | Identification |
| :--- | :--- | :--- |
| **Arabic Quran Text** | Al-Quran Cloud (Tanzil / King Fahd Complex) | `quran-uthmani` |
| **Urdu Translation** | Maulana Fateh Muhammad Jalandhry | `ur.jalandhry` |
| **Audio Recitation** | Sheikh Mishary Rashid Alafasy | `ar.alafasy` (Islamic Network & QuranicAudio CDNs) |
| **Surah Metadata** | Tanzil Project & Islamic Network | Canonical 114 Surahs list |

---

## 5. Configuration

Student developer details are centralized in `src/config/developer.ts`:

```typescript
export const DEVELOPER_CONFIG = {
  name: "Shamza Maqbool",
  role: "Student & Web Developer",
  introduction: "I’m Shamza Maqbool, a student and web developer with an interest in creating meaningful, user-friendly digital experiences...",
  supportingParagraph: "My focus in this project is on clear navigation, readable Arabic and Urdu typography...",
  initials: "SM",
};
```

---

## 6. Setup & Running Locally

1. Clone or extract the repository:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

---

## 7. Known Dependencies & Limitations

- **Internet Access for Verses & Audio:** Surah ayah text and audio files are fetched dynamically on-demand from Al-Quran Cloud and Islamic Network CDNs via HTTPS.
- **Browser-Local Storage:** Bookmarks and last-read positions stay in the specific browser session and do not sync between devices.
- **Audio Scope:** Recitation is provided per full Surah as specified in the project requirements; verse-by-verse synchronized audio timing is not estimated.
