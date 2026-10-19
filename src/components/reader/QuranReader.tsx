'use client';

import React, { useState, useEffect } from 'react';
import { Surah, Ayah, QuranWord } from '@/types/quran';
import { getSurahByNumber } from '@/lib/quran-data/surahs';
import { getSurahAyahs } from '@/lib/quran-data/quran-service';
import { ReaderToolbar } from './ReaderToolbar';
import { AyahCard } from './AyahCard';
import { WordDetailSheet } from './WordDetailSheet';
import { TafsirDrawer } from './TafsirDrawer';
import { RelatedAyahsDrawer } from './RelatedAyahsDrawer';
import { updateReadingProgress } from '@/lib/storage/user-storage';

interface QuranReaderProps {
  initialSurahNumber?: number;
}

export function QuranReader({ initialSurahNumber = 1 }: QuranReaderProps) {
  const [currentSurahNumber, setCurrentSurahNumber] = useState(initialSurahNumber);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Display Preferences
  const [arabicFontSize, setArabicFontSize] = useState(30);
  const [showEnglish, setShowEnglish] = useState(true);
  const [showBangla, setShowBangla] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showWordByWord, setShowWordByWord] = useState(true);

  // Active Modals / Drawers
  const [selectedWord, setSelectedWord] = useState<QuranWord | null>(null);
  const [selectedTafsirAyah, setSelectedTafsirAyah] = useState<Ayah | null>(null);
  const [selectedRelatedAyah, setSelectedRelatedAyah] = useState<{ surah: number; ayah: number } | null>(null);

  const currentSurah = getSurahByNumber(currentSurahNumber) || getSurahByNumber(1)!;

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getSurahAyahs(currentSurahNumber)
      .then((data) => {
        if (isMounted) {
          setAyahs(data);
          setIsLoading(false);
          updateReadingProgress(currentSurahNumber, 1);
        }
      })
      .catch((err) => {
        console.warn('Failed to load ayahs:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentSurahNumber]);

  const handleNavigateToAyah = (surahNum: number, ayahNum: number) => {
    if (surahNum !== currentSurahNumber) {
      setCurrentSurahNumber(surahNum);
    }
    setTimeout(() => {
      const el = document.getElementById(`ayah-${surahNum}-${ayahNum}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pb-32">
      {/* Reader Navigation & Preferences Toolbar */}
      <ReaderToolbar
        currentSurah={currentSurah}
        onSelectSurah={(num) => setCurrentSurahNumber(num)}
        arabicFontSize={arabicFontSize}
        setArabicFontSize={setArabicFontSize}
        showEnglish={showEnglish}
        setShowEnglish={setShowEnglish}
        showBangla={showBangla}
        setShowBangla={setShowBangla}
        showTransliteration={showTransliteration}
        setShowTransliteration={setShowTransliteration}
        showWordByWord={showWordByWord}
        setShowWordByWord={setShowWordByWord}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {/* Surah Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white text-center shadow-lg relative overflow-hidden">
          {/* Subtle Background Rosette */}
          <div className="absolute inset-0 bg-islamic-pattern opacity-15" />
          
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-medium text-[var(--gold-light)]">
              <span>Surah {currentSurah.number}</span>
              <span>•</span>
              <span>{currentSurah.revelation_place}</span>
              <span>•</span>
              <span>{currentSurah.verses_count} Verses</span>
            </div>

            <h1 className="font-arabic text-4xl sm:text-5xl font-bold py-1">
              سُورَةُ {currentSurah.name_ar}
            </h1>

            <div className="text-lg font-bold tracking-wide">
              {currentSurah.name_en} <span className="font-normal font-bangla opacity-90">({currentSurah.name_bn})</span>
            </div>

            <p className="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto">
              {currentSurah.translation_en} • <span className="font-bangla">{currentSurah.translation_bn}</span>
            </p>
          </div>
        </div>

        {/* Bismillah Header (Except Surah 9 At-Tawbah) */}
        {currentSurah.bismillah_pre && (
          <div className="py-6 text-center select-none">
            <span className="font-arabic text-3xl sm:text-4xl text-[var(--foreground)] tracking-wide font-normal">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </span>
          </div>
        )}

        {/* Ayahs Stream */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[var(--muted-foreground)]">Loading canonical Quranic text and word morphology...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ayahs.map((ayah) => (
              <AyahCard
                key={`${ayah.surah_number}:${ayah.ayah_number}`}
                ayah={ayah}
                showEnglish={showEnglish}
                showBangla={showBangla}
                showTransliteration={showTransliteration}
                showWordByWord={showWordByWord}
                arabicFontSize={arabicFontSize}
                onSelectWord={(w) => setSelectedWord(w)}
                onOpenTafsir={(a) => setSelectedTafsirAyah(a)}
                onOpenRelated={(a) => setSelectedRelatedAyah({ surah: a.surah_number, ayah: a.ayah_number })}
              />
            ))}
          </div>
        )}
      </main>

      {/* Interactive Word Details Bottom Sheet / Popover */}
      <WordDetailSheet
        word={selectedWord}
        onClose={() => setSelectedWord(null)}
        onSelectOccurAyah={(s, a) => handleNavigateToAyah(s, a)}
      />

      {/* Tafsir & Related Ayahs Unified Drawer */}
      <TafsirDrawer
        ayah={selectedTafsirAyah}
        onClose={() => setSelectedTafsirAyah(null)}
        onNavigateToAyah={(s, a) => handleNavigateToAyah(s, a)}
        onOpenRelated={() => {
          if (selectedTafsirAyah) {
            setSelectedRelatedAyah({
              surah: selectedTafsirAyah.surah_number,
              ayah: selectedTafsirAyah.ayah_number
            });
            setSelectedTafsirAyah(null);
          }
        }}
      />

      {/* Related Ayahs Discovery Drawer */}
      {selectedRelatedAyah && (
        <RelatedAyahsDrawer
          surahNumber={selectedRelatedAyah.surah}
          ayahNumber={selectedRelatedAyah.ayah}
          onClose={() => setSelectedRelatedAyah(null)}
          onNavigateToAyah={(s, a) => handleNavigateToAyah(s, a)}
        />
      )}
    </div>
  );
}
