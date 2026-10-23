import { RAGAS } from "@repo/seed";
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "swarmandala-web",
    ragas: RAGAS.length,
    timestamp: new Date().toISOString(),
  });
}
