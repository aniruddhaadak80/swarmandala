<!--
Thanks for the pull request. Keep the description specific enough that a reviewer
who has never opened this branch can verify it without asking you a question.
-->

## What

<!-- The change, in a sentence or two. Link the files or routes that moved. -->

## Why

<!--
The problem this solves, not the implementation. Link the issue if there is one:
Fixes #
-->

## How to test

<!--
Numbered steps a reviewer can follow from a clean checkout. Include the raga slug,
route, or command that shows the behaviour. Example:

1. `bun install && bun run dev`
2. Open http://localhost:3000/raga/bhairav
3. Press "Start the tanpura" and confirm the drone starts without a console error
-->

1.
2.
3.

## Screenshots / recordings

<!--
Before and after for anything visual, at desktop and mobile width. Delete this
section for non-visual changes.
-->

## Musical changes

<!--
Delete this section if the PR does not touch raga data. If it does, every
notation, prahar, vadi/samvadi, or prose change needs a source here and a note
in docs/reference/ragas.md. "It sounds wrong" is not a source.
-->

- Source:
- Note added to `docs/reference/ragas.md`: yes / no

## Checklist

- [ ] One logical change, described in the title and above.
- [ ] `bun run typecheck` passes.
- [ ] `bun run lint` passes (or `bun run format` was run and the diff is included).
- [ ] `bun run test` passes, and new behaviour has a test.
- [ ] `bun run build` passes.
- [ ] `bunx playwright test` passes against the production build.
- [ ] If the raga count changed: seed tests, the `en`/`hi`/`bn` locale files, and `services/rasa/data.py` are updated together.
- [ ] Musical corrections cite a published source or a named recording, with a note in `docs/reference/ragas.md`.
- [ ] No secrets, `.env` files, tokens, or build output are committed.
- [ ] Docs that are now inaccurate are updated in this PR.
