# System Architecture — Al-Quran Platform

## 1. Architectural Overview

Al-Quran is designed as a high-performance, modular full-stack application built around three primary design imperatives:
1. **Sacred Data Integrity**: The Arabic text of the Holy Quran, its canonical verse counts, and traditional Uthmani orthography must remain immutable and mathematically verified.
2. **Offline-First Resilience**: Reading the Quran, accessing preloaded translations, inspecting morphology, listening to recitations, and saving study bookmarks must function seamlessly even during network degradation or offline conditions.
3. **Scholarly Grounding & AI Safety**: Every AI-assisted exegesis or search result is constrained by strict Retrieval-Augmented Generation (RAG) and validated against canonical database records before presentation to the user.

---

## 2. Layered Architecture Diagram

```
+--------------------------------------------------------------------------+
|                            USER INTERFACE                                |
|  - Next.js 16 App Router (Turbopack, SSR, Static Generation, Suspense)   |
|  - Responsive Layout (Desktop Sidebar / Mobile Bottom-Docked Nav)        |
|  - Quran Reader (Ayah Cards, Clickable Words, Tafsir & Related Drawers)  |
|  - Thematic Topic Explorer & Signs/Reflections Articles                  |
|  - Spaced Repetition (SM-2) Flashcards & Interactive Quizzes             |
|  - Persistent Background Audio Player Bar (EveryAyah CDN)                |
+--------------------------------------------------------------------------+
                                     |
+------------------------------------+-------------------------------------+
|                      APPLICATION & SERVICES LAYER                        |
|  - Quran Data Service (In-memory caching, on-demand fetch & fallback)    |
|  - Word Morphology & Occurrence Resolver                                 |
|  - Related Ayah Discovery Engine (Multi-criteria relationship matching)   |
|  - Grounded AI Study Assistant (RAG Pipeline + Anti-Hallucination Gate)   |
|  - Audio Player Context & Media Session Synchronizer                     |
|  - Offline Storage & Sync Engine (localStorage + Supabase Auth Sync)     |
+--------------------------------------------------------------------------+
                                     |
+------------------------------------+-------------------------------------+
|                        DATA & PERSISTENCE LAYER                          |
|  - Canonical Datasets: 114 Surahs, 6,236 Verses, Morphology, Roots       |
|  - Supabase PostgreSQL (Normalized relational tables, pgvector, indexes) |
|  - Row Level Security (RLS) ensuring strict user privacy for notes & bms |
|  - Provider-independent AI Service (Gemini / OpenAI / Groq / Ollama)     |
+--------------------------------------------------------------------------+
```

---

## 3. Core Component Modules

### A. Quran Reader & Word-by-Word Engine
- **`AyahCard` (`src/components/reader/AyahCard.tsx`)**: Renders each verse with Uthmani typography, diacritics, and interactive word tokens.
- **`WordDetailSheet` (`src/components/reader/WordDetailSheet.tsx`)**: Displays root letters, lemma, grammatical role, and occurrences when any word is clicked.
- **`TafsirDrawer` (`src/components/reader/TafsirDrawer.tsx`)**: Presents separated classical and contemporary exegeses with Asbab al-Nuzul, linguistic notes, and authentic Hadith citations.
- **`RelatedAyahsDrawer` (`src/components/reader/RelatedAyahsDrawer.tsx`)**: Surfaces conceptually and morphologically linked verses with explanatory relationship badges.

### B. Audio Recitation System
- **`AudioPlayerContext` (`src/lib/audio/audio-player-context.tsx`)**: Maintains a singleton audio controller managing active Surah, active Ayah, playback rate, repeat modes (none, single verse, Surah loop), and reciter switching.
- **`PersistentAudioBar` (`src/components/audio/PersistentAudioBar.tsx`)**: Fixed bottom player interface enabling playback controls while navigating through different pages.

### C. Learning & Memorization (SM-2 SRS)
- **`FlashcardViewer` (`src/components/learning/FlashcardViewer.tsx`)**: Implements the SuperMemo-2 (SM-2) algorithm. Words are reviewed at calculated intervals:
  $$I(1) = 1, \quad I(2) = 6, \quad I(n) = I(n-1) \times EF$$
  where $EF' = EF + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02))$, with a minimum ease factor of 1.3.

### D. Grounded AI Study Assistant
- **`ai-service.ts` (`src/lib/ai/ai-service.ts`)**: Provider-independent architecture. Pre-retrieves relevant verses and exegeses, formats a strict context-grounded prompt, and validates all citations using `validateQuranReference(surah, ayah)` before sending the payload to the frontend.

---

## 4. State Management Strategy

1. **Server-Side & Prerendered State**:
   - Surahs directory (`/read`), individual chapters (`/read/[surahId]`), topic collections (`/topics/[slug]`), and signs (`/miracles/[slug]`) are pre-generated via `generateStaticParams()` at build time for instant page loads.
2. **Client-Side Interactive State**:
   - Audio playback, active word popover, Tafsir drawer, and search modals are managed via React Context and lightweight local state.
3. **User Data Persistence**:
   - Local-first architecture: Bookmarks, private reflections, and SRS vocabulary are stored in `localStorage` for immediate responsiveness, and synchronized with Supabase PostgreSQL tables when user is authenticated.
