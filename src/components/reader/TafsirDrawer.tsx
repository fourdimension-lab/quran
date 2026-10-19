'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  Bookmark, 
  FileText, 
  Check, 
  Copy, 
  Volume2, 
  Sparkles,
  Link2,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Ayah, TafsirEntry, RelatedAyah } from '@/types/quran';
import { getTafsirForAyah, TAFSIR_SOURCES } from '@/lib/quran-data/tafsir';
import { getRelatedAyahs } from '@/lib/quran-data/related-ayahs';
import { getSurahByNumber } from '@/lib/quran-data/surahs';
import { isAyahBookmarked, saveBookmark, saveNote, getStoredNotes } from '@/lib/storage/user-storage';
import { useAudioPlayer } from '@/lib/audio/audio-player-context';

interface TafsirDrawerProps {
  ayah: Ayah | null;
  onClose: () => void;
  onOpenRelated?: () => void;
  onNavigateToAyah?: (surah: number, ayah: number) => void;
}

export function TafsirDrawer({ ayah, onClose, onOpenRelated, onNavigateToAyah }: TafsirDrawerProps) {
  const [activeAyah, setActiveAyah] = useState<Ayah | null>(ayah);
  const [activeTab, setActiveTab] = useState<'all' | 'tafsir' | 'related' | 'notes'>('all');
  const [selectedSourceId, setSelectedSourceId] = useState('ibn-kathir');
  const [tafsirs, setTafsirs] = useState<TafsirEntry[]>([]);
  const [relatedAyahs, setRelatedAyahs] = useState<RelatedAyah[]>([]);
  const [selectedRelationFilter, setSelectedRelationFilter] = useState<string>('all');
  
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Note taking state
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  const { playAyah } = useAudioPlayer();

  useEffect(() => {
    setActiveAyah(ayah);
  }, [ayah]);

  useEffect(() => {
    if (activeAyah) {
      const list = getTafsirForAyah(activeAyah.surah_number, activeAyah.ayah_number);
      setTafsirs(list);
      
      const related = getRelatedAyahs(activeAyah.surah_number, activeAyah.ayah_number);
      setRelatedAyahs(related);

      setBookmarked(isAyahBookmarked(activeAyah.surah_number, activeAyah.ayah_number));
      
      // Check existing note
      const allNotes = getStoredNotes();
      const existing = allNotes.find((n) => n.surah_number === activeAyah.surah_number && n.ayah_number === activeAyah.ayah_number);
      if (existing) {
        setNoteTitle(existing.title);
        setNoteContent(existing.content);
      } else {
        setNoteTitle(`Reflection on ${activeAyah.surah_number}:${activeAyah.ayah_number}`);
        setNoteContent('');
      }
    }
  }, [activeAyah]);

  if (!activeAyah) return null;

  const surahMeta = getSurahByNumber(activeAyah.surah_number);
  const currentTafsir = tafsirs.find((t) => t.source_id === selectedSourceId) || tafsirs[0];

  const filteredRelated = selectedRelationFilter === 'all'
    ? relatedAyahs
    : relatedAyahs.filter((r) => r.relation_type === selectedRelationFilter);

  const handleToggleBookmark = () => {
    saveBookmark({
      surah_number: activeAyah.surah_number,
      ayah_number: activeAyah.ayah_number,
      note: `Ayah ${activeAyah.surah_number}:${activeAyah.ayah_number}`
    });
    setBookmarked(!bookmarked);
  };

  const handleCopyAyah = () => {
    const textToCopy = `${activeAyah.text_ar}\n\n"${activeAyah.translation_en}"\n\n- Quran [${activeAyah.surah_number}:${activeAyah.ayah_number}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNote = () => {
    if (!noteContent.trim()) return;
    saveNote({
      surah_number: activeAyah.surah_number,
      ayah_number: activeAyah.ayah_number,
      title: noteTitle || `Note on ${activeAyah.surah_number}:${activeAyah.ayah_number}`,
      content: noteContent
    });
    setNoteSaved(true);
    setTimeout(() => {
      setNoteSaved(false);
      setIsAddingNote(false);
    }, 1500);
  };

  const getRelationBadge = (type: RelatedAyah['relation_type']) => {
    switch (type) {
      case 'same_word':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">Same Arabic Word</span>;
      case 'same_root':
        return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">Same Root Letters</span>;
      case 'shared_concept':
        return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">Shared Concept</span>;
      case 'tafsir_cross_reference':
        return <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-bold">Scholarly Cross-Reference</span>;
      case 'legal_moral_principle':
        return <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-bold">Ethical Principle</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[10px] font-bold">Thematic Link</span>;
    }
  };

  const handleSelectRelatedAyah = (rel: RelatedAyah) => {
    setActiveAyah({
      surah_number: rel.surah_number,
      ayah_number: rel.ayah_number,
      text_ar: rel.text_ar,
      translation_en: rel.translation_en,
      translation_bn: rel.translation_bn,
      juz: 1,
      hizb: 1,
      page: 1
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full sm:w-[580px] md:w-[640px] h-full bg-[var(--card)] border-l border-[var(--border)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--card)] sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center font-bold text-xs">
              {activeAyah.surah_number}:{activeAyah.ayah_number}
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--foreground)]">Tafsir & Related Ayahs</h2>
              <span className="text-[11px] text-[var(--muted-foreground)]">
                Surah {surahMeta?.name_en || activeAyah.surah_number} ({activeAyah.surah_number}:{activeAyah.ayah_number})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => playAyah(activeAyah.surah_number, activeAyah.ayah_number)}
              className="p-2 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors"
              title="Recite Ayah"
            >
              <Volume2 className="w-4 h-4 text-[var(--primary)]" />
            </button>
            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-lg transition-colors ${
                bookmarked ? 'text-[var(--gold)] bg-[var(--gold-light)]' : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
              }`}
              title={bookmarked ? 'Bookmarked' : 'Add Bookmark'}
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyAyah}
              className="p-2 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors"
              title="Copy Ayah"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] ml-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Selected Verse Spotlight */}
        <div className="p-4 bg-[var(--primary-light)]/20 border-b border-[var(--border)] space-y-2">
          <p className="font-arabic text-xl sm:text-2xl text-[var(--foreground)] text-right leading-loose select-text" dir="rtl">
            {activeAyah.text_ar} <span className="text-[var(--primary)] mr-1">۝{activeAyah.ayah_number}</span>
          </p>
          <p className="text-xs text-[var(--foreground)]/90 italic">
            &quot;{activeAyah.translation_en}&quot;
          </p>
          <p className="text-xs text-[var(--foreground)]/90 font-bangla">
            &quot;{activeAyah.translation_bn}&quot;
          </p>
          
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('related')}
              className="px-2.5 py-1 rounded-md bg-[var(--card)] border border-[var(--border)] text-xs font-semibold text-[var(--primary)] hover:border-[var(--primary)] flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Link2 className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>{relatedAyahs.length} Related Ayahs</span>
            </button>
            <button
              onClick={() => setIsAddingNote(!isAddingNote)}
              className="px-2.5 py-1 rounded-md bg-[var(--card)] border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--muted)] flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>{isAddingNote ? 'Cancel Note' : 'Add Note'}</span>
            </button>
            {onNavigateToAyah && (
              <button
                onClick={() => {
                  onNavigateToAyah(activeAyah.surah_number, activeAyah.ayah_number);
                  onClose();
                }}
                className="px-2.5 py-1 rounded-md bg-[var(--card)] border border-[var(--border)] text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1.5 transition-colors ml-auto"
                title="Scroll to this Ayah in reader"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Jump in Reader</span>
              </button>
            )}
          </div>
        </div>

        {/* Private Note Editor (When active) */}
        {isAddingNote && (
          <div className="p-4 border-b border-[var(--border)] bg-[var(--background)] space-y-2 animate-in slide-in-from-top duration-150">
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Note title..."
              className="w-full text-xs font-semibold p-2 rounded-lg border border-[var(--border)] bg-[var(--card)] focus:outline-hidden"
            />
            <textarea
              rows={3}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write your personal study reflection or note on this Ayah..."
              className="w-full text-xs p-2 rounded-lg border border-[var(--border)] bg-[var(--card)] focus:outline-hidden"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleSaveNote}
                className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:bg-[var(--primary-hover)] flex items-center gap-1 shadow-xs"
              >
                {noteSaved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{noteSaved ? 'Saved!' : 'Save Note'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-[var(--border)] bg-[var(--card)] px-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-[var(--primary)] text-[var(--primary)]'
                : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            All Insights
          </button>
          <button
            onClick={() => setActiveTab('tafsir')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'tafsir'
                ? 'border-[var(--primary)] text-[var(--primary)]'
                : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tafsir Exegesis</span>
          </button>
          <button
            onClick={() => setActiveTab('related')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'related'
                ? 'border-[var(--primary)] text-[var(--primary)]'
                : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Related Ayahs ({relatedAyahs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'border-[var(--primary)] text-[var(--primary)]'
                : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Notes</span>
          </button>
        </div>

        {/* Tafsir Source Switcher (Visible in 'all' and 'tafsir' tabs) */}
        {(activeTab === 'all' || activeTab === 'tafsir') && (
          <div className="flex border-b border-[var(--border)] bg-[var(--background)] px-4 py-1.5 gap-2 overflow-x-auto text-xs">
            <span className="text-[11px] font-semibold text-[var(--muted-foreground)] py-1 flex items-center">
              Source:
            </span>
            {TAFSIR_SOURCES.map((source) => (
              <button
                key={source.id}
                onClick={() => setSelectedSourceId(source.id)}
                className={`py-1 px-2.5 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                  selectedSourceId === source.id
                    ? 'bg-[var(--primary)] text-white shadow-2xs'
                    : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                {source.name}
              </button>
            ))}
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          
          {/* SECTION 1: TAFSIR EXEGESIS */}
          {(activeTab === 'all' || activeTab === 'tafsir') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-[var(--border)]/60">
                <span className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[var(--primary)]" />
                  <span>{currentTafsir?.source_name || 'Tafsir Commentary'}</span>
                </span>
                <span className="text-[var(--muted-foreground)]">{currentTafsir?.author}</span>
              </div>

              {currentTafsir ? (
                <>
                  <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] text-sm leading-relaxed text-[var(--foreground)] whitespace-pre-line font-bangla">
                    {currentTafsir.text}
                  </div>

                  {/* Asbab al-Nuzul */}
                  {currentTafsir.asbab_al_nuzul && (
                    <div className="p-4 rounded-xl bg-[var(--gold-light)]/40 border border-[var(--gold)]/30 space-y-1.5">
                      <div className="text-xs font-bold text-[var(--gold-foreground)] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
                        <span>Context of Revelation (Asbab al-Nuzul)</span>
                      </div>
                      <p className="text-xs text-[var(--foreground)] leading-relaxed">
                        {currentTafsir.asbab_al_nuzul}
                      </p>
                    </div>
                  )}

                  {/* Linguistic Notes */}
                  {currentTafsir.linguistic_notes && (
                    <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-1.5">
                      <div className="text-xs font-bold text-[var(--primary)] flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Linguistic Analysis & Grammar</span>
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                        {currentTafsir.linguistic_notes}
                      </p>
                    </div>
                  )}

                  {/* Authentic Hadith References */}
                  {currentTafsir.authentic_hadith_refs && currentTafsir.authentic_hadith_refs.length > 0 && (
                    <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-2">
                      <div className="text-xs font-bold text-[var(--foreground)]">
                        Authentic Hadith References
                      </div>
                      <ul className="space-y-1.5">
                        {currentTafsir.authentic_hadith_refs.map((ref, idx) => (
                          <li key={idx} className="text-xs text-[var(--muted-foreground)] flex items-start gap-1.5">
                            <span className="text-[var(--primary)]">•</span>
                            <span>{ref}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-8 text-center text-xs text-[var(--muted-foreground)]">
                  Commentary for this selection is being synchronized from canonical repositories.
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: RELATED AYAHS & THEMATIC CONNECTIONS */}
          {(activeTab === 'all' || activeTab === 'related') && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between pb-1 border-b border-[var(--border)]/60">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-[var(--gold)]" />
                  <h3 className="text-sm font-bold text-[var(--foreground)]">
                    Related Ayahs from the Quran ({relatedAyahs.length})
                  </h3>
                </div>
                {activeTab === 'all' && (
                  <button
                    onClick={() => setActiveTab('related')}
                    className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-0.5"
                  >
                    <span>View with Filters</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {activeTab === 'related' && (
                <div className="flex gap-1.5 overflow-x-auto text-xs pb-1">
                  <button
                    onClick={() => setSelectedRelationFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      selectedRelationFilter === 'all'
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)]'
                    }`}
                  >
                    All ({relatedAyahs.length})
                  </button>
                  <button
                    onClick={() => setSelectedRelationFilter('same_word')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      selectedRelationFilter === 'same_word'
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)]'
                    }`}
                  >
                    Same Word
                  </button>
                  <button
                    onClick={() => setSelectedRelationFilter('shared_concept')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      selectedRelationFilter === 'shared_concept'
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)]'
                    }`}
                  >
                    Shared Concept
                  </button>
                </div>
              )}

              {filteredRelated.length > 0 ? (
                <div className="space-y-3">
                  {filteredRelated.map((rel, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]/60 space-y-2.5 transition-all shadow-2xs group"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[var(--foreground)]">
                            Surah {rel.surah_number}:{rel.ayah_number}
                          </span>
                          {getRelationBadge(rel.relation_type)}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSelectRelatedAyah(rel)}
                            className="px-2 py-1 rounded-md bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white text-[11px] font-semibold transition-colors flex items-center gap-1"
                            title="Load Tafsir for this related Ayah"
                          >
                            <span>Study Tafsir</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                          {onNavigateToAyah && (
                            <button
                              onClick={() => {
                                onNavigateToAyah(rel.surah_number, rel.ayah_number);
                                onClose();
                              }}
                              className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                              title="Go to verse in reader"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Arabic Verse */}
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

                      {/* Scholarly Explanation */}
                      <div className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)]/70 text-[11px] text-[var(--muted-foreground)]">
                        <span className="font-semibold text-[var(--foreground)]">Thematic Context: </span>
                        {rel.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-[var(--muted-foreground)]">
                  No related Ayahs match the active filter.
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: NOTES & REFLECTIONS */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-[var(--border)]/60">
                <span className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[var(--gold)]" />
                  <span>Personal Study Notes on Ayah {activeAyah.surah_number}:{activeAyah.ayah_number}</span>
                </span>
              </div>

              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-3">
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Reflection title..."
                  className="w-full text-xs font-semibold p-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] focus:outline-hidden"
                />
                <textarea
                  rows={6}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Record your takeaways, vocabulary observations, or spiritual reflections..."
                  className="w-full text-xs p-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] focus:outline-hidden leading-relaxed"
                />
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[11px] text-[var(--muted-foreground)]">
                    Notes are saved securely in your local browser storage.
                  </span>
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold hover:bg-[var(--primary-hover)] flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    {noteSaved ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{noteSaved ? 'Saved to My Study!' : 'Save Reflection'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Notice */}
        <div className="p-3 bg-[var(--muted)] border-t border-[var(--border)] text-[11px] text-[var(--muted-foreground)] flex items-center justify-between">
          <span>Classical Tafsir sources are cited with strict scholarly attribution.</span>
          <span className="font-semibold text-[var(--primary)]">{relatedAyahs.length} connections mapped</span>
        </div>
      </div>
    </div>
  );
}
