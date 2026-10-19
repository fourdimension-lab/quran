import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSignBySlug, QURANIC_SIGNS_DATA } from '@/lib/quran-data/miracles';
import { ArrowLeft, BookOpen, ExternalLink, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

interface MiracleDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return QURANIC_SIGNS_DATA.map((sign) => ({
    slug: sign.slug
  }));
}

export async function generateMetadata({ params }: MiracleDetailPageProps) {
  const { slug } = await params;
  const sign = getSignBySlug(slug);
  if (!sign) return { title: 'Sign Not Found | Al-Quran' };

  return {
    title: `${sign.title_en} (${sign.title_bn}) - Quranic Signs & Reflections`,
    description: sign.explanation_en
  };
}

export default async function MiracleDetailPage({ params }: MiracleDetailPageProps) {
  const { slug } = await params;
  const sign = getSignBySlug(slug);

  if (!sign) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Back button */}
      <div>
        <Link
          href="/miracles"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Signs & Reflections</span>
        </Link>
      </div>

      {/* Main Article Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary)]">
            {sign.category_display_en}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Classification: {sign.evidence_classification.replace(/_/g, ' ')}</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
          {sign.title_en}
        </h1>
        <div className="text-sm font-semibold text-[var(--foreground)]/80 font-bangla">
          {sign.title_bn}
        </div>
      </div>

      {/* Referenced Quranic Ayahs */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[var(--foreground)] tracking-wide uppercase">
          Referenced Quranic Ayahs
        </h2>
        <div className="space-y-3">
          {sign.ayahs.map((ayah, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-bold text-[var(--primary)]">
                <span>Surah {ayah.surah}, Ayah {ayah.ayah}</span>
                <Link
                  href={`/read/${ayah.surah}#ayah-${ayah.surah}-${ayah.ayah}`}
                  className="hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Open in Reader</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <p className="font-arabic text-xl sm:text-2xl text-[var(--foreground)] text-right leading-loose">
                {ayah.text_ar}
              </p>
              <p className="text-xs text-[var(--foreground)]/80 italic">
                &quot;{ayah.translation_en}&quot;
              </p>
              <p className="text-xs text-[var(--foreground)]/80 font-bangla">
                &quot;{ayah.translation_bn}&quot;
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Thematic & Empirical Analysis */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-[var(--foreground)]">
          Thematic & Linguistic Connection
        </h2>
        <p className="text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-line">
          {sign.explanation_en}
        </p>
        <div className="pt-2 text-sm text-[var(--foreground)] leading-relaxed font-bangla border-t border-[var(--border)]">
          {sign.explanation_bn}
        </div>
      </div>

      {/* Scholarly Perspective */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--background)] shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary)] uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Scholarly & Classical Perspectives</span>
        </div>
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
          {sign.scholarly_perspective_en}
        </p>
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed font-bangla pt-1">
          {sign.scholarly_perspective_bn}
        </p>
      </div>

      {/* Academic Citations & Bibliography */}
      <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-3">
        <h3 className="text-xs font-bold text-[var(--foreground)] tracking-wide uppercase">
          Academic Bibliography & Peer-Reviewed References
        </h3>
        <ul className="space-y-1.5 text-xs text-[var(--muted-foreground)] font-mono">
          {sign.scientific_references.map((ref, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-[var(--primary)] font-bold">[{idx + 1}]</span>
              <span>{ref}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
