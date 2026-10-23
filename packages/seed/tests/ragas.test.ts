import {
  compareRagas,
  pitchClassSignature,
  relatedRagas,
  searchRagas,
  uniqueNotes,
} from "@repo/core";
import { assertValidRagas, getRaga, RAGA_COUNT, RAGAS, validateRagas } from "@repo/seed";
import { describe, expect, it } from "vitest";

describe("raga dataset", () => {
  it("ships exactly 24 unique ragas", () => {
    expect(RAGA_COUNT).toBe(24);
    expect(new Set(RAGAS.map((raga) => raga.slug)).size).toBe(24);
  });

  it("passes its own validation with zero issues", () => {
    expect(validateRagas(RAGAS)).toEqual([]);
    expect(() => assertValidRagas()).not.toThrow();
  });

  it("covers every prahar with at least two ragas", () => {
    for (let prahar = 1; prahar <= 8; prahar += 1) {
      const count = RAGAS.filter((raga) => raga.prahar === prahar).length;
      expect(count, `prahar ${prahar}`).toBeGreaterThanOrEqual(2);
    }
  });

  it("places known ragas in the right watch", () => {
    expect(getRaga("bhairav")?.prahar).toBe(1);
    expect(getRaga("yaman")?.prahar).toBe(6);
    expect(getRaga("malkauns")?.prahar).toBe(8);
    expect(getRaga("bhimpalasi")?.prahar).toBe(4);
  });

  it("gives every raga a Devanagari name and a pakad", () => {
    for (const raga of RAGAS) {
      expect(raga.devanagari).toMatch(/[\u0900-\u097F]/);
      expect(raga.pakad.length).toBeGreaterThanOrEqual(4);
      expect(raga.mood.length).toBeGreaterThan(20);
    }
  });

  it("only uses notes from the declared thaat where the raga is not mixed", () => {
    const mixed = new Set(["ahir-bhairav", "pilu", "miyan-ki-malhar", "lalit"]);
    for (const raga of RAGAS) {
      if (mixed.has(raga.slug)) continue;
      expect(raga.thaat, raga.slug).toBeTruthy();
    }
  });
});

describe("raga relationships", () => {
  it("compares Marwa and Puriya as near-identical scales", () => {
    const marwa = getRaga("marwa");
    const puriya = getRaga("puriya");
    expect(marwa).toBeTruthy();
    expect(puriya).toBeTruthy();
    if (!marwa || !puriya) return;
    const comparison = compareRagas(marwa, puriya);
    expect(comparison.similarity).toBe(1);
    expect(comparison.onlyA).toEqual([]);
    expect(comparison.onlyB).toEqual([]);
  });

  it("finds Bhairav and Ahir Bhairav as relatives", () => {
    const bhairav = getRaga("bhairav");
    expect(bhairav).toBeTruthy();
    if (!bhairav) return;
    const related = relatedRagas(bhairav, RAGAS);
    expect(related.map((raga) => raga.slug)).toContain("ahir-bhairav");
  });

  it("builds stable pitch-class signatures", () => {
    const yaman = getRaga("yaman");
    expect(yaman).toBeTruthy();
    if (!yaman) return;
    expect(uniqueNotes(yaman)).toEqual(["S", "R", "G", "M^", "P", "D", "N"]);
    expect(pitchClassSignature(yaman)).toBe("S-R-G-Mt-P-D-N");
  });

  it("searches names, thaats, and tags", () => {
    expect(searchRagas(RAGAS, "bhairav").map((r) => r.slug)).toContain("bhairav");
    expect(searchRagas(RAGAS, "monsoon").map((r) => r.slug)).toContain("miyan-ki-malhar");
    expect(searchRagas(RAGAS, "काफ़ी").map((r) => r.slug)).toContain("kafi");
    expect(searchRagas(RAGAS, "  ")).toHaveLength(24);
  });
});
