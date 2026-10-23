# Support

Swarmandala is maintained by volunteers. There is no support contract, no guaranteed response time,
and no private help desk. The fastest route to an answer is the public one, where the next person with
the same question can find it.

## Where to ask

| What you have                                                                      | Where it goes                                                                                                                    |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| "How do I run this?", "Why does the drone sound like that?", "Which raga is this?" | [Discussions](https://github.com/aniruddhaadak/swarmandala/discussions) — Q&A                                                    |
| Something is broken: a page, a filter, the tanpura, the build                      | [Bug report](https://github.com/aniruddhaadak/swarmandala/issues/new?template=bug_report.yml)                                    |
| An idea for a feature or a new view                                                | [Feature request](https://github.com/aniruddhaadak/swarmandala/issues/new?template=feature_request.yml)                          |
| A raga's notation, prahar, vadi, or prose is wrong                                 | [Raga correction](https://github.com/aniruddhaadak/swarmandala/issues/new?template=raga_correction.yml) — a citation is required |
| A vulnerability                                                                    | [SECURITY.md](./SECURITY.md). Never a public issue.                                                                              |
| A conduct problem                                                                  | <conduct@swarmandala.dev>                                                                                                        |
| A contribution workflow question                                                   | [CONTRIBUTING.md](./CONTRIBUTING.md)                                                                                             |

Please do not open an issue to ask a question, and please do not direct-message a maintainer for
support. Issues that are questions get closed with a link to Discussions, which is not a judgement on
the question — it is how the archive stays usable.

## What to include

For anything that behaves incorrectly, a report we can act on contains:
1. **What you expected and what happened.** One or two sentences, plus the URL or route if it is a
   page.
2. **Steps to reproduce.** Numbered, starting from a clean checkout where possible. Say whether you
   ran `bun run dev` or a production build (`bun run build && bun run start`).
3. **Environment.** Operating system and version, `bun --version`, browser and version, and the commit
   (`git rev-parse --short HEAD`) or "main as of <date>".
4. **Output.** The console error, the terminal trace, or the failing gate. Paste text rather than a
   photo of a screen; a screenshot is still useful for layout and audio-UI problems.
5. **Scope.** Does it happen with no `.env` file at all? Does it happen in another browser? Does it
   happen on the deployed site as well as locally?

For a raga correction, add the source: an edition and page, or a recording and timestamp. Without it
the issue cannot be reviewed, because "this sounds wrong to me" is not something a maintainer can
verify.

## What is out of scope

- **Music lessons and theory tutoring.** We can point at the source note in `docs/reference/ragas.md`,
  but this is not a classroom.
- **Notation or transliteration disputes without a source.** See the citation rule in
  [CONTRIBUTING.md](./CONTRIBUTING.md#citations).
- **Help deploying your own fork** beyond the documented commands, and support for modified copies.
  The manual deploy workflow is documented in `.github/workflows/deploy-vercel.yml`.
- **Requests to remove citations or "simplify" a disputed entry** by picking one gharana's version
  silently. We would rather show the disagreement.
- **Commercial support, SLAs, or private consulting.** None is offered.
- **Feature requests disguised as bugs.** If the app is doing what it says and you want it to do
  something else, that is a feature request.

## Response expectations

Triage happens in batches, usually within a week, but a small project cannot promise it. A clear
reproduction with an environment and a commit moves to the front. A report that cannot be reproduced
will be closed after a request for more detail and a reasonable wait — it can always be reopened.

If a fix is small and you have already found the cause, a pull request is more welcome than an issue.
Read [CONTRIBUTING.md](./CONTRIBUTING.md) first; the five gates apply to everyone.
