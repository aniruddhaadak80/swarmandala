import { type Bol, pluckPartials, tablaSpec } from "@repo/core";

type AudioContextCtor = typeof AudioContext;

function audioContextCtor(): AudioContextCtor {
  const legacy = window as Window & { webkitAudioContext?: AudioContextCtor };
  const ctor = window.AudioContext ?? legacy.webkitAudioContext;
  if (!ctor) throw new Error("Web Audio is not available in this browser.");
  return ctor;
}

/**
 * The whole instrument: a master bus, an additive pluck voice for the
 * tanpura, a membrane voice for the tabla, and a lookahead loop that keeps
 * the drone alive without scheduling hundreds of nodes at once.
 *
 * Nothing is created until the first user gesture; browsers require it and
 * so does good manners.
 */
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private droneTimer: number | null = null;
  private droneGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private muted = true;
  private volume = 0.9;

  ensureContext(): AudioContext {
    if (!this.ctx) {
      const ctx = new (audioContextCtor())();
      const master = ctx.createGain();
      master.gain.value = this.muted ? 0 : this.volume;
      master.connect(ctx.destination);
      this.ctx = ctx;
      this.master = master;
      this.noiseBuffer = this.makeNoise(ctx);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private makeNoise(ctx: AudioContext): AudioBuffer {
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.08), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) {
      data[index] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private targetGain(): number {
    return this.muted ? 0 : this.volume;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(this.targetGain(), now, 0.04);
  }

  setVolume(volume: number): void {
    this.volume = Math.min(1, Math.max(0, volume));
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(this.targetGain(), now, 0.04);
  }

  private pluck(hz: number, delay: number, level: number, destination: AudioNode): void {
    const ctx = this.ensureContext();
    const start = ctx.currentTime + delay;
    const partials = pluckPartials(hz, 10);

    for (const partial of partials) {
      const oscillator = ctx.createOscillator();
      const envelope = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(hz * partial.ratio, start);

      const peak = Math.max(0.0003, partial.gain * level);
      envelope.gain.setValueAtTime(0.0001, start);
      envelope.gain.exponentialRampToValueAtTime(peak, start + 0.012);
      envelope.gain.exponentialRampToValueAtTime(0.0001, start + Math.max(0.2, partial.decay));

      oscillator.connect(envelope);
      envelope.connect(destination);
      oscillator.start(start);
      oscillator.stop(start + partial.decay + 0.06);
    }

    if (this.noiseBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      const band = ctx.createBiquadFilter();
      band.type = "bandpass";
      band.frequency.value = Math.min(6000, hz * 3);
      band.Q.value = 0.9;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(level * 0.16, start);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.07);
      noise.connect(band);
      band.connect(noiseGain);
      noiseGain.connect(destination);
      noise.start(start);
      noise.stop(start + 0.09);
    }
  }

  playNote(hz: number, level = 0.2): void {
    const master = this.master;
    if (!master) {
      this.ensureContext();
      this.playNote(hz, level);
      return;
    }
    this.pluck(hz, 0, level, master);
  }

  playPhrase(frequencies: readonly number[], gapSeconds = 0.28, level = 0.18): void {
    const master = this.master;
    if (!master) {
      this.ensureContext();
      this.playPhrase(frequencies, gapSeconds, level);
      return;
    }
    frequencies.forEach((hz, index) => {
      this.pluck(hz, index * gapSeconds, level, master);
    });
  }

  playBol(bol: Bol, delay = 0): void {
    const ctx = this.ensureContext();
    const master = this.master;
    if (!master) return;
    const spec = tablaSpec(bol);
    const start = ctx.currentTime + delay;

    const body = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    body.type = "sine";
    body.frequency.setValueAtTime(spec.pitch * 1.7, start);
    body.frequency.exponentialRampToValueAtTime(
      Math.max(40, spec.pitch * spec.drop),
      start + spec.glide,
    );
    bodyGain.gain.setValueAtTime(0.0001, start);
    bodyGain.gain.exponentialRampToValueAtTime(0.42, start + 0.006);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, start + spec.duration);
    body.connect(bodyGain);
    bodyGain.connect(master);
    body.start(start);
    body.stop(start + spec.duration + 0.05);

    if (spec.bright) {
      const ring = ctx.createOscillator();
      const ringGain = ctx.createGain();
      ring.type = "triangle";
      ring.frequency.setValueAtTime(spec.pitch * 2.6, start);
      ringGain.gain.setValueAtTime(0.0001, start);
      ringGain.gain.exponentialRampToValueAtTime(0.09, start + 0.004);
      ringGain.gain.exponentialRampToValueAtTime(0.0001, start + spec.duration * 0.7);
      ring.connect(ringGain);
      ringGain.connect(master);
      ring.start(start);
      ring.stop(start + spec.duration);
    }

    if (this.noiseBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = spec.pitch * 4;
      filter.Q.value = 1.2;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(spec.noise * 0.5, start);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.06);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(master);
      noise.start(start);
      noise.stop(start + 0.07);
    }
  }

  startDrone(saHz: number): void {
    const ctx = this.ensureContext();
    const master = this.master;
    if (!master) return;

    this.stopDrone();

    const bus = ctx.createGain();
    bus.gain.value = 0.62;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2600;
    bus.connect(filter);
    filter.connect(master);
    this.droneGain = bus;

    const strings = [saHz * 0.75, saHz, saHz, saHz];
    let index = 0;

    const next = () => {
      const hz = strings[index % strings.length];
      if (hz === undefined) return;
      this.pluck(hz, 0.02, 0.24, bus);
      index += 1;
    };

    next();
    this.droneTimer = window.setInterval(next, 1150);
  }

  stopDrone(): void {
    if (this.droneTimer !== null) {
      window.clearInterval(this.droneTimer);
      this.droneTimer = null;
    }
    const bus = this.droneGain;
    this.droneGain = null;
    if (!bus || !this.ctx) return;
    const now = this.ctx.currentTime;
    bus.gain.cancelScheduledValues(now);
    bus.gain.setTargetAtTime(0, now, 0.22);
    window.setTimeout(() => bus.disconnect(), 1400);
  }

  get isDroneRunning(): boolean {
    return this.droneTimer !== null;
  }

  close(): void {
    this.stopDrone();
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
      this.master = null;
      this.noiseBuffer = null;
    }
  }
}
