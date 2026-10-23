"use client";

import {
  compareRagas,
  praharByNumber,
  praharWindowLabel,
  RASA_LABELS,
  relatedRagas,
  type Swara,
  uniqueNotes,
} from "@repo/core";
import { getRaga, RAGAS } from "@repo/seed";
import { buttonClass, Card, cn } from "@repo/ui";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon, ArrowUpRightIcon, PlayIcon, StopIcon } from "@/components/icons";
import { Mandala } from "@/components/mandala";
import { NoteSequence, SwaraChip } from "@/components/note-sequence";
import { RagaCard } from "@/components/raga-card";
import { useAudio } from "@/lib/audio/provider";
import { useI18n } from "@/lib/i18n/provider";

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line/70 py-3 last:border-b-0">
      <dt className="shrink-0 text-[0.62rem] uppercase tracking-[0.16em] text-bone-dim/80">
        {label}
      </dt>
      <dd className="text-right text-[0.82rem] text-bone">{children}</dd>
    </div>
  );
}

export function RagaView({ slug }: { slug: string }) {
  const { t } = useI18n();
  const { playNote, playPhrase, droneOn, toggleDrone } = useAudio();
  const [activeNote, setActiveNote] = useState<Swara | null>(null);
  const clearRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (clearRef.current) window.clearTimeout(clearRef.current);
    },
    [],
  );

  const raga = getRaga(slug);

  if (!raga) {
    return (
      <div className="container-page py-32 text-center">
        <p className="deva text-4xl text-marigold/80">राग</p>
        <h1 className="mt-4 font-display text-3xl">{t("raga.notFound")}</h1>
        <Link href="/atlas" className={buttonClass({ className: "mt-8" })}>
          {t("raga.back")}
          <ArrowRightIcon width={15} height={15} />
        </Link>
      </div>
    );
  }

  const prahar = praharByNumber(raga.prahar);
  const notes = uniqueNotes(raga);
  const related = relatedRagas(raga, RAGAS, 3);

  const playSwara = (swara: Swara) => {
    playNote(swara);
    setActiveNote(swara);
    if (clearRef.current) window.clearTimeout(clearRef.current);
    clearRef.current = window.setTimeout(() => setActiveNote(null), 700);
  };

  const playSequence = (sequence: readonly string[]) => {
    playPhrase(sequence, 0.34);
  };

  return (
    <article className="container-page pb-10 pt-10 sm:pt-14">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[0.7rem] text-bone-dim">
        <Link href="/atlas" className="transition-colors hover:text-marigold">
          {t("nav.atlas")}
        </Link>
        <span aria-hidden="true" className="text-bone-dim/40">
          /
        </span>
        <span className="text-bone-dim/80">{raga.name}</span>
      </nav>

      <header className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div className="rise-in">
          <p className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-marigold" />
            {t("raga.prahar")} {raga.prahar} · {prahar.english} · {praharWindowLabel(raga.prahar)}
          </p>
          <div className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <h1 className="text-[clamp(2.8rem,7vw,5.2rem)] leading-[0.92] tracking-[-0.02em]">
              {raga.name}
            </h1>
            <span className="deva text-[clamp(1.4rem,3vw,2rem)] text-bone-dim">
              {raga.devanagari}
            </span>
          </div>
          <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-bone-dim">{raga.mood}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <button
            type="button"
            onClick={() => playSequence([...raga.aroha, ...raga.avaroha])}
            className={buttonClass({ size: "md" })}
          >
            <PlayIcon width={14} height={14} />
            {t("raga.listen")}
          </button>
          <button
            type="button"
            onClick={toggleDrone}
            className={buttonClass({ variant: "outline", size: "md" })}
            aria-pressed={droneOn}
          >
            {droneOn ? <StopIcon width={14} height={14} /> : <PlayIcon width={14} height={14} />}
            {droneOn ? t("raga.stop") : t("practice.drone")}
          </button>
        </div>
      </header>

      <div className="mt-14 grid items-start gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
        <div className="relative">
          <div className="pointer-events-none absolute inset-x-8 top-6 h-px bg-line" />
          <Mandala
            raga={raga}
            onNote={playSwara}
            activeNote={activeNote}
            className="relative mt-6"
          />
          <p className="mt-2 text-center text-[0.62rem] uppercase tracking-[0.18em] text-bone-dim/80">
            {t("raga.scale")}
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-xl">{t("raga.aroha")}</h2>
              <button
                type="button"
                onClick={() => playSequence(raga.aroha)}
                className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.14em] text-bone-dim transition-colors hover:text-marigold"
              >
                <PlayIcon width={11} height={11} />
                {t("common.play")}
              </button>
            </div>
            <NoteSequence
              notes={raga.aroha}
              onPlay={playNote}
              className="mt-4"
              label={t("raga.aroha")}
            />

            <div className="mt-6 flex items-center justify-between gap-3">
              <h2 className="font-display text-xl">{t("raga.avaroha")}</h2>
              <button
                type="button"
                onClick={() => playSequence(raga.avaroha)}
                className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.14em] text-bone-dim transition-colors hover:text-marigold"
              >
                <PlayIcon width={11} height={11} />
                {t("common.play")}
              </button>
            </div>
            <NoteSequence
              notes={raga.avaroha}
              onPlay={playNote}
              className="mt-4"
              label={t("raga.avaroha")}
            />
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl">{t("raga.pakad")}</h2>
                <p className="mt-1 text-[0.7rem] text-bone-dim/80">
                  The phrase that names the raga by ear.
                </p>
              </div>
              <button
                type="button"
                onClick={() => playSequence(raga.pakad)}
                className={buttonClass({ variant: "outline", size: "sm" })}
              >
                <PlayIcon width={11} height={11} />
                {t("common.play")}
              </button>
            </div>
            <NoteSequence notes={raga.pakad} onPlay={playNote} className="mt-4" />
          </Card>

          <Card className="px-5 py-2 sm:px-6">
            <dl>
              <MetaRow label={t("raga.thaat")}>
                <span className="text-bone">{raga.thaat}</span>
              </MetaRow>
              <MetaRow label={t("raga.vadi")}>
                {raga.vadi ? (
                  <span className="inline-flex items-center gap-2">
                    <SwaraChip swara={raga.vadi} />
                    <span className="text-bone-dim">samvadi</span>
                    {raga.samvadi ? <SwaraChip swara={raga.samvadi} /> : null}
                  </span>
                ) : (
                  <span className="text-bone-dim">—</span>
                )}
              </MetaRow>
              <MetaRow label={t("raga.rasa")}>
                <span className="inline-flex flex-wrap justify-end gap-1.5">
                  {raga.rasa.map((rasa) => (
                    <span key={rasa} title={RASA_LABELS[rasa].gloss}>
                      {RASA_LABELS[rasa].english}
                    </span>
                  ))}
                </span>
              </MetaRow>
              {raga.season ? (
                <MetaRow label={t("raga.season")}>
                  <span className="capitalize">{raga.season}</span>
                </MetaRow>
              ) : null}
              <MetaRow label={t("raga.mood")}>
                <span className="inline-flex flex-wrap justify-end gap-1.5">
                  {raga.tags.map((tag) => (
                    <span key={tag} className="text-[0.7rem] text-bone-dim">
                      #{tag}
                    </span>
                  ))}
                </span>
              </MetaRow>
            </dl>
          </Card>
        </div>
      </div>

      <section className="mt-16 grid gap-8 border-t border-line pt-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <h2 className="font-display text-2xl leading-tight">{t("raga.about")}</h2>
        <div className="space-y-4">
          <p className="text-[0.95rem] leading-[1.75] text-bone-dim">{raga.description}</p>
          <p className="text-[0.85rem] leading-relaxed text-bone-dim/80">
            {notes.length} swaras · {raga.thaat} thaat · {prahar.name} (
            {praharWindowLabel(raga.prahar)})
          </p>
          <Link
            href={`/practice?raga=${raga.slug}`}
            className={buttonClass({ variant: "outline", size: "sm" })}
          >
            {t("raga.practice")}
            <ArrowUpRightIcon width={12} height={12} />
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="eyebrow">{t("raga.related")}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((entry, index) => {
            const comparison = compareRagas(raga, entry);
            return (
              <div key={entry.slug} className="relative">
                <RagaCard raga={entry} index={index} />
                <span
                  className={cn(
                    "pointer-events-none absolute right-5 bottom-5 text-[0.58rem] uppercase tracking-[0.14em]",
                    comparison.similarity > 0.6 ? "text-teal" : "text-bone-dim/80",
                  )}
                >
                  {Math.round(comparison.similarity * 100)}% shared
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </article>
  );
}
