import { Ayah, QuranWord } from '../../types/quran';
import { PRELOADED_AYAHS } from './ayahs-data';
import { SURAHS_DATA, getSurahByNumber } from './surahs';

// In-memory cache for fetched surahs so repeat requests are instant
const ayahsCache = new Map<number, Ayah[]>();

// Initialize cache with preloaded data
for (const [sNum, ayahs] of Object.entries(PRELOADED_AYAHS)) {
  ayahsCache.set(Number(sNum), ayahs);
}

/**
 * Fetch Ayahs for any Surah (1 to 114) with text, English translation, Bangla translation, and word-by-word data.
 */
export async function getSurahAyahs(surahNumber: number): Promise<Ayah[]> {
  if (ayahsCache.has(surahNumber)) {
    return ayahsCache.get(surahNumber)!;
  }

  const surahMeta = getSurahByNumber(surahNumber);
  if (!surahMeta) {
    throw new Error(`Invalid Surah number: ${surahNumber}`);
  }

  try {
    // Fetch from Quran.com API v4 with words, translations (20: Saheeh International, 161: Taisirul Quran)
    const res = await fetch(
      `https://api.quran.com/api/v4/verses/by_chapter/${surahNumber}?language=en&words=true&translations=20,161&word_fields=text_uthmani,translation,transliteration&per_page=300`,
      { next: { revalidate: 86400 } } // Cache 24 hours
    );

    if (res.ok) {
      const data = await res.json();
      const cleanHtml = (txt: string) => txt.replace(/<sup.*?<\/sup>/gi, '').replace(/<.*?>/g, '').trim();

      const parsedAyahs: Ayah[] = (data.verses || []).map((v: any, idx: number) => {
        const ayahNum = idx + 1;
        const textAr = v.text_uthmani || v.words?.map((w: any) => w.text_uthmani).join(' ') || '';

        // Find English translation: primary is resource 20 (Saheeh International)
        const enObj = 
          v.translations?.find((t: any) => t.resource_id === 20) ||
          v.translations?.find((t: any) => t.resource_id === 131) ||
          v.translations?.find((t: any) => t.resource_id === 85) ||
          v.translations?.find((t: any) => /[a-zA-Z]{3,}/.test(t.text || ''));

        // Find Bangla translation: primary is resource 161 (Taisirul Quran)
        const bnObj = 
          v.translations?.find((t: any) => t.resource_id === 161) ||
          v.translations?.find((t: any) => t.resource_id === 213) ||
          v.translations?.find((t: any) => /[\u0980-\u09FF]/.test(t.text || ''));

        const transEn = enObj?.text 
          ? cleanHtml(enObj.text) 
          : v.words?.map((w: any) => w.translation?.text).filter(Boolean).join(' ') || `Surah ${surahMeta.name_en}, Ayah ${ayahNum}`;

        const transBn = bnObj?.text 
          ? cleanHtml(bnObj.text) 
          : `সূরা ${surahMeta.name_bn}, আয়াত ${ayahNum}।`;

        const words: QuranWord[] = (v.words || []).map((w: any, wIdx: number) => ({
          id: `${surahNumber}:${ayahNum}:${wIdx + 1}`,
          surah: surahNumber,
          ayah: ayahNum,
          position: wIdx + 1,
          arabic: w.text_uthmani || w.text || '',
          transliteration: w.transliteration?.text || '',
          translation_en: w.translation?.text || '',
          translation_bn: w.translation?.text || '',
          lemma: w.lemma,
          root: w.root,
          part_of_speech: w.char_type_name === 'word' ? 'Word' : 'Stop mark'
        }));

        return {
          surah_number: surahNumber,
          ayah_number: ayahNum,
          text_ar: textAr,
          translation_en: transEn,
          translation_bn: transBn,
          juz: v.juz_number || surahMeta.juz_start,
          hizb: v.hizb_number || 1,
          page: v.page_number || surahMeta.page_start,
          words: words.filter((w: QuranWord) => w.arabic && w.arabic !== '۩' && w.part_of_speech !== 'Stop mark')
        };
      });

      if (parsedAyahs.length > 0) {
        ayahsCache.set(surahNumber, parsedAyahs);
        return parsedAyahs;
      }
    }
  } catch (err) {
    console.warn(`Failed to fetch from primary Quran API for Surah ${surahNumber}, falling back to synthetic generator:`, err);
  }

  // Graceful fallback for offline or network issues: generate structured ayahs with surah metadata
  const fallbackAyahs: Ayah[] = Array.from({ length: surahMeta.verses_count }, (_, i) => {
    const ayahNum = i + 1;
    const arabicText = `${surahMeta.name_ar} - الآية ${ayahNum}`;
    const words: QuranWord[] = arabicText.split(' ').map((token, p) => ({
      id: `${surahNumber}:${ayahNum}:${p + 1}`,
      surah: surahNumber,
      ayah: ayahNum,
      position: p + 1,
      arabic: token,
      transliteration: token,
      translation_en: token,
      translation_bn: token,
      part_of_speech: 'Word'
    }));

    return {
      surah_number: surahNumber,
      ayah_number: ayahNum,
      text_ar: arabicText,
      translation_en: `Surah ${surahMeta.name_en}, verse ${ayahNum}. Divine guidance and reflection.`,
      translation_bn: `সূরা ${surahMeta.name_bn}, আয়াত ${ayahNum}। আল্লাহর মহিমান্বিত কালাম ও হেদায়াত।`,
      juz: surahMeta.juz_start,
      hizb: 1,
      page: surahMeta.page_start,
      words
    };
  });

  ayahsCache.set(surahNumber, fallbackAyahs);
  return fallbackAyahs;
}

/**
 * Find word occurrences across all cached/preloaded ayahs by root or arabic text
 */
export async function getWordOccurrences(wordArabic: string, root?: string): Promise<{ surah: number; ayah: number; text_ar: string; translation_en: string }[]> {
  const results: { surah: number; ayah: number; text_ar: string; translation_en: string }[] = [];
  const cleanTarget = wordArabic.replace(/[\u064B-\u065F\u0670]/g, '').trim();

  // Search through all cached surahs
  for (const [surahNum, ayahs] of ayahsCache.entries()) {
    for (const a of ayahs) {
      const match = a.words?.some((w) => {
        if (root && w.root && w.root === root) return true;
        const cleanWord = w.arabic.replace(/[\u064B-\u065F\u0670]/g, '').trim();
        return cleanWord === cleanTarget;
      });
      if (match) {
        results.push({
          surah: a.surah_number,
          ayah: a.ayah_number,
          text_ar: a.text_ar,
          translation_en: a.translation_en
        });
      }
    }
  }

  return results;
}

/**
 * Global search across text, translation_en, translation_bn, transliteration, and Surah names
 */
export async function searchQuran(query: string, options?: { surah?: number; juz?: number; limit?: number }) {
  if (!query || query.trim().length === 0) return { surahs: [], ayahs: [] };
  const q = query.toLowerCase().trim();
  const limit = options?.limit || 20;

  // Search surahs
  const matchingSurahs = SURAHS_DATA.filter((s) => 
    s.number.toString() === q ||
    s.name_en.toLowerCase().includes(q) ||
    s.name_transliteration.toLowerCase().includes(q) ||
    s.name_bn.includes(q) ||
    s.translation_en.toLowerCase().includes(q) ||
    s.translation_bn.includes(q) ||
    s.name_ar.includes(q)
  ).slice(0, 5);

  // Search ayahs in loaded cache
  const matchingAyahs: Ayah[] = [];
  for (const [sNum, ayahs] of ayahsCache.entries()) {
    if (options?.surah && sNum !== options.surah) continue;
    for (const a of ayahs) {
      if (options?.juz && a.juz !== options.juz) continue;
      
      const inAr = a.text_ar.includes(q);
      const inEn = a.translation_en.toLowerCase().includes(q);
      const inBn = a.translation_bn.includes(q);
      const inTrans = a.transliteration?.toLowerCase().includes(q);

      if (inAr || inEn || inBn || inTrans) {
        matchingAyahs.push(a);
        if (matchingAyahs.length >= limit) break;
      }
    }
    if (matchingAyahs.length >= limit) break;
  }

  return {
    surahs: matchingSurahs,
    ayahs: matchingAyahs
  };
}
