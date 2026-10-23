import { minuteOfDay, recommendRagas, seasonForMonth } from "@repo/core";
import { getRaga, RAGAS } from "@repo/seed";
import { describe, expect, it } from "vitest";

describe("recommendation", () => {
  it("puts a dawn raga first at dawn", () => {
    const [first] = recommendRagas(RAGAS, 5 * 60, { season: "winter" });
    expect(first?.raga.slug).toBe("bhairav");
  });

  it("puts an evening raga first at dusk", () => {
    const [first] = recommendRagas(RAGAS, 19 * 60 + 30, { season: "monsoon" });
    expect(first).toBeTruthy();
    expect(first?.raga.prahar).toBe(6);
  });

  it("returns the requested number of results", () => {
    expect(recommendRagas(RAGAS, 12 * 60, { limit: 5 })).toHaveLength(5);
    expect(recommendRagas(RAGAS, 12 * 60)).toHaveLength(3);
  });

  it("is deterministic for the same minute", () => {
    const a = recommendRagas(RAGAS, 22 * 60, { season: "monsoon", limit: 5 });
    const b = recommendRagas(RAGAS, 22 * 60, { season: "monsoon", limit: 5 });
    expect(a.map((entry) => entry.raga.slug)).toEqual(b.map((entry) => entry.raga.slug));
    expect(a.map((entry) => entry.score)).toEqual(b.map((entry) => entry.score));
  });

  it("boosts monsoon ragas in the monsoon", () => {
    const inJuly = recommendRagas(RAGAS, 21 * 60, { season: "monsoon", limit: 24 });
    const inMarch = recommendRagas(RAGAS, 21 * 60, { season: "summer", limit: 24 });
    const monsoonEntry = inJuly.find((entry) => entry.raga.slug === "miyan-ki-malhar");
    const summerEntry = inMarch.find((entry) => entry.raga.slug === "miyan-ki-malhar");
    expect(monsoonEntry).toBeTruthy();
    expect(summerEntry).toBeTruthy();
    expect(monsoonEntry?.score ?? 0).toBeGreaterThan(summerEntry?.score ?? 0);
  });

  it("explains why each raga was chosen", () => {
    const [first] = recommendRagas(RAGAS, 21 * 60, { season: "monsoon" });
    expect(first?.reasons.length).toBeGreaterThan(0);
    expect(first?.reasons.join(" ")).toMatch(/watch|monsoon|concert/i);
  });

  it("can exclude ragas", () => {
    const results = recommendRagas(RAGAS, 5 * 60, { exclude: ["bhairav"], limit: 3 });
    expect(results.map((entry) => entry.raga.slug)).not.toContain("bhairav");
  });

  it("never returns an unknown raga", () => {
    const results = recommendRagas(RAGAS, 3 * 60, { limit: 24 });
    for (const entry of results) {
      expect(getRaga(entry.raga.slug)).toBeDefined();
    }
  });
});

describe("calendar helpers", () => {
  it("maps Indian seasons", () => {
    expect(seasonForMonth(6)).toBe("monsoon");
    expect(seasonForMonth(0)).toBe("winter");
    expect(seasonForMonth(3)).toBe("summer");
    expect(seasonForMonth(9)).toBe("autumn");
    expect(seasonForMonth(1)).toBe("spring");
  });

  it("reads the clock in local minutes", () => {
    const date = new Date(2026, 9, 23, 18, 42);
    expect(minuteOfDay(date)).toBe(18 * 60 + 42);
  });
});
