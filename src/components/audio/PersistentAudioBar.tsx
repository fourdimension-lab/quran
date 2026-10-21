'use client';

import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Volume2, 
  ChevronUp, 
  ChevronDown, 
  X,
  Gauge,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { useAudioPlayer } from '@/lib/audio/audio-player-context';
import { RECITERS_DATA } from '@/lib/quran-data/reciters';
import { getSurahByNumber } from '@/lib/quran-data/surahs';

export function PersistentAudioBar() {
  const {
    isPlaying,
    currentSurah,
    currentAyah,
    reciterId,
    playbackRate,
    currentTime,
    duration,
    repeatMode,
    playAyah,
    togglePlay,
    nextAyah,
    previousAyah,
    seek,
    setReciter,
    setSpeed,
    setRepeat
  } = useAudioPlayer();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showReciterList, setShowReciterList] = useState(false);
  const [showAyahJumper, setShowAyahJumper] = useState(false);
  const [jumpInput, setJumpInput] = useState('');

  const surahMeta = getSurahByNumber(currentSurah);
  const activeReciter = RECITERS_DATA.find((r) => r.id === reciterId) || RECITERS_DATA[0];

  const formatTime = (sec: number) => {
    if (isNaN(sec)) return '0:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleRepeatCycle = () => {
    if (repeatMode === 'none') setRepeat('single');
    else if (repeatMode === 'single') setRepeat('surah');
    else setRepeat('none');
  };

  const handleSpeedCycle = () => {
    if (playbackRate === 1) setSpeed(1.25);
    else if (playbackRate === 1.25) setSpeed(1.5);
    else if (playbackRate === 1.5) setSpeed(0.75);
    else setSpeed(1);
  };

  return (
    <div className="fixed bottom-14 lg:bottom-0 left-0 right-0 z-35 bg-[var(--card)] border-t border-[var(--border)] shadow-xl transition-all">
      {/* Ayah Jumper Popover */}
      {showAyahJumper && (
        <div className="absolute left-4 sm:left-8 bottom-full mb-3 w-80 sm:w-96 p-4 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-2xl space-y-3 z-50 animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
                Instant Ayah Jumper
              </span>
            </div>
            <button 
              onClick={() => setShowAyahJumper(false)}
              className="p-1 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* The Amber Card from Screenshot */}
          <div className="bg-amber-400 text-slate-950 p-3 rounded-2xl flex items-center gap-3 shadow-md">
            <div className="w-9 h-9 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-950">
                VERSE {currentSurah}:{currentAyah}
              </div>
              <div className="text-xs font-bold text-slate-900 truncate">
                Surah {surahMeta?.name_en} ({surahMeta?.name_ar})
              </div>
            </div>
          </div>

          {/* Numeric Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const num = parseInt(jumpInput, 10);
              if (!isNaN(num) && surahMeta) {
                const clamped = Math.max(1, Math.min(num, surahMeta.verses_count));
                playAyah(currentSurah, clamped);
                setShowAyahJumper(false);
                setJumpInput('');
              }
            }}
            className="flex gap-2"
          >
            <input
              type="number"
              min={1}
              max={surahMeta?.verses_count || 1}
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              placeholder={`Verse 1 - ${surahMeta?.verses_count || 7}...`}
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-amber-500 font-medium"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-600 cursor-pointer"
            >
              Jump
            </button>
          </form>

          {/* Quick Ayah Selector Grid */}
          <div className="max-h-36 overflow-y-auto grid grid-cols-6 sm:grid-cols-8 gap-1.5 p-1 bg-[var(--muted)]/50 rounded-xl">
            {Array.from({ length: surahMeta?.verses_count || 7 }, (_, i) => i + 1).map((vNum) => (
              <button
                key={vNum}
                onClick={() => {
                  playAyah(currentSurah, vNum);
                  setShowAyahJumper(false);
                }}
                className={`h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentAyah === vNum
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'bg-[var(--card)] hover:bg-amber-100 dark:hover:bg-amber-950/40 text-[var(--foreground)]'
                }`}
              >
                {vNum}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col gap-1">
        
        {/* Progress Slider */}
        <div className="flex items-center gap-2 text-[10px] text-[var(--muted-foreground)]">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full h-1 bg-[var(--muted)] rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
          />
          <span>{formatTime(duration)}</span>
        </div>

        {/* Main Controls Row */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Verse Info & Reciter */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setShowAyahJumper(!showAyahJumper)}
              className="w-9 h-9 rounded-xl bg-[var(--primary-light)] hover:bg-amber-100 dark:hover:bg-amber-950/50 text-[var(--primary)] hover:text-amber-600 flex items-center justify-center font-bold text-xs shrink-0 border border-transparent hover:border-amber-400 transition-all cursor-pointer group"
              title="Click to jump to any Ayah in this Surah"
            >
              <span className="group-hover:scale-105 transition-transform">{currentSurah}:{currentAyah}</span>
            </button>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[var(--foreground)] truncate flex items-center gap-1.5">
                <span>{surahMeta?.name_en} ({surahMeta?.name_bn})</span>
                <button
                  onClick={() => setShowAyahJumper(!showAyahJumper)}
                  className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  Jump Ayah
                </button>
              </div>
              <div className="text-[11px] text-[var(--muted-foreground)] truncate flex items-center gap-1">
                <span>{activeReciter.name}</span>
                <span className="text-[9px] px-1 rounded bg-[var(--muted)]">{activeReciter.style}</span>
              </div>
            </div>
          </div>

          {/* Central Playback Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={previousAyah}
              className="p-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors"
              title="Previous Ayah"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="p-2.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-md transition-transform active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
            </button>

            <button
              onClick={nextAyah}
              className="p-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors"
              title="Next Ayah"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Secondary Controls: Repeat, Speed, Reciter Picker */}
          <div className="flex items-center gap-1.5 text-xs">
            {/* Speed Toggle */}
            <button
              onClick={handleSpeedCycle}
              className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md border border-[var(--border)] hover:bg-[var(--muted)] font-mono text-[11px]"
              title="Playback Speed"
            >
              <Gauge className="w-3 h-3 text-[var(--primary)]" />
              <span>{playbackRate}x</span>
            </button>

            {/* Repeat Mode */}
            <button
              onClick={handleRepeatCycle}
              className={`p-1.5 rounded-md border border-[var(--border)] transition-colors flex items-center gap-1 ${
                repeatMode !== 'none' ? 'bg-[var(--primary-light)] text-[var(--primary)] border-[var(--primary)]' : 'hover:bg-[var(--muted)]'
              }`}
              title={
                repeatMode === 'single'
                  ? 'একক আয়াত পুনরাবৃত্তি (Repeat Ayah)'
                  : repeatMode === 'surah'
                  ? 'সম্পূর্ণ সূরা পুনরাবৃত্তি (Repeat Surah)'
                  : 'ধারাবাহিক তিলাওয়াত (Continuous Surah Play)'
              }
            >
              <Repeat className="w-3.5 h-3.5" />
              {repeatMode === 'single' && <span className="text-[9px] font-black leading-none">1</span>}
              {repeatMode === 'surah' && <span className="text-[9px] font-black leading-none">All</span>}
            </button>

            {/* Reciter Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowReciterList(!showReciterList)}
                className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md border border-[var(--border)] hover:bg-[var(--muted)] text-[11px]"
              >
                <Volume2 className="w-3 h-3 text-[var(--gold)]" />
                <span className="truncate max-w-[100px]">{activeReciter.name.split(' ')[0]}</span>
                <ChevronUp className="w-3 h-3 opacity-60" />
              </button>

              {showReciterList && (
                <div className="absolute right-0 bottom-full mb-2 w-64 p-2 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl space-y-1">
                  <div className="text-[11px] font-semibold text-[var(--muted-foreground)] px-2 py-1">
                    Select Qari (Reciter)
                  </div>
                  {RECITERS_DATA.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setReciter(r.id);
                        setShowReciterList(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                        r.id === reciterId ? 'bg-[var(--primary-light)] text-[var(--primary)] font-semibold' : 'hover:bg-[var(--muted)]'
                      }`}
                    >
                      <div>
                        <div>{r.name}</div>
                        <div className="text-[10px] text-[var(--muted-foreground)]">{r.style} • {r.bitrate}</div>
                      </div>
                      <span className="font-arabic text-sm">{r.name_ar}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
