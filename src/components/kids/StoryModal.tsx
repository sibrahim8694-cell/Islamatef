import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  X, Volume2, Pause, Play, RotateCcw, SkipForward, SkipBack, 
  Sparkles, CheckCircle2, Star, Music, Award, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { kidsSound } from '../../lib/kidsSoundFX';
import { ProphetStory, QuranAnimalStory } from '../../data/kidsIslamicData';
import { narrateSentence, stopTTS } from '../../lib/tts';

interface StoryModalProps {
  story: ProphetStory | QuranAnimalStory | null;
  storyType: 'prophet' | 'animal';
  onClose: () => void;
  onComplete: (xp: number) => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({
  story,
  storyType,
  onClose,
  onComplete
}) => {
  if (!story) return null;

  const [currentSentenceIdx, setCurrentSentenceIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speechRate, setSpeechRate] = useState<number>(0.92);
  const [ambientActive, setAmbientActive] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);

  const sentenceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isCancelledRef = useRef<boolean>(false);
  const isPlayingRef = useRef<boolean>(true);
  isPlayingRef.current = isPlaying;
  const cancelNarrateRef = useRef<(() => void) | null>(null);

  const isProphet = storyType === 'prophet';
  const prophetStory = isProphet ? (story as ProphetStory) : null;
  const animalStory = !isProphet ? (story as QuranAnimalStory) : null;

  // Cleanup on unmount or story close + auto start storytelling
  useEffect(() => {
    isCancelledRef.current = false;
    isPlayingRef.current = true;
    setIsPlaying(true);
    setCurrentSentenceIdx(0);
    kidsSound.playStoryChime();

    // Auto-narrate the story immediately upon opening with a gentle delay
    const startTimer = setTimeout(() => {
      if (!isCancelledRef.current && isPlayingRef.current) {
        speakSentence(0);
      }
    }, 450);

    return () => {
      isCancelledRef.current = true;
      isPlayingRef.current = false;
      clearTimeout(startTimer);
      if (cancelNarrateRef.current) {
        cancelNarrateRef.current();
        cancelNarrateRef.current = null;
      }
      stopTTS();
      kidsSound.toggleStoryAmbient(false);
    };
  }, [story.id]);

  // Scroll active sentence into view
  useEffect(() => {
    if (isPlaying && sentenceRefs.current[currentSentenceIdx]) {
      sentenceRefs.current[currentSentenceIdx]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentSentenceIdx, isPlaying]);

  const speakSentence = (index: number) => {
    if (isCancelledRef.current) return;
    if (index >= story.sentences.length) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      setCompleted(true);
      kidsSound.playSuccess();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      onComplete(50);
      return;
    }

    if (cancelNarrateRef.current) {
      cancelNarrateRef.current();
      cancelNarrateRef.current = null;
    }

    setCurrentSentenceIdx(index);
    const textToSpeak = story.sentences[index];

    cancelNarrateRef.current = narrateSentence(textToSpeak, {
      rate: speechRate,
      onEnd: () => {
        cancelNarrateRef.current = null;
        if (isCancelledRef.current || !isPlayingRef.current) return;
        // Natural breath pause between sentences like a human storyteller
        setTimeout(() => {
          if (!isCancelledRef.current && isPlayingRef.current) {
            speakSentence(index + 1);
          }
        }, 400);
      },
      onError: () => {
        cancelNarrateRef.current = null;
        if (!isCancelledRef.current && isPlayingRef.current) {
          setTimeout(() => speakSentence(index + 1), 600);
        }
      }
    });
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (cancelNarrateRef.current) {
        cancelNarrateRef.current();
        cancelNarrateRef.current = null;
      }
      stopTTS();
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      setIsPlaying(true);
      isPlayingRef.current = true;
      speakSentence(currentSentenceIdx);
    }
  };

  const handleJumpToSentence = (idx: number) => {
    setCurrentSentenceIdx(idx);
    setIsPlaying(true);
    isPlayingRef.current = true;
    speakSentence(idx);
  };

  const handleToggleAmbient = () => {
    const nextState = !ambientActive;
    setAmbientActive(nextState);
    kidsSound.toggleStoryAmbient(nextState);
  };

  const handleRestart = () => {
    setCurrentSentenceIdx(0);
    setIsPlaying(true);
    isPlayingRef.current = true;
    speakSentence(0);
  };

  const handleRateChange = (newRate: number) => {
    setSpeechRate(newRate);
    if (isPlaying) {
      speakSentence(currentSentenceIdx);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-4xl rounded-3xl sm:rounded-[2.5rem] shadow-2xl border-4 border-amber-100 overflow-hidden flex flex-col max-h-[92vh]"
        dir="rtl"
      >
        {/* Header Banner */}
        <div className={`p-4 sm:p-6 bg-gradient-to-r ${story.color} text-white relative shrink-0`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              {isProphet ? (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" />
                </div>
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl sm:text-4xl shrink-0 border border-white/30 shadow-inner">
                  {animalStory?.icon}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="bg-white/25 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold">
                    {isProphet ? prophetStory?.badge : `حيوانات القرآن`}
                  </span>
                  <span className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black">
                    {story.surah}
                  </span>
                </div>
                <h2 className="text-base sm:text-2xl font-black truncate">{story.title}</h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition shrink-0"
              title="إغلاق القصة"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quranic Ayah Quote */}
          <div className="mt-3 bg-black/20 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 border border-white/15">
            <p className="text-xs sm:text-sm font-semibold text-amber-200 text-center font-serif leading-relaxed">
              قال الله تعالى: ﴿ {story.ayah} ﴾
            </p>
          </div>
        </div>

        {/* Narrative Engine Toolbar (Sticky for Mobile & Desktop) */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-3 py-2.5 sm:px-6 sm:py-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleTogglePlay}
              className={`flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-md transition-all ${
                isPlaying
                  ? 'bg-amber-600 text-white hover:bg-amber-700 animate-pulse'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="fill-current" />}
              <span>{isPlaying ? 'إيقاف مؤقت' : 'احكِ لي القصة بصوتك 🎙️'}</span>
            </button>

            <button
              onClick={handleRestart}
              className="p-2 sm:p-2.5 rounded-xl bg-white border border-amber-200 text-slate-700 hover:bg-amber-100 transition"
              title="إعادة من البداية"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Ambient Sound Toggle */}
            <button
              onClick={handleToggleAmbient}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                ambientActive
                  ? 'bg-indigo-600 text-white border-indigo-700'
                  : 'bg-white text-slate-600 border-amber-200 hover:bg-amber-100'
              }`}
              title="مؤثرات هدوء وسكينة ليلية"
            >
              <Music size={14} />
              <span className="hidden sm:inline">صوت السكينة</span>
            </button>

            {/* Speed Selector */}
            <div className="flex items-center bg-white rounded-xl border border-amber-200 p-0.5 text-[11px] sm:text-xs font-bold text-slate-700">
              {[
                { r: 0.8, l: 'بطيء' },
                { r: 0.9, l: 'طبيعي' },
                { r: 1.1, l: 'سريع' }
              ].map(s => (
                <button
                  key={s.r}
                  onClick={() => handleRateChange(s.r)}
                  className={`px-2 py-1 rounded-lg transition ${speechRate === s.r ? 'bg-amber-500 text-white' : 'hover:bg-slate-100'}`}
                >
                  {s.l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Story Sentences (With Visual Real-time Storyteller Highlighting) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-3 sm:space-y-4 bg-slate-50/50">
          <div className="text-center pb-2">
            <span className="inline-block bg-amber-100 text-amber-900 text-xs sm:text-sm font-bold px-3 py-1 rounded-full">
              💡 اضغط على أي جملة للاستماع إليها مباشرة
            </span>
          </div>

          {story.sentences.map((sentence, idx) => {
            const isCurrent = currentSentenceIdx === idx && isPlaying;
            const isPast = currentSentenceIdx > idx;

            return (
              <motion.div
                key={idx}
                ref={el => { sentenceRefs.current[idx] = el; }}
                onClick={() => handleJumpToSentence(idx)}
                whileHover={{ scale: 1.01 }}
                className={`p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl cursor-pointer transition-all border-2 text-right relative ${
                  isCurrent
                    ? 'bg-amber-100/90 border-amber-400 shadow-md ring-2 ring-amber-300'
                    : isPast
                    ? 'bg-white border-slate-200 text-slate-800'
                    : 'bg-white/80 border-slate-100 text-slate-700 hover:border-amber-200'
                }`}
              >
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 text-xs sm:text-sm font-black transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-white animate-bounce'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {idx + 1}
                  </div>

                  <p className={`flex-1 text-sm sm:text-lg md:text-xl font-medium leading-relaxed sm:leading-loose ${
                    isCurrent ? 'font-bold text-amber-950' : ''
                  }`}>
                    {sentence}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJumpToSentence(idx);
                    }}
                    className="p-1.5 text-slate-400 hover:text-amber-600 transition shrink-0"
                    title="استمع لهذه الجملة"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
              </motion.div>
            );
          })}

          {/* Lessons Learned Section */}
          <div className="mt-8 bg-emerald-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-200">
            <h3 className="text-base sm:text-xl font-black text-emerald-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-600" size={22} />
              <span>ماذا نتعلم من هذه القصة المباركة؟</span>
            </h3>

            {isProphet && prophetStory?.lessons && (
              <ul className="space-y-2 text-xs sm:text-sm font-semibold text-emerald-800">
                {prophetStory.lessons.map((lesson, lIdx) => (
                  <li key={lIdx} className="flex items-center gap-2">
                    <span className="text-emerald-500 text-base">⭐</span>
                    <span>{lesson}</span>
                  </li>
                ))}
              </ul>
            )}

            {!isProphet && animalStory?.moral && (
              <p className="text-xs sm:text-base font-semibold text-emerald-800 leading-relaxed">
                {animalStory.moral}
              </p>
            )}
          </div>

          {/* Prophet Story Mini Quiz */}
          {isProphet && prophetStory?.quiz && (
            <div className="mt-6 bg-indigo-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-indigo-200">
              <h3 className="text-base sm:text-lg font-black text-indigo-950 mb-3 flex items-center gap-2">
                <HelpCircle className="text-indigo-600" size={22} />
                <span>سؤال الذكاء للبطل الصغير:</span>
              </h3>
              <p className="text-xs sm:text-base font-bold text-slate-800 mb-4">
                {prophetStory.quiz.question}
              </p>

              <div className="space-y-2">
                {prophetStory.quiz.options.map((opt, oIdx) => {
                  const isSelected = selectedQuizAnswer === oIdx;
                  const isCorrect = oIdx === prophetStory.quiz.correctIndex;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => {
                        setSelectedQuizAnswer(oIdx);
                        setShowQuizResult(true);
                        if (isCorrect) {
                          kidsSound.playSuccess();
                          confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
                          onComplete(20);
                        } else {
                          kidsSound.playTryAgain();
                        }
                      }}
                      className={`w-full p-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-right transition border-2 flex items-center justify-between ${
                        showQuizResult && isCorrect
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                          : showQuizResult && isSelected && !isCorrect
                          ? 'bg-rose-100 border-rose-300 text-rose-900'
                          : 'bg-white border-indigo-100 text-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      <span>{opt}</span>
                      {showQuizResult && isCorrect && <CheckCircle2 className="text-emerald-600" size={18} />}
                    </button>
                  );
                })}
              </div>

              {showQuizResult && (
                <div className="mt-3 p-3 rounded-xl bg-white border border-indigo-200 text-xs sm:text-sm font-medium text-slate-700">
                  {prophetStory.quiz.explanation}
                </div>
              )}
            </div>
          )}

          {/* Finished Banner */}
          <div className="pt-6 pb-2 text-center">
            <button
              onClick={() => {
                kidsSound.playSuccess();
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                onComplete(30);
                onClose();
              }}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-2 mx-auto"
            >
              <Award size={20} className="text-amber-200" />
              <span>لقد أتممت القصة! استلم وسام البطل 🌟</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
