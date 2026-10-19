import React from 'react';
import { notFound } from 'next/navigation';
import { QuranReader } from '@/components/reader/QuranReader';
import { getSurahByNumber } from '@/lib/quran-data/surahs';

interface SurahPageProps {
  params: Promise<{
    surahId: string;
  }>;
}

export function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({
    surahId: (i + 1).toString()
  }));
}

export async function generateMetadata({ params }: SurahPageProps) {
  const { surahId } = await params;
  const num = parseInt(surahId, 10);
  const surah = getSurahByNumber(num);
  if (!surah) return { title: 'Surah Not Found | Al-Quran' };

  return {
    title: `Surah ${surah.name_en} (${surah.name_ar}) - Al-Quran Platform`,
    description: `Read Surah ${surah.name_en} with word-by-word meaning, Bangla translation, audio recitation, and classical Tafsir.`
  };
}

export default async function SurahPage({ params }: SurahPageProps) {
  const { surahId } = await params;
  const num = parseInt(surahId, 10);

  if (isNaN(num) || num < 1 || num > 114) {
    notFound();
  }

  return <QuranReader initialSurahNumber={num} />;
}
