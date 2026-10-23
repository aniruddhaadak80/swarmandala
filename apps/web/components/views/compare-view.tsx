"use client";

import {
  compareRagas,
  type Raga,
  type RagaComparison,
  SWARA_SEMITONES,
  SWARAS,
  type Swara,
  uniqueNotes,
} from "@repo/core";
import { getRaga, RAGAS } from "@repo/seed";
import { Badge, buttonClass, Card, cn, Meter } from "@repo/ui";
import { useState } from "react";
import { NoteSequence } from "@/components/note-sequence";
import { useI18n } from "@/lib/i18n/provider";

const CENTER = 200;
const A_RADIUS = 146;
const B_RADIUS = 116;
const LABEL_RADIUS = 172;

const SHORT: Record<Swara, string> = {
  S: "Sa",
  r: "re",
  R: "Re",
  g: "ga",
  G: "Ga",
  M: "Ma",
  "M^": "Ma^",
  P: "Pa",
  d: "dha",
  D: "Dha",
  n: "ni",
  N: "Ni",
};

function polar(radius: number, swara: Swara) {
  const degrees = SWARA_SEMITONES[swara] * 30 - 90;
  const radians = (degrees * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER + radius * Math.sin(radians),
  };
}

function CompareCircle({ a, b, comparison }: { a: Raga; b: Raga; comparison: RagaComparison }) {
  const setA = new Set(uniqueNotes(a));
  const setB = new Set(uniqueNotes(b));
  const shared = new Set(comparison.shared);

  return (
    <svg
      viewBox="0 0 400 400"
      className="h-auto w-full select-none"
      role="img"
      aria-label={`${a.name} and ${b.name}: ${comparison.shared.length} shared notes, ${Math.round(
        comparison.similarity * 100,
      )}% similar`}
    >
      <defs>
        <radialGradient id="compare-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--marigold)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="var(--marigold)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={CENTER} cy={CENTER} r="190" fill="url(#compare-glow)" />
      {[186, A_RADIUS, B_RADIUS, 86].map((radius) => (
        <circle
          key={radius}
          cx={CENTER}
          cy={CENTER}
          r={radius}
          fill="none"
          stroke="var(--line)"
          strokeWidth="0.75"
        />
      ))}

      {/* biome-ignore lint/a11y/noAriaHiddenOnFocusable: decorative tick marks, none of the children are focusable */}
      <g aria-hidden="true">
        {Array.from({ length: 60 }, (_, index) => {
          const radians = ((index * 6 - 90) * Math.PI) / 180;
          const major = index % 5 === 0;
          const inner = 180;
          const outer = 186;
          return (
            <line
              key={index}
              x1={CENTER + inner * Math.cos(radians)}
              y1={CENTER + inner * Math.sin(radians)}
              x2={CENTER + outer * Math.cos(radians)}
              y2={CENTER + outer * Math.sin(radians)}
              stroke="var(--bone-dim)"
              strokeOpacity={major ? 0.3 : 0.12}
              strokeWidth="0.8"
            />
          );
        })}
      </g>

      {SWARAS.map((swara) => {
        const inA = setA.has(swara);
        const inB = setB.has(swara);
        const both = shared.has(swara);
        const outer = polar(A_RADIUS, swara);
        const inner = polar(B_RADIUS, swara);
        const label = polar(LABEL_RADIUS, swara);

        return (
          <g key={swara}>
            <circle
              cx={outer.x}
              cy={outer.y}
              r={inA ? (both ? 6 : 5) : 2.5}
              fill={both ? "var(--bone)" : inA ? "var(--marigold)" : "var(--ink)"}
              stroke={inA ? "var(--marigold)" : "var(--line-strong)"}
              strokeOpacity={inA ? 0.9 : 0.5}
              strokeWidth={inA ? 1.2 : 0.8}
            />
            <circle
              cx={inner.x}
              cy={inner.y}
              r={inB ? (both ? 6 : 5) : 2.5}
              fill={both ? "var(--bone)" : inB ? "var(--teal)" : "var(--ink)"}
              stroke={inB ? "var(--teal)" : "var(--line-strong)"}
              strokeOpacity={inB ? 0.9 : 0.5}
              strokeWidth={inB ? 1.2 : 0.8}
            />
            <text
              x={label.x}
              y={label.y + 3}
              textAnchor="middle"
              fontSize="9"
              fill={inA || inB ? "var(--bone-dim)" : "var(--bone-dim)"}
              opacity={inA || inB ? 0.85 : 0.35}
              style={{ fontFamily: "var(--font-instrument)" }}
            >
              {SHORT[swara]}
            </text>
          </g>
        );
      })}

      <text
        x={CENTER}
        y={CENTER - 8}
        textAnchor="middle"
        fontSize="34"
        fill="var(--bone)"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        {Math.round(comparison.similarity * 100)}%
      </text>
      <text
        x={CENTER}
        y={CENTER + 14}
        textAnchor="middle"
        fontSize="8"
        letterSpacing="0.22em"
        fill="var(--bone-dim)"
        style={{ fontFamily: "var(--font-instrument)" }}
      >
        SHARED
      </text>
    </svg>
  );
}

function RagaSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (slug: string) => void;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-lg border border-line bg-transparent px-3 text-sm text-bone outline-none transition-colors focus:border-marigold"
      >
        {RAGAS.map((raga) => (
          <option key={raga.slug} value={raga.slug} className="bg-panel">
            {raga.name} · {raga.thaat} · {raga.prahar}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CompareView() {
  const { t } = useI18n();
  const [aSlug, setASlug] = useState("bhairav");
  const [bSlug, setBSlug] = useState("ahir-bhairav");

  const a = getRaga(aSlug) ?? RAGAS[0];
  const b = getRaga(bSlug) ?? RAGAS[1] ?? RAGAS[0];
  const comparison = compareRagas(a, b);
  const sameThaat = a.thaat === b.thaat;

  return (
    <div className="container-page pb-10 pt-14 sm:pt-20">
      <p className="eyebrow flex items-center gap-3">
        <span className="h-px w-8 bg-marigold" />
        {t("nav.compare")}
      </p>
      <div className="mt-5 max-w-2xl">
        <h1 className="text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.98]">{t("compare.title")}</h1>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-bone-dim">{t("compare.intro")}</p>
      </div>

      <Card className="mt-10 p-5 sm:p-6">
        <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <RagaSelect label={t("compare.a")} value={aSlug} onChange={setASlug} />
          <button
            type="button"
            onClick={() => {
              setASlug(bSlug);
              setBSlug(aSlug);
            }}
            className={buttonClass({ variant: "outline", size: "sm", className: "mb-0.5" })}
            aria-label="Swap the two ragas"
          >
            ⇄
          </button>
          <RagaSelect label={t("compare.b")} value={bSlug} onChange={setBSlug} />
        </div>
      </Card>

      <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
        <div>
          <CompareCircle a={a} b={b} comparison={comparison} />
          <div className="mt-4 flex flex-wrap items-center justify-center gap-5 text-[0.65rem] text-bone-dim">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-marigold" /> {a.name}
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-teal" /> {b.name}
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-bone" /> {t("compare.shared")}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-end justify-between gap-4">
              <span className="eyebrow">{t("compare.similarity")}</span>
              <span className="numeric text-3xl text-bone">
                {Math.round(comparison.similarity * 100)}%
              </span>
            </div>
            <div className="mt-3">
              <Meter value={comparison.similarity} label={t("compare.similarity")} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone={sameThaat ? "teal" : "muted"}>
                {sameThaat ? t("compare.sameThaat") : t("compare.differentThaat")}
              </Badge>
              <Badge tone="muted">
                {comparison.shared.length} / {new Set([...uniqueNotes(a), ...uniqueNotes(b)]).size}
              </Badge>
            </div>
          </div>

          <Card className="p-5">
            <h2 className="eyebrow text-teal">{t("compare.shared")}</h2>
            {comparison.shared.length === 0 ? (
              <p className="mt-3 text-sm text-bone-dim">Nothing in common but the tonic.</p>
            ) : (
              <NoteSequence notes={comparison.shared} size="sm" className="mt-3" />
            )}
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <h2 className="text-[0.62rem] uppercase tracking-[0.16em] text-marigold">
                {t("compare.onlyA", { name: a.name })}
              </h2>
              {comparison.onlyA.length === 0 ? (
                <p className="mt-3 text-[0.75rem] text-bone-dim">—</p>
              ) : (
                <NoteSequence notes={comparison.onlyA} size="sm" className="mt-3" />
              )}
            </Card>
            <Card className="p-5">
              <h2 className="text-[0.62rem] uppercase tracking-[0.16em] text-teal">
                {t("compare.onlyB", { name: b.name })}
              </h2>
              {comparison.onlyB.length === 0 ? (
                <p className="mt-3 text-[0.75rem] text-bone-dim">—</p>
              ) : (
                <NoteSequence notes={comparison.onlyB} size="sm" className="mt-3" />
              )}
            </Card>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[0.7rem] text-bone-dim">
            <span>
              {a.name} · {a.thaat}
            </span>
            <span className="text-bone-dim/40">/</span>
            <span>
              {b.name} · {b.thaat}
            </span>
            <a
              href={`/raga/${a.slug}`}
              className="ml-auto inline-flex items-center gap-1 text-marigold underline underline-offset-4"
            >
              {a.name}
            </a>
            <a
              href={`/raga/${b.slug}`}
              className="inline-flex items-center gap-1 text-marigold underline underline-offset-4"
            >
              {b.name}
            </a>
          </div>
        </div>
      </div>

      <section className="mt-16 border-t border-line pt-10">
        <p className="eyebrow">
          {t("compare.shared")} · {comparison.shared.length}
        </p>
        <p className="mt-3 max-w-2xl text-[0.85rem] leading-relaxed text-bone-dim">
          Similarity is the Jaccard overlap of the two pitch-class sets: shared notes divided by the
          union. It is a quick measure of colour, not of raga identity — two ragas can share every
          note and still behave nothing alike.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {[...RAGAS]
            .map((entry) => ({ entry, similarity: compareRagas(a, entry).similarity }))
            .sort((x, y) => y.similarity - x.similarity)
            .slice(0, 6)
            .map(({ entry, similarity }) => (
              <a
                key={entry.slug}
                href={`/raga/${entry.slug}`}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[0.7rem] transition-colors",
                  entry.slug === a.slug
                    ? "border-marigold text-marigold"
                    : "border-line text-bone-dim hover:border-line-strong hover:text-bone",
                )}
              >
                {entry.name}
                <span className="numeric ml-2 text-[0.6rem] text-bone-dim/80">
                  {Math.round(similarity * 100)}%
                </span>
              </a>
            ))}
        </div>
      </section>
    </div>
  );
}
