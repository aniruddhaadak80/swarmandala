import { RAGAS } from "@repo/seed";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    count: RAGAS.length,
    ragas: RAGAS.map((raga) => ({
      slug: raga.slug,
      name: raga.name,
      devanagari: raga.devanagari,
      thaat: raga.thaat,
      prahar: raga.prahar,
      aroha: raga.aroha,
      avaroha: raga.avaroha,
      vadi: raga.vadi,
      samvadi: raga.samvadi,
      rasa: raga.rasa,
      mood: raga.mood,
      tags: raga.tags,
    })),
  });
}
