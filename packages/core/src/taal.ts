/** Cyclic rhythm: the theka is the skeleton every practice session hangs on. */
export type TaalId = "teentaal" | "jhaptal" | "roopak" | "keherwa";

export type Bol = "Dha" | "Dhin" | "Tin" | "Ta" | "Na" | "Ti" | "Dhi" | "Ge" | "Ka" | "Ke";

export interface Taal {
  readonly id: TaalId;
  readonly name: string;
  readonly devanagari: string;
  readonly matras: number;
  /** Matra indices (0-based) where a vibhag begins. */
  readonly vibhags: readonly number[];
  /** One bol per matra, starting at sam. */
  readonly theka: readonly Bol[];
  /** Matra indices (0-based) played open / khali. */
  readonly khali: readonly number[];
  readonly description: string;
}

export const TAALS: readonly Taal[] = [
  {
    id: "teentaal",
    name: "Teentaal",
    devanagari: "तीनताल",
    matras: 16,
    vibhags: [0, 4, 8, 12],
    theka: [
      "Dha",
      "Dhin",
      "Dhin",
      "Dha",
      "Dha",
      "Dhin",
      "Dhin",
      "Dha",
      "Dha",
      "Tin",
      "Tin",
      "Ta",
      "Ta",
      "Dhin",
      "Dhin",
      "Dha",
    ],
    khali: [8],
    description: "Sixteen matras, four vibhags of four. The most common cycle in khayal.",
  },
  {
    id: "jhaptal",
    name: "Jhaptal",
    devanagari: "झपताल",
    matras: 10,
    vibhags: [0, 2, 5, 7],
    theka: ["Dhi", "Na", "Dhi", "Dhi", "Na", "Ti", "Na", "Dhi", "Dhi", "Na"],
    khali: [5],
    description: "Ten matras in 2+3+2+3. A favourite for slower khayal and thumri.",
  },
  {
    id: "roopak",
    name: "Roopak",
    devanagari: "रूपक",
    matras: 7,
    vibhags: [0, 3, 5],
    theka: ["Tin", "Tin", "Na", "Dhin", "Na", "Dhin", "Na"],
    khali: [0],
    description: "Seven matras in 3+2+2 — the rare cycle whose sam is khali.",
  },
  {
    id: "keherwa",
    name: "Keherwa",
    devanagari: "कहरवा",
    matras: 8,
    vibhags: [0, 4],
    theka: ["Dha", "Ge", "Na", "Ti", "Na", "Ka", "Dhi", "Na"],
    khali: [4],
    description: "Eight matras, two vibhags of four. The everyday folk cycle.",
  },
] as const;

export function taalById(id: TaalId): Taal {
  const found = TAALS.find((taal) => taal.id === id);
  if (!found) throw new Error(`Unknown taal: ${id}`);
  return found;
}

export function bolAt(taal: Taal, beat: number): Bol {
  const index = ((beat % taal.matras) + taal.matras) % taal.matras;
  const bol = taal.theka[index];
  if (!bol) throw new Error(`Missing bol ${index} in ${taal.id}`);
  return bol;
}

export function isSam(taal: Taal, beat: number): boolean {
  return ((beat % taal.matras) + taal.matras) % taal.matras === 0;
}

export function isKhali(taal: Taal, beat: number): boolean {
  return taal.khali.some((khali) => khali === ((beat % taal.matras) + taal.matras) % taal.matras);
}

export function vibhagStartAt(taal: Taal, beat: number): number {
  const index = ((beat % taal.matras) + taal.matras) % taal.matras;
  let start = 0;
  for (const vibhag of taal.vibhags) {
    if (vibhag <= index) start = vibhag;
  }
  return start;
}

export function beatsUntilSam(taal: Taal, beat: number): number {
  const index = ((beat % taal.matras) + taal.matras) % taal.matras;
  return (taal.matras - index) % taal.matras;
}

/** Beats shown before wrapping the cycle, useful for the console's rolling view. */
export function cycleWindow(taal: Taal, beat: number, size: number): number[] {
  return Array.from({ length: size }, (_, offset) => (beat + offset) % taal.matras);
}
