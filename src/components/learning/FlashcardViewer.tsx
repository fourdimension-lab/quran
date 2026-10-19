'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  RotateCw, 
  Check, 
  X, 
  HelpCircle, 
  Sparkles, 
  Award, 
  BookOpen, 
  GraduationCap,
  Layers
} from 'lucide-react';
import { QURANIC_VOCABULARY_DATA, VocabularyCard } from '@/lib/quran-data/vocabulary';
import { getStoredVocab, reviewVocabItem } from '@/lib/storage/user-storage';

export function FlashcardViewer() {
  const [deck, setDeck] = useState<VocabularyCard[]>(QURANIC_VOCABULARY_DATA);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizSelected, setQuizSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const currentCard = deck[currentIndex];

  const handleRate = (quality: number) => {
    reviewVocabItem(currentCard.id, quality);
    setIsFlipped(false);

    if (currentIndex + 1 < deck.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed deck! Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setCurrentIndex(0);
    }
  };

  const handleQuizAnswer = (option: string) => {
    setQuizSelected(option);
    if (option === currentCard.meaning_en) {
      setScore(score + 1);
    }
    setTimeout(() => {
      setQuizSelected(null);
      if (currentIndex + 1 < deck.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        setCurrentIndex(0);
      }
    }, 1200);
  };

  const [quizOptions, setQuizOptions] = useState<string[]>([]);

  // Generate 4 randomized options for quiz inside client-side useEffect
  useEffect(() => {
    if (!currentCard) return;
    const others = deck.filter((c) => c.id !== currentCard.id).map((c) => c.meaning_en);
    const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3);
    setQuizOptions([currentCard.meaning_en, ...shuffledOthers].sort(() => 0.5 - Math.random()));
  }, [currentCard, deck, quizMode]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Mode Switcher */}
      <div className="flex items-center justify-between p-2 rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setQuizMode(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              !quizMode ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Flashcard SRS</span>
          </button>
          <button
            onClick={() => {
              setQuizMode(true);
              setScore(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              quizMode ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Quiz Practice</span>
          </button>
        </div>

        <div className="text-xs font-mono text-[var(--muted-foreground)] px-2">
          Card {currentIndex + 1} of {deck.length}
        </div>
      </div>

      {!quizMode ? (
        /* Flashcard View */
        <div className="space-y-4">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[300px] p-8 rounded-3xl border-2 border-[var(--border)] bg-gradient-to-b from-[var(--card)] to-[var(--background)] shadow-xl flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all hover:border-[var(--primary)] active:scale-99"
          >
            {!isFlipped ? (
              <div className="space-y-4 animate-in fade-in">
                <span className="text-[10px] tracking-wider uppercase font-bold text-[var(--muted-foreground)]">
                  Click card to reveal meaning & root
                </span>
                <div className="font-arabic text-6xl text-[var(--foreground)] font-bold py-4">
                  {currentCard.arabic}
                </div>
                <div className="text-base text-[var(--primary)] font-medium">
                  {currentCard.transliteration}
                </div>
                <div className="text-xs text-[var(--muted-foreground)]">
                  Frequency: {currentCard.frequency} times in Quran
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in">
                <span className="text-[10px] tracking-wider uppercase font-bold text-[var(--primary)]">
                  Meaning & Exegesis
                </span>
                <div className="text-2xl font-bold text-[var(--foreground)]">
                  {currentCard.meaning_en}
                </div>
                <div className="text-xl font-bold text-[var(--foreground)]/90 font-bangla">
                  {currentCard.meaning_bn}
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-xs font-semibold">
                  <span>Root: {currentCard.root}</span>
                  <span>•</span>
                  <span>{currentCard.part_of_speech}</span>
                </div>
                <div className="pt-2 text-xs text-[var(--muted-foreground)] max-w-md mx-auto">
                  <span className="font-semibold text-[var(--foreground)]">Example: </span>
                  &quot;{currentCard.example_ayah.translation_en}&quot; (Quran {currentCard.example_ayah.surah}:{currentCard.example_ayah.ayah})
                </div>
              </div>
            )}
          </div>

          {/* SM-2 Quality Rating Buttons (Active when flipped) */}
          {isFlipped ? (
            <div className="p-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-2 animate-in fade-in">
              <div className="text-[11px] text-center text-[var(--muted-foreground)] font-medium">
                Rate your recall quality for Spaced Repetition (SRS):
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleRate(1)}
                  className="py-2 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950 dark:hover:bg-red-900 text-red-800 dark:text-red-300 text-xs font-bold transition-colors"
                >
                  Forgot (1d)
                </button>
                <button
                  onClick={() => handleRate(3)}
                  className="py-2 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300 text-xs font-bold transition-colors"
                >
                  Hard (2d)
                </button>
                <button
                  onClick={() => handleRate(4)}
                  className="py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-colors"
                >
                  Good (4d)
                </button>
                <button
                  onClick={() => handleRate(5)}
                  className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Mastered (7d)
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsFlipped(true)}
              className="w-full py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-xs font-semibold text-[var(--foreground)] flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Show Meaning</span>
            </button>
          )}
        </div>
      ) : (
        /* Quiz Mode */
        <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[var(--muted-foreground)]">
              Select the correct meaning
            </span>
            <div className="font-arabic text-5xl text-[var(--foreground)] font-bold py-2">
              {currentCard.arabic}
            </div>
            <div className="text-sm text-[var(--primary)] italic">
              {currentCard.transliteration}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quizOptions.map((opt, i) => {
              const isCorrect = opt === currentCard.meaning_en;
              const isSelected = quizSelected === opt;

              let btnStyle = 'border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--primary)]';
              if (quizSelected) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-bold';
                } else if (isSelected) {
                  btnStyle = 'border-rose-500 bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200';
                }
              }

              return (
                <button
                  key={i}
                  disabled={quizSelected !== null}
                  onClick={() => handleQuizAnswer(opt)}
                  className={`p-4 rounded-xl border text-sm text-left transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {quizSelected && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                  {quizSelected && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-600" />}
                </button>
              );
            })}
          </div>

          <div className="text-center text-xs text-[var(--muted-foreground)]">
            Score: <span className="font-bold text-[var(--primary)]">{score}</span>
          </div>
        </div>
      )}

    </div>
  );
}
