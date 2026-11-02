import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Loader2, 
  Share2, ShieldCheck, Heart, RadioTower, Sparkles,
  MapPin, Clock, BookOpen, Mic2, Info, CheckCircle2,
  RefreshCw, Signal, Award, Headphones
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  RADIO_STATIONS, CAIRO_FREQUENCIES, CAIRO_PROGRAMS, 
  RadioStation 
} from '../data/radioData';

export default function RadioPage() {
  const station: RadioStation = RADIO_STATIONS[0];
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.9);
  const [hasTriedFallback, setHasTriedFallback] = useState<boolean>(false);
  const [streamHealth, setStreamHealth] = useState<'live' | 'buffering' | 'idle'>('idle');
  const [activeTab, setActiveTab] = useState<'overview' | 'frequencies' | 'programs'>('overview');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playAttemptRef = useRef<number>(0);
  const isSwitchingRef = useRef<boolean>(false);

  // Setup MediaSession for background and lock-screen playback
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: station.name,
        artist: 'جمهورية مصر العربية · 98.2 FM',
        album: 'إذاعة القرآن الكريم من القاهرة',
        artwork: [
          { src: 'https://i.imgur.com/sRBt7lJ.png', sizes: '512x512', type: 'image/png' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        handlePlay();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        handlePause();
      });
      navigator.mediaSession.setActionHandler('stop', () => {
        handleStop();
      });
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
      }
    };
  }, []);

  const playStreamSafe = async (url: string, isFallback: boolean, attemptId: number) => {
    if (!audioRef.current) return;

    try {
      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.load();

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        await playPromise;
      }

      if (attemptId === playAttemptRef.current) {
        setIsPlaying(true);
        setIsLoading(false);
        setStreamHealth('live');
        isSwitchingRef.current = false;
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return; // Interrupted by user pause/stop, harmless
      }

      if (attemptId !== playAttemptRef.current) {
        return;
      }

      console.warn('Cairo stream playback error:', err?.message || err);

      if (!isFallback && station.fallbackUrl) {
        setHasTriedFallback(true);
        await playStreamSafe(station.fallbackUrl, true, attemptId);
        return;
      }

      isSwitchingRef.current = false;
      setIsLoading(false);
      setIsPlaying(false);
      setStreamHealth('idle');
      toast.error('تعذر الاتصال بالبث المباشر حالياً', {
        description: 'يرجى التأكد من اتصال الإنترنت وإعادة المحاولة.'
      });
    }
  };

  const handlePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      handlePause();
      return;
    }

    const currentAttempt = ++playAttemptRef.current;
    isSwitchingRef.current = true;
    setIsLoading(true);
    setStreamHealth('buffering');
    setHasTriedFallback(false);

    await playStreamSafe(station.streamUrl, false, currentAttempt);
  };

  const handlePause = () => {
    playAttemptRef.current++;
    isSwitchingRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setIsLoading(false);
    setStreamHealth('idle');
  };

  const handleStop = () => {
    playAttemptRef.current++;
    isSwitchingRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
    }
    setIsPlaying(false);
    setIsLoading(false);
    setStreamHealth('idle');
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val === 0) {
        setIsMuted(true);
        audioRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const nextMute = !isMuted;
      audioRef.current.muted = nextMute;
      setIsMuted(nextMute);
    }
  };

  const handleAudioError = () => {
    if (isSwitchingRef.current || !audioRef.current?.src) return;

    if (station.fallbackUrl && !hasTriedFallback && audioRef.current) {
      setHasTriedFallback(true);
      const attemptId = ++playAttemptRef.current;
      playStreamSafe(station.fallbackUrl, true, attemptId);
      return;
    }

    setIsPlaying(false);
    setIsLoading(false);
    setStreamHealth('idle');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: station.name,
          text: 'استمع الآن إلى البث المباشر لإذاعة القرآن الكريم من القاهرة (98.2 FM) - بوابة إسلام للعلم والإيمان',
          url: window.location.href
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('تم نسخ رابط البث المباشر');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-32" dir="rtl">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        preload="none"
        onWaiting={() => {
          setIsLoading(true);
          setStreamHealth('buffering');
        }}
        onCanPlay={() => {
          setIsLoading(false);
          setStreamHealth('live');
        }}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
          setStreamHealth('live');
        }}
        onStalled={() => {
          if (!isPlaying) return;
          setStreamHealth('buffering');
        }}
        onError={handleAudioError}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-[#800020] border border-rose-200/80 text-xs font-bold mb-2">
            <RadioTower size={14} className="text-[#800020] animate-pulse" />
            <span>بث مباشر وحصري من جمهورية مصر العربية</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            إذاعة القرآن الكريم من القاهرة
          </h1>
          <p className="text-slate-500 text-xs sm:text-base mt-1">
            البث الحي الرسمي لأعرق إذاعة قرآنية في العالم · تردد 98.2 FM على مدار ٢٤ ساعة
          </p>
        </div>

        <button
          onClick={handleShare}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 shadow-xs transition"
        >
          <Share2 size={16} className="text-[#800020]" />
          <span>مشاركة البث</span>
        </button>
      </div>

      {/* Hero Live Player Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#800020] via-rose-950 to-slate-950 text-white shadow-2xl border border-rose-900/50 p-6 sm:p-10">
        {/* Background glow and ornaments */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Radio Info & Status */}
          <div className="space-y-4 text-center lg:text-right max-w-xl">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-bold text-amber-300">
                🇪🇬 مصر · القاهرة
              </span>
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 text-xs font-bold border border-rose-400/30">
                التردد الرئيسي: 98.2 FM
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'}`} />
                <span>{isPlaying ? 'البث المباشر نشط الآن' : 'بث مباشر ٢٤ ساعة'}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              إذاعة القرآن الكريم <span className="text-amber-300">من القاهرة</span>
            </h2>

            <p className="text-rose-100/90 text-sm sm:text-base leading-relaxed">
              هنا القاهرة.. إذاعة القرآن الكريم من جمهورية مصر العربية، أقدم وأعرق إذاعة متخصصة في تلاوة القرآن الكريم وتفسيره وبرامج السنة النبوية الشريفة منذ عام 1964م.
            </p>

            {/* Audio Wave Visualizer */}
            <div className="flex items-center justify-center lg:justify-start gap-1.5 h-10 py-2">
              {[40, 70, 30, 90, 60, 100, 45, 80, 65, 95, 50, 85, 35, 75, 55, 90].map((h, i) => (
                <motion.div
                  key={i}
                  animate={isPlaying ? {
                    height: [`${h * 0.25}%`, `${h}%`, `${h * 0.4}%`, `${h * 0.85}%`],
                  } : { height: '16%' }}
                  transition={isPlaying ? {
                    duration: 0.9 + (i % 4) * 0.2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut'
                  } : { duration: 0.3 }}
                  className="w-1 sm:w-1.5 rounded-full bg-gradient-to-t from-amber-400 to-rose-300 origin-bottom"
                />
              ))}
              <span className="text-xs text-rose-200 mr-2 font-mono">
                {isPlaying ? (streamHealth === 'buffering' ? 'جاري الضبط...' : 'LIVE 98.2 FM') : 'جاهز للتشغيل'}
              </span>
            </div>
          </div>

          {/* Player Controls Hub */}
          <div className="flex flex-col items-center gap-4 bg-black/30 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 w-full sm:w-80 shadow-inner">
            <button
              onClick={handlePlay}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 hover:from-amber-400 hover:to-yellow-200 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30 transition-all transform hover:scale-105 active:scale-95 touch-press"
              title={isPlaying ? 'إيقاف البث مؤقتاً' : 'تشغيل إذاعة القرآن الكريم'}
            >
              {isLoading ? (
                <Loader2 size={36} className="animate-spin text-slate-950" />
              ) : isPlaying ? (
                <Pause size={36} className="fill-current" />
              ) : (
                <Play size={36} className="fill-current mr-1" />
              )}
            </button>

            <div className="text-center">
              <span className="text-sm font-bold text-white block">
                {isLoading ? 'جاري الاتصال بالأثير...' : isPlaying ? 'استماع مباشر' : 'اضغط للاستماع للبث الحي'}
              </span>
              <span className="text-[11px] text-rose-200/80">
                جودة صوتية نقية مباشرة بدون تقطيع
              </span>
            </div>

            {/* Volume & Mute */}
            <div className="w-full flex items-center gap-3 pt-2 border-t border-white/10">
              <button
                onClick={toggleMute}
                className="text-rose-200 hover:text-white p-1 rounded-lg transition"
                title={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full accent-amber-400 h-1.5 rounded-full cursor-pointer"
                aria-label="مستوى الصوت"
              />
              <span className="text-[11px] text-rose-200 font-mono w-8 text-left">
                {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Overview, Egyptian Frequencies, Iconic Programs */}
      <div className="flex border-b border-slate-200/80 gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-[#800020] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles size={16} />
          <span>عن الإذاعة وأعلامها</span>
        </button>

        <button
          onClick={() => setActiveTab('frequencies')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition whitespace-nowrap ${
            activeTab === 'frequencies'
              ? 'bg-[#800020] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin size={16} />
          <span>ترددات الإذاعة في محافظات مصر ({CAIRO_FREQUENCIES.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('programs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition whitespace-nowrap ${
            activeTab === 'programs'
              ? 'bg-[#800020] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen size={16} />
          <span>البرامج التاريخية والتلاوات</span>
        </button>
      </div>

      {/* Tab Content: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#800020] flex items-center justify-center">
                <RadioTower size={20} />
              </div>
              <h3 className="text-base font-black text-slate-800">التأسيس العريق (1964م)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                انطلق أول بث لإذاعة القرآن الكريم من القاهرة في 25 مارس 1964م، لتكون أول وأقدم إذاعة قرآنية في العالم لحفظ كتاب الله وتلاوته.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Mic2 size={20} />
              </div>
              <h3 className="text-base font-black text-slate-800">دولة التلاوة المصرية</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                تصدح الإذاعة بتسجيلات المصحف المرتل والمجود لأعظم قراء التاريخ: الشيخ محمود خليل الحصري، عبد الباسط عبد الصمد، محمد صديق المنشاوي، مصطفى إسماعيل، ومحمود علي البنا.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2 sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-black text-slate-800">المرجعية الأزهرية المعتمدة</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                تعتمد الإذاعة المنهج الأزهري الوسطي السمح في كافة برامجها وتفاسيرها، وتقدم إجابات فتاوى موثقة لكبار علماء الأمة الإسلامية.
              </p>
            </div>
          </div>

          {/* Reciters Honor Grid (2 columns on mobile) */}
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  أعلام الإذاعة المصرية الخالدين
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  أصوات مباركة شرفت أثير إذاعة القرآن الكريم من القاهرة عبر العقود
                </p>
              </div>
              <Award className="text-amber-500" size={24} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { name: 'الشيخ محمود خليل الحصري', role: 'شيخ عموم المقارئ · صاحب أول مصحف مرتل' },
                { name: 'الشيخ عبد الباسط عبد الصمد', role: 'صوت مكة · الحنجرة الذهبية' },
                { name: 'الشيخ محمد صديق المنشاوي', role: 'الصوت الباكي الخاشع' },
                { name: 'الشيخ مصطفى إسماعيل', role: 'أمير القراء والمقامات القرآنية' },
                { name: 'الشيخ محمود علي البنا', role: 'صاحب النبرة الرخيمة المؤثرة' },
                { name: 'الشيخ محمد محمود الطبلاوي', role: 'نقيب القراء السابق' },
                { name: 'الشيخ أحمد نعينع', role: 'قارئ الإذاعة المصرية والرئاسة' },
                { name: 'الشيخ محمد متولي الشعراوي', role: 'إمام الدعاة وخواطر التفسير' },
              ].map((reciter, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-rose-300 transition text-right"
                >
                  <span className="text-xs font-black text-slate-900 block mb-1">
                    {reciter.name}
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight block">
                    {reciter.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Egyptian Governorates Frequencies */}
      {activeTab === 'frequencies' && (
        <div className="space-y-4">
          <div className="bg-rose-50 border border-rose-200/70 rounded-2xl p-4 text-right">
            <p className="text-xs sm:text-sm font-bold text-[#800020]">
              📻 استمع لإذاعة القرآن الكريم من القاهرة عبر أجهزة الراديو في سيارتك أو منزلك بترددات الـ FM في جميع المحافظات:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {CAIRO_FREQUENCIES.map((freq, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 text-right hover:border-rose-300 transition"
              >
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-0.5">
                    {freq.region}
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-slate-800">
                    {freq.city}
                  </h4>
                </div>
                <div className="bg-[#800020] text-white px-2.5 py-1.5 rounded-xl font-mono font-bold text-xs sm:text-sm tracking-wide shrink-0 shadow-xs">
                  {freq.freq}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Iconic Programs */}
      {activeTab === 'programs' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CAIRO_PROGRAMS.map((prog, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2 text-right hover:border-rose-300 transition"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#800020] border border-rose-200 text-[10px] font-bold">
                  {prog.timeSlot}
                </span>
                <Clock size={14} className="text-slate-400" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                {prog.title}
              </h3>
              <p className="text-xs font-bold text-rose-800">
                تقديم: {prog.broadcaster}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed pt-1">
                {prog.desc}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Docked Floating Bottom Player (appears when playing or active) */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-16 lg:bottom-4 left-3 right-3 sm:left-6 sm:right-6 max-w-4xl mx-auto z-40 bg-slate-900/95 backdrop-blur-xl border border-white/10 text-white p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#800020] text-white flex items-center justify-center shrink-0 shadow-md">
                <RadioTower size={20} className="animate-pulse" />
              </div>
              <div className="truncate text-right">
                <h4 className="text-xs sm:text-sm font-black truncate">
                  إذاعة القرآن الكريم من القاهرة
                </h4>
                <p className="text-[11px] text-amber-300 truncate">
                  بث مباشر · 98.2 FM · مصر 🇪🇬
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="text-slate-400 hover:text-white p-1"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 accent-[#800020] h-1.5 rounded-full cursor-pointer"
                />
              </div>

              <button
                onClick={handlePlay}
                className="w-10 h-10 bg-[#800020] hover:bg-[#9c0027] rounded-full flex items-center justify-center text-white transition active:scale-95 shadow-md"
                title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin text-white" />
                ) : isPlaying ? (
                  <Pause size={18} className="fill-current" />
                ) : (
                  <Play size={18} className="fill-current mr-0.5" />
                )}
              </button>

              <button
                onClick={handleStop}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-400 transition"
                title="إغلاق البث"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
