import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, CheckCircle2, Sparkles, Heart, Star, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { KIDS_AZKAR_MANNERS, KidManner } from '../../data/kidsIslamicData';
import { kidsSound } from '../../lib/kidsSoundFX';
import { speakArabicText } from '../../lib/tts';

interface KidsMannersAzkarProps {
  onAddXP: (amount: number) => void;
}

export const KidsMannersAzkar: React.FC<KidsMannersAzkarProps> = ({ onAddXP }) => {
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kids_manners_done');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [filter, setFilter] = useState<'الكل' | 'أذكار' | 'آداب' | 'أخلاق'>('الكل');

  const speakDhikr = (manner: KidManner) => {
    kidsSound.playStoryChime();
    speakArabicText(`${manner.title} .. ${manner.dhikrText}`);
  };

  const handleToggleComplete = (manner: KidManner) => {
    const isDone = completedIds.includes(manner.id);
    let nextList: string[];
    if (isDone) {
      nextList = completedIds.filter(id => id !== manner.id);
    } else {
      nextList = [...completedIds, manner.id];
      kidsSound.playSuccess();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.65 } });
      onAddXP(manner.rewardPoints);
    }
    setCompletedIds(nextList);
    try {
      localStorage.setItem('kids_manners_done', JSON.stringify(nextList));
    } catch {}
  };

  const filteredManners = filter === 'الكل' 
    ? KIDS_AZKAR_MANNERS 
    : KIDS_AZKAR_MANNERS.filter(m => m.category === filter);

  return (
    <div className="space-y-6 sm:space-y-8" dir="rtl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 flex-1 text-center md:text-right">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold mb-3">
            <Sparkles size={14} className="text-amber-300" />
            <span>شريعة الأخلاق والمحبة</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black mb-2">
            آداب وأذكار البطل المسلم 🌟
          </h2>
          <p className="text-emerald-100 text-xs sm:text-base font-medium">
            تعلم أذكار يومك وآداب الإسلام واجمع نجوم المكافأة عند تطبيقها!
          </p>
        </div>

        {/* Progress tracker */}
        <div className="bg-white/15 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/25 text-center shrink-0 w-full sm:w-auto">
          <div className="text-3xl sm:text-4xl font-black text-amber-300 mb-1">
            {completedIds.length} / {KIDS_AZKAR_MANNERS.length}
          </div>
          <div className="text-xs sm:text-sm font-bold text-emerald-100">سلوكيات مطبقة اليوم</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['الكل', 'أذكار', 'آداب', 'أخلاق'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              filter === tab
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 2-by-2 Grid for Manners & Azkar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {filteredManners.map(manner => {
          const isDone = completedIds.includes(manner.id);

          return (
            <motion.div
              key={manner.id}
              whileHover={{ scale: 1.01 }}
              className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 sm:border-4 transition-all flex flex-col justify-between ${
                isDone
                  ? 'bg-emerald-50/80 border-emerald-300 shadow-sm'
                  : 'bg-white border-slate-100 shadow-xs hover:border-emerald-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl sm:text-4xl">{manner.icon}</span>
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {manner.category}
                      </span>
                      <h3 className="text-sm sm:text-lg font-black text-slate-900 mt-0.5">
                        {manner.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => speakDhikr(manner)}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition"
                    title="استمع للذكر"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>

                {/* Dhikr Arabic Text Box */}
                <div className="bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 mb-3 text-right">
                  <p className="text-xs sm:text-base font-bold text-slate-800 leading-relaxed font-serif">
                    « {manner.dhikrText} »
                  </p>
                </div>

                <p className="text-[11px] sm:text-xs font-medium text-slate-500 leading-relaxed mb-4">
                  {manner.meaning}
                </p>
              </div>

              {/* Action Checkbox Button */}
              <button
                onClick={() => handleToggleComplete(manner)}
                className={`w-full py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
                  isDone
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200'
                }`}
              >
                <CheckCircle2 size={16} className={isDone ? 'text-amber-300' : 'text-slate-400'} />
                <span>{isDone ? 'أحسنت! طُبقت اليوم (+XP)' : 'حفظت وطبقت هذا الأدب'}</span>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
