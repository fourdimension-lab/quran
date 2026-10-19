import { QuranTopic } from '../../types/quran';

export const QURAN_TOPICS_DATA: QuranTopic[] = [
  {
    id: 'tawhid',
    slug: 'tawhid-oneness-of-allah',
    title_en: 'Tawhid & Oneness of Allah',
    title_bn: 'তাওহীদ ও আল্লাহর একত্ববাদ',
    title_ar: 'التوحيد وإفراد الله بالعبادة',
    category: 'Theology & Faith',
    category_bn: 'আকীদা ও বিশ্বাস',
    description_en: 'The central message of the Quran: Allah is unique, eternal, neither begetting nor begotten, having no partners or equals.',
    description_bn: 'কুরআনের মূল বার্তা: আল্লাহ এক, অদ্বিতীয়, চিরঞ্জীব, কারো মুখাপেক্ষী নন এবং তাঁর সমকক্ষ কেউ নেই।',
    icon: 'Sparkles',
    verses: [
      { surah: 112, ayah: 1, notes_en: 'Say, He is Allah, [who is] One.', notes_bn: 'বলুন, তিনিই আল্লাহ, একক ও অদ্বিতীয়।' },
      { surah: 2, ayah: 255, notes_en: 'Ayat al-Kursi: The Verse of the Throne establishing supreme dominion.', notes_bn: 'আয়াতুল কুরসী: সার্বভৌম কর্তৃত্বের সর্বোচ্চ ঘোষণা।' },
      { surah: 59, ayah: 22, notes_en: 'He is Allah, other than whom there is no deity, Knower of the unseen and witnessed.', notes_bn: 'তিনিই আল্লাহ, যিনি ব্যতীত কোনো ইলাহ নেই, দৃশ্য ও অদৃশ্যের পরিজ্ঞাতা।' },
      { surah: 16, ayah: 51, notes_en: 'Do not take for yourselves two deities. He is but one God.', notes_bn: 'তোমরা দুই ইলাহ গ্রহণ করো না; নিশ্চয় তিনি একক উপাস্য।' }
    ]
  },
  {
    id: 'prophets',
    slug: 'prophets-and-messengers',
    title_en: 'Prophets & Messengers',
    title_bn: 'নবী ও রাসূলগণ',
    title_ar: 'الأنبياء والرسل',
    category: 'Stories & History',
    category_bn: 'ইতিহাস ও নবীদের জীবনী',
    description_en: 'God chosen messengers who guided humanity through revelation, patience, and divine wisdom from Adam to Muhammad (peace be upon them).',
    description_bn: 'মানবজাতিকে হেদায়াত প্রদর্শনের জন্য প্রেরিত নিষ্পাপ রাসূলগণের পবিত্র মিশন ও ত্যাগ।',
    icon: 'BookOpen',
    verses: [
      { surah: 2, ayah: 136, notes_en: 'We make no distinction between any of them, and to Him we submit.', notes_bn: 'আমরা তাদের কারো মধ্যে কোনো পার্থক্য করি না এবং আমরা তাঁরই অনুগত।' },
      { surah: 21, ayah: 107, notes_en: 'And We have not sent you, [O Muhammad], except as a mercy to the worlds.', notes_bn: 'আমি আপনাকে বিশ্বজগতের জন্য কেবল রহমত হিসেবেই প্রেরণ করেছি।' },
      { surah: 12, ayah: 3, notes_en: 'We relate to you the best of stories in what We have revealed to you.', notes_bn: 'আমরা আপনার নিকট সর্বোত্তম কাহিনী বর্ণনা করছি।' },
      { surah: 33, ayah: 40, notes_en: 'Muhammad is the Messenger of Allah and seal of the prophets.', notes_bn: 'মুহাম্মদ আল্লাহর রাসূল এবং সর্বশেষ ও চূড়ান্ত নবী।' }
    ]
  },
  {
    id: 'salah',
    slug: 'prayer-and-worship',
    title_en: 'Salah & Remembrance',
    title_bn: 'সালাত ও যিকির',
    title_ar: 'الصلاة والذكر',
    category: 'Pillars of Islam',
    category_bn: 'ইসলামের রুকনসমূহ',
    description_en: 'The direct spiritual connection between the servant and the Creator, purifying the heart and preventing immorality.',
    description_bn: 'বান্দা ও স্রষ্টার মধ্যকার সরাসরি আত্মিক যোগাযোগ, যা অন্তরকে পবিত্র রাখে এবং অশ্লীল কাজ থেকে বিরত রাখে।',
    icon: 'Compass',
    verses: [
      { surah: 29, ayah: 45, notes_en: 'Indeed, prayer prohibits immorality and wrongdoing.', notes_bn: 'নিশ্চয় সালাত অশ্লীল ও গর্হিত কাজ থেকে বিরত রাখে।' },
      { surah: 20, ayah: 14, notes_en: 'Establish prayer for My remembrance.', notes_bn: 'আমার স্মরণের জন্য সালাত কায়েম করুন।' },
      { surah: 2, ayah: 153, notes_en: 'Seek help through patience and prayer. Indeed, Allah is with the patient.', notes_bn: 'ধৈর্য ও সালাতের মাধ্যমে সাহায্য প্রার্থনা করো।' },
      { surah: 13, ayah: 28, notes_en: 'Unquestionably, by the remembrance of Allah hearts are assured.', notes_bn: 'জেনে রেখো, আল্লাহর যিকিরেই অন্তরসমূহ প্রশান্ত হয়।' }
    ]
  },
  {
    id: 'charity',
    slug: 'zakat-and-charity',
    title_en: 'Zakat & Charity (Sadaqah)',
    title_bn: 'যাকাত ও দান-সাদাকাহ',
    title_ar: 'الزكاة والصدقات',
    category: 'Social Justice',
    category_bn: 'সামাজিক ন্যায়বিচার',
    description_en: 'Purification of wealth through obligatory Zakat and voluntary spending to alleviate poverty, inequality, and selfishness.',
    description_bn: 'অভাব দূরীকরণ এবং সম্পদ পবিত্র করার নিমিত্তে বাধ্যতামূলক যাকাত ও স্বেচ্ছামূলক সদকা।',
    icon: 'HeartHandshake',
    verses: [
      { surah: 2, ayah: 261, notes_en: 'The example of those who spend their wealth in the way of Allah is like a grain producing seven spikes.', notes_bn: 'আল্লাহর পথে দানকারীদের দৃষ্টান্ত একটি বীজের মতো, যা থেকে সাতটি শীষ উৎপন্ন হয়।' },
      { surah: 9, ayah: 60, notes_en: 'Categorization of Zakat recipients.', notes_bn: 'যাকাতের ৮টি নির্ধারিত খাত।' },
      { surah: 2, ayah: 274, notes_en: 'Those who spend their wealth by night and day secretly and publicly will have their reward.', notes_bn: 'যারা দিন ও রাতে গোপনে ও প্রকাশ্যে দান করে, তাদের পুরস্কার তাদের রবের কাছে সংরক্ষিত।' }
    ]
  },
  {
    id: 'patience',
    slug: 'patience-and-gratitude',
    title_en: 'Patience (Sabr) & Gratitude (Shukr)',
    title_bn: 'ধৈর্য (সবর) ও কৃতজ্ঞতা (শোকর)',
    title_ar: 'الصبر والشكر',
    category: 'Character & Morals',
    category_bn: 'চরিত্র ও আত্মশুদ্ধি',
    description_en: 'The twin wings of faith: persevering with dignity during tribulation and acknowledging divine bounties with thankful obedience.',
    description_bn: 'ঈমানের দুই শক্তিশালী ভিত্তি: বিপদে অটল ধৈর্য ধারণ এবং নেয়ামতের কৃতজ্ঞতা জ্ঞাপন।',
    icon: 'Shield',
    verses: [
      { surah: 39, ayah: 10, notes_en: 'Only those who are patient will be paid their reward without measure.', notes_bn: 'ধৈর্যশীলদেরকেই তাদের প্রতিদান দেওয়া হবে অপরিমিতভাবে।' },
      { surah: 14, ayah: 7, notes_en: 'If you are grateful, I will surely increase you [in favor].', notes_bn: 'যদি তোমরা কৃতজ্ঞতা স্বীকার করো, তবে আমি অবশ্যই তোমাদের নেয়ামত বৃদ্ধি করে দেব।' },
      { surah: 94, ayah: 5, notes_en: 'For indeed, with hardship [will be] ease.', notes_bn: 'নিশ্চয় কষ্টের সাথেই রয়েছে স্বস্তি।' }
    ]
  },
  {
    id: 'justice',
    slug: 'justice-and-truth',
    title_en: 'Justice & Fairness',
    title_bn: 'ন্যায়বিচার ও ইনসাফ',
    title_ar: 'العدل والقسط',
    category: 'Ethics & Society',
    category_bn: 'নৈতিকতা ও সমাজব্যবস্থা',
    description_en: 'Absolute requirement to uphold justice even against oneself, parents, or close relatives, without partiality or hatred.',
    description_bn: 'নিজের কিংবা আত্মীয়দের বিরুদ্ধে গেলেও ন্যায়বিচারের ওপর অবিচল থাকার অলঙ্ঘনীয় ঐশী নির্দেশ।',
    icon: 'Scale',
    verses: [
      { surah: 4, ayah: 135, notes_en: 'O you who have believed, be persistently standing firm in justice, witnesses for Allah.', notes_bn: 'হে মুমিনগণ! তোমরা ইনসাফের সাথে আল্লাহর জন্য সাক্ষ্যদানে দৃঢ়প্রতিষ্ঠিত হও।' },
      { surah: 5, ayah: 8, notes_en: 'And do not let the hatred of a people prevent you from being just. Be just; that is nearer to righteousness.', notes_bn: 'কোনো সম্প্রদায়ের শত্রুতা যেন তোমাদের ইনসাফ বর্জনে প্ররোচিত না করে। ইনসাফ করো, এটাই তাকওয়ার নিকটবর্তী।' },
      { surah: 16, ayah: 90, notes_en: 'Indeed, Allah orders justice and good conduct and giving to relatives.', notes_bn: 'নিশ্চয় আল্লাহ ন্যায়পরায়ণতা, সদাচরণ ও আত্মীয়-স্বজনকে দান করার নির্দেশ দেন।' }
    ]
  },
  {
    id: 'creation',
    slug: 'creation-and-nature',
    title_en: 'Cosmos, Earth & Nature',
    title_bn: 'মহাবিশ্ব, পৃথিবী ও প্রকৃতি',
    title_ar: 'الكون والطبيعة وعجائب الخلق',
    category: 'Science & Reflection',
    category_bn: 'বিজ্ঞান ও চিন্তাশীলতা',
    description_en: 'Signs across the celestial horizon, mountains, water cycle, and biological reproduction inviting reflection.',
    description_bn: 'মহাকাশ, পর্বতমালা, বৃষ্টির পানি চক্র এবং জীবজগতে ছড়িয়ে থাকা আল্লাহর অপার নিদর্শন।',
    icon: 'Globe',
    verses: [
      { surah: 21, ayah: 30, notes_en: 'Heavens and earth were a joined entity, then We separated them, and made from water every living thing.', notes_bn: 'আকাশমন্ডলী ও পৃথিবী একত্রিত ছিল, অতঃপর আমি উভয়কে পৃথক করলাম এবং পানি হতে সকল প্রাণ সৃষ্টি করলাম।' },
      { surah: 3, ayah: 190, notes_en: 'In the creation of heavens and earth, and alternation of night and day, are signs for people of intellect.', notes_bn: 'আকাশ ও পৃথিবীর সৃষ্টিতে এবং দিন-রাত্রির পরিবর্তনে বোধসম্পন্নদের জন্য বহু নিদর্শন রয়েছে।' },
      { surah: 51, ayah: 47, notes_en: 'And the heaven We constructed with strength, and indeed, We are [its] expander.', notes_bn: 'আমি স্বীয় শক্তিবলে আকাশ সৃষ্টি করেছি এবং আমি অবশ্যই এর সম্প্রসারণকারী।' }
    ]
  },
  {
    id: 'hereafter',
    slug: 'death-and-the-hereafter',
    title_en: 'Death, Resurrection & Hereafter',
    title_bn: 'মৃত্যু, পুনরুত্থান ও আখিরাত',
    title_ar: 'الموت والبعث والدار الآخرة',
    category: 'Eschatology',
    category_bn: 'পরকাল ও শেষবিচার',
    description_en: 'The transient nature of this worldly existence, the reality of the grave, bodily resurrection, and eternal life in Paradise or Hell.',
    description_bn: 'পার্থিব জীবনের নশ্বরতা, অবধারিত মৃত্যু, হাশরের ময়দান এবং কর্মফল অনুযায়ী জান্নাত বা জাহান্নামের চিরন্তন আবাস।',
    icon: 'Hourglass',
    verses: [
      { surah: 3, ayah: 185, notes_en: 'Every soul will taste death, and you will only be given your full compensation on the Day of Resurrection.', notes_bn: 'প্রত্যেক প্রাণীকে মৃত্যুর স্বাদ গ্রহণ করতে হবে এবং কিয়ামতের দিন তোমাদের পূর্ণ প্রতিফল দেওয়া হবে।' },
      { surah: 50, ayah: 19, notes_en: 'And the intoxication of death will bring the truth; that is what you were trying to avoid.', notes_bn: 'মৃত্যুযন্ত্রণা সত্য নিয়ে উপস্থিত হবে; এ থেকেই তো তোমরা পালাতে চাইতে।' },
      { surah: 56, ayah: 10, notes_en: 'And the forerunners, the forerunners - Those are the ones brought near [to Allah].', notes_bn: 'আর অগ্রবর্তীগণ তো অগ্রবর্তীই; তারাই তো আল্লাহর নৈকট্যপ্রাপ্ত।' }
    ]
  }
];

export function getTopicBySlug(slug: string): QuranTopic | undefined {
  return QURAN_TOPICS_DATA.find((t) => t.slug === slug || t.id === slug);
}
