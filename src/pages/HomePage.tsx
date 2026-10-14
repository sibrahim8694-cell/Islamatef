import { Link } from 'react-router-dom';
import { 
  BookOpen, BookText, GraduationCap, Baby, 
  SunMedium, Sparkles, ChevronLeft, Play, 
  Smartphone, Heart
} from 'lucide-react';
import { motion } from 'motion/react';

const APK_URL = 'https://median.co/share/mbeybbz#apk';

export default function HomePage() {
  const sections = [
    {
      title: 'القرآن الكريم',
      desc: 'استمع وحمّل سور القرآن الكريم بصوت كبار القراء بتلاوات مجودة ومرتلة بأعلى دقة.',
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
      path: '/quran',
      color: 'from-emerald-500 to-teal-600',
      tag: '١١٤ سورة كاملة'
    },
    {
      title: 'أذكار المسلم',
      desc: 'حصن المسلم اليومي ومفتاح الطمأنينة والسكينة مع عداد ذكي تفاعلي لمتابعة الأوراد.',
      icon: <SunMedium className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
      path: '/azkar',
      color: 'from-amber-400 to-orange-500',
      tag: 'صباح ومساء'
    },
    {
      title: 'تعلم الإنجليزية',
      desc: 'مسار تعليمي متدرج يبدأ من نطق الحروف وينتهي بإتقان المحادثات اليومية بثقة.',
      icon: <BookText className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
      path: '/english',
      color: 'from-indigo-500 to-blue-600',
      tag: 'محادثة وتأسيس'
    },
    {
      title: 'قسم الطلاب',
      desc: 'أدوات ذكية للمذاكرة وتلخيص المواد وحل الأسئلة المدرسية والجامعية.',
      icon: <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
      path: '/students',
      color: 'from-slate-700 to-slate-900',
      tag: 'مساعد دراسي'
    },
    {
      title: 'ركن الأطفال',
      desc: 'أسس القراءة والكتابة والقصص التفاعلية والحساب والألعاب المفيدة للصغار.',
      icon: <Baby className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
      path: '/kids',
      color: 'from-rose-400 to-pink-600',
      tag: 'تأسيس وقصص'
    },
    {
      title: 'تطبيق الأندرويد',
      desc: 'حمّل وثبّت التطبيق الرسمي بصيغة APK على هاتفك لتجربة أسرع دون متصفح.',
      icon: <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
      path: APK_URL,
      isExternal: true,
      color: 'from-teal-600 to-cyan-700',
      tag: 'تحميل مباشر APK'
    },
  ];

  const stats = [
    { label: 'سور القرآن الكريم', val: '114', tag: 'كاملة' },
    { label: 'كبار القراء', val: '15+', tag: 'مجود ومرتل' },
    { label: 'أذكار يومية', val: '40+', tag: 'بعدّاد تفاعلي' },
    { label: 'أدوات تعليمية', val: '3', tag: 'مجانية 100%' },
  ];

  return (
    <div className="space-y-6 sm:space-y-10 pb-16" dir="rtl">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-950 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] border border-emerald-900/50 shadow-xl px-4 py-8 sm:py-14 md:py-16 text-center">
        {/* Subtle Geometric Overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, rgba(255,255,255,0.2) 2px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
        
        {/* Decorative Ambient Light */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Avatar / Portrait Frame */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 p-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-5 shadow-xl"
          >
            <div className="w-full h-full rounded-[1rem] sm:rounded-[1.2rem] overflow-hidden bg-emerald-900 flex items-center justify-center">
              <img 
                src="https://i.imgur.com/sRBt7lJ.png" 
                alt="إسلام عاطف حسن" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </motion.div>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs mb-3.5">
            <Sparkles size={14} className="text-emerald-400" />
            <span>بوابة إسلام للعلم والإيمان</span>
            <span className="text-emerald-400/50">·</span>
            <span>صدقة جارية</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4 tracking-tight leading-tight">
            صدقة جارية على روح<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
              أخي إسلام عاطف حسن
            </span>
          </h1>

          <p className="text-xs sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium mb-6 sm:mb-8 px-2">
            منصة إسلامية وتعليمية شاملة تيسر استماع وتحميل القرآن الكريم بصوت كبار القراء، وقراءة الأذكار، وتعلم اللغة والعلوم، نسأل الله أن يتقبلها صدقة جارية نافعة.
          </p>

          {/* Hero CTAs: 2 side by side facing each other + APK underneath */}
          <div className="w-full max-w-md space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <Link 
                to="/quran" 
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 sm:px-4 py-3 sm:py-3.5 rounded-2xl font-bold text-xs sm:text-sm md:text-base transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 touch-press"
              >
                <Play size={16} className="fill-current shrink-0" />
                <span>استمع للقرآن</span>
              </Link>

              <Link 
                to="/azkar" 
                className="bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/15 px-3 sm:px-4 py-3 sm:py-3.5 rounded-2xl font-bold text-xs sm:text-sm md:text-base transition-all flex items-center justify-center gap-2 touch-press"
              >
                <SunMedium size={16} className="shrink-0" />
                <span>أذكار اليوم</span>
              </Link>
            </div>

            <a 
              href={APK_URL}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-slate-800/90 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 px-4 py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 touch-press"
            >
              <Smartphone size={16} />
              <span>تحميل تطبيق أندرويد للهاتف (APK)</span>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar: 2 by 2 on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center justify-center"
          >
            <p className="text-xl sm:text-3xl font-black text-slate-900 mb-0.5 tracking-tight font-mono tabular-nums">
              {stat.val}
            </p>
            <p className="text-slate-700 font-bold text-[11px] sm:text-xs">{stat.label}</p>
            <span className="text-[10px] text-emerald-700 mt-0.5 sm:mt-1">{stat.tag}</span>
          </div>
        ))}
      </div>

      {/* Sections Grid: Every 2 sections facing each other side-by-side */}
      <div className="space-y-3.5 sm:space-y-5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900">أقسام المنصة</h2>
            <p className="text-xs text-slate-500">كل الأقسام منظمة ومتاحة مجاناً لوجه الله</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
            ٦ أقسام رئيسية
          </span>
        </div>

        {/* 2-by-2 Grid: each two sections face each other side-by-side */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:gap-5">
          {sections.map((sec, idx) => {
            const CardInner = (
              <div className="relative bg-white p-3.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-300 h-full flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-2.5 sm:mb-4">
                    <div className={`w-9 h-9 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-xl sm:rounded-2xl flex items-center justify-center bg-gradient-to-br ${sec.color} text-white shadow-md shadow-slate-900/10 shrink-0`}>
                      {sec.icon}
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full truncate max-w-[85px] sm:max-w-none text-center">
                      {sec.tag}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-lg md:text-xl font-black text-slate-800 mb-1 sm:mb-2 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {sec.title}
                  </h3>
                  <p className="text-slate-500 text-[11px] sm:text-xs md:text-sm font-medium leading-relaxed line-clamp-2 sm:line-clamp-3 mb-2 sm:mb-4">
                    {sec.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-slate-100 text-[10px] sm:text-xs font-bold text-emerald-700">
                  <span>{sec.isExternal ? 'تحميل مباشر' : 'فتح القسم'}</span>
                  <ChevronLeft size={15} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            );

            return sec.isExternal ? (
              <a 
                key={idx} 
                href={sec.path} 
                target="_blank" 
                rel="noreferrer" 
                className="block group touch-press h-full"
              >
                {CardInner}
              </a>
            ) : (
              <Link 
                key={idx} 
                to={sec.path} 
                className="block group touch-press h-full"
              >
                {CardInner}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Direct App Download & Memorial Banner */}
      <section className="bg-gradient-to-r from-emerald-900 to-teal-950 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-emerald-800">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-right">
            <span className="inline-block px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs font-bold text-emerald-300 mb-3">
              تطبيق أندرويد متوفر الآن
            </span>
            <h3 className="text-xl sm:text-2xl font-black mb-2 text-white">
              ثبّت تطبيق بوابة إسلام على جوالك
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed mb-4">
              احصل على تجربة سلسة وسريعة مع إمكانية الوصول الفوري للقرآن الكريم والأذكار والمواد التعليمية في أي وقت كصدقة جارية على روح إسلام عاطف حسن.
            </p>
            <a 
              href={APK_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-md touch-press"
            >
              <Smartphone size={18} />
              <span>تحميل ملف APK مباشرة</span>
            </a>
          </div>

          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-300 border border-white/10 shrink-0">
            <Heart size={42} className="fill-emerald-400 text-emerald-400" />
          </div>
        </div>
      </section>
    </div>
  );
}
