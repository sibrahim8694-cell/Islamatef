import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Play, Pause, X, RadioTower, BookOpen, Volume2, VolumeX, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGlobalAudio } from '../context/GlobalAudioContext';
import { SURAHS } from '../lib/quranData';

export const GlobalMiniPlayer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    activeSource,
    isRadioPlaying,
    isRadioLoading,
    radioStreamHealth,
    toggleRadio,
    stopRadio,
    playingSurah,
    selectedReciter,
    isQuranPlaying,
    isQuranLoading,
    quranProgress,
    toggleQuran,
    stopQuran
  } = useGlobalAudio();

  // If user is currently on /radio, RadioPage already renders its primary interface
  // If user is currently on /quran, QuranPage already renders its bottom bar
  const isOnRadioPage = location.pathname === '/radio';
  const isOnQuranPage = location.pathname === '/quran';

  // Do not show mini-player if no audio is active
  const hasActiveRadio = activeSource === 'radio' && (isRadioPlaying || isRadioLoading);
  const hasActiveQuran = activeSource === 'quran' && playingSurah !== null;

  if (!hasActiveRadio && !hasActiveQuran) {
    return null;
  }

  // If user is on the dedicated page for that specific audio, let the page's own full controller manage it
  if (hasActiveRadio && isOnRadioPage) return null;
  if (hasActiveQuran && isOnQuranPage) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="fixed bottom-16 lg:bottom-4 left-3 right-3 sm:left-6 sm:right-6 max-w-2xl mx-auto z-40 bg-slate-900/95 backdrop-blur-xl border border-white/10 text-white p-2.5 sm:p-3 rounded-2xl shadow-2xl select-none"
        dir="rtl"
        aria-label="مشغل الصوت العائم"
      >
        <div className="flex items-center justify-between gap-3">
          {/* Track Info (Click to open page) */}
          <button
            onClick={() => navigate(hasActiveRadio ? '/radio' : '/quran')}
            className="flex items-center gap-3 min-w-0 flex-1 text-right group hover:opacity-95 transition"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md ${
              hasActiveRadio ? 'bg-[#800020]' : 'bg-emerald-600'
            }`}>
              {hasActiveRadio ? (
                <RadioTower size={20} className={isRadioPlaying ? 'animate-pulse' : ''} />
              ) : (
                <BookOpen size={20} className={isQuranPlaying ? 'animate-pulse' : ''} />
              )}
            </div>

            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-white truncate">
                  {hasActiveRadio 
                    ? 'إذاعة القرآن الكريم من القاهرة' 
                    : `سورة ${SURAHS[playingSurah || 0]}`}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-amber-300 shrink-0">
                  {hasActiveRadio ? '98.2 FM مباشر' : selectedReciter.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {hasActiveRadio
                  ? (radioStreamHealth === 'buffering' ? 'جاري الاتصال بالأثير...' : 'بث حي ومباشر على مدار ٢٤ ساعة')
                  : `القارئ: ${selectedReciter.name} (اضغط للعرض الكامل)`}
              </p>
            </div>
          </button>

          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Play/Pause */}
            <button
              onClick={hasActiveRadio ? toggleRadio : toggleQuran}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white transition active:scale-95 shadow-md ${
                hasActiveRadio ? 'bg-[#800020] hover:bg-[#9c0027]' : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
              title={
                hasActiveRadio
                  ? (isRadioPlaying ? 'إيقاف البث مؤقتاً' : 'تشغيل البث')
                  : (isQuranPlaying ? 'إيقاف السورة مؤقتاً' : 'متابعة التلاوة')
              }
            >
              {(hasActiveRadio && isRadioLoading) || (hasActiveQuran && isQuranLoading) ? (
                <Loader2 size={18} className="animate-spin text-white" />
              ) : (hasActiveRadio ? isRadioPlaying : isQuranPlaying) ? (
                <Pause size={18} className="fill-current" />
              ) : (
                <Play size={18} className="fill-current mr-0.5" />
              )}
            </button>

            {/* Close */}
            <button
              onClick={hasActiveRadio ? stopRadio : stopQuran}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-white/5 transition"
              title="إغلاق المشغل"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quran Progress Line */}
        {hasActiveQuran && (
          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-emerald-400 h-full transition-all duration-200"
              style={{ width: `${quranProgress}%` }}
            />
          </div>
        )}
      </motion.aside>
    </AnimatePresence>
  );
};
