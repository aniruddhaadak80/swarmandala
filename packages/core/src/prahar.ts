/**
 * The eight prahars: three-hour watches that give Hindustani music its clock.
 * A raga is not "morning music" in the abstract — it is bound to a watch.
 */
export type PraharNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface Prahar {
  readonly number: PraharNumber;
  readonly name: string;
  readonly devanagari: string;
  readonly english: string;
  readonly startHour: number;
  /** Exclusive end hour; prahar 7 wraps past midnight. */
  readonly endHour: number;
  readonly blurb: string;
}

export const PRAHARS: readonly Prahar[] = [
  {
    number: 1,
    name: "Bhor",
    devanagari: "भोर",
    english: "Dawn",
    startHour: 4,
    endHour: 7,
    blurb: "Before the first light. The tanpura is tuned while the sky is still indigo.",
  },
  {
    number: 2,
    name: "Pratah",
    devanagari: "प्रातः",
    english: "Morning",
    startHour: 7,
    endHour: 10,
    blurb: "The hour of straight-backed practice, before the day negotiates with you.",
  },
  {
    number: 3,
    name: "Madhyanha",
    devanagari: "मध्याह्न",
    english: "Late morning",
    startHour: 10,
    endHour: 13,
    blurb: "Heat gathers. Todi and Asavari carry the weight of the ascending sun.",
  },
  {
    number: 4,
    name: "Aparanha",
    devanagari: "अपराह्न",
    english: "Afternoon",
    startHour: 13,
    endHour: 16,
    blurb: "The slow hours. Bhimpalasi and Sarang keep the room cool.",
  },
  {
    number: 5,
    name: "Sayankal",
    devanagari: "सायंकाल",
    english: "Dusk",
    startHour: 16,
    endHour: 19,
    blurb: "Sandhi prakash — the meeting of light and dark, where Marwa and Puriya live.",
  },
  {
    number: 6,
    name: "Pradosha",
    devanagari: "प्रदोष",
    english: "Evening",
    startHour: 19,
    endHour: 22,
    blurb: "Lamps are lit. Yaman opens the night, Bhupali keeps it generous.",
  },
  {
    number: 7,
    name: "Ratri",
    devanagari: "रात्रि",
    english: "Night",
    startHour: 22,
    endHour: 1,
    blurb: "The long watch. Bageshri, Kafi, and the deep, patient Malkauns.",
  },
  {
    number: 8,
    name: "Nishith",
    devanagari: "निशीथ",
    english: "Midnight",
    startHour: 1,
    endHour: 4,
    blurb: "The still centre. Music for an empty room and a single lamp.",
  },
] as const;

const START_HOURS = [4, 7, 10, 13, 16, 19, 22, 1] as const;

export function praharForMinutes(minutes: number): PraharNumber {
  const m = ((minutes % 1440) + 1440) % 1440;
  if (m >= 240 && m < 420) return 1;
  if (m >= 420 && m < 600) return 2;
  if (m >= 600 && m < 780) return 3;
  if (m >= 780 && m < 960) return 4;
  if (m >= 960 && m < 1140) return 5;
  if (m >= 1140 && m < 1320) return 6;
  if (m >= 1320 || m < 60) return 7;
  return 8;
}

export function praharForHour(hour: number): PraharNumber {
  return praharForMinutes(hour * 60);
}

export function praharByNumber(number: PraharNumber): Prahar {
  const found = PRAHARS.find((prahar) => prahar.number === number);
  if (!found) throw new Error(`Unknown prahar: ${number}`);
  return found;
}

export function praharStartMinutes(number: PraharNumber): number {
  const hour = START_HOURS[number - 1];
  if (hour === undefined) throw new Error(`Unknown prahar: ${number}`);
  return hour * 60;
}

/** Position inside the current prahar, 0 at its first minute and →1 at its last. */
export function praharProgress(minutes: number): number {
  const m = ((minutes % 1440) + 1440) % 1440;
  const start = praharStartMinutes(praharForMinutes(m));
  const elapsed = (m - start + 1440) % 1440;
  return Math.min(1, Math.max(0, elapsed / 180));
}

export function nextPrahar(number: PraharNumber): PraharNumber {
  return ((number % 8) + 1) as PraharNumber;
}

export function previousPrahar(number: PraharNumber): PraharNumber {
  return (((((number - 2) % 8) + 8) % 8) + 1) as PraharNumber;
}

/** Three-hour distance between two watches, walking forward around the day. */
export function praharDistance(from: PraharNumber, to: PraharNumber): number {
  return (to - from + 8) % 8;
}

export function formatClock(minutes: number): string {
  const m = ((minutes % 1440) + 1440) % 1440;
  const hours = Math.floor(m / 60);
  const mins = Math.floor(m % 60);
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

export function formatHour(hour: number): string {
  const normalized = ((hour % 24) + 24) % 24;
  const suffix = normalized < 12 ? "am" : "pm";
  const twelve = normalized % 12 === 0 ? 12 : normalized % 12;
  return `${twelve} ${suffix}`;
}

export function praharWindowLabel(number: PraharNumber): string {
  const prahar = praharByNumber(number);
  return `${formatHour(prahar.startHour)} – ${formatHour(prahar.endHour)}`;
}

/** Angle on a 24-hour wheel: midnight at the top, clockwise. */
export function clockAngle(minutes: number): number {
  const m = ((minutes % 1440) + 1440) % 1440;
  return (m / 1440) * 360;
}
