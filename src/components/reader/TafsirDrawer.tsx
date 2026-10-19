'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  Bookmark, 
  FileText, 
  Share2, 
  Check, 
  Copy, 
  Volume2, 
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { Ayah, TafsirEntry } from '@/types/quran';
import { getTafsirForAyah, TAFSIR_SOURCES } from '@/lib/quran-data/tafsir';
import { isAyahBookmarked, saveBookmark, saveNote, getStoredNotes } from '@/lib/storage/user-storage';
import { useAudioPlayer } from '@/lib/audio/audio-player-context';

interface TafsirDrawerProps {
  ayah: Ayah | null;
  onClose: () => void;
  onOpenRelated: () => void;
}

export function TafsirDrawer({ ayah, onClose, onOpenRelated }: TafsirDrawerProps) {
  const [selectedSourceId, setSelectedSourceId] = useState('ibn-kathir');
  const [tafsirs, setTafsirs] = useState<TafsirEntry[]>([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Note taking state
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  const { playAyah } = useAudioPlayer();

  useEffect(() => {
    if (ayah) {
      const list = getTafsirForAyah(ayah.surah_number, ayah.ayah_number);
      setTafsirs(list);
      setBookmarked(isAyahBookmarked(ayah.surah_number, ayah.ayah_number));
      
      // Check existing note
      const allNotes = getStoredNotes();
      const existing = allNotes.find((n) => n.surah_number === ayah.surah_number && n.ayah_number === ayah.ayah_number);
      if (existing) {
        setNoteTitle(existing.title);
        setNoteContent(existing.content);
      } else {
        setNoteTitle(`Reflection on ${ayah.surah_number}:${ayah.ayah_number}`);
        setNoteContent('');
      }
    }
  }, [ayah]);

  if (!ayah) return null;

  const currentTafsir = tafsirs.find((t) => t.source_id === selectedSourceId) || tafsirs[0];

  const handleToggleBookmark = () => {
    saveBookmark({
      surah_number: ayah.surah_number,
      ayah_number: ayah.ayah_number,
      note: `Ayah ${ayah.surah_number}:${ayah.ayah_number}`
    });
    setBookmarked(!bookmarked);
  };

  const handleCopyAyah = () => {
    const textToCopy = `${ayah.text_ar}\n\n"${ayah.translation_en}"\n\n- Quran [${ayah.surah_number}:${ayah.ayah_number}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNote = () => {
    if (!noteContent.trim()) return;
    saveNote({
      surah_number: ayah.surah_number,
      ayah_number: ayah.ayah_number,
      title: noteTitle || `Note on ${ayah.surah_number}:${ayah.ayah_number}`,
      content: noteContent
    });
    setNoteSaved(true);
    setTimeout(() => {
      setNoteSaved(false);
      setIsAddingNote(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full sm:w-[540px] md:w-[600px] h-full bg-[var(--card)] border-l border-[var(--border)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--card)] sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center font-bold text-xs">
              {ayah.surah_number}:{ayah.ayah_number}
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--foreground)]">Tafsir & Scholarly Study</h2>
              <span className="text-[11px] text-[var(--muted-foreground)]">Surah {ayah.surah_number}, Ayah {ayah.ayah_number}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => playAyah(ayah.surah_number, ayah.ayah_number)}
              className="p-2 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground)]"
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
              className="p-2 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
              title="Copy Ayah"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Selected Verse Spotlight */}
        <div className="p-4 bg-[var(--primary-light)]/20 border-b border-[var(--border)] space-y-2">
          <p className="font-arabic text-xl sm:text-2xl text-[var(--foreground)] text-right leading-loose">
            {ayah.text_ar}
          </p>
          <p className="text-xs text-[var(--foreground)]/80 italic">
            &quot;{ayah.translation_en}&quot;
          </p>
          <p className="text-xs text-[var(--foreground)]/80 font-bangla">
            &quot;{ayah.translation_bn}&quot;
          </p>
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={onOpenRelated}
              className="px-2.5 py-1 rounded-md bg-[var(--card)] border border-[var(--border)] text-xs font-semibold text-[var(--primary)] hover:border-[var(--primary)] flex items-center gap-1.5 transition-colors"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Discover Related Ayahs</span>
            </button>
            <button
              onClick={() => setIsAddingNote(!isAddingNote)}
              className="px-2.5 py-1 rounded-md bg-[var(--card)] border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--muted)] flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>{isAddingNote ? 'Cancel Note' : 'Add Private Note'}</span>
            </button>
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

        {/* Source Selector Tabs */}
        <div className="flex border-b border-[var(--border)] bg-[var(--card)] px-4 overflow-x-auto">
          {TAFSIR_SOURCES.map((source) => (
            <button
              key={source.id}
              onClick={() => setSelectedSourceId(source.id)}
              className={`py-2.5 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                selectedSourceId === source.id
                  ? 'border-[var(--primary)] text-[var(--primary)]'
                  : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {source.name}
            </button>
          ))}
        </div>

        {/* Tafsir Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {currentTafsir ? (
            <>
              {/* Main Commentary Text */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                  <span className="font-semibold text-[var(--foreground)]">{currentTafsir.source_name}</span>
                  <span>{currentTafsir.author}</span>
                </div>
                <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] text-sm leading-relaxed text-[var(--foreground)] whitespace-pre-line font-bangla">
                  {currentTafsir.text}
                </div>
              </div>

              {/* Asbab al-Nuzul (Occasion of Revelation) */}
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
            <div className="py-12 text-center text-sm text-[var(--muted-foreground)]">
              No commentary recorded for this selection.
            </div>
          )}
        </div>

        {/* Drawer Footer Notice */}
        <div className="p-3 bg-[var(--muted)] border-t border-[var(--border)] text-[11px] text-[var(--muted-foreground)] text-center">
          Classical Tafsir sources are cited with strict attribution.
        </div>
      </div>
    </div>
  );
}
