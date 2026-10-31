import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, HelpCircle, CheckCircle2, XCircle, RotateCcw, Star, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { KIDS_QUIZ_QUESTIONS, KidQuizQuestion } from '../../data/kidsIslamicData';
import { kidsSound } from '../../lib/kidsSoundFX';

interface KidsQuizGameProps {
  onAddXP: (amount: number) => void;
}

export const KidsQuizGame: React.FC<KidsQuizGameProps> = ({ onAddXP }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const question = KIDS_QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === question.correctAnswer;
    if (isCorrect) {
      kidsSound.playSuccess();
      setScore(prev => prev + 1);
      onAddXP(25);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else {
      kidsSound.playTryAgain();
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < KIDS_QUIZ_QUESTIONS.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      kidsSound.playSuccess();
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
      onAddXP(50);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8" dir="rtl">
      {/* Quiz Top Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 text-white shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl sm:text-3xl">
            🏆
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">مسابقة البطل المسلم الذكي</h2>
            <p className="text-amber-100 text-xs sm:text-sm font-semibold">
              السؤال {currentIdx + 1} من {KIDS_QUIZ_QUESTIONS.length}
            </p>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl text-center">
          <div className="text-lg sm:text-2xl font-black text-amber-200">
            {score} ⭐
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-white">النقاط الحالية</div>
        </div>
      </div>

      {/* Progress Bar for 50 questions */}
      <div className="w-full bg-slate-200/80 rounded-full h-3 overflow-hidden shadow-inner p-0.5 border border-slate-100">
        <div 
          className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 h-full rounded-full transition-all duration-300 shadow-xs"
          style={{ width: `${((currentIdx + 1) / KIDS_QUIZ_QUESTIONS.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 border-4 border-amber-100 shadow-xl"
          >
            {/* Question Text */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                {question.category}
              </span>
              <span className="text-2xl">{question.icon}</span>
            </div>

            <h3 className="text-base sm:text-2xl font-black text-slate-800 leading-snug mb-6">
              {question.question}
            </h3>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {question.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === question.correctAnswer;

                let optClass = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-amber-400';
                if (isAnswered) {
                  if (isCorrect) {
                    optClass = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-black shadow-sm';
                  } else if (isSelected && !isCorrect) {
                    optClass = 'bg-rose-100 border-rose-300 text-rose-900 font-bold';
                  } else {
                    optClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 sm:p-5 rounded-2xl border-2 sm:border-4 text-xs sm:text-base font-bold text-right transition-all flex items-center justify-between ${optClass}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="text-emerald-600" size={20} />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="text-rose-500" size={20} />}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-slate-800 text-xs sm:text-sm font-semibold mb-6 flex items-start gap-2"
              >
                <Sparkles size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <span>{question.explanation}</span>
              </motion.div>
            )}

            {/* Next Question Button */}
            {isAnswered && (
              <motion.button
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                onClick={handleNext}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-3.5 sm:py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition"
              >
                <span>{currentIdx + 1 === KIDS_QUIZ_QUESTIONS.length ? 'عرض النتيجة النهائية 🌟' : 'السؤال التالي'}</span>
                <ArrowRight size={18} />
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 border-4 border-amber-200 shadow-2xl text-center space-y-6"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-4xl sm:text-5xl shadow-inner animate-bounce">
              👑
            </div>

            <div>
              <h3 className="text-2xl sm:text-4xl font-black text-slate-900 mb-2">
                مبارك يا بطل! أنهيت المسابقة 🎉
              </h3>
              <p className="text-slate-600 text-sm sm:text-base font-semibold">
                لقد أجبت بشكل صحيح على <span className="font-black text-amber-600 text-xl">{score}</span> من أصل <span className="font-bold">{KIDS_QUIZ_QUESTIONS.length}</span> سؤالاً.
              </p>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 sm:p-6 border border-amber-200 max-w-sm mx-auto">
              <div className="text-amber-800 font-black text-lg sm:text-xl mb-1">
                {score >= 40
                  ? '🌟 ممتاز جداً! أنت بطل المعرفة الإسلامية الخارق'
                  : score >= 25
                  ? '✨ أحسنت عملاً رائعاً ومحاولة مباركة يا بطل!'
                  : '👍 بداية طيبة! استمع للقصص وجرب مرة أخرى'}
              </div>
              <div className="text-xs sm:text-sm font-bold text-amber-700">
                +100 نقطة XP أضيفت لرصيدك
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 px-8 rounded-2xl shadow-lg inline-flex items-center gap-2 transition"
            >
              <RotateCcw size={18} />
              <span>إعادة المسابقة من جديد</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
