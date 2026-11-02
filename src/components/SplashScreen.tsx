import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2800; // 2.8 seconds smooth natural progression

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(() => {
            onFinish();
          }, 450); // Fade out transition duration
        }, 250);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-[#02182b] flex items-center justify-center overflow-hidden select-none"
        >
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute inset-0 bg-radial from-sky-900/30 via-[#02182b] to-[#010e1c] pointer-events-none" />
          <div className="absolute top-1/4 -right-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Skip Button */}
          <div className="absolute top-4 left-4 z-50" dir="rtl">
            <button
              onClick={() => {
                setIsDone(true);
                setTimeout(onFinish, 150);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/90 text-xs font-bold border border-white/20 transition-all active:scale-95 shadow-lg touch-press"
            >
              <span>تخطي التحميل</span>
              <ArrowLeft size={14} />
            </button>
          </div>

          {/* Image & Interactive Loader Container */}
          <div className="relative w-full max-w-[440px] h-[94vh] max-h-[820px] mx-auto px-3 flex items-center justify-center">
            {/* The Dedicated Memorial Image */}
            <div className="relative w-full aspect-[1068/1473] max-h-full rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-white/10 bg-slate-950">
              <img
                src="/assets/aistudio/file_00000000c1cc820ab29fe9be0c9fd684_99637794.png"
                alt="بوابة إسلام - نسألكم الدعاء له بالرحمة والمغفرة"
                className="w-full h-full object-contain pointer-events-none"
              />

              {/* Exact Overlay Over the Image Progress Bar Track (direction LTR matching graphic design) */}
              <div
                dir="ltr"
                className="absolute pointer-events-none flex items-center"
                style={{
                  left: '15.8%',
                  width: '68.4%',
                  top: '79.3%',
                  height: '4.4%',
                }}
              >
                {/* Dark Recessed Container Covering the Pre-printed Bar */}
                <div className="w-full h-full rounded-full bg-[#00264d] p-[2px] border border-amber-300/80 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] relative overflow-hidden flex items-center">
                  {/* Dynamic Glowing Gold Filling Bar (fills cleanly from left to right) */}
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-200 transition-all duration-100 ease-out relative shadow-[0_0_14px_rgba(251,191,36,0.9)] flex items-center justify-end"
                    style={{ width: `${progress}%` }}
                  >
                    {/* Shimmer Light Scan */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />

                    {/* Glowing Leading Head at the right tip */}
                    {progress > 3 && progress < 99 && (
                      <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white/95 rounded-full blur-[1px] shadow-[0_0_8px_#ffffff]" />
                    )}
                  </div>

                  {/* Clean Percentage Display Inside the Bar - Crisp and Uncluttered */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="font-mono text-[11px] sm:text-xs font-black text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
