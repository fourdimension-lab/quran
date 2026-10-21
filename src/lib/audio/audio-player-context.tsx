'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { RECITERS_DATA, getAyahAudioUrl, getAyahAudioFallbacks, getFullSurahAudioUrl } from '../quran-data/reciters';
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
  playSurah: (surah: number, startAyah?: number) => void;
  setSurah: (surah: number) => void;
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
  const preloadAudioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackUrlsRef = useRef<string[]>([]);
  const fallbackIndexRef = useRef(0);

  // Synchronous state reference to prevent stale closures in event listeners
  const stateRef = useRef({
    isPlaying: false,
    currentSurah: 1,
    currentAyah: 1,
    reciterId: 'mishary-alafasy',
    playbackRate: 1,
    repeatMode: 'none' as 'none' | 'single' | 'surah',
    autoScroll: true
  });

  // Keep stateRef in sync with React state updates
  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
    stateRef.current.currentSurah = currentSurah;
    stateRef.current.currentAyah = currentAyah;
    stateRef.current.reciterId = reciterId;
    stateRef.current.playbackRate = playbackRate;
    stateRef.current.repeatMode = repeatMode;
    stateRef.current.autoScroll = autoScroll;
  }, [isPlaying, currentSurah, currentAyah, reciterId, playbackRate, repeatMode, autoScroll]);

  // Forward ref for track ended handler to avoid stale closures in event listeners
  const handleTrackEndedRef = useRef<(() => void) | null>(null);

  const handleTrackEnded = () => {
    const { currentSurah: activeSurah, currentAyah: activeAyah, repeatMode: activeRepeat } = stateRef.current;

    if (activeRepeat === 'single') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.warn);
      }
      return;
    }

    const surahMeta = getSurahByNumber(activeSurah);
    const maxVerses = surahMeta?.verses_count || 7;

    if (activeAyah < maxVerses) {
      // Seamlessly advance to the NEXT Ayah in the active Surah
      playAyah(activeSurah, activeAyah + 1);
    } else if (activeRepeat === 'surah') {
      // Repeat current Surah from Ayah 1
      playAyah(activeSurah, 1);
    } else if (activeSurah < 114) {
      // Advance to next Surah Ayah 1
      playAyah(activeSurah + 1, 1);
    } else {
      setIsPlaying(false);
      stateRef.current.isPlaying = false;
    }
  };

  handleTrackEndedRef.current = handleTrackEnded;

  const tryNextFallback = () => {
    fallbackIndexRef.current += 1;
    if (fallbackIndexRef.current < fallbackUrlsRef.current.length && audioRef.current) {
      const nextUrl = fallbackUrlsRef.current[fallbackIndexRef.current];
      audioRef.current.src = nextUrl;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          stateRef.current.isPlaying = true;
        })
        .catch(console.warn);
    } else {
      setIsPlaying(false);
      stateRef.current.isPlaying = false;
    }
  };

  const playAyah = (surah: number, ayah: number) => {
    // Immediately mutate ref before any async boundary
    stateRef.current.currentSurah = surah;
    stateRef.current.currentAyah = ayah;

    setCurrentSurah(surah);
    setCurrentAyah(ayah);

    const activeReciter = stateRef.current.reciterId;
    const activeRate = stateRef.current.playbackRate;

    // Retrieve prioritized fast CDN URLs with mirrors
    const urls = getAyahAudioFallbacks(activeReciter, surah, ayah);
    fallbackUrlsRef.current = urls;
    fallbackIndexRef.current = 0;
    const primaryUrl = urls[0];

    if (audioRef.current) {
      audioRef.current.src = primaryUrl;
      audioRef.current.playbackRate = activeRate;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          stateRef.current.isPlaying = true;

          // Preload upcoming Ayah for seamless zero-gap recitation
          const surahMeta = getSurahByNumber(surah);
          const maxVerses = surahMeta?.verses_count || 7;
          if (ayah < maxVerses) {
            const nextUrl = getAyahAudioUrl(activeReciter, surah, ayah + 1);
            if (!preloadAudioRef.current && typeof window !== 'undefined') {
              preloadAudioRef.current = new Audio();
            }
            if (preloadAudioRef.current) {
              preloadAudioRef.current.src = nextUrl;
            }
          }
        })
        .catch((err) => {
          console.warn('Primary audio playback error, trying next mirror:', err);
          tryNextFallback();
        });
    }

    // Scroll into view if enabled
    if (stateRef.current.autoScroll && typeof document !== 'undefined') {
      const el = document.getElementById(`ayah-${surah}-${ayah}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const setSurah = (surah: number) => {
    if (stateRef.current.isPlaying && stateRef.current.currentSurah !== surah) return;
    stateRef.current.currentSurah = surah;
    stateRef.current.currentAyah = 1;
    setCurrentSurah(surah);
    setCurrentAyah(1);
    if (audioRef.current && !stateRef.current.isPlaying) {
      const activeReciter = stateRef.current.reciterId;
      audioRef.current.src = getAyahAudioUrl(activeReciter, surah, 1);
    }
  };

  const playSurah = (surah: number, startAyah = 1) => {
    playAyah(surah, startAyah);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      const audio = audioRef.current;

      audio.onplay = () => {
        setIsPlaying(true);
        stateRef.current.isPlaying = true;
      };
      audio.onpause = () => {
        setIsPlaying(false);
        stateRef.current.isPlaying = false;
      };
      audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
      audio.onloadedmetadata = () => setDuration(audio.duration);
      audio.onended = () => {
        handleTrackEndedRef.current?.();
      };
      audio.onerror = () => {
        tryNextFallback();
      };

      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, []);

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      stateRef.current.isPlaying = false;
    }
  };

  const resume = () => {
    const { currentSurah: s, currentAyah: a, reciterId: r } = stateRef.current;
    const expectedFilename = `${s.toString().padStart(3, '0')}${a.toString().padStart(3, '0')}.mp3`;
    if (audioRef.current && audioRef.current.src && audioRef.current.src.includes(expectedFilename)) {
      audioRef.current.play().catch(() => playAyah(s, a));
      setIsPlaying(true);
      stateRef.current.isPlaying = true;
    } else {
      playAyah(s, a);
    }
  };

  const togglePlay = () => {
    if (stateRef.current.isPlaying || isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const nextAyah = () => {
    const { currentSurah: s, currentAyah: a } = stateRef.current;
    const surahMeta = getSurahByNumber(s);
    const maxVerses = surahMeta?.verses_count || 7;
    if (a < maxVerses) {
      playAyah(s, a + 1);
    } else if (s < 114) {
      playAyah(s + 1, 1);
    }
  };

  const previousAyah = () => {
    const { currentSurah: s, currentAyah: a } = stateRef.current;
    if (a > 1) {
      playAyah(s, a - 1);
    } else if (s > 1) {
      const prevSurahMeta = getSurahByNumber(s - 1);
      playAyah(s - 1, prevSurahMeta?.verses_count || 1);
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
    stateRef.current.reciterId = id;
    if (stateRef.current.isPlaying) {
      const { currentSurah: s, currentAyah: a } = stateRef.current;
      const url = getAyahAudioUrl(id, s, a);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play().catch(console.warn);
      }
    }
  };

  const setSpeed = (rate: number) => {
    setPlaybackRate(rate);
    stateRef.current.playbackRate = rate;
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const setRepeat = (mode: 'none' | 'single' | 'surah') => {
    setRepeatMode(mode);
    stateRef.current.repeatMode = mode;
  };

  const setAutoScrollHandler = (enabled: boolean) => {
    setAutoScroll(enabled);
    stateRef.current.autoScroll = enabled;
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
        playSurah,
        setSurah,
        pause,
        resume,
        togglePlay,
        nextAyah,
        previousAyah,
        seek,
        setReciter,
        setSpeed,
        setRepeat,
        setAutoScroll: setAutoScrollHandler
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
