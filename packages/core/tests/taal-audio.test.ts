import {
  beatsToSeconds,
  beatsUntilSam,
  bolAt,
  cycleWindow,
  isKhali,
  isSam,
  pluckPartials,
  secondsToBeats,
  TAALS,
  taalById,
  tablaSpec,
  tanpuraHz,
  vibhagStartAt,
} from "@repo/core";
import { describe, expect, it } from "vitest";

describe("taal", () => {
  it("defines four cycles with matching theka lengths", () => {
    expect(TAALS).toHaveLength(4);
    for (const taal of TAALS) {
      expect(taal.theka).toHaveLength(taal.matras);
      expect(taal.vibhags[0]).toBe(0);
    }
  });

  it("wraps beats around the cycle", () => {
    const teentaal = taalById("teentaal");
    expect(bolAt(teentaal, 0)).toBe("Dha");
    expect(bolAt(teentaal, 8)).toBe("Dha");
    expect(bolAt(teentaal, 16)).toBe("Dha");
    expect(bolAt(teentaal, 17)).toBe("Dhin");
    expect(bolAt(teentaal, -1)).toBe("Dha");
  });

  it("identifies sam and khali", () => {
    const teentaal = taalById("teentaal");
    expect(isSam(teentaal, 0)).toBe(true);
    expect(isSam(teentaal, 16)).toBe(true);
    expect(isSam(teentaal, 4)).toBe(false);
    expect(isKhali(teentaal, 8)).toBe(true);
    expect(isKhali(teentaal, 10)).toBe(false);
    expect(isKhali(teentaal, 0)).toBe(false);

    const roopak = taalById("roopak");
    expect(isKhali(roopak, 0)).toBe(true);
  });

  it("finds the vibhag a beat belongs to", () => {
    const teentaal = taalById("teentaal");
    expect(vibhagStartAt(teentaal, 0)).toBe(0);
    expect(vibhagStartAt(teentaal, 5)).toBe(4);
    expect(vibhagStartAt(teentaal, 11)).toBe(8);
    expect(vibhagStartAt(teentaal, 15)).toBe(12);
  });

  it("counts beats until the next sam", () => {
    const jhaptal = taalById("jhaptal");
    expect(beatsUntilSam(jhaptal, 0)).toBe(0);
    expect(beatsUntilSam(jhaptal, 6)).toBe(4);
  });

  it("builds rolling cycle windows", () => {
    const keherwa = taalById("keherwa");
    expect(cycleWindow(keherwa, 6, 4)).toEqual([6, 7, 0, 1]);
  });
});

describe("audio maths", () => {
  it("normalises pluck partials", () => {
    const partials = pluckPartials(130.81);
    const total = partials.reduce((sum, partial) => sum + partial.gain, 0);
    expect(partials.length).toBeGreaterThan(5);
    expect(total).toBeCloseTo(1, 6);
    expect(partials[0]?.ratio).toBeCloseTo(1, 3);
    for (const partial of partials) {
      expect(partial.ratio * 130.81).toBeLessThan(12_000);
      expect(partial.decay).toBeGreaterThan(0);
    }
  });

  it("keeps partials inharmonic and decreasing", () => {
    const partials = pluckPartials(130.81);
    expect(partials[1]?.ratio).toBeGreaterThan(2);
    expect(partials[0]?.gain).toBeGreaterThan(partials[2]?.gain ?? 0);
  });

  it("converts beats and seconds", () => {
    expect(beatsToSeconds(16, 60)).toBe(16);
    expect(secondsToBeats(16, 60)).toBe(16);
    expect(beatsToSeconds(4, 120)).toBe(2);
    expect(() => beatsToSeconds(1, 0)).toThrow();
  });

  it("describes every tabla bol", () => {
    for (const bol of ["Dha", "Dhin", "Tin", "Ta", "Na", "Ti", "Dhi", "Ge", "Ka", "Ke"] as const) {
      const spec = tablaSpec(bol);
      expect(spec.pitch).toBeGreaterThan(50);
      expect(spec.duration).toBeGreaterThan(0);
      expect(spec.noise).toBeGreaterThanOrEqual(0);
    }
  });

  it("tunes the tanpura to the Sa", () => {
    const strings = tanpuraHz(130.81);
    expect(strings.sa).toBeCloseTo(130.81, 3);
    expect(strings.pa).toBeCloseTo(98.11, 1);
    expect(strings.saHigh).toBeCloseTo(261.62, 1);
  });
});
