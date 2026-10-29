// AI-Grade Speech Synthesis Engine
// Designed for natural human-like cadence, zero stuttering/clipping, and multi-sentence persistence.

export interface TTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onSentenceChange?: (sentenceIndex: number, sentenceText: string) => void;
  onError?: (error: any) => void;
}

// Global state to prevent garbage collection bugs in Chromium/WebKit
const activeUtterances: Set<SpeechSynthesisUtterance> = new Set();
let keepAliveTimer: any = null;
let activeChunkQueue: { text: string; options?: TTSOptions }[] = [];
let isQueueRunning = false;
let currentSentenceIdx = 0;

// Preload and cache voices
let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      cachedVoices = voices;
      resolve(voices);
      return;
    }

    const onVoicesChanged = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        cachedVoices = v;
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        resolve(v);
      }
    };

    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
    // Fallback timeout in case voiceschanged event doesn't fire
    setTimeout(() => {
      cachedVoices = window.speechSynthesis.getVoices();
      resolve(cachedVoices);
    }, 250);
  });
}

// Initialize voices immediately on client
if (typeof window !== 'undefined') {
  loadVoices();
}

/**
 * Intelligently selects the closest voice to natural human speech.
 * Prioritizes high-fidelity Neural, Natural, and human-tuned voices (Microsoft Natural, Google Neural, Apple Tariq/Laila).
 */
export function getBestVoice(lang: string = 'ar-SA'): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const isArabic = lang.startsWith('ar');
  const isEnglish = lang.startsWith('en');

  // Priority scoring function
  const scoreVoice = (v: SpeechSynthesisVoice): number => {
    let score = 0;
    const name = v.name.toLowerCase();
    const voiceLang = (v.lang || '').toLowerCase().replace('_', '-');

    if (isArabic) {
      // Must be an Arabic voice
      if (!voiceLang.startsWith('ar')) return -100;

      // Premium Neural & Natural voices
      if (name.includes('natural') || name.includes('online') || name.includes('neural')) score += 120;
      if (name.includes('google')) score += 90;
      
      // Known high-fidelity Arabic voice actors
      if (name.includes('shakir') || name.includes('hamed') || name.includes('fatima') || name.includes('salma')) score += 100;
      if (name.includes('tariq') || name.includes('maged') || name.includes('laila') || name.includes('zeina') || name.includes('naayf')) score += 95;
      if (name.includes('zariyah')) score += 90;

      // Classical Arabic regional dialects
      if (voiceLang === 'ar-sa') score += 40; // Saudi (Fusha)
      if (voiceLang === 'ar-eg') score += 30; // Egyptian
      if (voiceLang.startsWith('ar')) score += 20;

      // Favor local service voices that don't lag
      if (v.localService) score += 10;
    } else if (isEnglish) {
      if (!voiceLang.startsWith('en')) return -100;

      if (name.includes('natural') || name.includes('online') || name.includes('neural')) score += 120;
      if (name.includes('google')) score += 90;
      if (name.includes('jenny') || name.includes('guy') || name.includes('aria') || name.includes('samantha')) score += 95;
      if (voiceLang === 'en-us') score += 30;
      if (voiceLang === 'en-gb') score += 25;
    } else {
      if (voiceLang.startsWith(lang.toLowerCase())) score += 50;
    }

    return score;
  };

  const ranked = [...voices]
    .map(v => ({ voice: v, score: scoreVoice(v) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return ranked.length > 0 ? ranked[0].voice : null;
}

/**
 * Splits long Arabic or English text into natural clauses and sentences.
 * Prevents Chrome 15-second cutoff and guarantees fluid storytelling without clipping.
 */
function splitTextIntoSentences(text: string): string[] {
  if (!text) return [];

  // Clean brackets, asterisks, URLs
  const clean = text
    .replace(/\[.*?\]/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[*_#~]/g, '')
    .trim();

  // Split on punctuation: periods, questions, exclamations, commas, newlines
  const rawSegments = clean.split(/([.!?؟،؛\n]+)/);
  const sentences: string[] = [];
  let buffer = '';

  for (let i = 0; i < rawSegments.length; i++) {
    const part = rawSegments[i].trim();
    if (!part) continue;

    buffer += (buffer ? ' ' : '') + part;

    // If buffer ends with punctuation or exceeds ~90 characters, push as sentence
    if (/[.!?؟،؛\n]/.test(part) || buffer.length > 80) {
      if (buffer.trim()) {
        sentences.push(buffer.trim());
      }
      buffer = '';
    }
  }

  if (buffer.trim()) {
    sentences.push(buffer.trim());
  }

  return sentences.length > 0 ? sentences : [clean];
}

/**
 * Starts keep-alive heartbeat to prevent Chrome/Android from freezing speech mid-stream.
 */
function startKeepAlive() {
  stopKeepAlive();
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  keepAliveTimer = setInterval(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }
  }, 9000);
}

function stopKeepAlive() {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}

/**
 * Stops all ongoing speech immediately and flushes the queue.
 */
export function stopTTS() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  stopKeepAlive();
  activeChunkQueue = [];
  isQueueRunning = false;
  currentSentenceIdx = 0;

  activeUtterances.forEach(u => {
    u.onend = null;
    u.onerror = null;
  });
  activeUtterances.clear();

  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }
}

/**
 * Plays text-to-speech with natural human cadence, voice selection, and zero stuttering.
 */
export function playTTS(
  text: string,
  lang: string = 'ar-SA',
  options: TTSOptions = {}
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (!text || !text.trim()) return;

  stopTTS();

  const isArabic = lang.startsWith('ar');
  const sentences = splitTextIntoSentences(text);
  const bestVoice = getBestVoice(lang);

  // Default storytelling rates:
  // Arabic is best delivered around 0.90 to 0.94 for clarity and dignity without rushing.
  // English is best around 0.95 to 1.0.
  const targetRate = options.rate ?? (isArabic ? 0.92 : 0.96);
  const targetPitch = options.pitch ?? (isArabic ? 1.02 : 1.0);
  const targetVolume = options.volume ?? 1.0;

  currentSentenceIdx = 0;
  isQueueRunning = true;
  startKeepAlive();

  const speakNextSentence = (index: number) => {
    if (!isQueueRunning) return;

    if (index >= sentences.length) {
      stopKeepAlive();
      isQueueRunning = false;
      options.onEnd?.();
      return;
    }

    currentSentenceIdx = index;
    const currentSentence = sentences[index];
    options.onSentenceChange?.(index, currentSentence);

    if (index === 0) {
      options.onStart?.();
    }

    const utterance = new SpeechSynthesisUtterance(currentSentence);
    utterance.lang = lang;
    utterance.rate = targetRate;
    utterance.pitch = targetPitch;
    utterance.volume = targetVolume;

    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    // Retain utterance to prevent GC collection in Chrome
    activeUtterances.add(utterance);

    utterance.onend = () => {
      activeUtterances.delete(utterance);
      if (!isQueueRunning) return;

      // Natural pause between sentences for realistic human cadence
      const pauseDuration = /[!؟?.]/.test(currentSentence.slice(-1)) ? 320 : 180;
      setTimeout(() => {
        if (isQueueRunning) {
          speakNextSentence(index + 1);
        }
      }, pauseDuration);
    };

    utterance.onerror = (err) => {
      activeUtterances.delete(utterance);
      // Ignore cancellation events
      if (err.error === 'canceled' || err.error === 'interrupted') return;
      options.onError?.(err);

      setTimeout(() => {
        if (isQueueRunning) {
          speakNextSentence(index + 1);
        }
      }, 250);
    };

    window.speechSynthesis.speak(utterance);
  };

  speakNextSentence(0);
}

/**
 * Convenient helper to narrate Arabic texts with natural storytelling voice.
 */
export function speakArabicText(
  text: string, 
  options?: TTSOptions
) {
  playTTS(text, 'ar-SA', {
    rate: 0.90,
    pitch: 1.02,
    ...options
  });
}
