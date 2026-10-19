'use client';

import React, { useState, useEffect, useTransition, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Link2, 
  Sparkles, 
  Volume2, 
  Bookmark, 
  Copy, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  ExternalLink,
  Share2,
  Compass,
  Layers,
  FileText
} from 'lucide-react';
import { SURAHS_DATA, getSurahByNumber } from '@/lib/quran-data/surahs';
import { getSurahAyahs } from '@/lib/quran-data/quran-service';
import { getTafsirForAyah, TAFSIR_SOURCES } from '@/lib/quran-data/tafsir';
import { getRelatedAyahs } from '@/lib/quran-data/related-ayahs';
import { Ayah, TafsirEntry, RelatedAyah } from '@/types/quran';
import { useAudioPlayer } from '@/lib/audio/audio-player-context';
import { isAyahBookmarked, saveBookmark, saveNote } from '@/lib/storage/user-storage';

function TafsirContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSurah = Number(searchParams.get('surah')) || 1;
  const initialAyah = Number(searchParams.get('ayah')) || 1;

  const [surahNumber, setSurahNumber] = useState(initialSurah);
  const [ayahNumber, setAyahNumber] = useState(initialAyah);
  const [currentAyah, setCurrentAyah] = useState<Ayah | null>(null);
  const [tafsirList, setTafsirList] = useState<TafsirEntry[]>([]);
  const [relatedAyahs, setRelatedAyahs] = useState<RelatedAyah[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState('ibn-kathir');
  const [selectedRelationFilter, setSelectedRelationFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Private note state
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  const { playAyah } = useAudioPlayer();
  const surahMeta = getSurahByNumber(surahNumber) || SURAHS_DATA[0];

  // Sync state with URL search params when changed
  useEffect(() => {
    const s = Number(searchParams.get('surah'));
    const a = Number(searchParams.get('ayah'));
    if (s && s >= 1 && s <= 114) {
      setSurahNumber(s);
      if (a && a >= 1) {
        setAyahNumber(a);
      }
    }
  }, [searchParams]);

  // Load Ayah, Tafsir, and Related Ayahs
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getSurahAyahs(surahNumber)
      .then((ayahs) => {
        if (!isMounted) return;
        const target = ayahs.find((a) => a.ayah_number === ayahNumber) || ayahs[0];
        setCurrentAyah(target);
        
        const tafsirs = getTafsirForAyah(surahNumber, target.ayah_number);
        setTafsirList(tafsirs);

        const related = getRelatedAyahs(surahNumber, target.ayah_number);
        setRelatedAyahs(related);

        setBookmarked(isAyahBookmarked(surahNumber, target.ayah_number));
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn('Failed to load tafsir data:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [surahNumber, ayahNumber]);

  const handleSelectAyah = (s: number, a: number) => {
    setSurahNumber(s);
    setAyahNumber(a);
    router.push(`/tafsir?surah=${s}&ayah=${a}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousAyah = () => {
    if (ayahNumber > 1) {
      handleSelectAyah(surahNumber, ayahNumber - 1);
    } else if (surahNumber > 1) {
      const prevSurah = getSurahByNumber(surahNumber - 1);
      if (prevSurah) {
        handleSelectAyah(surahNumber - 1, prevSurah.verses_count);
      }
    }
  };

  const handleNextAyah = () => {
    if (ayahNumber < surahMeta.verses_count) {
      handleSelectAyah(surahNumber, ayahNumber + 1);
    } else if (surahNumber < 114) {
      handleSelectAyah(surahNumber + 1, 1);
    }
  };

  const handleCopy = () => {
    if (!currentAyah) return;
    const text = `${currentAyah.text_ar}\n\n"${currentAyah.translation_en}"\n\n- Quran [${surahNumber}:${currentAyah.ayah_number}]`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleBookmark = () => {
    if (!currentAyah) return;
    saveBookmark({
      surah_number: surahNumber,
      ayah_number: currentAyah.ayah_number,
      note: `Tafsir Study: ${surahNumber}:${currentAyah.ayah_number}`
    });
    setBookmarked(!bookmarked);
  };

  const handleSaveNote = () => {
    if (!currentAyah || !noteContent.trim()) return;
    saveNote({
      surah_number: surahNumber,
      ayah_number: currentAyah.ayah_number,
      title: noteTitle || `Reflection on ${surahNumber}:${currentAyah.ayah_number}`,
      content: noteContent
    });
    setNoteSaved(true);
    setTimeout(() => {
      setNoteSaved(false);
      setIsAddingNote(false);
    }, 1500);
  };

  const currentTafsir = tafsirList.find((t) => t.source_id === selectedSourceId) || tafsirList[0];

  const filteredRelated = selectedRelationFilter === 'all'
    ? relatedAyahs
    : relatedAyahs.filter((r) => r.relation_type === selectedRelationFilter);

  const getRelationBadge = (type: RelatedAyah['relation_type']) => {
    switch (type) {
      case 'same_word':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">Same Arabic Word</span>;
      case 'same_root':
        return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">Same Root Letters</span>;
      case 'shared_concept':
        return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">Shared Concept</span>;
      case 'tafsir_cross_reference':
        return <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-bold">Cross-Reference</span>;
      case 'legal_moral_principle':
        return <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-bold">Ethical Principle</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[10px] font-bold">Thematic Link</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white shadow-lg space-y-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-[var(--gold-light)] mb-2">
            <BookOpen className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Tafsir, Exegesis & Thematic Relations</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Quran Tafsir & Ayah Study
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            Delve into authenticated classical commentaries from Ibn Kathir, Ahsanul Bayaan, and Jalalayn, while discovering interconnected Ayahs sharing the exact roots, words, and theological themes.
          </p>
        </div>
      </div>

      {/* Surah & Ayah Selector Bar */}
      <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Surah Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider block">
              Select Surah
            </label>
            <select
              value={surahNumber}
              onChange={(e) => handleSelectAyah(Number(e.target.value), 1)}
              className="text-xs sm:text-sm font-semibold p-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-hidden focus:border-[var(--primary)]"
            >
              {SURAHS_DATA.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.name_en} ({s.name_ar}) - {s.verses_count} Verses
                </option>
              ))}
            </select>
          </div>

          {/* Ayah Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider block">
              Select Ayah
            </label>
            <select
              value={ayahNumber}
              onChange={(e) => handleSelectAyah(surahNumber, Number(e.target.value))}
              className="text-xs sm:text-sm font-semibold p-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-hidden focus:border-[var(--primary)]"
            >
              {Array.from({ length: surahMeta.verses_count }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  Ayah {num} of {surahMeta.verses_count}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Prev / Next Ayah Controls */}
        <div className="flex items-center gap-2 pt-2 sm:pt-0">
          <button
            onClick={handlePreviousAyah}
            disabled={surahNumber === 1 && ayahNumber === 1}
            className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] disabled:opacity-40 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>
          
          <div className="px-3 py-1.5 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] font-bold text-xs">
            {surahNumber}:{ayahNumber}
          </div>

          <button
            onClick={handleNextAyah}
            disabled={surahNumber === 114 && ayahNumber === surahMeta.verses_count}
            className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] disabled:opacity-40 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <Link
            href={`/read/${surahNumber}#ayah-${surahNumber}-${ayahNumber}`}
            className="px-3 py-2 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors ml-1"
            title="Read in full Surah context"
          >
            <span>Reader</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[var(--muted-foreground)]">Loading classical Tafsir and thematic connections...</p>
        </div>
      ) : currentAyah ? (
        <div className="space-y-8">
          
          {/* Spotlight Ayah Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-md space-y-6">
            
            {/* Action Tools */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] font-bold">
                  {surahMeta.name_en} {surahNumber}:{currentAyah.ayah_number}
                </span>
                <span className="text-[var(--muted-foreground)]">
                  Juz {currentAyah.juz} • Page {currentAyah.page}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => playAyah(surahNumber, currentAyah.ayah_number)}
                  className="p-2 rounded-xl bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors"
                  title="Listen to recitation"
                >
                  <Volume2 className="w-4 h-4 text-[var(--primary)]" />
                </button>
                <button
                  onClick={handleToggleBookmark}
                  className={`p-2 rounded-xl border border-[var(--border)] transition-colors ${
                    bookmarked ? 'bg-[var(--gold-light)] text-[var(--gold)] border-[var(--gold)]' : 'bg-[var(--background)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
                  }`}
                  title={bookmarked ? 'Bookmarked' : 'Add Bookmark'}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-xl bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors"
                  title="Copy Ayah"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsAddingNote(!isAddingNote)}
                  className="px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>{isAddingNote ? 'Cancel' : 'Reflection'}</span>
                </button>
              </div>
            </div>

            {/* Note Editor */}
            {isAddingNote && (
              <div className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-3 animate-in slide-in-from-top duration-200">
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Reflection title..."
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-hidden"
                />
                <textarea
                  rows={3}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Record your notes or reflections on this Ayah..."
                  className="w-full text-xs p-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-hidden"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold hover:bg-[var(--primary-hover)] flex items-center gap-1.5 shadow-xs"
                  >
                    {noteSaved ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{noteSaved ? 'Saved to My Study!' : 'Save Reflection'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Arabic Verse */}
            <div className="py-2 text-right" dir="rtl">
              <p className="font-arabic text-2xl sm:text-4xl text-[var(--foreground)] leading-loose select-text">
                {currentAyah.text_ar} <span className="text-[var(--primary)] select-none mr-2">۝{currentAyah.ayah_number}</span>
              </p>
            </div>

            {/* Translations */}
            <div className="space-y-3 pt-3 border-t border-[var(--border)]/60 text-left">
              {currentAyah.transliteration && (
                <p className="text-xs sm:text-sm text-[var(--primary)] italic font-medium">
                  {currentAyah.transliteration}
                </p>
              )}
              <p className="text-sm sm:text-base text-[var(--foreground)] leading-relaxed font-sans">
                {currentAyah.translation_en}
              </p>
              <p className="text-sm sm:text-base text-[var(--foreground)]/90 leading-relaxed font-bangla">
                {currentAyah.translation_bn}
              </p>
            </div>

            {/* Word-by-word quick chips */}
            {currentAyah.words && currentAyah.words.length > 0 && (
              <div className="pt-4 border-t border-[var(--border)]/40">
                <span className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider block mb-2">
                  Word-by-Word Breakdown
                </span>
                <div className="flex flex-wrap flex-row-reverse gap-2" dir="rtl">
                  {currentAyah.words.map((w) => (
                    <div
                      key={w.id}
                      className="px-2.5 py-1.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-center flex flex-col items-center"
                    >
                      <span className="font-arabic text-sm text-[var(--foreground)]">{w.arabic}</span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">{w.translation_en || w.transliteration}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dual Column Layout: Tafsir Commentary & Related Ayahs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Primary Left Column: Tafsir Exegesis (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Tafsir Header & Source Tabs */}
              <div className="p-5 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                    <div>
                      <h2 className="text-base font-bold text-[var(--foreground)]">Classical Tafsir</h2>
                      <span className="text-[11px] text-[var(--muted-foreground)]">Scholarly Exegesis & Commentary</span>
                    </div>
                  </div>
                </div>

                {/* Source Selection Buttons */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {TAFSIR_SOURCES.map((source) => (
                    <button
                      key={source.id}
                      onClick={() => setSelectedSourceId(source.id)}
                      className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                        selectedSourceId === source.id
                          ? 'bg-[var(--primary)] text-white shadow-xs'
                          : 'bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      {source.name}
                    </button>
                  ))}
                </div>

                {/* Tafsir Body */}
                {currentTafsir ? (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                      <span className="font-bold text-[var(--foreground)]">{currentTafsir.source_name}</span>
                      <span>{currentTafsir.author}</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[var(--background)] border border-[var(--border)] text-sm sm:text-base leading-relaxed text-[var(--foreground)] whitespace-pre-line font-bangla">
                      {currentTafsir.text}
                    </div>

                    {/* Asbab al-Nuzul */}
                    {currentTafsir.asbab_al_nuzul && (
                      <div className="p-4 rounded-2xl bg-[var(--gold-light)]/40 border border-[var(--gold)]/30 space-y-2">
                        <div className="text-xs font-bold text-[var(--gold-foreground)] flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                          <span>Context of Revelation (Asbab al-Nuzul)</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed">
                          {currentTafsir.asbab_al_nuzul}
                        </p>
                      </div>
                    )}

                    {/* Linguistic Notes */}
                    {currentTafsir.linguistic_notes && (
                      <div className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-1.5">
                        <div className="text-xs font-bold text-[var(--primary)] flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Linguistic & Morphological Analysis</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                          {currentTafsir.linguistic_notes}
                        </p>
                      </div>
                    )}

                    {/* Authentic Hadith References */}
                    {currentTafsir.authentic_hadith_refs && currentTafsir.authentic_hadith_refs.length > 0 && (
                      <div className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-2">
                        <span className="text-xs font-bold text-[var(--foreground)] block">
                          Authentic Hadith References
                        </span>
                        <ul className="space-y-2">
                          {currentTafsir.authentic_hadith_refs.map((ref, idx) => (
                            <li key={idx} className="text-xs sm:text-sm text-[var(--muted-foreground)] flex items-start gap-2">
                              <span className="text-[var(--primary)] font-bold">•</span>
                              <span>{ref}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-[var(--muted-foreground)]">
                    No commentary found for this specific source.
                  </div>
                )}
              </div>
            </div>

            {/* Secondary Right Column: Related Ayahs Discovery (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-5 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-[var(--gold)]" />
                    <div>
                      <h2 className="text-base font-bold text-[var(--foreground)]">Related Ayahs</h2>
                      <span className="text-[11px] text-[var(--muted-foreground)]">
                        {relatedAyahs.length} Cross-Quranic Connections
                      </span>
                    </div>
                  </div>
                </div>

                {/* Filter Chips */}
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button
                    onClick={() => setSelectedRelationFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      selectedRelationFilter === 'all'
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)]'
                    }`}
                  >
                    All ({relatedAyahs.length})
                  </button>
                  <button
                    onClick={() => setSelectedRelationFilter('same_word')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      selectedRelationFilter === 'same_word'
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)]'
                    }`}
                  >
                    Same Word
                  </button>
                  <button
                    onClick={() => setSelectedRelationFilter('shared_concept')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      selectedRelationFilter === 'shared_concept'
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)]'
                    }`}
                  >
                    Shared Concept
                  </button>
                </div>

                {/* Related Ayahs List */}
                {filteredRelated.length > 0 ? (
                  <div className="space-y-4">
                    {filteredRelated.map((rel, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]/60 space-y-3 transition-all shadow-2xs group"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[var(--foreground)]">
                            Surah {rel.surah_number}:{rel.ayah_number}
                          </span>
                          {getRelationBadge(rel.relation_type)}
                        </div>

                        {/* Arabic text */}
                        <p className="font-arabic text-lg text-[var(--foreground)] text-right leading-relaxed" dir="rtl">
                          {rel.text_ar} <span className="text-[var(--primary)] text-sm mr-1">۝{rel.ayah_number}</span>
                        </p>

                        {/* Translations */}
                        <div className="space-y-1 text-xs">
                          <p className="text-[var(--foreground)]/90 leading-relaxed font-sans">
                            {rel.translation_en}
                          </p>
                          <p className="text-[var(--foreground)]/80 leading-relaxed font-bangla">
                            {rel.translation_bn}
                          </p>
                        </div>

                        {/* Explanation Context */}
                        <div className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)]/70 text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                          <span className="font-semibold text-[var(--foreground)]">Connection: </span>
                          {rel.explanation}
                        </div>

                        {/* Study button */}
                        <div className="pt-1 flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSelectAyah(rel.surah_number, rel.ayah_number)}
                            className="px-3 py-1.5 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
                          >
                            <span>Study This Ayah</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-[var(--muted-foreground)]">
                    No related Ayahs found matching this filter.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function TafsirPage() {
  return (
    <Suspense fallback={
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[var(--muted-foreground)]">Loading Tafsir Section...</p>
      </div>
    }>
      <TafsirContent />
    </Suspense>
  );
}
