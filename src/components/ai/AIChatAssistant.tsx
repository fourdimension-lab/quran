'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Send, 
  BookOpen, 
  ShieldAlert, 
  HelpCircle, 
  ArrowRight,
  RefreshCw,
  Compass
} from 'lucide-react';
import { AISearchResult } from '@/types/quran';

export function AIChatAssistant() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AISearchResult | null>(null);

  const suggestedQuestions = [
    'Which Ayahs discuss patience during hardship?',
    'What is the linguistic difference between Ar-Rahman and Ar-Rahim?',
    'Explain the concept of Tawhid in Surah Al-Ikhlas',
    'কুরআনে মাতা-পিতার অধিকার সম্পর্কে কী বলা হয়েছে?',
    'What do Quranic verses say about the expansion of the universe?'
  ];

  const handleAsk = async (questionText: string) => {
    if (!questionText.trim()) return;
    setIsLoading(true);
    setQuery(questionText);

    try {
      const res = await fetch('/api/ai/study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: questionText, language: 'en' })
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        throw new Error('Failed to fetch AI study answer');
      }
    } catch (err) {
      console.warn('AI study assistant error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white shadow-lg space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-[var(--gold-light)]">
          <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
          <span>Grounded Retrieval-Augmented Exegesis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          AI Quran Study Assistant
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
          Ask questions to explore thematic connections, linguistic nuances, and classical commentaries across the Holy Quran. Every answer is strictly grounded in authenticated Quranic verses.
        </p>
      </div>

      {/* Query Input Box */}
      <div className="p-2 sm:p-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-md space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(query);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a Quranic study question (e.g. 'Ayahs on mercy', 'Meaning of Taqwa')..."
            className="w-full text-sm sm:text-base px-3 py-2 bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 transition-all shrink-0 shadow-xs"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Ask Assistant</span>
          </button>
        </form>

        {/* Preset Prompt Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 text-xs">
          <span className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1 shrink-0">
            <Compass className="w-3 h-3" /> Prompts:
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(q)}
              className="px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)] hover:bg-[var(--primary-light)]/30 text-[11px] text-[var(--foreground)] whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Answer Spotlight Card */}
      {isLoading && (
        <div className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[var(--muted-foreground)]">
            Retrieving verses from the canonical Quran database and grounding scholarly exegesis...
          </p>
        </div>
      )}

      {!isLoading && result && (
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-md space-y-6 animate-in fade-in duration-200">
          
          {/* Explanation Text */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary)] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Synthesized Study Answer</span>
            </div>
            <div className="text-sm sm:text-base leading-relaxed text-[var(--foreground)] whitespace-pre-line font-sans">
              {result.answer}
            </div>
          </div>

          {/* Verified References */}
          {result.references.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[var(--border)]">
              <div className="text-xs font-bold text-[var(--foreground)] tracking-wide uppercase">
                Verified Quranic References ({result.references.length})
              </div>
              <div className="grid grid-cols-1 gap-3">
                {result.references.map((ref, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[var(--primary)]">
                        Surah {ref.surah}, Ayah {ref.ayah}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)] font-medium">
                        {ref.relevance}
                      </span>
                    </div>
                    <p className="font-arabic text-lg text-[var(--foreground)] text-right leading-loose">
                      {ref.text_ar}
                    </p>
                    <p className="text-xs text-[var(--foreground)]/80 italic">
                      &quot;{ref.translation}&quot;
                    </p>
                    <div className="pt-1 flex justify-end">
                      <Link
                        href={`/read/${ref.surah}#ayah-${ref.surah}-${ref.ayah}`}
                        className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
                      >
                        <span>Open in Quran Reader</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strict Scholarly Disclaimer Alert */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <p className="leading-relaxed">
              {result.scholarly_caveat}
            </p>
          </div>

        </div>
      )}
    </div>
  );
}
