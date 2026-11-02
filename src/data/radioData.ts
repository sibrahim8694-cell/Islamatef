export interface RadioStation {
  id: string;
  name: string;
  subname: string;
  desc: string;
  streamUrl: string;
  fallbackUrl?: string;
  category: 'cairo' | 'main' | 'reciters' | 'programs' | 'azkar';
  country: string;
  countryBadge: string;
  badge: string;
  frequency?: string;
  featured?: boolean;
  color: string;
  accentColor: string;
}

export const RADIO_CATEGORIES = [
  { id: 'all', label: 'جميع الإذاعات', count: 27 },
  { id: 'cairo', label: 'إذاعة القاهرة 🇪🇬', count: 1 },
  { id: 'main', label: 'الإذاعات الكبرى', count: 3 },
  { id: 'reciters', label: 'كبار القراء (24 ساعة)', count: 16 },
  { id: 'programs', label: 'التفاسير والفتاوى والسيرة', count: 5 },
  { id: 'azkar', label: 'الأذكار والرقية', count: 2 },
];

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'cairo-quran',
    name: 'إذاعة القرآن الكريم من القاهرة',
    subname: 'جمهورية مصر العربية · 98.2 FM',
    desc: 'البث المباشر لأعرق إذاعة قرآنية في العالم، تضم تلاوات كبار قراء الراديو المصري، والبرامج الدينية والتفسير على مدار الساعة.',
    streamUrl: 'https://radio.xecod.com/station/quran-cairo',
    fallbackUrl: 'https://qurango.net/radio/mix',
    category: 'cairo',
    country: 'مصر',
    countryBadge: '🇪🇬 مصر',
    badge: 'البث الرسمي المباشر',
    frequency: '98.2 FM',
    featured: true,
    color: 'from-[#800020] via-rose-950 to-slate-950',
    accentColor: '#800020'
  },
  {
    id: 'saudi-quran',
    name: 'إذاعة القرآن الكريم - مكة المكرمة',
    subname: 'المملكة العربية السعودية · الحرمين الشريفين',
    desc: 'بث مباشر ينقل تلاوات أئمة الحرم المكي الشريف والمسجد النبوي مع تلاوات خاشعة وتغطيات للصلوات على الهواء.',
    streamUrl: 'https://stream.radiojar.com/0tpy1h0kxtzuv',
    fallbackUrl: 'https://qurango.net/radio/mix',
    category: 'main',
    country: 'السعودية',
    countryBadge: '🇸🇦 مكة المكرمة',
    badge: 'الحرم المكي',
    frequency: '100 FM',
    featured: true,
    color: 'from-emerald-900 via-teal-900 to-slate-950',
    accentColor: '#059669'
  },
  {
    id: 'quran-general',
    name: 'إذاعة القرآن الكريم العامة',
    subname: 'تلاوات مختارة لكبار القراء على مدار 24 ساعة',
    desc: 'إذاعة مستمرة بدون توقف تعرض أندر وأجمل التلاوات القرآنية المرتلة والمجودة لكبار أعلام القراء.',
    streamUrl: 'https://qurango.net/radio/mix',
    category: 'main',
    country: 'عالمي',
    countryBadge: '🌍 عالمي',
    badge: 'بث حي 24 ساعة',
    color: 'from-teal-800 to-slate-900',
    accentColor: '#0d9488'
  },
  {
    id: 'tarateel',
    name: 'إذاعة التراتيل والتلاوات الخاشعة',
    subname: 'سكينة وطمأنينة مع تلاوات القرآن الكريم',
    desc: 'قناة متخصصة في التلاوات الهادئة والخاشعة التي تبعث في النفس الراحة والخشوع والتدبر في آيات الذكر الحكيم.',
    streamUrl: 'https://qurango.net/radio/tarateel',
    category: 'main',
    country: 'عالمي',
    countryBadge: '✨ خاشعة',
    badge: 'تراتيل خاشعة',
    color: 'from-indigo-950 to-slate-900',
    accentColor: '#4f46e5'
  },
  // Reciter-dedicated 24/7 channels
  {
    id: 'abdulbasit-m',
    name: 'إذاعة الشيخ عبد الباسط عبد الصمد',
    subname: 'المصحف المجود والتلاوات النادرة',
    desc: 'بث مستمر على مدار 24 ساعة لصوت مكة وصاحب الحنجرة الذهبية الشيخ عبد الباسط عبد الصمد رحمه الله.',
    streamUrl: 'https://qurango.net/radio/abdulbasit_abdulsamad_mojawwad',
    category: 'reciters',
    country: 'مصر',
    countryBadge: '🎙️ مجود',
    badge: 'الحنجرة الذهبية',
    color: 'from-amber-950 to-slate-900',
    accentColor: '#b45309'
  },
  {
    id: 'minshawi-m',
    name: 'إذاعة الشيخ محمد صديق المنشاوي',
    subname: 'الصوت الباكي والتلاوات المجودة الخاشعة',
    desc: 'بث مباشر يصدح بتلاوات الشيخ محمد صديق المنشاوي المجودة التي تلامس القلوب بجمالها وخشوعها الصادق.',
    streamUrl: 'https://qurango.net/radio/mohammed_siddiq_alminshawi_mojawwad',
    category: 'reciters',
    country: 'مصر',
    countryBadge: '🎙️ مجود',
    badge: 'الصوت الباكي',
    color: 'from-rose-950 to-slate-900',
    accentColor: '#be123c'
  },
  {
    id: 'husary-m',
    name: 'إذاعة الشيخ محمود خليل الحصري',
    subname: 'شيخ عموم المقارئ المصرية · قمة الإتقان',
    desc: 'مدرسة التجويد الأولى وأدق التلاوات بأحكام التجويد ومخارج الحروف بصوت شيخ القراء محمود خليل الحصري.',
    streamUrl: 'https://qurango.net/radio/mahmoud_khalil_alhussary_mojawwad',
    category: 'reciters',
    country: 'مصر',
    countryBadge: '🎙️ مجود',
    badge: 'شيخ المقارئ',
    color: 'from-emerald-950 to-slate-900',
    accentColor: '#047857'
  },
  {
    id: 'mustafa-ismail',
    name: 'إذاعة الشيخ مصطفى إسماعيل',
    subname: 'أمير القراء وصاحب المقامات القرآنية الرفيعة',
    desc: 'روائع التلاوات التاريخية للشيخ مصطفى إسماعيل من الإذاعة المصرية والمحافل القرآنية الكبرى.',
    streamUrl: 'https://qurango.net/radio/mustafa_ismail',
    category: 'reciters',
    country: 'مصر',
    countryBadge: '🎙️ مجود',
    badge: 'أمير القراء',
    color: 'from-stone-900 to-slate-950',
    accentColor: '#78716c'
  },
  {
    id: 'tablawi',
    name: 'إذاعة الشيخ محمد محمود الطبلاوي',
    subname: 'نقيب القراء السابق · النبرة المميزة الخالدة',
    desc: 'تلاوات الشيخ محمد محمود الطبلاوي بنبرته الشجية الفريدة وإحساسه الرفيع بآيات الذكر الحكيم.',
    streamUrl: 'https://qurango.net/radio/mohammad_altablaway',
    category: 'reciters',
    country: 'مصر',
    countryBadge: '🎙️ مجود',
    badge: 'نقيب القراء',
    color: 'from-blue-950 to-slate-900',
    accentColor: '#1d4ed8'
  },
  {
    id: 'alafasy',
    name: 'إذاعة الشيخ مشاري بن راشد العفاسي',
    subname: 'المصحف المرتل برواية حفص عن عاصم',
    desc: 'تلاوات الشيخ مشاري العفاسي العذبة بنقاء صوتي فائق يشمل سور القرآن الكريم كاملة.',
    streamUrl: 'https://qurango.net/radio/mishary_alafasi',
    category: 'reciters',
    country: 'الكويت',
    countryBadge: '🇰🇼 الكويت',
    badge: 'مرتل',
    color: 'from-cyan-950 to-slate-900',
    accentColor: '#0e7490'
  },
  {
    id: 'dosari',
    name: 'إذاعة الشيخ ياسر الدوسري',
    subname: 'إمام وخطيب المسجد الحرام بمكة المكرمة',
    desc: 'تلاوات تراويح وتهجد وصلوات المسجد الحرام بصوت الشيخ ياسر الدوسري بتلاوة تفيض خشوعاً وجلالاً.',
    streamUrl: 'https://qurango.net/radio/yasser_aldosari',
    category: 'reciters',
    country: 'السعودية',
    countryBadge: '🇸🇦 الحرم المكي',
    badge: 'إمام الحرم',
    color: 'from-amber-950 to-slate-950',
    accentColor: '#d97706'
  },
  {
    id: 'qatami',
    name: 'إذاعة الشيخ ناصر القطامي',
    subname: 'تلاوات خاشعة وتراتيل مسائية مؤثرة',
    desc: 'بث متواصل لتلاوات القارئ ناصر القطامي بأدائه المؤثر والمحبب إلى الملايين من المسلمين.',
    streamUrl: 'https://qurango.net/radio/nasser_alqatami',
    category: 'reciters',
    country: 'السعودية',
    countryBadge: '🇸🇦 السعودية',
    badge: 'مرتل',
    color: 'from-violet-950 to-slate-900',
    accentColor: '#7c3aed'
  },
  {
    id: 'ajmi',
    name: 'إذاعة الشيخ أحمد بن علي العجمي',
    subname: 'المصحف المرتل برواية حفص عن عاصم',
    desc: 'قراءة الشيخ أحمد العجمي بنبرته القوية الرخيمة التي تصحب المستمع في رحلة إيمانية عميقة.',
    streamUrl: 'https://qurango.net/radio/ahmad_alajmy',
    category: 'reciters',
    country: 'السعودية',
    countryBadge: '🇸🇦 السعودية',
    badge: 'مرتل',
    color: 'from-slate-900 to-emerald-950',
    accentColor: '#059669'
  },
  {
    id: 'muaiqly',
    name: 'إذاعة الشيخ ماهر المعيقلي',
    subname: 'إمام المسجد الحرام · تلاوات الحرم المكي',
    desc: 'صلوات وتلاوات الحرم المكي الشريف بصوت الشيخ ماهر المعيقلي العذب والمنضبط بأحكام التلاوة.',
    streamUrl: 'https://qurango.net/radio/maher_al_muaiqly',
    category: 'reciters',
    country: 'السعودية',
    countryBadge: '🇸🇦 الحرم المكي',
    badge: 'إمام الحرم',
    color: 'from-teal-950 to-slate-950',
    accentColor: '#0f766e'
  },
  {
    id: 'shatri',
    name: 'إذاعة الشيخ أبو بكر الشاطري',
    subname: 'تلاوة حجازية هادئة برواية حفص عن عاصم',
    desc: 'تراتيل الشيخ أبو بكر الشاطري الشهيرة بأدائها الساكن والوقور الذي يبعث الطمأنينة في النفس.',
    streamUrl: 'https://qurango.net/radio/shaik_abu_bakr_al_shatri',
    category: 'reciters',
    country: 'اليمن / السعودية',
    countryBadge: '✨ هادئة',
    badge: 'مرتل',
    color: 'from-sky-950 to-slate-900',
    accentColor: '#0284c7'
  },
  {
    id: 'shuraim',
    name: 'إذاعة الشيخ سعود الشريم',
    subname: 'إمام الحرم المكي السابق · التلاوة الحدر السريعة',
    desc: 'تسجيلات صلوات التراويح والفرائض من محراب الكعبة المشرفة بصوت الشيخ سعود الشريم.',
    streamUrl: 'https://qurango.net/radio/saud_alshuraim',
    category: 'reciters',
    country: 'السعودية',
    countryBadge: '🇸🇦 الحرم المكي',
    badge: 'إمام الحرم',
    color: 'from-orange-950 to-slate-900',
    accentColor: '#ea580c'
  },
  {
    id: 'idrees',
    name: 'إذاعة الشيخ إدريس أبكر',
    subname: 'تلاوات وأدعية خاشعة ومؤثرة',
    desc: 'قراءات الشيخ إدريس أبكر وأدعيته المشهورة في صلوات القيام بأسلوبه الباكي الخاشع.',
    streamUrl: 'https://qurango.net/radio/idrees_abkr',
    category: 'reciters',
    country: 'السعودية',
    countryBadge: '🤲 أدعية وقرآن',
    badge: 'تلاوة خاشعة',
    color: 'from-zinc-900 to-indigo-950',
    accentColor: '#6366f1'
  },
  {
    id: 'nauina',
    name: 'إذاعة الشيخ أحمد نعينع',
    subname: 'طبيب القلوب وقارئ الإذاعة والرئاسة المصرية',
    desc: 'تلاوات مجودة مميزة ومحافل قرآنية شجية بصوت القارئ الطبيب أحمد نعينع.',
    streamUrl: 'https://qurango.net/radio/ahmad_nauina',
    category: 'reciters',
    country: 'مصر',
    countryBadge: '🇪🇬 مصر',
    badge: 'مجود',
    color: 'from-rose-950 to-stone-900',
    accentColor: '#e11d48'
  },
  {
    id: 'ali-jaber',
    name: 'إذاعة الشيخ علي جابر',
    subname: 'إمام المسجد الحرام الأسبق رحمه الله',
    desc: 'التلاوات الخالدة التي ارتبطت بذاكرة ملايين المسلمين في صلوات التراويح بالحرم المكي الشريف.',
    streamUrl: 'https://qurango.net/radio/ali_jaber',
    category: 'reciters',
    country: 'السعودية',
    countryBadge: '🇸🇦 الحرم المكي',
    badge: 'إمام الحرم الأسبق',
    color: 'from-stone-950 to-amber-950',
    accentColor: '#d97706'
  },
  {
    id: 'tunaiji',
    name: 'إذاعة الشيخ خليفة الطنيجي',
    subname: 'تلاوة مرقعة متقنة برواية حفص عن عاصم',
    desc: 'قراءات عذبة من دولة الإمارات العربية المتحدة بصوت المقرئ خليفة الطنيجي.',
    streamUrl: 'https://qurango.net/radio/khalifa_altunaiji',
    category: 'reciters',
    country: 'الإمارات',
    countryBadge: '🇦🇪 الإمارات',
    badge: 'مرتل',
    color: 'from-emerald-950 to-slate-900',
    accentColor: '#10b981'
  },
  // Programs & Tafsir
  {
    id: 'tafseer',
    name: 'إذاعة تفسير القرآن الكريم',
    subname: 'شروح ميسرة لمعاني الآيات والأحكام',
    desc: 'دروس وخواطر تفسير كتاب الله العزيز لنخبة من كبار العلماء والمفسرين، كالإمام الشعراوي وابن عثيمين.',
    streamUrl: 'https://qurango.net/radio/tafseer',
    category: 'programs',
    country: 'عالمي',
    countryBadge: '📚 تفسير',
    badge: 'معاني القرآن',
    featured: true,
    color: 'from-amber-950 via-slate-900 to-amber-950',
    accentColor: '#f59e0b'
  },
  {
    id: 'mukhtasar-tafsir',
    name: 'إذاعة المختصر في تفسير القرآن',
    subname: 'تفسير الآيات بأسلوب معاصر ميسر',
    desc: 'سلسلة الحلقات الإذاعية لكتاب "المختصر في تفسير القرآن الكريم" الصادر عن مركز تفسير للدراسات القرآنية.',
    streamUrl: 'https://qurango.net/radio/mukhtasartafsir',
    category: 'programs',
    country: 'عالمي',
    countryBadge: '📖 مختصر',
    badge: 'تفسير ميسر',
    color: 'from-teal-950 to-slate-950',
    accentColor: '#14b8a6'
  },
  {
    id: 'fatwa',
    name: 'إذاعة الفتاوى الشرعية',
    subname: 'فتاوى كبار العلماء على مدار الساعة',
    desc: 'إجابات علمية موثوقة لأبرز الأسئلة الفقهية اليومية في العقيدة والعبادات والمعاملات الأسرية.',
    streamUrl: 'https://qurango.net/radio/fatwa',
    category: 'programs',
    country: 'عالمي',
    countryBadge: '⚖️ فقه',
    badge: 'فتاوى موثقة',
    color: 'from-blue-950 to-slate-950',
    accentColor: '#3b82f6'
  },
  {
    id: 'siyra',
    name: 'إذاعة في ظلال السيرة النبوية',
    subname: '٤٠٠ حلقة عن حياة الحبيب المصطفى ﷺ',
    desc: 'سلسلة تاريخية ماتعة تروي وقائع السيرة العطرة منذ ولادة النبي ﷺ مروراً بالبعثة والهجرة والفتوحات الإسلامية.',
    streamUrl: 'https://qurango.net/radio/fi_zilal_alsiyra',
    category: 'programs',
    country: 'عالمي',
    countryBadge: '🕌 سيرة نبوية',
    badge: 'سيرة الحبيب ﷺ',
    color: 'from-emerald-950 via-slate-950 to-teal-950',
    accentColor: '#10b981'
  },
  {
    id: 'roqiah',
    name: 'إذاعة الرقية الشرعية العامة',
    subname: 'آيات الحفظ والسكينة والشفاء من القرآن والسنة',
    desc: 'بث مستمر على مدار 24 ساعة لآيات الرقية الشرعية والأدعية النبوية الثابتة للتحصين والشفاء من كل أذى.',
    streamUrl: 'https://qurango.net/radio/roqiah',
    category: 'programs',
    country: 'عالمي',
    countryBadge: '🛡️ حصن وشفاء',
    badge: 'رقية شرعية',
    featured: true,
    color: 'from-slate-950 to-emerald-950',
    accentColor: '#059669'
  },
  // Azkar
  {
    id: 'sabah',
    name: 'إذاعة أذكار الصباح والمساء',
    subname: 'أوراد حصن المسلم اليومية بأصوات شجية',
    desc: 'ترديد الأذكار النبوية اليومية بصوت نقي متصل لبدء اليوم وختامه بطاعة الله ورضوانه.',
    streamUrl: 'https://qurango.net/radio/athkar_sabah',
    category: 'azkar',
    country: 'عالمي',
    countryBadge: '☀️ أذكار',
    badge: 'أذكار اليوم',
    color: 'from-amber-950 to-orange-950',
    accentColor: '#ea580c'
  },
  {
    id: 'masa',
    name: 'إذاعة أذكار المساء والاستغفار',
    subname: 'أدعية المساء والتسبيح قبل النوم',
    desc: 'تسجيلات خاشعة لأذكار المساء والاستغفار والتسبيح لراحة البال والسكينة القلبية.',
    streamUrl: 'https://qurango.net/radio/athkar_masa',
    category: 'azkar',
    country: 'عالمي',
    countryBadge: '🌙 استغفار',
    badge: 'أذكار المساء',
    color: 'from-indigo-950 to-slate-950',
    accentColor: '#6366f1'
  }
];
