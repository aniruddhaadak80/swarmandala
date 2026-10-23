import {
  clockAngle,
  formatClock,
  formatHour,
  nextPrahar,
  PRAHARS,
  praharDistance,
  praharForHour,
  praharForMinutes,
  praharProgress,
  praharWindowLabel,
} from "@repo/core";
import { describe, expect, it } from "vitest";

describe("prahar boundaries", () => {
  const cases: [number, number][] = [
    [4, 1],
    [6, 1],
    [7, 2],
    [9, 2],
    [10, 3],
    [12, 3],
    [13, 4],
    [15, 4],
    [16, 5],
    [18, 5],
    [19, 6],
    [21, 6],
    [22, 7],
    [23, 7],
    [0, 7],
    [1, 8],
    [3, 8],
  ];

  it.each(cases)("hour %i belongs to prahar %i", (hour, expected) => {
    expect(praharForHour(hour)).toBe(expected);
    expect(praharForMinutes(hour * 60)).toBe(expected);
  });

  it("handles minute-level edges", () => {
    expect(praharForMinutes(3 * 60 + 59)).toBe(8);
    expect(praharForMinutes(4 * 60)).toBe(1);
    expect(praharForMinutes(6 * 60 + 59)).toBe(1);
    expect(praharForMinutes(7 * 60)).toBe(2);
    expect(praharForMinutes(23 * 60 + 59)).toBe(7);
    expect(praharForMinutes(0)).toBe(7);
  });

  it("wraps negative minutes", () => {
    expect(praharForMinutes(-60)).toBe(7);
    expect(praharForMinutes(-180)).toBe(6);
  });

  it("describes each window", () => {
    expect(praharWindowLabel(1)).toBe("4 am – 7 am");
    expect(praharWindowLabel(6)).toBe("7 pm – 10 pm");
    expect(praharWindowLabel(7)).toBe("10 pm – 1 am");
  });

  it("has eight complete watches", () => {
    expect(PRAHARS).toHaveLength(8);
    expect(PRAHARS.map((prahar) => prahar.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    for (const prahar of PRAHARS) {
      expect(prahar.blurb.length).toBeGreaterThan(20);
    }
  });

  it("advances and measures distance around the wheel", () => {
    expect(nextPrahar(1)).toBe(2);
    expect(nextPrahar(8)).toBe(1);
    expect(praharDistance(1, 1)).toBe(0);
    expect(praharDistance(8, 1)).toBe(1);
    expect(praharDistance(1, 8)).toBe(7);
  });

  it("reports progress inside the watch", () => {
    expect(praharProgress(4 * 60)).toBe(0);
    expect(praharProgress(5 * 60 + 30)).toBeCloseTo(0.5, 5);
    expect(praharProgress(6 * 60 + 59)).toBeGreaterThan(0.99);
  });

  it("formats clocks and hours", () => {
    expect(formatClock(0)).toBe("00:00");
    expect(formatClock(18 * 60 + 5)).toBe("18:05");
    expect(formatHour(0)).toBe("12 am");
    expect(formatHour(12)).toBe("12 pm");
    expect(formatHour(22)).toBe("10 pm");
  });

  it("places midnight at the top of the wheel", () => {
    expect(clockAngle(0)).toBe(0);
    expect(clockAngle(12 * 60)).toBe(180);
    expect(clockAngle(6 * 60)).toBe(90);
  });
});
