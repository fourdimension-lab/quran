'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Search, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react';
import { QURANIC_SIGNS_DATA } from '@/lib/quran-data/miracles';

export default function MiraclesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredSigns = selectedCategory === 'all'
    ? QURANIC_SIGNS_DATA
    : QURANIC_SIGNS_DATA.filter((s) => s.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'সকল নিদর্শন (All Signs)' },
    { id: 'cosmology', label: 'মহাবিশ্বতত্ত্ব (Cosmology)' },
    { id: 'embryology', label: 'ভ্রূণবিদ্যা (Embryology)' },
    { id: 'geology', label: 'ভূতত্ত্ব (Geology)' },
    { id: 'oceanology', label: 'সমুদ্রবিজ্ঞান (Oceanology)' },
    { id: 'history', label: 'ইতিহাস ও প্রত্নতত্ত্ব (History)' }
  ];

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'cosmology':
        return {
          card: 'bg-indigo-50/50 dark:bg-indigo-950/25 border-indigo-300 dark:border-indigo-700/60 hover:border-indigo-500',
          badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200 border-indigo-300',
          verseBox: 'bg-indigo-100/60 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800',
          accent: 'text-indigo-600 dark:text-indigo-400'
        };
      case 'embryology':
        return {
          card: 'bg-rose-50/50 dark:bg-rose-950/25 border-rose-300 dark:border-rose-700/60 hover:border-rose-500',
          badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200 border-rose-300',
          verseBox: 'bg-rose-100/60 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800',
          accent: 'text-rose-600 dark:text-rose-400'
        };
      case 'geology':
        return {
          card: 'bg-amber-50/50 dark:bg-amber-950/25 border-amber-300 dark:border-amber-700/60 hover:border-amber-500',
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 border-amber-300',
          verseBox: 'bg-amber-100/60 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800',
          accent: 'text-amber-600 dark:text-amber-400'
        };
      case 'oceanology':
        return {
          card: 'bg-teal-50/50 dark:bg-teal-950/25 border-teal-300 dark:border-teal-700/60 hover:border-teal-500',
          badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200 border-teal-300',
          verseBox: 'bg-teal-100/60 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800',
          accent: 'text-teal-600 dark:text-teal-400'
        };
      case 'history':
        return {
          card: 'bg-emerald-50/50 dark:bg-emerald-950/25 border-emerald-300 dark:border-emerald-700/60 hover:border-emerald-500',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border-emerald-300',
          verseBox: 'bg-emerald-100/60 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800',
          accent: 'text-emerald-600 dark:text-emerald-400'
        };
      default:
        return {
          card: 'bg-emerald-50/50 dark:bg-emerald-950/25 border-emerald-300 dark:border-emerald-700/60 hover:border-emerald-500',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border-emerald-300',
          verseBox: 'bg-emerald-100/60 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800',
          accent: 'text-emerald-600 dark:text-emerald-400'
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Introduction */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>প্রামাণ্য তাফসীর ও বৈজ্ঞানিক তাফাক্কুর (Scholarly Empirical Reflections)</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
          কুরআনিক নিদর্শন, বিজ্ঞান ও তাদাব্বুর
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] max-w-3xl leading-relaxed">
          মহাবিশ্বের সৃষ্টি, ভ্রূণবিকাশ, পর্বতমালা, সমুদ্রবিজ্ঞান ও ঐতিহাসিক সত্যতার প্রামাণ্য বিশ্লেষণ। কোনো কাল্পনিক বা অসত্য দাবি ব্যতিরেকে নির্ভরযোগ্য ইসলামিক গবেষক ও সমসাময়িক বিজ্ঞানের আলোকে।
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto text-xs pb-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
              selectedCategory === c.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Cards Grid with Distinct Theme Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSigns.map((sign) => {
          const theme = getCategoryTheme(sign.category);
          return (
            <Link
              key={sign.id}
              href={`/miracles/${sign.slug}`}
              className={`p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between space-y-4 group shadow-sm hover:shadow-lg hover:-translate-y-0.5 ${theme.card}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full border ${theme.badge}`}>
                    {sign.category_display_en}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="w-3 h-3" /> নির্ভরযোগ্য রেফারেন্স
                  </span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-[var(--foreground)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {sign.title_en}
                  </h2>
                  <div className="text-xs font-bold text-[var(--foreground)]/80 font-bangla">
                    {sign.title_bn}
                  </div>
                </div>

                {/* Sample Arabic verse with themed box */}
                {sign.ayahs[0] && (
                  <div className={`p-3.5 rounded-2xl border space-y-1 ${theme.verseBox}`}>
                    <p className="font-arabic text-lg text-[var(--foreground)] text-right">
                      {sign.ayahs[0].text_ar}
                    </p>
                    <p className="text-[11px] text-[var(--muted-foreground)] italic line-clamp-1">
                      &quot;{sign.ayahs[0].translation_en}&quot; (Quran {sign.ayahs[0].surah}:{sign.ayahs[0].ayah})
                    </p>
                  </div>
                )}

                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed line-clamp-3">
                  {sign.explanation_en}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border)]/70 flex items-center justify-between text-xs font-bold">
                <span className="text-[11px] text-[var(--muted-foreground)]">
                  {sign.scientific_references.length} Academic Citations
                </span>
                <span className={`group-hover:translate-x-1 transition-transform flex items-center gap-1 ${theme.accent}`}>
                  <span>পূর্ণ বিশ্লেষণ পড়ুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
