"use client";

import { PracticeConsole } from "@/components/practice-console";
import { useI18n } from "@/lib/i18n/provider";

export function PracticeView({ initialRaga }: { initialRaga?: string | undefined }) {
  const { t } = useI18n();

  return (
    <div className="container-page pb-16 pt-14 sm:pt-20">
      <p className="eyebrow flex items-center gap-3">
        <span className="h-px w-8 bg-marigold" />
        {t("nav.practice")}
      </p>
      <div className="mt-5 max-w-2xl">
        <h1 className="text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.98]">{t("practice.title")}</h1>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-bone-dim">{t("practice.intro")}</p>
      </div>

      <div className="mt-10">
        <PracticeConsole initialRaga={initialRaga ?? "yaman"} />
      </div>

      <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
        {[
          {
            title: t("practice.drone"),
            body: "A four-string tanpura, synthesised: Pa–Sa–Sa–Sa, with a slow jawari shimmer. Change Sa to match your voice.",
          },
          {
            title: t("practice.taal"),
            body: "Teentaal (16), Jhaptal (10), Roopak (7), Keherwa (8). Sam is the first beat; khali is the empty one.",
          },
          {
            title: t("practice.tempo"),
            body: "Start at 60–70 bpm. The theka is a metronome with manners — it should not rush you.",
          },
        ].map((item) => (
          <div key={item.title} className="bg-ink p-5">
            <h2 className="font-display text-lg">{item.title}</h2>
            <p className="mt-2 text-[0.8rem] leading-relaxed text-bone-dim">{item.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-[0.7rem] text-bone-dim/80">
        Everything you hear is generated in the browser with the Web Audio API. Nothing is
        downloaded, streamed, or sampled. Headphones recommended.
      </p>
    </div>
  );
}
