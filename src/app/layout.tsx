import type { Metadata, Viewport } from 'next';
import React, { Suspense } from 'react';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Footer } from '@/components/layout/Footer';
import { AudioPlayerProvider } from '@/lib/audio/audio-player-context';
import { LanguageProvider } from '@/lib/language/language-context';
import { PersistentAudioBar } from '@/components/audio/PersistentAudioBar';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://quran.sakib.bond'),
  title: 'Al-Quran — Intelligent, Interactive Quran Platform',
  description: 'Read, explore, study, and listen to the Holy Quran with clickable word-by-word meanings, classical Tafsir, related Ayah discovery, and AI study assistant.',
  keywords: ['Quran', 'Al-Quran', 'Tafsir', 'Quran Bangla', 'Quran English', 'Word by word Quran', 'Quran Audio', 'Islamic Study'],
  authors: [{ name: 'Al-Quran Platform Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: '/icon.svg'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Al-Quran'
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth overflow-x-hidden">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8575731546488429"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors overflow-x-hidden w-full max-w-full relative">
        <LanguageProvider>
          <AudioPlayerProvider>
            <Suspense fallback={<div className="h-16 border-b border-[var(--border)] bg-[var(--background)]" />}>
              <Navbar />
            </Suspense>
            <div className="flex-1">
              <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center p-8"><div className="w-8 h-8 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin" /></div>}>
                {children}
              </Suspense>
            </div>
            <PersistentAudioBar />
            <Suspense fallback={null}>
              <MobileNav />
            </Suspense>
            <Footer />
          </AudioPlayerProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
