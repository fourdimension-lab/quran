export type RevelationType = 'Meccan' | 'Medinan';

export interface Surah {
  number: number;
  name_ar: string;
  name_en: string;
  name_transliteration: string;
  name_bn: string;
  translation_en: string;
  translation_bn: string;
  verses_count: number;
  revelation_place: RevelationType;
  revelation_order: number;
  juz_start: number;
  page_start: number;
  bismillah_pre: boolean;
  description_en?: string;
  description_bn?: string;
}

export interface QuranWord {
  id: string; // e.g. "1:1:1"
  surah: number;
  ayah: number;
  position: number;
  arabic: string;
  transliteration: string;
  translation_en: string;
  translation_bn: string;
  root?: string;
  root_arabic?: string;
  lemma?: string;
  part_of_speech?: string;
  grammar?: string;
  audio_url?: string;
  frequency_in_quran?: number;
}

export interface Ayah {
  surah_number: number;
  ayah_number: number;
  text_ar: string; // Uthmani script with diacritics
  text_plain?: string; // simplified for search
  translation_en: string; // Saheeh International
  translation_bn: string; // Muhiuddin Khan / Taisirul Quran
  transliteration?: string;
  juz: number;
  hizb: number;
  rub_el_hizb?: number;
  page: number;
  words?: QuranWord[];
  sajdah?: boolean;
}

export interface TafsirSource {
  id: string;
  name: string;
  author: string;
  language: 'en' | 'bn' | 'ar';
  description: string;
}

export interface TafsirEntry {
  surah_number: number;
  ayah_number: number;
  source_id: string;
  source_name: string;
  author: string;
  language: string;
  text: string;
  asbab_al_nuzul?: string; // context of revelation
  linguistic_notes?: string;
  authentic_hadith_refs?: string[];
}

export type RelationType = 
  | 'same_root'
  | 'same_word'
  | 'shared_concept'
  | 'narrative_continuity'
  | 'tafsir_cross_reference'
  | 'legal_moral_principle'
  | 'linguistic_expression';

export interface RelatedAyah {
  surah_number: number;
  ayah_number: number;
  text_ar: string;
  translation_en: string;
  translation_bn: string;
  relation_type: RelationType;
  explanation: string;
  shared_key?: string; // e.g. root letters or topic key
}

export interface QuranTopic {
  id: string;
  slug: string;
  title_en: string;
  title_bn: string;
  title_ar: string;
  category: string;
  category_bn: string;
  description_en: string;
  description_bn: string;
  icon?: string;
  verses: {
    surah: number;
    ayah: number;
    notes_en?: string;
    notes_bn?: string;
  }[];
}

export interface QuranicSign {
  id: string;
  slug: string;
  title_en: string;
  title_bn: string;
  category: 'cosmology' | 'embryology' | 'geology' | 'oceanology' | 'history' | 'linguistics' | 'natural_world';
  category_display_en: string;
  category_display_bn: string;
  ayahs: {
    surah: number;
    ayah: number;
    text_ar: string;
    translation_en: string;
    translation_bn: string;
  }[];
  explanation_en: string;
  explanation_bn: string;
  scholarly_perspective_en: string;
  scholarly_perspective_bn: string;
  scientific_references: string[];
  evidence_classification: 'established_observation' | 'linguistic_eloquence' | 'scholarly_reflection' | 'disputed_interpretation';
  status: 'verified_scholarly' | 'under_review';
}

export interface Reciter {
  id: string;
  name: string;
  name_ar: string;
  name_bn: string;
  style: string;
  bitrate?: string;
  audio_base_url: string; // URL template for ayah audio, e.g. https://everyayah.com/data/Alafasy_128kbps/%SURAH3%%AYAH3%.mp3
  surah_audio_base_url?: string;
}

export interface UserBookmark {
  id: string;
  surah_number: number;
  ayah_number: number;
  created_at: string;
  note?: string;
  tags?: string[];
}

export interface UserNote {
  id: string;
  surah_number: number;
  ayah_number: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface UserVocabularyItem {
  id: string;
  word_arabic: string;
  transliteration: string;
  translation_en: string;
  translation_bn: string;
  root?: string;
  surah_ref?: number;
  ayah_ref?: number;
  next_review_date: string;
  interval: number; // in days
  ease_factor: number; // default 2.5 (SM-2 SRS)
  repetitions: number;
  status: 'new' | 'learning' | 'mastered';
}

export interface ReadingProgress {
  last_read_surah: number;
  last_read_ayah: number;
  last_read_timestamp: string;
  daily_goal_minutes: number;
  completed_surahs: number[];
  streak_days: number;
}

export interface AISearchResult {
  answer: string;
  references: {
    surah: number;
    ayah: number;
    text_ar: string;
    translation: string;
    relevance: string;
  }[];
  tafsir_notes?: string;
  scholarly_caveat: string;
}
