# 0002 — Ragas as a typed, validated seed

- Status: Accepted
- Date: 2026-10-23

## Context

The atlas launches with 24 ragas. Each entry carries a slug, English and Devanagari names, a thaat, ascending and descending phrases, vadi and samvadi, a prahar, rasa tags, a mood sentence, a pakad, a description, free-form tags, and an optional season. The dataset changes slowly and is edited by hand. There is no editorial team, no admin interface, and no requirement for per-user content.

The site is also offline-first in spirit: the landing page, atlas, raga pages, and clock should render without a database or an API key. A correction should be reviewable as a diff, and a bad note should fail loudly rather than reaching a page as `undefined` or an unparseable string.

## Decision

Store the ragas as a typed TypeScript module rather than in a database, CMS, or remote JSON endpoint.

`packages/seed/src/ragas.ts` exports `RAGAS` as `as const satisfies readonly Raga[]`, followed by `getRaga`, `ragaSlugs`, and `RAGA_COUNT`. `packages/seed/src/schema.ts` exports `validateRagas` and `assertValidRagas`. Validation checks:
- slugs are lowercase kebab-case and unique;
- names and Devanagari names are non-empty;
- descriptions are at least 80 characters and moods at least 20;
- prahar is between 1 and 8;
- every note in aroha, avaroha, and pakad parses through `parseNote`;
- vadi and samvadi appear in the raga's combined scale, and differ when both are present;
- aroha and avaroha contain at least four notes;
- every unique note is a known swara.

The test suite calls `assertValidRagas` over the default dataset. The web app imports the dataset directly from `@repo/seed`; no fetch, database client, or runtime schema library is involved.

The single-file shape is deliberate. The package's own comment points to `docs/reference/ragas.md` for per-raga caveats, and the about page tells readers that corrections are welcome because the dataset lives in one file.

## Consequences

### Positive

- All 24 ragas are available at build time. Atlas pages, related-ragas lists, and the clock can be statically rendered with no runtime data dependency.
- `RagaSlug` is inferred from the literal dataset, so link generation and lookup can be type-checked rather than stringly typed.
- A pull request that changes a raga shows the musical change, the prose change, and any validation impact in one reviewable diff.
- `validateRagas` catches the mistakes that matter most in this domain: a komal note written in the wrong case, a vadi outside the scale, a prahar outside 1–8, or a duplicate slug.
- There is no database to provision, seed, back up, or secure, and no CMS session to protect.

### Negative

- Every correction requires a code review and a deployment. There is no draft state, scheduling, or non-technical editing path.
- The dataset and its validation live in the same package, so a schema change is a code change. Migrating to a database later would require an export and a compatibility layer.
- The full dataset is bundled wherever it is imported. At 24 entries this is small, but the pattern does not scale indefinitely without pagination or a query layer.
- Runtime validation is opt-in. A caller that imports `RAGAS` directly bypasses `assertValidRagas`; the guarantee depends on tests and build discipline.
- Free-form tags and prose are not normalised, so search quality depends on editorial consistency.

## Alternatives considered

- **PostgreSQL with Prisma**: gives editing, filtering, and growth, but adds a service, credentials, migrations, and a runtime dependency for data that changes a few times a year.
- **Headless CMS**: gives non-technical editors a workflow, but adds a vendor, a content schema, preview infrastructure, and a network dependency. The project has no editorial team to justify it.
- **One MDX file per raga**: pleasant prose authoring, but musical fields and validation become frontmatter conventions, and cross-raga functions such as comparison and related-ragas become harder to type.
- **Remote JSON fetched at runtime**: simple to update, but loses static rendering, offline behaviour, and build-time validation, and introduces a failure mode on first paint.
- **YAML plus a build step**: diff-friendly, but requires a parser, a generated type layer, and a second source of truth during development.
