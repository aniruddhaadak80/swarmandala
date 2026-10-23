# 0004 — Deterministic recommendation by prahar

- Status: Accepted
- Date: 2026-10-23

## Context

The central question of the atlas is "what is playing now?" — but the answer should be explainable, not a black box. Hindustani ragas are traditionally associated with a prahar, one of eight three-hour watches that begin at 4am. The association is part of a raga's identity, not a playlist preference. A recommendation can therefore be derived from the clock, the raga's assigned watch, the season, and a small number of tags.

The project has no user accounts, no listening history, and no ratings. It also has a Python reference service that must be able to reproduce the ranking outside TypeScript. A model that depends on embeddings, a hosted inference API, or a random seed would make parity, testing, and offline operation harder.

## Decision

Rank ragas with a pure, deterministic function in `packages/core/src/recommend.ts`.

Given `minutes`, the function resolves the current prahar with `praharForMinutes`. It then scores every non-excluded raga:
- same watch: 100;
- next watch, in the forward direction: 32;
- two watches away: 12;
- otherwise: 0;
- matching season: +20;
- tag `monsoon` during the monsoon: +14.

`praharDistance` walks forward around the eight-watch cycle, so the transition from prahar 8 back to prahar 1 is one step, not seven. Results are sorted by score descending and then by `name.localeCompare` as a stable tie-break. The default limit is three. Each result carries human-readable reasons, such as "Sung in the Pradosha watch", "Opens the next watch", "A monsoon raga", or "Traditionally closes a concert".

The function accepts `season`, `exclude`, and `limit` options. When `season` is omitted, `seasonForMonth` maps the current month to spring, summer, monsoon, autumn, or winter. `/api/recommend` is a thin wrapper over the same function; it does not reimplement scoring.

`services/rasa` mirrors the constants and the sort order. Its pytest suite encodes the same golden cases, including the dawn ordering at 04:00 and the monsoon boost for Miyan ki Malhar. The Python service is a portability proof, not a request-path dependency, and its suite is run separately from the Node test run.

## Consequences

### Positive

- The same minute and the same dataset always produce the same order. That makes snapshots, tests, and debugging straightforward.
- Every recommendation can explain itself. The `reasons` array is generated alongside the score, so the UI does not have to invent copy.
- The weights are visible constants in one file. Changing "adjacent watch" from 32 to 30 is a reviewable diff with an obvious test impact.
- The Python service has a precise contract: same inputs, same constants, same tie-break, same limit. Parity is a meaningful check rather than a vague "similar results" claim.
- The algorithm runs in microseconds and needs no network, model, or database.

### Negative

- The ranking is coarse. It knows the watch and the season, not the listener's mood, training level, voice range, or the raga's performance length.
- The weights are hand-tuned and culturally opinionated. A different gharana may disagree about prahar edges or about whether a raga belongs to the same watch.
- When `season` is omitted, `seasonForMonth(new Date().getMonth())` uses the runtime's local date. A server in a different timezone from the listener can produce a different season. Callers should pass an explicit season when that matters.
- The tie-break by English name is stable but not musically meaningful, and it favours Latin transliteration order.
- Two codebases must be updated together. A change to scoring in TypeScript is not caught by the Python suite unless that suite is run; the current GitHub Actions verify job runs only the Node tests.
- The Python golden cases are hand-written rather than generated from a shared fixture. They overlap the TypeScript cases but do not yet prove full parity across the entire dataset.

## Alternatives considered

- **Machine-learned ranking**: could personalise, but there is no training data, no feedback loop, and no way to explain a result. It would also break offline operation and parity.
- **Collaborative filtering**: requires users and history the project does not have, plus privacy and storage work.
- **LLM-generated recommendations**: flexible in prose, but non-deterministic, costly, and unable to guarantee the same answer for the same clock minute.
- **Prahar-only ranking with no season**: simpler and more faithful to the watch, but ignores the monsoon associations that make Desh and Miyan ki Malhar meaningful.
- **Ranking in Python only**: would centralise the logic, but the browser and static site would then need a runtime service for a calculation that is cheap enough to run locally.
- **Randomised discovery**: useful as an optional "surprise me" mode, but unsuitable as the default because it cannot be tested or explained.
