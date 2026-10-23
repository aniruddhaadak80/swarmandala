# 0001 — Monorepo shape and a pure domain package

- Status: Accepted
- Date: 2026-10-23

## Context

Swarmandala is one product with several kinds of consumer for the same musical rules. The Next.js app renders raga pages and the prahar clock on the server, the browser runs the audio engine, the `/api/recommend` route wraps the ranking function, and the Python `services/rasa` service exists to prove that the ranking can be reproduced outside TypeScript. If each consumer owns its own copy of swara parsing, prahar boundaries, or taal cycles, those copies will drift and the atlas will start disagreeing with itself.

The repository is a Bun workspace with `apps/*` and `packages/*`, orchestrated by Turborepo. `apps/web` is the only deployable TypeScript app. `packages/core` is the domain layer, `packages/seed` is the curated dataset, and `packages/ui` holds small React primitives. The Python service sits outside the Bun workspace on purpose.

## Decision

Keep the monorepo, and make `packages/core` the only home for musical and audio mathematics.

`packages/core` contains `swara.ts`, `prahar.ts`, `taal.ts`, `raga.ts`, `recommend.ts`, and `audio.ts`. None of these files import React, Next.js, the DOM, or `AudioContext`. The audio module computes partial ratios, envelopes, frequency relationships, and tabla specifications as plain data; the browser is responsible for turning that data into nodes. The recommendation module is a pure function over a `readonly Raga[]`, minutes, and options.

`packages/seed` depends on `@repo/core` and owns the typed raga records plus runtime validation. `packages/ui` stays presentation-only. `apps/web` composes these packages through the App Router and marks them for transpilation in `next.config.ts`. The Python service mirrors the ranking contract with its own implementation and golden cases rather than importing TypeScript.

The dependency direction is one-way: app to packages, seed to core, ui to nothing domain-specific. Core never imports seed, and no package imports the app.

## Consequences

### Positive

- Domain tests run in Vitest's node environment without a DOM or a browser audio stack. The existing `packages/core/tests` suite covers swara parsing, prahar boundaries, taal behaviour, and audio maths directly.
- The same `recommendRagas` function can run in a server component, in a route handler, and in the Python parity check without a network hop or a second implementation in the request path.
- The seed package can be validated at test time with `assertValidRagas`, so a malformed note or duplicate slug fails before deployment.
- Turborepo can cache `typecheck` and `build` per package, and the dependency graph makes the direction of imports visible.
- The Python service has a small, explicit contract to match: inputs, scoring constants, sort order, and output shape.

### Negative

- Workspace packages add configuration surface: `transpilePackages`, package `exports`, and TypeScript path aliases must stay aligned. A missing export is a build error rather than a local import.
- Purity is a convention enforced by review, not by the compiler. A future contributor can still import `window` into core and break the boundary.
- The Python mirror duplicates types and scoring logic by design. It needs golden-case updates whenever the TypeScript ranking changes.
- Private workspace packages cannot be consumed independently without extra publishing work, which is acceptable for a single product but limits reuse.

## Alternatives considered

- **Single Next.js app with `lib/`**: fewer moving parts, but the domain would be entangled with App Router conventions and harder to test without Next.js. It also makes the Python parity boundary less obvious.
- **Publish `@repo/core` as an independent npm package**: useful for other raga projects, but adds versioning, release, and compatibility work before the domain has stabilised.
- **Make Python the source of truth**: the FastAPI service could own ranking, but then the static site would need a runtime dependency and the browser would lose the offline-first property.
- **Generate both implementations from a schema**: a shared JSON schema or code generator could reduce drift, but it would add tooling and still not eliminate the need to test behaviour.
