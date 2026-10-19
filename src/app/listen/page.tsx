'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Volume2, Play, Pause, Radio, User, ArrowRight, Sparkles } from 'lucide-react';
import { RECITERS_DATA } from '@/lib/quran-data/reciters';
import { SURAHS_DATA } from '@/lib/quran-data/surahs';
import { useAudioPlayer } from '@/lib/audio/audio-player-context';

export default function ListenPage() {
  const { isPlaying, currentSurah, reciterId, playAyah, pause, setReciter } = useAudioPlayer();
  const [selectedSurahNum, setSelectedSurahNum] = useState(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-xs font-semibold">
          <Volume2 className="w-3.5 h-3.5" />
          <span>High-Fidelity Quran Recitations</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Listen to the Holy Quran
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
          Listen to verified verse-by-verse and chapter-by-chapter recitations from world-renowned Qurra (reciters). Select your preferred reciter to synchronize with the Quran reader.
        </p>
      </div>

      {/* Reciters Selection Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-[var(--foreground)] tracking-wide uppercase">
          Select Master Reciter (Qari)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RECITERS_DATA.map((reciter) => {
            const isSelected = reciter.id === reciterId;
            return (
              <div
                key={reciter.id}
                onClick={() => setReciter(reciter.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--primary-light)]/40 shadow-md ring-1 ring-[var(--primary)]'
                    : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    isSelected ? 'bg-[var(--primary)] text-white' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                  }`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--foreground)]">
                      {reciter.name}
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)] font-bangla">
                      {reciter.name_bn}
                    </div>
                    <div className="text-[10px] text-[var(--primary)] font-medium">
                      {reciter.style} • {reciter.bitrate}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-arabic text-base font-bold text-[var(--foreground)] block">
                    {reciter.name_ar}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] uppercase font-bold text-[var(--primary)]">
                      Active
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chapter Recitation Launcher */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">
              Launch Recitation in Reader
            </h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              Select a Surah to begin synchronized recitation with automatic verse highlighting
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedSurahNum}
              onChange={(e) => setSelectedSurahNum(Number(e.target.value))}
              className="p-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--foreground)]"
            >
              {SURAHS_DATA.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.name_en} ({s.name_bn})
                </option>
              ))}
            </select>

            <button
              onClick={() => playAyah(selectedSurahNum, 1)}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Play className="w-4 h-4" />
              <span>Play Surah</span>
            </button>
          </div>
        </div>

        {/* Quick Surah Audio Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {SURAHS_DATA.slice(0, 12).map((s) => (
            <button
              key={s.number}
              onClick={() => playAyah(s.number, 1)}
              className="p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)] text-left text-xs transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="font-bold text-[var(--primary)] mr-1">{s.number}.</span>
                <span className="font-semibold text-[var(--foreground)]">{s.name_en}</span>
              </div>
              <Play className="w-3.5 h-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)]" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
