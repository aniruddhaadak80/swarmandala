"use client";

import { cn, Kbd } from "@repo/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/brand";
import { CloseIcon, MenuIcon, MoonIcon, SearchIcon, SunIcon } from "@/components/icons";
import { useAudio } from "@/lib/audio/provider";
import { LOCALES, useI18n } from "@/lib/i18n/provider";
import { useTheme } from "@/lib/theme/provider";
import { SoundToggle } from "./sound-toggle";

const NAV = [
  { href: "/atlas", key: "nav.atlas" },
  { href: "/clock", key: "nav.clock" },
  { href: "/compare", key: "nav.compare" },
  { href: "/practice", key: "nav.practice" },
  { href: "/about", key: "nav.about" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { t, locale, setLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { muted } = useAudio();
  const [open, setOpen] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: close the mobile menu after navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const openPalette = () => {
    window.dispatchEvent(new CustomEvent("swarmandala:palette"));
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2.5" aria-label={t("brand.name")}>
          <span className="text-bone transition-colors group-hover:text-marigold">
            <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
              <circle
                cx="16"
                cy="16"
                r="13"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.3"
              />
              {Array.from({ length: 12 }, (_, index) => {
                const angle = ((index * 30 - 90) * Math.PI) / 180;
                const primary = index === 0;
                return (
                  <circle
                    key={index}
                    cx={16 + Math.cos(angle) * 11}
                    cy={16 + Math.sin(angle) * 11}
                    r={primary ? 2.3 : 1}
                    fill={primary ? "var(--marigold)" : "currentColor"}
                    opacity={primary ? 1 : 0.45}
                  />
                );
              })}
              <circle cx="16" cy="16" r="1.4" fill="var(--marigold)" />
            </svg>
          </span>
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-1 text-[0.82rem] tracking-[0.01em] transition-colors",
                  active ? "text-bone" : "text-bone-dim hover:text-bone",
                )}
              >
                {t(item.key)}
                {active ? (
                  <span className="absolute -bottom-1 left-0 size-1 rounded-full bg-marigold" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={openPalette}
            className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[0.72rem] text-bone-dim transition-colors hover:border-line-strong hover:text-bone lg:flex"
          >
            <SearchIcon width={14} height={14} />
            <span>Find a raga</span>
            <Kbd>Ctrl K</Kbd>
          </button>

          <SoundToggle compact>{muted ? "Sound off" : "Sound on"}</SoundToggle>

          <label className="sr-only" htmlFor="locale-select">
            {t("common.language")}
          </label>
          <div className="relative hidden sm:block">
            <select
              id="locale-select"
              value={locale}
              onChange={(event) => setLocale(event.target.value as typeof locale)}
              className="h-8 cursor-pointer appearance-none rounded-full border border-line bg-transparent py-0 pl-3 pr-6 text-[0.72rem] text-bone-dim transition-colors hover:border-line-strong hover:text-bone"
            >
              {LOCALES.map((item) => (
                <option key={item.id} value={item.id} className="bg-panel text-bone">
                  {item.native}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-bone-dim">
              <svg width="9" height="9" viewBox="0 0 12 12" aria-hidden="true">
                <path d="m2 4 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </span>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex size-8 items-center justify-center rounded-full border border-line text-bone-dim transition-colors hover:border-line-strong hover:text-bone"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={t("common.theme")}
          >
            {theme === "dark" ? (
              <SunIcon width={15} height={15} />
            ) : (
              <MoonIcon width={15} height={15} />
            )}
          </button>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex size-8 items-center justify-center rounded-full border border-line text-bone-dim md:hidden"
            aria-label={open ? t("common.close") : t("common.menu")}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <CloseIcon width={16} height={16} /> : <MenuIcon width={16} height={16} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-line bg-ink px-5 py-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between border-b border-line/60 py-3 text-sm text-bone"
                >
                  {t(item.key)}
                  <span className="text-marigold">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-3">
            {LOCALES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLocale(item.id)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  locale === item.id
                    ? "border-marigold text-marigold"
                    : "border-line text-bone-dim",
                )}
              >
                {item.native}
              </button>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
