import React, { useState, useEffect } from 'react';
import { playTTS } from '../lib/tts';
import { motion, AnimatePresence } from 'motion/react';
import { PlayCircle, CheckCircle2, ChevronRight, X, Volume2, Bot, Send, Award, ArrowRight, Check, Trophy, BookOpen, Zap, Headphones, MessageSquare, GraduationCap, Search, Mic, MicOff } from 'lucide-react';
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
      <div className="space-y-12 animate-in fade-in zoom-in duration-500">
        {/* Hero with stats summary */}
        <div className="bg-slate-900 rounded-[2.5rem] p-12 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2573&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent"></div>
          <div className="relative z-10 max-w-2xl text-white text-right md:text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-indigo-300 font-medium text-sm mb-6 backdrop-blur">
              <Bot size={16} /> تعليم ذكي متطور
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">مرحباً بك في <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">أكاديمية اللغة</span></h1>
            <p className="text-slate-300 text-xl font-medium leading-relaxed">المسار التعليمي الشامل لكل الأعمار والمستويات.</p>
          </div>
          
          <div className="relative z-10 flex gap-4">
            <button 
              onClick={() => setAppState('dashboard')}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2rem] text-center hover:bg-white/20 transition group"
            >
              <div className="text-indigo-400 font-black text-3xl mb-1">{Object.keys(progress).length}</div>
              <div className="text-white/60 text-xs font-bold uppercase tracking-widest">إنجاز</div>
              <Award className="mx-auto mt-2 text-indigo-400 group-hover:scale-125 transition" size={20} />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center flex-wrap">
          <div className="bg-white p-2 rounded-[2rem] border-2 border-slate-100 shadow-sm flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'الكل', icon: <Zap size={18} /> },
              { id: 'kids', label: 'الأطفال 👶', icon: <Trophy size={18} /> },
              { id: 'students', label: 'الطلاب 🎓', icon: <BookOpen size={18} /> },
              { id: 'professional', label: 'إنجليزي أعمال 💼', icon: <GraduationCap size={18} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all text-sm md:text-base ${
                  activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Direct Phrase Bank Access Button */}
          <motion.div
             whileHover={{ scale: 1.02, y: -4 }}
             onClick={() => setAppState('phrasebank')}
             className="relative rounded-[2.5rem] p-8 border-2 bg-gradient-to-br from-rose-500 to-pink-600 border-white/10 cursor-pointer overflow-hidden group shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/40 transition-all"></div>
            <div className="flex flex-col h-full relative z-10 text-white">
              <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-6 shadow-sm">
                <MessageSquare size={40} />
              </div>
              <h3 className="text-2xl font-black mb-2">بنك العبارات والطلاقة 🌍</h3>
              <p className="text-white/80 font-medium mb-6 leading-relaxed">أكثر من 1000 جملة وموقف يومي مرتبة بدقة لمساعدتك على التحدث بطلاقة.</p>
              <div className="mt-auto flex items-center gap-2 text-white font-bold">
                تصفح البنك الآن <ArrowRight size={20} />
              </div>
            </div>
          </motion.div>

          {filteredCurriculum.filter(l => l.category !== 'general').map((level, i) => {
            const stats = getLevelProgress(level);
            // Check unlocking based on index in ORIGINAL curriculum or just leave simplified for now
            const isUnlocked = true; // Simplified for demo/expansion

            return (
              <motion.div
                key={level.id}
                whileHover={isUnlocked ? { scale: 1.02, y: -4 } : {}}
                onClick={() => {
                  if (isUnlocked) {
                    setSelectedLevel(level);
                    setAppState('lessons');
                  }
                }}
                className={`relative rounded-[2.5rem] p-8 border-2 transition-all ${
                  isUnlocked 
                  ? 'bg-white border-slate-100 cursor-pointer hover:shadow-2xl hover:border-indigo-200' 
                  : 'bg-slate-50 border-slate-100 opacity-60 grayscale cursor-not-allowed'
                }`}
              >
                <div className="flex flex-col h-full">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${level.color} flex items-center justify-center mb-6 shadow-xl`}>
                    {level.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-black text-slate-800">{level.title}</h3>
                      {stats.percentage === 100 && (
                        <span className="bg-yellow-100 text-yellow-700 p-2 rounded-full shadow-sm"><Trophy size={20} /></span>
                      )}
                    </div>
                    <p className="text-slate-500 font-medium mb-6 leading-relaxed">{level.description}</p>
                    
                    <div className="space-y-3">
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${level.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${stats.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-slate-400">{stats.completed} / {stats.total} دروس</span>
                        <span className="text-indigo-600">{Math.round(stats.percentage)}% مكتمل</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* AI Tutor Card */}
          <motion.div
             whileHover={{ scale: 1.02, y: -4 }}
             onClick={() => setAppState('chat')}
             className="relative rounded-[2.5rem] p-8 border-2 bg-slate-900 border-slate-800 cursor-pointer overflow-hidden group shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/40 transition-all"></div>
            <div className="flex flex-col h-full relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center mb-6 shadow-xl text-white">
                <Bot size={40} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">المعلم الذكي AI</h3>
              <p className="text-slate-400 font-medium mb-6 leading-relaxed">تدرب على المحادثة في مواضيع حرة مع ذكاء اصطناعي متطور يصحح لك أخطاءك.</p>
              <div className="mt-auto flex items-center gap-2 text-indigo-400 font-bold">
                ابدأ المحادثة الآن <ArrowRight size={20} />
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

        <div className={`p-12 rounded-[3rem] bg-gradient-to-br ${selectedLevel.color} text-white shadow-2xl relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10 flex items-center gap-8">
            <div className="p-6 bg-white/20 rounded-[2rem] backdrop-blur-xl shadow-inner">{selectedLevel.icon}</div>
            <div>
              <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-black backdrop-blur-xl mb-4 inline-block tracking-wider uppercase">
                {selectedLevel.badge}
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">{selectedLevel.title}</h2>
            </div>
          </div>
          <p className="text-white/90 mt-8 text-xl max-w-2xl font-medium leading-relaxed">{selectedLevel.description}</p>
        </div>

        <div className="grid gap-5">
          {selectedLevel.lessons.map((lesson, idx) => {
            const isCompleted = progress[lesson.id];
            return (
              <motion.div 
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => startLessonSequence(lesson, selectedLevel)}
                className="bg-white p-6 rounded-3xl border-2 border-slate-50 flex items-center justify-between cursor-pointer hover:border-indigo-400 hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border-2 transition-all ${
                    isCompleted ? 'bg-green-100 border-green-500 text-green-600' : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-600'
                  }`}>
                    {isCompleted ? <Check size={28} strokeWidth={3} /> : idx + 1}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-xl group-hover:text-indigo-600 transition">{lesson.title}</h3>
                    <p className="text-slate-500 font-bold">{lesson.steps.length} أنشطة تفاعلية</p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <PlayCircle size={28} />
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
    playTTS(text, 'en-US');
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
    } catch (error) {
      console.error(error);
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

        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
           <div className="relative z-10">
             <h1 className="text-4xl md:text-5xl font-black mb-4">بنك المواقف اليومية الشامل 🌍</h1>
             <p className="text-slate-300 text-xl font-medium max-w-2xl leading-relaxed">أكثر من 1000 جملة وتعبير في 44 موقف حياتي مختلف، مرتبة لسهولة الحفظ والاستخدام في حياتك اليومية.</p>
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

                    <div className="space-y-4">
                      {filteredPhrases.map((phrase, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-10%" }}
                          className="group p-6 md:p-8 rounded-[2rem] bg-white border-2 border-slate-50 hover:border-indigo-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-xl hover:-translate-y-1"
                        >
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-4 mb-3">
                               <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight" dir="ltr">{phrase.eng}</span>
                               <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-sm font-bold" dir="ltr">{phrase.phonetic}</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                               <p className="text-xl md:text-2xl text-slate-600 font-bold">{phrase.ar}</p>
                            </div>
                          </div>
                          <button 
                             onClick={() => speak(phrase.eng)}
                             className="w-full md:w-16 md:h-16 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm font-black group-hover:scale-110"
                             title="استماع للنطق"
                          >
                            <Volume2 size={24} />
                            <span className="md:hidden mr-2">استماع للنطق</span>
                          </button>
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
    playTTS(text, 'en-US');
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
