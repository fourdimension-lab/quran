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
    { id: 'all', label: 'All Signs' },
    { id: 'cosmology', label: 'Cosmology' },
    { id: 'embryology', label: 'Embryology' },
    { id: 'geology', label: 'Geology' },
    { id: 'oceanology', label: 'Oceanology' },
    { id: 'history', label: 'History & Archaeology' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Introduction */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Rigorous Scholarly Exegesis & Empirical Reflection</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Quranic Signs, Reflections & Inferences
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] max-w-3xl leading-relaxed">
          Exploring the natural phenomena, cosmic horizons, embryology, and historical narratives mentioned in the Holy Quran with verified peer-reviewed academic citations, balanced classical exegeses, and strict avoidance of speculative pseudo-science.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto text-xs pb-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === c.id
                ? 'bg-[var(--primary)] text-white shadow-xs'
                : 'border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSigns.map((sign) => (
          <Link
            key={sign.id}
            href={`/miracles/${sign.slug}`}
            className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary)]">
                  {sign.category_display_en}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3 h-3" /> Verified Scholarly
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                  {sign.title_en}
                </h2>
                <div className="text-xs font-semibold text-[var(--foreground)]/80 font-bangla">
                  {sign.title_bn}
                </div>
              </div>

              {/* Sample Arabic verse */}
              {sign.ayahs[0] && (
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-1">
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

            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[var(--muted-foreground)]">
                {sign.scientific_references.length} Academic Citations
              </span>
              <span className="font-semibold text-[var(--primary)] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Read Full Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
