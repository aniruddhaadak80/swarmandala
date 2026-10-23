"""Pure raga-ranking functions, ported from ``packages/core/src/recommend.ts``.

The TypeScript module is the product implementation; this port exists so the
ranking can be parity-checked from outside the JavaScript toolchain.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Iterable, Mapping, Sequence

#: The eight three-hour watches, in walking order from 4am.
PRAHARS: dict[int, tuple[str, str]] = {
    1: ("Bhor", "Dawn"),
    2: ("Pratah", "Morning"),
    3: ("Madhyanha", "Late morning"),
    4: ("Aparanha", "Afternoon"),
    5: ("Sayankal", "Dusk"),
    6: ("Pradosha", "Evening"),
    7: ("Ratri", "Night"),
    8: ("Nishith", "Midnight"),
}

#: Score awarded for a raga whose watch is ``distance`` watches behind now.
PRAHAR_SCORES: dict[int, int] = {0: 100, 1: 32, 2: 12}

SEASON_MATCH_BONUS = 20
MONSOON_TAG_BONUS = 14


def prahar_for_minutes(minutes: int) -> int:
    """Return the 1-8 prahar containing a local time-of-day in minutes.

    Minutes outside ``0..1439`` wrap around the clock. Prahar 7 runs across
    midnight (22:00-00:59) and prahar 8 covers 01:00-03:59.
    """
    m = ((minutes % 1440) + 1440) % 1440
    if 240 <= m < 420:
        return 1
    if 420 <= m < 600:
        return 2
    if 600 <= m < 780:
        return 3
    if 780 <= m < 960:
        return 4
    if 960 <= m < 1140:
        return 5
    if 1140 <= m < 1320:
        return 6
    if m >= 1320 or m < 60:
        return 7
    return 8


def season_for_month(month: int) -> str:
    """Map a 1-indexed month to the Indian meteorological season."""
    if month in (2, 3):
        return "spring"
    if 4 <= month <= 6:
        return "summer"
    if 7 <= month <= 9:
        return "monsoon"
    if month in (10, 11):
        return "autumn"
    return "winter"


def prahar_distance(frm: int, to: int) -> int:
    """Three-hour distance walking forward around the eight-watch wheel."""
    return (to - frm + 8) % 8


def rank_ragas(
    ragas: Sequence[Mapping[str, Any]],
    minutes: int,
    season: str | None = None,
    limit: int = 3,
    exclude: Iterable[str] = (),
) -> list[dict[str, Any]]:
    """Rank ragas for a moment of the day.

    Deterministic: the same minute, season and dataset always produce the same
    order. Sorts by score descending, then name ascending. ``season`` defaults
    to the current month's season; ``exclude`` drops slugs before scoring.
    """
    current = prahar_for_minutes(minutes)
    resolved_season = (
        season if season is not None else season_for_month(datetime.now().month)
    )
    excluded = set(exclude)

    scored: list[dict[str, Any]] = []
    for raga in ragas:
        if raga["slug"] in excluded:
            continue

        distance = prahar_distance(int(raga["prahar"]), current)
        score = PRAHAR_SCORES.get(distance, 0)
        reasons: list[str] = []

        if distance == 0:
            name, english = PRAHARS[current]
            reasons.append(f"Sung in the {name} watch ({english.lower()})")
        elif distance == 1:
            reasons.append("Opens the next watch")
        elif distance == 2:
            reasons.append("Two watches away, still in the air")

        if raga.get("season") == resolved_season:
            score += SEASON_MATCH_BONUS
            reasons.append(f"A {resolved_season} raga")

        tags = raga.get("tags", ())
        if "monsoon" in tags and resolved_season == "monsoon":
            score += MONSOON_TAG_BONUS
            reasons.append("Monsoon music")

        if "closing" in tags:
            reasons.append("Traditionally closes a concert")

        scored.append(
            {
                "slug": raga["slug"],
                "name": raga["name"],
                "score": score,
                "reasons": reasons,
            }
        )

    scored.sort(key=lambda item: (-item["score"], item["name"]))
    return scored[: max(0, limit)]
