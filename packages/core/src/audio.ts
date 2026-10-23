import type { Bol } from "./taal";

export interface Partial {
  /** Frequency multiplier over the fundamental. */
  readonly ratio: number;
  /** Linear amplitude, already normalised across the set. */
  readonly gain: number;
  /** Seconds for the partial to fall to ~1/e. */
  readonly decay: number;
}

/**
 * A plucked-string spectrum. Real strings are slightly inharmonic, which is
 * most of what makes a tanpura sound like a tanpura and not a sine chord.
 * Pure function so the shape can be unit-tested without an AudioContext.
 */
export function pluckPartials(fundamental: number, count = 9): Partial[] {
  const stiffness = 0.00008;
  const raw = Array.from({ length: count }, (_, index) => {
    const n = index + 1;
    const ratio = n * Math.sqrt(1 + stiffness * n * n);
    const gain = 1 / n ** 1.15;
    const decay = 3.4 / n ** 0.55;
    return { ratio, gain, decay, frequency: fundamental * ratio };
  });

  const usable = raw.filter((partial) => partial.frequency < 12_000);
  const total = usable.reduce((sum, partial) => sum + partial.gain, 0);
  return usable.map((partial) => ({
    ratio: partial.ratio,
    gain: partial.gain / total,
    decay: partial.decay,
  }));
}

export function beatsToSeconds(beats: number, bpm: number): number {
  if (bpm <= 0) throw new Error("Tempo must be positive");
  return (beats * 60) / bpm;
}

export function secondsToBeats(seconds: number, bpm: number): number {
  if (bpm <= 0) throw new Error("Tempo must be positive");
  return (seconds * bpm) / 60;
}

export interface TablaHit {
  /** Fundamental of the membrane, in Hz. */
  readonly pitch: number;
  /** Fraction the pitch falls to over the hit, 1 = no glide. */
  readonly drop: number;
  /** Glide duration in seconds. */
  readonly glide: number;
  readonly noise: number;
  readonly duration: number;
  readonly bright: boolean;
}

const BOL_SPECS: Record<Bol, TablaHit> = {
  Dha: { pitch: 146.8, drop: 0.62, glide: 0.09, noise: 0.32, duration: 0.55, bright: true },
  Dhin: { pitch: 146.8, drop: 0.7, glide: 0.12, noise: 0.18, duration: 0.7, bright: false },
  Tin: { pitch: 220.0, drop: 0.96, glide: 0.03, noise: 0.1, duration: 0.4, bright: true },
  Ta: { pitch: 196.0, drop: 0.92, glide: 0.03, noise: 0.22, duration: 0.26, bright: true },
  Na: { pitch: 246.9, drop: 0.95, glide: 0.02, noise: 0.16, duration: 0.22, bright: true },
  Ti: { pitch: 293.7, drop: 0.98, glide: 0.02, noise: 0.08, duration: 0.16, bright: true },
  Dhi: { pitch: 146.8, drop: 0.66, glide: 0.1, noise: 0.26, duration: 0.5, bright: false },
  Ge: { pitch: 110.0, drop: 0.85, glide: 0.05, noise: 0.12, duration: 0.35, bright: false },
  Ka: { pitch: 261.6, drop: 0.94, glide: 0.02, noise: 0.2, duration: 0.14, bright: true },
  Ke: { pitch: 329.6, drop: 0.96, glide: 0.02, noise: 0.14, duration: 0.12, bright: true },
};

export function tablaSpec(bol: Bol): TablaHit {
  return BOL_SPECS[bol];
}

export function tanpuraHz(saHz: number): { pa: number; sa: number; saHigh: number } {
  return { pa: saHz * (3 / 4), sa: saHz, saHigh: saHz * 2 };
}

/** Fade envelope keyframe helper used by both the drone and the pluck voices. */
export function adsr(
  peak: number,
  attack: number,
  decay: number,
  sustain: number,
  duration: number,
): { time: number; value: number }[] {
  const sustainLevel = peak * sustain;
  return [
    { time: 0, value: 0 },
    { time: attack, value: peak },
    { time: attack + decay, value: sustainLevel },
    { time: duration, value: 0 },
  ];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
