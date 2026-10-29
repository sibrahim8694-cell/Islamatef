export const SURAHS = [
    "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
    "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه",
    "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
    "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر",
    "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
    "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
    "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
    "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
    "التكوير", "الإنفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
    "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات",
    "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر",
    "المسد", "الإخلاص", "الفلق", "الناس"
];

export interface Reciter {
  id: number;
  name: string;
  server?: string;
  fallbackServer?: string;
  buildUrl?: (surahIndex: number) => string;
  availableSurahs?: number[]; // indices 0-113
}


export const RECITERS: Reciter[] = [
  { 
    id: 1, 
    name: 'محمود خليل الحصري (مجود)', 
    server: 'https://cdn.mp3quran.net/audio/mahmoud-husary/r2',
    fallbackServer: 'https://download.quranicaudio.com/quran/mahmood_khaleel_al-husaree_mujawwad'
  },
  { 
    id: 2, 
    name: 'عبدالباسط عبدالصمد (مجود)', 
    server: 'https://cdn.mp3quran.net/audio/abdulbasit-abdulsamad/r1',
    fallbackServer: 'https://download.quranicaudio.com/quran/abdul_basit_mujawwad'
  },
  { 
    id: 3, 
    name: 'محمد صديق المنشاوي (مجود)', 
    server: 'https://cdn.mp3quran.net/audio/muhammad-minshawi/r2',
    fallbackServer: 'https://download.quranicaudio.com/quran/muhammad_siddeeq_al-minshaawee_mujawwad'
  },
  { 
    id: 4, 
    name: 'مصطفى إسماعيل (مجود)', 
    server: 'https://cdn.mp3quran.net/audio/mustafa-ismail/r2',
    fallbackServer: 'https://download.quranicaudio.com/quran/mustafa_ismail'
  },
  { 
    id: 24, 
    name: 'محمد رفعت (مجود)', 
    server: 'https://cdn.mp3quran.net/audio/muhammad-refaat/r1', 
    fallbackServer: 'https://archive.org/download/4011wwwwwwwwwwwwwwwwwwwwwwwwwwww9'
  },
  { 
    id: 25, 
    name: 'شعبان الصياد (مجود)', 
    server: 'https://cdn.mp3quran.net/audio/shaban-sayyad/r1', 
    fallbackServer: 'https://archive.org/download/Shabaan_ElSayyad_Mojawwad'
  },
  { 
    id: 26, 
    name: 'محمد عبدالوهاب الطنطاوي (مجود/مرتل)', 
    server: 'https://archive.org/download/alfirdws3475468776543676875675666_gmail_002_201806', 
    fallbackServer: 'https://archive.org/download/k18_gkmail_002_201k' 
  },
  { 
    id: 5, 
    name: 'محمد جبريل', 
    server: 'https://cdn.mp3quran.net/audio/muhammad-jibreel/r1',
    fallbackServer: 'https://download.quranicaudio.com/quran/muhammad_jibreel'
  },
  { 
    id: 51, 
    name: 'محمود خليل الحصري (مرتل)', 
    server: 'https://cdn.mp3quran.net/audio/mahmoud-husary/r1',
    fallbackServer: 'https://download.quranicaudio.com/quran/mahmood_khaleel_al-husaree'
  },
  { 
    id: 52, 
    name: 'عبدالباسط عبدالصمد (مرتل)', 
    server: 'https://cdn.mp3quran.net/audio/abdulbasit-abdulsamad/r3',
    fallbackServer: 'https://download.quranicaudio.com/quran/abdulbaset_mujawwad'
  },
  { 
    id: 53, 
    name: 'محمد صديق المنشاوي (مرتل)', 
    server: 'https://cdn.mp3quran.net/audio/muhammad-minshawi/r1',
    fallbackServer: 'https://download.quranicaudio.com/quran/muhammad_siddeeq_al-minshaawee'
  },
  { 
    id: 6, 
    name: 'محمود علي البنا (مجود)', 
    server: 'https://cdn.mp3quran.net/audio/mahmoud-banna/r2',
    fallbackServer: 'https://download.quranicaudio.com/quran/mahmood_al-banna'
  },
  { 
    id: 7, 
    name: 'محمد محمود الطبلاوي', 
    server: 'https://cdn.mp3quran.net/audio/muhammad-tablawi/r1',
    fallbackServer: 'https://download.quranicaudio.com/quran/mohammad_altablawee'
  },
  { 
    id: 8, 
    name: 'مشاري العفاسي (مرتل)', 
    server: 'https://cdn.mp3quran.net/audio/mishary-alafasy/r1',
    fallbackServer: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee'
  },
  { 
    id: 9, 
    name: 'ياسر الدوسري (مرتل)', 
    server: 'https://cdn.mp3quran.net/audio/yasser-dosari/r1',
    fallbackServer: 'https://download.quranicaudio.com/quran/yasser_ad-dussary'
  },
  { 
    id: 10, 
    name: 'ماهر المعيقلي', 
    server: 'https://cdn.mp3quran.net/audio/maher-muaiqly/r1',
    fallbackServer: 'https://download.quranicaudio.com/quran/maher_almu3aiqly/year1440'
  },
  { 
    id: 11, 
    name: 'أحمد العجمي', 
    server: 'https://cdn.mp3quran.net/audio/ahmad-ajmi/r1',
    fallbackServer: 'https://download.quranicaudio.com/quran/ahmed_ibn_3ali_al-3ajamy'
  },
  { 
    id: 12, 
    name: 'سعد الغامدي', 
    server: 'https://cdn.mp3quran.net/audio/saad-ghamdi/r1',
    fallbackServer: 'https://download.quranicaudio.com/quran/sa3d_al-ghaamidi/complete'
  },
  { 
    id: 13, 
    name: 'أبو بكر الشاطري', 
    server: 'https://cdn.mp3quran.net/audio/abubakr-shatri/r1',
    fallbackServer: 'https://download.quranicaudio.com/quran/abu_bakr_ash-shaatree'
  },
  { 
    id: 14, 
    name: 'عبدالرحمن السديس', 
    server: 'https://cdn.mp3quran.net/audio/abdulrahman-sudais/r1',
    fallbackServer: 'https://download.quranicaudio.com/quran/abdurrahmaan_as-sudays'
  },
  { 
    id: 15, 
    name: 'سعود الشريم', 
    server: 'https://cdn.mp3quran.net/audio/saud-shuraim/r1',
    fallbackServer: 'https://download.quranicaudio.com/quran/sa3ood_ash-shuraym'
  },
  { 
    id: 16, 
    name: 'خالد الجليل', 
    server: 'https://cdn.mp3quran.net/audio/khalid-jalil/r1',
    fallbackServer: 'https://server10.mp3quran.net/jleel'
  },
  { 
    id: 17, 
    name: 'فارس عباد', 
    server: 'https://cdn.mp3quran.net/audio/fares-abbad/r1',
    fallbackServer: 'https://download.quranicaudio.com/quran/faaris_3abbaad'
  },
  { 
    id: 18, 
    name: 'عبدالودود حنيف', 
    server: 'https://cdn.mp3quran.net/audio/abdulwadood-haneef/r1',
    fallbackServer: 'https://download.quranicaudio.com/quran/abdul_wadood_haneef'
  },
  { 
    id: 19, 
    name: 'ناصر القطامي', 
    server: 'https://cdn.mp3quran.net/audio/nasser-qatami/r1',
    fallbackServer: 'https://download.quranicaudio.com/quran/nasser_alqatami'
  },
  { 
    id: 20, 
    name: 'بندر بليلة', 
    server: 'https://cdn.mp3quran.net/audio/bandar-baleela/r1',
    fallbackServer: 'https://server6.mp3quran.net/balilah'
  },
  { 
    id: 21, 
    name: 'عبدالرحمن الشحات', 
    server: 'https://cdn.mp3quran.net/audio/abdulrahman-shahat/r1',
    fallbackServer: 'https://server16.mp3quran.net/a_alshahhat/Rewayat-Hafs-A-n-Assem'
  },
  { 
    id: 22, 
    name: 'علي جابر', 
    server: 'https://cdn.mp3quran.net/audio/ali-jaber/r1',
    fallbackServer: 'https://download.quranicaudio.com/quran/ali_jaber'
  },
  { 
    id: 23, 
    name: 'محمد صديق المنشاوي (المعلم)', 
    server: 'https://cdn.mp3quran.net/audio/muhammad-minshawi/r3',
    fallbackServer: 'https://server10.mp3quran.net/minsh/Almusshaf-Al-Mo-lim'
  },
];

export function getSurahNumber(index: number) {
  return (index + 1).toString().padStart(3, '0');
}
