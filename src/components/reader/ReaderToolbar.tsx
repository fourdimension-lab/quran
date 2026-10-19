'use client';

import React, { useState } from 'react';
import { 
  Sliders, 
  ChevronLeft, 
  ChevronRight, 
  Type, 
  Eye, 
  Settings, 
  ListFilter,
  Check
} from 'lucide-react';
import { Surah } from '@/types/quran';
import { SURAHS_DATA } from '@/lib/quran-data/surahs';

interface ReaderToolbarProps {
  currentSurah: Surah;
  onSelectSurah: (num: number) => void;
  arabicFontSize: number;
  setArabicFontSize: (size: number) => void;
  showEnglish: boolean;
  setShowEnglish: (val: boolean) => void;
  showBangla: boolean;
  setShowBangla: (val: boolean) => void;
  showTransliteration: boolean;
  setShowTransliteration: (val: boolean) => void;
  showWordByWord: boolean;
  setShowWordByWord: (val: boolean) => void;
}

export function ReaderToolbar({
  currentSurah,
  onSelectSurah,
  arabicFontSize,
  setArabicFontSize,
  showEnglish,
  setShowEnglish,
  showBangla,
  setShowBangla,
  showTransliteration,
  setShowTransliteration,
  showWordByWord,
  setShowWordByWord
}: ReaderToolbarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showSurahPicker, setShowSurahPicker] = useState(false);
  const [surahSearch, setSurahSearch] = useState('');

  const filteredSurahs = SURAHS_DATA.filter((s) =>
    s.number.toString().includes(surahSearch) ||
    s.name_en.toLowerCase().includes(surahSearch.toLowerCase()) ||
    s.name_bn.includes(surahSearch) ||
    s.name_ar.includes(surahSearch)
  );

  return (
    <div className="sticky top-16 z-20 w-full bg-[var(--card)]/95 backdrop-blur-md border-b border-[var(--border)] py-2.5 px-4 sm:px-6 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Surah Navigation Selector */}
        <div className="relative flex items-center gap-1.5">
          <button
            onClick={() => onSelectSurah(Math.max(1, currentSurah.number - 1))}
            disabled={currentSurah.number <= 1}
            className="p-1.5 rounded-lg border border-[var(--border)] disabled:opacity-30 hover:bg-[var(--muted)] text-[var(--foreground)]"
            title="Previous Surah"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowSurahPicker(!showSurahPicker)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)] text-xs font-semibold text-[var(--foreground)] transition-colors"
          >
            <span className="w-5 h-5 rounded-md bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center font-bold text-[10px]">
              {currentSurah.number}
            </span>
            <span>{currentSurah.name_en} ({currentSurah.name_bn})</span>
            <span className="font-arabic text-sm text-[var(--primary)]">{currentSurah.name_ar}</span>
          </button>

          <button
            onClick={() => onSelectSurah(Math.min(114, currentSurah.number + 1))}
            disabled={currentSurah.number >= 114}
            className="p-1.5 rounded-lg border border-[var(--border)] disabled:opacity-30 hover:bg-[var(--muted)] text-[var(--foreground)]"
            title="Next Surah"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Surah Dropdown Modal */}
          {showSurahPicker && (
            <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 max-h-96 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl p-2 z-30 flex flex-col">
              <input
                type="text"
                value={surahSearch}
                onChange={(e) => setSurahSearch(e.target.value)}
                placeholder="Find Surah (1-114)..."
                className="w-full text-xs p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] mb-2 focus:outline-hidden"
                autoFocus
              />
              <div className="overflow-y-auto space-y-1 flex-1">
                {filteredSurahs.map((s) => (
                  <button
                    key={s.number}
                    onClick={() => {
                      onSelectSurah(s.number);
                      setShowSurahPicker(false);
                    }}
                    className={`w-full p-2 rounded-lg text-left text-xs flex items-center justify-between ${
                      s.number === currentSurah.number
                        ? 'bg-[var(--primary-light)] text-[var(--primary)] font-semibold'
                        : 'hover:bg-[var(--muted)] text-[var(--foreground)]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-sm bg-[var(--muted)] text-center text-[10px] font-bold leading-5">
                        {s.number}
                      </span>
                      <div>
                        <div>{s.name_en} ({s.name_bn})</div>
                        <div className="text-[10px] text-[var(--muted-foreground)]">{s.verses_count} ayahs</div>
                      </div>
                    </div>
                    <span className="font-arabic text-sm">{s.name_ar}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Display Controls */}
        <div className="flex items-center gap-1.5">
          {/* Font Size Adjusters */}
          <div className="hidden sm:flex items-center border border-[var(--border)] rounded-lg bg-[var(--background)] px-1">
            <button
              onClick={() => setArabicFontSize(Math.max(22, arabicFontSize - 2))}
              className="px-2 py-1 text-xs font-bold text-[var(--foreground)] hover:text-[var(--primary)]"
              title="Decrease Arabic font size"
            >
              A-
            </button>
            <span className="text-[11px] font-mono text-[var(--muted-foreground)] px-1">{arabicFontSize}</span>
            <button
              onClick={() => setArabicFontSize(Math.min(48, arabicFontSize + 2))}
              className="px-2 py-1 text-xs font-bold text-[var(--foreground)] hover:text-[var(--primary)]"
              title="Increase Arabic font size"
            >
              A+
            </button>
          </div>

          {/* Settings Trigger */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-[var(--foreground)] flex items-center gap-1 text-xs font-semibold"
            title="Reading Settings"
          >
            <Settings className="w-4 h-4 text-[var(--primary)]" />
            <span className="hidden md:inline">Preferences</span>
          </button>
        </div>
      </div>

      {/* Settings Dropdown Popover */}
      {showSettings && (
        <div className="absolute right-4 sm:right-6 top-full mt-2 w-72 p-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl z-30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
            <span className="text-xs font-bold text-[var(--foreground)]">Reader Preferences</span>
            <button onClick={() => setShowSettings(false)} className="text-xs text-[var(--muted-foreground)]">Close</button>
          </div>

          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <span>Word-by-Word Interactivity</span>
              <input
                type="checkbox"
                checked={showWordByWord}
                onChange={(e) => setShowWordByWord(e.target.checked)}
                className="w-4 h-4 accent-[var(--primary)]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span>English Translation (Saheeh)</span>
              <input
                type="checkbox"
                checked={showEnglish}
                onChange={(e) => setShowEnglish(e.target.checked)}
                className="w-4 h-4 accent-[var(--primary)]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span>Bangla Translation (Muhiuddin)</span>
              <input
                type="checkbox"
                checked={showBangla}
                onChange={(e) => setShowBangla(e.target.checked)}
                className="w-4 h-4 accent-[var(--primary)]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span>Transliteration</span>
              <input
                type="checkbox"
                checked={showTransliteration}
                onChange={(e) => setShowTransliteration(e.target.checked)}
                className="w-4 h-4 accent-[var(--primary)]"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
