'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { RECITERS_DATA, getAyahAudioUrl } from '../quran-data/reciters';
import { getSurahByNumber } from '../quran-data/surahs';

interface AudioPlayerContextType {
  isPlaying: boolean;
  currentSurah: number;
  currentAyah: number;
  reciterId: string;
  playbackRate: number;
  currentTime: number;
  duration: number;
  repeatMode: 'none' | 'single' | 'surah';
  autoScroll: boolean;
  playAyah: (surah: number, ayah: number) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  nextAyah: () => void;
  previousAyah: () => void;
  seek: (seconds: number) => void;
  setReciter: (id: string) => void;
  setSpeed: (rate: number) => void;
  setRepeat: (mode: 'none' | 'single' | 'surah') => void;
  setAutoScroll: (enabled: boolean) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSurah, setCurrentSurah] = useState(1);
  const [currentAyah, setCurrentAyah] = useState(1);
  const [reciterId, setReciterId] = useState('mishary-alafasy');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatMode, setRepeatMode] = useState<'none' | 'single' | 'surah'>('none');
  const [autoScroll, setAutoScroll] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      const audio = audioRef.current;

      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
      audio.onloadedmetadata = () => setDuration(audio.duration);
      audio.onended = handleTrackEnded;

      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, []);

  const handleTrackEnded = () => {
    if (repeatMode === 'single') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }

    const surahMeta = getSurahByNumber(currentSurah);
    const maxVerses = surahMeta?.verses_count || 7;

    if (currentAyah < maxVerses) {
      playAyah(currentSurah, currentAyah + 1);
    } else if (repeatMode === 'surah') {
      playAyah(currentSurah, 1);
    } else if (currentSurah < 114) {
      playAyah(currentSurah + 1, 1);
    } else {
      setIsPlaying(false);
    }
  };

  const playAyah = (surah: number, ayah: number) => {
    setCurrentSurah(surah);
    setCurrentAyah(ayah);

    const url = getAyahAudioUrl(reciterId, surah, ayah);
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Audio playback prevented or failed:', err);
          setIsPlaying(false);
        });
    }

    // Scroll into view if enabled
    if (autoScroll && typeof document !== 'undefined') {
      const el = document.getElementById(`ayah-${surah}-${ayah}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (audioRef.current && audioRef.current.src) {
      audioRef.current.play().catch(console.warn);
      setIsPlaying(true);
    } else {
      playAyah(currentSurah, currentAyah);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const nextAyah = () => {
    const surahMeta = getSurahByNumber(currentSurah);
    const maxVerses = surahMeta?.verses_count || 7;
    if (currentAyah < maxVerses) {
      playAyah(currentSurah, currentAyah + 1);
    } else if (currentSurah < 114) {
      playAyah(currentSurah + 1, 1);
    }
  };

  const previousAyah = () => {
    if (currentAyah > 1) {
      playAyah(currentSurah, currentAyah - 1);
    } else if (currentSurah > 1) {
      const prevSurahMeta = getSurahByNumber(currentSurah - 1);
      playAyah(currentSurah - 1, prevSurahMeta?.verses_count || 1);
    }
  };

  const seek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const setReciter = (id: string) => {
    setReciterId(id);
    if (isPlaying) {
      // Switch reciter immediately and keep playing
      const wasPlaying = isPlaying;
      const url = getAyahAudioUrl(id, currentSurah, currentAyah);
      if (audioRef.current) {
        audioRef.current.src = url;
        if (wasPlaying) audioRef.current.play().catch(console.warn);
      }
    }
  };

  const setSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        isPlaying,
        currentSurah,
        currentAyah,
        reciterId,
        playbackRate,
        currentTime,
        duration,
        repeatMode,
        autoScroll,
        playAyah,
        pause,
        resume,
        togglePlay,
        nextAyah,
        previousAyah,
        seek,
        setReciter,
        setSpeed,
        setRepeat: setRepeatMode,
        setAutoScroll
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return ctx;
}
