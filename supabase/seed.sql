-- ========================================================
-- Al-Quran Platform - Seed Reference Data
-- Seed: supabase/seed.sql
-- ========================================================

-- Insert Reciters
INSERT INTO public.reciters (id, name, name_ar, name_bn, style, bitrate, audio_base_url) VALUES
('mishary-alafasy', 'Mishary Rashid Alafasy', 'مشاري بن راشد العفاسي', 'মিশারী রশীদ আল-আফাসী', 'Murattal', '128kbps', 'https://everyayah.com/data/Alafasy_128kbps'),
('abdulbaset-murattal', 'AbdulBaset AbdulSamad', 'عبد الباسط عبد الصمد', 'আব্দুল বাসেত আব্দুস সামাদ', 'Murattal', '192kbps', 'https://everyayah.com/data/Abdul_Basit_Murattal_192kbps'),
('mahmoud-al-husary', 'Mahmoud Khalil Al-Husary', 'محمود خليل الحصري', 'মাহমুদ খলিল আল-হুসারী', 'Murattal (Tajweed)', '128kbps', 'https://everyayah.com/data/Husary_128kbps')
ON CONFLICT (id) DO NOTHING;

-- Insert Tafsir Sources
INSERT INTO public.tafsir_sources (id, name, author, language, description) VALUES
('ibn-kathir', 'Tafsir Ibn Kathir', 'Al-Hafidh Ibn Kathir', 'en', 'Classic exegesis grounding Quran with Quran, Hadith, and Sahabah reports.'),
('ahsanul-bayaan', 'তাফসীর আহসানুল বায়ান', 'সালাহুদ্দীন ইউসুফ / আবু বকর জাকারিয়া', 'bn', 'সহীহ হাদিস ও প্রামাণ্য ব্যাখ্যার সমন্বয়ে রচিত বাংলা তাফসীর।'),
('jalalayn', 'Tafsir al-Jalalayn', 'Al-Mahalli & Al-Suyuti', 'en', 'Concise classical linguistic and legal exegesis.')
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Surahs (Al-Fatihah, Al-Baqarah, Al-Ikhlas)
INSERT INTO public.surahs (number, name_ar, name_en, name_transliteration, name_bn, translation_en, translation_bn, verses_count, revelation_place, revelation_order, juz_start, page_start, bismillah_pre) VALUES
(1, 'الفاتحة', 'Al-Fatihah', 'Al-Faatiha', 'আল-ফাতিহা', 'The Opening', 'সূচনা', 7, 'Meccan', 5, 1, 1, false),
(2, 'البقرة', 'Al-Baqarah', 'Al-Baqara', 'আল-বাক্বারাহ', 'The Cow', 'বকনা বাছুর', 286, 'Medinan', 87, 1, 2, true),
(112, 'الإخلاص', 'Al-Ikhlas', 'Al-Ikhlaas', 'আল-ইখলাস', 'The Sincerity', 'একনিষ্ঠতা', 4, 'Meccan', 22, 30, 604, true),
(113, 'الفلق', 'Al-Falaq', 'Al-Falaq', 'আল-ফালাক্ব', 'The Daybreak', 'উষাকালের আলো', 5, 'Meccan', 20, 30, 604, true),
(114, 'الناس', 'An-Nas', 'An-Naas', 'আন-নাস', 'Mankind', 'মানবজাতি', 6, 'Meccan', 21, 30, 604, true)
ON CONFLICT (number) DO NOTHING;

-- Insert Sample Ayahs for Al-Fatihah
INSERT INTO public.ayahs (id, surah_number, ayah_number, text_ar, juz, hizb, page) VALUES
('1:1', 1, 1, 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', 1, 1, 1),
('1:2', 1, 2, 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ', 1, 1, 1),
('1:3', 1, 3, 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', 1, 1, 1),
('1:4', 1, 4, 'مَٰلِكِ يَوْمِ ٱلدِّينِ', 1, 1, 1),
('1:5', 1, 5, 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', 1, 1, 1),
('1:6', 1, 6, 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ', 1, 1, 1),
('1:7', 1, 7, 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ', 1, 1, 1)
ON CONFLICT (id) DO NOTHING;
