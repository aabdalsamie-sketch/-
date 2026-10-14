/**
 * Gemini-3.8-live Client Service
 * Connects to the backend WebSocket at /live for real-time voice conversations
 */

export interface LiveStatus {
  connected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  error: string | null;
}

class LiveService {
  private ws: WebSocket | null = null;
  private inputAudioCtx: AudioContext | null = null;
  private outputAudioCtx: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private statusListeners: Set<(status: LiveStatus) => void> = new Set();
  private audioQueue: ArrayBuffer[] = [];
  private isPlayingQueue = false;

  private currentStatus: LiveStatus = {
    connected: false,
    isListening: false,
    isSpeaking: false,
    error: null,
  };

  public subscribe(listener: (status: LiveStatus) => void) {
    this.statusListeners.add(listener);
    listener(this.currentStatus);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  private updateStatus(patch: Partial<LiveStatus>) {
    this.currentStatus = { ...this.currentStatus, ...patch };
    this.statusListeners.forEach((l) => l(this.currentStatus));
  }

  public async connect(): Promise<void> {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.updateStatus({ connected: true, error: null });
      };

      this.ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.error) {
            this.updateStatus({ error: msg.error });
          }
          if (msg.interrupted) {
            this.audioQueue = [];
            this.updateStatus({ isSpeaking: false });
          }
          if (msg.audio) {
            this.handleIncomingAudio(msg.audio);
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      this.ws.onerror = (_e) => {
        this.updateStatus({
          connected: false,
          error: 'تعذر الاتصال برفيق الصلاة المباشر. تأكد من إعداد المفتاح وسيرفر التطبيق.',
        });
      };

      this.ws.onclose = () => {
        this.updateStatus({ connected: false, isListening: false, isSpeaking: false });
        this.stopMic();
      };
    } catch (err: any) {
      this.updateStatus({ connected: false, error: err?.message || 'Connection failed' });
    }
  }

  public async startMic(): Promise<void> {
    try {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        await this.connect();
      }

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.inputAudioCtx = new AudioCtx({ sampleRate: 16000 });
      this.outputAudioCtx = new AudioCtx({ sampleRate: 24000 });

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      const source = this.inputAudioCtx.createMediaStreamSource(this.mediaStream);
      this.scriptProcessor = this.inputAudioCtx.createScriptProcessor(4096, 1, 1);

      source.connect(this.scriptProcessor);
      this.scriptProcessor.connect(this.inputAudioCtx.destination);

      this.scriptProcessor.onaudioprocess = (e) => {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmBase64 = this.pcmFloat32ToBase64(inputData);
        this.ws.send(JSON.stringify({ audio: pcmBase64 }));
      };

      this.updateStatus({ isListening: true, error: null });
    } catch (err: any) {
      console.error('Error starting microphone for Live API:', err);
      this.updateStatus({
        isListening: false,
        error: 'لم نتمكن من الوصول للميكروفون. يمكنك الضغط على الأسئلة السريعة لسماع سمسم!',
      });
    }
  }

  public stopMic(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect();
      this.scriptProcessor = null;
    }
    if (this.inputAudioCtx) {
      this.inputAudioCtx.close();
      this.inputAudioCtx = null;
    }
    this.updateStatus({ isListening: false });
  }

  public disconnect(): void {
    this.stopMic();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.outputAudioCtx) {
      this.outputAudioCtx.close();
      this.outputAudioCtx = null;
    }
    this.updateStatus({ connected: false, isListening: false, isSpeaking: false, error: null });
  }

  // Convert Float32Array to 16-bit PCM little-endian Base64
  private pcmFloat32ToBase64(float32Array: Float32Array): string {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // Play incoming 24kHz PCM from Gemini-3.8-live
  private handleIncomingAudio(base64Audio: string) {
    try {
      const binary = atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      this.audioQueue.push(bytes.buffer);
      this.updateStatus({ isSpeaking: true });
      if (!this.isPlayingQueue) {
        this.playAudioQueue();
      }
    } catch (e) {
      console.error('Error handling incoming audio chunk:', e);
    }
  }

  private async playAudioQueue() {
    if (this.audioQueue.length === 0) {
      this.isPlayingQueue = false;
      this.updateStatus({ isSpeaking: false });
      return;
    }

    this.isPlayingQueue = true;
    if (!this.outputAudioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.outputAudioCtx = new AudioCtx({ sampleRate: 24000 });
    }
    if (this.outputAudioCtx.state === 'suspended') {
      await this.outputAudioCtx.resume();
    }

    const rawBuffer = this.audioQueue.shift()!;
    const int16View = new Int16Array(rawBuffer);
    const float32Data = new Float32Array(int16View.length);

    for (let i = 0; i < int16View.length; i++) {
      float32Data[i] = int16View[i] / 32768.0;
    }

    const audioBuffer = this.outputAudioCtx.createBuffer(1, float32Data.length, 24000);
    audioBuffer.getChannelData(0).set(float32Data);

    const source = this.outputAudioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.outputAudioCtx.destination);

    source.onended = () => {
      this.playAudioQueue();
    };

    source.start();
  }
}

export const liveService = new LiveService();
