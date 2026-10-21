'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Layers, 
  Compass, 
  Bookmark, 
  Moon, 
  Sun, 
  Volume2, 
  GraduationCap, 
  Menu, 
  X,
  Languages,
  ChevronDown,
  ArrowRight,
  Flame,
  Star,
  CheckCircle2,
  SlidersHorizontal,
  FileText,
  LayoutGrid,
  Radio
} from 'lucide-react';
import { GlobalSearchModal } from '../search/GlobalSearchModal';
import { SURAHS_DATA } from '@/lib/quran-data/surahs';
import { getStoredBookmarks, getStoredProgress } from '@/lib/storage/user-storage';
import { ReadingProgress, UserBookmark } from '@/types/quran';
import { useLanguage } from '@/lib/language/language-context';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  
  const [isDark, setIsDark] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Quick Surah Jumper Dropdown State
  const [isSurahJumperOpen, setIsSurahJumperOpen] = useState(false);
  const [surahFilterQuery, setSurahFilterQuery] = useState('');
  
  // Top announcement / ticker visibility
  const [showTopBar, setShowTopBar] = useState(true);
  
  // User Storage State
  const [bookmarks, setBookmarks] = useState<UserBookmark[]>([]);
  const [progress, setProgress] = useState<ReadingProgress | null>(null);

  const jumperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check initial dark mode
    const isDarkMode = document.documentElement.classList.contains('dark') || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }

    // Load saved language
    const savedLang = localStorage.getItem('alquran_lang') as 'en' | 'bn' | null;
    if (savedLang) {
      setLanguage(savedLang);
    }

    // Load user bookmarks and reading progress
    try {
      setBookmarks(getStoredBookmarks());
      setProgress(getStoredProgress());
    } catch {
      // safe fallback
    }

    // Keyboard shortcut (Ctrl+K or Cmd+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSurahJumperOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Click outside listener for dropdowns
    const handleClickOutside = (e: MouseEvent) => {
      if (jumperRef.current && !jumperRef.current.contains(e.target as Node)) {
        setIsSurahJumperOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const filteredSurahs = SURAHS_DATA.filter((s) => {
    const q = surahFilterQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.number.toString().includes(q) ||
      s.name_en.toLowerCase().includes(q) ||
      s.name_ar.includes(q) ||
      s.name_bn.toLowerCase().includes(q) ||
      s.translation_en.toLowerCase().includes(q) ||
      s.translation_bn.toLowerCase().includes(q)
    );
  });

  const popularSurahs = [
    { num: 1, en: 'Al-Fatihah', bn: 'আল-ফাতিহা', ar: 'الفاتحة' },
    { num: 2, en: 'Al-Baqarah', bn: 'আল-বাক্বারাহ', ar: 'البقرة' },
    { num: 18, en: 'Al-Kahf', bn: 'আল-কাহফ', ar: 'الكهف' },
    { num: 36, en: 'Ya-Sin', bn: 'ইয়াসীন', ar: 'يس' },
    { num: 55, en: 'Ar-Rahman', bn: 'আর-রহমান', ar: 'الرحمن' },
    { num: 67, en: 'Al-Mulk', bn: 'আল-মুলক', ar: 'الملك' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all">
        {/* Top Shimmer Gradient Line */}
        <div className="h-[2.5px] w-full bg-gradient-to-r from-emerald-600 via-amber-400 via-teal-400 to-emerald-600" />

        {/* 1. Top Serenity Bar & Quick Surah Chips */}
        {showTopBar && (
          <div className="hidden md:flex items-center justify-between px-4 sm:px-6 lg:px-8 py-1.5 bg-emerald-950/90 text-emerald-100 text-xs border-b border-emerald-800/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="font-arabic text-amber-300 text-sm tracking-wide font-medium">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </span>
              <span className="text-emerald-400/60 hidden lg:inline">•</span>
              <span className="text-emerald-200/80 hidden lg:inline font-medium">
                {language === 'bn' 
                  ? 'পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে' 
                  : 'In the name of Allah, the Entirely Merciful, the Especially Merciful'}
              </span>
            </div>

            {/* Quick Popular Surah Jumper Chips */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-amber-300/90 font-semibold uppercase tracking-wider hidden xl:inline flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                {language === 'bn' ? 'জনপ্রিয় সূরা:' : 'Popular:'}
              </span>
              <div className="flex items-center gap-1">
                {popularSurahs.map((ps) => (
                  <Link
                    key={ps.num}
                    href={`/read/${ps.num}`}
                    className="px-2 py-0.5 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-amber-300 border border-emerald-700/50 hover:border-amber-400/60 text-[11px] font-medium transition-all"
                  >
                    <span>{ps.num}. {language === 'bn' ? ps.bn : ps.en}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Resume Last Read & Bookmarks Summary */}
            <div className="flex items-center gap-3">
              {progress?.last_read_surah && (
                <Link
                  href={`/read/${progress.last_read_surah}`}
                  className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 font-semibold bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30 transition-all"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>
                    {language === 'bn' ? 'চলমান সূরা ' : 'Resume: Surah '}
                    {progress.last_read_surah}
                  </span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}

              <Link
                href="/study"
                className="flex items-center gap-1 text-[11px] text-emerald-300 hover:text-white transition-colors"
                title="View your bookmarks and study notes"
              >
                <Star className="w-3 h-3 text-amber-400 fill-amber-400/40" />
                <span>{bookmarks.length} {language === 'bn' ? 'সংরক্ষিত' : 'Saved'}</span>
              </Link>

              <button
                onClick={() => setShowTopBar(false)}
                className="text-emerald-400/60 hover:text-emerald-200 p-0.5 ml-1"
                title="Dismiss announcement bar"
                aria-label="Dismiss top bar"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* 2. Main Navigation Bar (Modern Design inspired by user's chosen header architecture) */}
        <div className="nav-glass border-b border-[var(--border)] transition-colors w-full max-w-full overflow-hidden">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-6 lg:gap-8 w-full max-w-full">
            
            {/* Left: Brand Logo & Typography */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <div className="relative shrink-0">
                <div className="w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-950 flex items-center justify-center text-white shadow-md border border-amber-400/50 group-hover:border-amber-400 transition-all duration-300 group-hover:scale-105">
                  <span className="font-arabic text-base sm:text-xl font-bold text-amber-300 drop-shadow-xs select-none">
                    قرآن
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#09130e]" />
              </div>

              <div className="flex flex-col shrink-0">
                <span className="text-sm sm:text-xl font-black tracking-wider text-[var(--foreground)] uppercase group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                  AL-QURAN
                </span>
                <span className="text-[8px] sm:text-[10px] font-bold text-[var(--muted-foreground)] tracking-widest uppercase">
                  القرآن الكريم
                </span>
              </div>
            </Link>

            {/* Center: Desktop Navigation Links with Active Underline Accent */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {[
                { href: '/', labelEn: 'HOME', labelBn: 'হোম' },
                { href: '/read', labelEn: 'READ', labelBn: 'পড়ুন', matchPrefix: true },
                { href: '/tafsir', labelEn: 'TAFSIR', labelBn: 'তাফসীর' },
                { href: '/word-by-word', labelEn: 'WORDS', labelBn: 'শব্দে শব্দে' },
                { href: '/topics', labelEn: 'TOPICS', labelBn: 'বিষয়ভিত্তিক' },
                { href: '/ai-study', labelEn: 'AI STUDY', labelBn: 'এআই গবেষণা', isAi: true },
                { href: '/listen', labelEn: 'LISTEN', labelBn: 'শুনুন' },
                { href: '/#azan', labelEn: 'AZAN', labelBn: 'আযান' },
              ].map((item) => {
                const isActive = item.href === '/'
                  ? pathname === '/'
                  : item.matchPrefix
                    ? pathname.startsWith('/read') && pathname !== '/word-by-word'
                    : pathname === item.href || pathname.startsWith(item.href + '/');

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative text-xs tracking-widest uppercase font-bold py-1.5 transition-colors group/nav ${
                      isActive
                        ? 'text-emerald-800 dark:text-cyan-400 font-extrabold after:content-[""] after:absolute after:-bottom-[20px] after:left-0 after:right-0 after:h-[2.5px] after:bg-emerald-700 dark:after:bg-cyan-400 dark:after:shadow-[0_0_10px_rgba(34,211,238,0.9)] after:rounded-full'
                        : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:after:content-[""] hover:after:absolute hover:after:-bottom-[20px] hover:after:left-0 hover:after:right-0 hover:after:h-[1.5px] hover:after:bg-emerald-500/40 hover:after:rounded-full'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
                      {item.isAi && (
                        <Sparkles className="w-3 h-3 text-amber-500 dark:text-cyan-400 animate-pulse" />
                      )}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Search, Quick Jumper, Toggles, CTA Button, Menu */}
            <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
              
              {/* Minimalist Circular Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 sm:p-2.5 rounded-full hover:bg-[var(--muted)] text-[var(--foreground)] transition-all cursor-pointer group"
                title="Search Quran Ayahs, Surahs & Topics (Ctrl+K / Cmd+K)"
                aria-label="Search Quran"
              >
                <Search className="w-4 h-4 text-[var(--foreground)] group-hover:scale-110 group-hover:text-emerald-600 dark:group-hover:text-cyan-400 transition-all" />
              </button>

              {/* Quick Listen & Azan on Header (Mobile & Desktop) */}
              <Link
                href="/listen"
                className="p-1.5 sm:p-2.5 rounded-full hover:bg-[var(--muted)] text-emerald-700 dark:text-emerald-400 transition-all cursor-pointer flex items-center justify-center"
                title={language === 'bn' ? 'কুরআন তিলাওয়াত শুনুন' : 'Listen to Recitations'}
                aria-label="Listen"
              >
                <Volume2 className="w-4 h-4" />
              </Link>

              <Link
                href="/#azan"
                onClick={() => {
                  if (pathname === '/') {
                    const azanEl = document.getElementById('azan');
                    if (azanEl) azanEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="p-1.5 sm:p-2.5 rounded-full hover:bg-[var(--muted)] text-amber-600 dark:text-amber-400 transition-all cursor-pointer flex items-center justify-center"
                title={language === 'bn' ? 'আযান সমগ্র' : 'Azan Collection'}
                aria-label="Azan"
              >
                <Radio className="w-4 h-4" />
              </Link>

              {/* Quick Surah Jumper Popover */}
              <div ref={jumperRef} className="relative hidden sm:block">
                <button
                  onClick={() => setIsSurahJumperOpen(!isSurahJumperOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] hover:border-emerald-500/50 text-[var(--foreground)] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                  title="Quickly jump to any of the 114 Surahs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    {language === 'bn' ? 'সূরা নির্বাচন' : '114 Surahs'}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-[var(--muted-foreground)] transition-transform ${isSurahJumperOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSurahJumperOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 max-h-96 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xl overflow-hidden z-50 flex flex-col animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-3 border-b border-[var(--border)] bg-[var(--muted)]/50">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                        <input
                          type="text"
                          value={surahFilterQuery}
                          onChange={(e) => setSurahFilterQuery(e.target.value)}
                          placeholder={language === 'bn' ? 'সূরা খুঁজুন (নাম বা নম্বর)...' : 'Filter 114 Surahs (name/number)...'}
                          autoFocus
                          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="overflow-y-auto max-h-72 p-2 divide-y divide-[var(--border)]/40">
                      {filteredSurahs.map((surah) => (
                        <button
                          key={surah.number}
                          onClick={() => {
                            router.push(`/read/${surah.number}`);
                            setIsSurahJumperOpen(false);
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left transition-colors group/row cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-[var(--muted)] group-hover/row:bg-emerald-500 group-hover/row:text-white flex items-center justify-center text-[11px] font-bold text-[var(--muted-foreground)] transition-colors">
                              {surah.number}
                            </span>
                            <div>
                              <div className="text-xs font-bold text-[var(--foreground)] group-hover/row:text-emerald-600 dark:group-hover/row:text-emerald-400">
                                {language === 'bn' ? surah.name_bn : surah.name_en}
                              </div>
                              <div className="text-[10px] text-[var(--muted-foreground)]">
                                {surah.translation_en} • {surah.verses_count}v
                              </div>
                            </div>
                          </div>
                          <span className="font-arabic text-sm text-amber-500 font-bold">
                            {surah.name_ar}
                          </span>
                        </button>
                      ))}
                      {filteredSurahs.length === 0 && (
                        <div className="p-4 text-center text-xs text-[var(--muted-foreground)]">
                          {language === 'bn' ? 'কোনো সূরা পাওয়া যায়নি' : 'No Surah found'}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Language Switcher Pill (বাং | EN) */}
              <div className="flex items-center gap-0.5 p-0.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-xs font-bold text-[var(--foreground)] shadow-2xs">
                <button
                  onClick={() => setLanguage('bn')}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                    language === 'bn'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                  title="বাংলা ভাষায় দেখুন"
                >
                  বাং
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                    language === 'en'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                  title="Switch to English"
                >
                  EN
                </button>
              </div>

              {/* Theme Switcher */}
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-full border border-[var(--border)] bg-[var(--card)] hover:border-amber-400/50 text-[var(--foreground)] transition-all shadow-2xs group cursor-pointer"
                title="Toggle Dark / Light Theme"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 group-hover:-rotate-12 transition-transform" />
                )}
              </button>

              {/* Signature CTA Button (Hidden on small mobile to prevent overflow) */}
              <Link
                href={`/read/${progress?.last_read_surah || 1}`}
                className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-black tracking-wider uppercase shadow-md shadow-emerald-900/15 dark:shadow-[0_0_18px_rgba(16,185,129,0.4)] dark:border dark:border-emerald-400/60 hover:scale-105 active:scale-95 transition-all duration-200 group"
              >
                <span>{language === 'bn' ? 'শুরু করুন' : 'GET STARTED'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Far Right: 9-Dots / Hamburger Menu Icon */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 sm:p-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
                aria-label="Toggle navigation drawer"
                title="Navigation & Features"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-amber-500" />
                ) : (
                  <>
                    <LayoutGrid className="w-5 h-5 hidden lg:block text-[var(--foreground)]" />
                    <Menu className="w-5 h-5 lg:hidden text-[var(--foreground)]" />
                  </>
                )}
              </button>

            </div>
          </div>
        </div>

        {/* 3. Mobile Full Menu Overlay Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-b border-[var(--border)] bg-[var(--card)]/98 backdrop-blur-xl px-4 py-5 shadow-2xl animate-in slide-in-from-top-3 duration-200">
            {/* Search Button inside mobile menu */}
            <div className="mb-4">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]/60 text-xs font-medium text-[var(--muted-foreground)] hover:border-emerald-500"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-500" />
                  <span>{language === 'bn' ? 'কুরআনে অনুসন্ধান করুন...' : 'Search Surah, Ayah or Topic...'}</span>
                </div>
                <kbd className="px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--border)] text-[10px] font-mono">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Quick Popular Surahs in Mobile */}
            <div className="mb-4">
              <div className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-2 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-500" />
                {language === 'bn' ? 'জনপ্রিয় সূরা সমূহ' : 'Popular Surahs'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {popularSurahs.map((ps) => (
                  <Link
                    key={ps.num}
                    href={`/read/${ps.num}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-2.5 py-1 rounded-lg bg-[var(--muted)] hover:bg-emerald-500/10 hover:text-emerald-600 border border-[var(--border)] text-xs font-semibold"
                  >
                    {ps.num}. {language === 'bn' ? ps.bn : ps.en}
                  </Link>
                ))}
              </div>
            </div>

            {/* Grid of Main Navigation Cards */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Link
                href="/read"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-emerald-500 bg-[var(--muted)]/40 hover:bg-emerald-500/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--foreground)]">
                    {language === 'bn' ? 'কুরআন পড়ুন' : 'Read Quran'}
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">১১৪ Surahs</div>
                </div>
              </Link>

              <Link
                href="/tafsir"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-amber-500 bg-[var(--muted)]/40 hover:bg-amber-500/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--foreground)]">
                    {language === 'bn' ? 'তাফসীর' : 'Tafsir'}
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">Ibn Kathir</div>
                </div>
              </Link>

              <Link
                href="/word-by-word"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-emerald-500 bg-[var(--muted)]/40 hover:bg-emerald-500/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--foreground)]">
                    {language === 'bn' ? 'শব্দে শব্দে' : 'Word-by-Word'}
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">Grammar & Roots</div>
                </div>
              </Link>

              <Link
                href="/topics"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-amber-500 bg-[var(--muted)]/40 hover:bg-amber-500/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--foreground)]">
                    {language === 'bn' ? 'বিষয়ভিত্তিক' : 'Topics'}
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">Thematic study</div>
                </div>
              </Link>

              <Link
                href="/listen"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-emerald-500 bg-[var(--muted)]/40 hover:bg-emerald-500/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--foreground)]">
                    {language === 'bn' ? 'শুনুন' : 'Recitations'}
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">Audio Player</div>
                </div>
              </Link>

              <Link
                href="/#azan"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (pathname === '/') {
                    const el = document.getElementById('azan');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-3 p-3 rounded-xl border border-amber-500/40 hover:border-amber-500 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Radio className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                    <span>{language === 'bn' ? 'আযান সমগ্র' : 'Azan Collection'}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-extrabold">NEW</span>
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">Qari Obaidullah & Muaddhins</div>
                </div>
              </Link>

              <Link
                href="/ai-study"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl border border-amber-300/70 dark:border-amber-400 ai-gradient-button text-white shadow-md shadow-purple-900/30 transition-transform active:scale-95"
              >
                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs text-amber-200 flex items-center justify-center shrink-0 border border-white/30">
                  <Sparkles className="w-4 h-4 text-amber-200 animate-spin-slow" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <span>{language === 'bn' ? 'এআই গবেষণা' : 'AI Study'}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400 text-purple-950 font-black">GEMINI</span>
                  </div>
                  <div className="text-[10px] text-amber-100 font-medium">Interactive Islamic Intelligence</div>
                </div>
              </Link>
            </div>

            {/* Bottom Utilities in Mobile Drawer */}
            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
              <Link
                href="/study"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-1.5 text-[var(--foreground)] font-semibold hover:text-emerald-500"
              >
                <Bookmark className="w-4 h-4 text-amber-500" />
                <span>{language === 'bn' ? 'আমার নোট ও বুকমার্ক' : 'Saved Bookmarks & Notes'}</span>
              </Link>

              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[var(--muted-foreground)] hover:text-emerald-600 text-[11px]"
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Command Search Modal */}
      <GlobalSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        language={language} 
      />
    </>
  );
}
