'use client';

import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  BookOpen, 
  Bookmark, 
  Share2, 
  Copy, 
  Check, 
  Link2,
  FileText
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
  arabicFontSize: number;
  onSelectWord: (word: QuranWord) => void;
  onOpenTafsir: (ayah: Ayah) => void;
  onOpenRelated: (ayah: Ayah) => void;
}

export function AyahCard({
  ayah,
  showEnglish,
  showBangla,
  showTransliteration,
  showWordByWord,
  arabicFontSize,
  onSelectWord,
  onOpenTafsir,
  onOpenRelated
}: AyahCardProps) {
  const { isPlaying, currentSurah, currentAyah, playAyah, pause } = useAudioPlayer();
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(() => 
    isAyahBookmarked(ayah.surah_number, ayah.ayah_number)
  );

  const isCurrentPlaying = isPlaying && currentSurah === ayah.surah_number && currentAyah === ayah.ayah_number;

  const handleAudioToggle = () => {
    if (isCurrentPlaying) {
      pause();
    } else {
      playAyah(ayah.surah_number, ayah.ayah_number);
    }
  };

  const handleBookmarkToggle = () => {
    saveBookmark({
      surah_number: ayah.surah_number,
      ayah_number: ayah.ayah_number,
      note: `Ayah ${ayah.surah_number}:${ayah.ayah_number}`
    });
    setBookmarked(!bookmarked);
  };

  const handleCopy = () => {
    const text = `${ayah.text_ar}\n\n"${ayah.translation_en}"\n\n- Quran [${ayah.surah_number}:${ayah.ayah_number}]`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id={`ayah-${ayah.surah_number}-${ayah.ayah_number}`}
      className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 ${
        isCurrentPlaying
          ? 'bg-[var(--primary-light)]/40 border-[var(--primary)] shadow-md ring-1 ring-[var(--primary)]'
          : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--border)]/80 shadow-xs'
      }`}
    >
      {/* Top Bar: Reference and Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]/60 text-xs">
        
        {/* Ayah Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] font-bold">
            {ayah.ayah_number}
          </div>
          <span className="text-[var(--muted-foreground)] font-medium">
            Juz {ayah.juz} • Page {ayah.page}
          </span>
          {ayah.sajdah && (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
              Sajdah
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleAudioToggle}
            className={`p-1.5 rounded-lg transition-colors ${
              isCurrentPlaying
                ? 'bg-[var(--primary)] text-white'
                : 'text-[var(--foreground)] hover:bg-[var(--muted)]'
            }`}
            title={isCurrentPlaying ? 'Pause Audio' : 'Play Recitation'}
          >
            {isCurrentPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onOpenTafsir(ayah)}
            className="p-1.5 rounded-lg text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            title="Read Tafsir & Study Notes"
          >
            <BookOpen className="w-4 h-4 text-[var(--primary)]" />
          </button>

          <button
            onClick={() => onOpenRelated(ayah)}
            className="p-1.5 rounded-lg text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            title="Discover Related Ayahs"
          >
            <Link2 className="w-4 h-4 text-[var(--gold)]" />
          </button>

          <button
            onClick={handleBookmarkToggle}
            className={`p-1.5 rounded-lg transition-colors ${
              bookmarked ? 'text-[var(--gold)]' : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
            }`}
            title={bookmarked ? 'Bookmarked' : 'Add Bookmark'}
          >
            <Bookmark className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
            title="Copy Ayah text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Arabic Text & Clickable Words */}
      <div className="py-6 text-right" dir="rtl">
        {ayah.words && ayah.words.length > 0 && showWordByWord ? (
          <div className="flex flex-wrap flex-row-reverse items-baseline gap-x-2.5 gap-y-3 leading-loose justify-start">
            {ayah.words.map((w) => (
              <span
                key={w.id}
                onClick={() => onSelectWord(w)}
                className="inline-flex flex-col items-center group cursor-pointer px-1 py-0.5 rounded-lg hover:bg-[var(--primary-light)] transition-colors"
                title={`Click for word meaning: ${w.transliteration}`}
              >
                <span 
                  className="font-arabic text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors"
                  style={{ fontSize: `${arabicFontSize}px` }}
                >
                  {w.arabic}
                </span>
                <span className="text-[10px] text-[var(--muted-foreground)] group-hover:text-[var(--primary)] tracking-tight">
                  {w.translation_en || w.transliteration}
                </span>
              </span>
            ))}
            {/* End of Ayah marker symbol */}
            <span className="font-arabic text-xl text-[var(--primary)] select-none mr-2">
              ۝{ayah.ayah_number}
            </span>
          </div>
        ) : (
          <p 
            className="font-arabic text-[var(--foreground)] leading-loose select-text"
            style={{ fontSize: `${arabicFontSize}px` }}
          >
            {ayah.text_ar} <span className="text-xl text-[var(--primary)] mr-2 select-none">۝{ayah.ayah_number}</span>
          </p>
        )}
      </div>

      {/* Translations & Transliterations */}
      <div className="space-y-2 pt-2 border-t border-[var(--border)]/40 text-left">
        {showTransliteration && ayah.transliteration && (
          <p className="text-xs text-[var(--primary)] italic font-medium">
            {ayah.transliteration}
          </p>
        )}

        {showEnglish && (
          <p className="text-sm text-[var(--foreground)] leading-relaxed font-sans">
            {ayah.translation_en}
          </p>
        )}

        {showBangla && (
          <p className="text-sm text-[var(--foreground)]/90 leading-relaxed font-bangla">
            {ayah.translation_bn}
          </p>
        )}
      </div>
    </div>
  );
}
