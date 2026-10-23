import { praharForMinutes, recommendRagas, type Season, seasonForMonth } from "@repo/core";
import { RAGAS } from "@repo/seed";
import { NextResponse } from "next/server";

const SEASONS: readonly Season[] = ["spring", "summer", "monsoon", "autumn", "winter"];

function parseTime(value: string | null): number | null {
  if (!value) return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const at = url.searchParams.get("at");
  const requested = parseTime(at);

  const now = new Date();
  const minutes = requested ?? now.getHours() * 60 + now.getMinutes();

  const seasonParam = url.searchParams.get("season");
  const season =
    seasonParam && (SEASONS as readonly string[]).includes(seasonParam)
      ? (seasonParam as Season)
      : seasonForMonth(now.getMonth());

  const limitParam = Number(url.searchParams.get("limit") ?? "3");
  const limit = Number.isFinite(limitParam) ? Math.min(24, Math.max(1, Math.trunc(limitParam))) : 3;

  if (at !== null && requested === null) {
    return NextResponse.json(
      { error: "Invalid `at` — use 24-hour HH:MM, for example 18:45." },
      { status: 400 },
    );
  }

  if (seasonParam !== null && !(SEASONS as readonly string[]).includes(seasonParam)) {
    return NextResponse.json(
      { error: `Invalid season. Choose one of: ${SEASONS.join(", ")}.` },
      { status: 400 },
    );
  }

  const results = recommendRagas(RAGAS, minutes, { season, limit });

  return NextResponse.json({
    at: `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`,
    season,
    prahar: praharForMinutes(minutes),
    results: results.map((entry) => ({
      slug: entry.raga.slug,
      name: entry.raga.name,
      devanagari: entry.raga.devanagari,
      prahar: entry.raga.prahar,
      score: entry.score,
      reasons: entry.reasons,
    })),
  });
}
