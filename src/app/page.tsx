'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Layers, 
  Compass, 
  Sparkles, 
  Volume2, 
  GraduationCap, 
  Bookmark, 
  ArrowRight, 
  Play, 
  Check, 
  Search,
  Flame,
  Award
} from 'lucide-react';
import { SURAHS_DATA, getSurahByNumber } from '@/lib/quran-data/surahs';
import { PRELOADED_AYAHS } from '@/lib/quran-data/ayahs-data';
import { QURANIC_VOCABULARY_DATA } from '@/lib/quran-data/vocabulary';
import { QURAN_TOPICS_DATA } from '@/lib/quran-data/topics';
import { QURANIC_SIGNS_DATA } from '@/lib/quran-data/miracles';
import { getStoredProgress } from '@/lib/storage/user-storage';
import { useAudioPlayer } from '@/lib/audio/audio-player-context';

export default function HomePage() {
  const [progress, setProgress] = useState({ last_read_surah: 1, last_read_ayah: 1, streak_days: 1 });
  const [dayIndex, setDayIndex] = useState(0);
  const { playAyah } = useAudioPlayer();

  useEffect(() => {
    const p = getStoredProgress();
    setProgress(p);

    const today = new Date();
    const day = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    setDayIndex(day);
  }, []);

  // Curated list of profound Ayahs for daily reflection
  const dailyAyahsPool = [
    { surah: 1, ayah: 2, text_ar: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ', text_en: '[All] praise is [due] to Allah, Lord of the worlds.', text_bn: 'সকল প্রশংসা আল্লাহর জন্য, যিনি সকল সৃষ্টির প্রতিপালক।' },
    { surah: 2, ayah: 153, text_ar: 'يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ', text_en: 'O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.', text_bn: 'হে মুমিনগণ! ধৈর্য ও সালাতের মাধ্যমে সাহায্য প্রার্থনা করো। নিশ্চয় আল্লাহ ধৈর্যশীলদের সাথে আছেন।' },
    { surah: 2, ayah: 255, text_ar: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ', text_en: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.', text_bn: 'আল্লাহ, তিনি ছাড়া কোনো সত্য উপাস্য নেই; তিনি চিরঞ্জীব, সর্বসত্তার ধারক।' },
    { surah: 94, ayah: 5, text_ar: 'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا', text_en: 'For indeed, with hardship [will be] ease.', text_bn: 'নিশ্চয় কষ্টের সাথেই রয়েছে স্বস্তি।' },
    { surah: 112, ayah: 1, text_ar: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', text_en: 'Say, "He is Allah, [who is] One."', text_bn: 'বলুন, " তিনিই আল্লাহ, একক ও অদ্বিতীয়।"' }
  ];
  const dailyAyah = dailyAyahsPool[dayIndex % dailyAyahsPool.length];
  const dailyWord = QURANIC_VOCABULARY_DATA[dayIndex % QURANIC_VOCABULARY_DATA.length];

  const popularSurahs = [
    { num: 1, name: 'Al-Fatihah', bn: 'আল-ফাতিহা', ar: 'الفاتحة', desc: 'The Opening' },
    { num: 2, name: 'Al-Baqarah', bn: 'আল-বাক্বারাহ', ar: 'البقرة', desc: 'The Cow' },
    { num: 18, name: 'Al-Kahf', bn: 'আল-কাহফ', ar: 'الكهف', desc: 'The Cave' },
    { num: 36, name: 'Ya-Sin', bn: 'ইয়া-সীন', ar: 'يس', desc: 'Heart of Quran' },
    { num: 55, name: 'Ar-Rahman', bn: 'আর-রাহমান', ar: 'الرحمن', desc: 'The Beneficent' },
    { num: 67, name: 'Al-Mulk', bn: 'আল-মুলক', ar: 'الملك', desc: 'Sovereignty' },
    { num: 112, name: 'Al-Ikhlas', bn: 'আল-ইখলাস', ar: 'الإخلاص', desc: 'Pure Sincerity' },
    { num: 114, name: 'An-Nas', bn: 'আন-নাস', ar: 'الناس', desc: 'Mankind' }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-[var(--primary-light)]/40 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-xs text-xs font-semibold text-[var(--primary)] animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive Quran Study & Reflection Platform</span>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[var(--foreground)]">
              Read, Reflect & Understand <br />
              <span className="text-[var(--primary)] font-arabic font-normal text-5xl sm:text-7xl">الْقُرْآنَ الْكَرِيمَ</span>
            </h1>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed font-sans max-w-2xl mx-auto">
              Every Arabic word is clickable for grammar, root, and translation. Discover related Ayahs, compare verified classical Tafsir, and learn vocabulary with spaced repetition.
            </p>
          </div>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={`/read/${progress.last_read_surah}#ayah-${progress.last_read_surah}-${progress.last_read_ayah}`}
              className="px-6 py-3 rounded-2xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Continue Reading (Surah {progress.last_read_surah})</span>
            </Link>

            <Link
              href="/tafsir"
              className="px-6 py-3 rounded-2xl bg-[var(--card)] hover:bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] text-sm font-semibold flex items-center gap-2 transition-all shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-[var(--primary)]" />
              <span>Tafsir & Related Ayahs</span>
            </Link>

            <Link
              href="/word-by-word"
              className="px-6 py-3 rounded-2xl bg-[var(--card)] hover:bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] text-sm font-semibold flex items-center gap-2 transition-all shadow-xs"
            >
              <Layers className="w-4 h-4 text-[var(--gold)]" />
              <span>Word-by-Word Study</span>
            </Link>

            <Link
              href="/ai-study"
              className="px-6 py-3 rounded-2xl bg-[var(--gold-light)] border border-[var(--gold)]/40 hover:bg-[var(--gold-light)]/80 text-[var(--gold-foreground)] text-sm font-semibold flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[var(--gold)]" />
              <span>AI Study Assistant</span>
            </Link>
          </div>

        </div>
      </section>

      {/* Daily Highlights: Daily Ayah & Daily Vocabulary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Daily Ayah Card */}
          <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-md flex flex-col justify-between space-y-4 hover:border-[var(--primary)]/60 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Daily Ayah Reflection</span>
              </span>
              <button
                onClick={() => playAyah(dailyAyah.surah, dailyAyah.ayah)}
                className="p-2 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors"
                title="Play Audio"
              >
                <Play className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="font-arabic text-2xl sm:text-3xl text-[var(--foreground)] text-right leading-loose">
                {dailyAyah.text_ar}
              </p>
              <p className="text-xs sm:text-sm text-[var(--foreground)]/90 italic font-sans">
                &quot;{dailyAyah.text_en}&quot;
              </p>
              <p className="text-xs sm:text-sm text-[var(--foreground)]/80 font-bangla">
                &quot;{dailyAyah.text_bn}&quot;
              </p>
            </div>

            <div className="pt-2 border-t border-[var(--border)]/60 flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--muted-foreground)]">
                Quran [{dailyAyah.surah}:{dailyAyah.ayah}]
              </span>
              <Link
                href={`/read/${dailyAyah.surah}#ayah-${dailyAyah.surah}-${dailyAyah.ayah}`}
                className="font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                <span>Study Ayah & Tafsir</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Daily Vocabulary Word Card */}
          <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-md flex flex-col justify-between space-y-4 hover:border-[var(--gold)]/60 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--gold)] uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                <span>Quranic Word of the Day</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--gold-light)] text-[var(--gold-foreground)] font-bold">
                Appears {dailyWord.frequency}x
              </span>
            </div>

            <div className="space-y-2 text-center py-2">
              <div className="font-arabic text-4xl text-[var(--foreground)] font-bold">
                {dailyWord.arabic}
              </div>
              <div className="text-sm font-semibold text-[var(--primary)]">
                {dailyWord.transliteration}
              </div>
              <div className="text-base font-bold text-[var(--foreground)]">
                {dailyWord.meaning_en}
              </div>
              <div className="text-sm text-[var(--muted-foreground)] font-bangla">
                {dailyWord.meaning_bn}
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--border)]/60 flex items-center justify-between text-xs">
              <span className="text-[var(--muted-foreground)]">Root: <span className="font-arabic font-bold text-[var(--foreground)]">{dailyWord.root}</span></span>
              <Link
                href="/learn"
                className="font-semibold text-[var(--gold)] hover:underline flex items-center gap-1"
              >
                <span>Practice Flashcards</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Navigation Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
              Interactive Study Modules
            </h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              Deepen your relationship with the words and message of Allah
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <Link
            href="/tafsir"
            className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:shadow-md transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--primary)]">
              Tafsir & Related Ayahs
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              Exegesis from Ibn Kathir, Ahsanul Bayaan, Jalalayn, and interconnected Ayahs across the Quran.
            </p>
          </Link>

          <Link
            href="/word-by-word"
            className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:shadow-md transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--primary)]">
              Word-by-Word Quran
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              Touch any Arabic word to inspect its root letters, lemma, part of speech, and occurrences.
            </p>
          </Link>

          <Link
            href="/topics"
            className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:shadow-md transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--primary)]">
              Topic Explorer
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              Explore Tawhid, Prophets, Salah, Charity, Justice, Family, and Creation categorized by topic.
            </p>
          </Link>

          <Link
            href="/miracles"
            className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:shadow-md transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--primary)]">
              Signs & Reflection
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              Scholarly discussions on cosmic expansion, embryology, geology, and historical preservation.
            </p>
          </Link>

          <Link
            href="/learn"
            className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:shadow-md transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--primary)]">
              Arabic Flashcards
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              Spaced Repetition System (SRS) algorithm to master high-frequency Quranic vocabulary.
            </p>
          </Link>

        </div>
      </section>

      {/* Popular Surahs Quick Jump */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
              Popular Surahs
            </h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              Quick access to frequently recited chapters of the Quran
            </p>
          </div>
          <Link
            href="/read"
            className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
          >
            <span>All 114 Surahs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {popularSurahs.map((s) => (
            <Link
              key={s.num}
              href={`/read/${s.num}`}
              className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:bg-[var(--primary-light)]/20 transition-all flex items-center justify-between group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] font-bold text-xs flex items-center justify-center">
                  {s.num}
                </span>
                <div>
                  <div className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--primary)]">
                    {s.name}
                  </div>
                  <div className="text-[11px] text-[var(--muted-foreground)] font-bangla">
                    {s.bn}
                  </div>
                </div>
              </div>
              <span className="font-arabic text-lg text-[var(--foreground)] group-hover:text-[var(--primary)]">
                {s.ar}
              </span>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
