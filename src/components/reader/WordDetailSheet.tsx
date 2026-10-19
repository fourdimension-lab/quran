'use client';

import React, { useState } from 'react';
import { X, BookmarkPlus, Check, Volume2, Sparkles, BookOpen, Layers } from 'lucide-react';
import { QuranWord } from '@/types/quran';
import { addWordToVocab } from '@/lib/storage/user-storage';
import { getWordOccurrences } from '@/lib/quran-data/quran-service';

interface WordDetailSheetProps {
  word: QuranWord | null;
  onClose: () => void;
  onSelectOccurAyah?: (surah: number, ayah: number) => void;
}

export function WordDetailSheet({ word, onClose, onSelectOccurAyah }: WordDetailSheetProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [occurrences, setOccurrences] = useState<{ surah: number; ayah: number; text_ar: string; translation_en: string }[]>([]);
  const [isLoadingOccur, setIsLoadingOccur] = useState(false);
  const [activeTab, setActiveTab] = useState<'meaning' | 'occurrences'>('meaning');

  if (!word) return null;

  const handleSaveToVocab = () => {
    addWordToVocab({
      word_arabic: word.arabic,
      transliteration: word.transliteration,
      translation_en: word.translation_en,
      translation_bn: word.translation_bn,
      root: word.root,
      surah_ref: word.surah,
      ayah_ref: word.ayah
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const loadOccurrences = async () => {
    setActiveTab('occurrences');
    if (occurrences.length === 0) {
      setIsLoadingOccur(true);
      try {
        const results = await getWordOccurrences(word.arabic, word.root);
        setOccurrences(results);
      } catch (err) {
        console.warn('Occurrences load error:', err);
      } finally {
        setIsLoadingOccur(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full sm:max-w-lg bg-[var(--card)] border border-[var(--border)] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[var(--primary-light)] text-[var(--primary)] text-xs font-bold flex items-center justify-center">
              {word.surah}:{word.ayah}
            </span>
            <span className="text-xs font-semibold text-[var(--muted-foreground)]">Word {word.position}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Word Showcase Hero */}
        <div className="p-6 text-center bg-gradient-to-b from-[var(--primary-light)]/30 to-transparent space-y-2">
          <div className="font-arabic text-4xl sm:text-5xl text-[var(--foreground)] font-bold py-2 select-text">
            {word.arabic}
          </div>
          <div className="text-sm font-medium text-[var(--primary)] italic">
            {word.transliteration}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[var(--border)] px-4">
          <button
            onClick={() => setActiveTab('meaning')}
            className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'meaning'
                ? 'border-[var(--primary)] text-[var(--primary)]'
                : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            Meaning & Grammar
          </button>
          <button
            onClick={loadOccurrences}
            className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'occurrences'
                ? 'border-[var(--primary)] text-[var(--primary)]'
                : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            Occurrences {word.frequency_in_quran ? `(${word.frequency_in_quran})` : ''}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 max-h-[50vh] overflow-y-auto space-y-4">
          {activeTab === 'meaning' ? (
            <>
              {/* Translations */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                  <div className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] mb-1">English Meaning</div>
                  <div className="text-sm font-medium text-[var(--foreground)]">{word.translation_en || 'Available in context'}</div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] font-bangla">
                  <div className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] mb-1">বাংলা অর্থ</div>
                  <div className="text-sm font-medium text-[var(--foreground)]">{word.translation_bn || 'প্রসঙ্গ অনুযায়ী অর্থ'}</div>
                </div>
              </div>

              {/* Morphology & Root Details */}
              <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--muted-foreground)]">Root Letters (جذر)</span>
                  <span className="font-arabic font-bold text-sm text-[var(--primary)]">{word.root_arabic || word.root || 'N/A'}</span>
                </div>
                {word.lemma && (
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--border)]">
                    <span className="text-[var(--muted-foreground)]">Lemma (المعجم)</span>
                    <span className="font-arabic font-medium text-sm text-[var(--foreground)]">{word.lemma}</span>
                  </div>
                )}
                {word.part_of_speech && (
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--border)]">
                    <span className="text-[var(--muted-foreground)]">Part of Speech</span>
                    <span className="font-medium text-[var(--foreground)]">{word.part_of_speech}</span>
                  </div>
                )}
                {word.grammar && (
                  <div className="pt-2 border-t border-[var(--border)] text-xs text-[var(--foreground)]/80">
                    <span className="text-[var(--muted-foreground)] block mb-0.5">Grammatical Role:</span>
                    {word.grammar}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Occurrences Tab */
            <div className="space-y-2">
              {isLoadingOccur && (
                <div className="py-6 text-center text-xs text-[var(--muted-foreground)] animate-pulse">
                  Searching Quran occurrences...
                </div>
              )}
              {!isLoadingOccur && occurrences.length === 0 && (
                <div className="py-6 text-center text-xs text-[var(--muted-foreground)]">
                  Appears {word.frequency_in_quran || 1} times across the Quranic text.
                </div>
              )}
              {occurrences.map((oc, i) => (
                <div 
                  key={i} 
                  className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs space-y-1 hover:border-[var(--primary)] transition-colors cursor-pointer"
                  onClick={() => {
                    if (onSelectOccurAyah) onSelectOccurAyah(oc.surah, oc.ayah);
                    onClose();
                  }}
                >
                  <div className="font-semibold text-[var(--primary)]">Surah {oc.surah}, Ayah {oc.ayah}</div>
                  <div className="font-arabic text-sm text-right">{oc.text_ar}</div>
                  <div className="text-[11px] text-[var(--muted-foreground)]">{oc.translation_en}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[var(--muted)] border-t border-[var(--border)] flex items-center justify-between gap-3">
          <button
            onClick={handleSaveToVocab}
            disabled={isSaved}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-sm'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved to My Vocabulary!</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4" />
                <span>Save to Flashcards for Review</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
