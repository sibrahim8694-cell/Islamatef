import React, { useState, useRef, useEffect } from 'react';
import { 
  Radio, Play, Pause, Volume2, VolumeX, Loader2, 
  Search, X, Sparkles, Share2, ShieldCheck, Heart, 
  Headphones, RefreshCw, RadioTower
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { RADIO_STATIONS, RADIO_CATEGORIES, RadioStation } from '../data/radioData';

export default function RadioPage() {
  const [selectedStation, setSelectedStation] = useState<RadioStation>(RADIO_STATIONS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.9);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hasTriedFallback, setHasTriedFallback] = useState<boolean>(false);
  const [streamHealth, setStreamHealth] = useState<'live' | 'buffering' | 'idle'>('idle');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stallTimerRef = useRef<NodeJS.Timeout | null>(null);
  const playAttemptRef = useRef<number>(0);
  const isSwitchingRef = useRef<boolean>(false);

  // Setup MediaSession for background and lock-screen playback
  useEffect(() => {
    if ('mediaSession' in navigator && selectedStation) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: selectedStation.name,
        artist: 'إذاعة القرآن الكريم بث مباشر',
        album: selectedStation.subname,
        artwork: [
          { src: 'https://i.imgur.com/sRBt7lJ.png', sizes: '512x512', type: 'image/png' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        handlePlayStation(selectedStation);
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        handlePause();
      });
      navigator.mediaSession.setActionHandler('stop', () => {
        handleStop();
      });
    }
  }, [selectedStation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stallTimerRef.current) {
        clearTimeout(stallTimerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
      }
    };
  }, []);

  const playStreamSafe = async (station: RadioStation, url: string, isFallback: boolean, attemptId: number) => {
    if (!audioRef.current) return;
    
    try {
      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.load();

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        await playPromise;
      }

      // Check if this attempt is still the latest one
      if (attemptId === playAttemptRef.current) {
        setIsPlaying(true);
        setIsLoading(false);
        setStreamHealth('live');
        isSwitchingRef.current = false;
      }
    } catch (err: any) {
      // Ignore AbortError: happens normally when user switches stations or clicks pause before play resolves
      if (err?.name === 'AbortError') {
        return;
      }

      // If another station or attempt was started in the meantime, ignore this error
      if (attemptId !== playAttemptRef.current) {
        return;
      }

      console.warn('Stream playback error:', err?.message || err);

      // Attempt fallback once if available
      if (!isFallback && station.fallbackUrl) {
        setHasTriedFallback(true);
        await playStreamSafe(station, station.fallbackUrl, true, attemptId);
        return;
      }

      // Both primary and fallback failed or unavailable
      isSwitchingRef.current = false;
      setIsLoading(false);
      setIsPlaying(false);
      setStreamHealth('idle');
      toast.error('تعذر الاتصال بالبث المباشر حالياً', {
        description: 'يرجى تجربة إذاعة أخرى أو إعادة المحاولة بعد قليل.'
      });
    }
  };

  const handlePlayStation = async (station: RadioStation) => {
    if (!audioRef.current) return;

    // Toggle if same station is playing
    if (selectedStation.id === station.id && isPlaying) {
      handlePause();
      return;
    }

    const currentAttempt = ++playAttemptRef.current;
    isSwitchingRef.current = true;
    setSelectedStation(station);
    setIsLoading(true);
    setStreamHealth('buffering');
    setHasTriedFallback(false);

    await playStreamSafe(station, station.streamUrl, false, currentAttempt);
  };

  const handlePause = () => {
    playAttemptRef.current++;
    isSwitchingRef.current = false;
    if (stallTimerRef.current) clearTimeout(stallTimerRef.current);
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
    if (stallTimerRef.current) clearTimeout(stallTimerRef.current);
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
    // Ignore if intentional pause or during active programmatic station change
    if (isSwitchingRef.current || !audioRef.current?.src) return;

    if (selectedStation.fallbackUrl && !hasTriedFallback && audioRef.current) {
      setHasTriedFallback(true);
      const attemptId = ++playAttemptRef.current;
      playStreamSafe(selectedStation, selectedStation.fallbackUrl, true, attemptId);
      return;
    }

    setIsPlaying(false);
    setIsLoading(false);
    setStreamHealth('idle');
  };

  const handleShareStation = async (station: RadioStation, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: station.name,
          text: `استمع الآن إلى ${station.name} (${station.subname}) - بوابة إسلام للعلم والإيمان (صدقة جارية)`,
          url: window.location.href
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(`تم نسخ رابط ${station.name}`);
    }
  };

  // Filter stations based on search and category
  const filteredStations = RADIO_STATIONS.filter(s => {
    const matchesCategory = 
      activeCategory === 'all' || 
      (activeCategory === 'cairo' && s.category === 'cairo') ||
      (activeCategory === 'main' && (s.category === 'main' || s.category === 'cairo')) ||
      (activeCategory === 'reciters' && s.category === 'reciters') ||
      (activeCategory === 'programs' && s.category === 'programs') ||
      (activeCategory === 'azkar' && s.category === 'azkar');

    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const query = searchQuery.trim().toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      s.subname.toLowerCase().includes(query) ||
      s.desc.toLowerCase().includes(query) ||
      s.country.toLowerCase().includes(query)
    );
  });

  const cairoStation = RADIO_STATIONS.find(s => s.id === 'cairo-quran') || RADIO_STATIONS[0];
  const isCairoPlaying = isPlaying && selectedStation.id === cairoStation.id;

  return (
    <div className="space-y-6 sm:space-y-8 pb-32" dir="rtl">
      {/* Hidden Audio Element with standard HTML5 streaming */}
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

      {/* Page Title & Mission */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-[#800020] border border-rose-200/80 text-xs font-bold mb-2">
            <RadioTower size={14} className="text-[#800020] animate-pulse" />
            <span>بث حي ومباشر على مدار ٢٤ ساعة</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            إذاعة القرآن الكريم
          </h1>
          <p className="text-slate-500 text-xs sm:text-base mt-1">
            استمع مباشرة إلى إذاعة القرآن الكريم من القاهرة، مكة المكرمة، وباقة من إذاعات كبار القراء الخالدين بأعلى نقاء صوتي
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>بث حي متواصل</span>
          </span>
        </div>
      </div>

      {/* Featured Hero Station: Cairo Quran Radio (إذاعة القرآن الكريم من القاهرة) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#800020] via-rose-950 to-slate-950 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl border border-rose-900/50">
        <div className="absolute top-0 left-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap mb-2.5">
              <span className="bg-rose-500/20 text-rose-200 border border-rose-400/30 px-3 py-0.5 rounded-full text-xs font-bold">
                🇪🇬 الإذاعة الأم · جمهورية مصر العربية
              </span>
              <span className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full text-xs font-black shadow-xs">
                98.2 FM
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>على الهواء مباشرة</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl md:text-4xl font-black mb-2 text-white">
              {cairoStation.name}
            </h2>
            <p className="text-rose-100 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl font-medium mb-5">
              {cairoStation.desc}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => handlePlayStation(cairoStation)}
                className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm md:text-base shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2.5 touch-press"
              >
                {isLoading && selectedStation.id === cairoStation.id ? (
                  <Loader2 size={20} className="animate-spin text-slate-950" />
                ) : isCairoPlaying ? (
                  <>
                    <Pause size={20} className="fill-current" />
                    <span>إيقاف البث مؤقتاً</span>
                  </>
                ) : (
                  <>
                    <Play size={20} className="fill-current" />
                    <span>تشغيل إذاعة القاهرة الآن</span>
                  </>
                )}
              </button>

              <button
                onClick={(e) => handleShareStation(cairoStation, e)}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-3 rounded-2xl text-xs sm:text-sm border border-white/20 transition flex items-center gap-2"
                title="مشاركة إذاعة القاهرة"
              >
                <Share2 size={16} />
                <span>مشاركة</span>
              </button>
            </div>
          </div>

          {/* Retro-Modern Animated Radio Visualizer Card */}
          <div className="w-full md:w-auto flex flex-col items-center justify-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center p-4 shadow-inner relative group">
              {isCairoPlaying ? (
                <div className="flex items-end justify-center gap-1.5 h-16 w-full">
                  {[40, 70, 100, 60, 90, 50, 80].map((h, i) => (
                    <motion.span
                      key={i}
                      animate={{ height: [`${Math.max(15, h * 0.3)}%`, `${h}%`, `${Math.max(20, h * 0.5)}%`] }}
                      transition={{ duration: 0.6 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-2 rounded-full bg-gradient-to-t from-amber-400 to-rose-300 shadow-xs"
                    />
                  ))}
                </div>
              ) : (
                <Radio size={48} className="text-rose-200 group-hover:scale-110 transition-transform" />
              )}
              <span className="text-[11px] font-bold text-rose-200 mt-2">
                {isCairoPlaying ? 'جاري البث الحي 🟢' : 'انقر للتشغيل'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن إذاعة باسم الشيخ أو الدولة أو الموضوع (مثال: القاهرة، عبد الباسط، تفسير، رقية)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-11 pl-10 py-3 sm:py-3.5 focus:outline-none focus:border-[#800020] focus:ring-2 focus:ring-[#800020]/20 font-medium text-slate-800 text-xs sm:text-sm"
          />
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Pills (Horizontal Scrollable on Mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {RADIO_CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-[#800020] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-rose-50 hover:text-[#800020] border border-slate-200/80'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stations Grid: 2 columns on mobile facing each other, 3 on md, 4 on lg */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4">
        {filteredStations.map(station => {
          const isSelected = selectedStation.id === station.id;
          const isThisPlaying = isSelected && isPlaying;
          const isThisLoading = isSelected && isLoading;

          return (
            <motion.div
              layout
              key={station.id}
              onClick={() => handlePlayStation(station)}
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between gap-3 group transition-all duration-300 relative overflow-hidden ${
                isSelected
                  ? 'border-[#800020] bg-rose-50/60 ring-2 ring-[#800020]/20'
                  : 'border-slate-200/90 bg-white hover:border-[#800020]/40'
              }`}
            >
              {/* Top Row: Country Badge + Live status */}
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 truncate">
                  {station.countryBadge}
                </span>

                {isThisPlaying ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                    <span>مباشر</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-400">
                    {station.frequency || 'بث 24س'}
                  </span>
                )}
              </div>

              {/* Station Info */}
              <div className="min-w-0 flex-1">
                <h3 className={`text-xs sm:text-base font-black leading-snug line-clamp-2 ${
                  isSelected ? 'text-[#800020]' : 'text-slate-800 group-hover:text-[#800020]'
                }`}>
                  {station.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium line-clamp-1 mt-1">
                  {station.subname}
                </p>
              </div>

              {/* Bottom Controls Row */}
              <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayStation(station);
                  }}
                  className={`flex-1 h-7 sm:h-8.5 flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black transition-all ${
                    isThisPlaying
                      ? 'bg-[#800020] text-white shadow-xs'
                      : 'bg-rose-50 text-[#800020] hover:bg-rose-100 border border-rose-200/70'
                  }`}
                >
                  {isThisLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : isThisPlaying ? (
                    <>
                      <Pause size={13} className="fill-current" />
                      <span>إيقاف</span>
                    </>
                  ) : (
                    <>
                      <Play size={13} className="fill-current ml-0.5" />
                      <span>استماع</span>
                    </>
                  )}
                </button>

                <button
                  onClick={(e) => handleShareStation(station, e)}
                  title="مشاركة الإذاعة"
                  className="w-7 h-7 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center border border-slate-200/70 shrink-0 transition"
                >
                  <Share2 size={13} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredStations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
          <Radio size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-700 font-bold text-base">لم يتم العثور على إذاعة تطابق "{searchQuery}"</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="mt-3 px-4 py-2 bg-[#800020] text-white text-xs font-bold rounded-xl"
          >
            إعادة عرض جميع الإذاعات
          </button>
        </div>
      )}

      {/* Floating Live Radio Docked Player (Bottom of Screen) */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed bottom-[64px] lg:bottom-6 left-2 right-2 sm:left-4 sm:right-4 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-3xl bg-slate-900/95 backdrop-blur-xl text-white rounded-2xl shadow-2xl border border-slate-700/90 z-40 overflow-hidden"
          >
            {/* Top Micro Live Pulse Line */}
            <div className="w-full bg-slate-800 h-1 relative overflow-hidden">
              <motion.div 
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-1/3 h-full bg-gradient-to-r from-transparent via-[#800020] to-rose-400"
              />
            </div>

            <div className="p-3 sm:p-4 flex items-center justify-between gap-3">
              {/* Station Info & Equalizer */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                  <Radio size={20} className="animate-pulse" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs sm:text-sm font-black text-white truncate">
                      {selectedStation.name}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-rose-300 font-bold truncate">
                    {selectedStation.subname}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Volume Slider (hidden on extra small) */}
                <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700">
                  <button 
                    onClick={toggleMute}
                    className="text-slate-400 hover:text-white transition"
                    title={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
                  >
                    {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 accent-[#800020] h-1.5 rounded-full cursor-pointer"
                    aria-label="مستوى الصوت"
                  />
                </div>

                {/* Big Play / Pause */}
                <button
                  onClick={() => handlePlayStation(selectedStation)}
                  className="w-11 h-11 bg-[#800020] hover:bg-[#9c0027] rounded-full flex items-center justify-center text-white transition transform active:scale-95 shadow-md shadow-[#800020]/30 touch-press"
                  title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin text-white" />
                  ) : isPlaying ? (
                    <Pause size={20} className="fill-current" />
                  ) : (
                    <Play size={20} className="fill-current mr-0.5" />
                  )}
                </button>

                {/* Close Player */}
                <button
                  onClick={handleStop}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-white/5 transition"
                  title="إغلاق البث"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
