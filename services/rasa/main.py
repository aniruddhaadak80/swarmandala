"""FastAPI surface for the Swarmandala rasa engine."""

from __future__ import annotations

import re
from typing import Any, Literal

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from data import RAGAS
from engine import prahar_for_minutes, rank_ragas

#: 24-hour local time, e.g. "04:00" or "23:59". No single-digit hours.
CLOCK_PATTERN = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")

Season = Literal["spring", "summer", "monsoon", "autumn", "winter"]

app = FastAPI(title="Swarmandala Rasa Engine", version="0.1.0")

# Demo service, read-only: every origin may call it.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/ragas")
def ragas() -> list[dict[str, Any]]:
    return [
        {
            "slug": raga["slug"],
            "name": raga["name"],
            "prahar": raga["prahar"],
            "season": raga.get("season"),
            "tags": list(raga["tags"]),
        }
        for raga in RAGAS
    ]


@app.get("/recommend")
def recommend(
    at: str = Query(..., description="Local time of day, HH:MM (24-hour)"),
    season: Season | None = Query(None, description="Override the derived season"),
    limit: int = Query(3, ge=1, le=24, description="Maximum number of ragas"),
) -> dict[str, Any]:
    if not CLOCK_PATTERN.fullmatch(at):
        raise HTTPException(
            status_code=422,
            detail="`at` must be a 24-hour HH:MM time, for example 18:30",
        )

    hours, minutes = (int(part) for part in at.split(":"))
    minutes_of_day = hours * 60 + minutes

    return {
        "at": at,
        "prahar": prahar_for_minutes(minutes_of_day),
        "results": rank_ragas(
            RAGAS,
            minutes_of_day,
            season=season,
            limit=limit,
        ),
    }
