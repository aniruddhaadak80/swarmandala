import { type PraharNumber, praharByNumber, praharDistance, praharForMinutes } from "./prahar";
import type { Raga, Season } from "./raga";

export interface ScoredRaga {
  readonly raga: Raga;
  readonly score: number;
  readonly reasons: readonly string[];
}

export interface RecommendOptions {
  readonly limit?: number;
  readonly season?: Season;
  readonly exclude?: readonly string[];
}

export function minuteOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

/** Meteorological seasons, mapped to the Indian year. */
export function seasonForMonth(month: number): Season {
  if (month === 1 || month === 2) return "spring";
  if (month >= 3 && month <= 5) return "summer";
  if (month >= 6 && month <= 8) return "monsoon";
  if (month === 9 || month === 10) return "autumn";
  return "winter";
}

function scoreForPrahar(current: PraharNumber, ragaPrahar: PraharNumber): number {
  const distance = praharDistance(ragaPrahar, current);
  if (distance === 0) return 100;
  if (distance === 1) return 32;
  if (distance === 2) return 12;
  return 0;
}

/**
 * Rank ragas for a moment of the day. Deterministic: the same minute and the
 * same dataset always produce the same order, which is what lets the Python
 * rasa-service parity-check this function.
 */
export function recommendRagas(
  ragas: readonly Raga[],
  minutes: number,
  options: RecommendOptions = {},
): ScoredRaga[] {
  const current = praharForMinutes(minutes);
  const season = options.season ?? seasonForMonth(new Date().getMonth());
  const excluded = new Set(options.exclude ?? []);
  const limit = options.limit ?? 3;

  return ragas
    .filter((raga) => !excluded.has(raga.slug))
    .map((raga) => {
      const reasons: string[] = [];
      let score = scoreForPrahar(current, raga.prahar);

      if (raga.prahar === current) {
        const prahar = praharByNumber(current);
        reasons.push(`Sung in the ${prahar.name} watch (${prahar.english.toLowerCase()})`);
      } else {
        const distance = praharDistance(raga.prahar, current);
        if (distance === 1) reasons.push("Opens the next watch");
        else if (distance === 2) reasons.push("Two watches away, still in the air");
      }

      if (raga.season === season) {
        score += 20;
        reasons.push(`A ${season} raga`);
      }

      if (raga.tags.includes("monsoon") && season === "monsoon") {
        score += 14;
        reasons.push("Monsoon music");
      }

      if (raga.tags.includes("closing")) {
        reasons.push("Traditionally closes a concert");
      }

      return { raga, score, reasons };
    })
    .sort((a, b) => b.score - a.score || a.raga.name.localeCompare(b.raga.name))
    .slice(0, limit);
}
