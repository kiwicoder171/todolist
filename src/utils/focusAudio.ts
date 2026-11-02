"use client";

export type AmbientSoundType = "off" | "rain" | "brown" | "white" | "stream";

class WebAudioService {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private currentAmbient: AmbientSoundType = "off";
  private currentVolume = 0.4;
  private isMuted = false;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.noiseGain) {
      this.noiseGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    } else if (!muted && this.noiseGain && this.ctx) {
      this.noiseGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
    }
  }

  public setVolume(volume: number) {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.noiseGain && this.ctx && !this.isMuted) {
      this.noiseGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
    }
  }

  /**
   * Play short, subtle tick when user adjusts volume
   */
  public playVolumeTick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (_) {}
  }

  /**
   * Play synthetic bell chime using harmonic sine oscillators (zero external audio file dependency)
   */
  public playChime(type: "pomodoro" | "cheer" | "break") {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const gainNode = ctx.createGain();
      gainNode.connect(ctx.destination);

      if (type === "pomodoro") {
        // Double Tibetan singing bowl chime: 528 Hz & 1056 Hz with smooth decay
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = "sine";
        osc2.type = "sine";
        osc1.frequency.setValueAtTime(528, now); // Solfeggio 528 Hz
        osc2.frequency.setValueAtTime(1056, now + 0.1);

        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.exponentialRampToValueAtTime(0.3, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        osc1.start(now);
        osc2.start(now + 0.1);
        osc1.stop(now + 2.5);
        osc2.stop(now + 2.5);
      } else if (type === "cheer") {
        // High celebratory harmonic ping
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(659.25, now); // E5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(0.25, now + 0.03);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 0.85);
      } else {
        // Gentle break transition chime
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now); // A4
        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.04);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 1.3);
      }
    } catch (_) {}
  }

  /**
   * Start procedural looping noise generator
   */
  public startAmbient(type: AmbientSoundType) {
    this.stopAmbient();
    if (type === "off" || this.isMuted) {
      this.currentAmbient = type;
      return;
    }

    const ctx = this.getContext();
    if (!ctx) return;

    try {
      this.currentAmbient = type;
      const bufferSize = ctx.sampleRate * 2; // 2 seconds looping buffer
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === "brown" || type === "rain") {
          // Brown noise integration filter
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        } else if (type === "stream") {
          // Soft pink-like noise
          data[i] = (lastOut + 0.05 * white) / 1.05;
          lastOut = data[i];
          data[i] *= 2.2;
        } else {
          // White noise
          data[i] = white * 0.15;
        }
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      // Filter based on ambient type
      const filter = ctx.createBiquadFilter();
      if (type === "rain") {
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, ctx.currentTime);
      } else if (type === "brown") {
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(400, ctx.currentTime);
      } else if (type === "stream") {
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
        filter.Q.setValueAtTime(0.8, ctx.currentTime);
      } else {
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(2500, ctx.currentTime);
      }

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(this.currentVolume, ctx.currentTime + 0.5);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start();
      this.noiseNode = source;
      this.noiseGain = gain;
    } catch (_) {}
  }

  public stopAmbient() {
    if (this.noiseGain && this.ctx) {
      try {
        this.noiseGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      } catch (_) {}
    }
    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch (_) {}
      this.noiseNode = null;
    }
    this.noiseGain = null;
    this.currentAmbient = "off";
  }

  public getCurrentAmbient(): AmbientSoundType {
    return this.currentAmbient;
  }
}

export const focusAudio = new WebAudioService();
