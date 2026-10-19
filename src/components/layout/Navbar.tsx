'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Layers, 
  Compass, 
  Bookmark, 
  Moon, 
  Sun, 
  Volume2, 
  GraduationCap, 
  Menu, 
  X,
  Languages,
  ShieldCheck
} from 'lucide-react';
import { GlobalSearchModal } from '../search/GlobalSearchModal';

export function Navbar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  useEffect(() => {
    // Check initial dark mode from html class or media query
    const isDarkMode = document.documentElement.classList.contains('dark') || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }

    // Keyboard shortcut for search (Ctrl+K or Cmd+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'bn' : 'en';
    setLanguage(nextLang);
    localStorage.setItem('alquran_lang', nextLang);
  };

  const navLinks = [
    { href: '/read', labelEn: 'Read Quran', labelBn: 'কুরআন পড়ুন', icon: BookOpen },
    { href: '/word-by-word', labelEn: 'Word-by-Word', labelBn: 'শব্দে শব্দে', icon: Layers },
    { href: '/topics', labelEn: 'Topics', labelBn: 'বিষয়ভিত্তিক', icon: Compass },
    { href: '/miracles', labelEn: 'Signs & Reflection', labelBn: 'নিদর্শন ও তাফাক্কুর', icon: Sparkles },
    { href: '/listen', labelEn: 'Listen', labelBn: 'শুনুন', icon: Volume2 },
    { href: '/learn', labelEn: 'Learn Arabic', labelBn: 'আরবি শিক্ষা', icon: GraduationCap },
    { href: '/ai-study', labelEn: 'AI Assistant', labelBn: 'এআই সহকারী', icon: Sparkles },
    { href: '/study', labelEn: 'My Study', labelBn: 'আমার নোটস', icon: Bookmark },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <span className="font-arabic text-xl font-bold">قرآن</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-[var(--foreground)] flex items-center gap-1.5">
                Al-Quran
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)] font-medium">القرآن</span>
              </span>
              <span className="text-[11px] text-[var(--muted-foreground)] -mt-0.5">
                {language === 'bn' ? 'বুদ্ধিদীপ্ত কুরআন অধ্যয়ন প্ল্যাটফর্ম' : 'Intelligent Quran Platform'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.slice(0, 6).map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                    isActive 
                      ? 'bg-[var(--primary-light)] text-[var(--primary)] font-semibold shadow-xs' 
                      : 'text-[var(--foreground)]/80 hover:text-[var(--foreground)] hover:bg-[var(--muted)]'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  <span>{language === 'bn' ? link.labelBn : link.labelEn}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            
            {/* Quick Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-[var(--muted-foreground)] text-xs transition-colors"
              title="Search Quran (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-[var(--primary)]" />
              <span className="hidden sm:inline">{language === 'bn' ? 'অনুসন্ধান করুন...' : 'Search Quran...'}</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded bg-[var(--muted)] text-[10px] font-mono border border-[var(--border)]">
                ⌘K
              </kbd>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors text-xs font-semibold"
              title="Toggle English / Bangla"
            >
              <span className="flex items-center gap-1">
                <Languages className="w-4 h-4 text-[var(--gold)]" />
                <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors"
              title="Toggle Dark/Light Mode"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[var(--primary)]" />}
            </button>

            {/* AI Assistant Quick Link */}
            <Link
              href="/ai-study"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-medium hover:bg-[var(--primary-hover)] transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--gold-light)]" />
              <span>{language === 'bn' ? 'এআই গবেষণা' : 'AI Study'}</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
              aria-label="Open navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-b border-[var(--border)] bg-[var(--card)] px-4 pt-2 pb-4 space-y-1 animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-[var(--primary-light)] text-[var(--primary)] font-semibold' 
                      : 'text-[var(--foreground)] hover:bg-[var(--muted)]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[var(--primary)]" />
                  <span>{language === 'bn' ? link.labelBn : link.labelEn}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)]"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} language={language} />
    </>
  );
}
