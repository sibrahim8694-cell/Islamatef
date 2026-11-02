export interface RadioStation {
  id: string;
  name: string;
  subname: string;
  desc: string;
  streamUrl: string;
  fallbackUrl?: string;
  country: string;
  countryBadge: string;
  badge: string;
  frequency: string;
  featured: boolean;
  color: string;
  accentColor: string;
}

export interface RadioFrequency {
  city: string;
  freq: string;
  region: string;
}

export interface IconicProgram {
  title: string;
  broadcaster: string;
  timeSlot: string;
  desc: string;
}

export const CAIRO_FREQUENCIES: RadioFrequency[] = [
  { city: 'القاهرة الكبرى والجيزة والقليوبية', freq: '98.2 FM', region: 'العاصمة' },
  { city: 'الإسكندرية والساحل الشمالي', freq: '90.2 FM', region: 'الوجه البحري' },
  { city: 'المحلة الكبرى ووسط الدلتا (الغربية)', freq: '99.6 FM', region: 'الدلتا' },
  { city: 'مدن القناة وبورسعيد', freq: '98.0 FM', region: 'القناة' },
  { city: 'الإسماعيلية وضواحيها', freq: '89.8 FM', region: 'القناة' },
  { city: 'شمال سيناء والعريش', freq: '94.0 FM', region: 'سيناء' },
  { city: 'جنوب سيناء وشرم الشيخ', freq: '93.6 FM', region: 'سيناء' },
  { city: 'المنيا وشمال الصعيد', freq: '94.1 FM', region: 'شمال الصعيد' },
  { city: 'أسيوط وسوهاج', freq: '98.3 FM', region: 'وسط الصعيد' },
  { city: 'قنا والأقصر', freq: '92.6 FM', region: 'جنوب الصعيد' },
  { city: 'أسوان والنوبة', freq: '91.7 FM', region: 'جنوب الصعيد' },
  { city: 'البحر الأحمر والغردقة', freq: '92.8 FM', region: 'ساحل البحر الأحمر' },
  { city: 'الوادي الجديد والواحات', freq: '92.5 FM', region: 'الصحراء الغربية' },
  { city: 'مطروح والسلوم', freq: '91.4 FM', region: 'الساحل الغربي' }
];

export const CAIRO_PROGRAMS: IconicProgram[] = [
  {
    title: 'المصحف المرتل والمجود',
    broadcaster: 'كبار قراء دولة التلاوة المصرية',
    timeSlot: 'على مدار الساعة',
    desc: 'تسجيلات تاريخية نادرة للشيخ الحصري، عبد الباسط، المنشاوي، مصطفى إسماعيل، البنا، والطبلاوي.'
  },
  {
    title: 'خواطر الإمام الشعراوي',
    broadcaster: 'فضيلة الشيخ محمد متولي الشعراوي',
    timeSlot: 'يومياً بعد صلاة العصر والمغرب',
    desc: 'الخواطر الإيمانية وتفسير كتاب الله العزيز بأسلوبه البياني البسيط المؤثر في القلوب.'
  },
  {
    title: 'براعم الإيمان',
    broadcaster: 'د. هاجر سعد الدين ونخبة الإذاعيين',
    timeSlot: 'الجمعة وصباحات الأيام',
    desc: 'البرنامج التربوي العريق الموجه للناشئة والأطفال لغرس القيم الإسلامية النبيلة.'
  },
  {
    title: 'بريد الإسلام',
    broadcaster: 'نخبة من علماء الأزهر الشريف',
    timeSlot: 'يومياً',
    desc: 'إجابات علمية موثقة ومعتمدة من كبار علماء الأزهر الشريف على تساؤلات المستمعين الفقهية.'
  },
  {
    title: 'في ظلال السيرة النبوية',
    broadcaster: 'إذاعة القرآن الكريم - القاهرة',
    timeSlot: 'يومياً',
    desc: 'محطات مضيئة من حياة الحبيب المصطفى ﷺ وصحابته الكرام واستخلاص العبر والدروس.'
  },
  {
    title: 'قرآن المغرب وقرآن السهرة',
    broadcaster: 'أعلام الإذاعة المصرية',
    timeSlot: 'قبل أذان المغرب والساعة ١١ مساءً',
    desc: 'التلاوات المجودة الخالدة التي ارتبطت بذاكرة ملايين الأسر المصرية والعربية.'
  }
];

// Single official radio station as requested by user
export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'cairo-quran',
    name: 'إذاعة القرآن الكريم من القاهرة',
    subname: 'جمهورية مصر العربية · 98.2 FM',
    desc: 'البث المباشر الرسمي لأعرق إذاعة قرآنية في العالم الإسلامي (تأسست عام 1964م). تضم أرشيف ونوادر تلاوات كبار قراء الراديو المصري، والبرامج الدينية والتفاسير المعتمدة على مدار ٢٤ ساعة.',
    streamUrl: 'https://radio.xecod.com/station/quran-cairo',
    fallbackUrl: 'https://qurango.net/radio/mix',
    country: 'مصر',
    countryBadge: '🇪🇬 جمهورية مصر العربية',
    badge: 'البث الحي الرسمي المباشر',
    frequency: '98.2 FM',
    featured: true,
    color: 'from-[#800020] via-rose-950 to-slate-950',
    accentColor: '#800020'
  }
];
