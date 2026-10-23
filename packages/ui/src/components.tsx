import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

type ButtonVariant = "primary" | "outline" | "ghost" | "quiet";
type ButtonSize = "sm" | "md" | "lg";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-marigold text-ink hover:bg-[color-mix(in_oklab,var(--marigold)_88%,white)] border border-transparent",
  outline: "border border-line-strong text-bone hover:bg-bone/5",
  ghost: "border border-transparent text-bone-dim hover:text-bone hover:bg-bone/5",
  quiet: "border border-transparent text-bone-dim hover:text-marigold",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[0.78rem] gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-[0.95rem] gap-2.5",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function buttonClass({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string | undefined;
} = {}): string {
  return cn(
    "inline-flex items-center justify-center rounded-full font-medium tracking-[0.01em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40",
    buttonVariants[variant],
    buttonSizes[size],
    className,
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return <button type={type} className={buttonClass({ variant, size, className })} {...props} />;
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("surface rounded-2xl", className)} {...props} />;
}

type BadgeTone = "marigold" | "teal" | "vermillion" | "muted";

const badgeTones: Record<BadgeTone, string> = {
  marigold: "border-marigold/40 text-marigold bg-marigold/8",
  teal: "border-teal/50 text-teal bg-teal/10",
  vermillion: "border-vermillion/40 text-vermillion bg-vermillion/8",
  muted: "border-line text-bone-dim bg-transparent",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ className, tone = "muted", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.16em]",
        badgeTones[tone],
        className,
      )}
      {...props}
    />
  );
}

export function Kbd({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded border border-line bg-bone/5 px-1.5 font-sans text-[0.65rem] text-bone-dim",
        className,
      )}
      {...props}
    />
  );
}

export interface MeterProps {
  value: number;
  label?: string;
  tone?: "marigold" | "teal";
}

export function Meter({ value, label, tone = "marigold" }: MeterProps) {
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div className="w-full">
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-bone/10"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500",
            tone === "marigold" ? "bg-marigold" : "bg-teal",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="numeric text-[0.7rem] text-marigold">{index}</span>
      <span className="eyebrow">{children}</span>
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-line", className)} />;
}

export function IconButton({
  className,
  label,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full border border-line text-bone-dim transition-colors hover:border-line-strong hover:text-bone",
        className,
      )}
      {...props}
    />
  );
}
