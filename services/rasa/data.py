"""The twenty-four ragas, reduced to the fields the ranking engine needs.

Ported from ``packages/seed/src/ragas.ts``. Only ``slug``, ``name``,
``prahar``, ``season`` (when the seed defines one) and ``tags`` are kept;
notation, rasa and prose stay in the TypeScript source of truth.
"""

from __future__ import annotations

from typing import NotRequired, TypedDict


class Raga(TypedDict):
    slug: str
    name: str
    prahar: int
    tags: tuple[str, ...]
    season: NotRequired[str]


RAGAS: tuple[Raga, ...] = (
    {
        "slug": "bhairav",
        "name": "Bhairav",
        "prahar": 1,
        "tags": ("dawn", "komal-re", "komal-dha", "bhairav-thaat"),
        "season": "winter",
    },
    {
        "slug": "ahir-bhairav",
        "name": "Ahir Bhairav",
        "prahar": 2,
        "tags": ("morning", "komal-ni", "mixed"),
    },
    {
        "slug": "lalit",
        "name": "Lalit",
        "prahar": 1,
        "tags": ("pre-dawn", "both-ma", "tivra-ma"),
    },
    {
        "slug": "todi",
        "name": "Miyan ki Todi",
        "prahar": 3,
        "tags": ("late-morning", "komal-ga", "komal-dha", "todi-thaat"),
    },
    {
        "slug": "asavari",
        "name": "Asavari",
        "prahar": 3,
        "tags": ("late-morning", "asavari-thaat", "komal-ga"),
    },
    {
        "slug": "bhimpalasi",
        "name": "Bhimpalasi",
        "prahar": 4,
        "tags": ("afternoon", "komal-ga", "komal-ni", "kafi-thaat"),
    },
    {
        "slug": "multani",
        "name": "Multani",
        "prahar": 5,
        "tags": ("late-afternoon", "todi-family", "komal-re"),
    },
    {
        "slug": "marwa",
        "name": "Marwa",
        "prahar": 5,
        "tags": ("sunset", "no-pa", "tivra-ma", "marwa-thaat"),
    },
    {
        "slug": "puriya",
        "name": "Puriya",
        "prahar": 5,
        "tags": ("twilight", "tivra-ma", "marwa-thaat"),
    },
    {
        "slug": "yaman",
        "name": "Yaman",
        "prahar": 6,
        "tags": ("evening", "tivra-ma", "kalyan-thaat"),
    },
    {
        "slug": "bhupali",
        "name": "Bhupali",
        "prahar": 6,
        "tags": ("evening", "pentatonic", "audava", "kalyan-thaat"),
    },
    {
        "slug": "hamsadhwani",
        "name": "Hamsadhwani",
        "prahar": 6,
        "tags": ("evening", "pentatonic", "carnatic-borrowed"),
    },
    {
        "slug": "bageshri",
        "name": "Bageshri",
        "prahar": 7,
        "tags": ("night", "komal-ga", "komal-ni", "kafi-thaat"),
    },
    {
        "slug": "malkauns",
        "name": "Malkauns",
        "prahar": 8,
        "tags": (
            "midnight",
            "pentatonic",
            "komal-ga",
            "komal-dha",
            "komal-ni",
        ),
    },
    {
        "slug": "darbari-kanada",
        "name": "Darbari Kanada",
        "prahar": 8,
        "tags": (
            "midnight",
            "asavari-thaat",
            "komal-ga",
            "komal-dha",
            "komal-ni",
            "court",
        ),
    },
    {
        "slug": "bhairavi",
        "name": "Bhairavi",
        "prahar": 2,
        "tags": ("morning", "closing", "all-komal", "bhairavi-thaat"),
    },
    {
        "slug": "kafi",
        "name": "Kafi",
        "prahar": 7,
        "tags": ("night", "folk", "thumri", "kafi-thaat"),
    },
    {
        "slug": "desh",
        "name": "Desh",
        "prahar": 7,
        "tags": ("monsoon", "night", "khamaj-thaat", "light-classical"),
        "season": "monsoon",
    },
    {
        "slug": "khamaj",
        "name": "Khamaj",
        "prahar": 7,
        "tags": ("night", "khamaj-thaat", "light-classical"),
    },
    {
        "slug": "durga",
        "name": "Durga",
        "prahar": 6,
        "tags": ("evening", "pentatonic", "bilaval-thaat"),
    },
    {
        "slug": "miyan-ki-malhar",
        "name": "Miyan ki Malhar",
        "prahar": 7,
        "tags": ("monsoon", "night", "malhar", "kafi-thaat"),
        "season": "monsoon",
    },
    {
        "slug": "brindabani-sarang",
        "name": "Brindabani Sarang",
        "prahar": 4,
        "tags": ("afternoon", "sarang", "kafi-thaat"),
    },
    {
        "slug": "pilu",
        "name": "Pilu",
        "prahar": 6,
        "tags": ("evening", "thumri", "light-classical", "flexible"),
    },
    {
        "slug": "pahadi",
        "name": "Pahadi",
        "prahar": 6,
        "tags": ("evening", "folk", "pentatonic", "bilaval-thaat"),
    },
)

RAGA_COUNT = len(RAGAS)
