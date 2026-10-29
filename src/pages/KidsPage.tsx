import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pencil, Music, Star, Eraser, Volume2, 
  Gamepad2, BookOpen, Calculator, Trophy, 
  Settings, Heart, Sparkles, LayoutPanelLeft,
  ArrowRight, CheckCircle2, Layout, User, X, 
  PlayCircle, Download, Youtube, ExternalLink,
  ShieldCheck, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { kidsSound } from '../lib/kidsSoundFX';
import { 
  PROPHET_STORIES, QURAN_ANIMAL_STORIES, 
  ProphetStory, QuranAnimalStory 
} from '../data/kidsIslamicData';
import { StoryModal } from '../components/kids/StoryModal';
import { AlphabetNasheedPlayer } from '../components/kids/AlphabetNasheedPlayer';
import { KidsMannersAzkar } from '../components/kids/KidsMannersAzkar';
import { KidsQuizGame } from '../components/kids/KidsQuizGame';
import { speakArabicText, stopTTS } from '../lib/tts';

type KidsTab = 
  | 'home' 
  | 'prophets' 
  | 'animals' 
  | 'arabic' 
  | 'manners' 
  | 'quiz' 
  | 'math' 
  | 'creative' 
  | 'parent';

export default function KidsPage() {
  const [activeTab, setActiveTab] = useState<KidsTab>('home');
  const [activeStory, setActiveStory] = useState<{
    data: ProphetStory | QuranAnimalStory;
    type: 'prophet' | 'animal';
  } | null>(null);

  const [points, setPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('kids_xp');
      return saved ? parseInt(saved) : 150;
    } catch {
      return 150;
    }
  });

  const [badges, setBadges] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kids_badges');
      return saved ? JSON.parse(saved) : ['first_step'];
    } catch {
      return ['first_step'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kids_xp', points.toString());
      localStorage.setItem('kids_badges', JSON.stringify(badges));
    } catch {}
  }, [points, badges]);

  const addXP = (amount: number) => {
    setPoints(prev => prev + amount);
    if (amount >= 30) {
      kidsSound.playSuccess();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899']
      });
    }
  };

  // Math interactive states
  const arabicNumbers = [
    { n: 0, word: 'صفر', icon: '⚪' },
    { n: 1, word: 'واحد', icon: '🍎' },
    { n: 2, word: 'اثنان', icon: '🍦' },
    { n: 3, word: 'ثلاثة', icon: '🎈' },
    { n: 4, word: 'أربعة', icon: '🍀' },
    { n: 5, word: 'خمسة', icon: '🖐️' },
    { n: 6, word: 'ستة', icon: '🎲' },
    { n: 7, word: 'سبعة', icon: '🌈' },
    { n: 8, word: 'ثمانية', icon: '⭐' },
    { n: 9, word: 'تسعة', icon: '🎈' },
    { n: 10, word: 'عشرة', icon: '🌟' },
  ];

  const [mathExerciseIdx, setMathExerciseIdx] = useState(0);
  const mathExercises = [
    { 
      type: 'count', 
      title: 'كم نجمة منيرة في السماء؟ ⭐', 
      items: ['⭐', '⭐', '⭐', '⭐', '⭐'], 
      options: [3, 4, 5, 6], 
      correct: 5,
      color: 'amber'
    },
    { 
      type: 'count', 
      title: 'كم حمامة تطير حول الحرم؟ 🕊️', 
      items: ['🕊️', '🕊️', '🕊️', '🕊️'], 
      options: [2, 3, 4, 5], 
      correct: 4,
      color: 'emerald'
    },
    { 
      type: 'shape', 
      title: 'أين هو شكل الهلال المبارك؟ 🌙', 
      options: [
        { name: 'هلال', icon: '🌙' },
        { name: 'شمس', icon: '☀️' },
        { name: 'سحابة', icon: '☁️' }
      ], 
      correct: 'هلال',
      color: 'indigo'
    },
    { 
      type: 'count', 
      title: 'كم تمرة شهية على مائدة الإفطار؟ 🌴', 
      items: ['🌴', '🌴', '🌴'], 
      options: [1, 2, 3, 4], 
      correct: 3,
      color: 'rose'
    }
  ];

  const currentExercise = mathExercises[mathExerciseIdx % mathExercises.length];

  const handleMathAnswer = (answer: any) => {
    if (answer === currentExercise.correct) {
      kidsSound.playSuccess();
      addXP(30);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setTimeout(() => {
        setMathExerciseIdx(prev => prev + 1);
      }, 1500);
    } else {
      kidsSound.playTryAgain();
    }
  };

  // Canvas drawing states
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingColor, setDrawingColor] = useState("#f43f5e");

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    ctx.beginPath();
    ctx.moveTo(x * scaleX, y * scaleY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = drawingColor;
    ctx.lineTo(x * scaleX, y * scaleY);
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      kidsSound.playStoryChime();
    }
  };

  // -------------------------------------------------------------
  // Render Main Hub
  // -------------------------------------------------------------
  const renderHub = () => (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-400" dir="rtl">
      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-indigo-900 rounded-2xl sm:rounded-3xl md:rounded-[3rem] p-5 sm:p-8 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none"></div>

        <div className="flex items-center gap-4 sm:gap-6 relative z-10 text-right">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-md rounded-2xl sm:rounded-3xl flex items-center justify-center p-3 shrink-0 shadow-inner border border-white/30">
            <Trophy className="w-10 h-10 sm:w-14 sm:h-14 text-amber-300 drop-shadow-md animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-300/30 px-3 py-0.5 rounded-full text-xs font-bold mb-2">
              <Sparkles size={14} />
              <span>واحة الطفل المسلم المبدع</span>
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black mb-1 leading-tight">
              أهلاً بك يا بطل في <span className="text-amber-300">عالم النور والمعرفة! 🌟</span>
            </h1>
            <p className="text-emerald-100 text-xs sm:text-base font-medium">
              لديك <span className="font-black text-amber-300 text-base sm:text-lg">{points}</span> نقطة خبرة. استمع للقصص وتعلم القرآن والحروف!
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center md:justify-end relative z-10 w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('prophets')}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 rounded-2xl text-xs sm:text-sm shadow-lg transition flex items-center gap-2"
          >
            <BookOpen size={16} />
            <span>قصص الأنبياء (استماع)</span>
          </button>
          <button 
            onClick={() => setActiveTab('quiz')}
            className="bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm border border-white/30 transition flex items-center gap-2"
          >
            <Trophy size={16} className="text-amber-300" />
            <span>المسابقة الإسلامية</span>
          </button>
        </div>
      </div>

      {/* Primary Categories Grid - 2 columns on mobile, 4 columns on large screens */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <span>✨ استكشف أقسام واحة البراعم</span>
          </h2>
          <span className="text-xs sm:text-sm font-bold text-slate-400">مرتبة لراحتك</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {[
            {
              id: 'prophets',
              title: 'قصص الأنبياء 🕋',
              desc: 'بدون صور، مع الراوي الصوتي الذكي والعبر',
              badge: '١٠ قصص مباركة',
              bg: 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:border-emerald-400',
              icon: <ShieldCheck size={32} className="text-emerald-600" />
            },
            {
              id: 'animals',
              title: 'حيوانات القرآن 🪶',
              desc: 'نملة وهدهد وحوت وناقة وفيل بالصوت',
              badge: '١٠ حكايات صوتية',
              bg: 'bg-amber-50 border-amber-200 text-amber-800 hover:border-amber-400',
              icon: <BookOpen size={32} className="text-amber-600" />
            },
            {
              id: 'arabic',
              title: 'قطار الحروف 🚂',
              desc: 'أناشيد الحروف التفاعلية ونطق الحركات',
              badge: 'نطق وأناشيد حية',
              bg: 'bg-rose-50 border-rose-200 text-rose-800 hover:border-rose-400',
              icon: <Music size={32} className="text-rose-600" />
            },
            {
              id: 'manners',
              title: 'آداب وأذكار 🌟',
              desc: 'أذكار اليوم والسلوكيات الإسلامية اليومية',
              badge: 'نقاط ومكافآت',
              bg: 'bg-teal-50 border-teal-200 text-teal-800 hover:border-teal-400',
              icon: <Heart size={32} className="text-teal-600" />
            },
            {
              id: 'quiz',
              title: 'مسابقة البطل 🏆',
              desc: 'أسئلة تفاعلية ومؤثرات صوتية مبهجة',
              badge: 'تحدي ونجوم',
              bg: 'bg-indigo-50 border-indigo-200 text-indigo-800 hover:border-indigo-400',
              icon: <HelpCircle size={32} className="text-indigo-600" />
            },
            {
              id: 'math',
              title: 'سحر الأرقام 🔢',
              desc: 'تمارين العد والأشكال الممتعة',
              badge: 'ذكاء وحساب',
              bg: 'bg-purple-50 border-purple-200 text-purple-800 hover:border-purple-400',
              icon: <Calculator size={32} className="text-purple-600" />
            },
            {
              id: 'creative',
              title: 'لوحة الإبداع 🎨',
              desc: 'ارسم ولون بأجمل الألوان الحية',
              badge: 'رسم حر',
              bg: 'bg-orange-50 border-orange-200 text-orange-800 hover:border-orange-400',
              icon: <Pencil size={32} className="text-orange-600" />
            }
          ].map(item => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(item.id as KidsTab)}
              className={`${item.bg} border-2 sm:border-4 rounded-2xl sm:rounded-3xl p-4 sm:p-6 cursor-pointer text-right flex flex-col justify-between shadow-xs hover:shadow-xl transition-all min-h-[150px] sm:min-h-[175px]`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 sm:p-2.5 bg-white rounded-xl shadow-xs">
                    {item.icon}
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold bg-white/80 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-black mb-1">{item.title}</h3>
                <p className="text-[11px] sm:text-xs font-medium opacity-80 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-bold pt-2 border-t border-black/5">
                <span>هيا نبدأ</span>
                <ArrowRight size={14} className="rotate-180" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Showcase: 2 Prophet Stories Highlights */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 sm:border-4 border-slate-100 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-xl font-black text-slate-800 flex items-center gap-2">
            <BookOpen className="text-emerald-600" size={22} />
            <span>من قصص الأنبياء المباركة (استماع بالصوت)</span>
          </h3>
          <button 
            onClick={() => setActiveTab('prophets')} 
            className="text-emerald-700 font-bold text-xs sm:text-sm hover:underline"
          >
            مشاهدة جميع القصص ({PROPHET_STORIES.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {PROPHET_STORIES.slice(0, 2).map(pStory => (
            <motion.div
              key={pStory.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => setActiveStory({ data: pStory, type: 'prophet' })}
              className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r ${pStory.color} text-white cursor-pointer shadow-md flex items-center justify-between gap-4`}
            >
              <div className="min-w-0">
                <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold mb-1.5 inline-block">
                  {pStory.badge}
                </span>
                <h4 className="text-sm sm:text-lg font-black truncate">{pStory.title}</h4>
                <p className="text-[11px] sm:text-xs text-white/80 line-clamp-1 mt-1 font-medium">
                  {pStory.summary}
                </p>
              </div>

              <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shrink-0 shadow-md">
                <Volume2 size={20} className="text-emerald-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Badges & Trophies */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 sm:border-4 border-slate-100 shadow-lg">
        <h2 className="text-base sm:text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
          <Trophy className="text-amber-500" size={22} />
          <span>لوحة الأوسمة والإنجازات</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { id: 'first_step', label: 'بداية البطل', icon: '🌟', earned: true },
            { id: 'prophet_listener', label: 'مستمع الأنبياء', icon: '🕋', earned: points >= 200 },
            { id: 'animal_reader', label: 'عالم الحيوان', icon: '🪶', earned: points >= 250 },
            { id: 'alphabet_star', label: 'فصيح اللسان', icon: '🚂', earned: points >= 300 },
            { id: 'dhikr_keeper', label: 'حافظ الأذكار', icon: '📿', earned: points >= 350 },
            { id: 'quiz_champion', label: 'بطل المسابقات', icon: '👑', earned: points >= 400 },
          ].map(b => (
            <div 
              key={b.id} 
              className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${
                b.earned ? 'border-amber-400 bg-amber-50/80 shadow-xs' : 'border-slate-100 bg-slate-50 opacity-40 grayscale'
              }`}
            >
              <span className="text-3xl">{b.icon}</span>
              <span className="font-bold text-center text-xs text-slate-800">{b.label}</span>
              <span className="text-[10px] text-amber-700 font-bold">{b.earned ? 'تم الإنجاز' : 'قريباً'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Curated YouTube Channels for Muslim Children */}
      <div className="bg-slate-900 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -ml-32 -mt-32"></div>
        <div className="relative z-10">
          <h2 className="text-base sm:text-2xl font-black mb-4 flex items-center gap-2">
            <Youtube className="text-red-500" size={24} />
            <span>قنوات يوتيوب إسلامية وتربوية موثوقة للأطفال 📺</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { name: 'عدنان معلم القرآن', desc: 'تطبيق موجه للأطفال لتعليم سور القرآن والأذكار وحروف الهجاء.', url: 'https://www.youtube.com/@adnanquran', icon: '📖' },
              { name: 'تعلم مع زكريا', desc: 'تعليم الأطفال الحروف والقراءة، والوضوء والصلاة والسور القصيرة.', url: 'https://www.youtube.com/c/Learnwithzakaria', icon: '🕌' },
              { name: 'سراج التعليمي', desc: 'مغامرات راشد ونورة في استكشاف الحروف العربية والقيم الإسلامية.', url: 'https://www.youtube.com/@SirajShow', icon: '⭐' },
              { name: 'طيور بيبي الإسلامية', desc: 'أناشيد هادفة بدون إيقاع لتعليم الآداب والأخلاق وأسماء الحيوانات.', url: 'https://www.youtube.com/user/toyoraljannah', icon: '🕊️' },
            ].map(channel => (
              <motion.div
                key={channel.name}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => window.open(channel.url, '_blank')}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 sm:p-5 rounded-2xl cursor-pointer hover:bg-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl mb-2.5">
                    {channel.icon}
                  </div>
                  <h3 className="text-xs sm:text-base font-bold text-white mb-1">{channel.name}</h3>
                  <p className="text-white/70 text-[11px] leading-relaxed line-clamp-2 pb-2">{channel.desc}</p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-white font-bold text-[11px] bg-red-600/90 w-max px-2.5 py-1 rounded-xl">
                  <span>زيارة القناة</span>
                  <ExternalLink size={12} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // Render Prophets Stories (NO PORTRAITS/IMAGES - Strict Islamic compliance)
  // -------------------------------------------------------------
  const renderProphets = () => (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-400" dir="rtl">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-950 rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-300/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <ShieldCheck size={16} />
            <span>قصص الأنبياء عليهم الصلاة والسلام (بدون صور)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black mb-2">
            مكتبة قصص الأنبياء الصوتية 🕋
          </h2>
          <p className="text-emerald-100 text-xs sm:text-base font-medium leading-relaxed">
            استمع لأجمل قصص أنبياء الله بصوت دافئ يروي لك الحكاية كأن شخصاً حقيقياً يحكيها، وتعرف على الصبر والشجاعة وحسن الخلق.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/20 text-center shrink-0">
          <div className="text-2xl sm:text-3xl font-black text-amber-300 mb-0.5">١٠ قصص</div>
          <div className="text-xs text-white/90 font-bold">بأصوات الراوي الذكي</div>
        </div>
      </div>

      {/* Grid of Prophets Stories: 2-by-2 on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {PROPHET_STORIES.map(pStory => (
          <motion.div
            key={pStory.id}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActiveStory({ data: pStory, type: 'prophet' });
              addXP(15);
            }}
            className="group cursor-pointer"
          >
            <div className={`bg-gradient-to-br ${pStory.color} rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white h-56 sm:h-64 flex flex-col justify-between relative overflow-hidden shadow-md hover:shadow-2xl border-2 sm:border-4 border-white/20 transition-all`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black">
                    {pStory.badge}
                  </span>
                  <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black">
                    {pStory.surah}
                  </span>
                </div>

                <h3 className="text-sm sm:text-xl font-black leading-snug mb-1 line-clamp-2">
                  {pStory.title}
                </h3>

                <p className="text-white/80 text-[10px] sm:text-xs font-medium line-clamp-2 leading-relaxed">
                  {pStory.summary}
                </p>
              </div>

              {/* Quranic Ayah snippet */}
              <div className="bg-black/25 backdrop-blur-sm p-2 sm:p-2.5 rounded-xl border border-white/10 text-[10px] sm:text-xs text-amber-200 font-serif truncate">
                ﴿ {pStory.ayah} ﴾
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-bold text-white/90 flex items-center gap-1">
                  <Volume2 size={14} className="text-amber-300" />
                  <span>احكِ لي القصة</span>
                </span>
                <span className="bg-white text-slate-900 px-3 py-1 rounded-xl text-[10px] sm:text-xs font-black shadow-xs">
                  بدء الاستماع 🎙️
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // Render Quranic Animals Stories
  // -------------------------------------------------------------
  const renderAnimals = () => (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-400" dir="rtl">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-800 rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <BookOpen size={16} />
            <span>عجائب مخلوقات الله في الذكر الحكيم</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black mb-2">
            قصص الحيوانات في القرآن الكريم 🪶
          </h2>
          <p className="text-amber-100 text-xs sm:text-base font-medium leading-relaxed">
            تعرف على نملة سليمان الحكيمة، وهدهده الأمين، وحوت يونس، وفيل أبرهة، وناقة صالح، واستمع لمغامراتهم مع الراوي الصوتي.
          </p>
        </div>

        <div className="bg-white/15 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/25 text-center shrink-0">
          <div className="text-2xl sm:text-3xl font-black text-amber-200 mb-0.5">١٠ حكايات</div>
          <div className="text-xs text-white/90 font-bold">بصوت الراوي التفاعلي</div>
        </div>
      </div>

      {/* Grid of Animal Stories: 2-by-2 on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {QURAN_ANIMAL_STORIES.map(aStory => (
          <motion.div
            key={aStory.id}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActiveStory({ data: aStory, type: 'animal' });
              addXP(15);
            }}
            className="group cursor-pointer"
          >
            <div className={`bg-gradient-to-br ${aStory.color} rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white h-56 sm:h-64 flex flex-col justify-between relative overflow-hidden shadow-md hover:shadow-2xl border-2 sm:border-4 border-white/20 transition-all`}>
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-3xl sm:text-4xl">{aStory.icon}</span>
                  <span className="bg-black/25 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black text-amber-200">
                    {aStory.surah}
                  </span>
                </div>

                <h3 className="text-sm sm:text-xl font-black leading-snug mb-1 line-clamp-2">
                  {aStory.title}
                </h3>

                <p className="text-white/80 text-[10px] sm:text-xs font-medium line-clamp-2 leading-relaxed">
                  {aStory.summary}
                </p>
              </div>

              {/* Moral snippet */}
              <div className="bg-black/25 backdrop-blur-sm p-2 sm:p-2.5 rounded-xl border border-white/10 text-[10px] sm:text-xs text-amber-100 truncate">
                💡 العبرة: {aStory.moral}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-bold text-white/90 flex items-center gap-1">
                  <Volume2 size={14} className="text-amber-300" />
                  <span>استماع وتفاعل</span>
                </span>
                <span className="bg-white text-slate-900 px-3 py-1 rounded-xl text-[10px] sm:text-xs font-black shadow-xs">
                  تشغيل 🎙️
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // Render Math Content
  // -------------------------------------------------------------
  const renderMathContent = () => (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-400" dir="rtl">
      <div className="bg-white rounded-3xl sm:rounded-[3rem] p-5 sm:p-10 border-4 border-sky-100 shadow-xl text-center">
        <h2 className="text-2xl sm:text-4xl font-black text-sky-600 mb-6 flex items-center justify-center gap-3">
          <Calculator size={36} /> سحر الأرقام الممتع 🔢
        </h2>
        
        <div className="space-y-6">
          <div className="bg-amber-50 p-4 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-amber-200 text-right">
            <h3 className="text-base sm:text-2xl font-bold text-amber-800 mb-4 text-center">
              تعلم الأرقام من 0 إلى 10 🔢
            </h3>
            {/* 2-by-2 paired grid on mobile, multi-cols on tablet/desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2.5 sm:gap-3">
               {arabicNumbers.map((num) => (
                 <motion.button 
                   key={num.n}
                   whileHover={{ scale: 1.08 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => {
                     kidsSound.playNote(300 + num.n * 50, 'sine', 0.3);
                     addXP(5);
                     speakArabicText(`${num.n} ... ${num.word}`);
                   }}
                   className="bg-white p-3 sm:p-4 rounded-2xl border-2 border-amber-100 flex flex-col items-center justify-center gap-1 hover:border-amber-400 transition shadow-xs group"
                 >
                   <span className="text-2xl sm:text-3xl font-black text-amber-600">{num.n}</span>
                   <span className="text-xs font-bold text-amber-800">{num.word}</span>
                   <span className="text-xl group-hover:scale-125 transition-transform">{num.icon}</span>
                 </motion.button>
               ))}
            </div>
          </div>

          {/* Current Math Exercise Card */}
          <div className="max-w-2xl mx-auto w-full">
            <div className={`bg-indigo-50 p-6 sm:p-10 rounded-3xl border-4 border-indigo-200 shadow-xl text-center`}>
              <h3 className="text-lg sm:text-2xl font-black text-indigo-900 mb-6">
                {currentExercise.title}
              </h3>

              {currentExercise.type === 'count' && (
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 min-h-[90px] items-center bg-white/60 p-4 sm:p-6 rounded-2xl shadow-inner">
                  {currentExercise.items?.map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-4xl sm:text-6xl drop-shadow-md"
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              )}

              {currentExercise.type === 'shape' && (
                <div className="grid grid-cols-3 gap-3 mb-8">
                   {currentExercise.options?.map((opt: any, i: number) => (
                     <div key={i} className="bg-white p-4 rounded-2xl flex flex-col items-center gap-2 border-2 border-indigo-100">
                        <span className="text-4xl sm:text-6xl">{opt.icon}</span>
                        <span className="text-xs sm:text-sm font-bold text-indigo-800">{opt.name}</span>
                     </div>
                   ))}
                </div>
              )}

              <div className="flex justify-center gap-3 flex-wrap">
                {currentExercise.options?.map((opt: any, i: number) => {
                  const val = typeof opt === 'object' ? opt.name : opt;
                  const label = typeof opt === 'object' ? opt.icon : opt;
                  return (
                    <motion.button 
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMathAnswer(val)}
                      className="min-w-[70px] sm:min-w-[90px] py-3.5 sm:py-5 px-6 sm:px-8 rounded-2xl bg-white border-2 sm:border-4 border-indigo-200 text-2xl sm:text-3xl font-black text-indigo-700 hover:border-indigo-400 transition shadow-md"
                    >
                      {label}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // Render Creative Board
  // -------------------------------------------------------------
  const renderCreativeBoard = () => (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-400" dir="rtl">
       <div className="bg-white rounded-3xl sm:rounded-[3rem] p-4 sm:p-8 border-4 border-amber-100 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-amber-600">لوحة الإبداع والرسومات 🎨</h2>
              <p className="text-slate-500 text-xs sm:text-sm">ارسم الحروف، اكتب، ولون بأجمل الألوان يا فنان!</p>
            </div>
            <button 
              onClick={() => {
                clearCanvas();
                addXP(10);
              }}
              className="bg-amber-500 text-white px-6 py-3 rounded-2xl font-black text-xs sm:text-sm hover:bg-amber-600 transition flex items-center gap-2 shadow-md"
            >
              <Eraser size={18} /> 
              <span>مسح اللوحة</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
             <div className="flex-1 bg-slate-100 rounded-3xl overflow-hidden border-4 sm:border-8 border-white p-1 shadow-inner h-[350px] sm:h-[450px] relative">
               <canvas 
                 ref={canvasRef}
                 width={1000}
                 height={700}
                 onMouseDown={startDrawing}
                 onMouseMove={draw}
                 onMouseUp={() => setIsDrawing(false)}
                 onMouseOut={() => setIsDrawing(false)}
                 onTouchStart={startDrawing}
                 onTouchMove={draw}
                 onTouchEnd={() => setIsDrawing(false)}
                 className="w-full h-full cursor-crosshair touch-none"
               />
               <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5 select-none">
                  <span className="text-[140px] sm:text-[240px] font-black">🎨</span>
               </div>
             </div>

             <div className="w-full lg:w-44 bg-slate-50 rounded-3xl p-4 flex flex-row lg:flex-col gap-3 justify-center items-center shadow-inner overflow-x-auto">
                {["#f43f5e", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#1e293b", "#ec4899", "#06b6d4"].map(c => (
                  <button 
                    key={c}
                    onClick={() => {
                      setDrawingColor(c);
                      kidsSound.playNote(400, 'sine', 0.1);
                    }}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 transition-all shadow-md shrink-0 ${
                      drawingColor === c ? 'scale-125 border-white ring-4 ring-amber-400' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
             </div>
          </div>
       </div>
    </div>
  );

  // -------------------------------------------------------------
  // Render Parent Portal
  // -------------------------------------------------------------
  const renderParentView = () => (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-400 text-right" dir="rtl">
      <div className="bg-white rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 border-4 border-slate-100 shadow-xl">
        <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-6 border-b-2 border-indigo-50 pb-4 flex items-center gap-3">
          <User className="text-indigo-600" /> 
          <span>بوابة الآباء والمعلمين 🎓</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
           <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 text-center">
             <div className="text-indigo-600 font-black text-3xl sm:text-4xl mb-1">{points}</div>
             <div className="text-indigo-900 font-bold text-xs sm:text-sm">نقاط XP الكلية</div>
           </div>
           <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 text-center">
             <div className="text-amber-600 font-black text-3xl sm:text-4xl mb-1">١٠</div>
             <div className="text-amber-900 font-bold text-xs sm:text-sm">قصص أنبياء مستمعة</div>
           </div>
           <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 text-center">
             <div className="text-emerald-600 font-black text-3xl sm:text-4xl mb-1">٢٨</div>
             <div className="text-emerald-900 font-bold text-xs sm:text-sm">حرفاً عربياً بنشيدها</div>
           </div>
        </div>

        <h3 className="text-base sm:text-xl font-black text-slate-800 mb-4">تقرير التقدم حسب المهارة</h3>
        <div className="space-y-4">
           {[
             { label: "قصص الأنبياء والقرآن", val: 92, color: "bg-emerald-500" },
             { label: "الحروف العربية وأناشيدها", val: 88, color: "bg-rose-500" },
             { label: "الآداب والأذكار اليومية", val: 80, color: "bg-teal-500" },
             { label: "السور القرآنية القصيرة", val: 85, color: "bg-sky-500" },
             { label: "الرياضيات والإبداع", val: 75, color: "bg-amber-500" }
           ].map(skill => (
             <div key={skill.label} className="space-y-1.5">
                <div className="flex justify-between font-bold text-slate-700 text-xs sm:text-sm">
                   <span>{skill.label}</span>
                   <span>{skill.val}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                   <div 
                    className={`h-full ${skill.color} transition-all duration-1000`} 
                    style={{ width: `${skill.val}%` }}
                   ></div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 pb-28 space-y-6 sm:space-y-8">
      {/* Sticky Mobile-First Category Navigation Bar */}
      <div className="sticky top-14 sm:top-16 z-30 py-2">
        <div 
          className="max-w-5xl mx-auto bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-1.5 shadow-lg flex items-center justify-between gap-1 overflow-x-auto hide-scrollbar"
          dir="rtl"
        >
           {[
             { id: 'home', label: 'الرئيسية', icon: '🏠' },
             { id: 'prophets', label: 'قصص الأنبياء', icon: '🕋' },
             { id: 'animals', label: 'حيوانات القرآن', icon: '🪶' },
             { id: 'arabic', label: 'أناشيد الحروف', icon: '🚂' },
             { id: 'manners', label: 'آداب وأذكار', icon: '🌟' },
             { id: 'quiz', label: 'مسابقة البطل', icon: '🏆' },
             { id: 'math', label: 'الأرقام', icon: '🔢' },
             { id: 'creative', label: 'الرسم', icon: '🎨' },
             { id: 'parent', label: 'بوابة الأهل', icon: '🎓' }
           ].map(tab => {
             const isActive = activeTab === tab.id;
             return (
               <button
                 key={tab.id}
                 onClick={() => {
                   setActiveTab(tab.id as KidsTab);
                   kidsSound.playNote(480, 'sine', 0.1);
                   stopTTS();
                 }}
                 className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm whitespace-nowrap transition-all ${
                   isActive 
                     ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105' 
                     : 'text-slate-700 hover:bg-slate-100'
                 }`}
               >
                 <span>{tab.icon}</span>
                 <span>{tab.label}</span>
               </button>
             );
           })}
        </div>
      </div>

      {/* Main Tab View Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -15 }}
           transition={{ duration: 0.25 }}
        >
          {activeTab === 'home' && renderHub()}
          {activeTab === 'prophets' && renderProphets()}
          {activeTab === 'animals' && renderAnimals()}
          {activeTab === 'arabic' && <AlphabetNasheedPlayer onAddXP={addXP} />}
          {activeTab === 'manners' && <KidsMannersAzkar onAddXP={addXP} />}
          {activeTab === 'quiz' && <KidsQuizGame onAddXP={addXP} />}
          {activeTab === 'math' && renderMathContent()}
          {activeTab === 'creative' && renderCreativeBoard()}
          {activeTab === 'parent' && renderParentView()}
        </motion.div>
      </AnimatePresence>

      {/* Interactive Storyteller Modal (Prophets & Animals) */}
      <AnimatePresence>
        {activeStory && (
          <StoryModal
            story={activeStory.data}
            storyType={activeStory.type}
            onClose={() => setActiveStory(null)}
            onComplete={(earnedXP) => addXP(earnedXP)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
