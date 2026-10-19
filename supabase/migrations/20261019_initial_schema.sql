-- ========================================================
-- Al-Quran Platform - Canonical PostgreSQL Schema
-- Migration: 20261019_initial_schema.sql
-- ========================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. Surahs
CREATE TABLE IF NOT EXISTS public.surahs (
    number INTEGER PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_transliteration TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    translation_en TEXT NOT NULL,
    translation_bn TEXT NOT NULL,
    verses_count INTEGER NOT NULL,
    revelation_place TEXT NOT NULL CHECK (revelation_place IN ('Meccan', 'Medinan')),
    revelation_order INTEGER NOT NULL,
    juz_start INTEGER NOT NULL,
    page_start INTEGER NOT NULL,
    bismillah_pre BOOLEAN NOT NULL DEFAULT true,
    description_en TEXT,
    description_bn TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ayahs
CREATE TABLE IF NOT EXISTS public.ayahs (
    id TEXT PRIMARY KEY, -- e.g. '1:1'
    surah_number INTEGER NOT NULL REFERENCES public.surahs(number) ON DELETE CASCADE,
    ayah_number INTEGER NOT NULL,
    text_ar TEXT NOT NULL,
    text_plain TEXT,
    juz INTEGER NOT NULL,
    hizb INTEGER NOT NULL,
    rub_el_hizb INTEGER,
    page INTEGER NOT NULL,
    sajdah BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (surah_number, ayah_number)
);

CREATE INDEX IF NOT EXISTS idx_ayahs_surah ON public.ayahs(surah_number);
CREATE INDEX IF NOT EXISTS idx_ayahs_juz ON public.ayahs(juz);

-- 3. Ayah Translations
CREATE TABLE IF NOT EXISTS public.ayah_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ayah_id TEXT NOT NULL REFERENCES public.ayahs(id) ON DELETE CASCADE,
    language TEXT NOT NULL, -- 'en', 'bn'
    resource_name TEXT NOT NULL,
    translation_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (ayah_id, language, resource_name)
);

-- 4. Ayah Words (Word-by-word segmentation)
CREATE TABLE IF NOT EXISTS public.ayah_words (
    id TEXT PRIMARY KEY, -- e.g. '1:1:1'
    surah_number INTEGER NOT NULL REFERENCES public.surahs(number) ON DELETE CASCADE,
    ayah_number INTEGER NOT NULL,
    position INTEGER NOT NULL,
    arabic TEXT NOT NULL,
    transliteration TEXT,
    root_arabic TEXT,
    root_letters TEXT,
    lemma TEXT,
    part_of_speech TEXT,
    grammar_notes TEXT,
    audio_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (surah_number, ayah_number, position)
);

CREATE INDEX IF NOT EXISTS idx_words_root ON public.ayah_words(root_arabic);
CREATE INDEX IF NOT EXISTS idx_words_lemma ON public.ayah_words(lemma);

-- 5. Word Translations
CREATE TABLE IF NOT EXISTS public.word_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    word_id TEXT NOT NULL REFERENCES public.ayah_words(id) ON DELETE CASCADE,
    language TEXT NOT NULL,
    translation TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (word_id, language)
);

-- 6. Tafsir Sources
CREATE TABLE IF NOT EXISTS public.tafsir_sources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    author TEXT NOT NULL,
    language TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tafsir Entries
CREATE TABLE IF NOT EXISTS public.tafsir_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    surah_number INTEGER NOT NULL,
    ayah_number INTEGER NOT NULL,
    source_id TEXT NOT NULL REFERENCES public.tafsir_sources(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    asbab_al_nuzul TEXT,
    linguistic_notes TEXT,
    authentic_hadith_refs JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (surah_number, ayah_number, source_id)
);

-- 8. Topics & Ayah Topics
CREATE TABLE IF NOT EXISTS public.topics (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    category TEXT NOT NULL,
    category_bn TEXT NOT NULL,
    description_en TEXT,
    description_bn TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ayah_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    surah_number INTEGER NOT NULL,
    ayah_number INTEGER NOT NULL,
    notes_en TEXT,
    notes_bn TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (topic_id, surah_number, ayah_number)
);

-- 9. Ayah Cross References & Related Ayahs
CREATE TABLE IF NOT EXISTS public.ayah_cross_references (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_surah INTEGER NOT NULL,
    from_ayah INTEGER NOT NULL,
    to_surah INTEGER NOT NULL,
    to_ayah INTEGER NOT NULL,
    relation_type TEXT NOT NULL,
    explanation_en TEXT NOT NULL,
    explanation_bn TEXT,
    shared_key TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Quranic Signs & Miracles
CREATE TABLE IF NOT EXISTS public.quranic_signs (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    category TEXT NOT NULL,
    category_display_en TEXT NOT NULL,
    category_display_bn TEXT NOT NULL,
    explanation_en TEXT NOT NULL,
    explanation_bn TEXT NOT NULL,
    scholarly_perspective_en TEXT NOT NULL,
    scholarly_perspective_bn TEXT NOT NULL,
    scientific_references JSONB DEFAULT '[]',
    evidence_classification TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'verified_scholarly',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Reciters & Audio Assets
CREATE TABLE IF NOT EXISTS public.reciters (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    style TEXT NOT NULL,
    bitrate TEXT,
    audio_base_url TEXT NOT NULL,
    surah_audio_base_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. User Profiles (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    display_name TEXT,
    preferred_language TEXT DEFAULT 'en',
    arabic_font_size INTEGER DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. User Bookmarks (Private per user with RLS)
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    surah_number INTEGER NOT NULL,
    ayah_number INTEGER NOT NULL,
    note TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, surah_number, ayah_number)
);

-- 14. User Notes (Private per user with RLS)
CREATE TABLE IF NOT EXISTS public.user_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    surah_number INTEGER NOT NULL,
    ayah_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. User Vocabulary (SRS Flashcards)
CREATE TABLE IF NOT EXISTS public.user_vocabularies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    word_arabic TEXT NOT NULL,
    transliteration TEXT,
    translation_en TEXT,
    translation_bn TEXT,
    root TEXT,
    surah_ref INTEGER,
    ayah_ref INTEGER,
    next_review_date TIMESTAMPTZ DEFAULT NOW(),
    interval INTEGER DEFAULT 1,
    ease_factor NUMERIC DEFAULT 2.5,
    repetitions INTEGER DEFAULT 0,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Reading Progress & Goals
CREATE TABLE IF NOT EXISTS public.user_reading_progress (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    last_read_surah INTEGER DEFAULT 1,
    last_read_ayah INTEGER DEFAULT 1,
    last_read_timestamp TIMESTAMPTZ DEFAULT NOW(),
    daily_goal_minutes INTEGER DEFAULT 15,
    completed_surahs INTEGER[] DEFAULT '{}',
    streak_days INTEGER DEFAULT 1
);

-- 17. Content Review Queue & Audit Logs (Admin)
CREATE TABLE IF NOT EXISTS public.content_review_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type TEXT NOT NULL,
    proposed_content JSONB NOT NULL,
    submitted_by UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewer_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    actor_id UUID REFERENCES auth.users(id),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- Row Level Security (RLS) Policies
-- ========================================================

-- Enable RLS on user-specific tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vocabularies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reading_progress ENABLE ROW LEVEL SECURITY;

-- Public tables: read-only access for anyone
ALTER TABLE public.surahs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for surahs" ON public.surahs FOR SELECT USING (true);

ALTER TABLE public.ayahs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for ayahs" ON public.ayahs FOR SELECT USING (true);

ALTER TABLE public.ayah_words ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for ayah_words" ON public.ayah_words FOR SELECT USING (true);

ALTER TABLE public.tafsir_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for tafsir_entries" ON public.tafsir_entries FOR SELECT USING (true);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for topics" ON public.topics FOR SELECT USING (true);

ALTER TABLE public.quranic_signs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for quranic_signs" ON public.quranic_signs FOR SELECT USING (true);

ALTER TABLE public.reciters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for reciters" ON public.reciters FOR SELECT USING (true);

-- User Profiles: users can select and update their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

-- User Bookmarks: private to owner
CREATE POLICY "Users can manage own bookmarks" ON public.user_bookmarks FOR ALL USING (auth.uid() = user_id);

-- User Notes: private to owner
CREATE POLICY "Users can manage own notes" ON public.user_notes FOR ALL USING (auth.uid() = user_id);

-- User Vocabulary: private to owner
CREATE POLICY "Users can manage own vocabulary" ON public.user_vocabularies FOR ALL USING (auth.uid() = user_id);

-- User Reading Progress: private to owner
CREATE POLICY "Users can manage own progress" ON public.user_reading_progress FOR ALL USING (auth.uid() = user_id);
