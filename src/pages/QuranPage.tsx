import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Volume2, Loader2, SkipForward, SkipBack, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { SURAHS, RECITERS, getSurahNumber } from '../lib/quranData';

export default function QuranPage() {
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [playingSurah, setPlayingSurah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadingSurah, setDownloadingSurah] = useState<number | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playIdRef = useRef<number>(0);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = (parseFloat(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  const handleAudioError = (e: any) => {
    console.error("Audio playback error details:", {
      error: e.target.error,
      code: e.target.error?.code,
      message: e.target.error?.message,
      currentSrc: audioRef.current?.currentSrc
    });
    
    setIsPlaying(false);
    setIsLoading(false);
    
    let errorMsg = "حدث خطأ أثناء تشغيل الملف الصوتي";
    if (e.target.error?.code === 4) {
      errorMsg = "تعذر تحميل الملف: المصدر غير مدعوم أو الرابط غير صالح حالياً";
    }
    
    toast.error(errorMsg, {
      description: "يرجى تجربة قارئ آخر أو سورة أخرى"
    });
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
      
      const url = selectedReciter.buildUrl 
        ? selectedReciter.buildUrl(index) 
        : `${selectedReciter.server}/${getSurahNumber(index)}.mp3`;
      
      if (!url) {
        setIsLoading(false);
        toast.error("عذراً، هذه السورة غير متوفرة لهذا القارئ.");
        return;
      }

      console.log("Loading surah:", index + 1, "from URL:", url);
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
        console.error("Audio playback error:", err);
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
    const url = selectedReciter.buildUrl ? selectedReciter.buildUrl(index) : `${selectedReciter.server}/${getSurahNumber(index)}.mp3`;
    
    if (!url) {
      setDownloadingSurah(null);
      alert("عذراً، هذه السورة غير متوفرة لهذا القارئ.");
      return;
    }
    
    const filename = `${SURAHS[index]}.mp3`;
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
      window.open(url, '_blank'); // fallback
    } finally {
      setDownloadingSurah(null);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-32">
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate} 
        onEnded={() => playNext()}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onError={handleAudioError}
      />
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">القرآن الكريم</h2>
          <p className="text-slate-500 text-base mt-2">استمع وحمل قراءات مجودة لكبار القراء بأعلى جودة</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 w-full">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">استمع للقرآن الكريم</h1>
          <p className="text-slate-500 max-w-lg mb-6 flex-1">
            اختر القارئ المفضل لديك واستمع لتلاوات خاشعة من جميع سور القرآن الكريم.
          </p>
          <div className="relative max-w-sm">
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 appearance-none font-bold text-slate-700 shadow-inner"
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
                <option key={reciter.id} value={reciter.id}>{reciter.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-slate-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
        <div className="w-24 h-24 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0 relative z-10 shadow-inner rotate-3">
          <span className="text-4xl font-bold text-emerald-600">📖</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {SURAHS.map((surah, index) => {
          // If reciter has availableSurahs, only show those surahs
          if (selectedReciter.availableSurahs && !selectedReciter.availableSurahs.includes(index)) {
            return null;
          }

          const isCurrentActive = playingSurah === index;
          const isCurrentPlaying = isCurrentActive && isPlaying;
          const isCurrentLoading = isCurrentActive && isLoading;
          const dlUrl = selectedReciter.buildUrl 
            ? selectedReciter.buildUrl(index) 
            : `${selectedReciter.server}/${getSurahNumber(index)}.mp3`;
          
          return (
            <motion.div
              layout
              key={index}
              className={`p-4 rounded-2xl border shadow-sm hover:shadow-md flex items-center justify-between group transition-all duration-300 ${
                 isCurrentActive ? 'border-primary-500 bg-primary-50' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-12 h-12 flex items-center justify-center rounded-2xl text-sm font-black transition-colors ${isCurrentActive ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-700'}`}>
                  {index + 1}
                </span>
                <span className={`text-base font-bold ${isCurrentActive ? 'text-primary-700' : 'text-slate-800'}`}>
                  سورة {surah}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => playSurah(index)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${
                    isCurrentActive 
                    ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/20' 
                    : 'bg-slate-50 text-primary-600 hover:bg-primary-100 border border-primary-100/50'
                  }`}
                >
                  {isCurrentLoading ? <Loader2 size={18} className="animate-spin" /> : isCurrentPlaying ? <Pause size={18} /> : <Play size={18} className="mr-0.5" />}
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
                  {downloadingSurah === index ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Audio Player */}
      <AnimatePresence>
        {playingSurah !== null && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 lg:bottom-10 left-4 right-4 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-3xl bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 z-50 flex flex-col md:flex-row items-center gap-4"
          >
            <div className="flex items-center gap-4 w-full md:w-auto shrink-0 justify-between md:justify-start">
               <div className="flex flex-col">
                 <span className="text-xs text-primary-300 font-semibold mb-1">{selectedReciter.name}</span>
                 <span className="text-lg font-bold">سورة {SURAHS[playingSurah]}</span>
               </div>
               <div className="flex items-center gap-3">
                 <button onClick={playPrev} className="text-slate-400 hover:text-white transition"><SkipForward size={20} /></button>
                 <button onClick={() => playSurah(playingSurah)} className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-400 transition transform hover:scale-105 active:scale-95 shadow-lg">
                   {isLoading ? <Loader2 size={24} className="animate-spin" /> : isPlaying ? <Pause size={24} /> : <Play size={24} className="mr-1" />}
                 </button>
                 <button onClick={playNext} className="text-slate-400 hover:text-white transition"><SkipBack size={20} /></button>
               </div>
            </div>

            <div className="flex-1 w-full flex items-center gap-3">
               <Volume2 size={16} className="text-slate-400 shrink-0" />
               <input 
                 type="range" 
                 min="0" 
                 max="100" 
                 value={progress || 0}
                 onChange={handleSeek}
                 className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
               />
               <a 
                 href={selectedReciter.buildUrl ? selectedReciter.buildUrl(playingSurah) : `${selectedReciter.server}/${getSurahNumber(playingSurah)}.mp3`}
                 onClick={(e) => forceDownload(playingSurah, e)}
                 target="_blank"
                 download
                 className="text-slate-400 hover:text-white transition shrink-0"
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
                 className="text-slate-400 hover:text-rose-400 transition shrink-0 ml-2 border-l border-slate-700 pl-3"
                 title="إغلاق التلاوة"
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
