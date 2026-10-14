import React, { useState, useRef, useEffect } from 'react';
import { playTTS } from '../lib/tts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pencil, Music, Star, Eraser, Volume2, 
  Gamepad2, BookOpen, Calculator, Trophy, 
  Settings, Heart, Sparkles, LayoutPanelLeft,
  ArrowRight, CheckCircle2, Layout, User, X, 
  PlayCircle, Download, Youtube, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

type KidsTab = 'home' | 'arabic' | 'math' | 'stories' | 'creative' | 'parent';

interface Story {
  id: string;
  title: string;
  color: string;
  icon: string;
  type: 'قراءة';
  content: string;
  summary: string;
}

const storiesData: Story[] = [
  { 
    id: 'lion',
    title: "حكاية الأسد الشجاع والفأر الصغير", 
    color: "from-amber-400 to-orange-500", 
    icon: "🦁", 
    type: "قراءة",
    summary: "قصة مليئة بالعبر عن الشجاعة والوفاء ومساعدة الآخرين مهما كان حجمهم",
    content: `في غابة بعيدة وجميلة، كان الأسد "سيمبا" ينام تحت ظل شجرة كبيرة. وفجأة، بدأ فأر صغير يلعب فوق رأسه. استيقظ الأسد غاضباً وأمسك بالفأر بيده الكبيرة.
    
بكى الفأر وقال: "أرجوك يا ملك الغابة، لا تأكني، فقد أحتاج لمساعدتك يوماً ما!". ضحك الأسد وقال: "أنت الصغير تساعدني أنا ملك الغابة؟ حسناً، سأتركك تذهب".
    
وبعد أيام قليلة، وقع الأسد في فخ نصبه الصيادون، وأصبح مقيداً بحبال قوية جداً. حاول الهروب ولم يستطع، فزأر بصوت عالٍ هز أركان الغابة.
    
سمع الفأر الصغير زئير الأسد وأسرع إليه. وعندما رآه في هذه الحالة، بدأ يقرض الحبال القوية بأسنانه الحادة الصغيرة. قضم الحبل الأول، ثم الثاني، حتى حرر الأسد تماماً!
    
نظر الأسد للفأر بامتنان وقال: "شكراً لك يا صديقي الصغير، لقد علمتني اليوم أن الجميع مفيدون مهما صغر حجمهم". ومنذ ذلك اليوم، أصبح الأسد والفأر أفضل الأصدقاء في الغابة.`
  },
  { 
    id: 'space',
    title: "رامي رائد الفضاء الصغير", 
    color: "from-indigo-500 to-purple-600", 
    icon: "🚀", 
    type: "قراءة",
    summary: "رحلة رامي المذهلة في صاروخه العجيب بين النجوم والكواكب البعيدة",
    content: `كان رامي يحب النظر إلى السماء كل ليلة قبل النوم. كان يحلم بأن يطير عالياً ليرى النجوم عن قرب. في يوم عيد ميلاده، صنع والده له صاروخاً كبيراً ومميزاً من الورق المقوى والألوان اللامعة.
    
جلس رامي داخل صاروخه ولبس قبعة رائد الفضاء، وفجأة.. بدأ الصاروخ يهتز ويطير! "عشرة، تسعة، ثمانية... انطلاق!". طار رامي فوق السحاب، فشاهد الأرض كأنها كرة زرقاء جميلة.
    
وصل رامي إلى القمر، فوجده يبتسم له! قال القمر: "أهلاً بك يا رامي، هل تريد قطعة من الجبن؟". ضحك رامي وأكمل رحلته ليرى كوكب زحل بحلقاته الملونة الرائعة.
    
شاهد رامي شهباً لامعة تمر من بجانبه، ولوح بيده لمركبة فضائية كانت تمر بعيداً. قال له رائد فضاء آخر: "أنت شجاع جداً يا رامي، فالعلم والخيال يفتحان لك أبواب الكون".
    
عندما استيقظ رامي في الصباح، وجد خوذته بجانب سريره وصاروخه الورقي كما هو، لكنه كان يعلم أن حلمه سيتحقق يوماً ما لأنه يحب العلم والتعلم.`
  },
  { 
    id: 'bugs',
    title: "نحولة والبحث عن أغلى رحيق", 
    color: "from-yellow-400 to-amber-500", 
    icon: "🐝", 
    type: "قراءة",
    summary: "مغامرة النحلة نحولة في وادي الزهور لتعلم قيمة العمل الجماعي",
    content: `في خلية نحل كبيرة، كانت تعيش "نحولة"، وهي نحلة نشيطة تحب الألوان والزهور. في كل صباح، تخرج نحولة مع رفيقاتها لجمع الرحيق لصنع العسل اللذيذ.
    
في يوم من الأيام، سمعت نحولة عن زهرة نادرة في أعلى الجبل تسمى "زهرة السعادة"، ولها رحيق طعمه أحلى من أي شيء آخر. قررت نحولة أن تذهب وحدها لتفاجئ الجميع.
    
طارت نحولة طويلاً، لكن الطريق كان صعباً والرياح قوية. وعندما وصلت، وجدت الزهرة لكنها كانت ثقيلة جداً ولم تستطع حمل الرحيق وحدها. شعرت بالحزن وجلست بجانبها.
    
فجأة، وصلت صديقاتها النحلات! قالت لها النحلة الكبيرة: "لقد افتقدناك يا نحولة، العمل الفردي قد يكون مميزاً، لكن العمل الجماعي هو الذي ينجز المهمات الصعبة".
    
تعاونت جميع النحلات وحملن الرحيق معاً وعادوا إلى الخلية. صنعوا معاً أحلى عسل في تاريخ الغابة، وتعلمت نحولة أن اليد الواحدة لا تصفق، وأن النجاح الحقيقي هو الذي نتشاركه مع الأصدقاء.`
  },
  { 
    id: 'rana',
    title: "حلم رنا ومعطفها الأبيض", 
    color: "from-pink-400 to-rose-500", 
    icon: "👧", 
    type: "قراءة",
    summary: "قصة رنا التي تريد أن تصبح طبيبة لتنثر الصحة والسعادة للجميع",
    content: `رنا طفلة طيبة، تحمل دائماً صندوقاً صغيراً فيه لاصق جروح وقطن. كلما رأيت شخصاً حزيناً أو حيواناً متألماً، سارعت رنا لمساعدته.
    
في يوم من الأيام، وجدت رنا قطة صغيرة تموء بجانب الباب لأن قدمها كانت تؤلمها. غسلت رنا الجرح بلطف، ووضعت عليه ضمادة جميلة عليها رسوم أزهار. شكرتها القطة بتمسحها في يدها.
    
قالت رنا لأمها: "يا أمي، عندما أكبر سأكون طبيبة، سأرتدي المعطف الأبيض وأعالج كل الأطفال ليعودوا للعب والضحك". ابتسمت الأم وقالت: "أنت طبيبة القلوب يا رنا، وبالعلم والاجتهاد ستصبحين أفضل طبيبة في المستقبل".
    
أصبحت رنا تقرأ كتباً عن جسم الإنسان وتحب حصة العلوم كثيراً. كانت تعرف أن الطريق طويلاً، لكنها كانت مستعدة للمذاكرة لأن حب مساعدة الناس هو أجمل هدف في الحياة.`
  },
  { 
    id: 'underwater',
    title: "مغامرة السمكة بيا تحت البحر", 
    color: "from-blue-400 to-indigo-500", 
    icon: "🐠", 
    type: "قراءة",
    summary: "رحلة السمكة بيا الملونة في أعماق المحيط لاكتشاف عجائب البحار",
    content: `بيا هي سمكة صغيرة ملونة تعيش في رصيف مرجاني رائع. كان البحر هادئاً، لكن بيا كانت فضولية وتريد أن ترى ما خلف الصخور الكبيرة.
    
نزلت بيا للأسفل، فشاهدت الشعاب المرجانية تتراقص مع الأمواج. رأت أخطبوطاً خجولاً يغير لونه ليختبئ، ودلفيناً لطيفاً قفز فوق الماء ليرحب بها.
    
قابلت بيا سلحفاة بحرية حكيمة، قالت لها: "البحر مليء بالكنوز يا بيا، وأهم كنز هو الحفاظ على نظافة بيئتنا لتبقى جميلة". شاهدت بيا أسماكاً مضيئة في الظلام كأنها نجوم تحت الماء.
    
عادت بيا إلى عائلتها وهي تحكي لهم عن العجائب التي رأتها. أصبح الجميع يحبون البحر أكثر ويحرصون على ألا يرمي أحد أي نفايات فيه، ليبقى بيتهم دائماً أجمل مكان.`
  },
  { 
    id: 'forest_friends',
    title: "حفلة النجاح في الغابة", 
    color: "from-emerald-400 to-teal-500", 
    icon: "🌳", 
    type: "قراءة",
    summary: "كيف تعاونت حيوانات الغابة لإقامة أجمل حفلة نجاح لأصدقائهم",
    content: `كانت نهاية العام الدراسي قد اقتربت، وكان جميع الحيوانات في "مدرسة الغابة الخضراء" يحضرون للاحتفال. قرر الفيل "فلفل" أن يعزف على خرطومه مثل المزمار.
    
أما الزرافة "ظريفة" فصنعت زينة طويلة جداً لتصل بين الأشجار العالية، والقرود الماشكسة أحضروا الفواكه اللذيذة من أعلى الأغصان. كان الجميع يعمل بحماس.
    
لكن فجأة، بدأت السماء تمطر! شعر الجميع بالحزن لأن الزينة قد تبتل. فكرت البومة الحكيمة وقالت: "لماذا لا ننقل الحفل إلى كهف الدب الكبير؟ إنه واسع ودافئ".
    
تعاون الجميع في نقل الأغراض بسرعة، وأشعل الدب ناراً دافئة. كانت أجمل حفلة على الإطلاق! رقص الجميع وغنوا، وتعلموا أن العقبات لا توقفنا إذا فكرنا سوياً ووجدنا حلولاً ذكية.`
  }
];

export default function KidsPage() {
  const [activeTab, setActiveTab] = useState<KidsTab>('home');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('kids_xp');
    return saved ? parseInt(saved) : 0;
  });
  const [badges, setBadges] = useState<string[]>(() => {
    const saved = localStorage.getItem('kids_badges');
    return saved ? JSON.parse(saved) : [];
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    localStorage.setItem('kids_xp', points.toString());
    localStorage.setItem('kids_badges', JSON.stringify(badges));
  }, [points, badges]);

  const addXP = (amount: number) => {
    setPoints(prev => prev + amount);
    if (amount >= 20) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF4500', '#00CED1']
      });
    }
  };

  const arabicAlphabet = [
    { letter: 'أ', word: 'أرنب', symbol: '🐇', color: 'bg-rose-100 text-rose-600' },
    { letter: 'ب', word: 'بطة', symbol: '🦆', color: 'bg-blue-100 text-blue-600' },
    { letter: 'ت', word: 'تفاحة', symbol: '🍎', color: 'bg-emerald-100 text-emerald-600' },
    { letter: 'ث', word: 'ثعلب', symbol: '🦊', color: 'bg-orange-100 text-orange-600' },
    { letter: 'ج', word: 'جمل', symbol: '🐪', color: 'bg-amber-100 text-amber-600' },
    { letter: 'ح', word: 'حصان', symbol: '🐎', color: 'bg-indigo-100 text-indigo-600' },
    { letter: 'خ', word: 'خروف', symbol: '🐑', color: 'bg-pink-100 text-pink-600' },
    { letter: 'د', word: 'ديك', symbol: '🐓', color: 'bg-teal-100 text-teal-600' },
    { letter: 'ذ', word: 'ذئب', symbol: '🐺', color: 'bg-purple-100 text-purple-600' },
    { letter: 'ر', word: 'رمان', symbol: '🔴', color: 'bg-red-100 text-red-600' },
    { letter: 'ز', word: 'زرافة', symbol: '🦒', color: 'bg-yellow-100 text-yellow-600' },
    { letter: 'س', word: 'سمكة', symbol: '🐟', color: 'bg-cyan-100 text-cyan-600' },
    { letter: 'ش', word: 'شمس', symbol: '☀️', color: 'bg-amber-100 text-amber-600' },
    { letter: 'ص', word: 'صقر', symbol: '🦅', color: 'bg-slate-100 text-slate-600' },
    { letter: 'ض', word: 'ضفدع', symbol: '🐸', color: 'bg-green-100 text-green-600' },
    { letter: 'ط', word: 'طائرة', symbol: '✈️', color: 'bg-sky-100 text-sky-600' },
    { letter: 'ظ', word: 'ظرف', symbol: '✉️', color: 'bg-blue-100 text-blue-600' },
    { letter: 'ع', word: 'عنب', symbol: '🍇', color: 'bg-purple-100 text-purple-600' },
    { letter: 'غ', word: 'غزالة', symbol: '🦌', color: 'bg-orange-100 text-orange-600' },
    { letter: 'ف', word: 'فيل', symbol: '🐘', color: 'bg-gray-100 text-gray-600' },
    { letter: 'ق', word: 'قرد', symbol: '🐒', color: 'bg-amber-100 text-amber-600' },
    { letter: 'ك', word: 'كلب', symbol: '🐕', color: 'bg-amber-800/10 text-amber-900/80' },
    { letter: 'ل', word: 'ليمون', symbol: '🍋', color: 'bg-yellow-100 text-yellow-600' },
    { letter: 'م', word: 'موز', symbol: '🍌', color: 'bg-yellow-200 text-yellow-700' },
    { letter: 'ن', word: 'نحلة', symbol: '🐝', color: 'bg-amber-50 text-amber-800' },
    { letter: 'هـ', word: 'هلال', symbol: '🌙', color: 'bg-blue-50 text-blue-800' },
    { letter: 'و', word: 'وردة', symbol: '🌹', color: 'bg-red-50 text-red-800' },
    { letter: 'ي', word: 'يد', symbol: '✋', color: 'bg-orange-50 text-orange-800' },
  ];

  const speak = async (text: string, lang: string = 'ar-SA', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // For very long texts (like stories), use native SpeechSynthesis
    if (text.length > 150) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        window.speechSynthesis.speak(utterance);
      }
      return;
    }
    
    if (audioRef.current) {
      try {
        const gTTSLang = lang.startsWith('en') ? 'en-US' : 'ar';
        const cleanText = text.substring(0, 150);
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${gTTSLang}&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
        
        audioRef.current.pause();
        audioRef.current.src = url;
        audioRef.current.load();
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Audio playback blocked, falling back to synthesis", err);
            if ('speechSynthesis' in window) {
              window.speechSynthesis.cancel();
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.lang = lang;
              window.speechSynthesis.speak(utterance);
            }
          });
        }
      } catch (err: any) {
        console.warn("Audio notice:", err?.message || String(err));
      }
    }
  };

  const arabicNumbers = [
    { n: 0, word: 'صفر', icon: '⚪' },
    { n: 1, word: 'واحد', icon: '🍎' },
    { n: 2, word: 'اثنان', icon: '🍦' },
    { n: 3, word: 'ثلاثة', icon: '🎈' },
    { n: 4, word: 'أربعة', icon: '🍀' },
    { n: 5, word: 'خمسة', icon: '🖐️' },
    { n: 6, word: 'ستة', icon: '🎲' },
    { n: 7, word: 'سبعة', icon: '🌈' },
    { n: 8, word: 'ثمانية', icon: '🕷️' },
    { n: 9, word: 'تسعة', icon: '🎈' },
    { n: 10, word: 'عشرة', icon: '⭐' },
  ];

  const [mathExerciseIdx, setMathExerciseIdx] = useState(0);
  const mathExercises = [
    { 
      type: 'count', 
      title: 'كم تفاحة موجودة؟ 🍎', 
      items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎'], 
      options: [4, 5, 6, 7], 
      correct: 6,
      color: 'rose'
    },
    { 
      type: 'count', 
      title: 'كم نجمة في السماء؟ ⭐', 
      items: ['⭐', '⭐', '⭐'], 
      options: [2, 3, 4, 5], 
      correct: 3,
      color: 'amber'
    },
    { 
      type: 'shape', 
      title: 'أين هو المربع؟ 🟦', 
      options: [
        { name: 'مربع', icon: '🟦', color: 'text-blue-500' },
        { name: 'دائرة', icon: '🟡', color: 'text-yellow-500' },
        { name: 'مثلث', icon: '🔺', color: 'text-red-500' }
      ], 
      correct: 'مربع',
      color: 'emerald'
    },
    { 
      type: 'count', 
      title: 'كم سيارة في الطريق؟ 🚗', 
      items: ['🚗', '🚗', '🚗', '🚗'], 
      options: [3, 4, 5, 6], 
      correct: 4,
      color: 'sky'
    }
  ];

  const currentExercise = mathExercises[mathExerciseIdx % mathExercises.length];

  const handleMathAnswer = (answer: any) => {
    if (answer === currentExercise.correct) {
      addXP(50);
      speak("أحسنتم! إجابة صحيحة. لننتقل للسؤال التالي");
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setTimeout(() => {
        setMathExerciseIdx(prev => prev + 1);
      }, 2000);
    } else {
      speak("حاول مرة أخرى يا بطل");
    }
  };

  const renderMathContent = () => (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="bg-white rounded-[3rem] p-6 md:p-10 border-4 border-sky-100 shadow-xl text-center">
        <h2 className="text-3xl md:text-4xl font-black text-sky-600 mb-8 flex items-center justify-center gap-4">
          <Calculator size={40} /> سحر الأرقام الممتع
        </h2>
        
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-amber-50 p-6 md:p-10 rounded-[2.5rem] border-2 border-amber-200 shadow-inner text-right" dir="rtl">
            <h3 className="text-2xl font-bold text-amber-800 mb-8 text-center">تعلم الأرقام من 0 إلى 10 🔢</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3">
               {arabicNumbers.map((num) => (
                 <motion.button 
                   key={num.n}
                   whileHover={{ scale: 1.1, rotate: 5 }}
                   whileTap={{ scale: 0.9 }}
                   onClick={() => {
                     addXP(5);
                     speak(`${num.n} ... ${num.word}`);
                   }}
                   className="bg-white p-4 rounded-2xl border-2 border-amber-100 flex flex-col items-center gap-1 hover:border-amber-400 transition shadow-sm group"
                 >
                   <span className="text-3xl font-black text-amber-600">{num.n}</span>
                   <span className="text-sm font-bold text-amber-800">{num.word}</span>
                   <span className="text-2xl group-hover:scale-125 transition-transform">{num.icon}</span>
                 </motion.button>
               ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto w-full">
            <div className={`bg-${currentExercise.color}-50 p-8 md:p-12 rounded-[3.5rem] border-4 border-${currentExercise.color}-100 shadow-2xl relative overflow-hidden text-right`} dir="rtl">
              <div className="absolute top-0 left-0 p-6">
                <span className="text-4xl animate-pulse">✨</span>
              </div>
              
              <h3 className={`text-3xl md:text-4xl font-black text-${currentExercise.color}-800 mb-10 text-center`}>
                {currentExercise.title}
              </h3>

              {currentExercise.type === 'count' && (
                <div className="flex flex-wrap justify-center gap-6 mb-12 min-h-[120px] items-center bg-white/40 p-8 rounded-[2.5rem] shadow-inner">
                  {currentExercise.items?.map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="text-6xl md:text-7xl drop-shadow-lg"
                    >{item}</motion.div>
                  ))}
                </div>
              )}

              {currentExercise.type === 'shape' && (
                <div className="grid grid-cols-3 gap-6 mb-12">
                   {currentExercise.options?.map((opt: any, i: number) => (
                     <div key={i} className="bg-white/60 p-8 rounded-[2.5rem] flex flex-col items-center gap-4 border-2 border-emerald-100 italic">
                        <span className="text-7xl md:text-8xl">{opt.icon}</span>
                        <span className="text-xl font-bold text-emerald-800">{opt.name}</span>
                     </div>
                   ))}
                </div>
              )}

              <div className="flex justify-center gap-4 md:gap-6 flex-wrap">
                {currentExercise.options?.map((opt: any, i: number) => {
                  const val = typeof opt === 'object' ? opt.name : opt;
                  const label = typeof opt === 'object' ? opt.icon : opt;
                  return (
                    <motion.button 
                      key={i}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMathAnswer(val)}
                      className={`min-w-[100px] py-6 px-10 rounded-[2rem] bg-white border-4 border-${currentExercise.color}-200 text-4xl font-black text-${currentExercise.color}-600 hover:bg-white hover:border-${currentExercise.color}-400 transition-all shadow-xl hover:shadow-2xl`}
                    >
                      {label}
                    </motion.button>
                  );
                })}
              </div>
              
              <div className="mt-12 flex justify-center gap-2">
                 {mathExercises.map((_, i) => (
                   <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${i === mathExerciseIdx % mathExercises.length ? `w-10 bg-${currentExercise.color}-500` : 'bg-slate-200'}`} />
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHub = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl md:rounded-[3rem] p-4 sm:p-7 md:p-10 text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center gap-4 sm:gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="w-14 h-14 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl flex items-center justify-center p-2 sm:p-4 shrink-0 shadow-inner">
           <Trophy className="w-8 h-8 sm:w-14 sm:h-14 text-amber-300 drop-shadow-md" />
        </div>
        <div className="relative z-10 flex-1 text-center md:text-right">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-black mb-1.5 sm:mb-2 leading-snug">
            مرحباً بك في <span className="text-amber-300">عالم الأبطال! 🌟</span>
          </h1>
          <p className="text-indigo-100 text-xs sm:text-base font-medium mb-3 sm:mb-4">
            لديك حالياً <span className="font-black text-white">{points}</span> نقطة خبرة. استمر في الإبداع!
          </p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
             <div className="bg-white/10 px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl sm:rounded-2xl flex items-center gap-1.5 border border-white/20 text-xs sm:text-sm font-bold">
               <Sparkles size={14} className="text-amber-300" />
               <span>مستوى المكتشف</span>
             </div>
             <div className="bg-white/10 px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl sm:rounded-2xl flex items-center gap-1.5 border border-white/20 text-xs sm:text-sm font-bold">
               <Heart size={14} className="text-rose-400" />
               <span>أنت مبدع اليوم!</span>
             </div>
          </div>
        </div>
      </div>

      {/* 4 Main Sections in 2-by-2 paired grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {[
          { id: 'arabic', title: 'عالم الحروف 🅰️', color: 'bg-rose-50 border-rose-200 text-rose-600', icon: <Pencil size={32} /> },
          { id: 'math', title: 'سحر الأرقام 🔢', color: 'bg-sky-50 border-sky-200 text-sky-600', icon: <Calculator size={32} /> },
          { id: 'stories', title: 'قصص الحكايات 📖', color: 'bg-emerald-50 border-emerald-200 text-emerald-600', icon: <BookOpen size={32} /> },
          { id: 'creative', title: 'لوحة الإبداع 🎨', color: 'bg-amber-50 border-amber-200 text-amber-600', icon: <Gamepad2 size={32} /> }
        ].map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.03, y: -4 }}
            onClick={() => setActiveTab(item.id as KidsTab)}
            className={`${item.color} border-2 sm:border-4 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-7 md:p-8 cursor-pointer text-center group shadow-xs transition-all hover:shadow-xl flex flex-col justify-between`}
          >
             <div className="mb-3 sm:mb-4 flex justify-center group-hover:scale-110 transition duration-300">
                {item.icon}
             </div>
             <h3 className="text-sm sm:text-xl font-black">{item.title}</h3>
             <div className="mt-2 text-xs sm:text-sm font-bold opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
               هيا نكتشف <ArrowRight size={14} />
             </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl sm:rounded-[3rem] p-5 sm:p-8 md:p-10 border-2 sm:border-4 border-slate-100 shadow-lg text-right" dir="rtl">
        <h2 className="text-xl sm:text-3xl font-black text-slate-800 mb-6 flex items-center gap-3">
          <Trophy className="text-amber-500" size={24} /> لوحة الإنجازات والأوسمة
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
           {[
             { id: 'first_letter', label: 'بداية الحروف', icon: '🅰️', earned: points > 50 },
             { id: 'math_master', label: 'عبقري الأرقام', icon: '🧮', earned: points > 200 },
             { id: 'artist', label: 'الفنان الموهوب', icon: '🎨', earned: points > 100 },
             { id: 'story_lover', label: 'قارئ القصص', icon: '📚', earned: points > 300 },
             { id: 'daily_player', label: 'بطل يومي', icon: '🔥', earned: false },
             { id: 'fast_learner', label: 'المتعلم السريع', icon: '⚡', earned: false },
           ].map(badge => (
             <div key={badge.id} className={`flex flex-col items-center gap-2 p-3 sm:p-5 rounded-2xl border-2 transition-all ${badge.earned ? 'border-amber-400 bg-amber-50' : 'border-slate-100 bg-slate-50 opacity-40 grayscale'}`}>
               <span className="text-2xl sm:text-4xl">{badge.icon}</span>
               <span className="font-bold text-center text-xs sm:text-sm">{badge.label}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Youtube Channels for Kids: 2-by-2 paired grid */}
      <div className="bg-slate-900 rounded-2xl sm:rounded-[3rem] p-5 sm:p-8 md:p-10 text-white relative overflow-hidden shadow-2xl" dir="rtl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -ml-32 -mt-32"></div>
        <div className="relative z-10">
          <h2 className="text-xl sm:text-3xl font-black mb-6 flex items-center gap-3">
            <Youtube className="text-red-500" size={28} /> قنوات يوتيوب تعليمية ومفيدة للأطفال 📺
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {[
              { name: 'تعلم مع زكريا', desc: 'قناة ممتازة لتعليم الأطفال الحروف والقراءة، والوضوء والصلاة والسور القصيرة بأسلوب كرتوني.', url: 'https://www.youtube.com/c/Learnwithzakaria', icon: '🕌' },
              { name: 'عدنان معلم القرآن', desc: 'تطبيق موجه للأطفال لتعليم سور القرآن الكريم والأذكار وحروف الهجاء والتلاوة.', url: 'https://www.youtube.com/@adnanquran', icon: '📖' },
              { name: 'طيور الجنة بيبي', desc: 'تضم مجموعة كبيرة من الأناشيد لتعليم الحروف والأرقام وأسماء الحيوانات.', url: 'https://www.youtube.com/user/toyoraljannah', icon: '🐦' },
              { name: 'سراج التعليمي', desc: 'مسلسل كرتوني ثلاثي الأبعاد يقدم مغامرات راشد ونورة في استكشاف الحروف العربية.', url: 'https://www.youtube.com/@SirajShow', icon: '⭐' },
            ].map(channel => (
              <motion.div
                key={channel.name}
                whileHover={{ scale: 1.02, y: -3 }}
                onClick={() => window.open(channel.url, '_blank')}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl cursor-pointer hover:bg-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/20 flex items-center justify-center text-xl sm:text-3xl mb-3 shadow-sm">
                    {channel.icon}
                  </div>
                  <h3 className="text-xs sm:text-lg font-bold text-white mb-1.5">{channel.name}</h3>
                  <p className="text-white/70 text-[11px] sm:text-xs leading-relaxed font-medium pb-3 line-clamp-2">{channel.desc}</p>
                </div>
                <div className="mt-auto flex items-center gap-1.5 text-white font-bold text-[11px] sm:text-xs bg-red-600/80 w-max px-3 py-1.5 rounded-xl">
                  زيارة القناة <ExternalLink size={13} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

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
    }
  };

  const renderCreativeBoard = () => (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
       <div className="bg-white rounded-[3rem] p-6 md:p-10 border-4 border-amber-100 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-10 text-right" dir="rtl">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-amber-600">لوحة الإبداع والرسومات 🎨</h2>
              <p className="text-slate-500 text-lg">ارسم، اكتب، ولون بأجمل الألوان يا فنان!</p>
            </div>
            <button 
              onClick={() => {
                clearCanvas();
                addXP(10);
                speak("لوحة جديدة لرسامنا الجميل");
              }}
              className="bg-amber-500 text-white px-8 py-4 rounded-3xl font-black hover:bg-amber-600 transition flex items-center justify-center gap-3 shadow-lg"
            >
              <Eraser size={24} /> مسح اللوحة
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
             <div className="flex-1 bg-slate-100 rounded-[3rem] overflow-hidden border-8 border-white p-2 shadow-inner h-[400px] md:h-[500px] relative">
               <canvas 
                 ref={canvasRef}
                 width={1200}
                 height={800}
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
                  <span className="text-[200px] md:text-[300px] font-black">🎨</span>
               </div>
             </div>

             <div className="w-full lg:w-48 bg-slate-50 rounded-[3rem] p-6 md:p-8 flex flex-row lg:flex-col gap-4 justify-center items-center shadow-inner overflow-x-auto overflow-y-hidden">
                {["#f43f5e", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#1e293b", "#ec4899", "#22d3ee"].map(c => (
                  <button 
                    key={c}
                    onClick={() => {
                      setDrawingColor(c);
                      addXP(1);
                    }}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-4 transition-all shadow-lg shrink-0 ${drawingColor === c ? 'scale-125 border-white ring-4 ring-amber-400' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
             </div>
          </div>
       </div>
    </div>
  );

  const renderStories = () => (
    <div className="space-y-10 animate-in fade-in zoom-in duration-500">
      {!selectedStory ? (
        <>
          <div className="bg-emerald-600 rounded-[3rem] p-10 md:p-12 text-white text-center shadow-xl">
            <h2 className="text-4xl md:text-5xl font-black mb-6">مكتبة القصص المصورة 📖</h2>
            <p className="text-emerald-100 text-xl font-medium">استمتع بأجمل القصص مع الصوت والرسوم الجميلة</p>
          </div>

          {/* Stories Grid: 2-by-2 paired layout */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {storiesData.map((story, i) => (
              <motion.div
                key={story.id}
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => {
                  setSelectedStory(story);
                  addXP(30);
                  speak(`لنستمتع بـ ${story.title}`);
                }}
                className="group cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${story.color} rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-7 text-white h-56 sm:h-72 flex flex-col items-center justify-between relative overflow-hidden shadow-md hover:shadow-xl border-2 sm:border-4 border-white/20 transition-all`}>
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
                  <span className="text-4xl sm:text-6xl drop-shadow-md">{story.icon}</span>
                  <div className="text-center">
                    <h3 className="text-xs sm:text-xl font-black leading-tight mb-2 line-clamp-2">{story.title}</h3>
                    <p className="text-white/80 text-[10px] sm:text-xs font-medium hidden sm:line-clamp-2">{story.summary}</p>
                  </div>
                  <div className="bg-white/25 backdrop-blur-md px-3 py-1.5 rounded-full font-bold text-[10px] sm:text-xs flex items-center gap-1.5">
                     <BookOpen size={13} /> استماع وقراءة
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 sm:mt-16 bg-white rounded-2xl sm:rounded-[3rem] p-5 sm:p-8 md:p-12 border-2 sm:border-4 border-emerald-100 shadow-lg text-right" dir="rtl">
            <h2 className="text-xl sm:text-3xl font-black text-emerald-700 mb-6 flex items-center gap-3">
              <Download className="text-emerald-600" size={24} /> مصادر تحميل القصص والكتب (PDF)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-4">
              {[
                { title: "مكتبة نور - قصص أطفال", url: "https://www.noor-book.com/%D9%83%D8%AA%D8%A8-%D9%82%D8%B5%D8%B5-%D8%A7%D9%84%D8%A3%D8%B7%D9%81%D8%A7%D9%84-pdf", color: "text-emerald-700" },
                { title: "مؤسسة هنداوي للأطفال", url: "https://www.hindawi.org/books/categories/children.stories/", color: "text-emerald-700" },
                { title: "أطفال الخليج التعليمي", url: "https://ar.gulfkids.com/", color: "text-emerald-700" },
                { title: "مكتبة كتب قصص PDF", url: "https://www.kutub-pdf.net/category/46.html", color: "text-emerald-700" }
              ].map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3.5 sm:p-5 bg-emerald-50/70 rounded-xl sm:rounded-2xl border border-emerald-200/80 hover:border-emerald-400 transition-all group">
                  <span className={`font-bold text-xs sm:text-base ${link.color} truncate`}>{link.title}</span>
                  <ArrowRight size={16} className="text-emerald-500 group-hover:-translate-x-1.5 transition-transform shrink-0 mr-1" />
                </a>
              ))}
            </div>
          </div>
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] border-4 border-emerald-100 shadow-2xl p-6 md:p-10 relative overflow-hidden"
          dir="rtl"
        >
          <button 
            onClick={() => {
              setSelectedStory(null);
              window.speechSynthesis.cancel();
            }}
            className="absolute top-6 left-6 p-4 bg-slate-100 rounded-full text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition shadow-sm z-20"
          >
            <X size={28} />
          </button>

          <div className="flex flex-col items-center text-center mb-10">
            <span className="text-8xl mb-4 drop-shadow-lg">{selectedStory.icon}</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-4">{selectedStory.title}</h2>
            <p className="text-slate-500 font-bold text-xl">{selectedStory.summary}</p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-emerald-50 rounded-[4rem] p-12 md:p-20 border-4 border-emerald-100 text-emerald-900 shadow-inner relative">
                <div className="absolute top-8 right-8 animate-bounce text-4xl">✨</div>
                <div className="absolute bottom-8 left-8 animate-bounce delay-300 text-4xl">⭐</div>
                <div className="prose prose-2xl max-w-none">
                  <p className="text-3xl md:text-4xl font-bold leading-[2] text-right whitespace-pre-wrap">
                    {selectedStory.content}
                  </p>
                </div>
                <div className="mt-20 flex justify-center">
                  <button 
                    onClick={() => speak(selectedStory.content)}
                    className="group bg-emerald-600 text-white px-12 py-6 rounded-[3rem] font-black text-2xl hover:bg-emerald-700 transition-all flex items-center gap-6 shadow-2xl shadow-emerald-200 hover:-translate-y-2"
                  >
                    <Volume2 size={40} className="group-hover:scale-110 transition-transform" /> 
                    <span>اقرأ لي القصة بصوتك يا ذكي 🎙️</span>
                  </button>
                </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
             <button 
               onClick={() => {
                 setSelectedStory(null);
                 window.speechSynthesis.cancel();
                 confetti({
                   particleCount: 150,
                   spread: 70,
                   origin: { y: 0.6 }
                 });
                 addXP(50);
               }}
               className="bg-indigo-600 text-white px-12 py-5 rounded-3xl font-black text-2xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-200 flex items-center gap-4"
             >
               <Star size={28} className="text-amber-300 fill-amber-300" /> لقد انتهيت! مكافأة بطل
             </button>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderParentView = () => (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom duration-500 text-right" dir="rtl">
      <div className="bg-white rounded-[3rem] p-8 md:p-12 border-4 border-slate-100 shadow-2xl">
        <h2 className="text-3xl font-black text-slate-900 mb-8 border-b-4 border-indigo-50 pb-6 flex items-center gap-4">
          <User className="text-indigo-600" /> بوابة الآباء والمعلمين 🎓
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="bg-indigo-50 p-6 rounded-3xl border-2 border-indigo-100 text-center">
             <div className="text-indigo-600 font-black text-4xl mb-1">{points}</div>
             <div className="text-indigo-900 font-bold">نقاط XP الكلية</div>
           </div>
           <div className="bg-amber-50 p-6 rounded-3xl border-2 border-amber-100 text-center">
             <div className="text-amber-600 font-black text-4xl mb-1">54 دقيقة</div>
             <div className="text-amber-900 font-bold">وقت التعلم النشط</div>
           </div>
           <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-100 text-center">
             <div className="text-emerald-600 font-black text-4xl mb-1">3</div>
             <div className="text-emerald-900 font-bold">وحدات مكتملة</div>
           </div>
        </div>

        <h3 className="text-2xl font-black text-slate-800 mb-6">تقرير التقدم حسب المهارة</h3>
        <div className="space-y-6">
           {[
             { label: "اللغة العربية", val: 85, color: "bg-rose-500" },
             { label: "الرياضيات", val: 40, color: "bg-sky-500" },
             { label: "الإبداع والرسوم", val: 95, color: "bg-amber-500" },
             { label: "الاستماع والقصص", val: 60, color: "bg-emerald-500" }
           ].map(skill => (
             <div key={skill.label} className="space-y-2 text-right">
                <div className="flex justify-between font-bold text-slate-700">
                   <span>{skill.label}</span>
                   <span>{skill.val}%</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                   <div 
                    className={`h-full ${skill.color} transition-all duration-1000`} 
                    style={{ width: `${skill.val}%` }}
                   ></div>
                </div>
             </div>
           ))}
        </div>

        <div className="mt-12 p-8 bg-slate-900 rounded-[2rem] text-white flex flex-col md:flex-row items-center gap-6">
           <div className="p-4 bg-white/10 rounded-2xl"><Settings className="text-indigo-400" /></div>
           <div className="flex-1 text-right">
             <h4 className="text-xl font-bold mb-1">تحكم في بيئة الطفل</h4>
             <p className="text-slate-400 text-sm">يمكنك إدارة المحتوى المعروض وتعيين أهداف تعليمية جديدة لهذا الأسبوع.</p>
           </div>
           <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition">إدارة الإعدادات</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 pb-28 space-y-8">
      <audio ref={audioRef} playsInline />
      
      {/* Sticky Category Bar for Kids Section */}
      <div className="sticky top-14 sm:top-16 z-20 py-2">
        <div 
          className="max-w-4xl mx-auto bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-1.5 shadow-md flex items-center justify-between gap-1 overflow-x-auto hide-scrollbar"
          dir="rtl"
        >
           {[
             { id: 'home', icon: <LayoutPanelLeft size={20} />, label: 'الرئيسية' },
             { id: 'arabic', icon: <Music size={20} />, label: 'حروفنا' },
             { id: 'math', icon: <Calculator size={20} />, label: 'أرقامنا' },
             { id: 'stories', icon: <BookOpen size={20} />, label: 'قصصنا' },
             { id: 'creative', icon: <Gamepad2 size={20} />, label: 'ألعابنا' },
             { id: 'parent', icon: <User size={20} />, label: 'بوابة الأهل' }
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => {
                 setActiveTab(tab.id as KidsTab);
                 window.speechSynthesis.cancel();
               }}
               className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm min-w-max transition-all touch-press ${
                 activeTab === tab.id 
                   ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                   : 'text-slate-600 hover:bg-slate-100'
               }`}
             >
               {tab.icon}
               <span>{tab.label}</span>
             </button>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -20 }}
           transition={{ duration: 0.3 }}
        >
          {activeTab === 'home' && renderHub()}
          {activeTab === 'math' && renderMathContent()}
          {activeTab === 'stories' && renderStories()}
          {activeTab === 'creative' && renderCreativeBoard()}
          {activeTab === 'parent' && renderParentView()}
          {activeTab === 'arabic' && (
            <div className="space-y-12">
               <div className="bg-white rounded-[3rem] p-6 md:p-10 border-4 border-rose-100 shadow-xl text-right" dir="rtl">
                 <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                   <div>
                     <h2 className="text-3xl md:text-4xl font-black text-rose-600">قطار الحروف العربية 🚂</h2>
                     <p className="text-slate-500 text-lg">اركب معنا وتعرف على أجمل الحروف العربية يا بطل!</p>
                   </div>
                   <div className="flex items-center gap-2 bg-amber-50 px-6 py-3 rounded-2xl border-2 border-amber-200 text-amber-700 font-bold shadow-sm">
                     <Trophy size={24} /> {points} XP
                   </div>
                 </div>

                 <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 md:gap-6">
                   {arabicAlphabet.map((item, idx) => (
                     <motion.button
                       key={idx}
                       whileHover={{ scale: 1.15, rotate: 5 }}
                       whileTap={{ scale: 0.9 }}
                       onClick={() => {
                         addXP(10);
                         speak(`${item.letter} ... ${item.word}`);
                       }}
                       className={`${item.color} aspect-square rounded-[2rem] border-4 border-white shadow-lg flex flex-col items-center justify-center gap-1 transition-all group overflow-hidden`}
                     >
                        <span className="text-4xl md:text-5xl font-black">{item.letter}</span>
                        <span className="text-2xl opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100">{item.symbol}</span>
                        <span className="font-bold text-xs hidden sm:block">{item.word}</span>
                     </motion.button>
                   ))}
                 </div>
               </div>

               <div className="grid md:grid-cols-2 gap-8 text-right" dir="rtl">
                  <div className="bg-white p-8 md:p-10 rounded-[3rem] border-4 border-slate-50 shadow-lg">
                     <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3"><Music className="text-rose-500" /> أناشيد الحروف</h3>
                     <div className="space-y-4">
                        {[
                          { t: "أغنية الحروف الجميلة", icon: "🎵" },
                          { t: "أصوات الحيوانات والحروف", icon: "🦁" },
                          { t: "قطار الأرقام والألوان", icon: "🚂" }
                        ].map(n => (
                          <div key={n.t} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-rose-200 transition cursor-pointer group">
                            <div className="flex items-center gap-4">
                              <span className="text-2xl">{n.icon}</span>
                              <span className="font-bold text-slate-700">{n.t}</span>
                            </div>
                            <Volume2 className="text-slate-300 group-hover:text-rose-500" />
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className="bg-white p-8 md:p-10 rounded-[3rem] border-4 border-slate-50 shadow-lg">
                     <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3"><Pencil className="text-rose-500" /> تحدي الكتابة الذكي</h3>
                     <div className="p-8 bg-rose-50 rounded-[2rem] border-2 border-rose-100 text-center">
                        <p className="text-rose-900 font-bold mb-6 text-lg">هل يمكنك كتابة حرف "أ"؟</p>
                        <button 
                          onClick={() => setActiveTab('creative')}
                          className="bg-rose-500 text-white px-10 py-4 rounded-2xl font-bold hover:bg-rose-600 transition shadow-lg"
                        >افتح لوحة الرسم الآن</button>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
