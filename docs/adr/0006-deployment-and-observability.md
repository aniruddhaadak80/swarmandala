# 0006 — Deployment and observability

- Status: Accepted
- Date: 2026-10-23

## Context

Swarmandala is a static-first Next.js application with two small dynamic route handlers: `/api/recommend` and `/api/healthz`. There is no database, no user account, and no server-side audio. The primary deployment target is Vercel, where preview deployments per pull request and a production deployment from `main` are cheap and well understood.

The project also needs an exit path. A Vercel-only setup is convenient but creates vendor coupling, and a music atlas should be reproducible on a plain container host. The deployment target therefore includes a Dockerfile, a `docker-compose` file for local parity, and a Fly.io configuration as a fallback. The Python `services/rasa` service is a reference implementation and parity check, not part of the request path; it should remain testable without becoming a production dependency.

Observability has to be proportionate. A free atlas does not need a full APM stack, but it does need to answer three questions quickly: is the site up, which build is serving, and did the last deploy break the atlas or the clock?

## Decision

Use Vercel as the primary runtime and keep the container path deployable but secondary.
- **Production**: Vercel's Git integration builds and serves `apps/web` from `main`, and creates preview deployments for branches and pull requests. The `deploy-vercel.yml` workflow is a manual CLI path for redeploying a specific ref; it is not the primary deploy trigger. `next.config.ts` applies `X-Content-Type-Options`, `Referrer-Policy`, and `X-Frame-Options` to every path.
- **Container fallback**: a multi-stage Dockerfile builds the Next.js app and runs the production server; `docker-compose` reproduces the app locally; the Fly.io configuration runs the same image. The container path is exercised manually before a release, not on every pull request.
- **Health**: `/api/healthz` returns a small JSON document with the service status, the build identifier, and the loaded raga count. It does not touch the network or a database. It is intentionally shallow: a 200 means the process is alive and the seed loaded, not that every page is correct.
- **CI gates**: GitHub Actions runs one `verify` job with `bun install --frozen-lockfile`, `bun run typecheck`, `bun run lint`, `bun run test` (Vitest), `bun run build`, and Playwright after the build. A red gate blocks merge. The Python parity suite is separate and currently run manually; adding it as a dedicated job is the next CI increment because the service is not on the request path.
- **Release verification**: the release contract is to poll `/api/healthz` first, then run a Playwright smoke pass over the landing page, atlas, a raga page, and the clock. A failed health check should promote the previous Vercel deployment. The current workflow stops at the build and Playwright suite, so the post-deploy probe is a known gap rather than a claim about today's pipeline.
- **Logs**: use the platform's runtime logs for Vercel and Fly. Do not add a client analytics script or a session recorder by default. If product analytics are added later, they must be opt-in and documented in the privacy note.

The Python service can be deployed separately for documentation or parity demonstrations, but no Next.js request path calls it. This keeps the production surface to one language and one deployable app.

## Consequences

### Positive

- Preview deployments make design and content review concrete. A reviewer can inspect a raga page or the clock without running the app locally.
- The CI gate catches the failures that matter: type drift, lint regressions, broken unit tests, a broken production build, and a browser-level regression.
- `/api/healthz` gives uptime checks and the smoke test a stable, cheap signal without exposing internal details.
- The Dockerfile and compose file keep the app reproducible outside Vercel and make the Fly.io fallback credible.
- No database or third-party analytics means there is little to secure and little to leak.

### Negative

- Vercel remains a single point of operational coupling. The fallback exists, but it is not exercised on every deploy and can drift from the primary build.
- A shallow health check can pass while a specific raga page or the audio engine is broken. The Playwright smoke pass reduces that gap but does not cover every route.
- Running Playwright against production adds minutes to the release and can be flaky on a cold deployment.
- The container image is larger than the Vercel build output and needs its own base-image patching cadence.
- The current CI does not run the Python suite or build the container image, so those two paths can drift until dedicated jobs are added.
- Without an error tracker, client-side audio failures are visible only through user reports and platform logs. That is an accepted trade-off for a small, privacy-first project.

## Alternatives considered

- **Vercel only**: simplest operationally, but no portable fallback and no container parity.
- **Self-hosted Docker on a single VM**: full control, but patching, TLS, backups, and zero-downtime deploys become the project's responsibility.
- **Netlify or Cloudflare Pages**: comparable static hosting, but the project already targets Next.js 15 App Router and Vercel's preview flow; switching would add migration work without a clear gain.
- **Kubernetes**: unnecessary for one stateless Next.js app and a reference Python service.
- **Full APM and session replay**: better incident detail, but disproportionate cost, privacy surface, and client payload for an atlas with no accounts.
- **No health endpoint**: one less route, but then uptime checks and post-deploy smoke tests have no stable target.
