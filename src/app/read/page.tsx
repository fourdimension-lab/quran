'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Compass, ArrowRight, Filter } from 'lucide-react';
import { SURAHS_DATA } from '@/lib/quran-data/surahs';
import { Surah } from '@/types/quran';

export default function ReadDirectoryPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Meccan' | 'Medinan'>('all');

  const filteredSurahs = SURAHS_DATA.filter((s) => {
    if (filterType !== 'all' && s.revelation_place !== filterType) return false;
    if (!search) return true;
    const q = search.toLowerCase().trim();
    return (
      s.number.toString() === q ||
      s.name_en.toLowerCase().includes(q) ||
      s.name_transliteration.toLowerCase().includes(q) ||
      s.name_bn.includes(q) ||
      s.translation_en.toLowerCase().includes(q) ||
      s.translation_bn.includes(q) ||
      s.name_ar.includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Introduction */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          The Holy Quran — 114 Surahs
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
          Browse all chapters of the Holy Quran according to the verified Uthmani order. Click any chapter to read with word-by-word meanings, audio recitation, and classical Tafsir.
        </p>
      </div>

      {/* Search & Revelation Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name in English, বাংলা, or Arabic..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-hidden focus:border-[var(--primary)]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterType === 'all'
                ? 'bg-[var(--primary)] text-white'
                : 'border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            All (114)
          </button>
          <button
            onClick={() => setFilterType('Meccan')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterType === 'Meccan'
                ? 'bg-[var(--primary)] text-white'
                : 'border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            Meccan (86)
          </button>
          <button
            onClick={() => setFilterType('Medinan')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterType === 'Medinan'
                ? 'bg-[var(--primary)] text-white'
                : 'border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            Medinan (28)
          </button>
        </div>
      </div>

      {/* Surahs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSurahs.map((s) => (
          <Link
            key={s.number}
            href={`/read/${s.number}`}
            className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <span className="w-10 h-10 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] font-bold text-sm flex items-center justify-center shrink-0">
                {s.number}
              </span>
              <div>
                <div className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                  {s.name_en} <span className="font-normal font-bangla text-xs opacity-90">({s.name_bn})</span>
                </div>
                <div className="text-xs text-[var(--muted-foreground)]">
                  {s.translation_en} • <span className="text-[10px] uppercase font-bold text-[var(--gold)]">{s.revelation_place}</span>
                </div>
                <div className="text-[11px] text-[var(--muted-foreground)]">
                  {s.verses_count} Verses • Juz {s.juz_start}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="font-arabic text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors block">
                {s.name_ar}
              </span>
              <span className="text-[10px] text-[var(--muted-foreground)]">
                Page {s.page_start}
              </span>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
