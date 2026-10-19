'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ShieldCheck, Heart, ExternalLink, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] text-xs mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-arabic font-bold text-lg">
                قرآن
              </div>
              <span className="text-base font-bold text-[var(--foreground)] tracking-tight">Al-Quran Platform</span>
            </div>
            <p className="leading-relaxed">
              An intelligent, interactive, and scholarly web platform designed for authentic reading, deep reflection, and vocabulary mastery of the Holy Quran.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[var(--foreground)] font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Verified Uthmani Text & Classical Exegeses
            </div>
          </div>

          {/* Quick Study Navigation */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-[var(--foreground)] tracking-wider uppercase">Study Tools</h3>
            <ul className="space-y-1.5">
              <li><Link href="/read" className="hover:text-[var(--primary)] transition-colors">114 Surahs Directory</Link></li>
              <li><Link href="/word-by-word" className="hover:text-[var(--primary)] transition-colors">Clickable Word-by-Word</Link></li>
              <li><Link href="/topics" className="hover:text-[var(--primary)] transition-colors">Quran Topics Explorer</Link></li>
              <li><Link href="/miracles" className="hover:text-[var(--primary)] transition-colors">Signs & Reflections</Link></li>
              <li><Link href="/listen" className="hover:text-[var(--primary)] transition-colors">Reciters & Audio Player</Link></li>
              <li><Link href="/learn" className="hover:text-[var(--primary)] transition-colors">Vocabulary & Flashcards</Link></li>
            </ul>
          </div>

          {/* Canonical Data & Attributions */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-[var(--foreground)] tracking-wider uppercase">Data Provenance</h3>
            <ul className="space-y-1.5">
              <li><span className="text-[var(--foreground)]">Text:</span> Tanzil.net Verified Uthmani script</li>
              <li><span className="text-[var(--foreground)]">English:</span> Saheeh International</li>
              <li><span className="text-[var(--foreground)]">Bangla:</span> Taisirul Quran / Muhiuddin Khan</li>
              <li><span className="text-[var(--foreground)]">Tafsir:</span> Ibn Kathir & Ahsanul Bayaan</li>
              <li><span className="text-[var(--foreground)]">Recitations:</span> EveryAyah & Quran.com CDN</li>
              <li><span className="text-[var(--foreground)]">Morphology:</span> Quranic Arabic Corpus</li>
            </ul>
          </div>

          {/* Governance & Admin */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-[var(--foreground)] tracking-wider uppercase">Platform & Trust</h3>
            <ul className="space-y-1.5">
              <li><Link href="/ai-study" className="hover:text-[var(--primary)] transition-colors">AI Assistant & RAG Safety</Link></li>
              <li><Link href="/study" className="hover:text-[var(--primary)] transition-colors">Personal Notes & Bookmarks</Link></li>
              <li><Link href="/admin" className="hover:text-[var(--primary)] flex items-center gap-1 transition-colors">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Admin & Review Portal</span>
              </Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-[11px]">
            &copy; 2026 Al-Quran Platform. Free, ad-free, open Islamic knowledge for the Ummah worldwide.
          </p>
          <p className="text-[11px] text-[var(--muted-foreground)]">
            Canonical Quranic text remains immutable. AI interpretations are strictly educational and do not constitute religious Fatwas.
          </p>
        </div>
      </div>
    </footer>
  );
}
