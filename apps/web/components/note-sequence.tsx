"use client";

import { isKomal, isTivra, SWARA_LABELS, type Swara } from "@repo/core";
import { cn } from "@repo/ui";

function NoteToken({
  note,
  onPlay,
  size = "md",
}: {
  note: string;
  onPlay?: ((note: string) => void) | undefined;
  size?: "sm" | "md";
}) {
  const bare = note.replace(/['|,]/g, "");
  const octave = note.includes("'") ? "up" : note.includes(",") ? "down" : null;
  const label = note.replace("^", "").replace(/['|,]/g, "");
  const komal = isKomal(bare as Swara);
  const tivra = isTivra(bare as Swara);
  const title = `${SWARA_LABELS[bare as Swara] ?? bare}${octave === "up" ? " (upper octave)" : ""}`;

  const content = (
    <span className="inline-flex items-start gap-0.5">
      <span className={cn("deva", tivra ? "text-marigold" : komal ? "text-bone-dim" : "text-bone")}>
        {label}
      </span>
      {tivra ? <span className="text-[0.55em] text-marigold">^</span> : null}
      {octave === "up" ? <span className="text-[0.55em] text-marigold">’</span> : null}
      {octave === "down" ? <span className="text-[0.55em] text-bone-dim">,</span> : null}
    </span>
  );

  const shared = cn(
    "rounded-md border border-line bg-bone/[0.03] transition-colors",
    size === "sm" ? "px-1.5 py-0.5 text-sm" : "px-2 py-1 text-base",
    onPlay ? "hover:border-marigold/60 hover:bg-marigold/10" : "",
  );

  if (!onPlay) {
    return (
      <span className={shared} title={title}>
        {content}
      </span>
    );
  }

  return (
    <button type="button" onClick={() => onPlay(note)} className={shared} title={`Play ${title}`}>
      {content}
    </button>
  );
}

export function NoteSequence({
  notes,
  onPlay,
  size = "md",
  className,
  label,
}: {
  notes: readonly string[];
  onPlay?: (note: string) => void;
  size?: "sm" | "md";
  className?: string;
  label?: string;
}) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: a fieldset is for form controls, not a row of playback buttons
    <div
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      aria-label={label}
      role="group"
    >
      {notes.map((note, index) => (
        <NoteToken key={`${note}-${index}`} note={note} onPlay={onPlay} size={size} />
      ))}
    </div>
  );
}

export function SwaraChip({ swara }: { swara: Swara }) {
  return (
    <span
      className={cn(
        "inline-flex size-6 items-center justify-center rounded-full border text-[0.68rem]",
        isKomal(swara)
          ? "border-line text-bone-dim"
          : isTivra(swara)
            ? "border-marigold/50 text-marigold"
            : "border-line-strong text-bone",
      )}
      title={SWARA_LABELS[swara]}
    >
      {swara.replace("^", "")}
    </span>
  );
}
