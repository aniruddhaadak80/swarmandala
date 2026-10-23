"use client";

import { type Raga, SWARA_SEMITONES, SWARAS, type Swara, uniqueNotes } from "@repo/core";
import { cn } from "@repo/ui";

const CENTER = 200;
const NODE_RADIUS = 136;
const LABEL_RADIUS = 163;

const SHORT_LABELS: Record<Swara, string> = {
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

function angleFor(swara: Swara): number {
  return SWARA_SEMITONES[swara] * 30 - 90;
}

function polar(radius: number, degrees: number): { x: number; y: number } {
  const radians = (degrees * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER + radius * Math.sin(radians),
  };
}

export interface MandalaProps {
  raga: Raga;
  onNote?: (note: Swara) => void;
  activeNote?: Swara | null;
  showLabels?: boolean;
  showCenter?: boolean;
  className?: string;
}

/**
 * A twelve-position swara circle with the raga's ascent drawn across it.
 * Sa sits at the top; the rest of the chromatic alphabet runs clockwise.
 */
export function Mandala({
  raga,
  onNote,
  activeNote = null,
  showLabels = true,
  showCenter = true,
  className,
}: MandalaProps) {
  const present = new Set<Swara>(uniqueNotes(raga));
  const aroha = raga.aroha
    .map((note) => note.replace(/['|,]/g, ""))
    .filter((note): note is Swara => (SWARAS as readonly string[]).includes(note));

  const arcs = aroha.slice(0, -1).map((note, index) => {
    const next = aroha[index + 1];
    if (!next) return null;
    const start = polar(NODE_RADIUS, angleFor(note));
    const end = polar(NODE_RADIUS, angleFor(next));
    const controlX = CENTER + (start.x + end.x - 2 * CENTER) * 0.28;
    const controlY = CENTER + (start.y + end.y - 2 * CENTER) * 0.28;
    return {
      key: `${note}-${next}-${index}`,
      d: `M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`,
    };
  });

  return (
    // biome-ignore lint/a11y/useSemanticElements: an SVG cannot contain a fieldset; the group labels an interactive graphic
    <svg
      viewBox="0 0 400 400"
      className={cn("h-auto w-full select-none", className)}
      role="group"
      aria-label={`${raga.name} scale on the swara mandala`}
    >
      <defs>
        <radialGradient id="mandala-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--marigold)" stopOpacity="0.14" />
          <stop offset="55%" stopColor="var(--marigold)" stopOpacity="0.03" />
          <stop offset="100%" stopColor="var(--marigold)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={CENTER} cy={CENTER} r="186" fill="url(#mandala-glow)" />
      <circle cx={CENTER} cy={CENTER} r="176" fill="none" stroke="var(--line)" strokeWidth="0.75" />
      <circle
        cx={CENTER}
        cy={CENTER}
        r={NODE_RADIUS}
        fill="none"
        stroke="var(--line)"
        strokeWidth="0.75"
      />

      {/* biome-ignore lint/a11y/noAriaHiddenOnFocusable: decorative tick marks, none of the children are focusable */}
      <g
        className="animate-mandala"
        style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
        aria-hidden="true"
      >
        {Array.from({ length: 60 }, (_, index) => {
          const major = index % 5 === 0;
          const inner = polar(major ? 168 : 171, index * 6);
          const outer = polar(176, index * 6);
          return (
            <line
              key={index}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="var(--bone-dim)"
              strokeOpacity={major ? 0.32 : 0.14}
              strokeWidth="0.8"
            />
          );
        })}
      </g>

      {arcs.map((arc) =>
        arc ? (
          <path
            key={arc.key}
            d={arc.d}
            fill="none"
            stroke="var(--marigold)"
            strokeOpacity="0.34"
            strokeWidth="1.1"
          />
        ) : null,
      )}

      {SWARAS.map((swara) => {
        const inRaga = present.has(swara);
        const point = polar(NODE_RADIUS, angleFor(swara));
        const label = polar(LABEL_RADIUS, angleFor(swara));
        const isVadi = raga.vadi === swara;
        const isSamvadi = raga.samvadi === swara;
        const isActive = activeNote === swara;
        const radius = swara === "S" ? 7 : inRaga ? 5.6 : 2.6;
        const interactive = Boolean(onNote);

        return (
          // biome-ignore lint/a11y/noStaticElementInteractions: SVG groups with role="button" are the standard interactive swara pattern
          <g
            key={swara}
            role={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-label={
              interactive
                ? `Play ${SHORT_LABELS[swara]}${inRaga ? `, in ${raga.name}` : ""}`
                : undefined
            }
            onClick={interactive ? () => onNote?.(swara) : undefined}
            onKeyDown={
              interactive
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onNote?.(swara);
                    }
                  }
                : undefined
            }
            className={interactive ? "cursor-pointer" : undefined}
          >
            <circle cx={point.x} cy={point.y} r="16" fill="transparent" />
            {(isVadi || isSamvadi) && inRaga ? (
              <circle
                cx={point.x}
                cy={point.y}
                r={radius + 5}
                fill="none"
                stroke={isVadi ? "var(--vermillion)" : "var(--teal)"}
                strokeOpacity="0.8"
                strokeWidth="1.1"
              />
            ) : null}
            <circle
              cx={point.x}
              cy={point.y}
              r={isActive ? radius + 2.5 : radius}
              fill={
                isActive
                  ? "var(--bone)"
                  : inRaga
                    ? swara === "S"
                      ? "var(--marigold)"
                      : "var(--bone)"
                    : "var(--ink)"
              }
              stroke={inRaga ? "var(--marigold)" : "var(--line-strong)"}
              strokeWidth={inRaga ? 1.4 : 0.9}
              className="transition-all duration-200"
            />
            {showLabels ? (
              <text
                x={label.x}
                y={label.y + 3}
                textAnchor="middle"
                fontSize="9"
                letterSpacing="0.06em"
                fill={inRaga ? "var(--bone)" : "var(--bone-dim)"}
                opacity={inRaga ? 0.9 : 0.45}
                style={{ fontFamily: "var(--font-instrument)" }}
              >
                {SHORT_LABELS[swara]}
              </text>
            ) : null}
          </g>
        );
      })}

      {showCenter ? (
        <g pointerEvents="none">
          <text
            x={CENTER}
            y={CENTER - 14}
            textAnchor="middle"
            fontSize="8"
            letterSpacing="0.3em"
            fill="var(--bone-dim)"
            style={{ fontFamily: "var(--font-instrument)" }}
          >
            RAGA
          </text>
          <text
            x={CENTER}
            y={CENTER + 14}
            textAnchor="middle"
            fontSize="23"
            fill="var(--bone)"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {raga.name}
          </text>
          <text
            x={CENTER}
            y={CENTER + 38}
            textAnchor="middle"
            fontSize="15"
            fill="var(--bone-dim)"
            style={{ fontFamily: "var(--font-tiro)" }}
          >
            {raga.devanagari}
          </text>
        </g>
      ) : null}
    </svg>
  );
}
