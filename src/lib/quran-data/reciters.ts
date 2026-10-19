import { Reciter } from '../../types/quran';

export const RECITERS_DATA: Reciter[] = [
  {
    id: 'mishary-alafasy',
    name: 'Mishary Rashid Alafasy',
    name_ar: 'مشاري بن راشد العفاسي',
    name_bn: 'মিশারী রশীদ আল-আফাসী',
    style: 'Murattal',
    bitrate: '128kbps',
    audio_base_url: 'https://everyayah.com/data/Alafasy_128kbps',
    surah_audio_base_url: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee'
  },
  {
    id: 'abdulbaset-murattal',
    name: 'AbdulBaset AbdulSamad',
    name_ar: 'عبد الباسط عبد الصمد',
    name_bn: 'আব্দুল বাসেত আব্দুস সামাদ (মুরাত্তাল)',
    style: 'Murattal',
    bitrate: '192kbps',
    audio_base_url: 'https://everyayah.com/data/Abdul_Basit_Murattal_192kbps',
    surah_audio_base_url: 'https://download.quranicaudio.com/quran/abdulbaset_mujawwad'
  },
  {
    id: 'mahmoud-al-husary',
    name: 'Mahmoud Khalil Al-Husary',
    name_ar: 'محمود خليل الحصري',
    name_bn: 'মাহমুদ খলিল আল-হুসারী',
    style: 'Murattal (Tajweed Master)',
    bitrate: '128kbps',
    audio_base_url: 'https://everyayah.com/data/Husary_128kbps',
    surah_audio_base_url: 'https://download.quranicaudio.com/quran/mahmood_khaleel_al-husaree_taraweeh'
  },
  {
    id: 'abu-bakr-al-shatri',
    name: 'Abu Bakr Al-Shatri',
    name_ar: 'أبو بكر الشاطري',
    name_bn: 'আবু বকর আশ-শাতরী',
    style: 'Murattal',
    bitrate: '128kbps',
    audio_base_url: 'https://everyayah.com/data/Abu_Bakr_Ash-Shaatree_128kbps',
    surah_audio_base_url: 'https://download.quranicaudio.com/quran/abu_bakr_ash-shaatree'
  },
  {
    id: 'saud-ash-shuraim',
    name: 'Saud Ash-Shuraim',
    name_ar: 'سعود الشريم',
    name_bn: 'সউদ আশ-শুরাইম',
    style: 'Murattal (Haramain Imam)',
    bitrate: '128kbps',
    audio_base_url: 'https://everyayah.com/data/Saood_ash-Shuraym_128kbps',
    surah_audio_base_url: 'https://download.quranicaudio.com/quran/sa3ood_al-shuraym'
  },
  {
    id: 'abdur-rahman-as-sudais',
    name: 'Abdur-Rahman As-Sudais',
    name_ar: 'عبد الرحمن السديس',
    name_bn: 'আব্দুর রহমান আস-সুদাইস',
    style: 'Murattal (Haramain Imam)',
    bitrate: '192kbps',
    audio_base_url: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps',
    surah_audio_base_url: 'https://download.quranicaudio.com/quran/abdurrahmaan_as-sudays'
  }
];

export function getAyahAudioUrl(reciterId: string, surah: number, ayah: number): string {
  const reciter = RECITERS_DATA.find((r) => r.id === reciterId) || RECITERS_DATA[0];
  const sStr = surah.toString().padStart(3, '0');
  const aStr = ayah.toString().padStart(3, '0');
  return `${reciter.audio_base_url}/${sStr}${aStr}.mp3`;
}
