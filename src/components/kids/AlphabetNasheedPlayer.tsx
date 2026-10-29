import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, Music, 
  RotateCcw, Sparkles, Star, Award, Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ARABIC_ALPHABET, AlphabetLetter } from '../../data/kidsIslamicData';
import { kidsSound } from '../../lib/kidsSoundFX';
import { getBestVoice, stopTTS } from '../../lib/tts';

interface AlphabetNasheedPlayerProps {
  onAddXP: (amount: number) => void;
}

export const AlphabetNasheedPlayer: React.FC<AlphabetNasheedPlayerProps> = ({ onAddXP }) => {
  const [selectedLetter, setSelectedLetter] = useState<AlphabetLetter>(ARABIC_ALPHABET[0]);
  const [isPlayingAll, setIsPlayingAll] = useState<boolean>(false);
  const [activeLetterIdx, setActiveLetterIdx] = useState<number>(0);
  const isCancelledRef = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      isCancelledRef.current = true;
      stopTTS();
    };
  }, []);

  // Speak a specific letter with cheerful tone and note
  const playLetter = (letterItem: AlphabetLetter, speakPoem: boolean = false) => {
    kidsSound.playNote(letterItem.frequency, 'sine', 0.4);
    setSelectedLetter(letterItem);
    onAddXP(5);

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    stopTTS();

    const textToSpeak = speakPoem 
      ? letterItem.nasheedVerse 
      : `${letterItem.name} .. ${letterItem.word} .. ${letterItem.tashkeel}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.90;
    utterance.pitch = 1.05;

    const bestVoice = getBestVoice('ar-SA');
    if (bestVoice) utterance.voice = bestVoice;

    window.speechSynthesis.speak(utterance);
  };

  // Continuous Nasheed Carousel: sings each letter and verse sequentially
  const playNasheedStep = (index: number) => {
    if (index >= ARABIC_ALPHABET.length) {
      setIsPlayingAll(false);
      kidsSound.playSuccess();
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      onAddXP(50);
      return;
    }

    if (isCancelledRef.current) return;
    setActiveLetterIdx(index);
    const item = ARABIC_ALPHABET[index];
    setSelectedLetter(item);
    kidsSound.playNote(item.frequency, 'triangle', 0.35);

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    stopTTS();

    const utterance = new SpeechSynthesisUtterance(item.nasheedVerse);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.90;
    utterance.pitch = 1.05;

    const bestVoice = getBestVoice('ar-SA');
    if (bestVoice) utterance.voice = bestVoice;

    utterance.onend = () => {
      if (isCancelledRef.current) return;
      setTimeout(() => {
        if (!isCancelledRef.current && isPlayingAll) {
          playNasheedStep(index + 1);
        }
      }, 450);
    };

    utterance.onerror = () => {
      if (!isCancelledRef.current && isPlayingAll) {
        setTimeout(() => playNasheedStep(index + 1), 500);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleToggleContinuous = () => {
    if (isPlayingAll) {
      isCancelledRef.current = true;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAll(false);
    } else {
      isCancelledRef.current = false;
      setIsPlayingAll(true);
      playNasheedStep(activeLetterIdx);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8" dir="rtl">
      {/* Active Featured Letter Showcase Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-600 rounded-3xl sm:rounded-[3rem] p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/15 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <motion.div 
              key={selectedLetter.letter}
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white text-slate-900 shadow-2xl flex flex-col items-center justify-center shrink-0 border-4 border-amber-200"
            >
              <span className="text-5xl sm:text-7xl font-black text-rose-600">{selectedLetter.letter}</span>
              <span className="text-xs sm:text-sm font-bold text-slate-500">{selectedLetter.name}</span>
            </motion.div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-xs font-bold">
                  الحركات: {selectedLetter.tashkeel}
                </span>
                <span className="text-2xl">{selectedLetter.symbol}</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black tracking-wide mb-2">
                {selectedLetter.word}
              </h3>
              <p className="text-amber-100 text-xs sm:text-base font-semibold leading-relaxed bg-black/20 p-2.5 sm:p-3 rounded-2xl border border-white/20">
                🎶 {selectedLetter.nasheedVerse}
              </p>
            </div>
          </div>

          {/* Quick Voice Play Buttons */}
          <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
            <button
              onClick={() => playLetter(selectedLetter, false)}
              className="flex-1 md:flex-none bg-white text-slate-900 hover:bg-amber-100 px-4 py-2.5 sm:py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition"
            >
              <Volume2 size={18} className="text-rose-600" />
              <span>نطق الحرف</span>
            </button>

            <button
              onClick={() => playLetter(selectedLetter, true)}
              className="flex-1 md:flex-none bg-amber-400 text-slate-900 hover:bg-amber-300 px-4 py-2.5 sm:py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition"
            >
              <Music size={18} />
              <span>إنشاد بيت الحرف</span>
            </button>
          </div>
        </div>

        {/* Continuous Nasheed Control Dock */}
        <div className="mt-6 pt-5 border-t border-white/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleContinuous}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-lg transition-all ${
                isPlayingAll 
                  ? 'bg-rose-700 text-white hover:bg-rose-800 animate-pulse' 
                  : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              }`}
            >
              {isPlayingAll ? <Pause size={18} /> : <Play size={18} className="fill-current" />}
              <span>{isPlayingAll ? 'إيقاف نشيد الحروف' : 'تشغيل نشيد الحروف كاملاً 🎵'}</span>
            </button>

            <button
              onClick={() => {
                const nextIdx = (activeLetterIdx + 1) % ARABIC_ALPHABET.length;
                setActiveLetterIdx(nextIdx);
                playLetter(ARABIC_ALPHABET[nextIdx], true);
              }}
              className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition"
              title="الحرف التالي"
            >
              <SkipForward size={18} />
            </button>

            <button
              onClick={() => {
                const prevIdx = (activeLetterIdx - 1 + ARABIC_ALPHABET.length) % ARABIC_ALPHABET.length;
                setActiveLetterIdx(prevIdx);
                playLetter(ARABIC_ALPHABET[prevIdx], true);
              }}
              className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition"
              title="الحرف السابق"
            >
              <SkipBack size={18} />
            </button>
          </div>

          <span className="text-xs sm:text-sm font-bold text-amber-200">
            الحرف {activeLetterIdx + 1} من {ARABIC_ALPHABET.length}
          </span>
        </div>
      </div>

      {/* 28 Letters Grid - 2 columns on small screens, cheerful colors, 100% responsive */}
      <div className="bg-white rounded-3xl sm:rounded-[3rem] p-4 sm:p-8 border-4 border-rose-100 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-3xl font-black text-slate-800 flex items-center gap-2">
            <span>🚂 قطار الحروف الأبجدية</span>
          </h2>
          <span className="text-xs sm:text-sm font-bold text-slate-500">
            اضغط لسماع النطق والنشيد
          </span>
        </div>

        {/* 2-by-2 paired grid on mobile screens */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
          {ARABIC_ALPHABET.map((item, idx) => {
            const isSelected = selectedLetter.letter === item.letter;
            const isKaraokeActive = isPlayingAll && activeLetterIdx === idx;

            return (
              <motion.button
                key={item.letter}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveLetterIdx(idx);
                  playLetter(item, false);
                }}
                className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border-2 sm:border-4 flex flex-col items-center justify-between transition-all relative overflow-hidden shadow-xs min-h-[110px] sm:min-h-[130px] ${
                  isKaraokeActive
                    ? 'ring-4 ring-amber-400 bg-amber-500 text-white border-white scale-105 shadow-xl animate-pulse'
                    : isSelected
                    ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-300 text-rose-700'
                    : 'bg-slate-50/80 border-slate-200/90 text-slate-700 hover:bg-white hover:border-amber-300'
                }`}
              >
                <div className="w-full flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>{item.tashkeel.split(' - ')[0]}</span>
                  <span className="text-lg">{item.symbol}</span>
                </div>

                <div className="my-1">
                  <span className={`text-4xl sm:text-5xl font-black font-serif ${
                    isKaraokeActive ? 'text-white' : isSelected ? 'text-rose-600' : 'text-slate-800'
                  }`}>
                    {item.letter}
                  </span>
                </div>

                <div className="w-full text-center">
                  <span className={`text-xs sm:text-sm font-black truncate block ${
                    isKaraokeActive ? 'text-amber-100' : 'text-slate-700'
                  }`}>
                    {item.word}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
