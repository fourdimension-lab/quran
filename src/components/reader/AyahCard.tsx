'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Pause, 
  BookOpen, 
  Bookmark, 
  Copy, 
  Check, 
  Link2,
  ArrowRight,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Volume2,
  Info
} from 'lucide-react';
import { Ayah, QuranWord } from '@/types/quran';
import { useAudioPlayer } from '@/lib/audio/audio-player-context';
import { isAyahBookmarked, saveBookmark } from '@/lib/storage/user-storage';

interface AyahCardProps {
  ayah: Ayah;
  showEnglish: boolean;
  showBangla: boolean;
  showTransliteration: boolean;
  showWordByWord: boolean;
  isWordByWordActive?: boolean;
  onToggleWordByWord?: (ayahNumber: number) => void;
  arabicFontSize: number;
  onSelectWord: (word: QuranWord) => void;
  onOpenTafsir: (ayah: Ayah) => void;
  onOpenRelated: (ayah: Ayah) => void;
  onOpenAIStudy?: (query: string) => void;
}

export function AyahCard({
  ayah,
  showEnglish,
  showBangla,
  showTransliteration,
  showWordByWord,
  isWordByWordActive = false,
  onToggleWordByWord,
  arabicFontSize,
  onSelectWord,
  onOpenTafsir,
  onOpenRelated,
  onOpenAIStudy
}: AyahCardProps) {
  const { isPlaying, currentSurah, currentAyah, playAyah, pause } = useAudioPlayer();
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(() => 
    isAyahBookmarked(ayah.surah_number, ayah.ayah_number)
  );

  const isCurrentPlaying = isPlaying && currentSurah === ayah.surah_number && currentAyah === ayah.ayah_number;

  const handleAudioToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentPlaying) {
      pause();
    } else {
      playAyah(ayah.surah_number, ayah.ayah_number);
    }
  };

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    saveBookmark({
      surah_number: ayah.surah_number,
      ayah_number: ayah.ayah_number,
      note: `Ayah ${ayah.surah_number}:${ayah.ayah_number}`
    });
    setBookmarked(!bookmarked);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${ayah.text_ar}\n\n"${ayah.translation_en}"\n\n- Quran [${ayah.surah_number}:${ayah.ayah_number}]`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleWordByWordClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWordByWord) {
      onToggleWordByWord(ayah.ayah_number);
    }
  };

  const getPosBadgeColor = (pos?: string) => {
    if (!pos) return 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200';
    const p = pos.toLowerCase();
    if (p.includes('noun') || p.includes('ism')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border-blue-200 dark:border-blue-800';
    }
    if (p.includes('verb') || p.includes('fi\'l')) {
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 border-amber-200 dark:border-amber-800';
    }
    if (p.includes('particle') || p.includes('harf') || p.includes('prep')) {
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800';
    }
    return 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 border-purple-200 dark:border-purple-800';
  };

  return (
    <div 
      id={`ayah-${ayah.surah_number}-${ayah.ayah_number}`}
      className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 space-y-4 shadow-sm ${
        isCurrentPlaying
          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500 shadow-lg ring-2 ring-emerald-500/30'
          : 'bg-[var(--card)] border-[var(--border)] hover:border-emerald-500/40 hover:shadow-md'
      }`}
    >
      {/* 1. TOP HEADER BAR: Reference, Audio, Tools */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]/70 text-xs">
        
        {/* Ayah Reference Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-extrabold shadow-xs">
            {ayah.ayah_number}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 font-bold text-[11px] border border-emerald-300/50 dark:border-emerald-800">
              সূরা {ayah.surah_number}:{ayah.ayah_number}
            </span>
            <span className="text-[var(--muted-foreground)] text-[11px] font-medium hidden sm:inline">
              পারা {ayah.juz} • পৃষ্ঠা {ayah.page}
            </span>
            {ayah.sajdah && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold">
                সিজদাহ
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {/* Audio Recitation Toggle */}
          <button
            onClick={handleAudioToggle}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isCurrentPlaying
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'bg-[var(--muted)] hover:bg-emerald-50 dark:hover:bg-emerald-950 text-[var(--foreground)] border border-[var(--border)]'
            }`}
            title={isCurrentPlaying ? 'তিলাওয়াত থামান' : 'আয়াত তিলাওয়াত শুনুন'}
          >
            {isCurrentPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[11px]">বাজছে...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] hidden sm:inline">তিলাওয়াত</span>
              </>
            )}
          </button>

          {/* Quick Bookmark */}
          <button
            onClick={handleBookmarkToggle}
            className={`p-2 rounded-xl border border-[var(--border)] transition-all ${
              bookmarked 
                ? 'bg-amber-500/15 text-amber-500 border-amber-500/40' 
                : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-amber-500'
            }`}
            title={bookmarked ? 'সংরক্ষিত' : 'বুকমার্কে যোগ করুন'}
          >
            <Bookmark className="w-3.5 h-3.5" fill={bookmarked ? 'currentColor' : 'none'} />
          </button>

          {/* Copy Ayah */}
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-emerald-600 transition-colors"
            title="আয়াত ও অনুবাদ কপি করুন"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. SACRED ARABIC SCRIPT BOX (Distinct Pastel Emerald Theme) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-emerald-200/90 dark:border-emerald-800/60 transition-colors">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-emerald-200/50 dark:border-emerald-800/40 text-[11px]">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold">
            <span>📖</span>
            <span>মূল কুরআন পাঠ (Sacred Arabic Script)</span>
          </div>

          <span className="text-emerald-700/80 dark:text-emerald-400 font-arabic text-xs">
            رِوَايَةُ حَفْصٍ عَنْ عَاصِمٍ
          </span>
        </div>

        {/* Sacred Arabic Text */}
        <div className="text-right select-text py-2" dir="rtl">
          <p 
            className="font-arabic text-[var(--foreground)] leading-loose tracking-wide"
            style={{ fontSize: `${arabicFontSize}px` }}
          >
            {ayah.text_ar}{' '}
            <span className="text-amber-500 dark:text-amber-400 font-arabic text-2xl mr-2 select-none inline-block">
              ۝{ayah.ayah_number}
            </span>
          </p>
        </div>
      </div>

      {/* 3. WORD-BY-WORD MEANING BOX (Shown ONLY when this Ayat is active - At a time only one ayat!) */}
      {isWordByWordActive && ayah.words && ayah.words.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/30 border-2 border-teal-400 dark:border-teal-600/80 shadow-md animate-in fade-in zoom-in-98 duration-200">
          
          {/* Word-by-Word Header Bar */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-teal-200 dark:border-teal-800/50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-500 text-white">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-teal-950 dark:text-teal-100 flex items-center gap-2">
                  <span>শব্দে শব্দে অর্থ ও ব্যাকরণ বিশ্লেষণ</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-200/80 dark:bg-teal-900 text-teal-900 dark:text-teal-200 font-bold">
                    আয়াত {ayah.ayah_number} • {ayah.words.length} শব্দ
                  </span>
                </div>
                <div className="text-[10px] text-teal-700 dark:text-teal-300">
                  যেকোনো শব্দের ওপর ট্যাপ করে ব্যাকরণ, মূলশব্দ (Root) ও কোরআনে পুনরাবৃত্তি দেখুন
                </div>
              </div>
            </div>

            <button
              onClick={handleToggleWordByWordClick}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-teal-200/70 dark:bg-teal-900 hover:bg-teal-300 text-teal-900 dark:text-teal-100 transition-colors flex items-center gap-1"
            >
              <span>সংক্ষেপ করুন</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Word Cards Stream (RTL aligned) */}
          <div className="flex flex-wrap flex-row-reverse items-stretch justify-start gap-2.5 sm:gap-3" dir="rtl">
            {ayah.words.map((w) => (
              <div
                key={w.id}
                onClick={() => onSelectWord(w)}
                className="group/word flex flex-col justify-between p-2.5 sm:p-3 rounded-xl bg-white dark:bg-[#0c1e17] border-2 border-teal-200/80 dark:border-teal-700/60 hover:border-amber-400 hover:shadow-md cursor-pointer transition-all duration-200 min-w-[90px] max-w-[150px] text-center"
                title={`ক্লিক করুন: ${w.transliteration} (ব্যাকরণ ও তথ্য)`}
              >
                {/* Word Position & Grammar Pill */}
                <div className="flex items-center justify-between gap-1 mb-1.5" dir="ltr">
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 font-bold">
                    #{w.position}
                  </span>
                  {w.part_of_speech && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold truncate ${getPosBadgeColor(w.part_of_speech)}`}>
                      {w.part_of_speech.split(' ')[0]}
                    </span>
                  )}
                </div>

                {/* Arabic Script */}
                <div className="py-1">
                  <span className="font-arabic text-xl sm:text-2xl font-bold text-[var(--foreground)] group-hover/word:text-amber-500 transition-colors select-none">
                    {w.arabic}
                  </span>
                </div>

                {/* Transliteration */}
                <div className="text-[10px] text-[var(--muted-foreground)] italic font-mono truncate" dir="ltr">
                  {w.transliteration}
                </div>

                {/* Dual Meaning: Bangla & English */}
                <div className="mt-2 pt-1.5 border-t border-teal-100 dark:border-teal-900/50 space-y-0.5" dir="ltr">
                  <div className="text-xs font-bold text-teal-900 dark:text-teal-200 font-bangla">
                    {w.translation_bn || w.translation_en}
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)] line-clamp-1">
                    {w.translation_en}
                  </div>
                </div>

                {/* Root Tag if exists */}
                {w.root && (
                  <div className="mt-1 text-[9px] font-mono text-amber-600 dark:text-amber-400 font-bold" dir="ltr">
                    جذر: {w.root}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TRANSLITERATION BOX (Distinct Royal Violet Theme) */}
      {showTransliteration && ayah.transliteration && (
        <div className="p-3.5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/30 border-2 border-purple-200/90 dark:border-purple-800/60 space-y-1 shadow-2xs">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-100/90 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 w-fit">
            <span className="text-xs">🗣️</span>
            <span className="text-[10px] font-bold tracking-wide">সহীহ উচ্চারণ ও বর্ণান্তর (Transliteration)</span>
          </div>
          <p className="text-sm text-purple-950 dark:text-purple-100 italic font-medium leading-relaxed">
            {ayah.transliteration}
          </p>
        </div>
      )}

      {/* 5. TRANSLATIONS GRID (Distinct Green for Bangla, Sky for English) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Bangla Translation Box */}
        {showBangla && (
          <div className="p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/35 border-2 border-emerald-300 dark:border-emerald-700/60 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-100/90 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                <span className="text-xs">🇧🇩</span>
                <span className="text-[10px] font-bold tracking-wide">বাংলা অনুবাদ (তাফসীরুল কুরআন)</span>
              </div>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold">মুহিউদ্দীন খান</span>
            </div>
            <p className="text-sm text-emerald-950 dark:text-emerald-100 leading-relaxed font-bangla font-medium">
              {ayah.translation_bn}
            </p>
          </div>
        )}

        {/* English Translation Box */}
        {showEnglish && (
          <div className="p-4 rounded-2xl bg-sky-50/90 dark:bg-sky-950/35 border-2 border-sky-300 dark:border-sky-700/60 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-sky-100/90 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200">
                <span className="text-xs">🇬🇧</span>
                <span className="text-[10px] font-bold tracking-wide">English Translation (Saheeh Int.)</span>
              </div>
              <span className="text-[10px] text-sky-700 dark:text-sky-300 font-semibold">Canonical Text</span>
            </div>
            <p className="text-sm text-sky-950 dark:text-sky-100 leading-relaxed font-sans font-medium">
              {ayah.translation_en}
            </p>
          </div>
        )}
      </div>

      {/* 6. BOTTOM INTERACTIVE STUDY ACTIONS DECK */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)]/50 text-xs">
        
        {/* Left Side: Word-by-Word & Tafsir Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* WORD-BY-WORD TOGGLE BUTTON (Only one at a time!) */}
          <button
            type="button"
            onClick={handleToggleWordByWordClick}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all shadow-2xs ${
              isWordByWordActive
                ? 'bg-teal-600 text-white border-2 border-teal-500 shadow-teal-700/20'
                : 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-500/30'
            }`}
            title="এই একটি আয়াতের শব্দে শব্দে অর্থ ও ব্যাকরণ দেখুন"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isWordByWordActive ? 'শব্দে শব্দে অর্থ সংক্ষেপ' : 'শব্দে শব্দে অর্থ (Word-by-Word)'}</span>
            {isWordByWordActive ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          {/* TAFSIR TRIGGER */}
          <button
            type="button"
            onClick={() => onOpenTafsir(ayah)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-bold transition-all shadow-2xs"
            title="ইবনে কাসীর ও আহসানুল বায়ান তাফসীর পড়ুন"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>তাফসীর ও ব্যাখ্যা</span>
            <ArrowRight className="w-3 h-3 ml-0.5 opacity-80" />
          </button>

          {/* RELATED AYAHS TRIGGER */}
          <button
            type="button"
            onClick={() => onOpenRelated(ayah)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border border-indigo-500/30 font-bold transition-all shadow-2xs"
            title="পবিত্র কুরআনের সম্পর্কিত আয়াতসমূহ অন্বেষণ করুন"
          >
            <Link2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>সম্পর্কিত আয়াত</span>
          </button>
        </div>

        {/* Right Side: AI Assistant Quick Inquire */}
        <Link
          href={`/ai-study`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 hover:from-violet-600/20 hover:to-fuchsia-600/20 text-violet-800 dark:text-violet-300 border border-violet-400/40 font-bold transition-all shadow-2xs"
          title="এই আয়াত সম্পর্কে এআইকে প্রশ্ন করুন"
        >
          <Sparkles className="w-3.5 h-3.5 text-fuchsia-500 animate-pulse" />
          <span>এআই গবেষণা</span>
        </Link>
      </div>
    </div>
  );
}
