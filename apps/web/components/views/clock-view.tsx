"use client";

import {
  formatClock,
  formatHour,
  minuteOfDay,
  PRAHARS,
  praharByNumber,
  praharForMinutes,
  praharProgress,
  praharWindowLabel,
  recommendRagas,
  seasonForMonth,
} from "@repo/core";
import { RAGAS } from "@repo/seed";
import { Badge, Card, cn } from "@repo/ui";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { PraharWheel } from "@/components/prahar-wheel";
import { RagaCard } from "@/components/raga-card";
import { useI18n } from "@/lib/i18n/provider";

export function ClockView({ initialMinutes }: { initialMinutes?: number | undefined }) {
  const { t } = useI18n();
  const [nowMinutes, setNowMinutes] = useState<number | null>(null);
  const [minutes, setMinutes] = useState<number>(initialMinutes ?? 19 * 60);

  useEffect(() => {
    const update = () => {
      const current = minuteOfDay(new Date());
      setNowMinutes(current);
      if (initialMinutes === undefined) setMinutes(current);
    };
    update();
    const interval = window.setInterval(update, 30_000);
    return () => window.clearInterval(interval);
  }, [initialMinutes]);

  const prahar = praharForMinutes(minutes);
  const current = praharByNumber(prahar);
  const season = seasonForMonth(new Date().getMonth());
  const recommendations = useMemo(
    () => recommendRagas(RAGAS, minutes, { season, limit: 3 }),
    [minutes, season],
  );
  const inWatch = RAGAS.filter((raga) => raga.prahar === prahar);

  return (
    <div className="container-page pb-10 pt-14 sm:pt-20">
      <p className="eyebrow flex items-center gap-3">
        <span className="h-px w-8 bg-marigold" />
        {t("nav.clock")}
      </p>
      <div className="mt-5 max-w-2xl">
        <h1 className="text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.98]">{t("clock.title")}</h1>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-bone-dim">{t("clock.intro")}</p>
      </div>

      <div className="mt-12 grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <PraharWheel minutes={minutes} onChange={setMinutes} nowMinutes={nowMinutes ?? minutes} />
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setMinutes(nowMinutes ?? minuteOfDay(new Date()))}
              className="rounded-full border border-line px-4 py-1.5 text-[0.7rem] text-bone-dim transition-colors hover:border-marigold/50 hover:text-marigold"
            >
              {t("clock.now")} · {nowMinutes === null ? "—:—" : formatClock(nowMinutes)}
            </button>
            <span className="text-[0.65rem] text-bone-dim/80">{t("clock.drag")}</span>
          </div>
        </div>

        <div>
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">{t("clock.watch", { n: prahar })}</p>
                <h2 className="mt-2 font-display text-4xl leading-none">{current.name}</h2>
                <p className="deva mt-1 text-lg text-bone-dim">{current.devanagari}</p>
              </div>
              <div className="text-right">
                <p className="numeric text-2xl text-bone">{formatClock(minutes)}</p>
                <p className="mt-1 text-[0.65rem] text-bone-dim">{praharWindowLabel(prahar)}</p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-bone-dim">{current.blurb}</p>

            <div className="mt-5">
              <div className="flex items-center justify-between text-[0.6rem] uppercase tracking-[0.16em] text-bone-dim/80">
                <span>{formatHour(current.startHour)}</span>
                <span>{formatHour(current.endHour)}</span>
              </div>
              <div className="mt-2 h-px w-full bg-line">
                <div
                  className="h-px bg-marigold"
                  style={{ width: `${Math.round(praharProgress(minutes) * 100)}%` }}
                />
              </div>
            </div>

            <div className="mt-6 border-t border-line pt-5">
              <p className="eyebrow">{t("clock.suggested")}</p>
              <ul className="mt-3 space-y-2">
                {recommendations.map((entry) => (
                  <li key={entry.raga.slug}>
                    <Link
                      href={`/raga/${entry.raga.slug}`}
                      className="group flex items-center justify-between gap-3 rounded-lg border border-transparent px-2 py-2 transition-colors hover:border-line hover:bg-bone/[0.03]"
                    >
                      <span className="min-w-0">
                        <span className="font-display text-lg text-bone group-hover:text-marigold">
                          {entry.raga.name}
                        </span>
                        <span className="ml-2 text-[0.65rem] text-bone-dim">
                          {entry.reasons[0] ?? ""}
                        </span>
                      </span>
                      <ArrowRightIcon
                        width={14}
                        height={14}
                        className="shrink-0 text-bone-dim transition-transform group-hover:translate-x-0.5 group-hover:text-marigold"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <div className="mt-4 flex flex-wrap gap-2">
            {PRAHARS.map((entry) => (
              <button
                key={entry.number}
                type="button"
                onClick={() => setMinutes(entry.startHour * 60 + 30)}
                className={cn(
                  "rounded-full border px-3 py-1 text-[0.65rem] transition-colors",
                  entry.number === prahar
                    ? "border-marigold text-marigold"
                    : "border-line text-bone-dim hover:border-line-strong",
                )}
              >
                {entry.english}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl">{t("clock.ragasInWatch")}</h2>
          <Badge tone="muted">{t("clock.watch", { n: prahar })}</Badge>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {inWatch.map((raga, index) => (
            <RagaCard key={raga.slug} raga={raga} index={index} />
          ))}
        </div>
      </section>

      <section className="mt-20 border-t border-line pt-10">
        <h2 className="font-display text-2xl">{t("clock.selectWatch")}</h2>
        <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {PRAHARS.map((entry) => {
            const count = RAGAS.filter((raga) => raga.prahar === entry.number).length;
            return (
              <button
                key={entry.number}
                type="button"
                onClick={() => setMinutes(entry.startHour * 60 + 30)}
                className={cn(
                  "group bg-ink p-5 text-left transition-colors hover:bg-marigold/[0.06]",
                  entry.number === prahar ? "bg-marigold/[0.08]" : "",
                )}
              >
                <div className="flex items-baseline justify-between">
                  <span className="numeric text-[0.62rem] text-marigold">
                    {String(entry.number).padStart(2, "0")}
                  </span>
                  <span className="text-[0.58rem] uppercase tracking-[0.16em] text-bone-dim/80">
                    {count} ragas
                  </span>
                </div>
                <p className="mt-3 font-display text-xl leading-none text-bone group-hover:text-marigold">
                  {entry.english}
                </p>
                <p className="deva mt-1 text-xs text-bone-dim">{entry.devanagari}</p>
                <p className="mt-3 text-[0.62rem] text-bone-dim/80">
                  {praharWindowLabel(entry.number)}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
