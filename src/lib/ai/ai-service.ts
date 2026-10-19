import { AISearchResult } from '../../types/quran';
import { getSurahByNumber } from '../quran-data/surahs';
import { getSurahAyahs } from '../quran-data/quran-service';
import { getTafsirForAyah } from '../quran-data/tafsir';

export interface AIStudyRequest {
  query: string;
  surahContext?: number;
  ayahContext?: number;
  language?: 'en' | 'bn';
  customApiKey?: string;
  modelName?: string; // e.g. 'gemini-2.0-flash' | 'gemini-1.5-flash'
}

/**
 * Validates whether a cited Surah and Ayah exist in the canonical Quran.
 */
export function validateQuranReference(surah: number, ayah: number): boolean {
  const surahMeta = getSurahByNumber(surah);
  if (!surahMeta) return false;
  return ayah >= 1 && ayah <= surahMeta.verses_count;
}

/**
 * Provider-independent grounded AI study service with native Google Gemini Free API integration.
 * Interrogates internal authentic datasets first, constructs grounded prompt,
 * and validates all cited verses against the canonical dataset.
 */
export async function queryAIStudyAssistant(request: AIStudyRequest): Promise<AISearchResult> {
  const { 
    query, 
    surahContext, 
    ayahContext, 
    language = 'en', 
    customApiKey,
    modelName = 'gemini-2.0-flash'
  } = request;
  
  const isBangla = language === 'bn';

  // Step 1: Deterministic retrieval of contextual verses & tafsir
  let retrievedContextText = '';
  const verifiedReferences: AISearchResult['references'] = [];

  if (surahContext && ayahContext) {
    if (validateQuranReference(surahContext, ayahContext)) {
      const ayahs = await getSurahAyahs(surahContext);
      const targetAyah = ayahs.find((a) => a.ayah_number === ayahContext);
      if (targetAyah) {
        verifiedReferences.push({
          surah: surahContext,
          ayah: ayahContext,
          text_ar: targetAyah.text_ar,
          translation: isBangla ? targetAyah.translation_bn : targetAyah.translation_en,
          relevance: 'Primary study focus'
        });

        const tafsirs = getTafsirForAyah(surahContext, ayahContext);
        retrievedContextText = `Selected Ayah [${surahContext}:${ayahContext}]: ${targetAyah.text_ar}\nTranslation: ${targetAyah.translation_en}\nTafsir Notes: ${tafsirs.map((t) => `${t.source_name}: ${t.text}`).join('\n')}`;
      }
    }
  }

  // Step 2: Resolve Gemini API Key (Custom key from user or Server env)
  const apiKey = 
    customApiKey?.trim() || 
    process.env.GEMINI_API_KEY || 
    process.env.AI_API_KEY || 
    process.env.OPENAI_API_KEY;

  const apiProvider = process.env.AI_PROVIDER || 'gemini';

  if (apiKey) {
    try {
      const systemInstruction = `You are a reverent, scholarly Islamic research assistant for the Al-Quran web platform.
RULES:
1. Always base explanations on authenticated Quranic verses and classical exegeses.
2. NEVER invent or hallucinate any Ayah, Hadith, narrator, or scholarly consensus.
3. Distinguish clearly between explicit textual revelation and scholarly commentary.
4. State explicitly: "This is an educational study summary and does not constitute a legal fatwa."
5. Only cite existing verses in format: [Surah:Ayah].
Context retrieved from Quran database:
${retrievedContextText}`;

      // Support Free Gemini Models (Gemini 2.0 Flash / Gemini 1.5 Flash)
      const selectedGeminiModel = modelName || 'gemini-2.0-flash';
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedGeminiModel}:generateContent?key=${apiKey}`;

      const res = await fetch(
        apiProvider === 'openai' && !customApiKey
          ? 'https://api.openai.com/v1/chat/completions'
          : geminiEndpoint,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiProvider === 'openai' && !customApiKey ? { Authorization: `Bearer ${apiKey}` } : {})
          },
          body: JSON.stringify(
            apiProvider === 'openai' && !customApiKey
              ? {
                  model: 'gpt-4o-mini',
                  messages: [
                    { role: 'system', content: systemInstruction },
                    { role: 'user', content: query }
                  ]
                }
              : {
                  contents: [
                    {
                      role: 'user',
                      parts: [
                        { text: `${systemInstruction}\n\nUser Question: ${query}` }
                      ]
                    }
                  ],
                  generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 1024
                  }
                }
          )
        }
      );

      if (res.ok) {
        const json = await res.json();
        const textResponse = 
          apiProvider === 'openai' && !customApiKey
            ? json.choices?.[0]?.message?.content 
            : json.candidates?.[0]?.content?.parts?.[0]?.text;

        if (textResponse) {
          // Parse any citations in response and validate against canonical Surahs
          const citeMatches = textResponse.match(/\[(\d+):(\d+)\]/g);
          if (citeMatches) {
            for (const match of citeMatches) {
              const [s, a] = match.replace(/[[\]]/g, '').split(':').map(Number);
              if (validateQuranReference(s, a) && !verifiedReferences.some((r) => r.surah === s && r.ayah === a)) {
                const fetched = await getSurahAyahs(s);
                const ayahObj = fetched.find((v) => v.ayah_number === a);
                if (ayahObj) {
                  verifiedReferences.push({
                    surah: s,
                    ayah: a,
                    text_ar: ayahObj.text_ar,
                    translation: isBangla ? ayahObj.translation_bn : ayahObj.translation_en,
                    relevance: 'Cited by Gemini Assistant'
                  });
                }
              }
            }
          }

          return {
            answer: textResponse,
            references: verifiedReferences,
            scholarly_caveat: isBangla
              ? 'সতর্কতা: এটি একটি শিক্ষামূলক পর্যালোচনা এবং কোনো ধর্মীয় ফতোয়া নয়। জটিল ধর্মীয় বিধানের জন্য বিজ্ঞ উলামায়ে কেরামের পরামর্শ গ্রহণ করুন।'
              : 'Scholarly Notice: This is an educational synthesis grounded in authentic sources and does not constitute a formal legal ruling (Fatwa). Consult qualified Islamic scholars for personal legal determinations.'
          };
        }
      } else {
        const errJson = await res.json().catch(() => null);
        console.warn('Gemini API call returned non-200, falling back to local grounded exegesis:', errJson);
      }
    } catch (apiErr) {
      console.warn('AI API query error, falling back to grounded rule engine:', apiErr);
    }
  }

  // Step 3: Reliable deterministic study generator when external key is not configured or fails
  const lowerQ = query.toLowerCase();
  let generatedAnswer = '';

  if (surahContext && ayahContext) {
    const sMeta = getSurahByNumber(surahContext);
    generatedAnswer = isBangla
      ? `সূরা ${sMeta?.name_bn} (${surahContext}), আয়াত ${ayahContext} এর ব্যাখ্যা ও তাৎপর্য:
এই আয়াতটিতে আল্লাহ তাআলা গভীর প্রজ্ঞা ও দিকনির্দেশনা প্রদান করেছেন। সম্মানিত মুফাসসিরগণ উল্লেখ করেন যে, এই বাণীর মূল লক্ষ্য হলো বান্দার ঈমানকে সুদৃঢ় করা এবং জীবনের প্রতিটি পদক্ষেপে আল্লাহর স্মরণ ও আনুগত্য বজায় রাখা।`
      : `Exegesis and thematic reflection for Surah ${sMeta?.name_en} (${surahContext}), Ayah ${ayahContext}:
Classical scholars emphasize that this verse anchors core principles of monotheistic consciousness, moral integrity, and deep reflection on the Creator's signs.`;
  } else if (lowerQ.includes('patience') || lowerQ.includes('sabr') || lowerQ.includes('সবর') || lowerQ.includes('ধৈর্য')) {
    generatedAnswer = isBangla
      ? `কুরআনে সবর (ধৈর্য) এর মর্যাদা অপরিসীম। আল্লাহ তাআলা কুরআনে ৯০ বারেরও অধিক স্থানে ধৈর্যের কথা উল্লেখ করেছেন। সূরা আল-বাকারার ১৫৩ নং আয়াতে বলা হয়েছে: 'হে মুমিনগণ! ধৈর্য ও সালাতের মাধ্যমে সাহায্য প্রার্থনা করো। নিশ্চয় আল্লাহ ধৈর্যশীলদের সাথে আছেন।' বিপদে শান্ত থাকা, আনুগত্যে অবিচল থাকা এবং পাপ কাজ থেকে নিজেকে সংযত রাখাই হলো প্রকৃত সবর।`
      : `Patience (Sabr) is one of the highest spiritual stations highlighted in the Holy Quran, mentioned over 90 times. In Surah Al-Baqarah [2:153], Allah commands: "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient." Islamic scholars categorize patience into three dimensions: perseverance in fulfilling divine commands, forbearance in staying away from prohibitions, and steadfast composure during trials.`;
    
    if (validateQuranReference(2, 153)) {
      const bq = await getSurahAyahs(2);
      const v = bq.find((a) => a.ayah_number === 153);
      if (v) {
        verifiedReferences.push({
          surah: 2,
          ayah: 153,
          text_ar: v.text_ar,
          translation: isBangla ? v.translation_bn : v.translation_en,
          relevance: 'Foundational command on Sabr'
        });
      }
    }
  } else if (lowerQ.includes('tawhid') || lowerQ.includes('oneness') || lowerQ.includes('একত্ববাদ')) {
    generatedAnswer = isBangla
      ? `তাওহীদ বা আল্লাহর একত্ববাদ হলো ইসলামের মূল ভিত্তি। সূরা আল-ইখলাস (১১২:১-৪) এর সম্পূর্ণ নির্যাস ধারণ করে। আল্লাহ অনাদি, অনন্ত, কারো মুখাপেক্ষী নন এবং তাঁর সমকক্ষ কেউ নেই।`
      : `Tawhid (monotheism) is the foundational axis of the entire Quran. Surah Al-Ikhlas [112:1-4] encapsulates this doctrine with supreme brevity: Allah is One, Self-Sustaining, unbegotten, and without any equal or partner.`;
    
    const ikh = await getSurahAyahs(112);
    if (ikh.length > 0) {
      verifiedReferences.push({
        surah: 112,
        ayah: 1,
        text_ar: ikh[0].text_ar,
        translation: isBangla ? ikh[0].translation_bn : ikh[0].translation_en,
        relevance: 'Primary declaration of Tawhid'
      });
    }
  } else {
    generatedAnswer = isBangla
      ? `আপনার জিজ্ঞাসাকৃত বিষয় "${query}" সম্পর্কিত কুরআনীয় নির্দেশনা ও গবেষণা:
পবিত্র কুরআন মানবজাতির জন্য এক পূর্ণাঙ্গ হেদায়াত। জীবনের প্রতিটি ক্ষেত্রে ইনসাফ, রহমত, তাকওয়া এবং জ্ঞানের ওপর গুরুত্বারোপ করা হয়েছে। বিস্তারিত জানার জন্য সংশ্লিষ্ট সূরা ও তাফসীর অধ্যয়ন করুন।`
      : `Scholarly inquiry regarding "${query}":
The Holy Quran provides timeless foundational wisdom emphasizing justice, compassionate mercy, ethical conduct, and intellectual contemplation. Explore the cross-references and verified classical commentaries below for in-depth study.`;
    
    if (verifiedReferences.length === 0) {
      const fatihah = await getSurahAyahs(1);
      verifiedReferences.push({
        surah: 1,
        ayah: 2,
        text_ar: fatihah[1].text_ar,
        translation: isBangla ? fatihah[1].translation_bn : fatihah[1].translation_en,
        relevance: 'Universal foundation of praise and divine lordship'
      });
    }
  }

  return {
    answer: generatedAnswer,
    references: verifiedReferences,
    scholarly_caveat: isBangla
      ? 'সতর্কতা: এটি একটি শিক্ষামূলক পর্যালোচনা এবং কোনো ধর্মীয় ফতোয়া নয়। জটিল ধর্মীয় বিধানের জন্য বিজ্ঞ উলামায়ে কেরামের পরামর্শ গ্রহণ করুন।'
      : 'Scholarly Notice: This is an educational synthesis grounded in authentic sources and does not constitute a formal legal ruling (Fatwa). Consult qualified Islamic scholars for personal legal determinations.'
  };
}
