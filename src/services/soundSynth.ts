/**
 * Gentle Web Audio Synthesizer for Kids Prayer Learning
 * Creates peaceful, soothing lullaby/nasheed melodic background music & child-friendly SFX
 */

class SoundSynthManager {
  private ctx: AudioContext | null = null;
  private isPlayingBgm = false;
  private bgmInterval: number | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private currentVolume = 0.25;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Pentatonic gentle calm lullaby melody notes (Hz)
  private melodyNotes = [
    { freq: 261.63, dur: 0.8 }, // C4
    { freq: 293.66, dur: 0.8 }, // D4
    { freq: 329.63, dur: 1.2 }, // E4
    { freq: 392.00, dur: 0.8 }, // G4
    { freq: 440.00, dur: 1.2 }, // A4
    { freq: 392.00, dur: 0.8 }, // G4
    { freq: 329.63, dur: 1.0 }, // E4
    { freq: 293.66, dur: 1.2 }, // D4
    { freq: 261.63, dur: 1.6 }, // C4
    { freq: 329.63, dur: 0.8 }, // E4
    { freq: 392.00, dur: 0.8 }, // G4
    { freq: 523.25, dur: 1.4 }, // C5
    { freq: 440.00, dur: 1.0 }, // A4
    { freq: 392.00, dur: 1.2 }, // G4
    { freq: 329.63, dur: 1.6 }, // E4
  ];

  public startBgm() {
    this.initContext();
    if (this.isPlayingBgm || !this.ctx || !this.bgmGain) return;

    this.isPlayingBgm = true;
    let noteIndex = 0;

    const playNextNote = () => {
      if (!this.isPlayingBgm || !this.ctx || !this.bgmGain) return;

      const note = this.melodyNotes[noteIndex % this.melodyNotes.length];
      const now = this.ctx.currentTime;

      // Primary warm chime osc
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, now);

      // Subtle harmonic for music-box feel
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(note.freq * 2, now);
      const osc2Gain = this.ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.12, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);

      // Soft envelope for tranquil listening
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(0.18, now + 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + note.dur + 0.4);

      osc.connect(filter);
      osc2.connect(osc2Gain);
      osc2Gain.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.bgmGain);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + note.dur + 0.5);
      osc2.stop(now + note.dur + 0.5);

      noteIndex++;
      this.bgmInterval = window.setTimeout(playNextNote, (note.dur + 0.2) * 1000);
    };

    playNextNote();
  }

  public stopBgm() {
    this.isPlayingBgm = false;
    if (this.bgmInterval) {
      clearTimeout(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public toggleBgm(): boolean {
    if (this.isPlayingBgm) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
    }
  }

  public isBgmActive(): boolean {
    return this.isPlayingBgm;
  }

  // Cheerful chime sound for step transition
  public playStepChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const now = this.ctx!.currentTime + idx * 0.08;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 0.7);
    });
  }

  // Celebratory fanfare for completing prayer or quiz
  public playFanfare() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const chords = [
      [261.63, 329.63, 392.0], // C
      [293.66, 369.99, 440.0], // D
      [329.63, 415.3, 493.88], // E
      [523.25, 659.25, 783.99, 1046.5], // High C Major
    ];

    chords.forEach((chord, i) => {
      const time = this.ctx!.currentTime + i * 0.16;
      chord.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = i === 3 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.14, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + (i === 3 ? 1.4 : 0.4));

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(time);
        osc.stop(time + (i === 3 ? 1.5 : 0.5));
      });
    });
  }
}

export const soundSynth = new SoundSynthManager();
