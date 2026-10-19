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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Introduction */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Curated Thematic Discovery</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Quran Topic Explorer
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
          Explore the major themes, moral principles, theology, and historical narratives of the Holy Quran categorized with verified scholarly references.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search topics (e.g. Tawhid, Patience, Justice, সৃষ্টি)..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-hidden focus:border-[var(--primary)]"
        />
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => {
          const Icon = getTopicIcon(topic.id);
          return (
            <Link
              key={topic.id}
              href={`/topics/${topic.slug}`}
              className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                    {topic.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                    {topic.title_en}
                  </h2>
                  <div className="text-xs font-semibold text-[var(--foreground)]/80 font-bangla">
                    {topic.title_bn}
                  </div>
                  <div className="font-arabic text-sm text-[var(--primary)] text-right">
                    {topic.title_ar}
                  </div>
                </div>

                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed line-clamp-3">
                  {topic.description_en}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--primary)]">
                  {topic.verses.length} Curated Ayahs
                </span>
                <span className="font-semibold text-[var(--primary)] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Explore Topic</span>
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
