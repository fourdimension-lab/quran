'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Layers, Compass, Sparkles, Bookmark } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { href: '/read', label: 'Read', icon: BookOpen },
    { href: '/word-by-word', label: 'Words', icon: Layers },
    { href: '/topics', label: 'Topics', icon: Compass },
    { href: '/ai-study', label: 'AI Study', icon: Sparkles },
    { href: '/study', label: 'Library', icon: Bookmark },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-md pb-safe">
      <div className="grid grid-cols-5 h-14">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                isActive 
                  ? 'text-[var(--primary)] font-semibold' 
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--primary)]' : ''}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
