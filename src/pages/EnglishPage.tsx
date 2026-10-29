import React, { useState, useEffect, useRef } from 'react';
import { playTTS } from '../lib/tts';
import { motion, AnimatePresence } from 'motion/react';
import { PlayCircle, CheckCircle2, ChevronRight, X, Volume2, Bot, Send, Award, ArrowRight, Check, Trophy, BookOpen, Zap, Headphones, MessageSquare, GraduationCap, Search, Mic, MicOff, Youtube, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { curriculum, Level, Lesson, InteractiveStep } from '../data/englishCurriculum';
import { phraseBank, Phrase } from '../data/englishPhrases';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const modelName = "gemini-3-flash-preview";

type AppState = 'levels' | 'lessons' | 'session' | 'chat' | 'phrasebank' | 'dashboard';

export default function EnglishPage() {
  const [appState, setAppState] = useState<AppState>('levels');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'kids' | 'students'>('all');
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [phraseSearch, setPhraseSearch] = useState('');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Chat state
  const [chatMessage, setChatMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'bot', text: 'Hello! I am your AI English tutor. How can I help you practice today?' }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('english_progress');
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  const saveProgress = (lessonId: string) => {
    const newProgress = { ...progress, [lessonId]: true };
    setProgress(newProgress);
    localStorage.setItem('english_progress', JSON.stringify(newProgress));
  };

  const getLevelProgress = (level: Level) => {
    const total = level.lessons.length;
    const completed = level.lessons.filter(l => progress[l.id]).length;
    return { total, completed, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const getTotalStats = () => {
    let totalLessons = 0;
    let completedLessons = 0;
    curriculum.forEach(level => {
      totalLessons += level.lessons.length;
      completedLessons += level.lessons.filter(l => progress[l.id]).length;
    });
    return { totalLessons, completedLessons, percentage: (completedLessons / totalLessons) * 100 };
  };

  const startLessonSequence = (lesson: Lesson, level: Level) => {
    if (level.id === 9 && lesson.id === "phrases_intro") {
      setAppState('phrasebank');
      return;
    }
    setSelectedLevel(level);
    setSelectedLesson(lesson);
    setAppState('session');
  };

  const renderDashboard = () => {
    const stats = getTotalStats();
    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        <button 
          onClick={() => setAppState('levels')}
          className="flex items-center gap-3 text-slate-500 hover:text-slate-800 font-bold transition-all"
        >
          <ArrowRight size={24} />
          العودة للمسار
        </button>

        <div className="bg-white rounded-[3rem] p-10 border-2 border-slate-100 shadow-xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-slate-900">تقرير الأداء الأسبوعي 📈</h2>
            <p className="text-slate-500 text-lg">أنت تقوم بعمل رائع واصل التقدم!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-indigo-50 p-8 rounded-[2rem] text-center border border-indigo-100">
              <div className="text-indigo-600 font-black text-5xl mb-2">{stats.completedLessons}</div>
              <div className="text-indigo-900 font-bold">دروس مكتملة</div>
            </div>
            <div className="bg-emerald-50 p-8 rounded-[2rem] text-center border border-emerald-100">
              <div className="text-emerald-600 font-black text-5xl mb-2">{Math.round(stats.percentage)}%</div>
              <div className="text-emerald-900 font-bold">نسبة التقدم الكلية</div>
            </div>
            <div className="bg-amber-50 p-8 rounded-[2rem] text-center border border-amber-100">
              <div className="text-amber-600 font-black text-5xl mb-2">{Object.keys(progress).length * 10}</div>
              <div className="text-amber-900 font-bold">نقاط الخبرة (XP)</div>
            </div>
          </div>

          <h3 className="text-2xl font-black text-slate-800 mb-6">الأوسمة والجوائز (Badges)</h3>
          <div className="flex flex-wrap gap-6">
            {curriculum.map(level => {
              const isEarned = getLevelProgress(level).percentage === 100;
              return (
                <div key={level.id} className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${isEarned ? 'bg-white border-amber-400 shadow-lg' : 'bg-slate-50 border-slate-100 opacity-30 grayscale'}`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${level.color}`}>
                    <Award size={32} />
                  </div>
                  <span className="font-bold text-sm text-slate-800">{level.badge}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderLevels = () => {
    const filteredCurriculum = curriculum.filter(level => 
      activeTab === 'all' ? true : 
      activeTab === 'daily' ? level.category === 'general' :
      activeTab === 'professional' ? level.category === 'students' && level.level_type === 'advanced' :
      level.category === activeTab
    );

    return (
      <div className="space-y-6 sm:space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Top Card 1: Hero with stats summary - Compact & Mobile Optimized */}
        <div className="bg-slate-900 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] p-4 sm:p-7 md:p-8 relative overflow-hidden shadow-xl flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2573&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
          
          <div className="relative z-10 w-full md:max-w-xl text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-300 font-bold text-xs mb-2.5 backdrop-blur">
              <Bot size={14} /> <span>تعليم ذكي متطور</span>
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black mb-2 text-white leading-snug">
              مرحباً بك في <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">أكاديمية اللغة</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base font-medium leading-relaxed">
              المسار التعليمي الشامل لكل الأعمار والمستويات من الصفر وحتى الطلاقة.
            </p>
          </div>
          
          <div className="relative z-10 w-full md:w-auto flex md:flex-col justify-end shrink-0">
            <button 
              onClick={() => setAppState('dashboard')}
              className="w-full md:w-auto bg-white/10 backdrop-blur-xl border border-white/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-center hover:bg-white/20 transition group flex md:flex-col items-center justify-between md:justify-center gap-2.5"
            >
              <div className="text-right md:text-center">
                <div className="text-indigo-400 font-black text-xl sm:text-2xl leading-none mb-1">{Object.keys(progress).length}</div>
                <div className="text-white/70 text-[10px] sm:text-xs font-bold uppercase tracking-wider">إنجاز دراسي</div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition">
                <Award size={18} />
              </div>
            </button>
          </div>
        </div>

        {/* Top Card 2: Highlighted Banner for YouTube Course - Compact & Mobile Optimized */}
        <motion.div
           whileHover={{ scale: 1.01, y: -2 }}
           onClick={() => window.open('https://www.youtube.com/@zAmericanEnglish', '_blank')}
           className="relative rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] p-4 sm:p-6 md:p-7 border-2 bg-gradient-to-br from-red-600 to-red-700 border-white/10 cursor-pointer overflow-hidden group shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sm:gap-6 text-white"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/20 transition-all pointer-events-none"></div>
          
          <div className="relative z-10 flex items-start sm:items-center gap-3 sm:gap-5 flex-1 min-w-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-md shrink-0">
              <Youtube className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-xl md:text-2xl font-black mb-1 sm:mb-1.5 leading-snug">
                كورس ZAmericanEnglish على يوتيوب 📺
              </h3>
              <p className="text-white/90 font-medium text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none">
                أشهر وأفضل قناة لتعلم اللغة الإنجليزية من الصفر حتى الاحتراف للأستاذ إبراهيم عادل. دروس وتطبيقات عملية متكاملة!
              </p>
            </div>
          </div>

          <div className="relative z-10 shrink-0">
            <div className="bg-white text-red-600 px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl sm:rounded-full font-black text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition shadow-md group-hover:shadow-lg group-hover:scale-105">
              <span>زيارة القناة</span>
              <ExternalLink size={16} />
            </div>
          </div>
        </motion.div>

        {/* Tab Switcher - Sleek & Mobile Friendly */}
        <div className="flex justify-center">
          <div className="bg-white p-1 sm:p-1.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap justify-center gap-1 sm:gap-1.5 w-full max-w-lg">
            {[
              { id: 'all', label: 'الكل', icon: <Zap size={15} /> },
              { id: 'kids', label: 'الأطفال 👶', icon: <Trophy size={15} /> },
              { id: 'students', label: 'الطلاب 🎓', icon: <BookOpen size={15} /> },
              { id: 'professional', label: 'إنجليزي أعمال 💼', icon: <GraduationCap size={15} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold transition-all text-xs sm:text-sm ${
                  activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Levels & Core Tools in 2-by-2 Paired Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-2.5 sm:gap-4 md:gap-6">
          {/* Direct Phrase Bank Access Button */}
          <motion.div
             whileHover={{ scale: 1.02, y: -3 }}
             onClick={() => setAppState('phrasebank')}
             className="relative rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-6 border-2 bg-gradient-to-br from-rose-500 to-pink-600 border-white/10 cursor-pointer overflow-hidden group shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-white/20 rounded-full blur-2xl -mr-14 -mt-14 group-hover:bg-white/30 transition-all pointer-events-none"></div>
            <div className="flex flex-col h-full relative z-10 text-white">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-2.5 sm:mb-4 shadow-xs">
                <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-base md:text-lg font-black mb-1 leading-snug">بنك العبارات والطلاقة 🌍</h3>
              <p className="text-white/80 text-[10px] sm:text-xs font-medium mb-3 sm:mb-4 leading-relaxed line-clamp-2">
                أكثر من 1000 جملة وموقف يومي مرتبة لمساعدتك على التحدث بطلاقة.
              </p>
              <div className="mt-auto flex items-center gap-1 text-white font-bold text-[10px] sm:text-xs">
                <span>تصفح البنك الآن</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </motion.div>

          {filteredCurriculum.filter(l => l.category !== 'general').map((level) => {
            const stats = getLevelProgress(level);
            const isUnlocked = true;

            return (
              <motion.div
                key={level.id}
                whileHover={isUnlocked ? { scale: 1.02, y: -3 } : {}}
                onClick={() => {
                  if (isUnlocked) {
                    setSelectedLevel(level);
                    setAppState('lessons');
                  }
                }}
                className={`relative rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-6 border-2 transition-all flex flex-col justify-between ${
                  isUnlocked 
                  ? 'bg-white border-slate-200/90 cursor-pointer hover:shadow-md hover:border-[#800020]/40' 
                  : 'bg-slate-50 border-slate-100 opacity-60 grayscale cursor-not-allowed'
                }`}
              >
                <div className="flex flex-col h-full">
                  <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center mb-2.5 sm:mb-4 shadow-sm text-white`}>
                    {level.icon}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1 gap-1">
                        <h3 className="text-xs sm:text-base md:text-lg font-black text-slate-800 truncate">{level.title}</h3>
                        {stats.percentage === 100 && (
                          <span className="bg-yellow-100 text-yellow-700 p-0.5 sm:p-1 rounded-full shadow-xs shrink-0"><Trophy size={13} /></span>
                        )}
                      </div>
                      <p className="text-slate-500 font-medium mb-2.5 sm:mb-4 text-[10px] sm:text-xs leading-relaxed line-clamp-2">{level.description}</p>
                    </div>
                    
                    <div className="space-y-1.5 mt-auto">
                      <div className="h-1.5 sm:h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${level.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${stats.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[9px] sm:text-[11px] font-bold">
                        <span className="text-slate-400">{stats.completed} / {stats.total} دروس</span>
                        <span className="text-indigo-600">{Math.round(stats.percentage)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* AI Tutor Card */}
          <motion.div
             whileHover={{ scale: 1.02, y: -3 }}
             onClick={() => setAppState('chat')}
             className="relative rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-6 border-2 bg-slate-900 border-slate-800 cursor-pointer overflow-hidden group shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/20 rounded-full blur-2xl -mr-14 -mt-14 group-hover:bg-indigo-500/30 transition-all pointer-events-none"></div>
            <div className="flex flex-col h-full relative z-10 text-white">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-indigo-600 flex items-center justify-center mb-2.5 sm:mb-4 shadow-sm text-white">
                <Bot className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-base md:text-lg font-black text-white mb-1 leading-snug">المعلم الذكي AI</h3>
              <p className="text-slate-400 font-medium mb-3 sm:mb-4 text-[10px] sm:text-xs leading-relaxed line-clamp-2">تدرب على المحادثة في مواضيع حرة مع ذكاء اصطناعي متطور يصحح لك أخطاءك.</p>
              <div className="mt-auto flex items-center gap-1 text-indigo-400 font-bold text-[10px] sm:text-xs">
                <span>ابدأ المحادثة الآن</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderLessons = () => {
    if (!selectedLevel) return null;
    return (
      <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-right duration-500">
        <button 
          onClick={() => setAppState('levels')}
          className="flex items-center gap-3 text-slate-500 hover:text-slate-800 font-bold transition-all hover:-translate-x-2"
        >
          <ArrowRight size={24} />
          العودة للمسار التعليمي
        </button>

        <div className={`p-4 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] bg-gradient-to-br ${selectedLevel.color} text-white shadow-xl relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          <div className="relative z-10 flex items-center gap-3 sm:gap-5">
            <div className="p-3 sm:p-4 bg-white/20 rounded-xl sm:rounded-2xl backdrop-blur-xl shadow-inner shrink-0">{selectedLevel.icon}</div>
            <div className="min-w-0 flex-1">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-black backdrop-blur-xl mb-1.5 inline-block tracking-wider uppercase">
                {selectedLevel.badge}
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight leading-snug">{selectedLevel.title}</h2>
            </div>
          </div>
          <p className="text-white/90 mt-3 sm:mt-5 text-xs sm:text-base max-w-2xl font-medium leading-relaxed">{selectedLevel.description}</p>
        </div>

        {/* Lessons List in 2-by-2 Paired Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-4 md:gap-5">
          {selectedLevel.lessons.map((lesson, idx) => {
            const isCompleted = progress[lesson.id];
            return (
              <motion.div 
                key={lesson.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 8) * 0.05 }}
                onClick={() => startLessonSequence(lesson, selectedLevel)}
                className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border-2 border-slate-100 flex flex-col justify-between cursor-pointer hover:border-indigo-400 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-2.5 sm:gap-4 mb-3">
                  <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-xs sm:text-base border-2 shrink-0 transition-all ${
                    isCompleted ? 'bg-green-100 border-green-500 text-green-600' : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-600'
                  }`}>
                    {isCompleted ? <Check size={18} strokeWidth={3} /> : idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-slate-800 text-xs sm:text-base group-hover:text-indigo-600 transition truncate">{lesson.title}</h3>
                    <p className="text-slate-400 font-bold text-[10px] sm:text-xs">{lesson.steps.length} أنشطة تفاعلية</p>
                  </div>
                </div>
                <div className="flex justify-end pt-2 border-t border-slate-50">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xs">
                    <PlayCircle size={18} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // (PhraseBank and Chat Info render helpers remain similar, just ensuring AppState mapping)

  return (
    <div className="max-w-7xl mx-auto pb-24 h-full px-4">
      <audio ref={audioRef} playsInline />
      {appState === 'levels' && renderLevels()}
      {appState === 'lessons' && renderLessons()}
      {appState === 'phrasebank' && renderPhraseBank()}
      {appState === 'dashboard' && renderDashboard()}
      {appState === 'session' && selectedLesson && selectedLevel && (
        <LessonSession 
          lesson={selectedLesson} 
          level={selectedLevel}
          onClose={() => setAppState('lessons')}
          onComplete={() => {
            saveProgress(selectedLesson.id);
            confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
            
            // Auto transition to next lesson if available
            const currentLessonIdx = selectedLevel.lessons.findIndex(l => l.id === selectedLesson.id);
            if (currentLessonIdx !== -1 && currentLessonIdx < selectedLevel.lessons.length - 1) {
              const nextLesson = selectedLevel.lessons[currentLessonIdx + 1];
              // Small delay to allow confetti and feeling of completion
              setTimeout(() => {
                setSelectedLesson(nextLesson);
                setAppState('session');
              }, 2000);
            } else {
              setAppState('lessons');
            }
          }}
        />
      )}
      {appState === 'chat' && renderChatInfo()}
    </div>
  );

  function speak(text: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    playTTS(text, 'en-US', { rate: 0.94 });
  }

  async function handleChat(e?: React.FormEvent, manualMessage?: string) {
    if (e) e.preventDefault();
    const finalMsg = manualMessage || chatMessage.trim();
    if (!finalMsg) return;
    
    setChatHistory(prev => [...prev, { role: 'user', text: finalMsg }]);
    setChatMessage('');

    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: finalMsg,
        config: {
          systemInstruction: "You are a helpful and encouraging English tutoring partner. Keep your responses simple, educational, and suitable for English learners. Responses should be in English."
        }
      });
      const botText = response.text || "Sorry, I couldn't generate a response.";
      setChatHistory(prev => [...prev, { role: 'bot', text: botText }]);
      speak(botText);
    } catch (error: any) {
      console.warn("Chat error:", error?.message || String(error));
      setChatHistory(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting right now." }]);
    }
  }

  async function toggleListening() {
    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (err) {
      console.error('Microphone permission denied', err);
      alert('الرجاء السماح بصلاحية الميكروفون من إعدادات المتصفح أو التطبيق.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('متصفحك لا يدعم التعرف على الصوت. الرجاء استخدام Chrome أو Safari الحديث.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setChatMessage(transcript);
      handleChat(undefined, transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        alert('لقد تم رفض صلاحية الميكروفون. يرجى تفعيلها من إعدادات النظام للتطبيق.');
      } else if (event.error === 'no-speech') {
        /* User didn't speak, ignore or alert mildly */
      } else {
        alert('حدث خطأ في النظام الصوتي، الرجاء المحاولة مرة أخرى.');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };


  function renderPhraseBank() {
    const scrollToCategory = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    return (
      <div className="space-y-10 animate-in fade-in duration-500 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <button 
            onClick={() => setAppState('levels')}
            className="flex items-center gap-3 text-slate-500 hover:text-slate-800 font-black transition-all"
          >
            <ArrowRight size={24} />
            العودة للمسار التعليمي
          </button>
          
          <div className="relative w-full md:w-96">
             <input 
               type="text" 
               placeholder="ابحث عن جملة أو موقف..." 
               value={phraseSearch}
               onChange={(e) => setPhraseSearch(e.target.value)}
               className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm transition-all"
             />
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] p-4 sm:p-7 md:p-8 text-white shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
           <div className="relative z-10">
             <h1 className="text-xl sm:text-3xl md:text-4xl font-black mb-2 leading-snug">بنك المواقف اليومية الشامل 🌍</h1>
             <p className="text-slate-300 text-xs sm:text-sm md:text-base font-medium max-w-2xl leading-relaxed">أكثر من 1000 جملة وتعبير في 44 موقف حياتي مختلف، مرتبة لسهولة الحفظ والاستخدام في حياتك اليومية.</p>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
           {/* Sticky Sidebar Navigation */}
           <div className="lg:w-80 shrink-0 sticky top-4 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar bg-white/70 backdrop-blur shadow-sm p-4 rounded-[2.5rem] border border-slate-100 hidden lg:block">
              <h3 className="text-slate-400 font-black text-xs uppercase tracking-widest mb-4 px-4">أقسام المواقف</h3>
              {phraseBank.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => scrollToCategory(`cat-${i}`)}
                  className="w-full p-4 rounded-2xl text-right flex items-center gap-4 font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all mb-1 group"
                >
                  <span className="text-xl group-hover:scale-125 transition-transform">{cat.icon}</span>
                  <span className="flex-1 text-sm">{cat.title}</span>
                </button>
              ))}
           </div>

           {/* Main Phrases Stream */}
           <div className="flex-1 space-y-16">
              {phraseBank.map((category, catIdx) => {
                const filteredPhrases = category.phrases.filter(p => 
                  p.eng.toLowerCase().includes(phraseSearch.toLowerCase()) || 
                  p.ar.includes(phraseSearch)
                );

                if (phraseSearch && filteredPhrases.length === 0) return null;

                return (
                  <div key={catIdx} id={`cat-${catIdx}`} className="scroll-mt-6">
                    <div className="flex items-center gap-4 mb-8 bg-white/50 p-6 rounded-[2rem] border border-slate-100 shadow-sm backdrop-blur">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-slate-100">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-slate-800">{category.title}</h3>
                        <p className="text-indigo-500 font-bold">{category.phrases.length} جملة وموقف</p>
                      </div>
                    </div>

                    {/* Phrases in 2-by-2 Paired Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-4">
                      {filteredPhrases.map((phrase, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-10%" }}
                          className="group p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border-2 border-slate-100 hover:border-indigo-300 transition-all flex flex-col justify-between gap-3 shadow-xs hover:shadow-md"
                        >
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                               <span className="text-xs sm:text-lg font-black text-slate-900 tracking-tight leading-tight" dir="ltr">{phrase.eng}</span>
                               <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] sm:text-xs font-bold" dir="ltr">{phrase.phonetic}</span>
                            </div>
                            <div className="flex items-start gap-1.5">
                               <div className="w-1 h-4 bg-indigo-500 rounded-full mt-1 shrink-0"></div>
                               <p className="text-[11px] sm:text-sm text-slate-600 font-bold leading-relaxed">{phrase.ar}</p>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-slate-50 flex justify-end">
                            <button 
                               onClick={() => speak(phrase.eng)}
                               className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all shadow-xs"
                               title="استماع للنطق"
                            >
                              <Volume2 size={14} />
                              <span className="text-[10px] sm:text-xs">استماع</span>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      </div>
    );
  }

  function renderChatInfo() {
    return (
      <div className="animate-in fade-in duration-500 h-full flex flex-col">
        <button 
          onClick={() => setAppState('levels')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold transition mb-6"
        >
          <ArrowRight size={20} />
          العودة للمستويات
        </button>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row flex-1 min-h-[600px]">
          <div className="bg-slate-900 text-white p-10 md:w-1/3 flex flex-col justify-center relative overflow-hidden shrink-0">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
            <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 backdrop-blur relative z-10">
              <Bot size={32} />
            </div>
            <h2 className="text-3xl font-black mb-4 relative z-10">المعلم الذكي<br/>(AI Tutor)</h2>
            <p className="text-slate-400 leading-relaxed font-medium relative z-10">
              اختبر ما تعلمته! راجع المحادثات وتدرب على الإنتاج اللغوي. هنا لا توجد إجابات خاطئة، فقط تعلم وتطور.
            </p>
          </div>

          <div className="flex-1 bg-slate-50 flex flex-col h-full items-stretch shrink-0">
            <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col gap-5" dir="ltr">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm text-[15px] font-medium leading-relaxed relative group/msg ${
                    msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-sm' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                  }`}>
                    <p>{msg.text}</p>
                    {msg.role === 'bot' && (
                      <button 
                        onClick={() => speak(msg.text)}
                        className="absolute -right-10 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-indigo-600 opacity-0 group-hover/msg:opacity-100 transition-all"
                      >
                        <Volume2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 md:p-6 bg-white border-t border-slate-200 shrink-0">
              <form onSubmit={handleChat} className="flex gap-3" dir="ltr">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message in English here..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isListening 
                      ? 'bg-rose-500 text-white animate-pulse' 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                </div>
                <button type="submit" className="bg-indigo-600 text-white rounded-2xl px-6 py-4 hover:bg-indigo-700 transition flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Send size={20} className="ml-1" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


// ----------------------------------------------------------------------------
// Session Component (Runs the interactive lesson steps)
// ----------------------------------------------------------------------------
function LessonSession({ lesson, level, onClose, onComplete }: { 
  lesson: Lesson, 
  level: Level,
  onClose: () => void, 
  onComplete: () => void 
}) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'idle'|'correct'|'wrong'>('idle');
  const [isListening, setIsListening] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const step = lesson.steps[currentStepIdx];
  const progressPercent = ((currentStepIdx) / lesson.steps.length) * 100;

  async function toggleListening() {
    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (err) {
      console.error('Microphone permission denied', err);
      alert('الرجاء السماح بصلاحية الميكروفون من إعدادات المتصفح أو التطبيق.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('متصفحك لا يدعم التعرف على الصوت. الرجاء استخدام Chrome أو Safari الحديث.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setUserAnswer(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        alert('لقد تم رفض صلاحية الميكروفون. يرجى تفعيلها من إعدادات النظام للتطبيق.');
      } else if (event.error === 'no-speech') {
        /* ignore */
      } else {
        alert('حدث خطأ في النظام الصوتي، الرجاء المحاولة مرة أخرى.');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    playTTS(text, 'en-US', { rate: 0.94 });
  };

  const handleNext = () => {
    if (currentStepIdx < lesson.steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
      setUserAnswer('');
      setFeedback('idle');
    } else {
      onComplete();
    }
  };

  const checkAnswerChoice = (choice: string) => {
    if (feedback !== 'idle') return;
    if (choice.toLowerCase().trim() === step.correctAnswer?.toLowerCase().trim()) {
      setFeedback('correct');
      setTimeout(handleNext, 1500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback('idle'), 1500);
    }
  };

  const checkWriting = () => {
    if (!userAnswer.trim()) return;
    if (userAnswer.trim().toLowerCase() === step.correctAnswer?.toLowerCase().trim()) {
      setFeedback('correct');
      setTimeout(handleNext, 1500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback('idle'), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col animate-in slide-in-from-bottom-8 duration-300">
      <audio ref={audioRef} playsInline />
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
          <X size={20} />
        </button>
        <div className="flex-1 max-w-md mx-6">
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${level.color} transition-all duration-500`} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <div className="font-black text-slate-800 text-lg">{currentStepIdx + 1} / {lesson.steps.length}</div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentStepIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl border border-slate-100"
          >
            {/* Info Step */}
            {step.type === 'info' && (
              <div className="text-center space-y-10">
                <div className="inline-flex items-center justify-center w-28 h-28 bg-indigo-50 text-indigo-600 rounded-[2rem] cursor-pointer hover:bg-indigo-600 hover:text-white hover:scale-110 transition-all shadow-sm" onClick={() => speak(step.eng!)}>
                  <Volume2 size={48} />
                </div>
                <div>
                  <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-6 tracking-tight" dir="ltr">{step.eng}</h1>
                  <p className="text-3xl md:text-4xl text-slate-600 font-bold mb-4">{step.ar}</p>
                  {step.phonetic && <p className="text-indigo-500 font-black text-xl bg-indigo-50 inline-block px-6 py-2 rounded-full ring-2 ring-indigo-100">{step.phonetic}</p>}
                </div>
              </div>
            )}

            {/* Multiple Choice Step */}
            {step.type === 'multiple_choice' && (
              <div className="space-y-12">
                <h2 className="text-4xl font-black text-slate-800 text-center leading-tight">
                  {step.questionText}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {step.options?.map((opt, i) => (
                    <button 
                      key={i}
                      onClick={() => checkAnswerChoice(opt)}
                      className={`p-8 rounded-[2rem] border-3 text-2xl font-black transition-all ${
                        feedback === 'idle' 
                        ? 'border-slate-100 hover:border-indigo-400 bg-slate-50/50 hover:bg-white hover:shadow-xl' 
                        : (opt === step.correctAnswer && feedback === 'correct')
                          ? 'border-green-500 bg-green-50 text-green-700 scale-105'
                          : 'border-slate-100 opacity-50 bg-slate-50 grayscale'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Writing Step */}
            {step.type === 'writing' && (
              <div className="space-y-12">
                <h2 className="text-4xl font-black text-slate-800 text-center leading-tight">
                  {step.questionText}
                </h2>
                <div className="flex flex-col gap-6">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && checkWriting()}
                      placeholder="اكتب الإجابة هنا..."
                      readOnly={feedback === 'correct'}
                      dir="ltr"
                      className={`w-full p-8 pr-28 text-4xl border-4 rounded-[2rem] focus:outline-none focus:ring-8 font-black text-center transition-all ${
                        feedback === 'wrong' ? 'border-red-400 focus:ring-red-100 text-red-600 animate-shake' :
                        feedback === 'correct' ? 'border-green-500 bg-green-50 text-green-700' :
                        'border-slate-100 focus:border-indigo-500 focus:ring-indigo-50/50 text-slate-800 bg-slate-50'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={toggleListening}
                      disabled={feedback === 'correct'}
                      className={`absolute right-6 top-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                        isListening 
                        ? 'bg-rose-500 text-white animate-pulse' 
                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      } ${feedback === 'correct' ? 'opacity-0' : ''}`}
                    >
                      {isListening ? <MicOff size={28} /> : <Mic size={28} />}
                    </button>
                  </div>
                  {feedback === 'idle' && (
                    <button 
                      onClick={checkWriting}
                      className="w-full p-6 rounded-2xl bg-indigo-600 text-white font-black text-2xl hover:bg-indigo-700 hover:shadow-xl transition-all active:scale-95"
                    >
                      تحقق من الإجابة
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Bar (Feedback & Continue) */}
      <div className={`border-t-4 p-8 flex justify-between items-center transition-all duration-500 shrink-0 ${
        feedback === 'correct' ? 'bg-green-100 border-green-200' : 
        feedback === 'wrong' ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'
      }`}>
        <div className="flex-1">
          {feedback === 'correct' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 text-green-700 text-2xl font-black">
              <div className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle2 size={32} />
              </div>
              أحسنت! إجابة صحيحة واصل التقدم.
            </motion.div>
          )}
          {feedback === 'wrong' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-red-600 text-2xl font-black flex items-center gap-4">
               <div className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg">
                <X size={32} />
              </div>
              إجابة خاطئة، حاول مرة أخرى بتركيز!
            </motion.div>
          )}
        </div>
        
        <button 
          onClick={handleNext}
          disabled={step.type !== 'info' && feedback !== 'correct'}
          className={`px-12 py-6 rounded-[2rem] font-black text-2xl transition-all shadow-xl ${
            (step.type === 'info' || feedback === 'correct')
            ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 active:scale-95'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed grayscale'
          }`}
        >
          {currentStepIdx === lesson.steps.length - 1 ? 'إنهاء الدرس' : 'متابعة الدرس'}
        </button>
      </div>
    </div>
  );
}
