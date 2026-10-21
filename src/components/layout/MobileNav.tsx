'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Layers, Compass, Sparkles, Bookmark } from 'lucide-react';
import { useLanguage } from '@/lib/language/language-context';

export function MobileNav() {
  const pathname = usePathname();
  const { language } = useLanguage();

  const items = [
    { href: '/read', label: language === 'bn' ? 'পড়ুন' : 'Read', icon: BookOpen },
    { href: '/word-by-word', label: language === 'bn' ? 'শব্দার্থ' : 'Words', icon: Layers },
    { href: '/topics', label: language === 'bn' ? 'বিষয়' : 'Topics', icon: Compass },
    { href: '/ai-study', label: language === 'bn' ? 'এআই গবেষণা' : 'AI Study', icon: Sparkles },
    { href: '/study', label: language === 'bn' ? 'লাইব্রেরি' : 'Library', icon: Bookmark },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-md pb-safe">
      <div className="grid grid-cols-5 h-14">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const isAI = item.href === '/ai-study';

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors relative ${
                isActive 
                  ? isAI
                    ? 'text-violet-600 dark:text-violet-300 font-extrabold'
                    : 'text-[var(--primary)] font-extrabold' 
                  : isAI
                    ? 'text-violet-700 dark:text-violet-400 font-bold'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${
                  isActive 
                    ? isAI ? 'text-violet-600 dark:text-violet-300' : 'text-[var(--primary)]' 
                    : isAI ? 'text-violet-600 dark:text-violet-400 animate-pulse' : ''
                }`} />
                {isAI && (
                  <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                )}
              </div>
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
