import { Link } from 'react-router-dom';
import { 
  BookOpen, BookText, GraduationCap, Baby, 
  ArrowLeft, Heart, SunMedium, Sparkles, 
  ChevronLeft, Play, Users, BookMarked, Globe
} from 'lucide-react';
import { motion } from 'motion/react';

export default function HomePage() {
  const sections = [
    {
      title: 'القرآن الكريم',
      desc: 'استمع وحمل سور القرآن الكريم بصوت كبار القراء بتلاوات مجودة ومرتلة بأعلى جودة.',
      icon: <BookOpen className="w-10 h-10" />,
      path: '/quran',
      color: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50',
      text: 'text-emerald-600'
    },
    {
      title: 'أذكار المسلم',
      desc: 'حصن المسلم اليومي ومفتاح الطمأنينة والسكينة، مع عداد ذكي لمتابعة الأوراد.',
      icon: <SunMedium className="w-10 h-10" />,
      path: '/azkar',
      color: 'from-amber-400 to-orange-500',
      bgLight: 'bg-amber-50',
      text: 'text-amber-600'
    },
    {
      title: 'تعلم الإنجليزية',
      desc: 'مسار تعليمي متدرج يبدأ من نطق الحروف وينتهي باتقان المحادثات اليومية بثقة.',
      icon: <BookText className="w-10 h-10" />,
      path: '/english',
      color: 'from-indigo-500 to-blue-600',
      bgLight: 'bg-indigo-50',
      text: 'text-indigo-600'
    },
    {
      title: 'قسم الطلاب',
      desc: 'أدوات ذكية للمذاكرة، تلخيص المواد باستخدام الذكاء الاصطناعي، وموارد تعليمية هامة.',
      icon: <GraduationCap className="w-10 h-10" />,
      path: '/students',
      color: 'from-slate-700 to-slate-900',
      bgLight: 'bg-slate-100',
      text: 'text-slate-800'
    },
    {
      title: 'ركن الأطفال',
      desc: 'أسس القراءة والكتابة بطرق تفاعلية وممتعة للصغار لتأسيس سليم في اللغة.',
      icon: <Baby className="w-10 h-10" />,
      path: '/kids',
      color: 'from-rose-400 to-pink-600',
      bgLight: 'bg-rose-50',
      text: 'text-rose-600'
    },
  ];

  return (
    <div className="space-y-20 pb-24" dir="rtl">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-emerald-950 rounded-[4rem] border border-white/5 shadow-2xl px-6 py-20 md:py-32 text-center group">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/80 to-emerald-950"></div>
        
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px] -ml-48 -mt-48 group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] -mr-48 -mb-48 group-hover:scale-110 transition-transform duration-1000"></div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-28 h-28 p-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-3xl group"
          >
            <div className="w-full h-full rounded-[2rem] overflow-hidden border-2 border-white/40">
               <img 
                src="https://i.imgur.com/sRBt7lJ.png" 
                alt="إسلام عاطف حسن" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?q=80&w=2540&auto=format&fit=crop';
                }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex flex-col items-center gap-2 mb-8 relative"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xs uppercase tracking-widest">
              <Sparkles size={14} /> بوابة إسلام للعلم والإيمان
            </div>
            <div className="text-emerald-500 font-black text-lg mt-2 bg-emerald-50 px-4 py-1 rounded-lg border border-emerald-100 shadow-sm">
              صدقة جارية
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-tight"
          >
            صدقة جارية على روح<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-white to-emerald-400">
              أخي إسلام عاطف حسن
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-bold mb-12"
          >
            منصة تعليمية إسلامية شاملة تهدف إلى تيسير سبل العلم ونشر القرآن الكريم. نسأل الله أن يتقبلها صدقة جارية وأن ينفع بها الجميع.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link 
              to="/quran" 
              className="bg-white text-slate-900 px-10 py-5 rounded-3xl font-black text-lg hover:bg-slate-100 transition-all shadow-xl shadow-white/5 flex items-center gap-3"
            >
               <Play size={24} className="fill-current" /> ابدأ تلاوة القرآن
            </Link>
            <Link 
              to="/students" 
              className="bg-white/10 text-white backdrop-blur border border-white/10 px-10 py-5 rounded-3xl font-black text-lg hover:bg-white/20 transition-all"
            >
               قسم الطلاب
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {[
           { label: 'أدوات ذكية', val: '10+', icon: <Sparkles className="text-primary-500" /> },
           { label: 'سور القرآن', val: '114', icon: <BookMarked className="text-emerald-500" /> },
           { label: 'مسارات تعليمية', val: '5', icon: <Globe className="text-indigo-500" /> },
           { label: 'علم ينتفع به', val: '∞', icon: <Users className="text-amber-500" /> },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-lg flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <p className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{stat.val}</p>
              <p className="text-slate-400 font-bold text-xs uppercase">{stat.label}</p>
           </div>
         ))}
      </div>

      {/* Sections Grid */}
      <div className="space-y-12">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">استكشف الأقسام</h2>
          <div className="h-1 flex-1 mx-8 bg-gradient-to-r from-slate-100 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sections.map((sec, idx) => (
            <Link key={idx} to={sec.path}>
              <motion.div 
                whileHover={{ y: -8, scale: 1.01 }}
                className="group relative bg-white p-10 rounded-[3.5rem] border border-slate-200/60 shadow-xl hover:shadow-2xl hover:border-slate-300 transition-all duration-500 h-full overflow-hidden"
              >
                {/* Visual Flair */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${sec.color} opacity-[0.03] rounded-bl-full -mr-20 -mt-20 group-hover:opacity-[0.07] transition-opacity`}></div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start h-full">
                  <div className={`w-20 h-20 shrink-0 rounded-3xl flex items-center justify-center bg-gradient-to-br ${sec.color} text-white shadow-xl shadow-slate-900/10 group-hover:scale-110 transition-transform duration-500`}>
                    {sec.icon}
                  </div>
                  
                  <div className="flex-1 text-right">
                    <h3 className="text-3xl font-black text-slate-900 mb-4 group-hover:text-primary-600 transition-colors">{sec.title}</h3>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8 max-w-md">{sec.desc}</p>
                    
                    <div className="flex items-center gap-2 font-black text-indigo-600 group-hover:gap-4 transition-all">
                       <span>اكتشف المزيد</span>
                       <ChevronLeft size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Callout */}
      <section className="bg-emerald-600 rounded-[3.5rem] p-10 md:p-16 text-white relative overflow-hidden shadow-3xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mt-48"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
             <div className="max-w-2xl text-center md:text-right">
                <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-black mb-4 uppercase tracking-tighter">صدقة جارية</span>
                <h3 className="text-4xl font-black mb-6 text-emerald-50">ساهم في نشر الخير</h3>
                <p className="text-emerald-50 text-xl font-medium leading-relaxed">بمشاركتك لهذه البوابة التعليمية، تساهم في نشر العلم النافع والقرآن الكريم. نسأل الله أن يجعلها في ميزان حسنات العاملين عليها والمستخدمين لها، وأن يتقبلها صدقة جارية على روح إسلام عاطف حسن.</p>
             </div>
             <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl relative group h-32">
                <Heart size={64} className="text-emerald-600 fill-emerald-600 group-hover:scale-110 transition-transform" />
             </div>
          </div>
      </section>
    </div>
  );
}
