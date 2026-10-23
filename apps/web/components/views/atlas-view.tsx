"use client";

import { PRAHARS, type PraharNumber, praharByNumber, searchRagas } from "@repo/core";
import { RAGAS } from "@repo/seed";
import { cn } from "@repo/ui";
import { useMemo, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { RagaCard } from "@/components/raga-card";
import { useI18n } from "@/lib/i18n/provider";

type Sort = "prahar" | "name";
type Filter = PraharNumber | 0;

export function AtlasView() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>(0);
  const [sort, setSort] = useState<Sort>("prahar");

  const results = useMemo(() => {
    const searched = searchRagas(RAGAS, query);
    const filtered = filter === 0 ? searched : searched.filter((raga) => raga.prahar === filter);
    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      return a.prahar - b.prahar || a.name.localeCompare(b.name);
    });
  }, [filter, query, sort]);

  return (
    <div className="container-page pb-10 pt-14 sm:pt-20">
      <p className="eyebrow flex items-center gap-3">
        <span className="h-px w-8 bg-marigold" />
        {t("nav.atlas")}
      </p>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.98]">{t("atlas.title")}</h1>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-bone-dim">
            {t("atlas.intro")}
          </p>
        </div>
        <p className="numeric text-[0.7rem] uppercase tracking-[0.18em] text-bone-dim">
          {t("atlas.results", { n: results.length })}
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-4 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative flex w-full max-w-md items-center">
          <span className="pointer-events-none absolute left-3 text-bone-dim">
            <SearchIcon width={16} height={16} />
          </span>
          <span className="sr-only">{t("atlas.search")}</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("atlas.search")}
            className="h-10 w-full rounded-full border border-line bg-transparent pl-9 pr-4 text-sm text-bone outline-none transition-colors placeholder:text-bone-dim/80 focus:border-marigold/60"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <div className="scroll-x flex max-w-full items-center gap-1.5 pb-1">
            <button
              type="button"
              onClick={() => setFilter(0)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-[0.68rem] transition-colors",
                filter === 0
                  ? "border-marigold bg-marigold/10 text-marigold"
                  : "border-line text-bone-dim hover:border-line-strong",
              )}
            >
              {t("atlas.filterAll")}
            </button>
            {PRAHARS.map((prahar) => (
              <button
                key={prahar.number}
                type="button"
                onClick={() => setFilter(prahar.number)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1 text-[0.68rem] transition-colors",
                  filter === prahar.number
                    ? "border-marigold bg-marigold/10 text-marigold"
                    : "border-line text-bone-dim hover:border-line-strong",
                )}
                title={`${prahar.name} · ${prahar.english}`}
              >
                {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"][prahar.number - 1]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-full border border-line p-0.5">
            {(
              [
                ["prahar", t("atlas.sortPrahar")],
                ["name", t("atlas.sortName")],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setSort(value)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[0.65rem] transition-colors",
                  sort === value ? "bg-bone/10 text-bone" : "text-bone-dim hover:text-bone",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="py-24 text-center text-sm text-bone-dim">{t("atlas.empty")}</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((raga, index) => (
            <div key={raga.slug} className="relative">
              <RagaCard raga={raga} index={sort === "prahar" ? undefined : index} />
              <span className="pointer-events-none absolute right-5 bottom-5 text-[0.58rem] uppercase tracking-[0.16em] text-bone-dim/80">
                {praharByNumber(raga.prahar).name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
