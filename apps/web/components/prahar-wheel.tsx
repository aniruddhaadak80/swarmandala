"use client";

import { clockAngle, formatClock, PRAHARS, praharByNumber, praharForMinutes } from "@repo/core";
import { cn } from "@repo/ui";
import { type PointerEvent, useRef, useState } from "react";

const CENTER = 200;
const OUTER = 150;
const INNER = 108;

function polar(radius: number, degrees: number): { x: number; y: number } {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(radians), y: CENTER + radius * Math.sin(radians) };
}

function sectorPath(startDeg: number, endDeg: number): string {
  const outerStart = polar(OUTER, endDeg);
  const outerEnd = polar(OUTER, startDeg);
  const innerStart = polar(INNER, startDeg);
  const innerEnd = polar(INNER, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${OUTER} ${OUTER} 0 ${large} 0 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${INNER} ${INNER} 0 ${large} 1 ${innerEnd.x} ${innerEnd.y}`,
    "Z",
  ].join(" ");
}

function minutesFromPointer(event: PointerEvent<SVGSVGElement>): number {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 400;
  const y = ((event.clientY - rect.top) / rect.height) * 400;
  const degrees = (Math.atan2(y - CENTER, x - CENTER) * 180) / Math.PI + 90;
  const normalized = (degrees + 360) % 360;
  return Math.round((normalized / 360) * 1440) % 1440;
}

export interface PraharWheelProps {
  minutes: number;
  onChange: (minutes: number) => void;
  nowMinutes: number;
  className?: string;
}

export function PraharWheel({ minutes, onChange, nowMinutes, className }: PraharWheelProps) {
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const prahar = praharForMinutes(minutes);
  const current = praharByNumber(prahar);
  const handAngle = clockAngle(minutes);
  const nowAngle = clockAngle(nowMinutes);

  return (
    <div
      className={cn("relative mx-auto w-full max-w-[440px]", className)}
      role="slider"
      tabIndex={0}
      aria-label="Time of day on the prahar wheel"
      aria-valuemin={0}
      aria-valuemax={1439}
      aria-valuenow={minutes}
      aria-valuetext={`${formatClock(minutes)}, ${current.name} watch, ${current.english}`}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowUp") {
          event.preventDefault();
          onChange((minutes + (event.shiftKey ? 60 : 15)) % 1440);
        } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
          event.preventDefault();
          onChange((minutes - (event.shiftKey ? 60 : 15) + 1440) % 1440);
        } else if (event.key === "Home") {
          event.preventDefault();
          onChange(nowMinutes);
        }
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        className="w-full touch-none select-none"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
          onChange(minutesFromPointer(event));
        }}
        onPointerMove={(event) => {
          if (dragging) onChange(minutesFromPointer(event));
        }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        <title>Prahar wheel</title>
        <circle cx={CENTER} cy={CENTER} r="188" fill="var(--glow)" opacity="0.4" />

        {PRAHARS.map((entry) => {
          const start = (entry.startHour / 24) * 360;
          const end = start + 45;
          const mid = start + 22.5;
          const labelPoint = polar(128, mid);
          const active = entry.number === prahar;
          return (
            <g key={entry.number}>
              <path
                d={sectorPath(start + 0.7, end - 0.7)}
                fill={active ? "var(--marigold)" : "var(--bone)"}
                fillOpacity={active ? 0.14 : 0.035}
                stroke="var(--line)"
                strokeWidth="0.6"
                className="transition-all duration-200"
              />
              <text
                x={labelPoint.x}
                y={labelPoint.y - 2}
                textAnchor="middle"
                fontSize="8"
                letterSpacing="0.16em"
                fill={active ? "var(--marigold)" : "var(--bone-dim)"}
                opacity={active ? 1 : 0.62}
                style={{ fontFamily: "var(--font-instrument)" }}
              >
                {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"][entry.number - 1]}
              </text>
              <text
                x={labelPoint.x}
                y={labelPoint.y + 10}
                textAnchor="middle"
                fontSize="7"
                fill="var(--bone-dim)"
                opacity="0.55"
                style={{ fontFamily: "var(--font-instrument)" }}
              >
                {entry.name}
              </text>
            </g>
          );
        })}

        {Array.from({ length: 24 }, (_, hour) => {
          const outer = polar(OUTER + 3, (hour / 24) * 360);
          const inner = polar(hour % 3 === 0 ? OUTER + 9 : OUTER + 6, (hour / 24) * 360);
          return (
            <line
              key={hour}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="var(--bone-dim)"
              strokeOpacity="0.35"
              strokeWidth="0.8"
            />
          );
        })}

        <line
          x1={CENTER}
          y1={CENTER}
          x2={polar(OUTER - 8, handAngle).x}
          y2={polar(OUTER - 8, handAngle).y}
          stroke="var(--marigold)"
          strokeWidth="1.4"
        />
        <circle
          cx={polar(OUTER - 8, handAngle).x}
          cy={polar(OUTER - 8, handAngle).y}
          r="5.5"
          fill="var(--marigold)"
          stroke="var(--ink)"
          strokeWidth="2"
        />

        <circle
          cx={polar(OUTER + 6, nowAngle).x}
          cy={polar(OUTER + 6, nowAngle).y}
          r="2.4"
          fill="var(--vermillion)"
        />

        <circle cx={CENTER} cy={CENTER} r="86" fill="var(--ink)" fillOpacity="0.55" />
        <text
          x={CENTER}
          y={CENTER - 18}
          textAnchor="middle"
          fontSize="9"
          letterSpacing="0.28em"
          fill="var(--bone-dim)"
          style={{ fontFamily: "var(--font-instrument)" }}
        >
          {current.english.toUpperCase()}
        </text>
        <text
          x={CENTER}
          y={CENTER + 18}
          textAnchor="middle"
          fontSize="40"
          fill="var(--bone)"
          className="numeric"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          {formatClock(minutes)}
        </text>
        <text
          x={CENTER}
          y={CENTER + 44}
          textAnchor="middle"
          fontSize="12"
          fill="var(--bone-dim)"
          style={{ fontFamily: "var(--font-tiro)" }}
        >
          {current.devanagari}
        </text>
      </svg>

      <p className="mt-2 text-center text-[0.68rem] text-bone-dim/80">
        {dragging ? "Release to settle" : "Drag the hand · ← → to nudge"}
      </p>
    </div>
  );
}
