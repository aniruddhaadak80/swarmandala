# 0005 — Tailwind v4 tokens, warm ink and marigold, local fonts

- Status: Accepted
- Date: 2026-10-23

## Context

Swarmandala is a reading surface as much as an instrument. It shows dense musical notation, Devanagari names, long descriptions, a clock, and a scale mandala. The visual language should feel like a manuscript or a printed atlas: warm paper, dark ink, a marigold accent, and enough contrast to read komal and shuddha swaras without relying on colour alone.

The app uses Tailwind CSS v4 through `@tailwindcss/postcss`. Tailwind v4 is CSS-first: design tokens can live in the stylesheet as custom properties and be exposed to utilities through `@theme`, without a JavaScript config file. The project also needs Devanagari glyphs for raga names and a display face for headings. Loading those from a runtime font CDN would add a third-party request, a privacy leak, and a flash of unstyled text on slow connections.

## Decision

Use a small, named token set rather than ad-hoc hex values, and ship fonts with the application.

The palette is built around:
- `--color-ink` — warm near-black for primary text;
- `--color-ink-soft` — secondary text and notation labels;
- `--color-paper` — warm off-white page ground;
- `--color-sand` — panel and rule colour;
- `--color-marigold` — primary accent for the current watch, sam, and active controls;
- `--color-marigold-deep` — hover and focus accent;
- `--color-vermillion` — a restrained signal colour for errors and destructive actions.

The exact values live in the global stylesheet inside `@theme`, so Tailwind generates utilities such as `bg-paper`, `text-ink`, and `border-sand` from the same source. Components do not introduce one-off hex values. Dark mode, if added later, remaps the same semantic tokens rather than forking every component.

Typography uses `next/font/local` with font files committed under `apps/web/public/fonts`. The display face is subset to the Latin characters used in headings and transliterations; the Devanagari face is subset separately and used for raga names. Both use `display: swap` and a system fallback stack. There is no runtime request to Google Fonts, Fontsource, or any other font CDN. The Biome configuration already excludes `public/fonts` from linting, which keeps binary assets out of the formatter's path.

Motion follows the same restraint. The mandala and meter may animate when the user has not requested reduced motion; when `prefers-reduced-motion: reduce` is set, the same information is shown as a static state. Colour is never the only carrier of meaning: komal notes also carry their lowercase label and Devanagari mark.

## Consequences

### Positive

- A consistent warm-ink and marigold identity across the atlas, clock, raga pages, and practice room.
- Tokens make contrast fixes and seasonal accents a single-file change rather than a search across components.
- Local fonts remove a third-party dependency, avoid sending reader IPs to a font CDN, and work offline once the app is cached.
- Subsetting keeps the font payload modest and avoids shipping a full Devanagari + Latin family for a handful of headings.
- `display: swap` keeps text visible during font load, which matters on the long-form raga pages.

### Negative

- Font binaries live in the repository and need licensing records. A subset that misses a glyph will show a fallback mid-word.
- Devanagari shaping and conjuncts are more complex than Latin. The chosen face and subset need visual checks on real raga names, not just a smoke test.
- Local fonts increase the build output and require cache headers that match the asset fingerprint.
- CSS-first tokens are less discoverable to contributors who expect `tailwind.config.ts`. The project needs a short contribution note or a token reference.
- A warm palette can fail contrast if the marigold is used for body text. The accent is for large text, rules, and state, not for paragraphs.

## Alternatives considered

- **Google Fonts or a font CDN**: easiest to start, but adds a runtime dependency, privacy questions, and a failure mode when the CDN is slow or blocked.
- **System font stack only**: fast and dependency-free, but gives up the manuscript character and consistent Devanagari rendering across platforms.
- **Tailwind v3 with `tailwind.config.ts`**: familiar, but the project already uses v4 and a JavaScript config would duplicate the token source.
- **CSS-in-JS theme**: strong typing, but adds a runtime and conflicts with the server-component-first rendering model.
- **A single font for Latin and Devanagari**: fewer files, but rarely excels at both scripts; the display and text roles have different needs.
