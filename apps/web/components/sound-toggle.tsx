"use client";

import { cn } from "@repo/ui";
import type { ReactNode } from "react";
import { VolumeIcon, VolumeOffIcon } from "@/components/icons";
import { useAudio } from "@/lib/audio/provider";

export function SoundToggle({
  children,
  compact = false,
  className,
}: {
  children?: ReactNode;
  compact?: boolean;
  className?: string;
}) {
  const { muted, toggleMuted, droneOn } = useAudio();

  return (
    <button
      type="button"
      onClick={toggleMuted}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[0.72rem] text-bone-dim transition-colors hover:border-line-strong hover:text-bone",
        droneOn && !muted ? "border-marigold/50 text-marigold" : "",
        className,
      )}
      aria-pressed={!muted}
      aria-label={muted ? "Sound off — turn on" : "Sound on — mute"}
      title={muted ? "Turn sound on" : "Mute"}
    >
      {muted ? (
        <VolumeOffIcon width={15} height={15} />
      ) : (
        <VolumeIcon width={15} height={15} className={droneOn ? "text-marigold" : ""} />
      )}
      {compact ? <span className="hidden xl:inline">{children}</span> : <span>{children}</span>}
      {droneOn && !muted ? (
        <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
          {[0, 1, 2].map((bar) => (
            <span
              key={bar}
              className="eq-bar w-[2px] rounded-sm bg-marigold"
              style={{ height: "100%", animationDelay: `${bar * 140}ms` }}
            />
          ))}
        </span>
      ) : null}
    </button>
  );
}
