# Security policy

Swarmandala is a static-first Next.js atlas with no accounts, no database, and no API keys. That
removes whole classes of risk, but not all of them: the site still renders user-controlled strings,
runs a build pipeline, and ships a workspace of dependencies. If you find a way to break it, we want
to know.

## Supported versions

| Version              | Supported |
| -------------------- | --------- |
| `main` (0.1.x)       | Yes       |
| Older tags and forks | No        |

Security fixes land on `main` and in the next tagged release. There are no long-term support branches;
if you are running a fork, you are responsible for carrying the fix.

## Reporting a vulnerability

**Do not open a public issue, discussion, or pull request for a security problem.**

Use GitHub's private vulnerability reporting:

<https://github.com/aniruddhaadak/swarmandala/security/advisories/new>

Please include:
- the affected route, file, workflow, or dependency, and the commit you tested;
- a minimal reproduction — a URL, a crafted slug or query string, or a failing test;
- what an attacker gains, and what they need in order to start (network position, a victim click, a
  malicious pull request);
- any suggested fix, if you have one.

Screenshots and short screen recordings are welcome. Do not attach real personal data, and do not
test against infrastructure you do not own.

## What to expect

- **Acknowledgement within 72 hours.** A human replies, confirms the report was received, and asks
  for anything missing.
- We reproduce and triage, then tell you whether it is in scope and how we plan to fix it.
- We coordinate a disclosure date with you. Fixes are best effort; this is a volunteer project, not a
  vendor with an SLA.
- With your permission, we credit you in the advisory. We will not publish your name otherwise.

## Scope

In scope:
- **Cross-site scripting and injection** in raga pages, search, the compare view, or the i18n `t()`
  interpolation helper — anywhere a slug, query, or translated string reaches the DOM.
- **Build and supply-chain issues** that are reachable in this repo: a malicious or typosquatted
  dependency, a compromised lockfile, or expression injection in `.github/workflows`.
- **CI integrity**: a workflow that can be made to run untrusted code with a write-scoped token, or a
  pull request that can exfiltrate a repository secret.
- **Leaked credentials.** The project ships none, by design. If you find a token in the tree or in
  history, report it privately rather than using it.
- **Security header regressions** in `apps/web/next.config.ts` — the current `nosniff`,
  `SAMEORIGIN`, and strict-origin-when-cross-origin policies are intentional.
- **Unsafe data flow in the optional FastAPI service** (`services/rasa`), for example a crafted `time`
  query parameter that crashes the process or escapes the read-only contract.

Out of scope:
- **Musical accuracy.** A disputed aroha, prahar, or vadi is a content issue. Use the raga correction
  form; it requires a citation and gets a normal review.
- **Accessibility and performance.** Real bugs, but not vulnerabilities. Open a bug report.
- **Denial of service** against the public demo, preview deployments, or a maintainer's laptop,
  including volumetric traffic and expensive-search probes.
- **Automated scanner output** with no working reproduction and no demonstrated impact, including
  "this dependency is outdated" reports when no vulnerable code path is reachable.
- **Missing headers or TLS settings on mirrors, forks, or third-party hosts** that we do not control.
- **Vercel platform behaviour**, browser engine bugs, and social engineering of maintainers.

## Design notes that shape the threat model

- **No server-side user data.** There is no auth, no database, no uploads, and no per-user storage.
  A breach of the app does not expose anyone's raga history, because none is kept.
- **Audio is client-side.** The tanpura is synthesised with Web Audio oscillators from
  `packages/core/src/audio.ts`. No samples are fetched, uploaded, or decoded from user input.
- **The Python service is a demo.** `services/rasa` is read-only, stateless, and has no persistence.
  Its permissive CORS policy is deliberate: it is a parity-checking surface meant to be called from a
  local front end. It is not a production API and holds nothing worth stealing.
- **The only optional outbound call is the parity service.** If `RASA_SERVICE_URL` is configured,
  server code may query that service. With it unset — the default — everything runs locally. See
  `.env.example`.
- **The repo is the deploy artifact.** A malicious commit is the realistic attack, which is why CI
  runs with `contents: read` and no secrets.

## Safe harbour

We will not pursue legal action against researchers who act in good faith under this policy: test
against your own deployment, do not access or modify other people's data, do not degrade the service
for others, and give us a reasonable window to fix the issue before publishing.

Thank you for making the atlas safer.
