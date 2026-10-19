import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTopicBySlug, QURAN_TOPICS_DATA } from '@/lib/quran-data/topics';
import { PRELOADED_AYAHS } from '@/lib/quran-data/ayahs-data';
import { ArrowLeft, BookOpen, Volume2, ArrowRight } from 'lucide-react';

interface TopicDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return QURAN_TOPICS_DATA.map((topic) => ({
    slug: topic.slug
  }));
}

export async function generateMetadata({ params }: TopicDetailPageProps) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return { title: 'Topic Not Found | Al-Quran' };

  return {
    title: `${topic.title_en} (${topic.title_bn}) - Quran Topics`,
    description: topic.description_en
  };
}

export default async function TopicDetailPage({ params }: TopicDetailPageProps) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Back button */}
      <div>
        <Link
          href="/topics"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Topics</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary)]">
            {topic.category} • <span className="font-bangla">{topic.category_bn}</span>
          </span>
          <span className="font-arabic text-xl font-bold text-[var(--primary)]">
            {topic.title_ar}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
          {topic.title_en}
        </h1>
        <div className="text-sm font-semibold text-[var(--foreground)]/90 font-bangla">
          {topic.title_bn}
        </div>

        <div className="pt-2 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed space-y-2">
          <p>{topic.description_en}</p>
          <p className="font-bangla">{topic.description_bn}</p>
        </div>
      </div>

      {/* Relevant Ayahs Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[var(--foreground)] tracking-wide uppercase">
          Relevant Verses from the Quran ({topic.verses.length})
        </h2>

        <div className="space-y-4">
          {topic.verses.map((v, idx) => {
            // Check preloaded or synthesized text
            const surahAyahs = PRELOADED_AYAHS[v.surah];
            const ayahData = surahAyahs?.find((a) => a.ayah_number === v.ayah);
            const textAr = ayahData?.text_ar || `الآية ${v.ayah} من سورة ${v.surah}`;
            const textEn = ayahData?.translation_en || `Surah ${v.surah}, verse ${v.ayah}`;
            const textBn = ayahData?.translation_bn || `সূরা ${v.surah}, আয়াত ${v.ayah}`;

            return (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--primary)]">
                    Surah {v.surah}, Ayah {v.ayah}
                  </span>
                  <Link
                    href={`/read/${v.surah}#ayah-${v.surah}-${v.ayah}`}
                    className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
                  >
                    <span>Read in Reader</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <p className="font-arabic text-xl sm:text-2xl text-[var(--foreground)] text-right leading-loose">
                  {textAr}
                </p>

                <p className="text-xs text-[var(--foreground)]/90 italic">
                  &quot;{textEn}&quot;
                </p>

                <p className="text-xs text-[var(--foreground)]/90 font-bangla">
                  &quot;{textBn}&quot;
                </p>

                {v.notes_en && (
                  <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--muted-foreground)]">
                    <span className="font-semibold text-[var(--foreground)]">Study Note: </span>
                    {v.notes_en}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
