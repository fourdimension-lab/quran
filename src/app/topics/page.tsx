'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Search, 
  Sparkles, 
  BookOpen, 
  HeartHandshake, 
  Shield, 
  Scale, 
  Globe, 
  Hourglass,
  ArrowRight
} from 'lucide-react';
import { QURAN_TOPICS_DATA } from '@/lib/quran-data/topics';

export default function TopicsPage() {
  const [search, setSearch] = useState('');

  const filteredTopics = QURAN_TOPICS_DATA.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.title_en.toLowerCase().includes(q) ||
      t.title_bn.includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.description_en.toLowerCase().includes(q)
    );
  });

  const getTopicIcon = (id: string) => {
    switch (id) {
      case 'tawhid': return Sparkles;
      case 'prophets': return BookOpen;
      case 'salah': return Compass;
      case 'charity': return HeartHandshake;
      case 'patience': return Shield;
      case 'justice': return Scale;
      case 'creation': return Globe;
      case 'hereafter': return Hourglass;
      default: return BookOpen;
    }
  };

  const getTopicTheme = (id: string) => {
    switch (id) {
      case 'tawhid':
        return {
          card: 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/60 hover:border-amber-500',
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 border border-amber-300',
          iconBox: 'bg-amber-500 text-white shadow-amber-500/20',
          text: 'text-amber-900 dark:text-amber-200 group-hover:text-amber-600',
          arabic: 'text-amber-600 dark:text-amber-400',
          accent: 'text-amber-600 dark:text-amber-400'
        };
      case 'prophets':
        return {
          card: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700/60 hover:border-emerald-500',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border border-emerald-300',
          iconBox: 'bg-emerald-600 text-white shadow-emerald-600/20',
          text: 'text-emerald-950 dark:text-emerald-200 group-hover:text-emerald-600',
          arabic: 'text-emerald-600 dark:text-emerald-400',
          accent: 'text-emerald-600 dark:text-emerald-400'
        };
      case 'salah':
        return {
          card: 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-300 dark:border-teal-700/60 hover:border-teal-500',
          badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200 border border-teal-300',
          iconBox: 'bg-teal-600 text-white shadow-teal-600/20',
          text: 'text-teal-950 dark:text-teal-200 group-hover:text-teal-600',
          arabic: 'text-teal-600 dark:text-teal-400',
          accent: 'text-teal-600 dark:text-teal-400'
        };
      case 'charity':
        return {
          card: 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-700/60 hover:border-rose-500',
          badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200 border border-rose-300',
          iconBox: 'bg-rose-600 text-white shadow-rose-600/20',
          text: 'text-rose-950 dark:text-rose-200 group-hover:text-rose-600',
          arabic: 'text-rose-600 dark:text-rose-400',
          accent: 'text-rose-600 dark:text-rose-400'
        };
      case 'patience':
        return {
          card: 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-700/60 hover:border-purple-500',
          badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 border border-purple-300',
          iconBox: 'bg-purple-600 text-white shadow-purple-600/20',
          text: 'text-purple-950 dark:text-purple-200 group-hover:text-purple-600',
          arabic: 'text-purple-600 dark:text-purple-400',
          accent: 'text-purple-600 dark:text-purple-400'
        };
      case 'justice':
        return {
          card: 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-700/60 hover:border-indigo-500',
          badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200 border border-indigo-300',
          iconBox: 'bg-indigo-600 text-white shadow-indigo-600/20',
          text: 'text-indigo-950 dark:text-indigo-200 group-hover:text-indigo-600',
          arabic: 'text-indigo-600 dark:text-indigo-400',
          accent: 'text-indigo-600 dark:text-indigo-400'
        };
      case 'creation':
        return {
          card: 'bg-sky-50/50 dark:bg-sky-950/20 border-sky-300 dark:border-sky-700/60 hover:border-sky-500',
          badge: 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200 border border-sky-300',
          iconBox: 'bg-sky-600 text-white shadow-sky-600/20',
          text: 'text-sky-950 dark:text-sky-200 group-hover:text-sky-600',
          arabic: 'text-sky-600 dark:text-sky-400',
          accent: 'text-sky-600 dark:text-sky-400'
        };
      case 'hereafter':
        return {
          card: 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-300 dark:border-orange-700/60 hover:border-orange-500',
          badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-200 border border-orange-300',
          iconBox: 'bg-orange-600 text-white shadow-orange-600/20',
          text: 'text-orange-950 dark:text-orange-200 group-hover:text-orange-600',
          arabic: 'text-orange-600 dark:text-orange-400',
          accent: 'text-orange-600 dark:text-orange-400'
        };
      default:
        return {
          card: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700/60 hover:border-emerald-500',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border border-emerald-300',
          iconBox: 'bg-emerald-600 text-white shadow-emerald-600/20',
          text: 'text-emerald-950 dark:text-emerald-200 group-hover:text-emerald-600',
          arabic: 'text-emerald-600 dark:text-emerald-400',
          accent: 'text-emerald-600 dark:text-emerald-400'
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Introduction */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300/60">
          <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Curated Thematic Discovery • বিষয়ভিত্তিক কুরআন অনুসন্ধান</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
          কুরআনের বিষয়ভিত্তিক নির্দেশিকা (Topics Explorer)
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] max-w-2xl leading-relaxed">
          পবিত্র কুরআনের প্রধান বিষয়সমূহ, নৈতিক শিক্ষা, নবীগণের ইতিহাস ও দর্শন স্বতন্ত্র রঙে বিন্যস্ত। যেকোনো বক্সে ট্যাপ করে সম্পর্কিত সকল আয়াত অধ্যয়ন করুন।
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="বিষয় খুঁজুন (যেমন: তাওহীদ, ধৈর্য, বিচার, সৃষ্টি)..."
          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-hidden focus:border-emerald-500 shadow-2xs"
        />
      </div>

      {/* Color-Coded Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => {
          const Icon = getTopicIcon(topic.id);
          const theme = getTopicTheme(topic.id);
          return (
            <Link
              key={topic.id}
              href={`/topics/${topic.slug}`}
              className={`p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between space-y-4 group shadow-sm hover:shadow-lg hover:-translate-y-0.5 ${theme.card}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform ${theme.iconBox}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full ${theme.badge}`}>
                    {topic.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <h2 className={`text-lg font-bold transition-colors ${theme.text}`}>
                    {topic.title_en}
                  </h2>
                  <div className="text-xs font-semibold text-[var(--foreground)] font-bangla">
                    {topic.title_bn}
                  </div>
                  <div className={`font-arabic text-base font-bold text-right ${theme.arabic}`}>
                    {topic.title_ar}
                  </div>
                </div>

                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed line-clamp-3">
                  {topic.description_en}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border)]/70 flex items-center justify-between text-xs font-bold">
                <span className={theme.accent}>
                  {topic.verses.length} Curated Ayahs
                </span>
                <span className={`group-hover:translate-x-1 transition-transform flex items-center gap-1 ${theme.accent}`}>
                  <span>আয়াতসমূহ দেখুন</span>
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
