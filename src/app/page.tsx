'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Award,
  Star,
  CheckCircle2,
  TrendingUp,
  Headphones,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { SURAHS_DATA, getSurahByNumber } from '@/lib/quran-data/surahs';
import { PRELOADED_AYAHS } from '@/lib/quran-data/ayahs-data';
import { QURANIC_VOCABULARY_DATA } from '@/lib/quran-data/vocabulary';
import { QURAN_TOPICS_DATA } from '@/lib/quran-data/topics';
import { QURANIC_SIGNS_DATA } from '@/lib/quran-data/miracles';
import { getStoredProgress, getStoredBookmarks } from '@/lib/storage/user-storage';
import { useAudioPlayer } from '@/lib/audio/audio-player-context';
import { useLanguage } from '@/lib/language/language-context';
import { AzanPlayerSection } from '@/components/audio/AzanPlayerSection';

export default function HomePage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [progress, setProgress] = useState({ last_read_surah: 1, last_read_ayah: 1, streak_days: 1 });
  const [dayIndex, setDayIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [surahTab, setSurahTab] = useState<'surah' | 'juz' | 'revelation'>('surah');
  const [revelationFilter, setRevelationFilter] = useState<'all' | 'Meccan' | 'Medinan'>('all');
  
  const { playAyah } = useAudioPlayer();

  useEffect(() => {
    try {
      const p = getStoredProgress();
      if (p) setProgress(p);
    } catch {
      // safe fallback
    }

    const today = new Date();
    const day = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    setDayIndex(day);
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const queryNum = parseInt(searchQuery.trim(), 10);
    if (!isNaN(queryNum) && queryNum >= 1 && queryNum <= 114) {
      router.push(`/read/${queryNum}`);
      return;
    }
    const matched = SURAHS_DATA.find(
      (s) =>
        s.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name_bn.includes(searchQuery) ||
        s.name_ar.includes(searchQuery)
    );
    if (matched) {
      router.push(`/read/${matched.number}`);
    } else {
      router.push(`/read?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Daily reflection verses
  const dailyAyahsPool = [
    { surah: 1, ayah: 2, text_ar: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ', text_en: '[All] praise is [due] to Allah, Lord of the worlds.', text_bn: 'সকল প্রশংসা আল্লাহর জন্য, যিনি সকল সৃষ্টির প্রতিপালক।' },
    { surah: 2, ayah: 153, text_ar: 'يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ', text_en: 'O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.', text_bn: 'হে মুমিনগণ! ধৈর্য ও সালাতের মাধ্যমে সাহায্য প্রার্থনা করো। নিশ্চয় আল্লাহ ধৈর্যশীলদের সাথে আছেন।' },
    { surah: 2, ayah: 255, text_ar: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ', text_en: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.', text_bn: 'আল্লাহ, তিনি ছাড়া কোনো সত্য উপাস্য নেই; তিনি চিরঞ্জীব, সর্বসত্তার ধারক।' },
    { surah: 94, ayah: 5, text_ar: 'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا', text_en: 'For indeed, with hardship [will be] ease.', text_bn: 'নিশ্চয় কষ্টের সাথেই রয়েছে স্বস্তি।' },
    { surah: 112, ayah: 1, text_ar: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', text_en: 'Say, "He is Allah, [who is] One."', text_bn: 'বলুন, " তিনিই আল্লাহ, একক ও অদ্বিতীয়।"' }
  ];
  const dailyAyah = dailyAyahsPool[dayIndex % dailyAyahsPool.length];
  const dailyWord = QURANIC_VOCABULARY_DATA[dayIndex % QURANIC_VOCABULARY_DATA.length];

  // Filtered Surahs based on search & tab
  const filteredSurahs = SURAHS_DATA.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      s.number.toString().includes(q) ||
      s.name_en.toLowerCase().includes(q) ||
      s.name_bn.toLowerCase().includes(q) ||
      s.name_ar.includes(q) ||
      s.translation_en.toLowerCase().includes(q)
    );
    const matchesRevelation = revelationFilter === 'all' || s.revelation_place === revelationFilter;
    return matchesSearch && matchesRevelation;
  });

  // Grouped by Juz for Juz Tab
  const juzList = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-16 pb-24">
      
      {/* =========================================================================
          HERO SECTION: SEAMLESSLY BLENDED WITH ACTUAL WEBSITE THEME COLORS
          (Using actual website palette: ivory parchment in light, midnight forest in dark)
         ========================================================================= */}
      <section className="relative overflow-hidden bg-[var(--background)] text-[var(--foreground)] pt-10 sm:pt-16 pb-20 border-b border-[var(--border)] transition-colors">
        
        {/* Subtle Ambient Theme Glows (Emerald, Teal, Amber) */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/10 dark:bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* ----------------- LEFT COLUMN: TEXT, SEARCH & TESTIMONIAL ----------------- */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              {/* Cyan / Emerald Top Badge Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold tracking-wide shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t('পবিত্র কুরআন • পূর্ণাঙ্গ ডিজিটাল প্ল্যাটফর্ম', 'The Noble Quran • Intelligent Digital Platform')}</span>
              </div>

              {/* Massive Bold Headline in Website Foreground Color */}
              <div className="space-y-2">
                <div className="font-arabic text-amber-600 dark:text-amber-300 text-2xl font-normal tracking-wide">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>
                <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-[1.2] text-[var(--foreground)]">
                  {language === 'bn' ? (
                    <>
                      কুরআন পড়ুন ও বুঝুন <br />
                      <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 dark:from-emerald-400 dark:via-teal-300 dark:to-amber-400 bg-clip-text text-transparent">
                        সহজ ও নির্ভুলভাবে
                      </span> <br />
                      একই স্থানে
                    </>
                  ) : (
                    <>
                      Read, Understand <br />
                      <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 dark:from-emerald-400 dark:via-teal-300 dark:to-amber-400 bg-clip-text text-transparent">
                        The Quran In One
                      </span> <br />
                      Place
                    </>
                  )}
                </h1>
              </div>

              {/* Subtitle description in Website Muted Color */}
              <p className="text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed font-sans max-w-xl">
                {t(
                  'শব্দে শব্দে অর্থ ও ব্যাকরণ বিশ্লেষণ, নির্ভরযোগ্য প্রামাণ্য তাফসীর, বিষয়ভিত্তিক আয়াত এবং আধুনিক এআই সহকারী—আপনার কুরআন যাত্রার সবকিছু এক স্থানে।',
                  'Explore authentic word-by-word analysis, classical Tafsir, thematic connections, and AI study assistant. Everything for your Quran journey, all in one place.'
                )}
              </p>

              {/* Search Bar with Integrated Submit Button in Website Card Color */}
              <form onSubmit={handleHeroSearch} className="max-w-lg pt-1">
                <div className="relative flex items-center p-1.5 rounded-full bg-[var(--card)] border-2 border-[var(--border)] hover:border-emerald-500 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-lg shadow-black/5 dark:shadow-black/20">
                  <div className="pl-4 pr-2 text-[var(--muted-foreground)]">
                    <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('সূরা, আয়াত বা শব্দ খুঁজুন (যেমন: ১, আল-ফাতিহা, ৩৬, ২:২৫৫)...', 'Search Surah, Ayah, Word (e.g. 1, Al-Fatihah, 36, 2:255)...')}
                    className="w-full bg-transparent text-[var(--foreground)] text-xs sm:text-sm placeholder-[var(--muted-foreground)] outline-none pr-2 font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] mr-1 cursor-pointer"
                      title="Clear"
                    >
                      ✕
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-600 hover:from-violet-500 hover:to-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
                  >
                    {t('অনুসন্ধান', 'Search')}
                  </button>
                </div>

                {/* Quick Suggestion Pills */}
                <div className="flex items-center gap-1.5 pt-3 overflow-x-auto text-[11px] text-[var(--muted-foreground)]">
                  <span className="font-bold shrink-0 text-emerald-700 dark:text-emerald-400">{t('জনপ্রিয়:', 'Popular:')}</span>
                  {[
                    { label: '১. আল-ফাতিহা', num: 1 },
                    { label: '৩৬. ইয়াসীন', num: 36 },
                    { label: '৬৭. আল-মুলক', num: 67 },
                    { label: '৫৫. আর-রহমান', num: 55 },
                    { label: '১৮. আল-কাহফ', num: 18 }
                  ].map((item) => (
                    <button
                      key={item.num}
                      type="button"
                      onClick={() => router.push(`/read/${item.num}`)}
                      className="px-2.5 py-0.5 rounded-full bg-[var(--muted)] hover:bg-emerald-500/15 hover:text-emerald-700 dark:hover:text-emerald-300 border border-[var(--border)] transition-colors whitespace-nowrap font-medium cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </form>

              {/* 5-Star Rating & Quranic Reflection */}
              <div className="pt-4 border-t border-[var(--border)] space-y-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 ml-2">{t('৫.০ নির্ভরযোগ্য নির্দেশনা', '5.0 Verified Guidance')}</span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--foreground)]/90 italic max-w-lg leading-relaxed">
                  {t(
                    '“নিশ্চয় এই কুরআন এমন পথ প্রদর্শন করে যা সর্বাপেক্ষা সরল ও সঠিক এবং সৎকর্মশীল মুমিনদের সুসংবাদ দেয়।”',
                    '“Indeed, this Quran guides to that which is most upright, and gives glad tidings to the believers who work righteousness.”'
                  )}
                </p>
                <div className="text-[11px] text-[var(--muted-foreground)] font-semibold flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t('সূরা আল-ইসরা (১৭:৯)', 'Surah Al-Isra (17:9)')}</span>
                  <span>•</span>
                  <span>{t('১০০% বিশুদ্ধ ও প্রামাণ্য ইসলামিক উৎস', '100% Verified Classical Scholarship & Sahih Sources')}</span>
                </div>
              </div>

            </div>

            {/* ----------------- RIGHT COLUMN: FLOATING LAYERED CARDS & GEOMETRIC SHAPES ----------------- */}
            <div className="lg:col-span-6 relative flex items-center justify-center min-h-[460px] sm:min-h-[500px]">
              
              {/* Graphic 1: Amber Dotted Grid in the top-right background */}
              <div 
                className="absolute -top-4 right-6 w-32 h-32 opacity-70 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#f59e0b 2px, transparent 2px)',
                  backgroundSize: '12px 12px'
                }}
              />

              {/* Graphic 2: Vibrant Cyan / Emerald Circle with Wavy Lines behind main card */}
              <div className="absolute top-16 left-6 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20 pointer-events-none">
                <svg className="w-20 h-10 text-white" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                  <path d="M 0 10 Q 25 0 50 10 T 100 10" />
                  <path d="M 0 20 Q 25 10 50 20 T 100 20" />
                  <path d="M 0 30 Q 25 20 50 30 T 100 30" />
                </svg>
              </div>

              {/* Graphic 3: Deep Emerald / Blue Angled 3D Polygon slice behind cards */}
              <div className="absolute -bottom-6 right-8 w-48 h-32 bg-gradient-to-r from-emerald-600 to-teal-700 transform rotate-12 rounded-2xl opacity-80 shadow-xl pointer-events-none -z-0" />

              {/* MAIN CENTER FLOATING CARD (Using Website Card & Border Theme) */}
              <div className="relative z-10 w-72 sm:w-80 p-6 rounded-3xl bg-[var(--card)] text-[var(--foreground)] shadow-xl shadow-black/10 dark:shadow-black/50 border-2 border-[var(--border)] transform hover:-translate-y-1 transition-all duration-300 animate-float">
                
                {/* Avatar with Verified Cyan Badge */}
                <div className="relative mx-auto w-20 h-20 mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-950 flex items-center justify-center text-amber-300 border-2 border-amber-400 shadow-md">
                    <span className="font-arabic text-3xl font-bold select-none">قرآن</span>
                  </div>
                  {/* Verified Checkmark Badge */}
                  <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold border-2 border-[var(--card)] shadow-xs">
                    ✓
                  </div>
                </div>

                {/* Profile Title & Subtitle */}
                <div className="text-center space-y-1 mb-5">
                  <h3 className="text-lg font-black tracking-tight text-[var(--foreground)] flex items-center justify-center gap-1.5 font-bangla">
                    <span>{t('সূরা আল-ফাতিহা', 'Surah Al-Fatihah')}</span>
                    <span className="font-arabic text-base text-amber-600 dark:text-amber-400 font-bold">الفاتحة</span>
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] font-semibold font-bangla">
                    {t('৭ আয়াত • ২৯ শব্দ • মাক্কী সূরা', '7 Verses • 29 Words • Makki Chapter')}
                  </p>
                  <p className="text-[11px] text-[var(--foreground)]/80 font-medium pt-0.5 font-bangla">
                    {t('পবিত্র কুরআনের সূচনা ও সালাতের মূল ভিত্তি', 'Official Opening of the Holy Quran & Foundation of Prayer')}
                  </p>
                </div>

                {/* Vertical Floating Pill Strip on Side (In Website Card Theme) */}
                <div className="absolute -right-5 top-1/4 flex flex-col gap-2 p-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-xl z-20">
                  <Link href="/listen" className="w-8 h-8 rounded-full bg-[var(--muted)] hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-colors" title="Audio Recitations">
                    <Headphones className="w-4 h-4" />
                  </Link>
                  <Link href="/read/1" className="w-8 h-8 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-600 dark:text-amber-400 flex items-center justify-center transition-colors" title="Read Ayah by Ayah">
                    <BookOpen className="w-4 h-4" />
                  </Link>
                  <Link href="/word-by-word" className="w-8 h-8 rounded-full bg-teal-500/20 hover:bg-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center transition-colors" title="Word by Word Analysis">
                    <Layers className="w-4 h-4" />
                  </Link>
                  <Link href="/tafsir?surah=1" className="w-8 h-8 rounded-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-colors" title="Classical Tafsir">
                    <Sparkles className="w-4 h-4" />
                  </Link>
                  <Link href="/ai-study" className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-xs hover:scale-110 transition-transform" title="AI Quran Assistant">
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  </Link>
                </div>

                {/* Action Rows on Card */}
                <div className="space-y-2">
                  <Link
                    href="/read/1"
                    className="w-full py-2.5 px-3 rounded-xl bg-[var(--muted)] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-[var(--foreground)] text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-[var(--border)] font-bangla"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{t('সূরা আল-ফাতিহা পড়ুন', 'Read Surah Al-Fatihah')}</span>
                  </Link>
                  
                  <button
                    onClick={() => playAyah(1, 1)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer font-bangla"
                  >
                    <Play className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>{t('সম্পূর্ণ তিলাওয়াত শুনুন (আফাসী)', 'Play Full Recitation (Alafasy)')}</span>
                  </button>
                </div>
              </div>

              {/* FLOATING CARD 1: TOP-LEFT YELLOW CARD */}
              <div className="absolute top-4 -left-4 sm:-left-12 z-20 p-3 sm:p-3.5 rounded-2xl bg-amber-400 text-slate-950 font-bold shadow-xl border border-amber-300 flex items-center gap-2.5 transform hover:scale-105 transition-transform animate-float-reverse">
                <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-900">{t('আয়াত ১:১', 'Verse 1:1')}</div>
                  <div className="text-xs font-bold font-arabic">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
                </div>
              </div>

              {/* FLOATING CARD 2: BOTTOM-LEFT RECITER CARD (In Website Card Theme) */}
              <div className="absolute -bottom-8 -left-2 sm:-left-8 z-20 p-3 rounded-2xl bg-[var(--card)] text-[var(--foreground)] border-2 border-[var(--border)] shadow-xl flex items-center gap-3 backdrop-blur-md transform hover:scale-105 transition-transform">
                <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold border border-emerald-400 shadow-xs">
                  <Headphones className="w-4 h-4 text-amber-300" />
                </div>
                <div className="text-left font-bangla">
                  <div className="text-xs font-bold text-[var(--foreground)]">{t('মিশারী আল-আফাসী', 'Mishary Alafasy')}</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{t('১১৪ সূরার অডিও', '114 Surahs Audio')}</div>
                </div>
                <Link
                  href="/listen"
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-xs font-bangla"
                >
                  {t('শুনুন', 'Listen')}
                </Link>
              </div>

              {/* FLOATING CARD 3: BOTTOM-RIGHT REACH STAT CARD (In Website Card Theme) */}
              <div className="absolute -bottom-8 -right-2 sm:-right-6 z-20 p-3.5 rounded-2xl bg-[var(--card)] text-[var(--foreground)] border-2 border-[var(--border)] shadow-xl text-left transform hover:scale-105 transition-transform font-bangla">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[var(--muted-foreground)]">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{t('সম্পূর্ণ কুরআন', 'Complete Quran')}</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    {t('+১০০% প্রামাণ্য', '+100% Authentic')}
                  </span>
                </div>
                <div className="text-xl font-black text-[var(--foreground)] tracking-tight">
                  {t('৬,২৩৬ আয়াত', '6,236 Ayahs')}
                </div>
                <div className="text-[10px] text-[var(--muted-foreground)] font-semibold">
                  {t('৭৭,৪৩০ শব্দ • ১১৪ সূরা', '77,430 Words • 114 Surahs')}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: QURAN.COM-INSPIRED DIRECTORY & NAVIGATION TABS
          (Segmented switcher: Surahs, Juz, Word-by-Word, Tafsir, Bookmarks)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Quran.com Header & Segmented Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-4 font-bangla">
          <div>
            <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight flex items-center gap-2">
              <span>{t('পবিত্র কুরআন সূচিপত্র', 'Holy Quran Directory')}</span>
              <span className="text-sm font-normal text-[var(--muted-foreground)]">/ {t('১১৪ সূরার পূর্ণ তালিকা', '114 Surahs Directory')}</span>
            </h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {t('যেকোনো সূরা নির্বাচন করে বিশুদ্ধ বাংলা অনুবাদ, তাফসীর ও শব্দে শব্দে অর্থসহ অধ্যয়ন করুন।', 'Select any Surah to read with verified translations, tafsir, and word-by-word analysis.')}
            </p>
          </div>

          {/* Segmented Control Tabs (Like Quran.com) */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--muted)] border border-[var(--border)] self-start md:self-auto text-xs font-bold">
            <button
              onClick={() => { setSurahTab('surah'); setRevelationFilter('all'); }}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                surahTab === 'surah' && revelationFilter === 'all'
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-xs'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {t('সকল সূরা (১১৪)', 'Surah (114)')}
            </button>
            <button
              onClick={() => { setSurahTab('surah'); setRevelationFilter('Meccan'); }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                revelationFilter === 'Meccan'
                  ? 'bg-[var(--card)] text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {t('মাক্কী সূরা (৮৬)', 'Meccan (86)')}
            </button>
            <button
              onClick={() => { setSurahTab('surah'); setRevelationFilter('Medinan'); }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                revelationFilter === 'Medinan'
                  ? 'bg-[var(--card)] text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {t('মাদানী সূরা (২৮)', 'Medinan (28)')}
            </button>
            <button
              onClick={() => setSurahTab('juz')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                surahTab === 'juz'
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-xs'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {t('পারাভিত্তিক (৩০ পারা)', 'Juz (30 Juz)')}
            </button>
          </div>
        </div>

        {/* Live Filter Indicator Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs py-1">
          <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
            <span className="font-extrabold text-[var(--foreground)] px-2 py-0.5 rounded-md bg-[var(--muted)]">
              {filteredSurahs.length}
            </span>
            <span>{filteredSurahs.length === 114 ? 'টি সূরার সবকটি তালিকাভুক্ত রয়েছে' : 'টি সূরা ফিল্টার অনুযায়ী প্রদর্শিত হচ্ছে'}</span>
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-2.5 py-1 rounded-xl bg-[var(--muted)] hover:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <span>ফিল্টার মুছুন</span>
              <span className="font-bold">✕</span>
            </button>
          )}
        </div>

        {/* 114 Surahs Directory Grid (Quran.com Style) */}
        {surahTab === 'surah' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {filteredSurahs.map((surah) => (
              <Link
                key={surah.number}
                href={`/read/${surah.number}`}
                className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-900/5 dark:hover:shadow-black/30 transition-all flex items-center justify-between group shadow-2xs hover:-translate-y-0.5 relative overflow-hidden"
              >
                {/* Subtle Hover Gradient Corner */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center gap-3">
                  {/* Surah Number Box */}
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center border border-emerald-500/25 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all shrink-0">
                    {surah.number}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--foreground)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                      <span>{language === 'bn' ? surah.name_bn : surah.name_en}</span>
                    </div>
                    <div className="text-[11px] text-[var(--muted-foreground)] font-bangla">
                      {language === 'bn' ? `${surah.name_en} • ${surah.translation_bn}` : `${surah.name_bn} • ${surah.translation_en}`} • <span className="font-sans">{surah.verses_count} {language === 'bn' ? 'আয়াত' : 'verses'}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className="font-arabic text-xl font-bold text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                    {surah.name_ar}
                  </span>
                  <div className="mt-0.5">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      surah.revelation_place === 'Meccan'
                        ? 'bg-emerald-100/90 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                        : 'bg-indigo-100/90 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300'
                    }`}>
                      {surah.revelation_place === 'Meccan' ? 'মাক্কী' : 'মাদানী'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 30 Juz Grid (When Juz tab is active) */}
        {surahTab === 'juz' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {juzList.map((juzNum) => (
              <Link
                key={juzNum}
                href={`/read?juz=${juzNum}`}
                className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-indigo-500 hover:shadow-md transition-all text-center space-y-1 group"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs mx-auto flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {juzNum}
                </div>
                <div className="text-xs font-bold text-[var(--foreground)]">
                  পারা {juzNum}
                </div>
                <div className="text-[10px] text-[var(--muted-foreground)]">
                  Juz {juzNum}
                </div>
              </Link>
            ))}
          </div>
        )}

      </section>

      {/* =========================================================================
          SECTION 3: DAILY AYAH REFLECTION & QURANIC VOCABULARY
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Daily Ayah Card */}
          <div className="p-6 rounded-3xl border-2 border-emerald-300/80 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md flex flex-col justify-between space-y-4 hover:border-emerald-500 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200 uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60">
                <BookOpen className="w-3.5 h-3.5" />
                <span>দৈনিক আয়াত তাদাব্বুর (Daily Ayah)</span>
              </span>
              <button
                onClick={() => playAyah(dailyAyah.surah, dailyAyah.ayah)}
                className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
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
              <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 font-bangla font-semibold">
                &quot;{dailyAyah.text_bn}&quot;
              </p>
            </div>

            <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-700 dark:text-emerald-400">
                কুরআন [{dailyAyah.surah}:{dailyAyah.ayah}]
              </span>
              <Link
                href={`/read/${dailyAyah.surah}#ayah-${dailyAyah.surah}-${dailyAyah.ayah}`}
                className="text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-1"
              >
                <span>আয়াত ও তাফসীর পড়ুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Daily Vocabulary Word Card */}
          <div className="p-6 rounded-3xl border-2 border-amber-300/80 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/20 shadow-md flex flex-col justify-between space-y-4 hover:border-amber-500 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-200 uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/60">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>দৈনিক কুরআনিক শব্দ (Vocabulary)</span>
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold">
                কুরআনে {dailyWord.frequency} বার উল্লেখিত
              </span>
            </div>

            <div className="space-y-2 text-center py-2">
              <div className="font-arabic text-4xl text-amber-600 dark:text-amber-400 font-bold">
                {dailyWord.arabic}
              </div>
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {dailyWord.transliteration}
              </div>
              <div className="text-base font-extrabold text-[var(--foreground)]">
                {dailyWord.meaning_en}
              </div>
              <div className="text-sm text-[var(--muted-foreground)] font-bangla font-semibold">
                {dailyWord.meaning_bn}
              </div>
            </div>

            <div className="pt-2 border-t border-amber-200 dark:border-amber-800/50 flex items-center justify-between text-xs font-bold">
              <span className="text-[var(--muted-foreground)]">
                Root: <span className="font-arabic font-bold text-amber-600">{dailyWord.root}</span>
              </span>
              <Link
                href="/learn"
                className="text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1"
              >
                <span>ফ্ল্যাশ কার্ডে অনুশীলন করুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION: ICONIC AZAN COLLECTION (QARI OBAIDULLAH & WORLD MUADDHINS)
         ========================================================================= */}
      <AzanPlayerSection />

      {/* =========================================================================
          SECTION 4: INTERACTIVE STUDY MODULES (Color Coded Feature Cards)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--foreground)] tracking-tight">
            কুরআন অধ্যয়নের বিশেষ বিভাগসমূহ
          </h2>
          <p className="text-xs text-[var(--muted-foreground)]">
            তাফসীর, শব্দে শব্দে অর্থ, বিষয়ভিত্তিক অনুসন্ধান ও আধুনিক এআই সহকারী
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Link
            href="/word-by-word"
            className="p-5 rounded-2xl border-2 border-teal-300 dark:border-teal-700/60 bg-teal-50/50 dark:bg-teal-950/20 hover:border-teal-500 hover:shadow-md transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-teal-950 dark:text-teal-100 group-hover:text-teal-600">
              শব্দে শব্দে অর্থ (Word-by-Word)
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              এক সাথে একটি মাত্র আয়াতের মূল শব্দ, ব্যাকরণ পদ, বাংলা ও ইংরেজি অর্থসহ বিশদ বিশ্লেষণ।
            </p>
          </Link>

          <Link
            href="/tafsir"
            className="p-5 rounded-2xl border-2 border-amber-300 dark:border-amber-700/60 bg-amber-50/50 dark:bg-amber-950/20 hover:border-amber-500 hover:shadow-md transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-amber-950 dark:text-amber-100 group-hover:text-amber-600">
              প্রামাণ্য তাফসীর (Classical Tafsir)
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              ইবনে কাসীর ও আহসানুল বায়ান থেকে আয়াতভিত্তিক নির্ভরযোগ্য ব্যাখ্যা ও সম্পর্কিত আয়াতসমূহ।
            </p>
          </Link>

          <Link
            href="/topics"
            className="p-5 rounded-2xl border-2 border-indigo-300 dark:border-indigo-700/60 bg-indigo-50/50 dark:bg-indigo-950/20 hover:border-indigo-500 hover:shadow-md transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-indigo-950 dark:text-indigo-100 group-hover:text-indigo-600">
              বিষয়ভিত্তিক কুরআন (Topics)
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              তাওহীদ, নবীগণ, সালাত, দান, ধৈর্য ও ন্যায়বিচার সম্পর্কিত সকল আয়াত বিষয়ভিত্তিক সাজানো।
            </p>
          </Link>

          <Link
            href="/ai-study"
            className="p-5 rounded-2xl border-2 border-violet-400 dark:border-violet-600/70 bg-gradient-to-br from-violet-50/80 to-purple-50/80 dark:from-violet-950/30 dark:to-purple-950/20 hover:border-violet-500 hover:shadow-md transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-violet-950 dark:text-violet-100 group-hover:text-violet-600 flex items-center gap-1.5">
              <span>এআই গবেষণা (Gemini AI)</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-900 font-extrabold">NEW</span>
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              পবিত্র কুরআনের আয়াত ও নির্ভরযোগ্য তাফসীর ভিত্তিক প্রশ্নোত্তরে আধুনিক জেমিনি এআই সহকারী।
            </p>
          </Link>

        </div>
      </section>

    </div>
  );
}
