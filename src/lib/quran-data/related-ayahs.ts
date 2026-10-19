import { RelatedAyah } from '../../types/quran';

export const RELATED_AYAHS_MAP: Record<string, RelatedAyah[]> = {
  // Surah 1 Ayah 1 (Bismillah)
  '1:1': [
    {
      surah_number: 27,
      ayah_number: 30,
      text_ar: 'إِنَّهُۥ مِن سُلَيْمَٰنَ وَإِنَّهُۥ بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
      translation_en: 'Indeed, it is from Solomon, and indeed, it reads: "In the name of Allah, the Entirely Merciful, the Especially Merciful."',
      translation_bn: 'নিশ্চয় এটা সুলাইমানের নিকট থেকে এবং এটা এই: ‘পরম করুণাময় অতি দয়ালু আল্লাহর নামে।’',
      relation_type: 'same_word',
      explanation: 'The exact full formula "Bismillahir Rahmanir Rahim" appears internally within the text of the Quran in Prophet Solomon\'s letter to Queen Bilqis.',
      shared_key: 'Bismillah'
    },
    {
      surah_number: 11,
      ayah_number: 41,
      text_ar: 'وَقَالَ ٱرْكَبُوا۟ فِيهَا بِسْمِ ٱللَّهِ مَجْر۪ىٰهَا وَمُرْسَىٰهَآ ۚ إِنَّ رَبِّى لَغَفُورٌۭ رَّحِيمٌۭ',
      translation_en: 'And [Noah] said, "Embark therein; in the name of Allah is its course and its anchorage. Indeed, my Lord is Forgiving and Merciful."',
      translation_bn: 'আর নূহ বললেন, "তোমরা এতে আরোহণ কর; আল্লাহর নামেই এর গতি ও এর স্থিতি। নিশ্চয় আমার রব পরম ক্ষমাশীল, পরম দয়ালু।"',
      relation_type: 'same_root',
      explanation: 'Invoking the name of Allah at the beginning of momentous journeys and life actions.',
      shared_key: 'Ism'
    }
  ],
  // Surah 1 Ayah 2 (Al-Hamdulillah)
  '1:2': [
    {
      surah_number: 6,
      ayah_number: 1,
      text_ar: 'ٱلْحَمْدُ لِلَّهِ ٱلَّذِى خَلَقَ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ وَجَعَلَ ٱلظُّلُمَٰتِ وَٱلنُّورَ',
      translation_en: '[All] praise is [due] to Allah, who created the heavens and the earth and made the darkness and the light.',
      translation_bn: 'সকল প্রশংসা আল্লাহরই যিনি আকাশমন্ডলী ও পৃথিবী সৃষ্টি করেছেন এবং অন্ধকার ও আলোর ব্যবস্থা করেছেন।',
      relation_type: 'shared_concept',
      explanation: 'Beginning a major chapter of the Quran with praise of Allah as Creator and Sustainer of cosmic realities.',
      shared_key: 'Al-Hamd'
    },
    {
      surah_number: 18,
      ayah_number: 1,
      text_ar: 'ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنزَلَ عَلَىٰ عَبْدِهِ ٱلْكِتَٰبَ وَلَمْ يَجْعَل لَّهُۥ عِوَجَاۜ',
      translation_en: '[All] praise is [due] to Allah, who has sent down upon His Servant the Book and has not made therein any deviance.',
      translation_bn: 'সকল প্রশংসা আল্লাহরই যিনি তাঁর বান্দার প্রতি এই কিতাব অবতীর্ণ করেছেন এবং এতে কোনো বক্রতা রাখেননি।',
      relation_type: 'shared_concept',
      explanation: 'Praise of Allah specifically for the gift of divine revelation and scripture.',
      shared_key: 'Al-Hamd'
    }
  ],
  // Surah 1 Ayah 5 (Iyyaka Na'budu)
  '1:5': [
    {
      surah_number: 11,
      ayah_number: 123,
      text_ar: 'فَٱعْبُدْهُ وَتَوَكَّلْ عَلَيْهِ ۚ وَمَا رَبُّكَ بِغَٰفِلٍ عَمَّا تَعْمَلُونَ',
      translation_en: 'So worship Him and rely upon Him. And your Lord is not unaware of that which you do.',
      translation_bn: 'সুতরাং তাঁরই ইবাদত করুন এবং তাঁরই ওপর ভরসা রাখুন। আর তোমরা যা কর সে সম্পর্কে আপনার রব উদাসীন নন।',
      relation_type: 'legal_moral_principle',
      explanation: 'Coupling sincere worship (Ibadah) with divine reliance and seeking assistance (Tawakkul / Isti‘anah).',
      shared_key: 'Ibadah-Tawakkul'
    },
    {
      surah_number: 67,
      ayah_number: 29,
      text_ar: 'قُلْ هُوَ ٱلرَّحْمَٰنُ ءَامَنَّا بِهِۦ وَعَلَيْهِ تَوَكَّلْنَا',
      translation_en: 'Say, "He is the Most Merciful; we have believed in Him, and upon Him we have relied."',
      translation_bn: 'বলুন, "তিনিই পরম করুণাময়; আমরা তাঁর ওপর ঈমান এনেছি এবং তাঁরই ওপর ভরসা করেছি।"',
      relation_type: 'shared_concept',
      explanation: 'Declaration of monotheistic reliance upon the All-Merciful.',
      shared_key: 'Tawakkul'
    }
  ],
  // Surah 1 Ayah 6 (Ihdinas Sirat al-Mustaqim)
  '1:6': [
    {
      surah_number: 2,
      ayah_number: 142,
      text_ar: 'قُل لِّلَّهِ ٱلْمَشْرِقُ وَٱلْمَغْرِبُ ۚ يَهْدِى مَن يَشَآءُ إِلَىٰ صِرَٰطٍۢ مُّسْتَقِيمٍۢ',
      translation_en: 'Say, "To Allah belongs the east and the west. He guides whom He wills to a straight path."',
      translation_bn: 'বলুন, "পূর্ব ও পশ্চিম আল্লাহরই। তিনি যাকে ইচ্ছা সরল সঠিক পথের দিশা দেন।"',
      relation_type: 'same_word',
      explanation: 'The Straight Path (Sirat al-Mustaqim) as the divine gift granted by Allah.',
      shared_key: 'Sirat-Mustaqim'
    },
    {
      surah_number: 6,
      ayah_number: 153,
      text_ar: 'وَأَنَّ هَٰذَا صِرَٰطِى مُسْتَقِيمًۭا فَٱتَّبِعُوهُ ۖ وَلَا تَتَّبِعُوا۟ ٱلسُّبُلَ فَتَفَرَّقَ بِكُمْ عَن سَبِيلِهِۦ',
      translation_en: 'And, [moreover], this is My path, which is straight, so follow it; and do not follow [other] ways, for you will be separated from His way.',
      translation_bn: 'আর এটাই আমার সরল-সঠিক পথ, সুতরাং তোমরা এর অনুসরণ করো এবং অন্যান্য পথের অনুসরণ করো না, কারণ তা তোমাদেরকে তাঁর পথ থেকে বিচ্ছিন্ন করে ফেলবে।',
      relation_type: 'tafsir_cross_reference',
      explanation: 'The Prophet drew a straight line in the sand and branched crooked lines around it to explain this verse.',
      shared_key: 'Sirat-Mustaqim'
    }
  ],
  // Surah 2 Ayah 255 (Ayat al-Kursi)
  '2:255': [
    {
      surah_number: 3,
      ayah_number: 2,
      text_ar: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ',
      translation_en: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.',
      translation_bn: 'আল্লাহ, তিনি ছাড়া কোনো সত্য উপাস্য নেই; তিনি চিরঞ্জীব, সর্বসত্তার ধারক।',
      relation_type: 'same_word',
      explanation: 'Exact replication of the divine names Al-Hayy (The Ever-Living) and Al-Qayyum (The Self-Subsisting).',
      shared_key: 'Al-Hayy-Al-Qayyum'
    },
    {
      surah_number: 20,
      ayah_number: 111,
      text_ar: '۞ وَعَنَتِ ٱلْوُجُوهُ لِلْحَىِّ ٱلْقَيُّومِ ۖ وَقَدْ خَابَ مَنْ حَمَلَ ظُلْمًۭا',
      translation_en: 'And all faces will be humbled before the Ever-Living, the Sustainer of existence.',
      translation_bn: 'এবং সকল মুখমণ্ডল অবনমিত হবে সেই চিরঞ্জীব, সর্বসত্তার ধারক আল্লাহর সমীপে, আর যে জুলুম বহন করেছে সে ব্যর্থ হয়েছে।',
      relation_type: 'same_root',
      explanation: 'Humbling of all creations before the supreme authority of Al-Hayy Al-Qayyum on Judgment Day.',
      shared_key: 'Al-Hayy-Al-Qayyum'
    },
    {
      surah_number: 59,
      ayah_number: 23,
      text_ar: 'هُوَ ٱللَّهُ ٱلَّذِى لَآ إِلَٰهَ إِلَّا هُوَ ٱلْمَلِكُ ٱلْقُدُّوسُ ٱلسَّلَٰمُ ٱلْمُؤْمِنُ ٱلْمُهَيْمِنُ ٱلْعَزِيزُ ٱلْجَبَّارُ ٱلْمُتَكَبِّرُ',
      translation_en: 'He is Allah, other than whom there is no deity, the Sovereign, the Pure, the Perfection, the Bestower of Faith, the Overseer, the Exalted in Might, the Compeller, the Superior.',
      translation_bn: 'তিনিই আল্লাহ, যিনি ব্যতীত কোনো সত্য উপাস্য নেই; তিনি সর্বময় কর্তৃত্বে অধিকারী, পূত-পবিত্র, শান্তিদাতা, নিরাপত্তাদাতা, সংরক্ষক, পরাক্রমশালী, মহাপ্রতাপশালী, অতীব মহিমান্বিত।',
      relation_type: 'shared_concept',
      explanation: 'Comprehensive exposition of the majestic attributes of sovereign divine majesty.',
      shared_key: 'Tawhid-Attributes'
    }
  ]
};

export function getRelatedAyahs(surah: number, ayah: number): RelatedAyah[] {
  const key = `${surah}:${ayah}`;
  if (RELATED_AYAHS_MAP[key]) {
    return RELATED_AYAHS_MAP[key];
  }
  // Generic related ayahs fallback based on Surah context
  return [
    {
      surah_number: surah === 1 ? 2 : 1,
      ayah_number: 1,
      text_ar: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
      translation_en: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
      translation_bn: 'পরম করুণাময় অতি দয়ালু আল্লাহর নামে।',
      relation_type: 'shared_concept',
      explanation: 'Fundamental Quranic invocation of divine mercy and supreme authority.',
      shared_key: 'Basmalah'
    },
    {
      surah_number: 112,
      ayah_number: 1,
      text_ar: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
      translation_en: 'Say, "He is Allah, [who is] One."',
      translation_bn: 'বলুন, "তিনিই আল্লাহ, একক ও অদ্বিতীয়।"',
      relation_type: 'shared_concept',
      explanation: 'Unified core doctrine of Tawhid running through every surah of the Holy Quran.',
      shared_key: 'Tawhid'
    }
  ];
}
