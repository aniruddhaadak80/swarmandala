import { cn } from "@repo/ui";

/** The twelve-position swara ring, in miniature. */
export function MandalaMark({ className }: { className?: string }) {
  const nodes = Array.from({ length: 12 }, (_, index) => {
    const angle = (index * 30 - 90) * (Math.PI / 180);
    return {
      x: 16 + Math.cos(angle) * 12,
      y: 16 + Math.sin(angle) * 12,
      primary: index === 0,
      accent: index === 4 || index === 7,
    };
  });

  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8", className)}
      role="img"
      aria-label="Swarmandala mark"
    >
      <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeOpacity="0.28" />
      <circle cx="16" cy="16" r="9.5" fill="none" stroke="currentColor" strokeOpacity="0.14" />
      {nodes.map((node, index) => (
        <circle
          key={index}
          cx={node.x}
          cy={node.y}
          r={node.primary ? 2.4 : 1.15}
          fill={node.primary ? "var(--marigold)" : node.accent ? "var(--bone)" : "var(--bone-dim)"}
          opacity={node.primary || node.accent ? 1 : 0.55}
        />
      ))}
      <circle cx="16" cy="16" r="1.5" fill="var(--marigold)" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-[1.35rem] leading-none tracking-[-0.03em] text-bone",
        className,
      )}
    >
      swarmandala
      <span className="text-marigold">.</span>
    </span>
  );
}
