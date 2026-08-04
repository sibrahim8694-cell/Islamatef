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
  { id: 1, name: 'محمود خليل الحصري (مجود)', server: 'https://server13.mp3quran.net/husr/Almusshaf-Al-Mojawwad' },
  { id: 2, name: 'عبدالباسط عبدالصمد (مجود)', server: 'https://server7.mp3quran.net/basit/Almusshaf-Al-Mojawwad' },
  { id: 3, name: 'محمد صديق المنشاوي (مجود)', server: 'https://server10.mp3quran.net/minsh/Almusshaf-Al-Mojawwad' },
  { id: 4, name: 'مصطفى إسماعيل (مجود)', server: 'https://server8.mp3quran.net/mustafa/Almusshaf-Al-Mojawwad' },
  { 
    id: 24, 
    name: 'محمد رفعت (مجود)', 
    server: 'https://server14.mp3quran.net/refat', 
    fallbackServer: 'https://archive.org/download/4011wwwwwwwwwwwwwwwwwwwwwwwwwwww9',
    availableSurahs: [0, 9, 10, 11, 16, 17, 18, 19, 47, 53, 54, 55, 68, 71, 72, 74, 75, 76, 77, 78, 80, 81, 82, 84, 85, 86, 87, 88, 95, 97, 99]
  },
  { 
    id: 25, 
    name: 'شعبان الصياد (مجود)', 
    server: 'https://server11.mp3quran.net/shaban', 
    fallbackServer: 'https://archive.org/download/Shabaan_ElSayyad_Mojawwad',
    availableSurahs: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 15, 16, 18, 19, 20, 21, 23, 25, 26, 27, 28, 31, 32, 34, 37, 39, 40, 41, 42, 44, 45, 46, 51, 52, 53, 58, 59, 66, 67, 68, 76, 77, 78, 79, 80, 81, 86, 87, 88, 89, 90, 91, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104]
  },
  { 
    id: 26, 
    name: 'محمد عبدالوهاب الطنطاوي (مجود/مرتل)', 
    server: 'https://ia801806.us.archive.org/12/items/alfirdws3475468776543676875675666_gmail_002_201806', 
    fallbackServer: 'https://archive.org/download/k18_gkmail_002_201k' 
  },
  { id: 5, name: 'محمد جبريل', server: 'https://server8.mp3quran.net/jbrl' },
  { id: 51, name: 'محمود خليل الحصري (مرتل)', server: 'https://server13.mp3quran.net/husr' },
  { id: 52, name: 'عبدالباسط عبدالصمد (مرتل)', server: 'https://server7.mp3quran.net/basit' },
  { id: 53, name: 'محمد صديق المنشاوي (مرتل)', server: 'https://server10.mp3quran.net/minsh' },
  { id: 6, name: 'محمود علي البنا (مجود)', server: 'https://server8.mp3quran.net/bna/Almusshaf-Al-Mojawwad' },
  { id: 7, name: 'محمد محمود الطبلاوي', server: 'https://server12.mp3quran.net/tblawi' },
  { id: 8, name: 'مشاري العفاسي (مرتل)', server: 'https://server8.mp3quran.net/afs' },
  { id: 9, name: 'ياسر الدوسري (مرتل)', server: 'https://server11.mp3quran.net/yasser' },
  { id: 10, name: 'ماهر المعيقلي', server: 'https://server12.mp3quran.net/maher' },
  { id: 11, name: 'أحمد العجمي', server: 'https://server10.mp3quran.net/ajm' },
  { id: 12, name: 'سعد الغامدي', server: 'https://server7.mp3quran.net/s_gmd' },
  { id: 13, name: 'أبو بكر الشاطري', server: 'https://server11.mp3quran.net/shatri' },
  { id: 14, name: 'عبدالرحمن السديس', server: 'https://server11.mp3quran.net/sds' },
  { id: 15, name: 'سعود الشريم', server: 'https://server7.mp3quran.net/shur' },
  { id: 16, name: 'خالد الجليل', server: 'https://server10.mp3quran.net/jleel' },
  { id: 17, name: 'فارس عباد', server: 'https://server8.mp3quran.net/frs_a' },
  { id: 18, name: 'عبدالودود حنيف', server: 'https://server8.mp3quran.net/wdod' },
  { id: 19, name: 'ناصر القطامي', server: 'https://server6.mp3quran.net/qtm' },
  { id: 20, name: 'بندر بليلة', server: 'https://server6.mp3quran.net/balilah' },
  { id: 21, name: 'عبدالرحمن الشحات', server: 'https://server16.mp3quran.net/a_alshahhat/Rewayat-Hafs-A-n-Assem' },
  { id: 22, name: 'علي جابر', server: 'https://server11.mp3quran.net/a_jbr' },
  { id: 23, name: 'محمد صديق المنشاوي (المعلم)', server: 'https://server10.mp3quran.net/minsh/Almusshaf-Al-Mo-lim' },
];

export function getSurahNumber(index: number) {
  return (index + 1).toString().padStart(3, '0');
}
