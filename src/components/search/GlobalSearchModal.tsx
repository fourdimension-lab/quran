'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, BookOpen, ArrowRight, CornerDownLeft } from 'lucide-react';
import { searchQuran } from '@/lib/quran-data/quran-service';
import { Surah, Ayah } from '@/types/quran';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'bn';
}

export function GlobalSearchModal({ isOpen, onClose, language }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ surahs: Surah[]; ayahs: Ayah[] }>({ surahs: [], ayahs: [] });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults({ surahs: [], ayahs: [] });
      return;
    }

    const timer = setTimeout(async () => {
      if (query.trim()) {
        setIsSearching(true);
        try {
          const res = await searchQuran(query.trim());
          setResults(res);
        } catch (err) {
          console.warn('Search error:', err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults({ surahs: [], ayahs: [] });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-3">
          <Search className="w-5 h-5 text-[var(--primary)] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={language === 'bn' ? 'সূরা বা আয়াতের নাম, অর্থ বা আরবী শব্দ লিখুন...' : 'Search Surah name, English/Bangla text, or Arabic word...'}
            className="w-full bg-transparent text-base text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-hidden"
            autoFocus
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="px-2 py-1 text-xs font-medium rounded-md border border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {isSearching && (
            <div className="py-8 text-center text-sm text-[var(--muted-foreground)] animate-pulse">
              Searching canonical Quran dataset...
            </div>
          )}

          {!isSearching && !query && (
            <div className="py-8 text-center space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-[var(--muted-foreground)]/50" />
              <p className="text-sm text-[var(--muted-foreground)]">
                Try searching for <span className="font-semibold text-[var(--primary)]">&quot;Fatihah&quot;</span>, <span className="font-semibold text-[var(--primary)]">&quot;patience&quot;</span>, <span className="font-semibold text-[var(--primary)]">&quot;সবর&quot;</span>, or <span className="font-semibold text-[var(--primary)]">&quot;112&quot;</span>
              </p>
            </div>
          )}

          {!isSearching && query && results.surahs.length === 0 && results.ayahs.length === 0 && (
            <div className="py-8 text-center text-sm text-[var(--muted-foreground)]">
              No exact matches found for &quot;{query}&quot;. Try exploring by Topic or asking the AI Study Assistant.
            </div>
          )}

          {/* Surah Matches */}
          {results.surahs.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                Matching Chapters ({results.surahs.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.surahs.map((s) => (
                  <Link
                    key={s.number}
                    href={`/read/${s.number}`}
                    onClick={onClose}
                    className="p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)] hover:bg-[var(--primary-light)]/40 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] text-xs font-bold flex items-center justify-center">
                        {s.number}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)]">
                          {language === 'bn' ? s.name_bn : s.name_en}
                        </div>
                        <div className="text-[11px] text-[var(--muted-foreground)]">
                          {language === 'bn' ? s.translation_bn : s.translation_en} • {s.verses_count} verses
                        </div>
                      </div>
                    </div>
                    <span className="font-arabic text-base text-[var(--foreground)] group-hover:text-[var(--primary)]">
                      {s.name_ar}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Ayah Matches */}
          {results.ayahs.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                Matching Verses ({results.ayahs.length})
              </span>
              <div className="space-y-2">
                {results.ayahs.map((a) => (
                  <Link
                    key={`${a.surah_number}:${a.ayah_number}`}
                    href={`/read/${a.surah_number}#ayah-${a.surah_number}-${a.ayah_number}`}
                    onClick={onClose}
                    className="block p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)] transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between text-xs text-[var(--primary)] font-semibold">
                      <span>Surah {a.surah_number}, Ayah {a.ayah_number}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="font-arabic text-base text-[var(--foreground)] text-right">
                      {a.text_ar}
                    </p>
                    <p className="text-xs text-[var(--foreground)]/80 line-clamp-2">
                      {language === 'bn' ? a.translation_bn : a.translation_en}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-[var(--muted)] border-t border-[var(--border)] text-[11px] text-[var(--muted-foreground)] flex items-center justify-between">
          <span>Search spans canonical Arabic, English, and Bangla</span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-3 h-3" /> Select to open in Quran Reader
          </span>
        </div>
      </div>
    </div>
  );
}
