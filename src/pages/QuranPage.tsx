import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Volume2, VolumeX, Loader2, SkipForward, SkipBack, X, Search } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { SURAHS, RECITERS, getSurahNumber, Reciter } from '../lib/quranData';

export default function QuranPage() {
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(RECITERS[0]);
  const [playingSurah, setPlayingSurah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [downloadingSurah, setDownloadingSurah] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasTriedFallback, setHasTriedFallback] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.preload = 'auto';
    }
  }, []);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime || 0;
      const dur = audioRef.current.duration || 0;
      setCurrentTime(cur);
      setDuration(dur);
      if (dur > 0) {
        setProgress((cur / dur) * 100);
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current && audioRef.current.duration) {
      const newTime = (parseFloat(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleAudioError = async (e: any) => {
    // Avoid circular JSON error when logging event objects
    const errorMsg = e?.target?.error?.message || e?.message || "Audio playback error";
    console.warn("Audio playback notice:", errorMsg);

    if (playingSurah !== null && !hasTriedFallback && selectedReciter.fallbackServer) {
      setHasTriedFallback(true);
      const fallbackUrl = getSurahAudioUrl(selectedReciter, playingSurah, true);
      console.log("Attempting fallback URL:", fallbackUrl);
      if (audioRef.current && fallbackUrl) {
        audioRef.current.src = fallbackUrl;
        audioRef.current.load();
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setIsLoading(false);
          return;
        } catch (retryErr: any) {
          console.warn("Fallback audio load notice:", retryErr?.message || String(retryErr));
        }
      }
    }

    setIsPlaying(false);
    setIsLoading(false);
    
    if (playingSurah !== null && !isPlaying) {
      toast.error("تعذر تشغيل هذه السورة حالياً", {
        description: "يرجى اختيار قارئ آخر أو محاولة التشغيل لاحقاً"
      });
    }
  };

  const getSurahAudioUrl = (reciter: Reciter, index: number, useFallback = false) => {
    if (reciter.buildUrl) {
      return reciter.buildUrl(index);
    }
    const server = useFallback && reciter.fallbackServer ? reciter.fallbackServer : reciter.server;
    return `${server}/${getSurahNumber(index)}.mp3`;
  };

  const playSurah = async (index: number) => {
    if (!audioRef.current) return;
    
    try {
      if (playingSurah === index) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          setIsLoading(true);
          await audioRef.current.play();
          setIsPlaying(true);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setPlayingSurah(index);
      setHasTriedFallback(false);
      
      const primaryUrl = getSurahAudioUrl(selectedReciter, index, false);
      
      if (!primaryUrl) {
        setIsLoading(false);
        toast.error("عذراً، هذه السورة غير متوفرة لهذا القارئ.");
        return;
      }

      audioRef.current.src = primaryUrl;
      audioRef.current.load();
      
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
      } catch (playErr: any) {
        // If primary URL failed, try fallback immediately if available
        if (selectedReciter.fallbackServer && !hasTriedFallback) {
          setHasTriedFallback(true);
          const fallbackUrl = getSurahAudioUrl(selectedReciter, index, true);
          if (fallbackUrl && audioRef.current) {
            console.log("Attempting fallback URL:", fallbackUrl);
            audioRef.current.src = fallbackUrl;
            audioRef.current.load();
            await audioRef.current.play();
            setIsPlaying(true);
            setIsLoading(false);
            return;
          }
        }
        throw playErr;
      }
    } catch (err: any) {
      const errName = err?.name || '';
      const errMsg = err?.message || String(err);
      if (errName !== 'AbortError' && errName !== 'NotAllowedError') {
        console.warn("Play surah notice:", errMsg);
      }
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const playNext = () => {
    if (playingSurah !== null && playingSurah < 113) playSurah(playingSurah + 1);
  };

  const playPrev = () => {
    if (playingSurah !== null && playingSurah > 0) playSurah(playingSurah - 1);
  };

  const forceDownload = async (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (downloadingSurah === index) return;
    setDownloadingSurah(index);
    const url = getSurahAudioUrl(selectedReciter, index);
    
    if (!url) {
      setDownloadingSurah(null);
      toast.error("عذراً، هذه السورة غير متوفرة لهذا القارئ.");
      return;
    }
    
    const filename = `سورة_${SURAHS[index]}_${selectedReciter.name}.mp3`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err: any) {
      console.warn("Download fallback notice:", err?.message || String(err));
      window.open(url, '_blank');
    } finally {
      setDownloadingSurah(null);
    }
  };

  const filteredSurahs = SURAHS.map((name, index) => ({ name, index }))
    .filter(({ name, index }) => {
      if (selectedReciter.availableSurahs && !selectedReciter.availableSurahs.includes(index)) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim();
      const numMatch = (index + 1).toString().includes(q);
      const nameMatch = name.includes(q);
      return numMatch || nameMatch;
    });

  return (
    <div className="space-y-6 md:space-y-8 pb-32" dir="rtl">
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate} 
        onEnded={() => playNext()}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onError={handleAudioError}
      />

      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">القرآن الكريم</h2>
          <p className="text-slate-500 text-base mt-1">استمع وحمل تلاوات خاشعة ومجودة لكبار القراء بأعلى جودة ودون تقطيع</p>
        </div>
      </div>

      {/* Reciter & Search Selection Header */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200 flex flex-col lg:flex-row items-stretch justify-between gap-4 sm:gap-6 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="relative z-10 w-full flex-1 space-y-3 sm:space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-black text-slate-800">اختر القارئ المفضل لديك</h1>
              {selectedReciter.availableSurahs ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[10px] sm:text-xs font-bold">
                  التسجيلات المتاحة: {selectedReciter.availableSurahs.length} سورة من النوادر
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] sm:text-xs font-bold">
                  مصحف كامل 114 سورة (بدقة عالية)
                </span>
              )}
            </div>
            <p className="text-slate-500 text-xs sm:text-sm">
              مصحف إلكتروني شامل بدقة عالية - الشيخ محمد عبدالوهاب الطنطاوي، الشيخ شعبان الصياد، الشيخ محمد رفعت، وجميع كبار القراء.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reciter Selector */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">القارئ:</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 appearance-none font-bold text-slate-800 shadow-inner"
                value={selectedReciter.id}
                onChange={(e) => {
                  const reciter = RECITERS.find(r => r.id === parseInt(e.target.value));
                  if (reciter) {
                    setSelectedReciter(reciter);
                    if (isPlaying) {
                      audioRef.current?.pause();
                      setIsPlaying(false);
                    }
                    setPlayingSurah(null);
                  }
                }}
              >
                {RECITERS.map(reciter => (
                  <option key={reciter.id} value={reciter.id}>
                    {reciter.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 left-0 top-6 flex items-center px-4 text-slate-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>

            {/* Surah Search Filter */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">ابحث عن سورة:</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث باسم السورة أو رقمها (مثال: الكهف أو 18)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-11 pl-4 py-3.5 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-800 shadow-inner"
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
            </div>
          </div>

          <div className="pt-1">
            <span className="font-bold text-slate-700 text-xs block mb-2">القراء المميزون:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { id: 26, name: 'الطنطاوي (مجود)' },
                { id: 24, name: 'محمد رفعت (مجود)' },
                { id: 25, name: 'شعبان الصياد (مجود)' },
                { id: 1, name: 'الحصري (مجود)' },
                { id: 2, name: 'عبد الباسط (مجود)' },
                { id: 3, name: 'المنشاوي (مجود)' },
              ].map(fastReciter => (
                <button
                  key={fastReciter.id}
                  onClick={() => {
                    const reciter = RECITERS.find(r => r.id === fastReciter.id);
                    if (reciter) {
                      setSelectedReciter(reciter);
                      if (isPlaying) {
                        audioRef.current?.pause();
                        setIsPlaying(false);
                      }
                      setPlayingSurah(null);
                    }
                  }}
                  className={`px-2 py-1.5 rounded-xl border text-center text-[11px] sm:text-xs font-bold transition-all truncate ${
                    selectedReciter.id === fastReciter.id
                      ? 'bg-[#800020] text-white border-[#800020] shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-rose-50 hover:text-[#800020] border-slate-200'
                  }`}
                >
                  {fastReciter.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex w-24 h-24 bg-rose-50 rounded-3xl items-center justify-center shrink-0 my-auto shadow-inner rotate-2 border border-rose-200/50">
          <span className="text-4xl">📖</span>
        </div>
      </div>

      {/* Surahs Grid: 2 columns on mobile and paired layout */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3.5 md:gap-4">
        {filteredSurahs.map(({ name: surahName, index }) => {
          const isCurrentActive = playingSurah === index;
          const isCurrentPlaying = isCurrentActive && isPlaying;
          const isCurrentLoading = isCurrentActive && isLoading;
          const dlUrl = getSurahAudioUrl(selectedReciter, index);
          
          return (
            <motion.div
              layout
              key={index}
              className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border shadow-xs hover:shadow-md flex flex-col justify-between gap-2.5 group transition-all duration-300 ${
                 isCurrentActive 
                  ? 'border-[#800020] bg-rose-50/50 ring-2 ring-[#800020]/20' 
                  : 'border-slate-200/80 bg-white hover:border-[#800020]/40'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span className={`w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-black shrink-0 transition-colors ${
                  isCurrentActive 
                    ? 'bg-[#800020] text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 group-hover:bg-rose-50 group-hover:text-[#800020]'
                }`}>
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <span className={`text-xs sm:text-base font-bold block truncate leading-tight ${isCurrentActive ? 'text-[#800020]' : 'text-slate-800'}`}>
                    سورة {surahName}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-medium block truncate">
                    {index < 86 ? 'مكية' : 'مدنية'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-slate-100">
                <button
                  onClick={() => playSurah(index)}
                  className={`flex-1 h-7 sm:h-8 flex items-center justify-center gap-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
                    isCurrentActive 
                    ? 'bg-[#800020] text-white shadow-sm' 
                    : 'bg-rose-50 text-[#800020] hover:bg-rose-100 border border-rose-200/60'
                  }`}
                  title={isCurrentPlaying ? "إيقاف مؤقت" : "تشغيل التلاوة"}
                >
                  {isCurrentLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : isCurrentPlaying ? (
                    <>
                      <Pause size={14} />
                      <span className="text-[10px] hidden sm:inline">إيقاف</span>
                    </>
                  ) : (
                    <>
                      <Play size={14} className="ml-0.5" />
                      <span className="text-[10px] hidden sm:inline">تشغيل</span>
                    </>
                  )}
                </button>
                <a
                  href={dlUrl}
                  onClick={(e) => forceDownload(index, e)}
                  target="_blank"
                  rel="noreferrer"
                  download
                  title="تحميل السورة"
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200/70 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all shrink-0"
                >
                  {downloadingSurah === index ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Download size={13} />
                  )}
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredSurahs.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200">
          <p className="text-slate-500 font-bold text-lg">لم يتم العثور على سورة تطابق البحث "{searchQuery}"</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-3 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all"
          >
            إعادة عرض جميع السور
          </button>
        </div>
      )}

      {/* Floating Audio Player - App Mode Docked Player */}
      <AnimatePresence>
        {playingSurah !== null && (
          <motion.div 
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed bottom-[64px] lg:bottom-6 left-2 right-2 sm:left-4 sm:right-4 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-3xl bg-slate-900/95 backdrop-blur-xl text-white rounded-2xl shadow-2xl border border-slate-700/90 z-40 overflow-hidden"
          >
            {/* Top Micro Progress Bar */}
            <div className="w-full bg-slate-800 h-1 relative">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-150"
                style={{ width: `${progress || 0}%` }}
              />
            </div>

            <div className="p-3 sm:p-4 flex flex-col gap-2.5">
              {/* Primary Player Row */}
              <div className="flex items-center justify-between gap-3">
                {/* Surah Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Volume2 size={20} className={isPlaying ? "animate-pulse" : ""} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-black text-white truncate">
                      سورة {SURAHS[playingSurah]}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold truncate">
                      {selectedReciter.name}
                    </span>
                  </div>
                </div>

                {/* Main Controls (Previous, Play/Pause, Next) */}
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  <button 
                    onClick={playPrev} 
                    disabled={playingSurah === 0}
                    className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-25 active:scale-90 transition touch-press"
                    title="السورة السابقة"
                    aria-label="السورة السابقة"
                  >
                    <SkipForward size={20} />
                  </button>

                  <button 
                    onClick={() => playSurah(playingSurah)} 
                    className="w-11 h-11 bg-emerald-500 rounded-full flex items-center justify-center text-slate-950 hover:bg-emerald-400 transition transform active:scale-95 shadow-md shadow-emerald-500/25 touch-press"
                    title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
                    aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
                  >
                    {isLoading ? (
                      <Loader2 size={22} className="animate-spin text-slate-950" />
                    ) : isPlaying ? (
                      <Pause size={22} className="fill-current" />
                    ) : (
                      <Play size={22} className="fill-current mr-0.5" />
                    )}
                  </button>

                  <button 
                    onClick={playNext} 
                    disabled={playingSurah === 113}
                    className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-25 active:scale-90 transition touch-press"
                    title="السورة التالية"
                    aria-label="السورة التالية"
                  >
                    <SkipBack size={20} />
                  </button>

                  {/* Close Player Button */}
                  <button 
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.pause();
                      }
                      setIsPlaying(false);
                      setPlayingSurah(null);
                      setIsLoading(false);
                    }} 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-white/5 transition active:scale-90 touch-press mr-1"
                    title="إغلاق المشغل"
                    aria-label="إغلاق المشغل"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Progress Slider Row & Actions */}
              <div className="flex items-center gap-2.5 text-xs">
                <span className="font-mono text-slate-400 shrink-0 w-9 text-left tabular-nums text-[11px]">
                  {formatTime(currentTime)}
                </span>
                
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={progress || 0}
                  onChange={handleSeek}
                  aria-label="شريط تقدم التلاوة"
                  className="w-full h-1.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:h-2 transition-all"
                />

                <span className="font-mono text-slate-400 shrink-0 w-9 text-right tabular-nums text-[11px]">
                  {formatTime(duration)}
                </span>

                <div className="flex items-center gap-1 shrink-0 border-r border-slate-700 pr-2 mr-1">
                  <button
                    onClick={toggleMute}
                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white transition active:scale-90 touch-press"
                    title={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
                    aria-label={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
                  >
                    {isMuted ? <VolumeX size={16} className="text-rose-400" /> : <Volume2 size={16} />}
                  </button>

                  <a 
                    href={getSurahAudioUrl(selectedReciter, playingSurah)}
                    onClick={(e) => forceDownload(playingSurah, e)}
                    target="_blank"
                    rel="noreferrer"
                    download
                    title="تحميل السورة MP3"
                    aria-label="تحميل السورة MP3"
                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white transition active:scale-90 touch-press"
                  >
                    {downloadingSurah === playingSurah ? (
                      <Loader2 size={16} className="animate-spin text-emerald-400" />
                    ) : (
                      <Download size={16} />
                    )}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
