"use client";

import {
  bolAt,
  isKhali,
  isSam,
  SA_CHOICES,
  TAALS,
  type TaalId,
  taalById,
  uniqueNotes,
} from "@repo/core";
import { getRaga, RAGAS } from "@repo/seed";
import { Badge, Button, Card, cn } from "@repo/ui";
import { useEffect, useRef, useState } from "react";
import { PlayIcon, StopIcon } from "@/components/icons";
import { useAudio } from "@/lib/audio/provider";
import { useI18n } from "@/lib/i18n/provider";

export function PracticeConsole({ initialRaga = "yaman" }: { initialRaga?: string }) {
  const { t } = useI18n();
  const { playBol, playNote, droneOn, toggleDrone, saHz, setSa, volume, setVolume } = useAudio();

  const [ragaSlug, setRagaSlug] = useState(initialRaga);
  const [taalId, setTaalId] = useState<TaalId>("teentaal");
  const [bpm, setBpm] = useState(72);
  const [running, setRunning] = useState(false);
  const [beat, setBeat] = useState(-1);
  const [lastNote, setLastNote] = useState<string | null>(null);

  const raga = getRaga(ragaSlug) ?? RAGAS[0];
  const taal = taalById(taalId);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (!running) return;

    let cancelled = false;
    let nextBeat = 0;
    let nextAt = performance.now() + 150;
    const beatMs = 60_000 / bpm;

    const tick = () => {
      if (cancelled) return;
      const now = performance.now();
      while (nextAt < now + 120) {
        const delay = Math.max(0, (nextAt - now) / 1000);
        playBol(bolAt(taal, nextBeat), delay);
        const visual = nextBeat;
        const timeout = window.setTimeout(
          () => setBeat(visual),
          Math.max(0, nextAt - performance.now()),
        );
        timers.current.push(timeout);
        nextAt += beatMs;
        nextBeat += 1;
      }
    };

    tick();
    const interval = window.setInterval(tick, 40);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      for (const timer of timers.current) window.clearTimeout(timer);
      timers.current = [];
    };
  }, [running, bpm, playBol, taal]);

  useEffect(() => {
    if (!running) setBeat(-1);
  }, [running]);

  const current = beat >= 0 ? beat % taal.matras : -1;
  const samNow = current === 0;
  const notes = uniqueNotes(raga);

  return (
    <div className="space-y-6">
      <Card className="p-5 sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.2fr_auto]">
          <label className="block">
            <span className="eyebrow">{t("nav.atlas")}</span>
            <select
              value={ragaSlug}
              onChange={(event) => setRagaSlug(event.target.value)}
              className="mt-2 h-10 w-full rounded-lg border border-line bg-transparent px-3 text-sm text-bone outline-none focus:border-marigold"
            >
              {RAGAS.map((entry) => (
                <option key={entry.slug} value={entry.slug} className="bg-panel">
                  {entry.name} · {entry.devanagari}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="eyebrow">{t("practice.taal")}</span>
            <select
              value={taalId}
              onChange={(event) => setTaalId(event.target.value as TaalId)}
              className="mt-2 h-10 w-full rounded-lg border border-line bg-transparent px-3 text-sm text-bone outline-none focus:border-marigold"
            >
              {TAALS.map((entry) => (
                <option key={entry.id} value={entry.id} className="bg-panel">
                  {entry.name} · {entry.matras}
                </option>
              ))}
            </select>
          </label>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="eyebrow">{t("practice.tempo")}</span>
              <span className="numeric text-sm text-bone">{bpm} bpm</span>
            </div>
            <input
              type="range"
              min={40}
              max={160}
              step={1}
              value={bpm}
              onChange={(event) => setBpm(Number(event.target.value))}
              className="mt-4 h-1 w-full cursor-pointer appearance-none rounded-full bg-line accent-[var(--marigold)]"
              aria-label={t("practice.tempo")}
            />
            <div className="mt-1 flex justify-between text-[0.6rem] text-bone-dim/80">
              <span>40</span>
              <span>160</span>
            </div>
          </div>

          <div className="flex items-end">
            <Button
              variant={running ? "outline" : "primary"}
              onClick={() => setRunning((value) => !value)}
              className="w-full lg:w-auto"
              aria-pressed={running}
            >
              {running ? <StopIcon width={15} height={15} /> : <PlayIcon width={15} height={15} />}
              {running ? t("practice.stop") : t("practice.start")}
            </Button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge tone={samNow ? "marigold" : "muted"} className="numeric">
              {samNow
                ? t("practice.sam")
                : current >= 0
                  ? `${current + 1} / ${taal.matras}`
                  : `0 / ${taal.matras}`}
            </Badge>
            <span className="text-[0.72rem] text-bone-dim">
              {taal.name} · {taal.vibhags.length} vibhags
            </span>
          </div>
          <span className="hidden text-[0.68rem] text-bone-dim/80 sm:block">
            {taal.description}
          </span>
        </div>

        <div
          className="mt-4 grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${taal.matras}, minmax(0, 1fr))` }}
          aria-live="off"
        >
          {Array.from({ length: taal.matras }, (_, index) => {
            const active = index === current;
            const sam = isSam(taal, index);
            const khali = isKhali(taal, index);
            const vibhag = taal.vibhags.includes(index);
            return (
              <div
                key={index}
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-md border px-0.5 py-2 transition-colors duration-150",
                  active
                    ? "border-marigold bg-marigold text-ink"
                    : sam
                      ? "border-marigold/40 bg-marigold/5 text-bone"
                      : khali
                        ? "border-dashed border-line text-bone-dim"
                        : "border-line text-bone-dim",
                  vibhag && index !== 0 ? "ml-1" : "",
                )}
              >
                <span className={cn("text-[0.58rem]", active ? "text-ink/60" : "text-bone-dim/80")}>
                  {index + 1}
                </span>
                <span className="hidden text-[0.64rem] font-medium sm:block">
                  {bolAt(taal, index)}
                </span>
                {sam ? (
                  <span
                    className={cn(
                      "absolute -top-1 size-1.5 rounded-full",
                      active ? "bg-ink" : "bg-marigold",
                    )}
                  />
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-[0.65rem] text-bone-dim">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-marigold" /> {t("practice.sam")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full border border-dashed border-bone-dim" />{" "}
            {t("practice.khali")}
          </span>
        </div>
      </Card>

      <Card className="p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">{t("practice.drone")}</p>
            <p className="mt-1 text-sm text-bone-dim">
              {droneOn ? "Tanpura running" : "Silent until you start it"} · Sa{" "}
              {SA_CHOICES.find((choice) => Math.abs(choice.hz - saHz) < 0.5)?.label ?? "custom"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-[0.7rem] text-bone-dim">
              Sa
              <select
                value={saHz}
                onChange={(event) => setSa(Number(event.target.value))}
                className="h-8 rounded-md border border-line bg-transparent px-2 text-xs text-bone outline-none focus:border-marigold"
              >
                {SA_CHOICES.map((choice) => (
                  <option key={choice.label} value={choice.hz} className="bg-panel">
                    {choice.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-[0.7rem] text-bone-dim">
              <span className="sr-only">{t("practice.volume")}</span>
              <input
                type="range"
                min={0.05}
                max={1}
                step={0.01}
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-line accent-[var(--marigold)]"
                aria-label={t("practice.volume")}
              />
            </label>
            <Button variant="outline" size="sm" onClick={toggleDrone} aria-pressed={droneOn}>
              {droneOn ? <StopIcon width={13} height={13} /> : <PlayIcon width={13} height={13} />}
              {droneOn ? t("practice.stop") : t("practice.drone")}
            </Button>
          </div>
        </div>

        <div className="mt-6 border-t border-line pt-6">
          <p className="text-[0.7rem] text-bone-dim">{t("practice.note")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {notes.map((note) => (
              <button
                key={note}
                type="button"
                onClick={() => {
                  playNote(note);
                  setLastNote(note);
                }}
                className={cn(
                  "deva flex min-w-11 items-center justify-center rounded-lg border px-3 py-2 text-lg transition-colors",
                  lastNote === note
                    ? "border-marigold bg-marigold/15 text-marigold"
                    : "border-line text-bone hover:border-marigold/50",
                )}
                aria-label={`Play ${note} over the drone`}
              >
                {note.replace("^", "").replace(/['|,]/g, "")}
                {note.includes("^") ? <span className="self-start text-[0.55rem]">^</span> : null}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
