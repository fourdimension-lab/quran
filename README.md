# Al-Quran — Intelligent, Interactive Quran Platform

> **"Read in the name of your Lord who created"** — Surah Al-'Alaq [96:1]

**Al-Quran** is a complete, modern, world-class Islamic web platform built with Next.js (App Router), React 19, TypeScript, Tailwind CSS, and Supabase. It enables believers, students of knowledge, and seekers worldwide to read, understand, explore, study, listen to, and reflect upon the Holy Quran with scholarly integrity, authentic typography, and interactive study tools.

---

## 🌟 Key Features

### 1. Complete Quran Reader (114 Surahs, 6,236 Ayahs)
- Canonical Uthmani script with full diacritics and traditional numbering.
- Authentic Arabic typography using Amiri and Noto Naskh Arabic.
- Selectable translations: English (Saheeh International) and Bangla (Taisirul Quran / Muhiuddin Khan).
- Custom font size controls (A- / A+), continuous reading, verse-by-verse cards, and distraction-free mode.
- Verse markers with Tajweed glyph rendering (`۝`).

### 2. Clickable Word-by-Word Quran
- **Every Arabic word is interactive**: Click or tap any word to open a detailed popover or mobile bottom-sheet.
- Displays:
  - Arabic word in high-resolution calligraphy.
  - Pronunciation and transliteration.
  - Contextual English & Bangla meanings.
  - Root letters (جذر) and Lemma (المعجم).
  - Part of speech & detailed grammatical analysis.
  - Occurrences across the Quran with instant jump.
  - One-click "Save to Vocabulary" for spaced repetition review.

### 3. Interactive Ayah Selection & Classical Tafsir
- Dedicated slide-over study drawer for any Ayah.
- Multiple separated, attributed exegeses:
  - **Tafsir Ibn Kathir (Abridged)** (English).
  - **Tafsir Ahsanul Bayaan** by Salahuddin Yusuf & Dr. Abu Bakr Zakaria (Bangla).
  - **Tafsir al-Jalalayn** (Linguistic & Legal).
- Context of revelation (**Asbab al-Nuzul**).
- Linguistic notes, grammatical parsing, and authentic Hadith references.
- Private note-taking and bookmarking per Ayah.

### 4. Related Ayah Discovery Engine
- Discovers related Ayahs across all 114 Surahs with categorized relationships:
  - **Same Arabic Word**
  - **Same Root Letters**
  - **Shared Quranic Concept**
  - **Scholarly Cross-Reference**
  - **Moral / Legal Principle**
- Explanations of thematic connections with one-click navigation to referenced verses.

### 5. Quran Topic Explorer
- Comprehensive thematic exploration:
  - Tawhid & Oneness of Allah
  - Prophets & Messengers
  - Salah & Worship
  - Zakat & Charity (Sadaqah)
  - Patience (Sabr) & Gratitude (Shukr)
  - Justice & Honesty
  - Creation, Cosmos & Nature
  - Death & the Hereafter
- Curated introductions, categorized Ayah groups, and direct links to reader and Tafsir.

### 6. Quranic Signs & Reflections (Miracles & Science)
- Rigorous scholarly treatment of natural phenomena, cosmic expansion, human embryology, geology (mountains as pegs), oceanography (two seas meeting & internal waves), and historical preservation (Pharaoh's body).
- Strict evidence classification:
  - *Established Observation*
  - *Linguistic Eloquence*
  - *Scholarly Reflection*
  - *Disputed Interpretation*
- Peer-reviewed academic bibliography (e.g. Keith Moore, Edwin Hubble, Arthur Holmes).
- Zero speculative numerical pseudo-science or sensationalized claims.

### 7. High-Fidelity Audio & Recitations
- Top international reciters:
  - **Mishary Rashid Alafasy** (Murattal)
  - **AbdulBaset AbdulSamad** (Murattal)
  - **Mahmoud Khalil Al-Husary** (Tajweed Master)
  - **Abu Bakr Al-Shatri** (Murattal)
  - **Saud Ash-Shuraim** (Haramain Imam)
  - **Abdur-Rahman As-Sudais** (Haramain Imam)
- Persistent audio player bar with continuous playback, single verse repeat, speed control (0.75x to 1.5x), and live verse highlighting.

### 8. Arabic Learning & Spaced Repetition (SRS Flashcards)
- High-frequency Quranic vocabulary flashcards powered by the **SuperMemo-2 (SM-2) algorithm**.
- Quality rating (0 to 5) calculates interval in days, repetitions, and ease factors.
- Interactive multiple-choice Quiz Mode with celebratory reward animations.
- Personal saved vocabulary list synced to local storage and Supabase.

### 9. Grounded AI Quran Study Assistant
- Provider-independent AI service layer (Gemini, OpenAI, Groq, Ollama, or local).
- Retrieval-Augmented Generation (RAG) strictly grounded in canonical database records.
- Anti-hallucination validation: Assistant references are checked against `validateQuranReference()` before rendering.
- Clear scholarly notice: Explicitly states answers are educational and do not constitute formal Fatwas.

### 10. User Study Library & Bookmarks
- Private bookmarks, reading history, streak counter, and personal reflections.
- Export all personal study data to JSON.
- Guest mode with automatic localStorage fallback + Supabase Auth sync.

### 11. Admin & Editorial Review Portal
- Content review queue for scholarly verification of topic classifications and sign submissions.
- Dataset integrity verification tool checking 114 Surahs and 6,236 verses.
- System health, RLS status, and data source licensing audit.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript 5
- **UI & Styling**: Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Typography**: Amiri, Noto Naskh Arabic, Hind Siliguri (Bangla)
- **Database & Auth**: Supabase PostgreSQL, Row Level Security (RLS)
- **Testing**: Node 24 native test runner (`node:test`, `node:assert`, `tsx`)

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/quran.git
cd quran
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(The app runs out-of-the-box in local offline mode even before external credentials are set).*

### 3. Run Tests
Verify dataset integrity and core engines:
```bash
npm test
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 📖 Documentation Directory

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — Technical architecture, state management, and provider adapters.
- [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) — PostgreSQL table definitions, foreign keys, and RLS policies.
- [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) — Internal API endpoints and request/response specifications.
- [`DATA_SOURCES.md`](./DATA_SOURCES.md) — Attribution, licensing, and dataset provenance for text, translations, and audio.
- [`SECURITY.md`](./SECURITY.md) — Security guardrails, RLS rules, and AI safety protocols.
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — Deployment instructions for Vercel, Supabase, and custom domains.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — Guidelines for contributing code, translations, and scholarly reviews.

---

## ⚖️ License & Scholarly Notice

- Quran Arabic text is based on verified Tanzil.net Uthmani orthography.
- Translations and Tafsirs are cited with scholarly attribution.
- This platform is open, free, and ad-free for the benefit of the global Ummah.
