"use client";

import {
  formatClock,
  minuteOfDay,
  PRAHARS,
  praharByNumber,
  praharForMinutes,
  praharWindowLabel,
  recommendRagas,
  type Swara,
  seasonForMonth,
  uniqueNotes,
} from "@repo/core";
import { getRaga, RAGAS } from "@repo/seed";
import { Badge, buttonClass, Card, cn, SectionLabel } from "@repo/ui";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRightIcon, ArrowUpRightIcon, PlayIcon, StopIcon } from "@/components/icons";
import { Mandala } from "@/components/mandala";
import { RagaCard } from "@/components/raga-card";
import { useAudio } from "@/lib/audio/provider";
import { useI18n } from "@/lib/i18n/provider";

const FEATURED_SLUGS = ["bhairav", "todi", "bhimpalasi", "yaman", "bageshri", "malkauns"];

export function HomeView() {
  const { t } = useI18n();
  const { playNote, playPhrase, droneOn, toggleDrone, startDrone } = useAudio();
  const [minutes, setMinutes] = useState<number | null>(null);
  const [activeNote, setActiveNote] = useState<Swara | null>(null);
  const clearRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => setMinutes(minuteOfDay(new Date()));
    update();
    const interval = window.setInterval(update, 30_000);
    return () => {
      window.clearInterval(interval);
      if (clearRef.current) window.clearTimeout(clearRef.current);
    };
  }, []);

  const season = seasonForMonth(new Date().getMonth());
  const shownMinutes = minutes ?? 19 * 60;
  const recommendations = useMemo(
    () => recommendRagas(RAGAS, shownMinutes, { season, limit: 3 }),
    [shownMinutes, season],
  );
  const featured = recommendations[0]?.raga ?? getRaga("yaman") ?? RAGAS[0];
  const featuredPrahar = praharByNumber(featured.prahar);
  const currentPrahar = minutes === null ? null : praharForMinutes(minutes);

  const playSwara = (swara: Swara) => {
    playNote(swara);
    setActiveNote(swara);
    if (clearRef.current) window.clearTimeout(clearRef.current);
    clearRef.current = window.setTimeout(() => setActiveNote(null), 600);
  };

  const hearScale = () => {
    if (!droneOn) startDrone();
    playPhrase([...featured.aroha, ...featured.avaroha], 0.32);
  };

  return (
    <div className="pb-8">
      <section className="container-page grid items-center gap-14 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10 lg:pb-24">
        <div className="rise-in">
          <p className="flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.24em] text-bone-dim">
            <span className="h-px w-8 bg-marigold" />
            {t("hero.eyebrow")}
          </p>

          <h1 className="mt-7 text-[clamp(3.1rem,7.6vw,5.9rem)] leading-[0.94] tracking-[-0.035em]">
            <span className="block text-bone">{t("hero.title1")}</span>
            <span className="mt-1 block italic text-marigold">{t("hero.title2")}</span>
          </h1>

          <p className="mt-7 max-w-md text-[0.98rem] leading-relaxed text-bone-dim">
            {t("hero.intro")}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/atlas" className={buttonClass({ size: "lg" })}>
              {t("hero.cta")}
              <ArrowRightIcon width={16} height={16} />
            </Link>
            <Link href="#now" className={buttonClass({ variant: "outline", size: "lg" })}>
              {t("hero.cta2")}
            </Link>
          </div>

          <p className="mt-8 flex items-center gap-2 text-[0.68rem] text-bone-dim/80">
            <span className="inline-block size-1.5 rounded-full bg-teal" />
            {t("hero.footnote")}
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-x-6 top-4 h-px bg-line sm:inset-x-10" />
          <div className="relative mx-auto max-w-[440px] pt-8">
            <div className="absolute left-1/2 top-3 z-10 -translate-x-1/2">
              <Badge tone="marigold" className="whitespace-nowrap">
                {t("home.ragaOfHour")} · {featuredPrahar.english}
              </Badge>
            </div>
            <Mandala raga={featured} onNote={playSwara} activeNote={activeNote} className="mt-4" />
          </div>

          <Card className="relative z-10 mx-auto mt-2 max-w-[440px] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">
                  {formatClock(shownMinutes)} · {featuredPrahar.name}
                </p>
                <div className="mt-1.5 flex items-baseline gap-2.5">
                  <h2 className="font-display text-2xl leading-none">{featured.name}</h2>
                  <span className="deva text-sm text-bone-dim">{featured.devanagari}</span>
                </div>
              </div>
              <Badge tone="muted" className="shrink-0">
                {featured.thaat}
              </Badge>
            </div>

            <p className="mt-3 text-[0.82rem] leading-relaxed text-bone-dim">{featured.mood}</p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={toggleDrone}
                className={buttonClass({ variant: droneOn ? "outline" : "primary", size: "sm" })}
                aria-pressed={droneOn}
              >
                {droneOn ? (
                  <StopIcon width={12} height={12} />
                ) : (
                  <PlayIcon width={12} height={12} />
                )}
                {droneOn ? t("hero.stop") : t("hero.listen")}
              </button>
              <button
                type="button"
                onClick={hearScale}
                className={buttonClass({ variant: "ghost", size: "sm" })}
              >
                {t("home.listenScale")}
              </button>
              <Link
                href={`/raga/${featured.slug}`}
                className="ml-auto inline-flex items-center gap-1 text-[0.72rem] text-marigold underline underline-offset-4"
              >
                {t("raga.about")}
                <ArrowUpRightIcon width={12} height={12} />
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-1 border-t border-line pt-4">
              {uniqueNotes(featured).map((swara) => (
                <span
                  key={swara}
                  className="deva rounded border border-line px-1.5 py-0.5 text-xs text-bone-dim"
                >
                  {swara.replace("^", "")}
                </span>
              ))}
              <span className="ml-auto self-center text-[0.6rem] uppercase tracking-[0.16em] text-bone-dim/80">
                {t("hero.muted")}
              </span>
            </div>
          </Card>
        </div>
      </section>

      <section id="now" className="container-page scroll-mt-24">
        <div className="hairline flex flex-col gap-4 pt-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-[0.72rem] text-bone-dim">
            {t("home.now", { time: minutes === null ? "—:—" : formatClock(shownMinutes) })}
          </p>
          <div className="flex flex-wrap gap-2">
            {recommendations.map((entry, index) => (
              <Link
                key={entry.raga.slug}
                href={`/raga/${entry.raga.slug}`}
                className="group inline-flex items-center gap-2 rounded-full border border-line bg-bone/[0.02] px-3 py-1.5 text-[0.74rem] text-bone-dim transition-colors hover:border-marigold/50 hover:text-bone"
              >
                <span className="numeric text-[0.6rem] text-marigold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {entry.raga.name}
                <span className="deva text-[0.68rem] text-bone-dim/80">
                  {entry.raga.devanagari}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page mt-24 sm:mt-32">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionLabel index="01">{t("home.watches")}</SectionLabel>
          <p className="max-w-sm text-[0.78rem] text-bone-dim">{t("home.watchesIntro")}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4 lg:grid-cols-8">
          {PRAHARS.map((prahar) => {
            const count = RAGAS.filter((raga) => raga.prahar === prahar.number).length;
            const active = currentPrahar === prahar.number;
            return (
              <Link
                key={prahar.number}
                href={`/clock?at=${String(prahar.startHour).padStart(2, "0")}:00`}
                className={cn(
                  "group relative bg-ink p-4 transition-colors hover:bg-marigold/[0.06]",
                  active ? "bg-marigold/[0.08]" : "",
                )}
              >
                <span className="numeric text-[0.6rem] text-marigold">
                  {String(prahar.number).padStart(2, "0")}
                </span>
                <p className="mt-3 font-display text-lg leading-none text-bone group-hover:text-marigold">
                  {prahar.english}
                </p>
                <p className="deva mt-1 text-[0.7rem] text-bone-dim">{prahar.devanagari}</p>
                <p className="mt-3 text-[0.6rem] text-bone-dim/80">
                  {praharWindowLabel(prahar.number)}
                </p>
                <p className="mt-1 text-[0.6rem] text-bone-dim/80">{count} ragas</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container-page mt-24 sm:mt-32">
        <SectionLabel index="02">{t("home.ways")}</SectionLabel>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            {
              title: t("home.way1Title"),
              body: t("home.way1Body"),
              href: "/atlas",
              cta: t("nav.atlas"),
            },
            {
              title: t("home.way2Title"),
              body: t("home.way2Body"),
              href: "/practice",
              cta: t("nav.practice"),
            },
            {
              title: t("home.way3Title"),
              body: t("home.way3Body"),
              href: "/practice",
              cta: t("practice.taal"),
            },
          ].map((way, index) => (
            <Card key={way.title} className="surface-hover flex flex-col p-6">
              <span className="numeric text-[0.65rem] text-marigold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 font-display text-[1.5rem] leading-tight">{way.title}</h3>
              <p className="mt-3 flex-1 text-[0.85rem] leading-relaxed text-bone-dim">{way.body}</p>
              <Link
                href={way.href}
                className="mt-6 inline-flex items-center gap-2 text-[0.75rem] text-marigold"
              >
                {way.cta}
                <ArrowRightIcon width={13} height={13} />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="container-page mt-24 sm:mt-32">
        <div className="grid gap-10 border-y border-line py-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="deva text-[clamp(2.8rem,6vw,4.6rem)] leading-none text-marigold/80">
              राग
            </p>
            <p className="mt-4 text-[0.6rem] uppercase tracking-[0.24em] text-bone-dim">
              {t("home.quoteAttribution")}
            </p>
          </div>
          <blockquote className="font-display text-[clamp(1.4rem,2.6vw,2.1rem)] leading-[1.3] text-bone/95">
            “{t("home.quote")}”
          </blockquote>
        </div>
      </section>

      <section className="container-page mt-24 sm:mt-32">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionLabel index="03">{t("home.featured")}</SectionLabel>
          <Link
            href="/atlas"
            className="inline-flex items-center gap-1.5 text-[0.75rem] text-marigold underline underline-offset-4"
          >
            {t("home.viewAll", { n: RAGAS.length })}
            <ArrowUpRightIcon width={13} height={13} />
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_SLUGS.map((slug, index) => {
            const raga = getRaga(slug);
            return raga ? <RagaCard key={slug} raga={raga} index={index} /> : null;
          })}
        </div>
      </section>

      <section className="container-page mt-24 sm:mt-32">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-ink-2 px-6 py-14 sm:px-12">
          <div
            className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full"
            style={{
              background: "radial-gradient(circle, var(--glow) 0%, transparent 70%)",
            }}
          />
          <p className="deva text-5xl text-marigold/80">स्वर</p>
          <h2 className="mt-4 max-w-xl font-display text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.02]">
            {t("home.ctaTitle")}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-bone-dim">{t("home.ctaBody")}</p>
          <Link href="/clock" className={buttonClass({ size: "lg", className: "mt-8" })}>
            {t("home.ctaButton")}
            <ArrowRightIcon width={16} height={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
