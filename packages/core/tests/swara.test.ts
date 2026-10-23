import {
  chromaOf,
  noteSemitone,
  noteToHz,
  parseNote,
  SWARA_SEMITONES,
  swaraSet,
  transposeNote,
} from "@repo/core";
import { describe, expect, it } from "vitest";

describe("swara notation", () => {
  it("parses the twelve positions", () => {
    expect(parseNote("S")).toEqual({ swara: "S", octave: 0 });
    expect(parseNote("M^")).toEqual({ swara: "M^", octave: 0 });
    expect(parseNote("N'")).toEqual({ swara: "N", octave: 1 });
    expect(parseNote("P,")).toEqual({ swara: "P", octave: -1 });
  });

  it("rejects notes outside the alphabet", () => {
    expect(() => parseNote("X")).toThrow(/Unknown swara/);
    expect(() => parseNote("")).toThrow(/Unknown swara/);
  });

  it("maps komal and tivra swaras to semitones", () => {
    expect(noteSemitone("S")).toBe(0);
    expect(noteSemitone("r")).toBe(1);
    expect(noteSemitone("R")).toBe(2);
    expect(noteSemitone("M^")).toBe(6);
    expect(noteSemitone("N")).toBe(11);
  });

  it("counts octaves", () => {
    expect(noteSemitone("S'")).toBe(12);
    expect(noteSemitone("P'")).toBe(19);
    expect(noteSemitone("S,")).toBe(-12);
  });

  it("tunes against a chosen Sa", () => {
    expect(noteToHz("S", 130.81)).toBeCloseTo(130.81, 4);
    expect(noteToHz("S'", 130.81)).toBeCloseTo(261.62, 1);
    expect(noteToHz("P", 130.81)).toBeCloseTo(196.0, 0);
    expect(noteToHz("M^", 130.81)).toBeCloseTo(185.0, 0);
  });

  it("reduces notes to pitch classes", () => {
    expect(chromaOf("S'")).toBe(0);
    expect(chromaOf("N")).toBe(11);
    expect(chromaOf("S,")).toBe(0);
  });

  it("keeps the chromatic table consistent", () => {
    const values = Object.values(SWARA_SEMITONES);
    expect(new Set(values).size).toBe(12);
  });
});

describe("swara sets", () => {
  it("deduplicates and orders chromatically", () => {
    expect(swaraSet(["S", "R", "G", "P", "D", "S'", "R'"])).toEqual(["S", "R", "G", "P", "D"]);
  });

  it("keeps both Ma when a raga uses them", () => {
    expect(swaraSet(["S", "M", "M^", "P"])).toEqual(["S", "M", "M^", "P"]);
  });

  it("transposes within the octave", () => {
    expect(transposeNote("S", 7)).toBe("P");
    expect(transposeNote("P", 5)).toBe("S");
    expect(transposeNote("N", 1)).toBe("S");
  });
});
