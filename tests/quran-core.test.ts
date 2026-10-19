import test from 'node:test';
import assert from 'node:assert/strict';
import { SURAHS_DATA, getSurahByNumber, searchSurahs } from '../src/lib/quran-data/surahs';
import { PRELOADED_AYAHS } from '../src/lib/quran-data/ayahs-data';
import { getTafsirForAyah, TAFSIR_SOURCES } from '../src/lib/quran-data/tafsir';
import { getRelatedAyahs } from '../src/lib/quran-data/related-ayahs';
import { QURAN_TOPICS_DATA, getTopicBySlug } from '../src/lib/quran-data/topics';
import { QURANIC_SIGNS_DATA, getSignBySlug } from '../src/lib/quran-data/miracles';
import { validateQuranReference, queryAIStudyAssistant } from '../src/lib/ai/ai-service';
import { reviewVocabItem } from '../src/lib/storage/user-storage';

test('Test 1: All 114 Surahs are present with verified verse counts', () => {
  assert.equal(SURAHS_DATA.length, 114, 'Must have exactly 114 Surahs');
  
  const fatihah = getSurahByNumber(1);
  assert.ok(fatihah);
  assert.equal(fatihah?.verses_count, 7, 'Al-Fatihah must have 7 verses');
  assert.equal(fatihah?.name_en, 'Al-Fatihah');

  const baqarah = getSurahByNumber(2);
  assert.ok(baqarah);
  assert.equal(baqarah?.verses_count, 286, 'Al-Baqarah must have 286 verses');

  const ikhlas = getSurahByNumber(112);
  assert.ok(ikhlas);
  assert.equal(ikhlas?.verses_count, 4, 'Al-Ikhlas must have 4 verses');

  const nas = getSurahByNumber(114);
  assert.ok(nas);
  assert.equal(nas?.verses_count, 6, 'An-Nas must have 6 verses');

  // Verify total verse count across all 114 Surahs equals 6,236
  const totalVerses = SURAHS_DATA.reduce((acc, s) => acc + s.verses_count, 0);
  assert.equal(totalVerses, 6236, 'Total canonical verses must equal exactly 6,236');
});

test('Test 2: Word-by-word segmentation and morphology verification', () => {
  const fatihahAyahs = PRELOADED_AYAHS[1];
  assert.ok(fatihahAyahs);
  assert.equal(fatihahAyahs.length, 7);

  // Check Ayah 1: Bismillah
  const ayah1 = fatihahAyahs[0];
  assert.equal(ayah1.words?.length, 4, 'Bismillah has 4 words');

  const word1 = ayah1.words![0];
  assert.equal(word1.arabic, 'بِسْمِ');
  assert.equal(word1.translation_en, 'In the name');
  assert.equal(word1.root, 'س-م-و');

  const word2 = ayah1.words![1];
  assert.equal(word2.arabic, 'ٱللَّهِ');
  assert.equal(word2.root, 'أ-ل-ه');

  const word3 = ayah1.words![2];
  assert.equal(word3.arabic, 'ٱلرَّحْمَٰنِ');
  assert.equal(word3.root, 'ر-ح-م');

  const word4 = ayah1.words![3];
  assert.equal(word4.arabic, 'ٱلرَّحِيمِ');
  assert.equal(word4.root, 'ر-ح-م');
});

test('Test 3: Tafsir exegesis sources and content integrity', () => {
  assert.ok(TAFSIR_SOURCES.length >= 3, 'Must have at least 3 Tafsir sources');
  
  const tafsir1_1 = getTafsirForAyah(1, 1);
  assert.ok(tafsir1_1.length >= 2, 'Must have classical and contemporary Tafsir entries');

  const ibnKathir = tafsir1_1.find((t) => t.source_id === 'ibn-kathir');
  assert.ok(ibnKathir);
  assert.ok(ibnKathir.text.includes('Ar-Rahman'));

  const ahsanulBayaan = tafsir1_1.find((t) => t.source_id === 'ahsanul-bayaan');
  assert.ok(ahsanulBayaan);
  assert.ok(ahsanulBayaan.text.includes('বিসমিল্লাহ'));
});

test('Test 4: Related Ayahs discovery engine', () => {
  const related = getRelatedAyahs(1, 1);
  assert.ok(related.length > 0);
  
  // Surah 27 Ayah 30 (Solomon's letter) must be related to Bismillah
  const solomonRef = related.find((r) => r.surah_number === 27 && r.ayah_number === 30);
  assert.ok(solomonRef, 'Must find 27:30 as cross-reference for Bismillah');
  assert.equal(solomonRef.relation_type, 'same_word');
});

test('Test 5: Quran Topics verification', () => {
  assert.ok(QURAN_TOPICS_DATA.length >= 8);
  
  const tawhid = getTopicBySlug('tawhid-oneness-of-allah');
  assert.ok(tawhid);
  assert.ok(tawhid.verses.length > 0);
  
  // Verify that all verses cited in topics are valid Quran references
  for (const t of QURAN_TOPICS_DATA) {
    for (const v of t.verses) {
      assert.ok(
        validateQuranReference(v.surah, v.ayah),
        `Topic ${t.id} cites invalid reference ${v.surah}:${v.ayah}`
      );
    }
  }
});

test('Test 6: Quranic Signs & Empirical Reflection classification', () => {
  assert.ok(QURANIC_SIGNS_DATA.length >= 5);
  
  const cosmic = getSignBySlug('expanding-universe');
  assert.ok(cosmic);
  assert.equal(cosmic.category, 'cosmology');
  assert.ok(cosmic.scientific_references.length > 0);
  assert.ok(cosmic.evidence_classification);
});

test('Test 7: AI Reference Validation & Grounding Guardrails', async () => {
  // Test valid and invalid references
  assert.equal(validateQuranReference(1, 7), true);
  assert.equal(validateQuranReference(1, 8), false, 'Surah 1 has only 7 verses');
  assert.equal(validateQuranReference(2, 286), true);
  assert.equal(validateQuranReference(2, 287), false, 'Surah 2 has only 286 verses');
  assert.equal(validateQuranReference(115, 1), false, 'Only 114 Surahs exist');

  // Test deterministic AI query execution
  const res = await queryAIStudyAssistant({ query: 'patience in hardship', language: 'en' });
  assert.ok(res.answer);
  assert.ok(res.references.length > 0);
  assert.ok(res.scholarly_caveat.includes('Fatwa'));
});

test('Test 8: Surah search functionality', () => {
  const matchBaqarah = searchSurahs('baqarah');
  assert.ok(matchBaqarah.some((s) => s.number === 2));

  const matchBangla = searchSurahs('ফাতিহা');
  assert.ok(matchBangla.some((s) => s.number === 1));

  const matchArabic = searchSurahs('الإخلاص');
  assert.ok(matchArabic.some((s) => s.number === 112));
});
