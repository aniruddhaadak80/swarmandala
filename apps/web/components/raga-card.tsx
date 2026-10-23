"use client";

import { praharByNumber, type Raga, uniqueNotes } from "@repo/core";
import { Badge, Card } from "@repo/ui";
import Link from "next/link";
import { SwaraChip } from "./note-sequence";

export function RagaCard({ raga, index }: { raga: Raga; index?: number | undefined }) {
  const prahar = praharByNumber(raga.prahar);
  const notes = uniqueNotes(raga);

  return (
    <Card className="surface-hover group relative flex h-full flex-col overflow-hidden p-5">
      <Link
        href={`/raga/${raga.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`${raga.name} — ${raga.mood}`}
      />
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.18em] text-bone-dim">
          {index !== undefined ? (
            <span className="numeric text-marigold">{String(index + 1).padStart(2, "0")}</span>
          ) : null}
          <span>
            {prahar.number}. {prahar.english}
          </span>
        </span>
        <Badge tone="muted" className="border-transparent px-0 text-[0.58rem]">
          {raga.thaat}
        </Badge>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <h3 className="font-display text-[1.55rem] leading-none text-bone transition-colors group-hover:text-marigold">
          {raga.name}
        </h3>
        <span className="deva shrink-0 text-sm text-bone-dim">{raga.devanagari}</span>
      </div>

      <p className="mt-3 line-clamp-2 text-[0.82rem] leading-relaxed text-bone-dim">{raga.mood}</p>

      <div className="mt-auto flex flex-wrap items-center gap-1 pt-5">
        {notes.map((swara) => (
          <SwaraChip key={swara} swara={swara} />
        ))}
      </div>
    </Card>
  );
}
