'use client';

import React from 'react';
import { QuranReader } from '@/components/reader/QuranReader';
import { Layers, Sparkles, BookOpen, CheckCircle2, ChevronRight } from 'lucide-react';

export default function WordByWordPage() {
  return (
    <div className="space-y-4">
      {/* Informational Aesthetic Hero (Themed to website colors) */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-teal-50/90 via-emerald-50/70 to-teal-100/80 dark:from-teal-950/40 dark:via-emerald-950/60 dark:to-teal-950/40 text-[var(--foreground)] border-2 border-teal-300/80 dark:border-teal-700/60 shadow-md relative overflow-hidden">
          {/* Subtle Ambient Pattern */}
          <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />

          <div className="relative z-10 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/60 border border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-200 text-xs font-bold shadow-2xs">
                <Layers className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>একক আয়াত কেন্দ্রিক শব্দে শব্দে অধ্যয়ন (Single-Ayat Word Focus)</span>
              </div>

              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-100/80 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border border-amber-300/60 dark:border-amber-700/50 font-bold">
                ১১৪ টি সূরা • ৭৭,৪০০+ শব্দ
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--foreground)]">
              পবিত্র কুরআনের শব্দে শব্দে অর্থ ও ব্যাকরণ
            </h1>

            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed max-w-2xl font-bangla">
              নিচের যেকোনো আয়াতের <span className="font-bold text-teal-800 dark:text-teal-300">"শব্দে শব্দে অর্থ"</span> বাটনে চাপুন। 
              এক সময়ে <span className="font-bold underline text-teal-900 dark:text-teal-200">শুধুমাত্র একটি মাত্র আয়াতের</span> সকল শব্দের মূল পাঠ, 
              উচ্চারণ, বাংলা অর্থ, ইংরেজি অর্থ, ব্যাকরণগত পদ (বিশেষ্য, ক্রিয়া, অব্যয়) ও মূলধাতু (جذر) প্রদর্শিত হবে।
            </p>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
              <span className="px-2.5 py-1 rounded-xl bg-[var(--card)] border border-teal-300/70 dark:border-teal-800 text-teal-900 dark:text-teal-200 flex items-center gap-1.5 shadow-2xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>প্রতি শব্দের বাংলা ও ইংরেজি অর্থ</span>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-[var(--card)] border border-teal-300/70 dark:border-teal-800 text-teal-900 dark:text-teal-200 flex items-center gap-1.5 shadow-2xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>ব্যাকরণ (Part of Speech) ও রুট (Root)</span>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-[var(--card)] border border-teal-300/70 dark:border-teal-800 text-teal-900 dark:text-teal-200 flex items-center gap-1.5 shadow-2xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>এক সাথে একটি আয়াত (সহজ ও সুশৃঙ্খল)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reader with Ayah 1 expanded initially */}
      <QuranReader initialSurahNumber={1} initialActiveWordByWordAyah={1} />
    </div>
  );
}
