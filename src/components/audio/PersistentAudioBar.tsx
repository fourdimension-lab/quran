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
  Gauge
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
            <div className="w-8 h-8 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center font-bold text-xs shrink-0">
              {currentSurah}:{currentAyah}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[var(--foreground)] truncate">
                {surahMeta?.name_en} ({surahMeta?.name_bn})
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
              className={`p-1.5 rounded-md border border-[var(--border)] transition-colors ${
                repeatMode !== 'none' ? 'bg-[var(--primary-light)] text-[var(--primary)] border-[var(--primary)]' : 'hover:bg-[var(--muted)]'
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              <Repeat className="w-3.5 h-3.5" />
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
