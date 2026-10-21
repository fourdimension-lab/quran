'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'bn' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (bnText: string, enText: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'bn', // Default to Bengali as requested
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (bnText: string, enText: string) => bnText
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default to Bengali ('bn')
  const [language, setLanguageState] = useState<Language>('bn');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('alquran_lang') as Language | null;
      if (saved === 'en' || saved === 'bn') {
        setLanguageState(saved);
      } else {
        // Explicitly set default to 'bn'
        setLanguageState('bn');
        localStorage.setItem('alquran_lang', 'bn');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('alquran_lang', lang);
    }
  };

  const toggleLanguage = () => {
    const next = language === 'bn' ? 'en' : 'bn';
    setLanguage(next);
  };

  const t = (bnText: string, enText: string): string => {
    return language === 'bn' ? bnText : enText;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}