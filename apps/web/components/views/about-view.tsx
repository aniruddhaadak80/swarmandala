"use client";

import { isKomal, isTivra, SWARA_DEVANAGARI, SWARA_LABELS, SWARAS } from "@repo/core";
import { Card, cn } from "@repo/ui";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";

const STACK = [
  "Next.js 15",
  "React 19",
  "TypeScript strict",
  "Tailwind CSS v4",
  "Web Audio API",
  "Bun",
  "Vitest",
];

export function AboutView() {
  const { t } = useI18n();

  return (
    <div className="container-page pb-16 pt-14 sm:pt-20">
      <p className="eyebrow flex items-center gap-3">
        <span className="h-px w-8 bg-marigold" />
        {t("nav.about")}
      </p>
      <div className="mt-5 max-w-3xl">
        <h1 className="text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.98]">{t("about.title")}</h1>
        <p className="mt-4 text-[1rem] leading-relaxed text-bone-dim">{t("about.intro")}</p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <Card className="p-6 sm:p-7">
          <h2 className="font-display text-2xl">{t("about.whatIsRaga")}</h2>
          <p className="mt-3 text-[0.9rem] leading-[1.75] text-bone-dim">
            {t("about.whatIsRagaBody")}
          </p>
        </Card>
        <Card className="p-6 sm:p-7">
          <h2 className="font-display text-2xl">{t("about.prahar")}</h2>
          <p className="mt-3 text-[0.9rem] leading-[1.75] text-bone-dim">{t("about.praharBody")}</p>
        </Card>
      </div>

      <section className="mt-16 grid gap-10 border-t border-line pt-10 lg:grid-cols-[0.6fr_1.4fr]">
        <div>
          <h2 className="font-display text-2xl">{t("about.notation")}</h2>
          <p className="mt-3 text-[0.85rem] leading-relaxed text-bone-dim">
            {t("about.notationBody")}
          </p>
        </div>
        <div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {SWARAS.map((swara) => (
              <div
                key={swara}
                className={cn(
                  "rounded-lg border p-3",
                  isTivra(swara)
                    ? "border-marigold/40 bg-marigold/5"
                    : isKomal(swara)
                      ? "border-line bg-transparent"
                      : "border-line-strong bg-bone/[0.03]",
                )}
              >
                <div className="flex items-baseline justify-between">
                  <span
                    className={cn(
                      "deva text-lg",
                      isTivra(swara)
                        ? "text-marigold"
                        : isKomal(swara)
                          ? "text-bone-dim"
                          : "text-bone",
                    )}
                  >
                    {SWARA_DEVANAGARI[swara]}
                  </span>
                  <span className="numeric text-[0.62rem] text-bone-dim/80">
                    {swara.replace("^", "")}
                  </span>
                </div>
                <p className="mt-2 text-[0.6rem] uppercase tracking-[0.12em] text-bone-dim">
                  {SWARA_LABELS[swara]}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[0.68rem] text-bone-dim">
            <span>Sa · tonic</span>
            <span>komal · flattened</span>
            <span>tivra · raised</span>
            <span>S’ · upper octave</span>
            <span>P, · lower octave</span>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-10 border-t border-line pt-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl">{t("about.honesty")}</h2>
          <p className="mt-3 text-[0.9rem] leading-[1.75] text-bone-dim">
            {t("about.honestyBody")}
          </p>
          <p className="mt-4 text-[0.9rem] leading-[1.75] text-bone-dim">{t("about.disclaimer")}</p>
        </div>
        <div>
          <h2 className="font-display text-2xl">{t("about.sources")}</h2>
          <p className="mt-3 text-[0.9rem] leading-[1.75] text-bone-dim">
            {t("about.sourcesBody")}
          </p>
          <ul className="mt-4 space-y-2 text-[0.8rem] text-bone-dim">
            <li>
              <Link href="/atlas" className="text-marigold underline underline-offset-4">
                The atlas
              </Link>{" "}
              — twenty-four ragas with ascent, descent, pakad, vadi, and samvadi.
            </li>
            <li>
              <Link href="/clock" className="text-marigold underline underline-offset-4">
                The prahar clock
              </Link>{" "}
              — eight three-hour watches, from 4am.
            </li>
            <li>
              <Link href="/compare" className="text-marigold underline underline-offset-4">
                Compare
              </Link>{" "}
              — pitch-class overlap between any two ragas.
            </li>
            <li>
              <span className="numeric text-bone-dim/80">docs/reference/ragas.md</span> — per-raga
              notes and caveats, in the repository.
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-16 border-t border-line pt-10">
        <h2 className="eyebrow">How it is built</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {STACK.map((item) => (
            <span
              key={item}
              className="rounded-full border border-line px-3 py-1.5 text-[0.7rem] text-bone-dim"
            >
              {item}
            </span>
          ))}
        </div>
        <p className="mt-6 max-w-2xl text-[0.8rem] leading-relaxed text-bone-dim">
          No samples. No analytics. No API keys. The ragas are a single typed dataset; the tanpura
          is additive synthesis; the site works offline once loaded and is MIT licensed.
        </p>
      </section>
    </div>
  );
}
