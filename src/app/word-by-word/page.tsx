'use client';

import React, { useState } from 'react';
import { QuranReader } from '@/components/reader/QuranReader';
import { Layers, Info, Sparkles } from 'lucide-react';

export default function WordByWordPage() {
  return (
    <div className="space-y-4">
      {/* Informational Hero */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] shrink-0 mt-0.5">
            <Layers className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-[var(--foreground)]">Interactive Word-by-Word Mode</h2>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              Every single Arabic word in the Quran is interactive. Click on any word below to view its root letters (جذر), grammatical form, lemma, English and Bangla meaning, and its occurrences across the Quran.
            </p>
          </div>
        </div>
      </div>

      <QuranReader initialSurahNumber={1} />
    </div>
  );
}
