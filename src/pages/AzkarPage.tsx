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
      <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-950 border border-indigo-900 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-indigo-950/90 to-transparent"></div>
        
        <div className="relative p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl text-center md:text-right">
            <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.3] mb-4 tracking-tight">
              أذكار الصباح <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">والمساء</span>
            </h1>
            <p className="text-lg text-indigo-200/80 leading-relaxed font-medium">
              حصن المسلم اليومي ومفتاح الطمأنينة والسكينة.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-2 rounded-3xl relative z-10 w-full max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('morning')}
          className={`flex-1 py-4 px-6 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all ${
            activeTab === 'morning'
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sun size={24} />
          أذكار الصباح
        </button>
        <button
          onClick={() => setActiveTab('evening')}
          className={`flex-1 py-4 px-6 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all ${
            activeTab === 'evening'
              ? 'bg-slate-800 text-indigo-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Moon size={24} />
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

      {/* Azkar List */}
      <div className="space-y-6">
        {azkarList.map((zikr, index) => {
          const key = `${activeTab}-${index}`;
          const currentCount = progress[key] || 0;
          const isDone = currentCount >= zikr.count;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleZikrClick(index, zikr.count)}
              className={`relative overflow-hidden cursor-pointer select-none rounded-[2rem] p-6 md:p-8 border-2 transition-all duration-300 ${
                isDone 
                ? 'bg-emerald-50/50 border-emerald-200' 
                : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md'
              }`}
            >
              {isDone && (
                <div className="absolute top-0 right-0 p-4">
                   <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                     <CheckCircle2 size={24} />
                   </div>
                </div>
              )}
              
              <div className="flex flex-col gap-6 items-center text-center">
                <p className={`text-xl md:text-2xl leading-relaxed md:leading-[1.8] font-medium ${isDone ? 'text-emerald-800' : 'text-slate-800'}`}>
                  {zikr.text}
                </p>
                
                <div className="flex items-center justify-center gap-4">
                  <div className={`px-6 py-3 rounded-2xl font-black text-2xl transition-colors min-w-[120px] text-center shadow-inner ${
                    isDone 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {currentCount} / {zikr.count}
                  </div>
                </div>
              </div>
              
              {!isDone && (
                <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-300" style={{ width: `${(currentCount / zikr.count) * 100}%` }} />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
