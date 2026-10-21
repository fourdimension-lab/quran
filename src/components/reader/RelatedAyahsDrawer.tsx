'use client';

import React, { useState, useEffect } from 'react';
import { X, Link2, ArrowRight, Tag, BookOpen } from 'lucide-react';
import { RelatedAyah } from '@/types/quran';
import { getRelatedAyahs } from '@/lib/quran-data/related-ayahs';

interface RelatedAyahsDrawerProps {
  surahNumber: number;
  ayahNumber: number;
  onClose: () => void;
  onNavigateToAyah: (surah: number, ayah: number) => void;
}

export function RelatedAyahsDrawer({
  surahNumber,
  ayahNumber,
  onClose,
  onNavigateToAyah
}: RelatedAyahsDrawerProps) {
  const [relatedList, setRelatedList] = useState<RelatedAyah[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    const list = getRelatedAyahs(surahNumber, ayahNumber);
    setRelatedList(list);
  }, [surahNumber, ayahNumber]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const filteredList = selectedFilter === 'all' 
    ? relatedList 
    : relatedList.filter((r) => r.relation_type === selectedFilter);

  const getRelationBadge = (type: RelatedAyah['relation_type']) => {
    switch (type) {
      case 'same_word':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">Same Arabic Word</span>;
      case 'same_root':
        return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">Same Root Letters</span>;
      case 'shared_concept':
        return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">Shared Concept</span>;
      case 'tafsir_cross_reference':
        return <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-bold">Scholarly Cross-Reference</span>;
      case 'legal_moral_principle':
        return <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-bold">Ethical Principle</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[10px] font-bold">Thematic Relation</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-hidden">
      <div 
        className="w-full sm:w-[500px] md:w-[560px] h-full max-h-screen bg-[var(--card)] border-l border-[var(--border)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--card)] sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-[var(--primary)]" />
            <div>
              <h2 className="text-sm font-bold text-[var(--foreground)]">Related Ayahs Discovery</h2>
              <span className="text-[11px] text-[var(--muted-foreground)]">Connections for Ayah {surahNumber}:{ayahNumber}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-3 border-b border-[var(--border)] bg-[var(--background)] flex gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              selectedFilter === 'all'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            All Connections ({relatedList.length})
          </button>
          <button
            onClick={() => setSelectedFilter('same_word')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              selectedFilter === 'same_word'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            Same Word
          </button>
          <button
            onClick={() => setSelectedFilter('shared_concept')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              selectedFilter === 'shared_concept'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            Concept
          </button>
        </div>

        {/* Ayahs List */}
        <div className="p-4 overflow-y-auto min-h-0 flex-1 space-y-3 overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
          {filteredList.map((rel, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)] transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--primary)]">
                  Surah {rel.surah_number}, Ayah {rel.ayah_number}
                </span>
                {getRelationBadge(rel.relation_type)}
              </div>

              <p className="font-arabic text-lg sm:text-xl text-[var(--foreground)] text-right leading-relaxed">
                {rel.text_ar}
              </p>

              <p className="text-xs text-[var(--foreground)]/80">
                &quot;{rel.translation_en}&quot;
              </p>

              <p className="text-xs text-[var(--foreground)]/80 font-bangla">
                &quot;{rel.translation_bn}&quot;
              </p>

              <div className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-xs text-[var(--muted-foreground)]">
                <span className="font-semibold text-[var(--foreground)]">Why it is related: </span>
                {rel.explanation}
              </div>

              <div className="pt-1 flex justify-end">
                <button
                  onClick={() => {
                    onNavigateToAyah(rel.surah_number, rel.ayah_number);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <span>Open Verse in Reader</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
