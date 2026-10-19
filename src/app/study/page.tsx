'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bookmark, 
  FileText, 
  GraduationCap, 
  History, 
  Trash2, 
  Download, 
  ArrowRight, 
  BookOpen,
  Calendar,
  Flame
} from 'lucide-react';
import { 
  getStoredBookmarks, 
  getStoredNotes, 
  getStoredVocab, 
  getStoredProgress,
  deleteNote,
  saveBookmark
} from '@/lib/storage/user-storage';
import { 
  UserBookmark, 
  UserNote, 
  UserVocabularyItem, 
  ReadingProgress 
} from '@/types/quran';
import { getSurahByNumber } from '@/lib/quran-data/surahs';

export default function StudyLibraryPage() {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'notes' | 'vocab' | 'history'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<UserBookmark[]>([]);
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [vocab, setVocab] = useState<UserVocabularyItem[]>([]);
  const [progress, setProgress] = useState<ReadingProgress>(getStoredProgress());

  useEffect(() => {
    setBookmarks(getStoredBookmarks());
    setNotes(getStoredNotes());
    setVocab(getStoredVocab());
    setProgress(getStoredProgress());
  }, []);

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    setNotes(notes.filter((n) => n.id !== id));
  };

  const handleRemoveBookmark = (surah: number, ayah: number) => {
    saveBookmark({ surah_number: surah, ayah_number: ayah });
    setBookmarks(bookmarks.filter((b) => !(b.surah_number === surah && b.ayah_number === ayah)));
  };

  const handleExportData = () => {
    const data = {
      bookmarks,
      notes,
      vocab,
      progress,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alquran_study_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
            My Quran Study Library
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            Your private bookmarks, personal reflections, saved vocabulary, and reading progress.
          </p>
        </div>

        <button
          onClick={handleExportData}
          className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-xs font-semibold text-[var(--foreground)] flex items-center gap-2 shadow-xs transition-colors"
        >
          <Download className="w-4 h-4 text-[var(--primary)]" />
          <span>Export Study Data</span>
        </button>
      </div>

      {/* Reading Progress & Streak Hero Card */}
      <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-md grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-[var(--muted-foreground)]">Last Read Position</div>
            <div className="text-base font-bold text-[var(--foreground)]">
              Surah {progress.last_read_surah}, Ayah {progress.last_read_ayah}
            </div>
            <Link
              href={`/read/${progress.last_read_surah}#ayah-${progress.last_read_surah}-${progress.last_read_ayah}`}
              className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1 mt-0.5"
            >
              <span>Resume Reading</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="text-xs text-[var(--muted-foreground)]">Reading Streak</div>
            <div className="text-base font-bold text-[var(--foreground)]">
              {progress.streak_days} Consecutive Days
            </div>
            <div className="text-[11px] text-[var(--muted-foreground)]">Keep reflecting daily</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center font-bold">
            <GraduationCap className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div className="text-xs text-[var(--muted-foreground)]">Vocabulary Items</div>
            <div className="text-base font-bold text-[var(--foreground)]">
              {vocab.length} Words Saved
            </div>
            <Link href="/learn" className="text-xs font-semibold text-[var(--primary)] hover:underline">
              Practice Flashcards
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border)] gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'bookmarks'
              ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
              : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Bookmarks ({bookmarks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'notes'
              ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
              : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Personal Notes ({notes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vocab')}
          className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'vocab'
              ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
              : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Saved Words ({vocab.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'bookmarks' && (
          <div className="space-y-3">
            {bookmarks.length === 0 ? (
              <div className="py-16 text-center text-xs text-[var(--muted-foreground)]">
                No bookmarks yet. Click the bookmark icon on any Ayah while reading to save it here.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bookmarks.map((b) => {
                  const sMeta = getSurahByNumber(b.surah_number);
                  return (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] flex items-center justify-between shadow-xs"
                    >
                      <div>
                        <div className="text-sm font-bold text-[var(--foreground)]">
                          Surah {sMeta?.name_en || b.surah_number}, Ayah {b.ayah_number}
                        </div>
                        <div className="text-xs text-[var(--muted-foreground)] font-bangla">
                          {sMeta?.name_bn}
                        </div>
                        {b.note && <div className="text-[11px] text-[var(--primary)] mt-1">{b.note}</div>}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/read/${b.surah_number}#ayah-${b.surah_number}-${b.ayah_number}`}
                          className="px-3 py-1.5 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white text-xs font-semibold transition-colors"
                        >
                          Read
                        </Link>
                        <button
                          onClick={() => handleRemoveBookmark(b.surah_number, b.ayah_number)}
                          className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-red-500 hover:bg-[var(--muted)]"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-3">
            {notes.length === 0 ? (
              <div className="py-16 text-center text-xs text-[var(--muted-foreground)]">
                No private study notes yet. Open the Tafsir drawer on any Ayah to write notes.
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-bold text-[var(--primary)]">
                        Surah {n.surah_number}, Ayah {n.ayah_number} — {n.title}
                      </div>
                      <button
                        onClick={() => handleDeleteNote(n.id)}
                        className="text-[var(--muted-foreground)] hover:text-red-500"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-line">
                      {n.content}
                    </p>
                    <div className="pt-1 text-[10px] text-[var(--muted-foreground)] flex items-center justify-between">
                      <span>Updated: {new Date(n.updated_at).toLocaleDateString()}</span>
                      <Link
                        href={`/read/${n.surah_number}#ayah-${n.surah_number}-${n.ayah_number}`}
                        className="font-semibold text-[var(--primary)] hover:underline"
                      >
                        View in Quran Reader &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'vocab' && (
          <div className="space-y-3">
            {vocab.length === 0 ? (
              <div className="py-16 text-center text-xs text-[var(--muted-foreground)]">
                No words saved yet. Click any Arabic word in the Quran reader and select &quot;Save to Flashcards&quot;.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {vocab.map((v) => (
                  <div
                    key={v.id}
                    className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-arabic text-2xl font-bold text-[var(--foreground)]">{v.word_arabic}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)] font-bold">
                        {v.status}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--primary)] italic">{v.transliteration}</div>
                    <div className="text-xs font-semibold text-[var(--foreground)]">{v.translation_en}</div>
                    <div className="text-xs text-[var(--muted-foreground)] font-bangla">{v.translation_bn}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
