'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Compass, 
  Sparkles, 
  Headphones, 
  Radio, 
  Award, 
  Music,
  CheckCircle,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from '@/lib/language/language-context';
import { useAudioPlayer } from '@/lib/audio/audio-player-context';

export interface AzanTrack {
  id: string;
  title_bn: string;
  title_en: string;
  artist_bn: string;
  artist_en: string;
  location_bn: string;
  location_en: string;
  audioUrl: string;
  duration: string;
  isFeatured?: boolean;
  description_bn: string;
  description_en: string;
  tag_bn: string;
  tag_en: string;
}

export const AZAN_COLLECTION: AzanTrack[] = [
  {
    id: 'qari-obaidullah',
    title_bn: 'বাংলাদেশ টেলিভিশন ও বেতারের ঐতিহ্যবাহী আযান',
    title_en: 'Iconic BTV & Bangladesh Betar Azan',
    artist_bn: 'ক্বারী মুহাম্মদ ওবায়দুল্লাহ (রহ.)',
    artist_en: 'Qari Muhammad Obaidullah (Rah.)',
    location_bn: 'বাংলাদেশ টেলিভিশন ও বাংলাদেশ বেতার',
    location_en: 'Bangladesh Television & Bangladesh Betar',
    audioUrl: '/audio/azan-obaidullah.mp3',
    duration: '03:12',
    isFeatured: true,
    description_bn: 'বাংলাদেশ টেলিভিশন ও বাংলাদেশ বেতারে সুদীর্ঘ চার দশক ধরে সম্প্রচারিত কালজয়ী সুমধুর আযান যা কোটি বাঙালির হৃদয়ে অমর হয়ে আছে।',
    description_en: 'The legendary and beloved Azan broadcast for over four decades on Bangladesh Television and Bangladesh Betar.',
    tag_bn: 'জাতীয় ঐতিহ্য • স্পেশাল',
    tag_en: 'National Legacy • Featured'
  },
  {
    id: 'makkah',
    title_bn: 'মসজিদুল হারাম, মক্কা মুকাররমা',
    title_en: 'Masjid al-Haram, Makkah',
    artist_bn: 'শায়খ আলী আহমদ মোল্লা (মক্কার বিলাল)',
    artist_en: 'Sheikh Ali Ahmed Mulla (Bilal of Makkah)',
    location_bn: 'পবিত্র কাবা প্রাঙ্গণ, মক্কা মুকাররমা',
    location_en: 'Holy Kaaba, Makkah Al-Mukarramah',
    audioUrl: '/audio/azan-makkah.mp3',
    duration: '02:47',
    isFeatured: false,
    description_bn: 'মক্কার কাবা চত্বরে চার দশক ধরে প্রতিধ্বনিত বিশ্ববিখ্যাত গমগমে ও ভরাট কণ্ঠের ঐতিহাসিক আযান।',
    description_en: 'The world-renowned, iconic voice reverberating across the Holy Kaaba for over 40 years.',
    tag_bn: 'মক্কা শরীফ',
    tag_en: 'Holy Makkah'
  },
  {
    id: 'madinah',
    title_bn: 'মসজিদে নববী, মদীনা মুনাওয়ারা',
    title_en: 'Al-Masjid an-Nabawi, Madinah',
    artist_bn: 'শায়খ এসাম বুখারী',
    artist_en: 'Sheikh Essam Bukhari',
    location_bn: 'রওজা শরীফ প্রাঙ্গণ, মদীনা মুনাওয়ারা',
    location_en: 'Prophet’s Mosque, Madinah',
    audioUrl: '/audio/azan-madinah.mp3',
    duration: '02:19',
    isFeatured: false,
    description_bn: 'নবী করীম (সা.)-এর পবিত্র রওজা মোবারকের সান্নিধ্যে উচ্চারিত অত্যন্ত বিনম্র, সুমিষ্ট ও শান্ত সুরের আযান।',
    description_en: 'The serene, gentle, and deeply reverent call echoing through the Prophet’s Mosque.',
    tag_bn: 'মদীনা শরীফ',
    tag_en: 'Holy Madinah'
  },
  {
    id: 'alaqsa',
    title_bn: 'পবিত্র মসজিদুল আকসা',
    title_en: 'Al-Aqsa Mosque',
    artist_bn: 'শায়খ নাজী কাযযায',
    artist_en: 'Sheikh Naji Qazzaz',
    location_bn: 'বাইতুল মুকাদ্দাস, জেরুজালেম',
    location_en: 'Baitul Muqaddas, Jerusalem',
    audioUrl: '/audio/azan-alaqsa.mp3',
    duration: '04:05',
    isFeatured: false,
    description_bn: 'মুসলমানদের প্রথম কিবলা পবিত্র মসজিদুল আকসার আকাশ ছুঁয়ে যাওয়া অনন্য হৃদয়স্পর্শী ঐতিহাসিক আযান।',
    description_en: 'The historic and emotive call echoing over the first Qibla of Islam.',
    tag_bn: 'প্রথম কিবলা',
    tag_en: 'First Qibla'
  },
  {
    id: 'fajr',
    title_bn: 'ফজরের সুমধুর আযান',
    title_en: 'Fajr Adhan (Dawn Prayer)',
    artist_bn: 'ক্বারী আব্দুল বাসিত সুরধারা',
    artist_en: 'Qari Abdul Basit Style',
    location_bn: 'الصلاة خير من النوم সংযোজনসহ',
    location_en: 'With As-Salatu Khayrum Minan-Nawm',
    audioUrl: '/audio/azan-fajr.mp3',
    duration: '02:28',
    isFeatured: false,
    description_bn: 'ভোরের স্নিগ্ধ নির্মল পরিবেশে "ঘুম থেকে সালাত উত্তম" ঘোষণার অত্যন্ত মর্মস্পর্শী আবহ।',
    description_en: 'The serene dawn call reminding believers: "Prayer is better than sleep".',
    tag_bn: 'ফজর স্পেশাল',
    tag_en: 'Fajr Special'
  },
  {
    id: 'egypt',
    title_bn: 'ঐতিহ্যবাহী কায়রো আযান',
    title_en: 'Historic Cairo Azan',
    artist_bn: 'মিশরীয় ক্লাসিক্যাল সুর',
    artist_en: 'Classical Egyptian Maqam',
    location_bn: 'আল-আজহার ও কায়রো, মিশর',
    location_en: 'Al-Azhar & Historic Cairo, Egypt',
    audioUrl: '/audio/azan-egypt.mp3',
    duration: '02:35',
    isFeatured: false,
    description_bn: 'ঐতিহাসিক আল-আজহার ও প্রাচীন মিশরের শতবর্ষী মাক্বামভিত্তিক সুরেলা আযান।',
    description_en: 'The classical melodic tradition of centuries-old historic Cairo and Al-Azhar.',
    tag_bn: 'মিশরীয় মাক্বাম',
    tag_en: 'Egyptian Maqam'
  },
  {
    id: 'turkey',
    title_bn: 'ইস্তাম্বুল অটোমান আযান',
    title_en: 'Ottoman Istanbul Azan',
    artist_bn: 'সুলতান আহমেদ মসজিদ (ব্লু মস্ক)',
    artist_en: 'Sultan Ahmed Mosque (Blue Mosque)',
    location_bn: 'ইস্তাম্বুল, তুরস্ক',
    location_en: 'Istanbul, Turkey',
    audioUrl: '/audio/azan-turkey.mp3',
    duration: '02:41',
    isFeatured: false,
    description_bn: 'অটোমান ঐতিহ্যবাহী সেগাহ ও হিজায সুরধারায় গাওয়া অপরূপ মেলোডিয়াস আযান।',
    description_en: 'Distinctive Ottoman architectural acoustic melody in traditional Segah & Hijaz maqamat.',
    tag_bn: 'অটোমান সুর',
    tag_en: 'Ottoman Style'
  }
];

export function AzanPlayerSection() {
  const { language, t } = useLanguage();
  const { isPlaying: isAyahPlaying, pause: pauseAyah } = useAudioPlayer();

  const [activeTrack, setActiveTrack] = useState<AzanTrack>(AZAN_COLLECTION[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showAzanDua, setShowAzanDua] = useState(false);
  const [showWords, setShowWords] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    audio.src = activeTrack.audioUrl;

    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.onloadedmetadata = () => setDuration(audio.duration);
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const handleSelectTrack = (track: AzanTrack, autoPlay = true) => {
    if (activeTrack.id === track.id && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        if (isAyahPlaying) pauseAyah();
        audioRef.current.play().catch(console.warn);
      }
      return;
    }

    setActiveTrack(track);
    if (audioRef.current) {
      if (isAyahPlaying) pauseAyah();
      audioRef.current.src = track.audioUrl;
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (autoPlay) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(console.warn);
      }
    }
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (isAyahPlaying) pauseAyah();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.warn);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const handleToggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        if (isAyahPlaying) pauseAyah();
        audioRef.current.play().then(() => setIsPlaying(true)).catch(console.warn);
      }
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section id="azan" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 w-full max-w-full overflow-hidden">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-amber-600" />
            <span>{t('ঐতিহ্যবাহী আযান সমগ্র', 'World-Renowned Azan Collection')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--foreground)] tracking-tight">
            {t('ক্বারী মুহাম্মদ ওবায়দুল্লাহ ও বিশ্ববিখ্যাত ক্বারীদের আযান', 'Azan of Qari Obaidullah & Renowned Muaddhins')}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] font-bangla">
            {t(
              'বাংলাদেশ টেলিভিশন ও বেতারের চিরস্মরণীয় আযান এবং মক্কা, মদীনা ও আল-আকসার সুমধুর ধ্বনি এক ক্লিকেই শুনুন।',
              'Listen to the iconic Azan of Bangladesh Television & Radio along with sacred recitations from Makkah, Madinah, and Al-Aqsa.'
            )}
          </p>
        </div>

        {/* Buttons for Azan Du'a & Word Meaning */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowWords(!showWords)}
            className="px-3 py-1.5 rounded-full border border-emerald-300/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/40 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('আযানের শব্দার্থ', 'Azan Words')}</span>
            {showWords ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          
          <button
            onClick={() => setShowAzanDua(!showAzanDua)}
            className="px-3 py-1.5 rounded-full border border-amber-300/80 dark:border-amber-800 text-amber-900 dark:text-amber-200 bg-amber-50/70 dark:bg-amber-950/40 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('আযানের পরের দোয়া', 'Du’a After Azan')}</span>
            {showAzanDua ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Azan Words Box */}
      {showWords && (
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-emerald-50/60 dark:bg-[#0c1c14] border border-emerald-300/70 dark:border-emerald-800/60 space-y-3 animate-in fade-in duration-200 text-xs">
          <div className="font-bold text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>{t('পবিত্র আযানের বাণী ও বাংলা অর্থ', 'Phrases of Azan & Meaning')}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-white/80 dark:bg-black/20 border border-emerald-200/60 dark:border-emerald-900/40 flex flex-wrap items-center justify-between gap-2">
              <span className="font-bangla text-emerald-950 dark:text-emerald-100">১. আল্লাহ সর্বশ্রেষ্ঠ (৪ বার)</span>
              <span className="font-arabic text-base font-bold text-emerald-700 dark:text-emerald-300" dir="rtl">اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ</span>
            </div>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-black/20 border border-emerald-200/60 dark:border-emerald-900/40 flex flex-wrap items-center justify-between gap-2">
              <span className="font-bangla text-emerald-950 dark:text-emerald-100">২. সাক্ষ্য দিচ্ছি আল্লাহ ছাড়া কোনো সত্য উপাস্য নেই (২ বার)</span>
              <span className="font-arabic text-base font-bold text-emerald-700 dark:text-emerald-300" dir="rtl">أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ</span>
            </div>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-black/20 border border-emerald-200/60 dark:border-emerald-900/40 flex flex-wrap items-center justify-between gap-2">
              <span className="font-bangla text-emerald-950 dark:text-emerald-100">৩. সাক্ষ্য দিচ্ছি মুহাম্মদ (সা.) আল্লাহর রাসূল (২ বার)</span>
              <span className="font-arabic text-base font-bold text-emerald-700 dark:text-emerald-300" dir="rtl">أَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ</span>
            </div>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-black/20 border border-emerald-200/60 dark:border-emerald-900/40 flex flex-wrap items-center justify-between gap-2">
              <span className="font-bangla text-emerald-950 dark:text-emerald-100">৪. সালাতের দিকে এসো (২ বার)</span>
              <span className="font-arabic text-base font-bold text-emerald-700 dark:text-emerald-300" dir="rtl">حَيَّ عَلَى الصَّلَاةِ</span>
            </div>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-black/20 border border-emerald-200/60 dark:border-emerald-900/40 flex flex-wrap items-center justify-between gap-2">
              <span className="font-bangla text-emerald-950 dark:text-emerald-100">৫. কল্যাণের দিকে এসো (২ বার)</span>
              <span className="font-arabic text-base font-bold text-emerald-700 dark:text-emerald-300" dir="rtl">حَيَّ عَلَى الْفَلَاحِ</span>
            </div>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-black/20 border border-emerald-200/60 dark:border-emerald-900/40 flex flex-wrap items-center justify-between gap-2">
              <span className="font-bangla text-emerald-950 dark:text-emerald-100">ফজরে: ঘুমের চেয়ে সালাত উত্তম (২ বার)</span>
              <span className="font-arabic text-base font-bold text-amber-600 dark:text-amber-400" dir="rtl">الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ</span>
            </div>
          </div>
        </div>
      )}

      {/* Expandable Du'a After Azan Box */}
      {showAzanDua && (
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-amber-50/70 dark:bg-[#1a1409] border border-amber-300/80 dark:border-amber-800/60 space-y-3 animate-in fade-in duration-200 text-xs">
          <div className="font-bold text-sm text-amber-950 dark:text-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{t('আযান সমাপ্তির পরের সুন্নাহ দোয়া ও ফযীলত', 'Du’a After Azan & Virtues')}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold shrink-0">
              সহীহ বুখারী ৪৭১২
            </span>
          </div>

          <p className="font-arabic text-xl sm:text-2xl text-[var(--foreground)] text-right leading-loose py-1 break-words" dir="rtl">
            اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ
          </p>

          <p className="text-xs sm:text-sm text-amber-950/90 dark:text-amber-200/90 leading-relaxed font-bangla">
            <strong>উচ্চারণ:</strong> আল্লাহুম্মা রব্বা হাযিহিদ দাওয়াতিত তাম্মাহ, ওয়াস সালাতিল ক্বা-য়িমাহ, আ-তি মুহাম্মাদানিল ওয়াসীলাতা ওয়াল ফাদীলাহ, ওয়াবআসহু মাক্বামাম মাহমূদানিল্লাযী ওয়াআত্তাহ।
          </p>

          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed font-bangla border-t border-amber-200 dark:border-amber-900/50 pt-2">
            <strong>অর্থ:</strong> হে আল্লাহ! এই পরিপূর্ণ আহ্বান এবং প্রতিষ্ঠিত সালাতের মালিক! আমাদের প্রিয় নবী মুহাম্মদ (সা.)-কে সর্বোত্তম মর্যাদা (ওয়াসীলা) ও বিশেষ সম্মান দান করুন এবং তাঁকে সেই প্রশংসিত স্থানে পৌঁছিয়ে দিন, যার অঙ্গীকার আপনি করেছেন।
          </p>
          <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
            ★ ফযীলত: যে ব্যক্তি আযান শেষে এই দোয়া পাঠ করবে, কিয়ামতের দিন তার জন্য রাসুলুল্লাহ (সা.)-এর শাফায়াত ওয়াজিব হবে।
          </p>
        </div>
      )}

      {/* Main Interactive Audio Player Dashboard */}
      <div className="p-4 sm:p-8 rounded-2xl sm:rounded-[32px] bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-teal-500/10 dark:from-amber-950/30 dark:via-[#0c1813] dark:to-emerald-950/30 border-2 border-amber-400/50 dark:border-amber-600/40 shadow-xl space-y-6 w-full max-w-full overflow-hidden">
        
        {/* Active Track Hero Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="relative shrink-0">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-emerald-600 text-white flex items-center justify-center font-bold shadow-lg shrink-0">
                <Radio className={`w-7 h-7 sm:w-10 sm:h-10 ${isPlaying ? 'animate-bounce text-amber-200' : 'text-white'}`} />
              </div>
              {isPlaying && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-[#0c1813]"></span>
                </span>
              )}
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-extrabold uppercase tracking-wider shrink-0">
                  {language === 'bn' ? activeTrack.tag_bn : activeTrack.tag_en}
                </span>
                <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{activeTrack.duration}</span>
                </span>
              </div>
              
              <h3 className="text-base sm:text-2xl font-black text-[var(--foreground)] tracking-tight break-words">
                {language === 'bn' ? activeTrack.title_bn : activeTrack.title_en}
              </h3>
              
              <div className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span>{language === 'bn' ? activeTrack.artist_bn : activeTrack.artist_en}</span>
                <span className="opacity-40">•</span>
                <span className="text-[var(--muted-foreground)] font-normal truncate">
                  {language === 'bn' ? activeTrack.location_bn : activeTrack.location_en}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Play/Pause Action Button on Active Track */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 self-start sm:self-auto">
            <button
              onClick={handleRestart}
              className="p-2.5 sm:p-3 rounded-full bg-white dark:bg-white/10 hover:bg-stone-100 dark:hover:bg-white/20 border border-[var(--border)] text-[var(--foreground)] transition-colors shadow-xs cursor-pointer"
              title={t('পুনরায় শুরু করুন', 'Restart Track')}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  <span>{t('বিরতি দিন', 'Pause')}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  <span>{t('প্লে করুন', 'Play Azan')}</span>
                </>
              )}
            </button>

            <button
              onClick={handleToggleMute}
              className="p-2.5 sm:p-3 rounded-full bg-white dark:bg-white/10 hover:bg-stone-100 dark:hover:bg-white/20 border border-[var(--border)] text-[var(--foreground)] transition-colors shadow-xs cursor-pointer"
              title={isMuted ? t('শব্দ চালু করুন', 'Unmute') : t('শব্দ বন্ধ করুন', 'Mute')}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Progress Timeline Slider */}
        <div className="space-y-1.5 pt-2">
          <div className="relative w-full">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-600 dark:accent-amber-500"
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-[var(--muted-foreground)]">
            <span>{formatTime(currentTime)}</span>
            <span className="text-[11px] font-sans font-semibold text-amber-700 dark:text-amber-400">
              {isPlaying ? (language === 'bn' ? 'আযান চলছে...' : 'Playing Azan...') : (language === 'bn' ? 'আযান শুনুন' : 'Ready')}
            </span>
            <span>{formatTime(duration || 180)}</span>
          </div>
        </div>

      </div>

      {/* Grid of All Azan Artists & Muaddhins */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AZAN_COLLECTION.map((track) => {
          const isCurrent = activeTrack.id === track.id;
          const isThisPlaying = isCurrent && isPlaying;

          return (
            <div
              key={track.id}
              onClick={() => handleSelectTrack(track, true)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 group ${
                isCurrent
                  ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 shadow-md ring-2 ring-amber-500/20'
                  : 'border-[var(--border)] bg-[var(--card)] hover:border-amber-400 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    track.isFeatured
                      ? 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200 font-bold border border-rose-300'
                      : 'bg-stone-100 dark:bg-stone-800 text-[var(--muted-foreground)]'
                  }`}>
                    {language === 'bn' ? track.tag_bn : track.tag_en}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                    <Clock className="w-3 h-3" />
                    <span>{track.duration}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    isThisPlaying
                      ? 'bg-amber-600 text-white shadow-md scale-105'
                      : 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 group-hover:bg-amber-600 group-hover:text-white'
                  }`}>
                    {isThisPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <h4 className={`text-sm font-bold truncate transition-colors ${
                      isCurrent ? 'text-amber-900 dark:text-amber-200 font-extrabold' : 'text-[var(--foreground)] group-hover:text-amber-600'
                    }`}>
                      {language === 'bn' ? track.title_bn : track.title_en}
                    </h4>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 truncate">
                      {language === 'bn' ? track.artist_bn : track.artist_en}
                    </p>
                    <p className="text-[11px] text-[var(--muted-foreground)] truncate">
                      {language === 'bn' ? track.location_bn : track.location_en}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed pt-1 font-bangla border-t border-[var(--border)]">
                {language === 'bn' ? track.description_bn : track.description_en}
              </p>
            </div>
          );
        })}
      </div>

    </section>
  );
}
