/**
 * The twelve swara positions of Hindustani music, written in the compact
 * notation used across the atlas. A trailing apostrophe raises the octave
 * (`S'`), a comma lowers it (`P,`). Tivra Ma is `M^` so it never collides
 * with the octave marker.
 */
export const SWARAS = ["S", "r", "R", "g", "G", "M", "M^", "P", "d", "D", "n", "N"] as const;

export type Swara = (typeof SWARAS)[number];

/** Semitones above the tonic Sa, within one octave. */
export const SWARA_SEMITONES: Record<Swara, number> = {
  S: 0,
  r: 1,
  R: 2,
  g: 3,
  G: 4,
  M: 5,
  "M^": 6,
  P: 7,
  d: 8,
  D: 9,
  n: 10,
  N: 11,
};

export const SWARA_LABELS: Record<Swara, string> = {
  S: "Sa",
  r: "komal Re",
  R: "Re",
  g: "komal Ga",
  G: "Ga",
  M: "Ma",
  "M^": "tivra Ma",
  P: "Pa",
  d: "komal Dha",
  D: "Dha",
  n: "komal Ni",
  N: "Ni",
};

export const SWARA_DEVANAGARI: Record<Swara, string> = {
  S: "सा",
  r: "रे",
  R: "रे",
  g: "ग",
  G: "ग",
  M: "म",
  "M^": "म॑",
  P: "प",
  d: "ध",
  D: "ध",
  n: "नि",
  N: "नि",
};

export interface ParsedNote {
  readonly swara: Swara;
  readonly octave: number;
}

export function isSwara(value: string): value is Swara {
  return (SWARAS as readonly string[]).includes(value);
}

/**
 * Parse a written note such as `S`, `M^`, `N'`, or `P,`.
 * Throws on anything outside the twelve-swara alphabet — data bugs should be loud.
 */
export function parseNote(note: string): ParsedNote {
  let body = note.trim();
  let octave = 0;

  while (body.endsWith("'")) {
    octave += 1;
    body = body.slice(0, -1);
  }
  while (body.endsWith(",")) {
    octave -= 1;
    body = body.slice(0, -1);
  }

  if (!isSwara(body)) {
    throw new Error(`Unknown swara: "${note}"`);
  }

  return { swara: body, octave };
}

/** Semitone distance from the tonic, counting octaves. */
export function noteSemitone(note: string): number {
  const { swara, octave } = parseNote(note);
  return SWARA_SEMITONES[swara] + octave * 12;
}

/** Equal-tempered frequency for a note against a chosen Sa. */
export function noteToHz(note: string, saHz: number): number {
  return saHz * 2 ** (noteSemitone(note) / 12);
}

export function isKomal(swara: Swara): boolean {
  return swara === "r" || swara === "g" || swara === "d" || swara === "n";
}

export function isTivra(swara: Swara): boolean {
  return swara === "M^";
}

/** Chromatic index (0–11) reduced from any written note. */
export function chromaOf(note: string): number {
  return ((noteSemitone(note) % 12) + 12) % 12;
}

/** The unique pitch classes of a phrase, in ascending chromatic order. */
export function swaraSet(notes: readonly string[]): Swara[] {
  const seen = new Set<number>();
  for (const note of notes) seen.add(chromaOf(note));
  return SWARAS.filter((swara) => seen.has(SWARA_SEMITONES[swara]));
}

export function transposeNote(note: string, semitones: number): string {
  const target = (((noteSemitone(note) + semitones) % 12) + 12) % 12;
  const swara = SWARAS.find((candidate) => SWARA_SEMITONES[candidate] === target);
  if (!swara) throw new Error(`Cannot transpose ${note} by ${semitones}`);
  return swara;
}

/** Western note name for a Sa frequency, used in the "tune to your voice" control. */
export const SA_CHOICES = [
  { label: "C", hz: 130.81 },
  { label: "C♯", hz: 138.59 },
  { label: "D", hz: 146.83 },
  { label: "D♯", hz: 155.56 },
  { label: "E", hz: 164.81 },
  { label: "F", hz: 174.61 },
  { label: "F♯", hz: 185.0 },
  { label: "G", hz: 196.0 },
] as const;
