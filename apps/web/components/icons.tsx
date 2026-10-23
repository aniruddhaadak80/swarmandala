import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": "true",
} satisfies SVGProps<SVGSVGElement>;

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 4.6v14.8L19.4 12 7 4.6Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function StopIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="6" width="12" height="12" rx="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="6.5" y="5" width="3.8" height="14" rx="1" fill="currentColor" stroke="none" />
      <rect x="13.7" y="5" width="3.8" height="14" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function VolumeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9.2v5.6h3.2L12.4 19V5L7.2 9.2H4Z" fill="currentColor" stroke="none" />
      <path d="M16 8.6a5 5 0 0 1 0 6.8M18.7 6a8.6 8.6 0 0 1 0 12" />
    </svg>
  );
}

export function VolumeOffIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9.2v5.6h3.2L12.4 19V5L7.2 9.2H4Z" fill="currentColor" stroke="none" />
      <path d="m16 9.5 5 5M21 9.5l-5 5" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4.1" />
      <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20.2 14.4A8.4 8.4 0 0 1 9.6 3.8 8.5 8.5 0 1 0 20.2 14.4Z" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="6.4" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m5.5 5.5 13 13M18.5 5.5l-13 13" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9.5 6 6 6-6" />
    </svg>
  );
}
