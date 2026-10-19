import { UserBookmark, UserNote, UserVocabularyItem, ReadingProgress } from '../../types/quran';

const BOOKMARKS_KEY = 'alquran_bookmarks';
const NOTES_KEY = 'alquran_notes';
const VOCAB_KEY = 'alquran_vocab';
const PROGRESS_KEY = 'alquran_progress';
const SETTINGS_KEY = 'alquran_settings';

export interface UserSettings {
  arabicFontSize: number; // default 28
  englishFontSize: number; // default 16
  banglaFontSize: number; // default 16
  arabicFontFamily: 'amiri' | 'noto' | 'indopak';
  showEnglish: boolean;
  showBangla: boolean;
  showTransliteration: boolean;
  showWordByWord: boolean;
  readingMode: 'verse_by_verse' | 'mushaf_continuous' | 'focus';
  selectedReciter: string;
  autoScrollPlaying: boolean;
  repeatMode: 'none' | 'single_verse' | 'range';
}

export const DEFAULT_SETTINGS: UserSettings = {
  arabicFontSize: 30,
  englishFontSize: 16,
  banglaFontSize: 16,
  arabicFontFamily: 'amiri',
  showEnglish: true,
  showBangla: true,
  showTransliteration: true,
  showWordByWord: true,
  readingMode: 'verse_by_verse',
  selectedReciter: 'mishary-alafasy',
  autoScrollPlaying: true,
  repeatMode: 'none'
};

export const DEFAULT_PROGRESS: ReadingProgress = {
  last_read_surah: 1,
  last_read_ayah: 1,
  last_read_timestamp: new Date().toISOString(),
  daily_goal_minutes: 15,
  completed_surahs: [],
  streak_days: 1
};

// Safe localStorage access helper
function safeGet<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`LocalStorage write error for ${key}:`, err);
  }
}

// User Bookmarks
export function getStoredBookmarks(): UserBookmark[] {
  return safeGet<UserBookmark[]>(BOOKMARKS_KEY, [
    {
      id: 'bm-1',
      surah_number: 1,
      ayah_number: 1,
      created_at: new Date().toISOString(),
      note: 'Al-Fatihah Opening verse'
    },
    {
      id: 'bm-2',
      surah_number: 112,
      ayah_number: 1,
      created_at: new Date().toISOString(),
      note: 'Tawhid declaration'
    }
  ]);
}

export function saveBookmark(bookmark: Omit<UserBookmark, 'id' | 'created_at'>): UserBookmark {
  const current = getStoredBookmarks();
  const existingIdx = current.findIndex(
    (b) => b.surah_number === bookmark.surah_number && b.ayah_number === bookmark.ayah_number
  );

  if (existingIdx >= 0) {
    // Already bookmarked, toggle off if no note
    const updated = current.filter((_, idx) => idx !== existingIdx);
    safeSet(BOOKMARKS_KEY, updated);
    return current[existingIdx];
  } else {
    const newBm: UserBookmark = {
      ...bookmark,
      id: `bm-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    safeSet(BOOKMARKS_KEY, [newBm, ...current]);
    return newBm;
  }
}

export function isAyahBookmarked(surah: number, ayah: number): boolean {
  const current = getStoredBookmarks();
  return current.some((b) => b.surah_number === surah && b.ayah_number === ayah);
}

// User Notes
export function getStoredNotes(): UserNote[] {
  return safeGet<UserNote[]>(NOTES_KEY, [
    {
      id: 'note-1',
      surah_number: 1,
      ayah_number: 2,
      title: 'Reflection on Rabbil Alameen',
      content: 'Reflecting on how Allah actively sustains everything from vast cosmic galaxies to the smallest subatomic particles.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);
}

export function saveNote(note: Omit<UserNote, 'id' | 'created_at' | 'updated_at'>): UserNote {
  const current = getStoredNotes();
  const existingIdx = current.findIndex(
    (n) => n.surah_number === note.surah_number && n.ayah_number === note.ayah_number
  );

  const now = new Date().toISOString();
  if (existingIdx >= 0) {
    const updatedNote: UserNote = {
      ...current[existingIdx],
      ...note,
      updated_at: now
    };
    current[existingIdx] = updatedNote;
    safeSet(NOTES_KEY, [...current]);
    return updatedNote;
  } else {
    const newNote: UserNote = {
      ...note,
      id: `note-${Date.now()}`,
      created_at: now,
      updated_at: now
    };
    safeSet(NOTES_KEY, [newNote, ...current]);
    return newNote;
  }
}

export function deleteNote(id: string): void {
  const current = getStoredNotes();
  safeSet(NOTES_KEY, current.filter((n) => n.id !== id));
}

// User Vocabulary & Spaced Repetition System (SM-2 Algorithm)
export function getStoredVocab(): UserVocabularyItem[] {
  return safeGet<UserVocabularyItem[]>(VOCAB_KEY, []);
}

export function addWordToVocab(word: {
  word_arabic: string;
  transliteration: string;
  translation_en: string;
  translation_bn: string;
  root?: string;
  surah_ref?: number;
  ayah_ref?: number;
}): UserVocabularyItem {
  const current = getStoredVocab();
  const existing = current.find((w) => w.word_arabic === word.word_arabic);
  if (existing) return existing;

  const newItem: UserVocabularyItem = {
    ...word,
    id: `vocab-${Date.now()}`,
    next_review_date: new Date().toISOString(),
    interval: 1,
    ease_factor: 2.5,
    repetitions: 0,
    status: 'new'
  };

  safeSet(VOCAB_KEY, [newItem, ...current]);
  return newItem;
}

/**
 * SM-2 Spaced Repetition calculation
 * quality: 0 (blackout) to 5 (perfect recall)
 */
export function reviewVocabItem(id: string, quality: number): UserVocabularyItem | null {
  const current = getStoredVocab();
  const idx = current.findIndex((w) => w.id === id);
  if (idx === -1) return null;

  const item = current[idx];
  let { repetitions, interval, ease_factor } = item;

  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease_factor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  ease_factor = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ease_factor < 1.3) ease_factor = 1.3;

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  const updated: UserVocabularyItem = {
    ...item,
    repetitions,
    interval,
    ease_factor,
    next_review_date: nextReview.toISOString(),
    status: repetitions >= 4 ? 'mastered' : 'learning'
  };

  current[idx] = updated;
  safeSet(VOCAB_KEY, current);
  return updated;
}

// Reading Progress
export function getStoredProgress(): ReadingProgress {
  return safeGet<ReadingProgress>(PROGRESS_KEY, DEFAULT_PROGRESS);
}

export function updateReadingProgress(surah: number, ayah: number): void {
  const current = getStoredProgress();
  const updated: ReadingProgress = {
    ...current,
    last_read_surah: surah,
    last_read_ayah: ayah,
    last_read_timestamp: new Date().toISOString()
  };
  safeSet(PROGRESS_KEY, updated);
}

// User Settings
export function getStoredSettings(): UserSettings {
  return safeGet<UserSettings>(SETTINGS_KEY, DEFAULT_SETTINGS);
}

export function saveSettings(settings: Partial<UserSettings>): UserSettings {
  const current = getStoredSettings();
  const updated = { ...current, ...settings };
  safeSet(SETTINGS_KEY, updated);
  return updated;
}
