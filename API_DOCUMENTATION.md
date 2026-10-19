# API Documentation — Al-Quran Platform

This document describes the API endpoints provided by the Al-Quran web service.

---

## 1. Study Assistant API

### `POST /api/ai/study`
Grounded retrieval-augmented study assistant. Synthesizes authenticated exegesis for thematic, linguistic, or conceptual questions.

#### Request Headers
- `Content-Type: application/json`

#### Request Body
```json
{
  "query": "Which Ayahs discuss patience during hardship?",
  "surahContext": 2,
  "ayahContext": 153,
  "language": "en"
}
```

#### Parameters
| Field | Type | Required | Description |
|---|---|---|---|
| `query` | `string` | **Yes** | The study question or thematic inquiry. |
| `surahContext` | `number` | No | Optional Surah number (1-114) for localized context. |
| `ayahContext` | `number` | No | Optional Ayah number for localized context. |
| `language` | `string` | No | `'en'` (default) or `'bn'` for Bangla response. |

#### Response (`200 OK`)
```json
{
  "answer": "Patience (Sabr) is one of the highest spiritual stations...",
  "references": [
    {
      "surah": 2,
      "ayah": 153,
      "text_ar": "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ",
      "translation": "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.",
      "relevance": "Foundational command on Sabr"
    }
  ],
  "scholarly_caveat": "Scholarly Notice: This is an educational synthesis grounded in authentic sources and does not constitute a formal legal ruling (Fatwa)."
}
```

---

## 2. Audio URL Template

Ayah-level audio recitations follow the EveryAyah CDN convention:

```
https://everyayah.com/data/{reciter_id}/{SURAH3}{AYAH3}.mp3
```

Example for Surah 1, Ayah 1 by Mishary Rashid Alafasy:
```
https://everyayah.com/data/Alafasy_128kbps/001001.mp3
```

---

## 3. Client Storage Services

For client-side components, offline persistence is mediated through `src/lib/storage/user-storage.ts`:

- `getStoredBookmarks()`: Retrieves user bookmarks from `localStorage` / Supabase.
- `saveBookmark(bookmark)`: Toggles bookmark on/off with timestamps.
- `getStoredNotes()`: Retrieves private study reflections.
- `saveNote(note)`: Creates or updates private reflection.
- `reviewVocabItem(id, quality)`: Updates Spaced Repetition (SM-2) scheduling.
