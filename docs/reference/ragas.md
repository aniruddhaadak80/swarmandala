# Raga reference and dataset audit

This document is the reference promised by the header comment in
`packages/seed/src/ragas.ts`:

> Prahar assignment follows the common concert convention (eight three-hour
> watches from 4am). Gharanas disagree about edges; see
> `docs/reference/ragas.md`.

It audits all **24** ragas in that file against public sources, records where the
sources disagree with the dataset _and with each other_, and proposes fixes. It
does **not** change any code.

**Headline:** 24 reviewed — **9 high**, **8 medium**, **7 low** confidence.
The clear-cut problems are Asavari's swapped vadi/samvadi and sampurna ascent,
Lalit's thaat, Durga's two empty fields plus its prahar, and Miyan ki Malhar's
vadi. A handful of other prahars are off by one watch.

---

## 1. Notation

| Symbol          | Meaning                      |
| --------------- | ---------------------------- |
| `S R G M P D N` | shuddha (natural) swaras     |
| `r g d n`       | komal (flat) Re, Ga, Dha, Ni |
| `M^`            | tivra (sharp) Ma             |
| `S'`            | the same swara one octave up |

A trailing apostrophe raises the octave. The dataset has **no prefix-octave
marker**, so a phrase that begins on lower Ni (common in Bhimpalasi, Multani and
Brindabani Sarang) cannot be written. That is a notation limit, not a musical
error, and is treated as such below.

## 2. Prahar numbering

`packages/core/src/prahar.ts` defines eight three-hour watches starting at 4am.
Everything in this audit is remapped onto that scheme:

| Prahar | Hours       | Prahar | Hours       |
| ------ | ----------- | ------ | ----------- |
| 1      | 04:00–07:00 | 5      | 16:00–19:00 |
| 2      | 07:00–10:00 | 6      | 19:00–22:00 |
| 3      | 10:00–13:00 | 7      | 22:00–01:00 |
| 4      | 13:00–16:00 | 8      | 01:00–04:00 |

**This matters.** Several sources use a 6am-based eight-fold division, so their
"5th prahar (6–9pm)" is this project's **6**, and their "2nd prahar of the day
(9am–12pm)" is this project's **3**. Every time comparison below has already been
remapped; the raw source wording is quoted where it is ambiguous.

## 3. Method, sources, and what "confidence" means

**Method.** Wikipedia infoboxes were read from raw wikitext
(`?action=raw`) rather than rendered prose, because the rendered article and its
own infobox disagree in at least two cases (Ahir Bhairav, Desh). Each raga was
then checked against a second source:
- **[Tanarang](https://tanarang.com/raag-index/)** — Acharya Tanarang's teaching
  archive. Every raga page has an explicit _Swar / Jati / Thaat / Vadi–Samvadi /
  Time / Aaroh–Avroh_ table, which makes it the most mechanically comparable
  source to this dataset.
- **[SwarGanga](https://www.swarganga.org/)** — raagabase with aroha, avaroha,
  pakad, vadi/samvadi and prahar. Uses 6am-based prahar numbering.
- **[Chandrakantha](https://chandrakantha.com/music-and-dance/i-class-music/index-of-rags/)**
  — used for the light-classical ragas where the classical sources are thin.
- **Bor, _The Raga Guide_** — not read directly; only where Wikipedia cites it
  (Pilu, Hamsadhwani, Bageshri, Yaman, Darbari).

**Confidence** is confidence that the row _as recorded_ is musically defensible:
- **high** — every field agrees with at least two sources, or the only variance
  is a naming quibble.
- **medium** — fields are right but a source contradicts itself, or one field is
  a simplification that loses an identifying phrase.
- **low** — at least one field is wrong, or the field is genuinely undecided in
  the literature.

**Caveat on the sources themselves.** Tanarang's Todi and Multani pages both
describe Madhyam as _tivra_ in prose while printing shuddha `M` in the notation
on the same page. Todi and Multani use **shuddha** Ma. The prose is an error and
is not treated as evidence. Wikipedia's Khamaj article likewise prints a
lowercase `m` in one place. Public raga references are useful but not
authoritative; this is why every disagreement is recorded instead of averaged
away.

## 4. Summary table

| Raga              | Thaat                       | Prahar             | Vadi                     | Samvadi                  | Confidence |
| ----------------- | --------------------------- | ------------------ | ------------------------ | ------------------------ | ---------- |
| Bhairav           | Bhairav                     | 1 · 4–7am          | d                        | r                        | high       |
| Ahir Bhairav      | Bhairav                     | 2 · 7–10am         | M                        | S                        | medium     |
| Lalit             | **Poorvi** (dataset: Marwa) | 1 · 4–7am          | M                        | S                        | low        |
| Miyan ki Todi     | Todi                        | 3 · 10am–1pm       | d                        | g                        | medium     |
| Asavari           | Asavari                     | 3 · 10am–1pm       | **d** (dataset: g)       | **g** (dataset: d)       | low        |
| Bhimpalasi        | Kafi                        | 4 · 1–4pm          | M                        | S                        | high       |
| Multani           | Todi                        | **4** (dataset: 5) | P                        | S                        | medium     |
| Marwa             | Marwa                       | 5 · 4–7pm          | r                        | D                        | high       |
| Puriya            | Marwa                       | 5 · 4–7pm          | G                        | N                        | high       |
| Yaman             | Kalyan                      | 6 · 7–10pm         | G                        | N                        | high       |
| Bhupali           | Kalyan                      | 6 · 7–10pm         | G                        | D                        | high       |
| Hamsadhwani       | Bilaval                     | **7** (dataset: 6) | _contested_ (dataset: G) | _contested_ (dataset: N) | low        |
| Bageshri          | Kafi                        | 7 · 10pm–1am       | M                        | S                        | high       |
| Malkauns          | Bhairavi                    | 8 · 1–4am          | M                        | S                        | high       |
| Darbari Kanada    | Asavari                     | 8 · 1–4am          | R                        | P                        | medium     |
| Bhairavi          | Bhairavi                    | 2 · 7–10am         | M                        | S                        | medium     |
| Kafi              | Kafi                        | 7 · 10pm–1am       | P                        | R                        | high       |
| Desh              | Khamaj                      | 7 · 10pm–1am       | R                        | P                        | medium     |
| Khamaj            | Khamaj                      | 7 · 10pm–1am       | G                        | N                        | high       |
| Durga             | Bilaval                     | **7** (dataset: 6) | **M** (dataset: null)    | **S** (dataset: null)    | low        |
| Miyan ki Malhar   | Kafi                        | 7 · 10pm–1am       | **P** (dataset: M)       | S                        | low        |
| Brindabani Sarang | Kafi                        | 4 · 1–4pm          | R                        | P                        | medium     |
| Pilu              | Kafi                        | 6 · 7–10pm         | **G** (dataset: null)    | **N** (dataset: null)    | low        |
| Pahadi            | Bilaval                     | 6 · 7–10pm         | **S** (dataset: null)    | **P** (dataset: null)    | low        |

Bold marks a field the audit believes should change or be filled.

## 5. Raga-by-raga notes

### Bhairav — high

**Solid.** Thaat Bhairav, `S r G M P d N`, vadi Dha, samvadi Re, first prahar
(daybreak). Matches Wikipedia and the standard teaching. Some gharanas treat
komal Re as the expressive centre and would argue for it as vadi; the dataset
follows Bhatkhande, which is the right default.
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Bhairav_(raga))

### Ahir Bhairav — medium

**Solid.** Thaat Bhairav and the mixed scale `S r G M P D n` are agreed
everywhere; the komal Re andolan is the identifying gesture.
**Contested.** The Wikipedia article contradicts itself: the infobox gives
**Dha / Re**, the body text gives **Ma / Sa**. The dataset follows the body text,
which is also the more common teaching. The time is given as "first prahar of the
morning, around 6–9am", which straddles prahars 1 and 2; prahar 2 is a fair
reading and should not be changed without a musical decision.
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Ahir_Bhairav)

### Lalit — low

**Wrong field: thaat.** The dataset says Marwa. Lalit uses **both** Ma, so it
cannot be Marwa thaat, which has only tivra Ma. Wikipedia and Tanarang both place
it in **Poorvi**.
**Solid.** The both-Ma ascent `S r G M M^ D N S'` is correct and correctly
ordered — Ma is the lower of the two, so `M` before `M^` is monotonic. Pa is
varjya and the dataset omits it.
**Contested.** Tanarang gives the 4th prahar of night, 3–6am, which straddles
prahars 8 and 1. The dataset's 1 is defensible for a pre-dawn raga; no change
recommended.
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Lalit_(raga)) ·
[Tanarang](https://tanarang.com/raag-lalit/)

### Miyan ki Todi — medium

**Solid.** Thaat Todi, vadi Dha, samvadi Ga, second prahar of the day
(9am–12pm) — all three agree with the dataset's prahar 3.
**Contested.** Pa in the ascent. Tanarang says Pa is "generally skipped in
aaroh" while its own table prints `P`; Wikipedia's aroha omits Pa. The cleaner
ascent is `S r g M d N S'`, which is what the JSON proposes.
**Source warning.** Tanarang's prose calls Todi's Madhyam _tivra_. It is not —
the notation on the same page uses shuddha Ma. Do not propagate this.
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Todi_(raga)) ·
[Tanarang](https://tanarang.com/raag-todi/)

### Asavari — low

**Wrong: vadi and samvadi are reversed.** Dha is vadi, Ga is samvadi —
the article's infobox, body text and pakad all agree. The dataset has Ga vadi /
Dha samvadi.
**Wrong: the ascent is not sampurna.** Shuddha Asavari is **audava in ascent**
(`S R M P d S'`) with Ga and Ni appearing only on the way down. The dataset
prints a full seven-note ascent, which describes a different raga.
**Simplified.** The source avaroha is vakra —
`S' n d P m P d m P g R S` — while the dataset has the plain
`S' n d P M g R S`. Recognisable, but it drops the `m P d m P` turn that most
identifies Asavari.
**Solid.** Prahar 3 (9am–12pm) is right.
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Asavari)

### Bhimpalasi — high

**Solid.** Kafi thaat; `S g M P n S'` ascent with Pa and Dha varjya going up;
Dha and Re only in descent; vadi Ma, samvadi Sa; second prahar of the afternoon.
Everything matches.
**Notation limit.** Sources begin the ascent on lower Ni (`'n S g M P n S'`).
The dataset's notation has no prefix-octave marker, so the pickup is dropped.
This is not a musical error.
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Bhimpalasi)

### Multani — medium

**Solid.** Todi thaat, vadi Pa, samvadi Sa, `S g M P N S'` — all agree.
**Wrong: prahar.** Multani is a noon raga, **12–3pm**, which is prahar **4**,
not 5. Both Wikipedia and Tanarang say 12–3.
**Notation limit.** The source ascent begins on lower Ni (`'N S g M P N S'`).
**Source warning.** Both sites' prose says "Ma tivra"; their own notation uses
shuddha Ma. Multani has shuddha Ma.
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Multani_(raga)) ·
[Tanarang](https://tanarang.com/raag-multani/)

### Marwa — high

**Solid.** Marwa thaat, Pa varjya, vadi Re, samvadi Dha, sunset (prahar 5). All
correct. Wikipedia notes Patvardhan's alternative emphasis on Dha/Ga; the
dataset follows the common Re/Dha pairing, which is the safer default.
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Marwa_(raga))

### Puriya — high

**Solid.** Same pitch set as Marwa, vadi Ga, samvadi Ni, prahar 5. Correct. The
Marwa/Puriya distinction really is emphasis rather than scale, as the dataset's
`description` already says.
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Puriya)

### Yaman — high

**Solid.** Kalyan thaat, tivra Ma, vadi Ga, samvadi Ni.
**Note on time.** Wikipedia says "first quarter of night" (prahar 6); Bor gives
9pm–midnight (prahar 7). Yaman routinely opens an evening concert, so 6 is the
better default. Recorded as a variant, not a correction.
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Yaman_(raga))

### Bhupali — high

**Solid.** Five shuddha notes, no Ma and no Ni, vadi Ga, samvadi Dha, 7–9pm
(prahar 6). Correct on every field.
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Bhoopali)

### Hamsadhwani — low

**Solid.** Bilaval thaat and the audava scale `S R G P N` are fine.
**Contested: vadi/samvadi.** This is the least settled row in the dataset.
Tanarang and several teaching sites give **Sa–Pa**; Bor (via Wikipedia) gives
**Re–Pa**; a minority gives **Ga–Ni**, which is what the dataset has — and at
least one teacher explicitly argues against Ga–Ni because it pulls the raga
towards Shankara. There is no single defensible answer, so the audit proposes
`null` rather than swapping one contested pair for another.
**Wrong: prahar.** 9pm–12am is prahar **7**, not 6.
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Hamsadhvani) ·
[Tanarang](https://tanarang.com/raag-hansdhwani/) ·
[wholistic wellness space](https://wholisticwellnessspace.wordpress.com/2026/03/15/raag-hamsadhwani)

### Bageshri — high

**Solid, including the field that looks wrong.** Pa does appear in descent —
Bor gives `S' n D m P D g m g R S` — so the dataset's `M P D` in the avaroha is
supported, and the ascent correctly omits Pa and Re. Kafi thaat, vadi Ma,
samvadi Sa, 9pm–12am. No change.
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Bageshri)

### Malkauns — high

**Solid.** Five notes, no Re and no Pa, vadi Ma, samvadi Sa, late night. Prahar 8
(1–4am) matches the usual "12–3am" within one watch.
**Variant.** Thaat is given as Bhairavi by Bhatkhande and by some others as
Asavari; Bhairavi is the common choice. Not worth changing, worth knowing.
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Malkauns)

### Darbari Kanada — medium

**Solid.** Asavari thaat, vadi Re, samvadi Pa, midnight (prahar 8).
**Weak field: avaroha.** Sources give a vakra descent through komal Ni and Dha —
`S' (n)d n P M P (M)g M R S` — while the dataset has
`S' n P d M P g M R S`. Both are recognisable, but the dataset's line loses the
`n–P` cadence most listeners use to identify the raga. Proposed as a
low-confidence fix with no forced replacement.
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Darbari_Kanada)

### Bhairavi — medium

**Solid.** Bhairavi thaat (all komal), samvadi Sa, morning and concert-closing
use.
**Contested: vadi.** Ma is the common choice and Tanarang's; Wikipedia lists
Ma/Pa as disputed. The dataset's Ma is the mainstream reading.
**Soft field: prahar.** Tanarang gives the 1st prahar of the day (6–9am) _or_
"sarvakalik" (any time). Prahar 2 (7–10am) sits inside that window, so no change
is proposed — but this field is inherently soft and should not be used as a hard
constraint.
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Bhairavi_(Hindustani)) ·
[Tanarang](https://tanarang.com/raag-bhairavi/)

### Kafi — high

**Solid.** Kafi thaat, `S R g M P D n`, vadi Pa, samvadi Re, 9pm–12am. All
correct. The thaat/raga name collision is already handled in the dataset's tags.
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Kafi_(raga))

### Desh — medium

**Solid.** Khamaj thaat, shuddha Ni up and komal Ni down, vadi Re, samvadi Pa.
**Contested: time.** Wikipedia's infobox says 12–3am while its own text says
9pm–12am. The dataset's prahar 7 fits the text; prahar 8 would fit the infobox.
No change recommended, but the field is not settled.
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Desh_(raga))

### Khamaj — high

**Solid.** Vadi Ga, samvadi Ni, shuddha Ni in ascent and komal Ni in descent,
9pm–12am. Correct. (One Wikipedia line prints lowercase `m`; Khamaj has shuddha
Ma.)
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Khamaj)

### Durga — low

**Missing: vadi and samvadi.** Both are `null`. They should be **Ma** and **Sa**;
Wikipedia, Tanarang and Sangeetapriya agree (one tutorial gives Dha, which is the
outlier).
**Wrong: prahar.** Durga is a second-prahar-of-night raga, 9pm–12am → prahar
**7**, not 6.
**Solid.** Bilaval thaat and the audava scale `S R M P D` are correct.
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Durga_(raga)) ·
[Tanarang](https://tanarang.com/raag-durga/) ·
[Sangeetapriya](https://sangeetapriya.com/raga-study/raga-durga)

### Miyan ki Malhar — low

**Solid.** Kafi thaat, monsoon association, second prahar of night (prahar 7).
**Wrong: vadi.** Tanarang gives **Pa** vadi, Sa samvadi; the dataset has Ma.
**Wrong: the scale is missing a note.** The raga is defined by **both Nishads**
(Tanarang: "Both Nishads", Dha varjya in avaroh). The dataset contains no
shuddha Ni anywhere, in either direction — which removes one of the two notes
that distinguish Malhar from a plain Kafi descent.
**Simplified.** The source ascent/descent is vakra
(`'N S m R P | g m R S | m R P n D N S'`), so any linear array is an
approximation.
**Sources.** [Tanarang](https://tanarang.com/raag-malhar-raag-miya-malhar/)

### Brindabani Sarang — medium

**Solid.** Vadi Re, samvadi Pa, noon (prahar 4), `S R M P N S'`.
**Notation limit.** Sources begin the ascent on lower Ni
(`N S R M P N S'`), which this notation cannot express.
**Caveat.** The Kafi classification is odd for a scale with no Ga and no Dha;
Wikipedia itself calls it "peculiar". Keep the thaat, but do not treat it as
evidence about the scale.
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Brindavani_Sarang)

### Pilu — low

**Missing: vadi and samvadi.** Both `null`. Wikipedia and Tanarang both give
**Ga** vadi and **Ni** samvadi; that pairing is safe to fill.
**Simplified: the scale.** Pilu uses both Ga, both Dha and both Ni. The dataset's
single-line Kafi ascent (`S R g M P D n S'`) hides all three alternations, which
is precisely what makes Pilu Pilu.
**Contested: time.** Tanarang and Wikipedia say 12–3pm (prahar 4), but Pilu is
light-classical and Chandrakantha lists it as "any time". The dataset's 6 is
defensible for an evening thumri; either value needs a product decision.
**Sources.** [Wikipedia](https://en.wikipedia.org/wiki/Pilu_(raga)) ·
[Tanarang](https://tanarang.com/raag-pilu/)

### Pahadi — low

**Missing: vadi and samvadi.** Both `null`. There is **no Wikipedia raga
article** — `Pahadi` redirects to a disambiguation page — so this row rests on
SwarGanga, Chandrakantha and teaching material. The majority reading is
**Sa–Pa** (SwarGanga, Chandrakantha); Pa–Sa and Ga–Dha are also published. This
is a genuinely unsettled field and the weakest row in the file.
**Solid: prahar.** SwarGanga's "prahar 5 (6–9pm)" uses 6am-based numbering,
which maps to this project's prahar 6. No change.
**Solid: scale.** `S R G P D S'` is the standard form — Bhupali-like ascent,
Bilawal descent, with Ma and Ni as passing touches in performance.
**Sources.** [SwarGanga](https://www.swarganga.org/raags/148/Pahadi) ·
[Chandrakantha](https://chandrakantha.com/music-and-dance/i-class-music/index-of-rags/rag-pahadi)

## 6. Known caveats

### 6.1 Null fields

Six fields are `null`, across three ragas. `Raga.vadi` and `Raga.samvadi` are
typed `Swara | null` in `packages/core/src/raga.ts`, so this is structurally
legal; these are the only nulls in the file.

| Raga   | Field     | Why it is null                         | Best-supported value     |
| ------ | --------- | -------------------------------------- | ------------------------ |
| Durga  | `vadi`    | Never filled in                        | `M` (Ma)                 |
| Durga  | `samvadi` | Never filled in                        | `S` (Sa)                 |
| Pilu   | `vadi`    | Light-classical raga, no fixed grammar | `G` (Ga)                 |
| Pilu   | `samvadi` | Same                                   | `N` (Ni)                 |
| Pahadi | `vadi`    | Folk-derived, sources disagree         | `S` (Sa), low confidence |
| Pahadi | `samvadi` | Same                                   | `P` (Pa), low confidence |

Durga and Pilu have a clear majority answer and should probably be filled.
Pahadi does not: at least four different pairs are published, and filling it
would encode one teacher's preference as fact.

### 6.2 Non-null fields that are still soft

- **Bhairavi`prahar`** — "first prahar of the day" _or_ "sarvakalik". Prahar 2
  is inside the window but the field is not really a constraint.
- **Ahir Bhairav`vadi`/`samvadi`** — the source article contradicts itself
  (infobox Dha/Re vs body Ma/Sa).
- **Yaman`prahar`** — first quarter of night (6) vs Bor's 9pm–midnight (7).
- **Desh`prahar`** — the source article contradicts itself (9pm–12am vs
  12–3am).
- **Hamsadhwani`vadi`/`samvadi`** — three published pairs; the dataset's Ga/Ni
  is the least supported.
- **Darbari Kanada`avaroha`** — the `n–P` cadence is missing.
- **Malkauns`thaat`** — Bhairavi by Bhatkhande, Asavari by others.
- **Todi`aroha`** — Pa generally skipped, but not by every gharana.

### 6.3 Notation limits

The format cannot express a lower-octave pickup note, so three ascents that
properly begin on lower Ni are written from Sa: **Bhimpalasi**, **Multani**,
**Brindabani Sarang**. This is not an error in the data and is not proposed as a
fix; changing it would require a notation change in `packages/core`.

## 7. Corrections applied / proposed

**Applied: none.** No file under `packages/` was modified. This audit is
read-only, and the dataset is the source of truth until a maintainer accepts a
change.

**Proposed**, in descending order of confidence:

| #   | Raga            | Field     | Current                | Proposed           | Confidence |
| --- | --------------- | --------- | ---------------------- | ------------------ | ---------- |
| 1   | Asavari         | `vadi`    | `g`                    | `d`                | high       |
| 2   | Asavari         | `samvadi` | `d`                    | `g`                | high       |
| 3   | Asavari         | `aroha`   | `S R g M P d n S'`     | `S R M P d S'`     | high       |
| 4   | Lalit           | `thaat`   | `Marwa`                | `Poorvi`           | high       |
| 5   | Durga           | `vadi`    | `null`                 | `M`                | high       |
| 6   | Durga           | `samvadi` | `null`                 | `S`                | high       |
| 7   | Durga           | `prahar`  | `6`                    | `7`                | high       |
| 8   | Miyan ki Malhar | `vadi`    | `M`                    | `P`                | medium     |
| 9   | Miyan ki Malhar | `aroha`   | no shuddha Ni          | add `N`            | medium     |
| 10  | Miyan ki Malhar | `avaroha` | no shuddha Ni          | add `N`            | medium     |
| 11  | Multani         | `prahar`  | `5`                    | `4`                | medium     |
| 12  | Todi            | `aroha`   | includes `P`           | omit `P`           | medium     |
| 13  | Hamsadhwani     | `prahar`  | `6`                    | `7`                | medium     |
| 14  | Pilu            | `vadi`    | `null`                 | `G`                | low        |
| 15  | Pilu            | `samvadi` | `null`                 | `N`                | low        |
| 16  | Pilu            | `prahar`  | `6`                    | `4`                | low        |
| 17  | Pahadi          | `vadi`    | `null`                 | `S`                | low        |
| 18  | Pahadi          | `samvadi` | `null`                 | `P`                | low        |
| 19  | Darbari Kanada  | `avaroha` | `S' n P d M P g M R S` | undecided (`null`) | low        |
| 20  | Hamsadhwani     | `vadi`    | `G`                    | undecided (`null`) | low        |
| 21  | Hamsadhwani     | `samvadi` | `N`                    | undecided (`null`) | low        |

Items 19–21 are deliberately `null`: the sources are split, and a wrong
"correction" is worse than an honest gap. The machine-readable list holds **33
entries** (7 high, 6 medium, 20 low) and also carries the fields that are
contested but should _not_ change, such as Bhairavi's prahar and Ahir Bhairav's
vadi. `suggested: null` always means "no safe single answer", never "no
opinion". See [docs/reference/raga-audit.json](./raga-audit.json).

### 7.1 What should not be "fixed"

Three entries look suspicious and are actually right:
- **Bageshri's Pa in descent** — Bor's avaroha contains `m P D`, so the dataset
  is supported.
- **Lalit's both-Ma ascent** — `M` then `M^` is the correct order; the two Ma are
  adjacent, not contradictory.
- **Pahadi's prahar 6** — SwarGanga's "prahar 5" is 6am-based and maps onto 6.

## 8. Bottom line

The dataset is strongest on scale and thaat for the well-documented classical
ragas, and weakest exactly where the tradition is weakest: the light-classical
and folk-derived entries (Pilu, Pahadi), the borrowed Carnatic raga
(Hamsadhwani), and the vadi/samvadi pairs that textbooks copy from one another.
The four corrections worth making first are Asavari's swapped vadi/samvadi,
Lalit's thaat, Durga's two nulls, and Miyan ki Malhar's missing shuddha Ni.
