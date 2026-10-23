import type { PraharNumber } from "./prahar";
import { type Swara, swaraSet } from "./swara";

export type RasaId =
  | "shringar"
  | "hasya"
  | "karuna"
  | "raudra"
  | "veera"
  | "bhayanaka"
  | "bibhatsa"
  | "adbhuta"
  | "shanta";

export const RASA_LABELS: Record<RasaId, { english: string; devanagari: string; gloss: string }> = {
  shringar: { english: "Shringar", devanagari: "शृंगार", gloss: "love, adornment" },
  hasya: { english: "Hasya", devanagari: "हास्य", gloss: "laughter" },
  karuna: { english: "Karuna", devanagari: "करुणा", gloss: "compassion, grief" },
  raudra: { english: "Raudra", devanagari: "रौद्र", gloss: "fury" },
  veera: { english: "Veera", devanagari: "वीर", gloss: "courage" },
  bhayanaka: { english: "Bhayanaka", devanagari: "भयानक", gloss: "fear" },
  bibhatsa: { english: "Bibhatsa", devanagari: "वीभत्स", gloss: "revulsion" },
  adbhuta: { english: "Adbhuta", devanagari: "अद्भुत", gloss: "wonder" },
  shanta: { english: "Shanta", devanagari: "शांत", gloss: "peace" },
};

export type Thaat =
  | "Bilaval"
  | "Khamaj"
  | "Kafi"
  | "Asavari"
  | "Bhairavi"
  | "Bhairav"
  | "Kalyan"
  | "Marwa"
  | "Poorvi"
  | "Todi";

export const THAAT_SWARAS: Record<Thaat, readonly Swara[]> = {
  Bilaval: ["S", "R", "G", "M", "P", "D", "N"],
  Khamaj: ["S", "R", "G", "M", "P", "D", "n"],
  Kafi: ["S", "R", "g", "M", "P", "D", "n"],
  Asavari: ["S", "R", "g", "M", "P", "d", "n"],
  Bhairavi: ["S", "r", "g", "M", "P", "d", "n"],
  Bhairav: ["S", "r", "G", "M", "P", "d", "N"],
  Kalyan: ["S", "R", "G", "M^", "P", "D", "N"],
  Marwa: ["S", "r", "G", "M^", "D", "N"],
  Poorvi: ["S", "r", "G", "M^", "P", "d", "N"],
  Todi: ["S", "r", "g", "M", "P", "d", "N"],
};

export type Season = "spring" | "summer" | "monsoon" | "autumn" | "winter";

export interface Raga {
  readonly slug: string;
  readonly name: string;
  readonly devanagari: string;
  readonly thaat: Thaat;
  /** Ascending phrase. Octave markers are part of the notation, e.g. `S'`. */
  readonly aroha: readonly string[];
  /** Descending phrase. */
  readonly avaroha: readonly string[];
  readonly vadi: Swara | null;
  readonly samvadi: Swara | null;
  readonly prahar: PraharNumber;
  readonly rasa: readonly RasaId[];
  readonly mood: string;
  /** The signature phrase that identifies the raga by ear. */
  readonly pakad: readonly string[];
  readonly description: string;
  readonly tags: readonly string[];
  readonly season?: Season;
}

export function uniqueNotes(raga: Raga): Swara[] {
  return swaraSet([...raga.aroha, ...raga.avaroha]);
}

export interface RagaComparison {
  readonly shared: readonly Swara[];
  readonly onlyA: readonly Swara[];
  readonly onlyB: readonly Swara[];
  /** Jaccard similarity of the two pitch-class sets, 0–1. */
  readonly similarity: number;
}

export function compareRagas(a: Raga, b: Raga): RagaComparison {
  const setA = new Set(uniqueNotes(a));
  const setB = new Set(uniqueNotes(b));
  const shared = [...setA].filter((swara) => setB.has(swara));
  const onlyA = [...setA].filter((swara) => !setB.has(swara));
  const onlyB = [...setB].filter((swara) => !setA.has(swara));
  const union = new Set([...setA, ...setB]);
  return {
    shared,
    onlyA,
    onlyB,
    similarity: union.size === 0 ? 0 : shared.length / union.size,
  };
}

export function ragasByThaat(ragas: readonly Raga[], thaat: Thaat): Raga[] {
  return ragas.filter((raga) => raga.thaat === thaat);
}

export function ragasByPrahar(ragas: readonly Raga[], prahar: PraharNumber): Raga[] {
  return ragas.filter((raga) => raga.prahar === prahar);
}

export function searchRagas(ragas: readonly Raga[], query: string): Raga[] {
  const needle = query.trim().toLowerCase();
  if (needle.length === 0) return [...ragas];
  return ragas.filter((raga) => {
    const haystack = [raga.name, raga.devanagari, raga.thaat, raga.mood, ...raga.tags]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}

/** Ragas that share a thaat, or at least two pitch classes, excluding the raga itself. */
export function relatedRagas(raga: Raga, ragas: readonly Raga[], limit = 4): Raga[] {
  const own = new Set(uniqueNotes(raga));
  return ragas
    .filter((candidate) => candidate.slug !== raga.slug)
    .map((candidate) => {
      const shared = uniqueNotes(candidate).filter((swara) => own.has(swara)).length;
      const sameThaat = candidate.thaat === raga.thaat ? 1 : 0;
      return { candidate, score: shared + sameThaat * 2 };
    })
    .sort((a, b) => b.score - a.score || a.candidate.name.localeCompare(b.candidate.name))
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

export function pitchClassSignature(raga: Raga): string {
  return uniqueNotes(raga)
    .map((swara) => swara.replace("^", "t"))
    .join("-");
}
