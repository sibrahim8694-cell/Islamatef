const globalUtterances: SpeechSynthesisUtterance[] = [];

// Initialize audio element globally
let globalAudioEl: HTMLAudioElement | null = null;

function initAudioElement() {
  if (typeof document === 'undefined') return null;
  if (globalAudioEl) return globalAudioEl;
  
  globalAudioEl = document.getElementById('app-tts-audio') as HTMLAudioElement;
  if (!globalAudioEl) {
    globalAudioEl = document.createElement('audio');
    globalAudioEl.id = 'app-tts-audio';
    globalAudioEl.style.display = 'none';
    globalAudioEl.setAttribute('playsinline', ''); // Essential for iOS
    document.body.appendChild(globalAudioEl);
  }
  return globalAudioEl;
}

// Unlock audio on first native interaction
if (typeof document !== 'undefined') {
  const unlockAudio = () => {
    const audioEl = initAudioElement();
    if (audioEl) {
      audioEl.play().catch(() => {});
      audioEl.pause();
      audioEl.src = 'data:audio/mp3;base64,//MkxAAQ...'; // Empty valid audio to unlock
    }
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('click', unlockAudio);
  };
  document.addEventListener('touchstart', unlockAudio, { once: true });
  document.addEventListener('click', unlockAudio, { once: true });
}

export function playTTS(text: string, lang: string = 'en-US') {
  try {
    const isEn = lang.startsWith('en');
    const gTTSLang = isEn ? 'en-US' : 'ar';
    
    if (text.length > 150) {
      nativeSpeak(text, lang);
      return;
    }

    const cleanText = text.substring(0, 150);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${gTTSLang}&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
    
    const audioEl = initAudioElement();
    if (!audioEl) {
      nativeSpeak(text, lang);
      return;
    }
    
    audioEl.pause();
    audioEl.src = url;
    audioEl.removeAttribute('crossorigin');
    audioEl.load();
    
    // Play with a slight delay to ensure the load is recognized by WebView
    setTimeout(() => {
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Audio fallback to SpeechSynthesis:", err?.message || String(err));
          nativeSpeak(text, lang);
        });
      }
    }, 50);
  } catch (err: any) {
    console.warn("TTS notice:", err?.message || String(err));
    nativeSpeak(text, lang);
  }
}

function nativeSpeak(text: string, lang: string) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    // Attempt to set a specific voice if available. Some webviews require this.
    const voices = window.speechSynthesis.getVoices();
    const shortLang = lang.split('-')[0];
    const voice = voices.find(v => v.lang.startsWith(lang) || v.lang.startsWith(shortLang));
    if (voice) {
      utterance.voice = voice;
    }
    
    // Prevent Garbage Collection bug mapping issues in Android/Chrome!
    globalUtterances.push(utterance);
    if (globalUtterances.length > 10) {
      globalUtterances.shift();
    }
    (window as any)._currentUtterance = utterance;

    window.speechSynthesis.speak(utterance);
  }
}
