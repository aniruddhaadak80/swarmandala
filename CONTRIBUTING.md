# Contributing to Swarmandala

Swarmandala is a small, deliberately literal atlas of Hindustani raga: twenty-four ragas, eight
three-hour prahars, a tanpura you can tune, and a scale you can trace. There are no accounts, no
database, no API keys, and no audio samples — the drone is synthesised in the browser with Web Audio.

Contributions are welcome in all of those areas: notation and prose, the TypeScript music theory in
`packages/core`, the Next.js front end, the Hindi and Bengali strings, accessibility, tests, and
documentation. This guide covers the mechanics. The one non-negotiable rule is at the top: **musical
claims need a citation.**

By taking part you agree to the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Before you start

- **Cite musical changes.** A raga's aroha, avaroha, pakad, vadi, samvadi, or prahar is a claim about
  a living tradition, not a matter of taste. Every change to `packages/seed/src/ragas.ts` needs a
  published source or a named recording in the pull request — see [Citations](#citations).
- **Keep pull requests small.** One logical change per PR. A new raga, a ranking fix, and a Tailwind
  tweak are three PRs.
- **Open a Discussion first** for anything structural: a new dependency, a change to the `Raga` type,
  a new route, a redesign. It is cheaper to disagree in an issue than in a review.
- **Do not add keys or paid services.** A fresh clone must run with `bun install && bun run dev` and
  no `.env` file. That invariant is part of the product.

## Setup

### 1. Install Bun

The repo runs on [Bun](https://bun.sh) 1.2 or newer. Node 22 is only needed for tools that shell out
to `node`; `.nvmrc` pins it, and `nvm use` is enough if you have nvm.

Windows (PowerShell):

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

macOS and Linux:

```bash
curl -fsSL https://bun.sh/install | bash
```

Check the install with `bun --version`.

### 2. Clone and install

```bash
git clone https://github.com/aniruddhaadak/swarmandala.git
cd swarmandala
bun install
```

`bun install` links the workspace (`apps/*`, `packages/*`) and writes `bun.lock`. Commit lockfile
changes together with the dependency change that caused them — CI installs with
`bun install --frozen-lockfile` and will fail on a stale lockfile.

### 3. Run the app

```bash
bun run dev
```

The dev server is at <http://localhost:3000>. Audio stays off until you press play; nothing is
fetched from a third party. Copy [`.env.example`](./.env.example) to `.env.local` only if you want to
override one of the optional settings — the app is designed to run with zero configuration.

### 4. Optional: install a browser for end-to-end tests

```bash
bunx playwright install chromium
```

On a fresh Linux machine (or a container), install the system dependencies too:

```bash
bunx playwright install --with-deps chromium
```

### 5. Optional: run the Python parity service

`services/rasa` is a read-only FastAPI port of the ranking engine. It exists so the recommendation
logic can be checked from outside the JavaScript toolchain; the TypeScript in
`packages/core/src/recommend.ts` remains the source of truth.

```bash
cd services/rasa
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
pytest
uvicorn main:app --reload --port 8000
```

## The five gates

Every pull request must pass these locally and in CI (`.github/workflows/ci.yml`, `ubuntu-latest`):

| Gate             | Command                | What it proves                                                        |
| ---------------- | ---------------------- | --------------------------------------------------------------------- |
| Types            | `bun run typecheck`    | `tsc --noEmit` in every workspace, via Turbo                          |
| Style            | `bun run lint`         | Biome lint plus formatting; `bun run format` rewrites formatting only |
| Unit tests       | `bun run test`         | Vitest over `packages/*/tests` and `apps/web/lib`                     |
| Production build | `bun run build`        | `next build` succeeds for `apps/web`                                  |
| End-to-end       | `bunx playwright test` | Chromium against the built app                                        |

Two practical notes:
- **Build before e2e.** `playwright.config.ts` starts `bun --cwd apps/web run start`, which serves the
  production build on port 3000. Run `bun run build` first, or Playwright will fail to boot.
- **Lint is also a format check.** `bun run lint` runs `biome check .`; a formatting-only failure is
  fixed by `bun run format` and a re-run of the gate.

If you touched `services/rasa`, also run `pytest` in that directory. CI for Python is CodeQL only, so
a broken port is easy to merge otherwise.

## Repository map

| Path                      | What lives there                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| `apps/web`                | Next.js 15 / React 19 front end, Tailwind v4, `lib/i18n` (en, hi, bn)                       |
| `packages/core`           | DOM-free music theory: swara, prahar, raga comparison, recommendation, taal, audio partials |
| `packages/seed`           | The twenty-four-raga dataset (`src/ragas.ts`) and its validator (`src/schema.ts`)           |
| `packages/ui`             | Shared React components                                                                     |
| `services/rasa`           | FastAPI parity service, read-only, no persistence                                           |
| `docs/reference/ragas.md` | Per-raga source notes and the reasoning behind disputed entries                             |
| `.github`                 | CI, CodeQL, the manual Vercel deploy, issue forms                                           |

## Adding or correcting a raga

All musical data lives in `packages/seed/src/ragas.ts`. The shape is the `Raga` interface in
`packages/core/src/raga.ts`.

### Notation

The atlas uses a compact notation; `parseNote` in `packages/core/src/swara.ts` is the parser that
decides what is legal.

| Token                             | Meaning                |
| --------------------------------- | ---------------------- |
| `S`, `R`, `G`, `M`, `P`, `D`, `N` | Shuddha swaras         |
| `r`, `g`, `d`, `n`                | Komal Re, Ga, Dha, Ni  |
| `M^`                              | Tivra Ma               |
| `S'`                              | Sa in the upper octave |

Anything else — `Re`, `G#`, `m`, a missing apostrophe — fails validation.

### What the validator enforces

`validateRagas` in `packages/seed/src/schema.ts` rejects an entry when:
- the slug is not lowercase kebab-case, or is a duplicate;
- `name` or `devanagari` is empty;
- `description` is shorter than 80 characters, or `mood` shorter than 20;
- `prahar` is outside 1–8;
- a note in `aroha`, `avaroha`, or `pakad` cannot be parsed;
- `vadi` or `samvadi` is not present in the raga's scale, or the two are the same note;
- `aroha` or `avaroha` has fewer than four notes.

The seed tests add constraints that matter when adding a raga: exactly 24 unique ragas, at least two
ragas in every prahar, a Devanagari name for every entry, and a pakad of at least four notes.

### Recipe

1. **Edit the data.** Add the entry to `RAGAS` in `packages/seed/src/ragas.ts`, keeping the existing
   formatting (double quotes, trailing commas, one field per line).
2. **Bump the count if you are adding a raga.** The dataset is intentionally finite, so several
   places state the number. Update all of them in the same PR:
   - `packages/seed/tests/ragas.test.ts` — the `toBe(24)` and uniqueness assertions;
   - the "Twenty-four ragas" copy in `apps/web/lib/i18n/en.ts`, `hi.ts`, and `bn.ts` (`hero.intro`,
     `atlas.intro`);
   - the module docblock at the top of `packages/seed/src/ragas.ts`;
   - the mirror in `services/rasa/data.py`, which must keep the same slugs, prahars, seasons, and tags.
3. **Run the seed tests first:** `bunx vitest run packages/seed`. They fail fast and name the offending
   field.
4. **Add a source note** to `docs/reference/ragas.md` under the raga's slug (create the file with one
   `## <slug>` section per raga if it does not exist yet). State what the source supports and where
   gharanas differ.
5. **Run the full gates:** `bun run typecheck`, `bun run lint`, `bun run test`, `bun run build`, then
   `bunx playwright test`.
6. **If ranking changes**, add or adjust a case in `packages/seed/tests/recommend.test.ts`. The score
   for the current prahar, neighbouring prahars, season, and the monsoon tag is behaviour, not an
   implementation detail.

A correction is the same recipe without step 2: change the field, cite the source, keep the slug
stable. Slugs are URLs — renaming one breaks links and bookmarks, so treat a slug change as a
separate, discussed PR.

### Citations

- Cite an edition and a page, or a recording and a timestamp. "It is well known" is not a source, and
  neither is a language model's recollection.
- A workable format:

  ```text
  - Aroha and pakad: Author, *Title*, Publisher, Year, p. 000.
  - Komal Re treatment: Artist, *Album*, Label, Year, track 0 @ 02:14.
  ```

- **Gharanas disagree, and that is the point.** Aroha, prahar boundaries, and the weight given to a
  particular swara vary by lineage and are often pedagogical conventions rather than doctrine. When
  sources conflict, present both with attribution in `docs/reference/ragas.md` rather than
  overwriting one. The atlas should read as a map of a tradition, not a ruling on it.
- When a change is devotional or funerary in character, say so in the note. Context is part of the
  musical claim.
- Do not paste long passages from a copyrighted book or article. Paraphrase, cite, and link when a
  lawful link exists.
- Keep the existing transliteration convention: Devanagari plus the common English spelling. Mention
  alternative spellings in `tags` or the description instead of renaming an entry.

## Changing the engine

`packages/core` is pure and DOM-free, apart from the audio helpers that build partials and convert
beats to seconds. Keep functions total where possible, throw only on genuinely invalid input, and add
a unit test beside the behaviour you change.

Audio is synthesised from oscillators. Do not introduce sample files, remote audio, or a keyed
service; the "no samples, no keys" line in the hero copy is a constraint, not marketing.

The recommender in `packages/core/src/recommend.ts` is mirrored by `services/rasa/engine.py`. If you
change scoring, weights, or season mapping, change both and keep their tests green.

## Code style

Formatting and linting are not a matter of debate here — Biome decides.
- `bun run lint` must pass, and `bun run format` is the only formatter you need. The config is
  `biome.json`: two-space indentation, 100-column lines, double quotes, semicolons.
- TypeScript is strict, with `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and
  `verbatimModuleSyntax` enabled in `tsconfig.base.json`.
- **No `any`.** Use `unknown` and narrow it, or model the type properly. `@ts-expect-error` is
  acceptable only with a comment explaining the upstream bug it works around.
- Use `import type` for type-only imports; `verbatimModuleSyntax` will complain otherwise.
- Optional properties are omitted, not set to `undefined`, because of `exactOptionalPropertyTypes`.
- Prefer named exports; Next.js config and route files are the exceptions the framework requires.
- Non-null assertions are enabled in Biome but are a review smell. Assert only where the invariant is
  obvious or tested.
- Tailwind v4 utilities belong in JSX. Do not add a CSS-in-JS runtime without discussing it first.
- Accessibility is part of correctness: use semantic elements, keep the prahar clock operable by
  keyboard (it supports arrow keys), honour `prefers-reduced-motion`, and keep the axe checks in the
  e2e suite passing.
- `apps/web/lib/i18n/en.ts` is the source of truth for copy. Add every new key to `hi.ts` and `bn.ts`
  in the same PR — the locale shape is type-checked.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat(seed): add Marwa in prahar 6
fix(audio): release the AudioContext on unmount
docs(reference): cite a source for Bhairav's prahar
chore(ci): cache Bun installs between runs
```

- Types: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `chore`, `ci`.
- Scopes: `web`, `core`, `seed`, `ui`, `rasa`, `ci`, `docs`, `deps`.
- Imperative mood, lowercase summary, no trailing period, 72 characters or fewer.
- One logical change per commit. A formatting sweep belongs in its own commit, or its own PR.
- Reference issues in the body or the PR description (`Fixes #123`), not in the subject.

## Pull requests

1. Fork the repo and branch from `main` (`feat/marwa`, `fix/prahar-clock`).
2. Make the change with tests and, for musical data, a citation.
3. Run all five gates locally.
4. Open the PR and fill in the template. Visual changes need before/after screenshots.
5. Keep CI green. A maintainer will review; expect questions about sources for raga changes.
6. Avoid force-pushing while a review is in progress — it discards review context. Add commits, and
   squash on merge if the history is noisy.

### PR checklist

- [ ] The change is one logical thing, described in the title and body.
- [ ] `bun run typecheck`, `bun run lint`, `bun run test`, `bun run build`, and `bunx playwright test`
  pass locally.
- [ ] New behaviour has a test; a bug fix has a regression test.
- [ ] Raga data changes cite a published source or a named recording, with the note added to
  `docs/reference/ragas.md`.
- [ ] If the raga count changed, the seed tests, the three locale files, and `services/rasa/data.py`
  were updated together.
- [ ] Screenshots or a short recording are attached for UI changes, including mobile width.
- [ ] No secrets, tokens, `.env` files, or generated build output are included.
- [ ] Documentation that is now wrong has been updated in the same PR.

## Reporting bugs, ideas, and corrections

- **Bug:** open the bug report form in `.github/ISSUE_TEMPLATE/bug_report.yml`.
- **Feature:** use the feature request form; describe the problem before the solution.
- **Raga correction:** use the raga correction form. It requires a citation and will be closed
  without one.
- **Question:** ask in [Discussions](https://github.com/aniruddhaadak/swarmandala/discussions) rather
  than opening an issue.
- **Security:** follow [SECURITY.md](./SECURITY.md); never open a public issue for a vulnerability.
- **Conduct:** write to <conduct@swarmandala.dev>.

Thanks for helping make the atlas more accurate and more playable.
