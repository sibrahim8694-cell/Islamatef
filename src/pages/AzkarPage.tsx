import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, CheckCircle2, RotateCcw } from 'lucide-react';
import { AZKAR } from '../lib/azkarData';

export default function AzkarPage() {
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning');
  const [progress, setProgress] = useState<Record<string, number>>({});

  const azkarList = activeTab === 'morning' ? AZKAR.morning : AZKAR.evening;

  const handleZikrClick = (index: number, requiredCount: number) => {
    const key = `${activeTab}-${index}`;
    const current = progress[key] || 0;
    if (current < requiredCount) {
      setProgress({ ...progress, [key]: current + 1 });
    }
  };

  const resetProgress = () => {
    const newProgress = { ...progress };
    azkarList.forEach((_, index) => {
      delete newProgress[`${activeTab}-${index}`];
    });
    setProgress(newProgress);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[2rem] bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-900 shadow-xl p-4 sm:p-7 md:p-8 text-center md:text-right">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, rgba(255,255,255,0.2) 2px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[10px] sm:text-xs font-bold mb-2 sm:mb-2.5">
              حصن المسلم اليومي
            </span>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-snug mb-1.5 sm:mb-2 tracking-tight">
              أذكار الصباح <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">والمساء</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-indigo-200/80 leading-relaxed font-medium">
              ألا بذكر الله تطمئن القلوب · اضغط على أي بطاقة لتسجيل القراءة ومتابعة الورد اليومي.
            </p>
          </div>

          {/* Quick Progress Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 px-5 py-3.5 rounded-2xl flex items-center gap-3 text-white">
            <div className="text-center">
              <span className="text-2xl font-black font-mono text-amber-300 tabular-nums">
                {azkarList.filter((_, i) => (progress[`${activeTab}-${i}`] || 0) >= azkarList[i].count).length}
              </span>
              <span className="text-slate-400 text-sm"> / {azkarList.length}</span>
              <p className="text-[10px] text-slate-300 font-bold">الأذكار المكتملة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl sm:rounded-3xl relative z-10 w-full max-w-md mx-auto border border-slate-200">
        <button
          onClick={() => setActiveTab('morning')}
          className={`flex-1 py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 font-bold text-xs sm:text-base transition-all ${
            activeTab === 'morning'
              ? 'bg-[#800020] text-white shadow-sm'
              : 'text-slate-600 hover:text-[#800020]'
          }`}
        >
          <Sun size={18} />
          أذكار الصباح
        </button>
        <button
          onClick={() => setActiveTab('evening')}
          className={`flex-1 py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 font-bold text-xs sm:text-base transition-all ${
            activeTab === 'evening'
              ? 'bg-[#800020] text-white shadow-sm'
              : 'text-slate-600 hover:text-[#800020]'
          }`}
        >
          <Moon size={18} />
          أذكار المساء
        </button>
      </div>

      {/* Control */}
      <div className="flex justify-end px-4">
        <button 
          onClick={resetProgress}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition"
        >
          <RotateCcw size={18} />
          تصفير العداد
        </button>
      </div>

      {/* Azkar Grid: 2-by-2 paired layout */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-4 md:gap-6">
        {azkarList.map((zikr, index) => {
          const key = `${activeTab}-${index}`;
          const currentCount = progress[key] || 0;
          const isDone = currentCount >= zikr.count;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index % 10) * 0.04 }}
              onClick={() => handleZikrClick(index, zikr.count)}
              className={`relative overflow-hidden cursor-pointer select-none rounded-2xl md:rounded-[2rem] p-3 sm:p-5 md:p-6 border-2 transition-all duration-200 touch-press flex flex-col justify-between ${
                isDone 
                ? 'bg-emerald-50/70 border-emerald-400 shadow-xs' 
                : 'bg-white border-slate-200 hover:border-[#800020]/40 shadow-xs active:bg-slate-50'
              }`}
            >
              {isDone && (
                <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4">
                   <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                     <CheckCircle2 size={16} />
                   </div>
                </div>
              )}
              
              <div className="flex flex-col gap-3 items-center text-center flex-1 justify-between">
                <p className={`text-xs sm:text-base md:text-lg leading-relaxed sm:leading-[1.8] font-medium pt-1 ${isDone ? 'text-emerald-900' : 'text-slate-800'}`}>
                  {zikr.text}
                </p>
                
                <div className="flex items-center justify-center pt-2 w-full">
                  <div className={`w-full py-1.5 sm:py-2.5 px-3 rounded-xl sm:rounded-2xl font-black text-xs sm:text-base transition-colors text-center shadow-inner ${
                    isDone 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-rose-50 text-[#800020] border border-rose-200/50'
                  }`}>
                    {isDone ? 'تم الإكمال ✓' : `${currentCount} / ${zikr.count}`}
                  </div>
                </div>
              </div>
              
              {!isDone && (
                <div 
                  className="absolute bottom-0 left-0 h-1 bg-[#800020] transition-all duration-300" 
                  style={{ width: `${(currentCount / zikr.count) * 100}%` }} 
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
