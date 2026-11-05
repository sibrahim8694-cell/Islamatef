import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { SURAHS, RECITERS, getSurahNumber, Reciter } from '../lib/quranData';
import { CAIRO_STREAM_SERVERS, RadioStreamServer } from '../data/radioData';

export type ActiveAudioSource = 'none' | 'radio' | 'quran';

interface GlobalAudioContextType {
  // Global Active Mode
  activeSource: ActiveAudioSource;

  // Radio State & Controls
  isRadioPlaying: boolean;
  isRadioLoading: boolean;
  isRadioMuted: boolean;
  radioVolume: number;
  radioStreamHealth: 'live' | 'buffering' | 'idle';
  activeRadioServer: RadioStreamServer;
  playRadio: () => Promise<void>;
  pauseRadio: () => void;
  stopRadio: () => void;
  toggleRadio: () => void;
  setRadioVolume: (vol: number) => void;
  toggleRadioMute: () => void;
  switchRadioServer: (serverId?: string) => void;
  reconnectRadio: () => void;

  // Quran State & Controls
  playingSurah: number | null;
  selectedReciter: Reciter;
  isQuranPlaying: boolean;
  isQuranLoading: boolean;
  isQuranMuted: boolean;
  quranVolume: number;
  quranProgress: number;
  bufferedProgress: number;
  quranCurrentTime: number;
  quranDuration: number;
  setSelectedReciter: (reciter: Reciter) => void;
  playSurah: (surahIndex: number, customReciter?: Reciter) => Promise<void>;
  pauseQuran: () => void;
  stopQuran: () => void;
  toggleQuran: () => void;
  seekQuran: (percent: number) => void;
  playNextSurah: () => void;
  playPrevSurah: () => void;
  setQuranVolume: (vol: number) => void;
  toggleQuranMute: () => void;
  getSurahAudioUrl: (reciter: Reciter, index: number, useFallback?: boolean) => string;
}

const GlobalAudioContext = createContext<GlobalAudioContextType | undefined>(undefined);

export const GlobalAudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Active Source
  const [activeSource, setActiveSource] = useState<ActiveAudioSource>('none');

  // Radio States
  const [isRadioPlaying, setIsRadioPlaying] = useState<boolean>(false);
  const [isRadioLoading, setIsRadioLoading] = useState<boolean>(false);
  const [isRadioMuted, setIsRadioMuted] = useState<boolean>(false);
  const [radioVolume, setRadioVolumeState] = useState<number>(0.9);
  const [radioStreamHealth, setRadioStreamHealth] = useState<'live' | 'buffering' | 'idle'>('idle');
  const [activeRadioServerIndex, setActiveRadioServerIndex] = useState<number>(0);

  // Quran States
  const [selectedReciter, setSelectedReciterState] = useState<Reciter>(RECITERS[0]);
  const [playingSurah, setPlayingSurah] = useState<number | null>(null);
  const [isQuranPlaying, setIsQuranPlaying] = useState<boolean>(false);
  const [isQuranLoading, setIsQuranLoading] = useState<boolean>(false);
  const [isQuranMuted, setIsQuranMuted] = useState<boolean>(false);
  const [quranVolume, setQuranVolumeState] = useState<number>(1.0);
  const [quranProgress, setQuranProgress] = useState<number>(0);
  const [bufferedProgress, setBufferedProgress] = useState<number>(0);
  const [quranCurrentTime, setQuranCurrentTime] = useState<number>(0);
  const [quranDuration, setQuranDuration] = useState<number>(0);
  const [hasTriedFallback, setHasTriedFallback] = useState<boolean>(false);

  // Audio Element Refs (Root-Level, Persistent)
  const radioAudioRef = useRef<HTMLAudioElement | null>(null);
  const quranAudioRef = useRef<HTMLAudioElement | null>(null);

  // Operational Trackers
  const radioPlayAttemptRef = useRef<number>(0);
  const radioLastProgressTimeRef = useRef<number>(0);
  const radioLastCurrentTimeRef = useRef<number>(0);
  const radioConsecutiveFailuresRef = useRef<number>(0);

  const quranResumeTimeRef = useRef<number>(0);
  const quranRetryCountRef = useRef<number>(0);

  const activeRadioServer = CAIRO_STREAM_SERVERS[activeRadioServerIndex] || CAIRO_STREAM_SERVERS[0];

  // Initialize Audio Elements once on mount
  useEffect(() => {
    const radioAudio = new Audio();
    radioAudio.preload = 'none';
    radioAudioRef.current = radioAudio;

    const quranAudio = new Audio();
    quranAudio.preload = 'auto';
    quranAudioRef.current = quranAudio;

    // Attach Quran Audio Event Listeners
    quranAudio.ontimeupdate = () => {
      const cur = quranAudio.currentTime || 0;
      const dur = quranAudio.duration || 0;
      setQuranCurrentTime(cur);
      setQuranDuration(dur);
      if (dur > 0) {
        setQuranProgress((cur / dur) * 100);
      }
      updateQuranBuffered();
    };

    quranAudio.onprogress = () => {
      updateQuranBuffered();
    };

    quranAudio.onwaiting = () => {
      setIsQuranLoading(true);
    };

    quranAudio.oncanplay = () => {
      setIsQuranLoading(false);
      updateQuranBuffered();
    };

    quranAudio.onplaying = () => {
      setIsQuranLoading(false);
      setIsQuranPlaying(true);
      setActiveSource('quran');
    };

    quranAudio.onended = () => {
      handleQuranNext();
    };

    quranAudio.onerror = (e) => {
      console.warn('Quran audio error caught:', e);
      handleQuranErrorRecovery();
    };

    // Attach Radio Audio Event Listeners
    radioAudio.onwaiting = () => {
      setIsRadioLoading(true);
      setRadioStreamHealth('buffering');
    };

    radioAudio.oncanplay = () => {
      setIsRadioLoading(false);
      setRadioStreamHealth('live');
    };

    radioAudio.onplaying = () => {
      setIsRadioLoading(false);
      setIsRadioPlaying(true);
      setRadioStreamHealth('live');
      setActiveSource('radio');
      radioConsecutiveFailuresRef.current = 0;
    };

    radioAudio.onerror = () => {
      console.warn('Radio stream error detected, triggering auto-recovery...');
      handleRadioAutoRecovery();
    };

    return () => {
      radioAudio.pause();
      radioAudio.removeAttribute('src');
      quranAudio.pause();
      quranAudio.removeAttribute('src');
    };
  }, []);

  const updateQuranBuffered = () => {
    const audio = quranAudioRef.current;
    if (audio && audio.buffered.length > 0 && audio.duration > 0) {
      try {
        const end = audio.buffered.end(audio.buffered.length - 1);
        setBufferedProgress(Math.min(100, (end / audio.duration) * 100));
      } catch {}
    }
  };

  // -------------------------------------------------------------
  // WakeLock & MediaSession Supervisor (Background & Lock Screen)
  // -------------------------------------------------------------
  useEffect(() => {
    let wakeLockSentinel: any = null;
    const requestWake = async () => {
      if ('wakeLock' in navigator && (isRadioPlaying || isQuranPlaying)) {
        try {
          wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
        } catch {}
      }
    };
    requestWake();

    return () => {
      if (wakeLockSentinel) {
        wakeLockSentinel.release().catch(() => {});
      }
    };
  }, [isRadioPlaying, isQuranPlaying]);

  // Update MediaSession dynamically based on what is active
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    if (activeSource === 'radio' && isRadioPlaying) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'إذاعة القرآن الكريم من القاهرة',
        artist: 'جمهورية مصر العربية · 98.2 FM (بث مباشر)',
        album: 'بوابة إسلام للعلم والإيمان (صدقة جارية)',
        artwork: [
          { src: 'https://i.imgur.com/sRBt7lJ.png', sizes: '512x512', type: 'image/png' }
        ]
      });
      navigator.mediaSession.playbackState = 'playing';

      navigator.mediaSession.setActionHandler('play', () => playRadio());
      navigator.mediaSession.setActionHandler('pause', () => pauseRadio());
      navigator.mediaSession.setActionHandler('stop', () => stopRadio());
      navigator.mediaSession.setActionHandler('nexttrack', () => switchRadioServer());
      navigator.mediaSession.setActionHandler('previoustrack', null);
    } else if (activeSource === 'quran' && playingSurah !== null) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `سورة ${SURAHS[playingSurah]}`,
        artist: selectedReciter.name,
        album: 'المصحف الشريف المرتل والمجود',
        artwork: [
          { src: 'https://i.imgur.com/sRBt7lJ.png', sizes: '512x512', type: 'image/png' }
        ]
      });
      navigator.mediaSession.playbackState = isQuranPlaying ? 'playing' : 'paused';

      navigator.mediaSession.setActionHandler('play', () => {
        quranAudioRef.current?.play().then(() => setIsQuranPlaying(true)).catch(() => {});
      });
      navigator.mediaSession.setActionHandler('pause', () => pauseQuran());
      navigator.mediaSession.setActionHandler('stop', () => stopQuran());
      navigator.mediaSession.setActionHandler('nexttrack', () => playNextSurah());
      navigator.mediaSession.setActionHandler('previoustrack', () => playPrevSurah());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined && quranAudioRef.current) {
          quranAudioRef.current.currentTime = details.seekTime;
        }
      });
    } else {
      navigator.mediaSession.playbackState = 'none';
    }
  }, [activeSource, isRadioPlaying, isQuranPlaying, playingSurah, selectedReciter]);

  // -------------------------------------------------------------
  // Continuous Radio Stream Supervisor (Heartbeat monitor)
  // Reconnects immediately if socket drops or stalls in background
  // -------------------------------------------------------------
  useEffect(() => {
    if (!isRadioPlaying) return;

    radioLastProgressTimeRef.current = Date.now();
    radioLastCurrentTimeRef.current = radioAudioRef.current?.currentTime || 0;

    const interval = setInterval(() => {
      const audio = radioAudioRef.current;
      if (!audio || !isRadioPlaying) return;

      const curTime = audio.currentTime || 0;

      // In live Icecast audio, currentTime constantly increments
      if (curTime > radioLastCurrentTimeRef.current + 0.5) {
        radioLastCurrentTimeRef.current = curTime;
        radioLastProgressTimeRef.current = Date.now();
        setRadioStreamHealth('live');
        setIsRadioLoading(false);
      } else {
        // Has not progressed for more than 4.5 seconds
        const stalledDuration = Date.now() - radioLastProgressTimeRef.current;
        if (stalledDuration > 4500) {
          console.warn(`Radio live stream stalled for ${Math.round(stalledDuration / 1000)}s, initiating seamless reconnect...`);
          setRadioStreamHealth('buffering');
          setIsRadioLoading(true);
          handleRadioAutoRecovery();
        }
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isRadioPlaying, activeRadioServerIndex]);

  // -------------------------------------------------------------
  // Radio Functions
  // -------------------------------------------------------------
  const playRadioServer = async (serverUrl: string, attemptId: number) => {
    const audio = radioAudioRef.current;
    if (!audio) return;

    try {
      // Pause Quran if running
      if (isQuranPlaying && quranAudioRef.current) {
        quranAudioRef.current.pause();
        setIsQuranPlaying(false);
      }

      audio.pause();
      // Add timestamp to bypass stale cached stream socket
      const freshUrl = serverUrl + (serverUrl.includes('?') ? '&' : '?') + 'live=' + Date.now();
      audio.src = freshUrl;
      audio.load();

      const p = audio.play();
      if (p !== undefined) {
        await p;
      }

      if (attemptId === radioPlayAttemptRef.current) {
        setIsRadioPlaying(true);
        setIsRadioLoading(false);
        setRadioStreamHealth('live');
        setActiveSource('radio');
        radioLastProgressTimeRef.current = Date.now();
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') return;

      if (attemptId !== radioPlayAttemptRef.current) return;

      console.warn('Radio play failure, trying mirror server:', err?.message || err);
      handleRadioAutoRecovery();
    }
  };

  const handleRadioAutoRecovery = () => {
    radioConsecutiveFailuresRef.current++;
    const currentAttempt = ++radioPlayAttemptRef.current;

    // If primary stream failed twice in a row, switch to secondary cloud feed
    if (radioConsecutiveFailuresRef.current >= 2) {
      const nextIndex = (activeRadioServerIndex + 1) % CAIRO_STREAM_SERVERS.length;
      setActiveRadioServerIndex(nextIndex);
      const nextServer = CAIRO_STREAM_SERVERS[nextIndex];
      toast.info('تم تحويل البث إلى السيرفر الاحتياطي لضمان استمرار الاستماع دون انقطاع');
      playRadioServer(nextServer.url, currentAttempt);
    } else {
      // Soft reconnect on same server
      playRadioServer(activeRadioServer.url, currentAttempt);
    }
  };

  const playRadio = async () => {
    const currentAttempt = ++radioPlayAttemptRef.current;
    setIsRadioLoading(true);
    setRadioStreamHealth('buffering');
    await playRadioServer(activeRadioServer.url, currentAttempt);
  };

  const pauseRadio = () => {
    radioPlayAttemptRef.current++;
    if (radioAudioRef.current) {
      radioAudioRef.current.pause();
    }
    setIsRadioPlaying(false);
    setIsRadioLoading(false);
    setRadioStreamHealth('idle');
    if (activeSource === 'radio') {
      setActiveSource('none');
    }
  };

  const stopRadio = () => {
    radioPlayAttemptRef.current++;
    if (radioAudioRef.current) {
      radioAudioRef.current.pause();
      radioAudioRef.current.removeAttribute('src');
      radioAudioRef.current.load();
    }
    setIsRadioPlaying(false);
    setIsRadioLoading(false);
    setRadioStreamHealth('idle');
    if (activeSource === 'radio') {
      setActiveSource('none');
    }
  };

  const toggleRadio = () => {
    if (isRadioPlaying) {
      pauseRadio();
    } else {
      playRadio();
    }
  };

  const setRadioVolume = (vol: number) => {
    setRadioVolumeState(vol);
    if (radioAudioRef.current) {
      radioAudioRef.current.volume = vol;
      if (vol === 0) {
        setIsRadioMuted(true);
        radioAudioRef.current.muted = true;
      } else if (isRadioMuted) {
        setIsRadioMuted(false);
        radioAudioRef.current.muted = false;
      }
    }
  };

  const toggleRadioMute = () => {
    if (radioAudioRef.current) {
      const next = !isRadioMuted;
      radioAudioRef.current.muted = next;
      setIsRadioMuted(next);
    }
  };

  const switchRadioServer = (serverId?: string) => {
    let nextIndex = (activeRadioServerIndex + 1) % CAIRO_STREAM_SERVERS.length;
    if (serverId) {
      const found = CAIRO_STREAM_SERVERS.findIndex(s => s.id === serverId);
      if (found !== -1) nextIndex = found;
    }
    setActiveRadioServerIndex(nextIndex);
    const nextServer = CAIRO_STREAM_SERVERS[nextIndex];
    toast.success(`تم التبديل إلى: ${nextServer.name}`);
    if (isRadioPlaying) {
      const attempt = ++radioPlayAttemptRef.current;
      playRadioServer(nextServer.url, attempt);
    }
  };

  const reconnectRadio = () => {
    toast.info('جاري إعادة ضبط البث المباشر...');
    const attempt = ++radioPlayAttemptRef.current;
    playRadioServer(activeRadioServer.url, attempt);
  };

  // -------------------------------------------------------------
  // Quran Functions
  // -------------------------------------------------------------
  const getSurahAudioUrl = (reciter: Reciter, index: number, useFallback = false) => {
    if (reciter.buildUrl) {
      return reciter.buildUrl(index);
    }
    const server = useFallback && reciter.fallbackServer ? reciter.fallbackServer : reciter.server;
    return `${server}/${getSurahNumber(index)}.mp3`;
  };

  const playSurah = async (index: number, customReciter?: Reciter) => {
    const audio = quranAudioRef.current;
    if (!audio) return;

    const reciterToUse = customReciter || selectedReciter;

    // Check if surah is available for historical reciters
    if (reciterToUse.availableSurahs && !reciterToUse.availableSurahs.includes(index)) {
      toast.info(`سورة ${SURAHS[index]} غير متوفرة ضمن التسجيلات المحفوظة للشيخ ${reciterToUse.name}`);
      return;
    }

    // Toggle if same surah is playing
    if (playingSurah === index && isQuranPlaying && !customReciter) {
      pauseQuran();
      return;
    }

    if (customReciter) {
      setSelectedReciterState(customReciter);
    }

    // Pause Radio if running
    if (isRadioPlaying && radioAudioRef.current) {
      radioAudioRef.current.pause();
      setIsRadioPlaying(false);
    }

    setPlayingSurah(index);
    setIsQuranLoading(true);
    setHasTriedFallback(false);
    quranRetryCountRef.current = 0;
    quranResumeTimeRef.current = 0;

    const primaryUrl = getSurahAudioUrl(reciterToUse, index, false);
    if (!primaryUrl) {
      setIsQuranLoading(false);
      toast.error('عذراً، هذه السورة غير متوفرة لهذا القارئ.');
      return;
    }

    try {
      audio.pause();
      audio.src = primaryUrl;
      audio.load();

      await audio.play();
      setIsQuranPlaying(true);
      setIsQuranLoading(false);
      setActiveSource('quran');
    } catch (err: any) {
      if (err?.name === 'AbortError') return;

      console.warn('Initial surah play notice, trying fallback server:', err?.message || err);
      // Attempt immediate fallback
      if (reciterToUse.fallbackServer) {
        setHasTriedFallback(true);
        const fbUrl = getSurahAudioUrl(reciterToUse, index, true);
        try {
          audio.src = fbUrl;
          audio.load();
          await audio.play();
          setIsQuranPlaying(true);
          setIsQuranLoading(false);
          setActiveSource('quran');
          return;
        } catch {}
      }

      setIsQuranLoading(false);
      setIsQuranPlaying(false);
      toast.error('تعذر تشغيل هذه السورة حالياً', {
        description: 'يرجى التأكد من اتصال الإنترنت أو اختيار قارئ آخر.'
      });
    }
  };

  const handleQuranErrorRecovery = async () => {
    const audio = quranAudioRef.current;
    if (!audio || playingSurah === null) return;

    // Preserve the position where the interruption happened
    const savedTime = audio.currentTime || quranResumeTimeRef.current || 0;
    quranResumeTimeRef.current = savedTime;

    // 1. Try verified fallback server
    if (!hasTriedFallback && selectedReciter.fallbackServer) {
      setHasTriedFallback(true);
      const fallbackUrl = getSurahAudioUrl(selectedReciter, playingSurah, true);
      console.log('Resuming from fallback server at second:', savedTime);
      audio.src = fallbackUrl;
      audio.load();

      const onCanPlayResume = async () => {
        audio.removeEventListener('canplay', onCanPlayResume);
        if (savedTime > 0) {
          try { audio.currentTime = savedTime; } catch {}
        }
        try {
          await audio.play();
          setIsQuranPlaying(true);
          setIsQuranLoading(false);
        } catch {}
      };
      audio.addEventListener('canplay', onCanPlayResume);
      return;
    }

    // 2. Retry with cache-buster
    if (quranRetryCountRef.current < 2) {
      quranRetryCountRef.current++;
      const freshUrl = `${getSurahAudioUrl(selectedReciter, playingSurah, hasTriedFallback)}?retry=${Date.now()}`;
      audio.src = freshUrl;
      audio.load();

      const onCanPlayResume = async () => {
        audio.removeEventListener('canplay', onCanPlayResume);
        if (savedTime > 0) {
          try { audio.currentTime = savedTime; } catch {}
        }
        try {
          await audio.play();
          setIsQuranPlaying(true);
          setIsQuranLoading(false);
        } catch {}
      };
      audio.addEventListener('canplay', onCanPlayResume);
      return;
    }

    setIsQuranLoading(false);
    setIsQuranPlaying(false);
  };

  const pauseQuran = () => {
    if (quranAudioRef.current) {
      quranAudioRef.current.pause();
    }
    setIsQuranPlaying(false);
    setIsQuranLoading(false);
  };

  const stopQuran = () => {
    if (quranAudioRef.current) {
      quranAudioRef.current.pause();
      quranAudioRef.current.removeAttribute('src');
      quranAudioRef.current.load();
    }
    setIsQuranPlaying(false);
    setIsQuranLoading(false);
    setPlayingSurah(null);
    setQuranProgress(0);
    setQuranCurrentTime(0);
    if (activeSource === 'quran') {
      setActiveSource('none');
    }
  };

  const toggleQuran = () => {
    if (isQuranPlaying) {
      pauseQuran();
    } else if (playingSurah !== null && quranAudioRef.current) {
      quranAudioRef.current.play().then(() => {
        setIsQuranPlaying(true);
        setActiveSource('quran');
      }).catch(() => {});
    }
  };

  const seekQuran = (percent: number) => {
    if (quranAudioRef.current && quranAudioRef.current.duration) {
      const targetTime = (percent / 100) * quranAudioRef.current.duration;
      quranAudioRef.current.currentTime = targetTime;
      setQuranProgress(percent);
      setQuranCurrentTime(targetTime);
    }
  };

  const handleQuranNext = () => {
    if (playingSurah === null) return;
    const reciter = selectedReciter;
    if (reciter.availableSurahs) {
      const sorted = [...reciter.availableSurahs].sort((a, b) => a - b);
      const nextIdx = sorted.find(idx => idx > playingSurah);
      if (nextIdx !== undefined) {
        playSurah(nextIdx);
      } else {
        toast.info('تم الوصول إلى آخر سورة مسجلة للشيخ');
      }
    } else if (playingSurah < 113) {
      playSurah(playingSurah + 1);
    }
  };

  const playNextSurah = () => handleQuranNext();

  const playPrevSurah = () => {
    if (playingSurah === null) return;
    const reciter = selectedReciter;
    if (reciter.availableSurahs) {
      const sorted = [...reciter.availableSurahs].sort((a, b) => a - b);
      const prevList = sorted.filter(idx => idx < playingSurah);
      if (prevList.length > 0) {
        playSurah(prevList[prevList.length - 1]);
      }
    } else if (playingSurah > 0) {
      playSurah(playingSurah - 1);
    }
  };

  const setQuranVolume = (vol: number) => {
    setQuranVolumeState(vol);
    if (quranAudioRef.current) {
      quranAudioRef.current.volume = vol;
      if (vol === 0) {
        setIsQuranMuted(true);
        quranAudioRef.current.muted = true;
      } else if (isQuranMuted) {
        setIsQuranMuted(false);
        quranAudioRef.current.muted = false;
      }
    }
  };

  const toggleQuranMute = () => {
    if (quranAudioRef.current) {
      const next = !isQuranMuted;
      quranAudioRef.current.muted = next;
      setIsQuranMuted(next);
    }
  };

  const setSelectedReciter = (reciter: Reciter) => {
    setSelectedReciterState(reciter);
  };

  return (
    <GlobalAudioContext.Provider
      value={{
        activeSource,
        isRadioPlaying,
        isRadioLoading,
        isRadioMuted,
        radioVolume,
        radioStreamHealth,
        activeRadioServer,
        playRadio,
        pauseRadio,
        stopRadio,
        toggleRadio,
        setRadioVolume,
        toggleRadioMute,
        switchRadioServer,
        reconnectRadio,

        playingSurah,
        selectedReciter,
        isQuranPlaying,
        isQuranLoading,
        isQuranMuted,
        quranVolume,
        quranProgress,
        bufferedProgress,
        quranCurrentTime,
        quranDuration,
        setSelectedReciter,
        playSurah,
        pauseQuran,
        stopQuran,
        toggleQuran,
        seekQuran,
        playNextSurah,
        playPrevSurah,
        setQuranVolume,
        toggleQuranMute,
        getSurahAudioUrl
      }}
    >
      {children}
    </GlobalAudioContext.Provider>
  );
};

export const useGlobalAudio = () => {
  const context = useContext(GlobalAudioContext);
  if (!context) {
    throw new Error('useGlobalAudio must be used within a GlobalAudioProvider');
  }
  return context;
};
