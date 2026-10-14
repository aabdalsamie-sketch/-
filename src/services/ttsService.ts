/**
 * TTS Service using Gemini-3.8-flash-tts on the server
 * with audio caching and browser Web Speech API fallback
 */

class TtsService {
  private currentAudio: HTMLAudioElement | null = null;
  private audioCache: Map<string, string> = new Map();
  private isSpeaking = false;
  private listeners: Set<(speaking: boolean) => void> = new Set();

  public subscribe(listener: (speaking: boolean) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.isSpeaking));
  }

  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.notify();
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public async speakText(
    text: string,
    options: {
      speaker?: 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir';
      style?: string;
      onEnd?: () => void;
    } = {}
  ): Promise<void> {
    this.stop();
    this.isSpeaking = true;
    this.notify();

    const cacheKey = `${text}_${options.speaker || 'Kore'}`;

    // 1. Check in-memory audio cache
    if (this.audioCache.has(cacheKey)) {
      const dataUri = this.audioCache.get(cacheKey)!;
      this.playAudioUri(dataUri, options.onEnd);
      return;
    }

    // 2. Try server-side gemini-3.8-flash-tts
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          speaker: options.speaker || 'Kore',
          style:
            options.style ||
            'Gentle, cheerful, loving Egyptian Arabic cartoon narrator for a 5 year old child',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const dataUri = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
          this.audioCache.set(cacheKey, dataUri);
          this.playAudioUri(dataUri, options.onEnd);
          return;
        }
      }
    } catch (err) {
      console.warn('Gemini TTS server call error, falling back to Web Speech:', err);
    }

    // 3. Fallback: Browser Web Speech API
    this.speakViaWebSpeech(text, options.onEnd);
  }

  private playAudioUri(uri: string, onEnd?: () => void) {
    const audio = new Audio(uri);
    this.currentAudio = audio;

    audio.onended = () => {
      this.isSpeaking = false;
      this.notify();
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      console.warn('Audio playback error, falling back to Web Speech API');
      this.isSpeaking = false;
      this.notify();
      if (onEnd) onEnd();
    };

    audio.play().catch((e) => {
      console.warn('Audio play was interrupted or blocked by autoplay policy:', e);
      this.isSpeaking = false;
      this.notify();
    });
  }

  private speakViaWebSpeech(text: string, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      this.isSpeaking = false;
      this.notify();
      if (onEnd) onEnd();
      return;
    }

    // Clean text of non-pronounceable asterisks or special characters
    const cleanText = text.replace(/[*#_~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ar-EG';
    utterance.rate = 0.9; // Slower for 5-year-old kids
    utterance.pitch = 1.2; // Slightly higher, friendly pitch for kids

    // Pick best Arabic voice available
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice =
      voices.find((v) => v.lang.startsWith('ar') && (v.name.includes('Egypt') || v.lang.includes('EG'))) ||
      voices.find((v) => v.lang.startsWith('ar')) ||
      null;

    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onend = () => {
      this.isSpeaking = false;
      this.notify();
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.notify();
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }
}

export const ttsService = new TtsService();
