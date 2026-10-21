'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { 
  Volume2, 
  Play, 
  Pause, 
  BookOpen, 
  Check, 
  Search, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Gauge, 
  User, 
  ArrowRight, 
  Sparkles,
  ChevronRight,
  Filter,
  Flame,
  Layers,
  Compass,
  Radio
} from 'lucide-react';
import { RECITERS_DATA } from '@/lib/quran-data/reciters';
import { SURAHS_DATA, getSurahByNumber } from '@/lib/quran-data/surahs';
import { useAudioPlayer } from '@/lib/audio/audio-player-context';
import { getSurahAyahs } from '@/lib/quran-data/quran-service';
import { useLanguage } from '@/lib/language/language-context';
import { Ayah } from '@/types/quran';
import { AzanPlayerSection } from '@/components/audio/AzanPlayerSection';

// Authentic scholarly Quran word counts for all 114 Surahs
const SURAH_WORD_COUNTS: Record<number, number> = {
  1: 29, 2: 6144, 3: 3503, 4: 3745, 5: 2842, 6: 3055, 7: 3344, 8: 1243, 9: 2506, 10: 1841,
  11: 1947, 12: 1795, 13: 854, 14: 831, 15: 658, 16: 1844, 17: 1560, 18: 1583, 19: 972, 20: 1354,
  21: 1174, 22: 1282, 23: 1055, 24: 1317, 25: 896, 26: 1322, 27: 1160, 28: 1441, 29: 981, 30: 819,
  31: 548, 32: 374, 33: 1303, 34: 884, 35: 780, 36: 733, 37: 865, 38: 736, 39: 1177, 40: 1228,
  41: 796, 42: 860, 43: 836, 44: 346, 45: 488, 46: 646, 47: 542, 48: 560, 49: 353, 50: 373,
  51: 360, 52: 312, 53: 360, 54: 342, 55: 352, 56: 379, 57: 576, 58: 475, 59: 447, 60: 352,
  61: 226, 62: 177, 63: 180, 64: 242, 65: 279, 66: 254, 67: 333, 68: 301, 69: 261, 70: 217,
  71: 227, 72: 286, 73: 200, 74: 256, 75: 164, 76: 243, 77: 181, 78: 174, 79: 179, 80: 133,
  81: 104, 82: 81, 83: 169, 84: 108, 85: 109, 86: 61, 87: 72, 88: 92, 89: 139, 90: 82,
  91: 54, 92: 71, 93: 40, 94: 27, 95: 34, 96: 72, 97: 30, 98: 94, 99: 36, 100: 40,
  101: 36, 102: 28, 103: 14, 104: 33, 105: 23, 106: 17, 107: 25, 108: 10, 109: 27, 110: 19,
  111: 23, 112: 15, 113: 23, 114: 20
};

export default function ListenPage() {
  const { language, t } = useLanguage();
  const { 
    isPlaying, 
    currentSurah, 
    currentAyah, 
    reciterId, 
    playbackRate, 
    repeatMode,
    playAyah, 
    pause, 
    nextAyah,
    previousAyah,
    setReciter,
    setSpeed,
    setRepeat
  } = useAudioPlayer();

  // Active Surah being viewed / managed in the featured player
  const [selectedSurahNum, setSelectedSurahNum] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'meccan' | 'medinan' | 'juz30'>('all');
  
  // Custom jump-to-ayah input state
  const [jumpAyahInput, setJumpAyahInput] = useState('');
  
  // Cache of Ayahs for active Surah to show authentic Arabic snippet in the jumper
  const [activeSurahAyahs, setActiveSurahAyahs] = useState<Ayah[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState(false);

  const activeSurahMeta = useMemo(() => {
    return getSurahByNumber(selectedSurahNum) || SURAHS_DATA[0];
  }, [selectedSurahNum]);

  const activeReciter = useMemo(() => {
    return RECITERS_DATA.find((r) => r.id === reciterId) || RECITERS_DATA[0];
  }, [reciterId]);

  // Reciter short label (e.g. "Alafasy", "Sudais", "Ghamadi")
  const reciterShortName = useMemo(() => {
    const parts = activeReciter.name.split(' ');
    return parts[parts.length - 1] || 'Alafasy';
  }, [activeReciter]);

  // When playing state changes to another Surah, sync selectedSurahNum
  useEffect(() => {
    if (isPlaying && currentSurah !== selectedSurahNum) {
      setSelectedSurahNum(currentSurah);
    }
  }, [isPlaying, currentSurah, selectedSurahNum]);

  // Load Ayahs for selected Surah to power the Arabic Ayah preview
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingAyahs(true);
    getSurahAyahs(selectedSurahNum)
      .then((data) => {
        if (!isCancelled) {
          setActiveSurahAyahs(data);
        }
      })
      .catch((err) => {
        console.warn('Failed loading surah ayahs:', err);
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoadingAyahs(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedSurahNum]);

  // Get current Ayah Arabic text for the jumper banner
  const currentAyahObj = useMemo(() => {
    const targetAyahNum = (currentSurah === selectedSurahNum) ? currentAyah : 1;
    return activeSurahAyahs.find((a) => a.ayah_number === targetAyahNum);
  }, [activeSurahAyahs, currentSurah, currentAyah, selectedSurahNum]);

  // Filter Surahs based on tab and search
  const filteredSurahs = useMemo(() => {
    return SURAHS_DATA.filter((s) => {
      // Tab filter
      if (activeTab === 'popular') {
        const pop = [1, 2, 18, 36, 55, 56, 67, 112, 113, 114];
        if (!pop.includes(s.number)) return false;
      } else if (activeTab === 'meccan') {
        if (s.revelation_place !== 'Meccan') return false;
      } else if (activeTab === 'medinan') {
        if (s.revelation_place !== 'Medinan') return false;
      } else if (activeTab === 'juz30') {
        if (s.number < 78) return false;
      }

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        s.number.toString().includes(q) ||
        s.name_en.toLowerCase().includes(q) ||
        s.name_ar.includes(q) ||
        s.name_bn.toLowerCase().includes(q) ||
        s.translation_en.toLowerCase().includes(q) ||
        s.translation_bn.toLowerCase().includes(q)
      );
    });
  }, [activeTab, searchQuery]);

  // Handle Play Full Recitation toggle
  const handlePlaySurahToggle = (surahNumber: number) => {
    setSelectedSurahNum(surahNumber);
    if (isPlaying && currentSurah === surahNumber) {
      pause();
    } else {
      playAyah(surahNumber, 1);
    }
  };

  // Handle direct Ayah jump
  const handleJumpToAyah = (ayahNum: number) => {
    const max = activeSurahMeta.verses_count;
    const clamped = Math.max(1, Math.min(ayahNum, max));
    playAyah(selectedSurahNum, clamped);
  };

  const handleCustomJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(jumpAyahInput.trim(), 10);
    if (!isNaN(num)) {
      handleJumpToAyah(num);
      setJumpAyahInput('');
    }
  };

  const handleSpeedCycle = () => {
    if (playbackRate === 1) setSpeed(1.25);
    else if (playbackRate === 1.25) setSpeed(1.5);
    else if (playbackRate === 1.5) setSpeed(0.75);
    else setSpeed(1);
  };

  const handleRepeatCycle = () => {
    if (repeatMode === 'none') setRepeat('single');
    else if (repeatMode === 'single') setRepeat('surah');
    else setRepeat('none');
  };

  const isCurrentSurahActive = isPlaying && currentSurah === selectedSurahNum;

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 transition-colors">
      
      {/* Top Ambient Glow Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-[#072418] to-[var(--background)] pt-8 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/40 font-bangla">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-4 text-center relative z-10">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold tracking-wider uppercase shadow-xs">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('পবিত্র কুরআন তিলাওয়াত ও অডিও স্টুডিও', 'High-Fidelity Quran Recitation Studio')}</span>
            </div>

            <a
              href="#azan"
              onClick={(e) => {
                const el = document.getElementById('azan');
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold transition-all shadow-xs"
            >
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{t('আযান সমগ্র ♫', 'Azan Collection ♫')}</span>
            </a>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {t('কুরআন শুনুন ও যেকোনো আয়াতে সরাসরি জাম্প করুন', 'Listen & Jump to Any Ayah')}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-200/80 max-w-2xl mx-auto leading-relaxed">
            {t(
              'বিশ্ববিখ্যাত ক্বারীগণের কণ্ঠে বিশুদ্ধ তিলাওয়াত শুনুন এবং যেকোনো আয়াতে সরাসরি ক্লিক করে সাথে সাথে তিলাওয়াত শুরু করুন।',
              'Experience verified, crystal-clear recitation of the Holy Quran from world-renowned Qurra. Jump instantly to any verse with word-level precision.'
            )}
          </p>

          {/* Quick Reciter Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider mr-1">
              {t('নির্বাচিত ক্বারী:', 'Active Qari:')}
            </span>
            {RECITERS_DATA.map((r) => {
              const isSelected = r.id === reciterId;
              return (
                <button
                  key={r.id}
                  onClick={() => setReciter(r.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                  }`}
                >
                  <span>{language === 'bn' ? (r.name_bn || r.name.split(' ')[0]) : r.name.split(' ')[0]}</span>
                  <span className="font-arabic opacity-80 text-[11px]">{r.name_ar}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 space-y-12">
        
        {/* ============================================================== */}
        {/* FEATURED PLAYER & AYAH JUMPER SECTION                         */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: THE SIGNATURE SURAH CARD (Matches orca-paste-1792493944918-d3a4596d-f42e-4c9e-87c7-2f801e69b125.png) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md rounded-[32px] border border-stone-200/90 dark:border-white/10 bg-white dark:bg-[#0f1f17] shadow-xl p-6 sm:p-8 text-center space-y-5 transition-all">
              
              {/* Emblem with Gold Calligraphy and Green Verified Tick */}
              <div className="relative mx-auto w-24 h-24">
                <div className="w-24 h-24 rounded-full bg-gradient-to-b from-[#064e3b] via-[#043d2e] to-[#022c22] border-[2.5px] border-amber-400 flex items-center justify-center shadow-lg">
                  <span className="font-arabic text-4xl font-bold text-amber-300 drop-shadow-md select-none">
                    قرآن
                  </span>
                </div>
                {/* Verified Green Tick Badge */}
                <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0f1f17] flex items-center justify-center text-white shadow-xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              {/* Surah Title (English bold + Arabic amber) */}
              <div className="space-y-1 font-bangla">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {language === 'bn' ? `সূরা ${activeSurahMeta.name_bn}` : `Surah ${activeSurahMeta.name_en}`}
                  </h2>
                  <span className="font-arabic text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">
                    {activeSurahMeta.name_ar}
                  </span>
                </div>
                
                {/* Subtitle: 7 Verses • 29 Words • Makki Chapter */}
                <div className="text-xs sm:text-sm font-semibold text-stone-500 dark:text-stone-400 tracking-wide">
                  {activeSurahMeta.verses_count} {language === 'bn' ? 'আয়াত' : 'Verses'} • {SURAH_WORD_COUNTS[activeSurahMeta.number] || Math.round(activeSurahMeta.verses_count * 13)} {language === 'bn' ? 'শব্দ' : 'Words'} • {activeSurahMeta.revelation_place === 'Meccan' ? (language === 'bn' ? 'মাক্কী সূরা' : 'Makki Chapter') : (language === 'bn' ? 'মাদানী সূরা' : 'Madani Chapter')}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-sm mx-auto font-medium font-bangla">
                {language === 'bn' 
                  ? (activeSurahMeta.description_bn || activeSurahMeta.translation_bn)
                  : (activeSurahMeta.description_en || activeSurahMeta.translation_en)}
              </p>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2 font-bangla">
                {/* Button 1: Read Surah */}
                <Link
                  href={`/read/${activeSurahMeta.number}`}
                  className="w-full py-3.5 px-6 rounded-full bg-[#f4efe6] hover:bg-[#ede5d8] dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs group"
                >
                  <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>{t(`সূরা ${activeSurahMeta.name_bn} পড়ুন`, `Read Surah ${activeSurahMeta.name_en}`)}</span>
                </Link>

                {/* Button 2: Play Full Recitation */}
                <button
                  onClick={() => handlePlaySurahToggle(activeSurahMeta.number)}
                  className={`w-full py-3.5 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer ${
                    isCurrentSurahActive
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/25 ring-2 ring-amber-400'
                      : 'bg-[#047857] hover:bg-[#065f46] text-white shadow-emerald-700/25'
                  }`}
                >
                  {isCurrentSurahActive ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>{t('তিলাওয়াত স্থগিত করুন', 'Pause Recitation')}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-amber-300 text-amber-300" />
                      <span>{t(`সম্পূর্ণ তিলাওয়াত শুনুন (${reciterShortName})`, `Play Full Recitation (${reciterShortName})`)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Indicator */}
              {isCurrentSurahActive && (
                <div className="pt-1 flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 animate-pulse font-bangla">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{t(`বর্তমানে ${currentAyah} নম্বর আয়াত তিলাওয়াত হচ্ছে (মোট ${activeSurahMeta.verses_count})`, `Currently Reciting Verse ${currentAyah} of ${activeSurahMeta.verses_count}`)}</span>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT: THE INTERACTIVE AYAH JUMPER & RECITATION CONTROLS */}
          {/* Matches orca-paste-1792493981091-f2d0de73-7d5e-48af-bf18-f2af85ea2a5f.png */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* The Amber Ayah Pill / Active Verse Card */}
            <div className="p-5 sm:p-6 rounded-3xl border border-stone-200/90 dark:border-white/10 bg-white dark:bg-[#0f1f17] shadow-xl space-y-5 font-bangla">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-[var(--foreground)]">
                      {t('তাত্ক্ষণিক আয়াত জাম্পার', 'Instant Ayah Jumper')}
                    </h3>
                    <p className="text-[11px] text-[var(--muted-foreground)]">
                      {t('নিচের যেকোনো আয়াত নম্বরে ক্লিক করুন বা নম্বর লিখে সরাসরি জাম্প করুন', 'Click any verse number below or enter an Ayah number to jump audio immediately')}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                  {t(`মোট ${activeSurahMeta.verses_count} আয়াত`, `Total ${activeSurahMeta.verses_count} Ayahs`)}
                </span>
              </div>

              {/* EXACT BANNER FROM SCREENSHOT: VERSE 1:1 WITH ARABIC TEXT */}
              <div className="bg-amber-400 dark:bg-amber-500 text-slate-950 p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-4 shadow-md transition-all">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-950">
                      {t('আয়াত', 'VERSE')} {selectedSurahNum}:{(currentSurah === selectedSurahNum && isPlaying) ? currentAyah : (currentAyahObj?.ayah_number || 1)}
                    </div>
                    <div className="font-arabic text-base sm:text-xl font-bold text-slate-950 truncate" dir="rtl">
                      {currentAyahObj?.text_ar || (selectedSurahNum === 1 ? 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ' : `Surah ${activeSurahMeta.name_en}`)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const targetAyah = (currentSurah === selectedSurahNum && isPlaying) ? currentAyah : 1;
                    if (isPlaying && currentSurah === selectedSurahNum) {
                      pause();
                    } else {
                      playAyah(selectedSurahNum, targetAyah);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer shrink-0 font-bangla"
                  title="Play / Pause this Ayah"
                >
                  {isCurrentSurahActive ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>{t('বিরতি', 'Pause')}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-amber-400" />
                      <span>{t('শুনুন', 'Play')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct Jump Search Input */}
              <form onSubmit={handleCustomJumpSubmit} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <input
                    type="number"
                    min={1}
                    max={activeSurahMeta.verses_count}
                    value={jumpAyahInput}
                    onChange={(e) => setJumpAyahInput(e.target.value)}
                    placeholder={t(`আয়াত নম্বরে জাম্প করুন (১ - ${activeSurahMeta.verses_count})...`, `Jump to Ayah (1 - ${activeSurahMeta.verses_count})...`)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none focus:border-amber-500 transition-colors font-bangla"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!jumpAyahInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer font-bangla"
                >
                  {t('জাম্প', 'Jump')}
                </button>
              </form>

              {/* Ayah Navigation Grid (Direct 1-Click Jump to Any Ayah) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[var(--muted-foreground)] font-bangla">
                  <span>{t('তিলাওয়াত করতে আয়াত নম্বর নির্বাচন করুন:', 'SELECT VERSE TO PLAY:')}</span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      onClick={previousAyah}
                      className="px-2 py-1 rounded-md bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground)] flex items-center gap-1"
                    >
                      <SkipBack className="w-3 h-3" />
                      <span>{t('পূর্ববর্তী', 'Prev')}</span>
                    </button>
                    <button
                      onClick={nextAyah}
                      className="px-2 py-1 rounded-md bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground)] flex items-center gap-1"
                    >
                      <span>{t('পরবর্তী', 'Next')}</span>
                      <SkipForward className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Grid of Ayah Numbers */}
                <div className="max-h-56 overflow-y-auto p-2 rounded-2xl bg-[var(--muted)]/40 border border-[var(--border)] grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {Array.from({ length: activeSurahMeta.verses_count }, (_, i) => i + 1).map((num) => {
                    const isPlayingThisAyah = isCurrentSurahActive && currentAyah === num;
                    return (
                      <button
                        key={num}
                        onClick={() => handleJumpToAyah(num)}
                        className={`h-10 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                          isPlayingThisAyah
                            ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300 font-black scale-105'
                            : 'bg-white dark:bg-[#13251c] hover:bg-amber-100 dark:hover:bg-amber-950/40 text-[var(--foreground)] border border-[var(--border)] hover:border-amber-400'
                        }`}
                        title={`Jump and play Surah ${selectedSurahNum}, Ayah ${num}`}
                      >
                        <span>{num}</span>
                        {isPlayingThisAyah && (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Playback Settings Controls: Speed & Repeat */}
              <div className="pt-2 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-xs font-bangla">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[var(--muted-foreground)]">{t('গতি:', 'SPEED:')}</span>
                  <button
                    onClick={handleSpeedCycle}
                    className="px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] font-mono font-bold text-xs flex items-center gap-1"
                  >
                    <Gauge className="w-3.5 h-3.5 text-amber-500" />
                    <span>{playbackRate}x</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[var(--muted-foreground)]">{t('পুনরাবৃত্তি:', 'REPEAT:')}</span>
                  <button
                    onClick={handleRepeatCycle}
                    className={`px-3 py-1 rounded-lg border text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      repeatMode !== 'none'
                        ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-800 dark:text-amber-300'
                        : 'border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-[var(--foreground)]'
                    }`}
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span>
                      {repeatMode === 'none' 
                        ? t('বন্ধ', 'Off') 
                        : repeatMode === 'single' 
                          ? t('আয়াত রিপিট', 'Repeat Ayah') 
                          : t('সূরা রিপিট', 'Repeat Surah')}
                    </span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ============================================================== */}
        {/* ALL 114 SURAHS DIRECTORY IN THE EXACT CARD STYLE               */}
        {/* ============================================================== */}
        <div className="space-y-6 pt-6 font-bangla">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
                {t('সকল ১১৪ সূরার তালিকা', 'All 114 Surahs Directory')}
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                {t('যেকোনো সূরা নির্বাচন করে তিলাওয়াত শুনুন বা নির্দিষ্ট আয়াতে জাম্প করুন।', 'Select any Surah to play its recitation or jump directly into any of its verses.')}
              </p>
            </div>

            {/* Search Input for Surahs */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('সূরার নাম বা নম্বর দিয়ে খুঁজুন...', 'Search Surah name or number...')}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none focus:border-emerald-500 transition-colors shadow-2xs font-bangla"
              />
            </div>
          </div>

          {/* Filter Categories Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
            {[
              { id: 'all', label: t('সকল ১১৪ সূরা', 'All 114 Surahs') },
              { id: 'popular', label: t('জনপ্রিয় সূরাসমূহ', 'Popular Chapters') },
              { id: 'meccan', label: t('মাক্কী সূরা (৮৬)', 'Makki (86)') },
              { id: 'medinan', label: t('মাদানী সূরা (২৮)', 'Madani (28)') },
              { id: 'juz30', label: t('আমপারা (৩০ পারা)', 'Juz Amma (30)') }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full transition-all shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-[var(--muted)]/60 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Grid of Surah Cards (Every Surah formatted like the reference image) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSurahs.map((surah) => {
              const isPlayingThis = isPlaying && currentSurah === surah.number;
              const isSelected = selectedSurahNum === surah.number;

              return (
                <div
                  key={surah.number}
                  className={`rounded-[28px] border transition-all duration-200 bg-white dark:bg-[#0f1f17] p-6 text-center space-y-4 flex flex-col justify-between group ${
                    isPlayingThis
                      ? 'border-amber-400 dark:border-amber-500 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/30'
                      : isSelected
                        ? 'border-emerald-500/70 shadow-lg'
                        : 'border-stone-200/90 dark:border-white/10 hover:border-emerald-500/50 hover:shadow-md'
                  }`}
                >
                  
                  {/* Top Emblem & Verified Checkmark */}
                  <div className="space-y-3">
                    <div className="relative mx-auto w-18 h-18">
                      <div className="w-18 h-18 rounded-full bg-gradient-to-b from-[#064e3b] via-[#043d2e] to-[#022c22] border-2 border-amber-400 flex items-center justify-center shadow-md">
                        <span className="font-arabic text-2xl font-bold text-amber-300 drop-shadow-xs select-none">
                          قرآن
                        </span>
                      </div>
                      {/* Verified Badge */}
                      <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0f1f17] flex items-center justify-center text-white shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>

                    {/* Surah Title */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                          {language === 'bn' ? `সূরা ${surah.name_bn}` : `Surah ${surah.name_en}`}
                        </h3>
                        <span className="font-arabic text-xl font-bold text-amber-600 dark:text-amber-400">
                          {surah.name_ar}
                        </span>
                      </div>

                      {/* Subtitle */}
                      <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                        {surah.verses_count} {language === 'bn' ? 'আয়াত' : 'Verses'} • {SURAH_WORD_COUNTS[surah.number] || Math.round(surah.verses_count * 13)} {language === 'bn' ? 'শব্দ' : 'Words'} • {surah.revelation_place === 'Meccan' ? (language === 'bn' ? 'মাক্কী' : 'Makki') : (language === 'bn' ? 'মাদানী' : 'Madani')}
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                      {language === 'bn' 
                        ? (surah.description_bn || surah.translation_bn) 
                        : (surah.description_en || surah.translation_en)}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-2.5 pt-2">
                    {/* Read Surah Button */}
                    <Link
                      href={`/read/${surah.number}`}
                      className="w-full py-2.5 px-4 rounded-full bg-[#f4efe6] hover:bg-[#ede5d8] dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                      <span>{t('সূরা পড়ুন', 'Read Surah')} {language === 'bn' ? surah.name_bn : surah.name_en}</span>
                    </Link>

                    {/* Play Recitation Button */}
                    <button
                      onClick={() => handlePlaySurahToggle(surah.number)}
                      className={`w-full py-2.5 px-4 rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                        isPlayingThis
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/25 ring-2 ring-amber-400'
                          : 'bg-[#047857] hover:bg-[#065f46] text-white'
                      }`}
                    >
                      {isPlayingThis ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>{t('বিরতি দিন', 'Pause Recitation')}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                          <span>{t('সম্পূর্ণ তিলাওয়াত শুনুন', 'Play Full Recitation')} ({reciterShortName})</span>
                        </>
                      )}
                    </button>

                    {/* Jump to Ayah Button */}
                    <button
                      onClick={() => {
                        setSelectedSurahNum(surah.number);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full text-center text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline pt-1 cursor-pointer"
                    >
                      {t('এই সূরার নির্দিষ্ট আয়াতে জাম্প করুন →', 'Jump to specific Ayah in this Surah →')}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {filteredSurahs.length === 0 && (
            <div className="py-16 text-center space-y-3">
              <Search className="w-8 h-8 text-[var(--muted-foreground)] mx-auto opacity-50" />
              <div className="text-base font-bold text-[var(--foreground)]">{t('কোনো সূরা খুঁজে পাওয়া যায়নি', 'No Surahs found')}</div>
              <p className="text-xs text-[var(--muted-foreground)]">
                {t('অন্য কোনো নাম বা নম্বর দিয়ে পুনরায় অনুসন্ধান করুন।', 'Try searching with a different Surah name, number, or keyword.')}
              </p>
            </div>
          )}

        </div>

      </div>

      {/* ============================================================== */}
      {/* ICONIC AZAN COLLECTION SECTION                                 */}
      {/* ============================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <AzanPlayerSection />
      </div>

    </div>
  );
}