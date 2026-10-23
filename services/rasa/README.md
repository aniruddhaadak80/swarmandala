# Swarmandala Rasa Engine

A small FastAPI service that ports the raga ranking from
`packages/core/src/recommend.ts` to Python. It exists to prove the ranking is
portable and to give the TypeScript core something to parity-check against.

**This is a reference implementation, not a production dependency of the web
app.** Nothing in `apps/` calls it, and nothing should start calling it. The
TypeScript core remains the source of truth for the product.

## Run it

Requires Python 3.11+ (the Docker image uses 3.12).

```sh
cd services/rasa
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
# source .venv/bin/activate

pip install -r requirements.txt
python -m pytest
uvicorn main:app --reload
```

The API is then at <http://127.0.0.1:8000> (interactive docs at `/docs`).

## Rules

Eight prahars, three hours each, minutes are local time-of-day `0..1439`:

| Prahar | Name      | English      | Window      |
| ------ | --------- | ------------ | ----------- |
| 1      | Bhor      | Dawn         | 04:00–06:59 |
| 2      | Pratah    | Morning      | 07:00–09:59 |
| 3      | Madhyanha | Late morning | 10:00–12:59 |
| 4      | Aparanha  | Afternoon    | 13:00–15:59 |
| 5      | Sayankal  | Dusk         | 16:00–18:59 |
| 6      | Pradosha  | Evening      | 19:00–21:59 |
| 7      | Ratri     | Night        | 22:00–00:59 |
| 8      | Nishith   | Midnight     | 01:00–03:59 |

Scoring for a raga whose watch is `distance = (current - raga + 8) % 8` watches
behind the current one:
- same watch (`distance == 0`): **100**
- next watch (`distance == 1`): **32**
- two watches away (`distance == 2`): **12**
- otherwise: **0**
- `raga.season == season`: **+20**
- `"monsoon"` in `raga.tags` and `season == "monsoon"`: **+14**

Results sort by score descending, then name ascending. `limit` defaults to 3.
`exclude` removes slugs before scoring.

When `season` is omitted it is derived from the current 1-indexed month:
Feb–Mar spring, Apr–Jun summer, Jul–Sep monsoon, Oct–Nov autumn, Dec–Jan
winter.

## JSON contract

### `GET /healthz`

```json
{ "status": "ok" }
```

### `GET /ragas`

```json
[
  {
    "slug": "miyan-ki-malhar",
    "name": "Miyan ki Malhar",
    "prahar": 7,
    "season": "monsoon",
    "tags": ["monsoon", "night", "malhar", "kafi-thaat"]
  }
]
```

`season` is `null` for ragas the seed does not assign one.

### `GET /recommend?at=HH:MM&season=monsoon&limit=3`

`at` is required and must match `^([01]\d|2[0-3]):[0-5]\d$`; anything else
returns **422**. `season` is optional (one of `spring`, `summer`, `monsoon`,
`autumn`, `winter`) and `limit` defaults to 3 (1–24).

```json
{
  "at": "19:30",
  "prahar": 6,
  "results": [
    {
      "slug": "bhupali",
      "name": "Bhupali",
      "score": 100,
      "reasons": ["Sung in the Pradosha watch (evening)"]
    }
  ]
}
```

Reasons are the same strings the TypeScript engine produces:
- `Sung in the <Name> watch (<english>)`
- `Opens the next watch`
- `Two watches away, still in the air`
- `A <season> raga`
- `Monsoon music`
- `Traditionally closes a concert`

## Docker

```sh
docker build -t swarmandala-rasa services/rasa
docker run --rm -p 8000:8000 swarmandala-rasa
```

## Parity notes

- The engine here walks the same wheel and adds the same bonuses as
  `recommendRagas`; the reason strings are lowercased the same way.
- **Season derivation differs from the current TypeScript core.** The TS
  `seasonForMonth` receives `Date#getMonth()`, which is 0-indexed, so in
  1-indexed terms it maps Jan–Feb spring, Mar–May summer, Jun–Aug monsoon,
  Sep–Oct autumn, Nov–Dec winter. This service was specified with the shifted
  1-indexed mapping above (Feb–Mar / Apr–Jun / Jul–Sep / Oct–Nov / Dec–Jan).
  The two therefore disagree in January, March, June, September and November
  when `season` is omitted. Passing `season` explicitly is always parity-safe;
  the boundary mapping needs reconciling in one place before default-season
  comparisons are meaningful.
- CORS is open to every origin because this is a local demo surface.
