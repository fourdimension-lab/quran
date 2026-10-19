'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Link2, 
  Sparkles, 
  Volume2, 
  Pause,
  Play,
  Bookmark, 
  Copy, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ExternalLink,
  X,
  FileText
} from 'lucide-react';
import { SURAHS_DATA, getSurahByNumber } from '@/lib/quran-data/surahs';
import { getSurahAyahs } from '@/lib/quran-data/quran-service';
import { getTafsirForAyah, TAFSIR_SOURCES } from '@/lib/quran-data/tafsir';
import { getRelatedAyahs } from '@/lib/quran-data/related-ayahs';
import { Ayah, TafsirEntry, RelatedAyah } from '@/types/quran';
import { useAudioPlayer } from '@/lib/audio/audio-player-context';
import { isAyahBookmarked, saveBookmark, saveNote, getStoredNotes } from '@/lib/storage/user-storage';

function TafsirContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSurah = Number(searchParams.get('surah')) || 1;
  const initialAyah = Number(searchParams.get('ayah')) || 0; // 0 means whole surah without pre-expanded ayah

  const [surahNumber, setSurahNumber] = useState(initialSurah);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // At any given time, only ONE Ayah's Tafsir will be expanded/shown
  const [expandedAyahNumber, setExpandedAyahNumber] = useState<number | null>(initialAyah > 0 ? initialAyah : null);

  // Tafsir & Related data for the currently expanded Ayah
  const [activeTafsirList, setActiveTafsirList] = useState<TafsirEntry[]>([]);
  const [activeRelatedAyahs, setActiveRelatedAyahs] = useState<RelatedAyah[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState('ahsanul-bayaan'); // Default to Bangla Ahsanul Bayaan
  const [selectedRelationFilter, setSelectedRelationFilter] = useState('all');

  // Copy and bookmark status
  const [copiedAyahNumber, setCopiedAyahNumber] = useState<number | null>(null);
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<number, boolean>>({});

  // Note-taking state for expanded Ayah
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  const { isPlaying, currentSurah, currentAyah: playingAyahNum, playAyah, pause } = useAudioPlayer();
  const surahMeta = getSurahByNumber(surahNumber) || SURAHS_DATA[0];

  // Ref to track ayah elements for smooth scrolling
  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Handle URL query parameters
  useEffect(() => {
    const s = Number(searchParams.get('surah'));
    const a = Number(searchParams.get('ayah'));
    if (s && s >= 1 && s <= 114) {
      setSurahNumber(s);
      if (a && a >= 1) {
        setExpandedAyahNumber(a);
      }
    }
  }, [searchParams]);

  // Load the WHOLE Surah when surahNumber changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getSurahAyahs(surahNumber)
      .then((data) => {
        if (!isMounted) return;
        setAyahs(data);
        setIsLoading(false);

        // Update bookmarks map for this Surah
        const bMap: Record<number, boolean> = {};
        data.forEach((ayah) => {
          bMap[ayah.ayah_number] = isAyahBookmarked(surahNumber, ayah.ayah_number);
        });
        setBookmarkedMap(bMap);
      })
      .catch((err) => {
        console.warn('Failed to load surah ayahs:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [surahNumber]);

  // When an Ayah is expanded, load its Tafsir and Related Ayahs
  useEffect(() => {
    if (expandedAyahNumber && expandedAyahNumber > 0) {
      const tafsirs = getTafsirForAyah(surahNumber, expandedAyahNumber);
      setActiveTafsirList(tafsirs);

      const related = getRelatedAyahs(surahNumber, expandedAyahNumber);
      setActiveRelatedAyahs(related);

      // Check existing note
      const allNotes = getStoredNotes();
      const existing = allNotes.find((n) => n.surah_number === surahNumber && n.ayah_number === expandedAyahNumber);
      if (existing) {
        setNoteTitle(existing.title);
        setNoteContent(existing.content);
      } else {
        setNoteTitle(`Study Note on ${surahNumber}:${expandedAyahNumber}`);
        setNoteContent('');
      }
      setIsAddingNote(false);
    } else {
      setActiveTafsirList([]);
      setActiveRelatedAyahs([]);
    }
  }, [surahNumber, expandedAyahNumber]);

  // Toggle or select an Ayah to show its Tafsir (only one at a time)
  const handleAyahClick = (ayahNum: number) => {
    if (expandedAyahNumber === ayahNum) {
      // If clicking the same ayah, toggle it closed
      setExpandedAyahNumber(null);
    } else {
      // Open this Ayah's Tafsir (and automatically closes any other Ayah's Tafsir)
      setExpandedAyahNumber(ayahNum);
      
      // Update URL query parameter without full reload
      router.replace(`/tafsir?surah=${surahNumber}&ayah=${ayahNum}`, { scroll: false });

      // Smooth scroll into comfortable view after expansion
      setTimeout(() => {
        const el = ayahRefs.current[ayahNum];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  };

  const handleSelectSurah = (newSurahNum: number) => {
    setSurahNumber(newSurahNum);
    setExpandedAyahNumber(null); // Reset expanded ayah when changing surah
    router.push(`/tafsir?surah=${newSurahNum}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAudioToggle = (ayahNum: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const isThisPlaying = isPlaying && currentSurah === surahNumber && playingAyahNum === ayahNum;
    if (isThisPlaying) {
      pause();
    } else {
      playAyah(surahNumber, ayahNum);
    }
  };

  const handleBookmarkToggle = (ayahNum: number, e: React.MouseEvent) => {
    e.stopPropagation();
    saveBookmark({
      surah_number: surahNumber,
      ayah_number: ayahNum,
      note: `Ayah ${surahNumber}:${ayahNum}`
    });
    setBookmarkedMap((prev) => ({
      ...prev,
      [ayahNum]: !prev[ayahNum]
    }));
  };

  const handleCopyAyah = (ayah: Ayah, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${ayah.text_ar}\n\nEnglish: "${ayah.translation_en}"\n\nবাংলা: "${ayah.translation_bn}"\n\n- Quran [${surahNumber}:${ayah.ayah_number}]`;
    navigator.clipboard.writeText(text);
    setCopiedAyahNumber(ayah.ayah_number);
    setTimeout(() => setCopiedAyahNumber(null), 2000);
  };

  const handleSaveNote = () => {
    if (!expandedAyahNumber || !noteContent.trim()) return;
    saveNote({
      surah_number: surahNumber,
      ayah_number: expandedAyahNumber,
      title: noteTitle || `Reflection on ${surahNumber}:${expandedAyahNumber}`,
      content: noteContent
    });
    setNoteSaved(true);
    setTimeout(() => {
      setNoteSaved(false);
      setIsAddingNote(false);
    }, 1500);
  };

  const activeTafsir = activeTafsirList.find((t) => t.source_id === selectedSourceId) || activeTafsirList[0];

  const filteredRelated = selectedRelationFilter === 'all'
    ? activeRelatedAyahs
    : activeRelatedAyahs.filter((r) => r.relation_type === selectedRelationFilter);

  const getRelationBadge = (type: RelatedAyah['relation_type']) => {
    switch (type) {
      case 'same_word':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">Same Arabic Word (একই শব্দ)</span>;
      case 'same_root':
        return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">Same Root (একই মূলধাতু)</span>;
      case 'shared_concept':
        return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">Shared Concept (অভিন্ন বিষয়)</span>;
      case 'tafsir_cross_reference':
        return <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-bold">Cross-Reference (তাফসীরীয় সংযোগ)</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[10px] font-bold">Thematic Link (ভাবগত মিল)</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white shadow-lg space-y-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-[var(--gold-light)] mb-1">
            <BookOpen className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>তাফসীর ও সংশ্লিষ্ট আয়াত • Tafsir & Related Ayahs</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
            সূরাভিত্তিক তাফসীর ও গবেষণা (Tafsir by Surah)
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            এখানে সম্পূর্ণ সূরার প্রতিটি আয়াত একসাথে বাংলা ও ইংরেজি অনুবাদসহ প্রদর্শিত হয়েছে। যেকোনো আয়াতে ক্লিক বা ট্যাপ করলে সেই নির্দিষ্ট আয়াতের তাফসীর ও সংশ্লিষ্ট আয়াতসমূহ দৃশ্যমান হবে।
          </p>
        </div>
      </div>

      {/* Surah Selector & Information Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Dropdown Selector */}
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider block">
              সূরা নির্বাচন করুন (Select Surah)
            </span>
            <select
              value={surahNumber}
              onChange={(e) => handleSelectSurah(Number(e.target.value))}
              className="text-xs sm:text-sm font-semibold p-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-hidden focus:border-[var(--primary)] min-w-[240px]"
            >
              {SURAHS_DATA.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.name_bn} ({s.name_en}) - {s.verses_count} আয়াত
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSelectSurah(surahNumber - 1)}
            disabled={surahNumber <= 1}
            className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] disabled:opacity-40 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">পূর্ববর্তী সূরা (Prev)</span>
          </button>

          <span className="px-3 py-1.5 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] font-bold text-xs">
            সূরা {surahNumber} / 114
          </span>

          <button
            onClick={() => handleSelectSurah(surahNumber + 1)}
            disabled={surahNumber >= 114}
            className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] disabled:opacity-40 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <span className="hidden sm:inline">পরবর্তী সূরা (Next)</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <Link
            href={`/read/${surahNumber}`}
            className="px-3 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] text-xs font-semibold flex items-center gap-1 transition-colors ml-1"
            title="Read in Quran Reader mode"
          >
            <span>Reader Mode</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Surah Intro & Title Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] text-center shadow-xs space-y-3 relative overflow-hidden">
        <div className="space-y-1">
          <span className="text-xs px-3 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary)] font-bold inline-block">
            {surahMeta.revelation_place === 'Meccan' ? 'মাক্কী সূরা (Meccan)' : 'মাদানী সূরা (Medinan)'} • {surahMeta.verses_count} আয়াত
          </span>
          <h2 className="font-arabic text-3xl sm:text-5xl text-[var(--foreground)] pt-2 font-bold">
            سُورَةُ {surahMeta.name_ar}
          </h2>
          <div className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
            {surahMeta.name_bn} • <span className="font-normal text-[var(--muted-foreground)]">{surahMeta.name_en} ({surahMeta.translation_en})</span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-xl mx-auto font-bangla">
            {surahMeta.description_bn || surahMeta.description_en}
          </p>
        </div>

        {/* Bismillah Header (Except Surah 9 At-Tawbah) */}
        {surahMeta.bismillah_pre && (
          <div className="pt-4 pb-2 border-t border-[var(--border)]/60 text-center select-none">
            <span className="font-arabic text-2xl sm:text-3xl text-[var(--foreground)] tracking-wide">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </span>
            <p className="text-xs text-[var(--muted-foreground)] font-bangla mt-1">
              পরম করুণাময়, অসীম দয়ালু আল্লাহর নামে
            </p>
          </div>
        )}

        <div className="pt-2 text-xs text-[var(--primary)] font-medium">
          💡 নির্দেশিকা: তাফসীর দেখতে নিচের যেকোনো আয়াতের ওপর ক্লিক বা ট্যাপ করুন (একবারে একটি আয়াতের তাফসীর দৃশ্যমান থাকবে)।
        </div>
      </div>

      {/* WHOLE SURAH STREAM */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[var(--muted-foreground)] font-bangla">
            সম্পূর্ণ সূরার সকল আয়াত ও তাফসীর ডাটা লোড হচ্ছে...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {ayahs.map((ayah) => {
            const isExpanded = expandedAyahNumber === ayah.ayah_number;
            const isThisPlaying = isPlaying && currentSurah === surahNumber && playingAyahNum === ayah.ayah_number;
            const isBookmarked = !!bookmarkedMap[ayah.ayah_number];
            const isCopied = copiedAyahNumber === ayah.ayah_number;

            return (
              <div
                key={ayah.ayah_number}
                ref={(el) => {
                  ayahRefs.current[ayah.ayah_number] = el;
                }}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'border-[var(--primary)] bg-[var(--card)] shadow-lg ring-1 ring-[var(--primary)]'
                    : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/60 hover:shadow-md'
                }`}
              >
                {/* Ayah Row Header (Clickable to Toggle Tafsir) */}
                <div
                  onClick={() => handleAyahClick(ayah.ayah_number)}
                  className="p-5 sm:p-6 cursor-pointer space-y-4"
                  title="Click to view or toggle Tafsir for this Ayah"
                >
                  {/* Top Reference & Actions */}
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]/60 text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs ${
                        isExpanded
                          ? 'bg-[var(--primary)] text-white shadow-xs'
                          : 'bg-[var(--primary-light)] text-[var(--primary)]'
                      }`}>
                        {ayah.ayah_number}
                      </div>
                      <span className="font-bold text-[var(--foreground)]">
                        {surahMeta.name_bn} [{surahNumber}:{ayah.ayah_number}]
                      </span>
                      {ayah.sajdah && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          সিজদাহ্
                        </span>
                      )}
                    </div>

                    {/* Action Tools */}
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleAudioToggle(ayah.ayah_number, e)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isThisPlaying
                            ? 'bg-[var(--primary)] text-white'
                            : 'text-[var(--foreground)] hover:bg-[var(--muted)]'
                        }`}
                        title={isThisPlaying ? 'Pause Audio' : 'Play Recitation'}
                      >
                        {isThisPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={(e) => handleBookmarkToggle(ayah.ayah_number, e)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isBookmarked ? 'text-[var(--gold)]' : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
                        }`}
                        title={isBookmarked ? 'বুকমার্ক করা হয়েছে' : 'বুকমার্ক করুন'}
                      >
                        <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                      </button>

                      <button
                        onClick={(e) => handleCopyAyah(ayah, e)}
                        className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
                        title="Copy Ayah text"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <div className="ml-2 pl-2 border-l border-[var(--border)] flex items-center gap-1 text-[11px] font-semibold text-[var(--primary)]">
                        <span>{isExpanded ? 'তাফসীর বন্ধ করুন' : 'তাফসীর দেখুন'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Arabic Ayah Text */}
                  <div className="py-2 text-right" dir="rtl">
                    <p className="font-arabic text-2xl sm:text-3xl text-[var(--foreground)] leading-loose select-text">
                      {ayah.text_ar} <span className="text-[var(--primary)] text-xl select-none mr-2">۝{ayah.ayah_number}</span>
                    </p>
                  </div>

                  {/* BOTH Bangla and English Translations Displayed Side by Side / Stacked */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-[var(--border)]/40 text-left">
                    {/* Bangla Translation */}
                    <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]/60 space-y-1">
                      <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider block">
                        বাংলা অনুবাদ (Taisirul Quran)
                      </span>
                      <p className="text-sm text-[var(--foreground)] leading-relaxed font-bangla">
                        {ayah.translation_bn}
                      </p>
                    </div>

                    {/* English Translation */}
                    <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]/60 space-y-1">
                      <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider block">
                        English Translation (Saheeh International)
                      </span>
                      <p className="text-sm text-[var(--foreground)]/90 leading-relaxed font-sans">
                        {ayah.translation_en}
                      </p>
                    </div>
                  </div>

                  {/* Tap prompt badge */}
                  <div className="flex items-center justify-between text-xs pt-1 text-[var(--muted-foreground)]">
                    <span className="inline-flex items-center gap-1 text-[var(--primary)] font-semibold text-[11px]">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'এই আয়াতের তাফসীর সক্রিয় রয়েছে' : 'তাফসীর ও প্রাসঙ্গিক আয়াত দেখতে ট্যাপ করুন'}</span>
                    </span>
                    <span className="text-[10px] hidden sm:inline">
                      {isExpanded ? 'আয়াত নম্বর ' + ayah.ayah_number + ' এর বিশ্লেষণ নিচে প্রদর্শিত হচ্ছে' : 'এক ক্লিকে তাফসীর ও মূলধাতুভিত্তিক আয়াত জানুন'}
                    </span>
                  </div>
                </div>

                {/* INLINE TAFSIR SECTION (Appears only when this Ayah is the one clicked) */}
                {isExpanded && (
                  <div className="border-t-2 border-[var(--primary)]/60 bg-[var(--card)] p-5 sm:p-7 space-y-6 animate-in slide-in-from-top-2 duration-200">
                    
                    {/* Section Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)]">
                            আয়াত {ayah.ayah_number} এর তাফসীর ও ব্যাখ্যা (Tafsir & Exegesis)
                          </h3>
                          <span className="text-xs text-[var(--muted-foreground)]">
                            সূরা {surahMeta.name_bn} ({surahNumber}:{ayah.ayah_number})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsAddingNote(!isAddingNote)}
                          className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-[var(--gold)]" />
                          <span>{isAddingNote ? 'নোট বন্ধ করুন' : 'ব্যক্তিগত নোট'}</span>
                        </button>
                        
                        <button
                          onClick={() => setExpandedAyahNumber(null)}
                          className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                          title="Close Tafsir"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Note Editor (When Active) */}
                    {isAddingNote && (
                      <div className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-3 animate-in slide-in-from-top duration-150">
                        <input
                          type="text"
                          value={noteTitle}
                          onChange={(e) => setNoteTitle(e.target.value)}
                          placeholder="নোটের শিরোনাম (Note title)..."
                          className="w-full text-xs font-semibold p-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-hidden"
                        />
                        <textarea
                          rows={3}
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          placeholder="এই আয়াতের ওপর আপনার ব্যক্তিগত চিন্তা, নোট বা উপলব্ধি লিখে রাখুন..."
                          className="w-full text-xs p-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-hidden"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={handleSaveNote}
                            className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold hover:bg-[var(--primary-hover)] flex items-center gap-1.5 shadow-xs transition-colors"
                          >
                            {noteSaved ? <Check className="w-3.5 h-3.5" /> : null}
                            <span>{noteSaved ? 'সংরক্ষিত হয়েছে!' : 'নোট সংরক্ষণ করুন'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Tafsir Source Tabs */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider block">
                        তাফসীর গ্রন্থ নির্বাচন করুন (Choose Tafsir Source)
                      </span>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {TAFSIR_SOURCES.map((source) => (
                          <button
                            key={source.id}
                            onClick={() => setSelectedSourceId(source.id)}
                            className={`px-3.5 py-2 rounded-xl font-semibold transition-all ${
                              selectedSourceId === source.id
                                ? 'bg-[var(--primary)] text-white shadow-xs'
                                : 'bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                            }`}
                          >
                            {source.id === 'ahsanul-bayaan' ? 'তাফসীর আহসানুল বায়ান (বাংলা)' : source.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tafsir Commentary Card */}
                    {activeTafsir ? (
                      <div className="space-y-4">
                        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-3">
                          <div className="flex items-center justify-between text-xs pb-2 border-b border-[var(--border)]/60">
                            <span className="font-bold text-[var(--foreground)] text-sm">
                              {activeTafsir.source_name}
                            </span>
                            <span className="text-[var(--muted-foreground)]">{activeTafsir.author}</span>
                          </div>

                          <div className="text-sm sm:text-base leading-relaxed text-[var(--foreground)] whitespace-pre-line font-bangla">
                            {activeTafsir.text}
                          </div>
                        </div>

                        {/* Asbab al-Nuzul (Occasion of Revelation) */}
                        {activeTafsir.asbab_al_nuzul && (
                          <div className="p-4 rounded-2xl bg-[var(--gold-light)]/40 border border-[var(--gold)]/30 space-y-1.5">
                            <div className="text-xs font-bold text-[var(--gold-foreground)] flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                              <span>শানে নুযূল বা নাযিলের প্রেক্ষাপট (Asbab al-Nuzul)</span>
                            </div>
                            <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed font-bangla">
                              {activeTafsir.asbab_al_nuzul}
                            </p>
                          </div>
                        )}

                        {/* Linguistic Notes */}
                        {activeTafsir.linguistic_notes && (
                          <div className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-1.5">
                            <div className="text-xs font-bold text-[var(--primary)] flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>ভাষাগত ও ব্যাকরণিক বিশ্লেষণ (Linguistic & Grammar Notes)</span>
                            </div>
                            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed font-bangla">
                              {activeTafsir.linguistic_notes}
                            </p>
                          </div>
                        )}

                        {/* Authentic Hadith References */}
                        {activeTafsir.authentic_hadith_refs && activeTafsir.authentic_hadith_refs.length > 0 && (
                          <div className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-2">
                            <span className="text-xs font-bold text-[var(--foreground)] block">
                              বিশুদ্ধ হাদিসের উদ্ধৃতি (Authentic Hadith References)
                            </span>
                            <ul className="space-y-1.5">
                              {activeTafsir.authentic_hadith_refs.map((ref, idx) => (
                                <li key={idx} className="text-xs sm:text-sm text-[var(--muted-foreground)] flex items-start gap-2">
                                  <span className="text-[var(--primary)] font-bold">•</span>
                                  <span>{ref}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-sm text-[var(--muted-foreground)]">
                        এই নির্বাচিত তাফসীর গ্রন্থের মন্তব্য প্রস্তুত হচ্ছে।
                      </div>
                    )}

                    {/* RELATED AYAHS SECTION FOR THIS SPECIFIC AYAH */}
                    <div className="pt-4 border-t border-[var(--border)] space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Link2 className="w-5 h-5 text-[var(--gold)]" />
                          <h4 className="text-sm sm:text-base font-bold text-[var(--foreground)]">
                            আয়াত {ayah.ayah_number} এর সাথে সংশ্লিষ্ট কুরআনীয় আয়াতসমূহ ({activeRelatedAyahs.length} Related Ayahs)
                          </h4>
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex flex-wrap gap-1.5 text-xs">
                          <button
                            onClick={() => setSelectedRelationFilter('all')}
                            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                              selectedRelationFilter === 'all'
                                ? 'bg-[var(--primary)] text-white'
                                : 'bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)]'
                            }`}
                          >
                            সকল সংযোগ ({activeRelatedAyahs.length})
                          </button>
                          <button
                            onClick={() => setSelectedRelationFilter('same_word')}
                            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                              selectedRelationFilter === 'same_word'
                                ? 'bg-[var(--primary)] text-white'
                                : 'bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)]'
                            }`}
                          >
                            একই শব্দ
                          </button>
                          <button
                            onClick={() => setSelectedRelationFilter('shared_concept')}
                            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                              selectedRelationFilter === 'shared_concept'
                                ? 'bg-[var(--primary)] text-white'
                                : 'bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)]'
                            }`}
                          >
                            অভিন্ন ভাবার্থ
                          </button>
                        </div>
                      </div>

                      {filteredRelated.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredRelated.map((rel, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]/60 space-y-3 transition-all shadow-2xs"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-[var(--foreground)]">
                                  সূরা {rel.surah_number}:{rel.ayah_number}
                                </span>
                                {getRelationBadge(rel.relation_type)}
                              </div>

                              {/* Arabic text */}
                              <p className="font-arabic text-lg text-[var(--foreground)] text-right leading-relaxed" dir="rtl">
                                {rel.text_ar} <span className="text-[var(--primary)] text-sm mr-1">۝{rel.ayah_number}</span>
                              </p>

                              {/* BOTH Bangla and English for each Related Ayah */}
                              <div className="space-y-1.5 text-xs">
                                <div className="p-2 rounded-lg bg-[var(--card)] border border-[var(--border)]/50">
                                  <span className="text-[10px] font-bold text-[var(--primary)] block mb-0.5">বাংলা:</span>
                                  <p className="text-[var(--foreground)] leading-relaxed font-bangla">
                                    {rel.translation_bn}
                                  </p>
                                </div>
                                <div className="p-2 rounded-lg bg-[var(--card)] border border-[var(--border)]/50">
                                  <span className="text-[10px] font-bold text-[var(--muted-foreground)] block mb-0.5">English:</span>
                                  <p className="text-[var(--foreground)]/80 leading-relaxed font-sans">
                                    {rel.translation_en}
                                  </p>
                                </div>
                              </div>

                              {/* Connection Explanation */}
                              <div className="p-2 rounded-lg bg-[var(--card)] border border-[var(--border)]/70 text-[11px] text-[var(--muted-foreground)] font-bangla">
                                <span className="font-semibold text-[var(--foreground)]">সম্পর্কের কারণ: </span>
                                {rel.explanation}
                              </div>

                              {/* Action: Open in reader or switch to that surah */}
                              <div className="pt-1 flex items-center justify-between text-xs">
                                {rel.surah_number === surahNumber ? (
                                  <button
                                    onClick={() => handleAyahClick(rel.ayah_number)}
                                    className="px-2.5 py-1 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white font-semibold transition-colors flex items-center gap-1"
                                  >
                                    <span>এই সূরার আয়াতে যান</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setSurahNumber(rel.surah_number);
                                      setExpandedAyahNumber(rel.ayah_number);
                                      router.push(`/tafsir?surah=${rel.surah_number}&ayah=${rel.ayah_number}`);
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white font-semibold transition-colors flex items-center gap-1"
                                  >
                                    <span>সূরা {rel.surah_number} এর তাফসীর খুলুন</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                )}

                                <Link
                                  href={`/read/${rel.surah_number}#ayah-${rel.surah_number}-${rel.ayah_number}`}
                                  className="text-[11px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1"
                                  title="View in full Quran Reader"
                                >
                                  <span>Reader</span>
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-6 text-center text-xs text-[var(--muted-foreground)]">
                          এই ফিল্টারের সাথে কোনো প্রাসঙ্গিক আয়াত পাওয়া যায়নি।
                        </div>
                      )}
                    </div>

                    {/* Bottom Close Button */}
                    <div className="pt-3 border-t border-[var(--border)] flex justify-end">
                      <button
                        onClick={() => setExpandedAyahNumber(null)}
                        className="px-4 py-2 rounded-xl bg-[var(--muted)] hover:bg-[var(--border)] text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5 transition-colors"
                      >
                        <ChevronUp className="w-4 h-4" />
                        <span>তাফসীর সংকুচিত করুন (Close Tafsir)</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function TafsirPage() {
  return (
    <Suspense fallback={
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[var(--muted-foreground)] font-bangla">তাফসীর সেকশন প্রস্তুত হচ্ছে...</p>
      </div>
    }>
      <TafsirContent />
    </Suspense>
  );
}
