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

  // Initial scroll to expanded ayah after data finishes loading
  useEffect(() => {
    if (!isLoading && expandedAyahNumber && expandedAyahNumber > 0) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`ayah-card-${expandedAyahNumber}`) || ayahRefs.current[expandedAyahNumber];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, expandedAyahNumber]);

  // Toggle or select an Ayah to show its Tafsir (only one at a time)
  const handleAyahClick = (ayahNum: number) => {
    if (expandedAyahNumber === ayahNum) {
      // Toggle closed if clicking same ayah
      setExpandedAyahNumber(null);
    } else {
      // Open this Ayah's Tafsir (closes any previously open one)
      setExpandedAyahNumber(ayahNum);
      
      // Update URL query parameter without full reload
      router.replace(`/tafsir?surah=${surahNumber}&ayah=${ayahNum}`, { scroll: false });

      // Smooth scroll directly to the Ayah card / Tafsir section with offset for sticky header
      setTimeout(() => {
        const tafsirEl = document.getElementById(`tafsir-section-${ayahNum}`);
        if (tafsirEl) {
          tafsirEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          const cardEl = ayahRefs.current[ayahNum] || document.getElementById(`ayah-card-${ayahNum}`);
          if (cardEl) {
            cardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 150);
    }
  };

  const handleSelectSurah = (newSurahNum: number) => {
    setSurahNumber(newSurahNum);
    setExpandedAyahNumber(null);
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
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300/60">Same Word (একই শব্দ)</span>;
      case 'same_root':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold border border-blue-300/60">Same Root (একই মূলধাতু)</span>;
      case 'shared_concept':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold border border-amber-300/60">Shared Concept (অভিন্ন বিষয়)</span>;
      case 'tafsir_cross_reference':
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-bold border border-purple-300/60">Cross-Reference (তাফসীরীয় সংযোগ)</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200 text-[10px] font-bold border border-stone-300/60">Thematic Link (ভাবগত মিল)</span>;
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
            <span>তাফসীর ও প্রাসঙ্গিক আয়াত • Tafsir & Cross-Quranic Connections</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
            সূরাভিত্তিক তাফসীর ও গবেষণা (Tafsir by Surah)
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            এখানে সম্পূর্ণ সূরার প্রতিটি আয়াত একসাথে বাংলা ও ইংরেজি অনুবাদসহ সাজানো রয়েছে। যেকোনো আয়াতে ক্লিক বা ট্যাপ করলে সেই নির্দিষ্ট আয়াতের তাফসীর ও সংশ্লিষ্ট আয়াতসমূহ আকর্ষণীয় রঙে বিন্যস্ত হয়ে খুলবে।
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

        <div className="pt-2 text-xs text-[var(--primary)] font-medium flex items-center justify-center gap-2">
          <span>💡 <strong>সহজ ব্যবহার নির্দেশিকা:</strong> তাফসীর দেখতে যেকোনো আয়াতের বাক্সে ক্লিক করুন (একবারে একটি আয়াতের তাফসীর দৃশ্যমান থাকবে)।</span>
        </div>
      </div>

      {/* WHOLE SURAH STREAM */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[var(--muted-foreground)] font-bangla">
            সম্পূর্ণ সূরার সকল আয়াত ও তাফসীর ডাটা প্রস্তুত হচ্ছে...
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {ayahs.map((ayah) => {
            const isExpanded = expandedAyahNumber === ayah.ayah_number;
            const isThisPlaying = isPlaying && currentSurah === surahNumber && playingAyahNum === ayah.ayah_number;
            const isBookmarked = !!bookmarkedMap[ayah.ayah_number];
            const isCopied = copiedAyahNumber === ayah.ayah_number;

            return (
              <div
                key={ayah.ayah_number}
                id={`ayah-card-${ayah.ayah_number}`}
                ref={(el) => {
                  ayahRefs.current[ayah.ayah_number] = el;
                }}
                className={`rounded-3xl border transition-all duration-200 overflow-hidden scroll-mt-24 ${
                  isExpanded
                    ? 'border-emerald-500 bg-[var(--card)] shadow-xl ring-2 ring-emerald-500/30'
                    : 'border-[var(--border)] bg-[var(--card)] hover:border-emerald-400/80 hover:shadow-md'
                }`}
              >
                {/* Ayah Row Header (Clickable to Toggle Tafsir) */}
                <div
                  onClick={() => handleAyahClick(ayah.ayah_number)}
                  className="p-5 sm:p-7 cursor-pointer space-y-5"
                  title="Click to view or toggle Tafsir for this Ayah"
                >
                  {/* Top Reference & Actions */}
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]/60 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-xl font-bold text-xs transition-colors ${
                        isExpanded
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {ayah.ayah_number}
                      </div>
                      <span className="font-bold text-sm text-[var(--foreground)]">
                        {surahMeta.name_bn} [{surahNumber}:{ayah.ayah_number}]
                      </span>
                      {ayah.sajdah && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300">
                          সিজদাহ্
                        </span>
                      )}
                    </div>

                    {/* Action Tools */}
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleAudioToggle(ayah.ayah_number, e)}
                        className={`p-2 rounded-xl transition-colors ${
                          isThisPlaying
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-[var(--foreground)] hover:bg-[var(--muted)]'
                        }`}
                        title={isThisPlaying ? 'Pause Audio' : 'Play Recitation'}
                      >
                        {isThisPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={(e) => handleBookmarkToggle(ayah.ayah_number, e)}
                        className={`p-2 rounded-xl transition-colors ${
                          isBookmarked ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
                        }`}
                        title={isBookmarked ? 'বুকমার্ক করা হয়েছে' : 'বুকমার্ক করুন'}
                      >
                        <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                      </button>

                      <button
                        onClick={(e) => handleCopyAyah(ayah, e)}
                        className="p-2 rounded-xl text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
                        title="Copy Ayah and translations"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <div className="ml-2 pl-2 border-l border-[var(--border)] flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        <span>{isExpanded ? 'তাফসীর বন্ধ করুন' : 'তাফসীর দেখুন'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* 1. ARABIC SCRIPTURE BOX (Ivory & Gold accent) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50/30 via-stone-50/20 to-amber-50/20 dark:from-stone-900/60 dark:via-stone-900/30 dark:to-stone-900/60 border border-amber-200/50 dark:border-amber-900/40 text-right" dir="rtl">
                    <p className="font-arabic text-2xl sm:text-4xl text-[var(--foreground)] leading-loose select-text">
                      {ayah.text_ar} <span className="text-amber-600 dark:text-amber-400 text-xl select-none mr-2">۝{ayah.ayah_number}</span>
                    </p>
                  </div>

                  {/* 2. COLOR-CODED BILINGUAL TRANSLATION BOXES */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-left">
                    
                    {/* BANGLA TRANSLATION BOX (Aesthetic Soft Emerald / Green Box) */}
                    <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/25 border border-emerald-200/90 dark:border-emerald-800/50 space-y-2 shadow-2xs">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100/90 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 w-fit">
                        <span className="text-xs">🇧🇩</span>
                        <span className="text-[11px] font-bold tracking-wide">বাংলা অনুবাদ (Taisirul Quran)</span>
                      </div>
                      <p className="text-sm sm:text-base text-emerald-950 dark:text-emerald-100 leading-relaxed font-bangla font-normal">
                        {ayah.translation_bn}
                      </p>
                    </div>

                    {/* ENGLISH TRANSLATION BOX (Aesthetic Soft Sky-Blue / Blue Box) */}
                    <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-950/25 border border-sky-200/90 dark:border-sky-800/50 space-y-2 shadow-2xs">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-100/90 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200 w-fit">
                        <span className="text-xs">🇬🇧</span>
                        <span className="text-[11px] font-bold tracking-wide">English Translation (Saheeh International)</span>
                      </div>
                      <p className="text-sm sm:text-base text-sky-950 dark:text-sky-100 leading-relaxed font-sans font-normal">
                        {ayah.translation_en}
                      </p>
                    </div>

                  </div>

                  {/* Interactive Prompt Footer */}
                  <div className="flex items-center justify-between text-xs pt-1 text-[var(--muted-foreground)]">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'আয়াত ' + ayah.ayah_number + ' এর তাফসীর নিচে উন্মুক্ত রয়েছে' : 'তাফসীর ও প্রাসঙ্গিক আয়াত দেখতে এখানে ট্যাপ করুন'}</span>
                    </span>
                    <span className="text-[11px] text-[var(--muted-foreground)] hidden sm:inline">
                      {isExpanded ? '▲ বন্ধ করতে ক্লিক করুন' : '▼ বিস্তারিত তাফসীর, শানে নুযূল ও সংশ্লিষ্ট আয়াত'}
                    </span>
                  </div>
                </div>

                {/* INLINE EXPANDED TAFSIR SECTION (Exclusive to the clicked Ayah) */}
                {isExpanded && (
                  <div 
                    id={`tafsir-section-${ayah.ayah_number}`}
                    className="border-t-2 border-emerald-500/70 bg-gradient-to-b from-stone-50/50 to-[var(--card)] dark:from-stone-900/40 dark:to-[var(--card)] p-5 sm:p-7 space-y-6 animate-in slide-in-from-top-2 duration-200 scroll-mt-24"
                  >
                    
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                          {ayah.ayah_number}
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)]">
                            আয়াত {ayah.ayah_number} এর তাফসীর ও প্রামাণ্য বিশ্লেষণ (Tafsir & Exegesis)
                          </h3>
                          <span className="text-xs text-[var(--muted-foreground)]">
                            সূরা {surahMeta.name_bn} ({surahNumber}:{ayah.ayah_number})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsAddingNote(!isAddingNote)}
                          className="px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                          <span>{isAddingNote ? 'নোট বন্ধ করুন' : 'ব্যক্তিগত নোট'}</span>
                        </button>
                        
                        <button
                          onClick={() => setExpandedAyahNumber(null)}
                          className="p-1.5 rounded-xl bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--border)] transition-colors"
                          title="Close Tafsir"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* 3. PERSONAL NOTE EDITOR BOX (Aesthetic Soft Rose Box) */}
                    {isAddingNote && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 space-y-3 animate-in slide-in-from-top duration-150 shadow-2xs">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200 font-bold text-xs w-fit">
                          <FileText className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                          <span>ব্যক্তিগত তাফাক্কুর ও অধ্যয়ন নোট (Personal Study Note)</span>
                        </div>
                        <input
                          type="text"
                          value={noteTitle}
                          onChange={(e) => setNoteTitle(e.target.value)}
                          placeholder="নোটের শিরোনাম লিখুন..."
                          className="w-full text-xs font-semibold p-2.5 rounded-xl border border-rose-200 dark:border-rose-800 bg-[var(--card)] text-[var(--foreground)] focus:outline-hidden"
                        />
                        <textarea
                          rows={3}
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          placeholder="এই আয়াতের ওপর আপনার ব্যক্তিগত চিন্তা, নোট বা উপলব্ধি লিখে রাখুন..."
                          className="w-full text-xs p-2.5 rounded-xl border border-rose-200 dark:border-rose-800 bg-[var(--card)] text-[var(--foreground)] focus:outline-hidden leading-relaxed font-bangla"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={handleSaveNote}
                            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                          >
                            {noteSaved ? <Check className="w-3.5 h-3.5" /> : null}
                            <span>{noteSaved ? 'সংরক্ষিত হয়েছে!' : 'নোট সংরক্ষণ করুন'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 4. TAFSIR COMMENTARY BOX (Aesthetic Warm Amber / Golden Scholar Box) */}
                    <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200/90 dark:border-amber-800/60 shadow-xs space-y-4">
                      
                      {/* Box Title & Source Selector */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-200/80 dark:border-amber-800/40">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold text-xs sm:text-sm">
                          <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span>তাফসীর ও প্রামাণ্য ব্যাখ্যা • Classical Tafsir Commentary</span>
                        </div>

                        {/* Source Selection Buttons */}
                        <div className="flex flex-wrap gap-1.5 text-xs">
                          {TAFSIR_SOURCES.map((source) => (
                            <button
                              key={source.id}
                              onClick={() => setSelectedSourceId(source.id)}
                              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                                selectedSourceId === source.id
                                  ? source.id === 'ahsanul-bayaan'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-amber-600 text-white shadow-xs'
                                  : 'bg-[var(--card)] border border-amber-200 dark:border-amber-800 text-[var(--foreground)] hover:bg-amber-100/60'
                              }`}
                            >
                              {source.id === 'ahsanul-bayaan' ? 'তাফসীর আহসানুল বায়ান (বাংলা)' : source.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Tafsir Body */}
                      {activeTafsir ? (
                        <div className="space-y-4 pt-1">
                          <div className="flex items-center justify-between text-xs text-amber-900 dark:text-amber-300">
                            <span className="font-bold text-sm">{activeTafsir.source_name}</span>
                            <span className="opacity-80">{activeTafsir.author}</span>
                          </div>

                          <div className="p-5 rounded-2xl bg-[var(--card)] border border-amber-200/70 dark:border-amber-800/50 text-sm sm:text-base leading-relaxed text-[var(--foreground)] whitespace-pre-line font-bangla font-normal max-h-[550px] overflow-y-auto overscroll-contain pr-3 scrollbar-thin">
                            {activeTafsir.text}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {/* 5. CONTEXT OF REVELATION BOX (Aesthetic Warm Orange / Sunset Box) */}
                    {activeTafsir?.asbab_al_nuzul && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-orange-50/80 dark:bg-orange-950/25 border border-orange-200/90 dark:border-orange-800/50 space-y-2 shadow-2xs">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-100 dark:bg-orange-900/60 text-orange-900 dark:text-orange-200 font-bold text-xs w-fit">
                          <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                          <span>শানে নুযূল বা নাযিলের প্রেক্ষাপট • Context of Revelation</span>
                        </div>
                        <p className="text-sm sm:text-base text-orange-950 dark:text-orange-100 leading-relaxed font-bangla">
                          {activeTafsir.asbab_al_nuzul}
                        </p>
                      </div>
                    )}

                    {/* 6. LINGUISTIC & GRAMMAR ANALYSIS BOX (Aesthetic Royal Indigo Box) */}
                    {activeTafsir?.linguistic_notes && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/25 border border-indigo-200/90 dark:border-indigo-800/50 space-y-2 shadow-2xs">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 font-bold text-xs w-fit">
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">🔤</span>
                          <span>ভাষাগত ও ব্যাকরণিক বিশ্লেষণ • Linguistic & Grammar Analysis</span>
                        </div>
                        <p className="text-sm sm:text-base text-indigo-950 dark:text-indigo-100 leading-relaxed font-bangla">
                          {activeTafsir.linguistic_notes}
                        </p>
                      </div>
                    )}

                    {/* 7. AUTHENTIC HADITH CITATIONS BOX (Aesthetic Refined Teal Box) */}
                    {activeTafsir?.authentic_hadith_refs && activeTafsir.authentic_hadith_refs.length > 0 && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/25 border border-teal-200/90 dark:border-teal-800/50 space-y-2.5 shadow-2xs">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-900 dark:text-teal-200 font-bold text-xs w-fit">
                          <span className="text-xs">📜</span>
                          <span>বিশুদ্ধ হাদিসের উদ্ধৃতি ও সনদ • Authentic Hadith Citations</span>
                        </div>
                        <ul className="space-y-2 pt-1">
                          {activeTafsir.authentic_hadith_refs.map((ref, idx) => (
                            <li key={idx} className="text-sm text-teal-950 dark:text-teal-100 flex items-start gap-2 leading-relaxed">
                              <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                              <span>{ref}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 8. RELATED AYAHS DISCOVERY BOX (Aesthetic Amethyst / Violet Box) */}
                    <div className="p-5 sm:p-6 rounded-3xl bg-purple-50/80 dark:bg-purple-950/25 border border-purple-200/90 dark:border-purple-800/50 space-y-5 shadow-xs">
                      
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-purple-200/80 dark:border-purple-800/40">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 font-bold text-xs sm:text-sm">
                          <Link2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span>কুরআনের অন্যান্য আয়াতের সাথে সংযোগ • Related Quranic Ayahs ({activeRelatedAyahs.length})</span>
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex flex-wrap gap-1.5 text-xs">
                          <button
                            onClick={() => setSelectedRelationFilter('all')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                              selectedRelationFilter === 'all'
                                ? 'bg-purple-700 text-white shadow-2xs'
                                : 'bg-[var(--card)] border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200'
                            }`}
                          >
                            সকল সংযোগ ({activeRelatedAyahs.length})
                          </button>
                          <button
                            onClick={() => setSelectedRelationFilter('same_word')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                              selectedRelationFilter === 'same_word'
                                ? 'bg-purple-700 text-white shadow-2xs'
                                : 'bg-[var(--card)] border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200'
                            }`}
                          >
                            একই শব্দ
                          </button>
                          <button
                            onClick={() => setSelectedRelationFilter('shared_concept')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                              selectedRelationFilter === 'shared_concept'
                                ? 'bg-purple-700 text-white shadow-2xs'
                                : 'bg-[var(--card)] border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200'
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
                              className="p-5 rounded-2xl border border-purple-200/90 dark:border-purple-800/60 bg-[var(--card)] hover:border-purple-500 space-y-3.5 transition-all shadow-2xs"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-sm text-[var(--foreground)]">
                                  সূরা {rel.surah_number}:{rel.ayah_number}
                                </span>
                                {getRelationBadge(rel.relation_type)}
                              </div>

                              {/* Arabic text */}
                              <div className="p-3 rounded-xl bg-amber-50/30 dark:bg-stone-900/50 text-right" dir="rtl">
                                <p className="font-arabic text-lg sm:text-xl text-[var(--foreground)] leading-relaxed">
                                  {rel.text_ar} <span className="text-amber-600 text-sm mr-1">۝{rel.ayah_number}</span>
                                </p>
                              </div>

                              {/* BOTH Bangla and English Translations for Related Ayah */}
                              <div className="space-y-2 text-xs">
                                <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40">
                                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">বাংলা অনুবাদ:</span>
                                  <p className="text-emerald-950 dark:text-emerald-100 leading-relaxed font-bangla text-xs sm:text-sm">
                                    {rel.translation_bn}
                                  </p>
                                </div>
                                <div className="p-2.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/40">
                                  <span className="text-[10px] font-bold text-sky-800 dark:text-sky-300 block mb-0.5">English Translation:</span>
                                  <p className="text-sky-950 dark:text-sky-100 leading-relaxed font-sans text-xs sm:text-sm">
                                    {rel.translation_en}
                                  </p>
                                </div>
                              </div>

                              {/* Connection Explanation */}
                              <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/40 text-xs text-purple-950 dark:text-purple-200 font-bangla leading-relaxed">
                                <span className="font-bold text-purple-900 dark:text-purple-300">সংযোগের তাৎপর্য: </span>
                                {rel.explanation}
                              </div>

                              {/* Navigation action */}
                              <div className="pt-1 flex items-center justify-between text-xs">
                                {rel.surah_number === surahNumber ? (
                                  <button
                                    onClick={() => handleAyahClick(rel.ayah_number)}
                                    className="px-3 py-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                                  >
                                    <span>এই আয়াতে যান</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setSurahNumber(rel.surah_number);
                                      setExpandedAyahNumber(rel.ayah_number);
                                      router.push(`/tafsir?surah=${rel.surah_number}&ayah=${rel.ayah_number}`);
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                                  >
                                    <span>সূরা {rel.surah_number} এর তাফসীর খুলুন</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                <Link
                                  href={`/read/${rel.surah_number}#ayah-${rel.surah_number}-${rel.ayah_number}`}
                                  className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1"
                                  title="View in full Quran Reader"
                                >
                                  <span>Reader Mode</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-6 text-center text-xs text-purple-900 dark:text-purple-300">
                          এই ফিল্টারের সাথে কোনো প্রাসঙ্গিক আয়াত পাওয়া যায়নি।
                        </div>
                      )}
                    </div>

                    {/* Bottom Close Button */}
                    <div className="pt-3 border-t border-[var(--border)] flex justify-end">
                      <button
                        onClick={() => setExpandedAyahNumber(null)}
                        className="px-4 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
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
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[var(--muted-foreground)] font-bangla">তাফসীর সেকশন প্রস্তুত হচ্ছে...</p>
      </div>
    }>
      <TafsirContent />
    </Suspense>
  );
}
