export interface VocabularyCard {
  id: string;
  arabic: string;
  transliteration: string;
  meaning_en: string;
  meaning_bn: string;
  root: string;
  part_of_speech: string;
  frequency: number; // occurrences in Quran
  example_ayah: {
    surah: number;
    ayah: number;
    text_ar: string;
    translation_en: string;
    translation_bn: string;
  };
}

export const QURANIC_VOCABULARY_DATA: VocabularyCard[] = [
  {
    id: 'allah',
    arabic: 'اللَّه',
    transliteration: 'Allah',
    meaning_en: 'God, The One True Deity',
    meaning_bn: 'আল্লাহ, একমাত্র সত্য উপাস্য',
    root: 'أ-ل-ه',
    part_of_speech: 'Proper Noun',
    frequency: 2699,
    example_ayah: {
      surah: 1,
      ayah: 2,
      text_ar: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
      translation_en: '[All] praise is [due] to Allah, Lord of the worlds.',
      translation_bn: 'সকল প্রশংসা আল্লাহর জন্য, যিনি সকল সৃষ্টির রব।'
    }
  },
  {
    id: 'rabb',
    arabic: 'رَبّ',
    transliteration: 'Rabb',
    meaning_en: 'Lord, Sustainer, Cherisher, Master',
    meaning_bn: 'প্রতিপালক, প্রভু, পালনকর্তা',
    root: 'ر-ب-ب',
    part_of_speech: 'Noun',
    frequency: 975,
    example_ayah: {
      surah: 1,
      ayah: 2,
      text_ar: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
      translation_en: 'Lord of the worlds.',
      translation_bn: 'যিনি সকল সৃষ্টির প্রতিপালক।'
    }
  },
  {
    id: 'rahmah',
    arabic: 'رَحْمَة',
    transliteration: 'Rahmah',
    meaning_en: 'Mercy, Compassion, Grace',
    meaning_bn: 'দয়া, রহমত, করুণা',
    root: 'ر-ح-م',
    part_of_speech: 'Noun',
    frequency: 339,
    example_ayah: {
      surah: 7,
      ayah: 156,
      text_ar: 'وَرَحْمَتِى وَسِعَتْ كُلَّ شَىْءٍۢ',
      translation_en: 'My mercy encompasses all things.',
      translation_bn: 'আর আমার রহমত প্রতিটি বস্তুকে পরিবেষ্টন করে রয়েছে।'
    }
  },
  {
    id: 'iman',
    arabic: 'إِيمَان',
    transliteration: 'Iman',
    meaning_en: 'Faith, Belief, Conviction',
    meaning_bn: 'ঈমান, বিশ্বাস, গভীর প্রত্যয়',
    root: 'أ-م-ن',
    part_of_speech: 'Noun',
    frequency: 811,
    example_ayah: {
      surah: 2,
      ayah: 3,
      text_ar: 'ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ',
      translation_en: 'Who believe in the unseen...',
      translation_bn: 'যারা অদৃশ্যে বিশ্বাস স্থাপন করে...'
    }
  },
  {
    id: 'kitab',
    arabic: 'كِتَاب',
    transliteration: 'Kitab',
    meaning_en: 'Book, Scripture, Written Record',
    meaning_bn: 'কিতাব, ঐশী গ্রন্থ, লিখিত আমলনামা',
    root: 'ك-ت-ب',
    part_of_speech: 'Noun',
    frequency: 261,
    example_ayah: {
      surah: 2,
      ayah: 2,
      text_ar: 'ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ',
      translation_en: 'This is the Book about which there is no doubt.',
      translation_bn: 'এ সেই কিতাব, যাতে কোনো সন্দেহ নেই।'
    }
  },
  {
    id: 'ilm',
    arabic: 'عِلْم',
    transliteration: "'Ilm",
    meaning_en: 'Knowledge, Insight, Wisdom',
    meaning_bn: 'ইলম, জ্ঞান, উপলব্ধি',
    root: 'ع-ل-م',
    part_of_speech: 'Noun',
    frequency: 779,
    example_ayah: {
      surah: 20,
      ayah: 114,
      text_ar: 'وَقُل رَّبِّ زِدْنِى عِلْمًۭا',
      translation_en: 'And say, "My Lord, increase me in knowledge."',
      translation_bn: 'এবং বলুন, "হে আমার প্রতিপালক! আমার জ্ঞান বৃদ্ধি করে দিন।"'
    }
  },
  {
    id: 'haqq',
    arabic: 'حَقّ',
    transliteration: 'Haqq',
    meaning_en: 'Truth, Reality, Right, Justice',
    meaning_bn: 'সত্য, হক, অধিকার, ন্যায়',
    root: 'ح-ق-ق',
    part_of_speech: 'Noun',
    frequency: 287,
    example_ayah: {
      surah: 17,
      ayah: 81,
      text_ar: 'جَآءَ ٱلْحَقُّ وَزَهَقَ ٱلْبَٰطِلُ',
      translation_en: 'Truth has come, and falsehood has departed.',
      translation_bn: 'সত্য সমাগত এবং মিথ্যা অপসৃত।'
    }
  },
  {
    id: 'sabr',
    arabic: 'صَبْر',
    transliteration: 'Sabr',
    meaning_en: 'Patience, Steadfastness, Perseverance',
    meaning_bn: 'ধৈর্য, অবিচলতা, সহনশীলতা',
    root: 'ص-ب-ر',
    part_of_speech: 'Noun',
    frequency: 103,
    example_ayah: {
      surah: 2,
      ayah: 153,
      text_ar: 'إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ',
      translation_en: 'Indeed, Allah is with the patient.',
      translation_bn: 'নিশ্চয় আল্লাহ ধৈর্যশীলদের সাথে আছেন।'
    }
  },
  {
    id: 'qalb',
    arabic: 'قَلْب',
    transliteration: 'Qalb',
    meaning_en: 'Heart, Spiritual center of perception',
    meaning_bn: 'অন্তর, হৃদয়, উপলব্ধি কেন্দ্র',
    root: 'ق-ل-ب',
    part_of_speech: 'Noun',
    frequency: 168,
    example_ayah: {
      surah: 26,
      ayah: 89,
      text_ar: 'إِلَّا مَنْ أَتَى ٱللَّهَ بِقَلْبٍۢ سَلِيمٍۢ',
      translation_en: 'Except for one who comes to Allah with a sound heart.',
      translation_bn: 'কেবল সে ব্যতীত, যে আল্লাহর নিকট সুস্থ ও কলুষমুক্ত অন্তর নিয়ে আসবে।'
    }
  },
  {
    id: 'taqwa',
    arabic: 'تَقْوَىٰ',
    transliteration: 'Taqwa',
    meaning_en: 'God-consciousness, Piety, Reverence',
    meaning_bn: 'তাকওয়া, খোদাভীতি, আত্মসংযম',
    root: 'و-ق-ي',
    part_of_speech: 'Noun',
    frequency: 258,
    example_ayah: {
      surah: 49,
      ayah: 13,
      text_ar: 'إِنَّ أَكْرَمَكُمْ عِندَ ٱللَّهِ أَتْقَىٰكُمْ',
      translation_en: 'Indeed, the most noble of you in the sight of Allah is the most righteous of you.',
      translation_bn: 'নিশ্চয় আল্লাহর নিকট তোমাদের মধ্যে সর্বাধিক সম্মানিত সে-ই, যে সর্বাধিক মুত্তাকী।'
    }
  }
];
