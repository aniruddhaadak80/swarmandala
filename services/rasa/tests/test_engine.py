"""Tests for the pure engine and the HTTP contract."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from data import RAGAS, RAGA_COUNT
from engine import (
    prahar_distance,
    prahar_for_minutes,
    rank_ragas,
    season_for_month,
)
from main import app


def by_slug(results: list[dict], slug: str) -> dict:
    return next(result for result in results if result["slug"] == slug)


# ---------------------------------------------------------------------------
# Prahars
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    ("minutes", "expected"),
    [
        (240, 1),  # 04:00, first minute of the day wheel
        (419, 1),  # 06:59, last minute of Bhor
        (420, 2),  # 07:00
        (599, 2),  # 09:59
        (600, 3),  # 10:00
        (779, 3),  # 12:59
        (780, 4),  # 13:00
        (959, 4),  # 15:59
        (960, 5),  # 16:00
        (1139, 5),  # 18:59
        (1140, 6),  # 19:00
        (1319, 6),  # 21:59
        (1320, 7),  # 22:00
        (1439, 7),  # 23:59
        (0, 7),  # 00:00, prahar 7 wraps past midnight
        (59, 7),  # 00:59
        (60, 8),  # 01:00
        (239, 8),  # 03:59
    ],
)
def test_prahar_boundaries(minutes: int, expected: int) -> None:
    assert prahar_for_minutes(minutes) == expected


@pytest.mark.parametrize(
    ("minutes", "expected"),
    [(-1, 7), (-60, 7), (-240, 6), (1440, 7), (1500, 8)],
)
def test_prahar_minutes_wrap(minutes: int, expected: int) -> None:
    assert prahar_for_minutes(minutes) == expected


@pytest.mark.parametrize(
    ("frm", "to", "expected"),
    [(1, 1, 0), (8, 1, 1), (1, 8, 7), (2, 7, 5), (6, 6, 0), (7, 6, 7)],
)
def test_prahar_distance_wraps(frm: int, to: int, expected: int) -> None:
    assert prahar_distance(frm, to) == expected


# ---------------------------------------------------------------------------
# Seasons
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    ("month", "expected"),
    [
        (1, "winter"),
        (2, "spring"),
        (3, "spring"),
        (4, "summer"),
        (5, "summer"),
        (6, "summer"),
        (7, "monsoon"),
        (8, "monsoon"),
        (9, "monsoon"),
        (10, "autumn"),
        (11, "autumn"),
        (12, "winter"),
    ],
)
def test_season_mapping(month: int, expected: str) -> None:
    assert season_for_month(month) == expected


# ---------------------------------------------------------------------------
# Ranking
# ---------------------------------------------------------------------------


def test_seed_has_twenty_four_unique_ragas() -> None:
    assert RAGA_COUNT == 24
    assert len({raga["slug"] for raga in RAGAS}) == RAGA_COUNT
    assert all(1 <= raga["prahar"] <= 8 for raga in RAGAS)


def test_ranking_is_deterministic() -> None:
    first = rank_ragas(RAGAS, 10 * 60, season="winter", limit=10)
    second = rank_ragas(RAGAS, 10 * 60, season="winter", limit=10)
    assert first == second
    # Ties are broken by name ascending: Asavari before Miyan ki Todi.
    assert [result["slug"] for result in first[:2]] == ["asavari", "todi"]


def test_ranking_order_and_reasons() -> None:
    results = rank_ragas(RAGAS, 4 * 60, season="winter", limit=5)

    # At 04:00 (prahar 1) the walk forward wraps: prahar 8 is one watch away.
    assert [result["slug"] for result in results] == [
        "bhairav",
        "lalit",
        "darbari-kanada",
        "malkauns",
        "bageshri",
    ]
    assert [result["score"] for result in results] == [120, 100, 32, 32, 12]

    bhairav = results[0]
    assert bhairav["reasons"] == [
        "Sung in the Bhor watch (dawn)",
        "A winter raga",
    ]

    darbari = by_slug(results, "darbari-kanada")
    assert darbari["reasons"] == ["Opens the next watch"]

    bageshri = by_slug(results, "bageshri")
    assert bageshri["reasons"] == ["Two watches away, still in the air"]

    everything = rank_ragas(RAGAS, 4 * 60, season="winter", limit=24)
    bhairavi = by_slug(everything, "bhairavi")
    assert bhairavi["score"] == 0
    assert bhairavi["reasons"] == ["Traditionally closes a concert"]


def test_default_limit_is_three() -> None:
    assert len(rank_ragas(RAGAS, 4 * 60, season="winter")) == 3


def test_limit_and_exclude() -> None:
    limited = rank_ragas(RAGAS, 4 * 60, season="winter", limit=4)
    assert len(limited) == 4

    excluded = rank_ragas(
        RAGAS,
        4 * 60,
        season="winter",
        limit=4,
        exclude=("bhairav", "lalit"),
    )
    assert [result["slug"] for result in excluded][:2] == [
        "darbari-kanada",
        "malkauns",
    ]
    assert all(result["slug"] not in {"bhairav", "lalit"} for result in excluded)

    assert rank_ragas(RAGAS, 4 * 60, season="winter", limit=0) == []


def test_monsoon_boost_moves_miyan_ki_malhar_forward() -> None:
    summer = rank_ragas(RAGAS, 22 * 60, season="summer", limit=24)
    monsoon = rank_ragas(RAGAS, 22 * 60, season="monsoon", limit=24)

    summer_position = [result["slug"] for result in summer].index("miyan-ki-malhar")
    monsoon_position = [result["slug"] for result in monsoon].index("miyan-ki-malhar")

    assert monsoon_position < summer_position
    assert monsoon_position == 1  # Desh also scores 134 and sorts first by name
    assert summer_position == 4

    boosted = by_slug(monsoon, "miyan-ki-malhar")
    assert boosted["score"] == 134
    assert boosted["reasons"] == [
        "Sung in the Ratri watch (night)",
        "A monsoon raga",
        "Monsoon music",
    ]

    unboosted = by_slug(summer, "miyan-ki-malhar")
    assert unboosted["score"] == 100
    assert unboosted["reasons"] == ["Sung in the Ratri watch (night)"]


# ---------------------------------------------------------------------------
# HTTP API
# ---------------------------------------------------------------------------


client = TestClient(app)


def test_healthz() -> None:
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_ragas_endpoint() -> None:
    response = client.get("/ragas")
    assert response.status_code == 200

    payload = response.json()
    assert len(payload) == RAGA_COUNT
    assert {"slug", "name", "prahar", "season", "tags"} <= set(payload[0])

    malhar = next(raga for raga in payload if raga["slug"] == "miyan-ki-malhar")
    assert malhar["season"] == "monsoon"
    assert malhar["prahar"] == 7


def test_recommend_contract() -> None:
    response = client.get(
        "/recommend", params={"at": "19:30", "season": "monsoon", "limit": 2}
    )
    assert response.status_code == 200

    payload = response.json()
    assert payload["at"] == "19:30"
    assert payload["prahar"] == 6
    assert len(payload["results"]) == 2

    first = payload["results"][0]
    assert set(first) == {"slug", "name", "score", "reasons"}
    assert isinstance(first["score"], int)
    assert isinstance(first["reasons"], list)


def test_recommend_prahar_at_midnight() -> None:
    response = client.get("/recommend", params={"at": "00:00"})
    assert response.status_code == 200
    assert response.json()["prahar"] == 7


@pytest.mark.parametrize("bad_at", ["25:00", "12:60", "noon", "7:30", "18:30:00", ""])
def test_recommend_rejects_bad_clock(bad_at: str) -> None:
    response = client.get("/recommend", params={"at": bad_at})
    assert response.status_code == 422


def test_recommend_rejects_unknown_season() -> None:
    response = client.get("/recommend", params={"at": "19:30", "season": "summerr"})
    assert response.status_code == 422
