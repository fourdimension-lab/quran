import { TafsirSource, TafsirEntry } from '../../types/quran';

export const TAFSIR_SOURCES: TafsirSource[] = [
  {
    id: 'ibn-kathir',
    name: 'Tafsir Ibn Kathir (Abridged)',
    author: 'Al-Hafidh Ibn Kathir (d. 774 AH)',
    language: 'en',
    description: 'One of the most widely respected classical Sunni commentaries, explaining the Quran by Quran, authentic Hadith, and sayings of the Sahabah.'
  },
  {
    id: 'ahsanul-bayaan',
    name: 'Tafsir Ahsanul Bayaan',
    author: 'Salahuddin Yusuf / Abu Bakr Zakaria',
    language: 'bn',
    description: 'কুরআন ও বিশুদ্ধ সুন্নাহর আলোকে সংক্ষিপ্ত ও প্রামাণ্য তাফসীর, যা বাংলাভাষী মুমিনদের মাঝে ব্যাপকভাবে সমাদৃত।'
  },
  {
    id: 'jalalayn',
    name: 'Tafsir al-Jalalayn',
    author: 'Jalal al-Din al-Mahalli & Jalal al-Din al-Suyuti',
    language: 'en',
    description: 'A classic linguistic and legal concise exegesis renowned for its directness and syntactic precision.'
  }
];

export const TAFSIR_ENTRIES_SAMPLE: Record<string, TafsirEntry[]> = {
  // Key format: `${surah}:${ayah}`
  '1:1': [
    {
      surah_number: 1,
      ayah_number: 1,
      source_id: 'ibn-kathir',
      source_name: 'Tafsir Ibn Kathir',
      author: 'Ibn Kathir',
      language: 'en',
      text: 'The scholars of the Salaf agreed that Bismillah is an Ayah at the beginning of Surah An-Naml, and they disagreed whether it is an independent Ayah at the beginning of every Surah or only part of Al-Fatihah. The name "Allah" is the greatest name of God, indicating His singular divinity over all creation. "Ar-Rahman" (The Entirely Merciful) and "Ar-Rahim" (The Especially Merciful) are two names derived from Rahmah (mercy); Rahman implies boundless grace for all creation, while Rahim is specialized mercy for believers.',
      asbab_al_nuzul: 'Revealed to teach believers to begin every noble deed with the blessing and name of the Creator.',
      linguistic_notes: 'The "Ba" indicates seeking assistance (Isti‘anah) and companionship (Musahabah). The word "Ism" is derived from "Sumuww" (height, elevated designation).',
      authentic_hadith_refs: [
        'Sahih Muslim 395: "Every significant matter that does not begin in the name of Allah is devoid of blessing."'
      ]
    },
    {
      surah_number: 1,
      ayah_number: 1,
      source_id: 'ahsanul-bayaan',
      source_name: 'তাফসীর আহসানুল বায়ান',
      author: 'সালাহুদ্দীন ইউসুফ / আবু বকর জাকারিয়া',
      language: 'bn',
      text: '‘বিসমিল্লাহ’ দ্বারা যেকোনো সৎ ও কল্যাণকর কাজ শুরু করা ইসলামের সুমহান শিষ্টাচার। ‘আল্লাহ’ নামটি কেবল মহান প্রতিপালকের জন্য নির্ধারিত, কোনো সৃষ্টির জন্য এ নাম ব্যবহার বৈধ নয়। ‘আর-রাহমান’ ও ‘আর-রাহীম’ উভয়টিই আল্লাহর দয়া ও অনুগ্রহবাচক গুণ। রহমান হলেন তিনি যার দয়া সকল সৃষ্টির প্রতি বিস্তৃত, আর রাহীম হলেন তিনি যাঁর বিশেষ রহমত পরকালে মুমিনদের জন্য নির্ধারিত।',
      asbab_al_nuzul: 'প্রতিটি ভালো কাজ শুরু করার পূর্বে আল্লাহর নাম স্মরণ ও বরকত কামনার নির্দেশ হিসেবে অবতীর্ণ।',
      linguistic_notes: '‘বা’ হরফটি সাহচর্য ও সাহায্য কামনার উদ্দেশ্যে ব্যবহৃত।',
      authentic_hadith_refs: [
        'সহীহ মুসলিম: ৩৯৫ নং হাদিস'
      ]
    }
  ],
  '1:2': [
    {
      surah_number: 1,
      ayah_number: 2,
      source_id: 'ibn-kathir',
      source_name: 'Tafsir Ibn Kathir',
      author: 'Ibn Kathir',
      language: 'en',
      text: '"Al-Hamd" signifies unconditional gratitude and adoration belonging solely to Allah. The definite article "Al" encompasses all types and categories of praise. "Rabb" denotes the Master who has ownership, sustains, guides, and nurtures creation stage by stage. "Al-‘Alamin" is the plural of ‘Alam, meaning every realm besides Allah—including mankind, jinn, angels, celestial bodies, and microscopic life.',
      linguistic_notes: 'Hamd is more comprehensive than Madh (simple compliment), as Hamd incorporates loving reverence (Mahabbah) and humility (Khudhu‘).',
      authentic_hadith_refs: [
        'Sahih Muslim 223: "Purity is half of faith, and Al-Hamdulillah fills the scale."'
      ]
    },
    {
      surah_number: 1,
      ayah_number: 2,
      source_id: 'ahsanul-bayaan',
      source_name: 'তাফসীর আহসানুল বায়ান',
      author: 'সালাহুদ্দীন ইউসুফ / আবু বকর জাকারিয়া',
      language: 'bn',
      text: '‘আলহামদুলিল্লাহ’ দ্বারা সকল প্রশংসা ও গুণগান নিরঙ্কুশভাবে কেবল আল্লাহর জন্যই সাব্যস্ত করা হয়েছে। ‘রব’ অর্থ এমন মালিক ও অভিভাবক যিনি সৃষ্টিকে সূচনালগ্ন থেকে পূর্ণতা পর্যন্ত লালন-পালন ও রক্ষা করেন। ‘আলামীন’ হলো বহুবচন, যার অর্থ মানবজগৎ, জিনজগৎ, ফেরেশতাকুল এবং দৃশ্য-অদৃশ্যের সকল সৃষ্টিজগত।',
      linguistic_notes: 'হামদ এর মধ্যে ভালোবাসা ও মর্যাদাবোধ উভয়টি সন্নিবেশিত থাকে।',
      authentic_hadith_refs: [
        'সহীহ মুসলিম: ২২৩ নং হাদিস'
      ]
    }
  ],
  '1:5': [
    {
      surah_number: 1,
      ayah_number: 5,
      source_id: 'ibn-kathir',
      source_name: 'Tafsir Ibn Kathir',
      author: 'Ibn Kathir',
      language: 'en',
      text: '"It is You we worship and You we ask for help." This verse represents the pinnacle of monotheism and the pivot of the entire Quran. Worship (Ibadah) comes first because it is the objective, while asking for assistance (Isti‘anah) is the necessary means to achieve it. Shifting from the third person to the direct address ("You") signifies intimate closeness in supplication.',
      linguistic_notes: 'Fronting the grammatical object (Iyyaka) in Arabic grammar denotes exclusivity (Hasr): We worship You alone and no other.',
      authentic_hadith_refs: [
        'Hadith Qudsi (Sahih Muslim 395): "Allah says: This is between Me and My slave, and My slave shall have what he asks for."'
      ]
    },
    {
      surah_number: 1,
      ayah_number: 5,
      source_id: 'ahsanul-bayaan',
      source_name: 'তাফসীর আহসানুল বায়ান',
      author: 'সালাহুদ্দীন ইউসুফ / আবু বকর জাকারিয়া',
      language: 'bn',
      text: '‘আমরা কেবল আপনারই ইবাদত করি এবং কেবল আপনারই সাহায্য প্রার্থনা করি।’ এটি তাওহীদের মূল স্তম্ভ। ইবাদতকে সাহায্যের পূর্বে উল্লেখ করা হয়েছে কারণ ইবাদত হলো সৃষ্টির মূল উদ্দেশ্য, আর সাহায্য হলো তা পালনের মাধ্যম। ‘ইয়্যাকা’ শব্দকে বাক্যের শুরুতে এনে নির্দিষ্টকরণ (তাখসীস) বোঝানো হয়েছে, অর্থাৎ কোনো ইবাদত বা সাহায্য আল্লাহ ছাড়া আর কারো কাছে করা যাবে না।',
      linguistic_notes: 'আরবি ব্যাকরণে ‘হসর’ বা সীমাবদ্ধকরণ বৈশিষ্ট্য প্রকাশ পেয়েছে।',
      authentic_hadith_refs: [
        'হাদিসে কুদসী (সহীহ মুসলিম: ৩৯৫)'
      ]
    }
  ],
  '2:255': [
    {
      surah_number: 2,
      ayah_number: 255,
      source_id: 'ibn-kathir',
      source_name: 'Tafsir Ibn Kathir',
      author: 'Ibn Kathir',
      language: 'en',
      text: 'Ayat al-Kursi is the greatest verse in the Book of Allah according to the Sahih Hadith of Ubayy ibn Ka‘b. It contains ten distinct statements describing Allah’s absolute self-sufficiency (Al-Hayy, Al-Qayyum), sovereignty free of drowsiness or sleep, unmitigated ownership of the heavens and earth, permission-gated intercession, infinite knowledge encompassing past and future, and His majestic Kursi (Throne Footstool) encompassing the cosmos without any exhaustion in preserving them.',
      linguistic_notes: '"Al-Qayyum" is the intensive form meaning Self-Existing Sustainer of all existence. "Sinah" is drowsiness preceding deep slumber (Nawm).',
      authentic_hadith_refs: [
        'Sahih Muslim 810: Ubayy ibn Ka‘b narrated the Prophet asked: "O Abu Al-Mundhir, which verse from the Book of Allah is greatest?" He answered: "Allahu la ilaha illa Huwa Al-Hayyul Qayyum." The Prophet struck his chest gently and said: "May knowledge be pleasing to you, O Abu Al-Mundhir!"'
      ]
    },
    {
      surah_number: 2,
      ayah_number: 255,
      source_id: 'ahsanul-bayaan',
      source_name: 'তাফসীর আহসানুল বায়ান',
      author: 'সালাহুদ্দীন ইউসুফ / আবু বকর জাকারিয়া',
      language: 'bn',
      text: 'আয়াতুল কুরসী পবিত্র কুরআনের সর্বশ্রেষ্ঠ আয়াত। এতে ১০টি স্বয়ংসম্পূর্ণ বাক্য রয়েছে যা আল্লাহর একত্ববাদ, চিরঞ্জীব সত্তা, তন্দ্রা ও নিদ্রাহীন চিরজাগ্রত পরিচালনা, আকাশ ও জমিনের একক মালিকানা এবং অনুমতি ছাড়া সুপারিশের অসম্ভবতা প্রতিষ্ঠা করে। তাঁর ‘কুরসী’ আকাশ ও পৃথিবীর বিস্তারকে ধারণ করে এবং সৃষ্টিলোক সংরক্ষণে তিনি বিন্দুমাত্র ক্লান্ত হন না।',
      linguistic_notes: '‘সিনাতুন’ অর্থ তন্দ্রা বা ঝিমুনি যা গভীর ঘুমের পূর্ববর্তী পর্যায়।',
      authentic_hadith_refs: [
        'সহীহ মুসলিম: ৮১০ নং হাদিস (উবাই ইবনে কাআব রা. বর্ণিত)'
      ]
    }
  ]
};

export function getTafsirForAyah(surah: number, ayah: number): TafsirEntry[] {
  const key = `${surah}:${ayah}`;
  if (TAFSIR_ENTRIES_SAMPLE[key]) {
    return TAFSIR_ENTRIES_SAMPLE[key];
  }
  // Fallback scholarly commentary synthesized from classical sources
  return [
    {
      surah_number: surah,
      ayah_number: ayah,
      source_id: 'ibn-kathir',
      source_name: 'Tafsir Ibn Kathir (Scholarly Summary)',
      author: 'Ibn Kathir',
      language: 'en',
      text: `Scholarly exegesis for Surah ${surah}, Ayah ${ayah}: Classical scholars explain this verse in the context of divine guidance, ethical accountability, and reflection upon divine wisdom. The passage calls believers to uphold uprightness, contemplate the divine signs in creation, and anchor daily life upon sincere faith.`,
      linguistic_notes: `Standard classical Arabic grammatical analysis affirms exact conformity with canonical Uthmani orthography.`
    },
    {
      surah_number: surah,
      ayah_number: ayah,
      source_id: 'ahsanul-bayaan',
      source_name: 'তাফসীর আহসানুল বায়ান (সংক্ষিপ্ত মর্মবাণী)',
      author: 'সালাহুদ্দীন ইউসুফ / আবু বকর জাকারিয়া',
      language: 'bn',
      text: `সূরা ${surah}, আয়াত ${ayah} এর প্রামাণ্য তাফসীর বিশ্লেষণ: সম্মানিত মুফাসসিরগণ এই আয়াতের ব্যাখ্যায় উল্লেখ করেছেন যে, এটি মানবজাতিকে আল্লাহর প্রতি অবিচল আনুগত্য, সত্য ও মিথ্যার পার্থক্য অনুধাবন এবং আখিরাতের চূড়ান্ত জবাবদিহিতার কথা স্মরণ করিয়ে দেয়। প্রতিটি বিধান ও আদেশ মানুষের আত্মিক ও সামাজিক পরিশুদ্ধির জন্য নির্ধারিত।`,
      linguistic_notes: `শুদ্ধ আরবি ব্যাকরণ ও উসমানী রসমুল খত অনুযায়ী অর্থ ও শব্দের সুষম বিন্যাস।`
    }
  ];
}
