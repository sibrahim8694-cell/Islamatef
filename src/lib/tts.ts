const globalUtterances: SpeechSynthesisUtterance[] = [];

export function playTTS(text: string, lang: string = 'en-US') {
  try {
    const isEn = lang.startsWith('en');
    const gTTSLang = isEn ? 'en-US' : 'ar';
    
    // For very long texts (stories), prioritize native TTS API to avoid Google TTS limit.
    if (text.length > 150) {
      nativeSpeak(text, lang);
      return;
    }

    const cleanText = text.substring(0, 150);
    const url = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=${gTTSLang}&q=${encodeURIComponent(cleanText)}`;
    
    let audioEl = document.getElementById('app-tts-audio') as HTMLAudioElement;
    if (!audioEl) {
      audioEl = document.createElement('audio');
      audioEl.id = 'app-tts-audio';
      // Append to DOM to increase chance of working in WebViews
      document.body.appendChild(audioEl);
    }
    
    audioEl.src = url;
    audioEl.crossOrigin = "anonymous";
    
    const playPromise = audioEl.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Audio fallback to SpeechSynthesis:", err);
        nativeSpeak(text, lang);
      });
    }
  } catch (err) {
    console.error("TTS error:", err);
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
