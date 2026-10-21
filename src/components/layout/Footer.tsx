'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ShieldCheck, Heart, ExternalLink, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/language/language-context';

export function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] text-xs mt-20 transition-colors font-bangla">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-950 flex items-center justify-center text-white font-arabic font-bold text-xl border border-amber-400/40 shadow-xs">
                <span className="text-amber-300 drop-shadow-sm select-none">قرآن</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold text-[var(--foreground)] tracking-tight">
                  {t('আল-কুরআন প্ল্যাটফর্ম', 'Al-Quran Platform')}
                </span>
                <span className="text-[10px] text-[var(--muted-foreground)] font-arabic">القرآن الكريم • Smart Reader</span>
              </div>
            </div>
            <p className="leading-relaxed text-xs">
              {t(
                'পবিত্র কুরআনের বিশুদ্ধ তিলাওয়াত, শব্দে শব্দে অর্থ ও ব্যাকরণ, নির্ভরযোগ্য তাফসীর এবং আধুনিক এআই চালিত এক অনন্য বাংলা ইসলামিক ওয়েব প্ল্যাটফর্ম।',
                'An intelligent, interactive, and scholarly web platform designed for authentic reading, deep reflection, and vocabulary mastery of the Holy Quran.'
              )}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[var(--foreground)] font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t('প্রামাণ্য উসমানী লিপি ও সহীহ তাফসীর ভিত্তিক', 'Verified Uthmani Text & Classical Exegeses')}</span>
            </div>
            <div className="pt-2">
              <div className="p-3 rounded-2xl bg-[var(--muted)]/70 border border-[var(--border)] space-y-1">
                <div className="text-[11px] font-bold text-[var(--foreground)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Developed by <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">4 Dimension</span></span>
                </div>
                <div className="text-[11px] text-[var(--muted-foreground)]">
                  Founder: <span className="font-bold text-[var(--foreground)]">Sakib Al Rana</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Study Navigation */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-[var(--foreground)] tracking-wider uppercase">
              {t('বিশেষ সেবাসমূহ', 'Study Tools')}
            </h3>
            <ul className="space-y-1.5">
              <li><Link href="/read" className="hover:text-[var(--primary)] transition-colors">{t('১১৪ সূরার তালিকা', '114 Surahs Directory')}</Link></li>
              <li><Link href="/word-by-word" className="hover:text-[var(--primary)] transition-colors">{t('শব্দে শব্দে অর্থ', 'Clickable Word-by-Word')}</Link></li>
              <li><Link href="/tafsir" className="hover:text-[var(--primary)] transition-colors">{t('প্রামাণ্য তাফসীর', 'Classical Tafsir')}</Link></li>
              <li><Link href="/topics" className="hover:text-[var(--primary)] transition-colors">{t('বিষয়ভিত্তিক কুরআন', 'Quran Topics Explorer')}</Link></li>
              <li><Link href="/listen" className="hover:text-[var(--primary)] transition-colors">{t('ক্বারী ও অডিও তিলাওয়াত', 'Reciters & Audio Player')}</Link></li>
              <li><Link href="/learn" className="hover:text-[var(--primary)] transition-colors">{t('শব্দভাণ্ডার ও ফ্ল্যাশকার্ড', 'Vocabulary & Flashcards')}</Link></li>
            </ul>
          </div>

          {/* Canonical Data & Attributions */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-[var(--foreground)] tracking-wider uppercase">
              {t('প্রামাণ্য তথ্যউৎস', 'Data Provenance')}
            </h3>
            <ul className="space-y-1.5">
              <li><span className="text-[var(--foreground)]">{t('মূল পাঠ:', 'Text:')}</span> Tanzil.net Verified Uthmani script</li>
              <li><span className="text-[var(--foreground)]">{t('বাংলা অনুবাদ:', 'Bangla:')}</span> Taisirul Quran / Muhiuddin Khan</li>
              <li><span className="text-[var(--foreground)]">{t('ইংরেজি অনুবাদ:', 'English:')}</span> Saheeh International</li>
              <li><span className="text-[var(--foreground)]">{t('তাফসীর:', 'Tafsir:')}</span> Ibn Kathir & Ahsanul Bayaan</li>
              <li><span className="text-[var(--foreground)]">{t('তিলাওয়াত:', 'Recitations:')}</span> EveryAyah & Quran.com CDN</li>
              <li><span className="text-[var(--foreground)]">{t('ব্যাকরণ ও রুট:', 'Morphology:')}</span> Quranic Arabic Corpus</li>
            </ul>
          </div>

          {/* Governance & Admin */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-[var(--foreground)] tracking-wider uppercase">
              {t('গবেষণা ও ট্রাস্ট', 'Platform & Trust')}
            </h3>
            <ul className="space-y-1.5">
              <li><Link href="/ai-study" className="hover:text-[var(--primary)] transition-colors">{t('এআই সহকারী ও ইসলামিক আরএজি', 'AI Assistant & RAG Safety')}</Link></li>
              <li><Link href="/study" className="hover:text-[var(--primary)] transition-colors">{t('সংরক্ষিত নোট ও বুকমার্ক', 'Personal Notes & Bookmarks')}</Link></li>
              <li><Link href="/admin" className="hover:text-[var(--primary)] flex items-center gap-1 transition-colors">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('এডমিন ও রিভিউ পোর্টাল', 'Admin & Review Portal')}</span>
              </Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer, Developer Credits & Copyright */}
        <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[var(--foreground)] flex flex-wrap items-center justify-center md:justify-start gap-1.5">
              <span>Developed by</span>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
                4 Dimension
              </span>
              <span>and Founder is</span>
              <span className="font-extrabold text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/25">
                Sakib Al Rana
              </span>
            </p>
            <p className="text-[11px] text-[var(--muted-foreground)]">
              &copy; 2026 Al-Quran Platform. Free, ad-free, open Islamic knowledge for the Ummah worldwide.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}