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
    console.error("Audio playback error:", e);

    if (playingSurah !== null && !hasTriedFallback && selectedReciter.fallbackServer) {
      setHasTriedFallback(true);
      const fallbackUrl = `${selectedReciter.fallbackServer}/${getSurahNumber(playingSurah)}.mp3`;
      console.log("Attempting fallback URL:", fallbackUrl);
      if (audioRef.current) {
        audioRef.current.src = fallbackUrl;
        audioRef.current.load();
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setIsLoading(false);
          return;
        } catch (retryErr) {
          console.error("Fallback audio load failed:", retryErr);
        }
      }
    }

    setIsPlaying(false);
    setIsLoading(false);
    
    toast.error("تعذر تشغيل هذه السورة حالياً", {
      description: "يرجى اختيار قارئ آخر أو محاولة التشغيل لاحقاً"
    });
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
      
      const url = getSurahAudioUrl(selectedReciter, index);
      
      if (!url) {
        setIsLoading(false);
        toast.error("عذراً، هذه السورة غير متوفرة لهذا القارئ.");
        return;
      }

      audioRef.current.src = url;
      audioRef.current.load();
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        setIsLoading(false);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
        console.error("Play surah error:", err);
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
    } catch (err) {
      console.error(err);
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
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 flex flex-col lg:flex-row items-stretch justify-between gap-6 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="relative z-10 w-full flex-1 space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">اختر القارئ المفضل لديك</h1>
            <p className="text-slate-500 text-sm">
              تمت إضافة الشيخ محمد رفعت (كامل مجود) والشيخ شعبان الصياد وكوكبة من أئمة القراء.
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

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
            <span className="font-bold text-slate-700">القراء المميزون:</span>
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
                className={`px-3 py-1 rounded-xl border text-xs font-bold transition-all ${
                  selectedReciter.id === fastReciter.id
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border-slate-200'
                }`}
              >
                {fastReciter.name}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex w-24 h-24 bg-emerald-100 rounded-3xl items-center justify-center shrink-0 my-auto shadow-inner rotate-2 border border-emerald-200/50">
          <span className="text-4xl">📖</span>
        </div>
      </div>

      {/* Surahs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSurahs.map(({ name: surahName, index }) => {
          const isCurrentActive = playingSurah === index;
          const isCurrentPlaying = isCurrentActive && isPlaying;
          const isCurrentLoading = isCurrentActive && isLoading;
          const dlUrl = getSurahAudioUrl(selectedReciter, index);
          
          return (
            <motion.div
              layout
              key={index}
              className={`p-4 rounded-2xl border shadow-sm hover:shadow-md flex items-center justify-between group transition-all duration-300 ${
                 isCurrentActive 
                  ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20' 
                  : 'border-slate-200 bg-white hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className={`w-11 h-11 flex items-center justify-center rounded-2xl text-sm font-black transition-colors ${
                  isCurrentActive ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30' : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                }`}>
                  {index + 1}
                </span>
                <div>
                  <span className={`text-base font-bold block ${isCurrentActive ? 'text-emerald-800' : 'text-slate-800'}`}>
                    سورة {surahName}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {index < 86 ? 'مكية' : 'مدنية'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => playSurah(index)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${
                    isCurrentActive 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
                    : 'bg-slate-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100/60'
                  }`}
                  title={isCurrentPlaying ? "إيقاف مؤقت" : "تشغيل التلاوة"}
                >
                  {isCurrentLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : isCurrentPlaying ? (
                    <Pause size={18} />
                  ) : (
                    <Play size={18} className="ml-0.5" />
                  )}
                </button>
                <a
                  href={dlUrl}
                  onClick={(e) => forceDownload(index, e)}
                  target="_blank"
                  rel="noreferrer"
                  download
                  title="تحميل السورة"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all font-bold"
                >
                  {downloadingSurah === index ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Download size={16} />
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

      {/* Floating Audio Player */}
      <AnimatePresence>
        {playingSurah !== null && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-20 lg:bottom-8 left-3 right-3 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-3xl bg-slate-900 text-white p-4 rounded-3xl shadow-2xl border border-slate-700 z-50 flex flex-col md:flex-row items-center gap-4"
          >
            <div className="flex items-center gap-4 w-full md:w-auto shrink-0 justify-between md:justify-start">
               <div className="flex flex-col max-w-[180px]">
                 <span className="text-xs text-emerald-400 font-bold truncate">{selectedReciter.name}</span>
                 <span className="text-lg font-black truncate">سورة {SURAHS[playingSurah]}</span>
               </div>
               <div className="flex items-center gap-2">
                 <button 
                   onClick={playPrev} 
                   disabled={playingSurah === 0}
                   className="p-2 text-slate-400 hover:text-white disabled:opacity-30 transition"
                   title="السورة السابقة"
                 >
                   <SkipForward size={22} />
                 </button>
                 <button 
                   onClick={() => playSurah(playingSurah)} 
                   className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white hover:bg-emerald-400 transition transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/30"
                   title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
                 >
                   {isLoading ? (
                     <Loader2 size={24} className="animate-spin" />
                   ) : isPlaying ? (
                     <Pause size={24} />
                   ) : (
                     <Play size={24} className="ml-1" />
                   )}
                 </button>
                 <button 
                   onClick={playNext} 
                   disabled={playingSurah === 113}
                   className="p-2 text-slate-400 hover:text-white disabled:opacity-30 transition"
                   title="السورة التالية"
                 >
                   <SkipBack size={22} />
                 </button>
               </div>
            </div>

            <div className="flex-1 w-full flex items-center gap-3">
               <span className="text-xs font-mono text-slate-400 shrink-0 w-10 text-left">
                 {formatTime(currentTime)}
               </span>
               <input 
                 type="range" 
                 min="0" 
                 max="100" 
                 value={progress || 0}
                 onChange={handleSeek}
                 className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
               />
               <span className="text-xs font-mono text-slate-400 shrink-0 w-10 text-right">
                 {formatTime(duration)}
               </span>

               <button
                 onClick={toggleMute}
                 className="text-slate-400 hover:text-white transition shrink-0 p-1"
                 title={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
               >
                 {isMuted ? <VolumeX size={18} className="text-rose-400" /> : <Volume2 size={18} />}
               </button>

               <a 
                 href={getSurahAudioUrl(selectedReciter, playingSurah)}
                 onClick={(e) => forceDownload(playingSurah, e)}
                 target="_blank"
                 rel="noreferrer"
                 download
                 title="تحميل السورة"
                 className="text-slate-400 hover:text-white transition shrink-0 p-1"
               >
                 {downloadingSurah === playingSurah ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
               </a>

               <button 
                 onClick={() => {
                   if (audioRef.current) {
                     audioRef.current.pause();
                   }
                   setIsPlaying(false);
                   setPlayingSurah(null);
                   setIsLoading(false);
                 }} 
                 className="text-slate-400 hover:text-rose-400 transition shrink-0 mr-1 border-r border-slate-700 pr-3"
                 title="إغلاق القارئ"
               >
                 <X size={20} />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
