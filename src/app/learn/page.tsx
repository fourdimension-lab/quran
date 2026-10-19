'use client';

import React from 'react';
import { FlashcardViewer } from '@/components/learning/FlashcardViewer';
import { GraduationCap, Sparkles, BookOpen, Layers, Award } from 'lucide-react';

export default function LearnPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Introduction */}
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Spaced Repetition & Vocabulary Mastery</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Quranic Arabic Vocabulary & Flashcards
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
          Master the most frequent words in the Holy Quran using the scientifically proven SuperMemo-2 (SM-2) spaced repetition algorithm. Test your recall with interactive quizzes.
        </p>
      </div>

      {/* Main Flashcard & Quiz Component */}
      <FlashcardViewer />

    </div>
  );
}
