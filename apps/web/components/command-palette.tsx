"use client";

import { RAGAS } from "@repo/seed";
import { cn, Kbd } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n/provider";

interface PaletteItem {
  id: string;
  label: string;
  hint: string;
  href: string;
  kind: "page" | "raga";
}

export function CommandPalette() {
  const router = useRouter();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const pages = useMemo<PaletteItem[]>(
    () => [
      { id: "p-atlas", label: t("nav.atlas"), hint: "/atlas", href: "/atlas", kind: "page" },
      { id: "p-clock", label: t("nav.clock"), hint: "/clock", href: "/clock", kind: "page" },
      {
        id: "p-compare",
        label: t("nav.compare"),
        hint: "/compare",
        href: "/compare",
        kind: "page",
      },
      {
        id: "p-practice",
        label: t("nav.practice"),
        hint: "/practice",
        href: "/practice",
        kind: "page",
      },
      { id: "p-about", label: t("nav.about"), hint: "/about", href: "/about", kind: "page" },
    ],
    [t],
  );

  const all = useMemo<PaletteItem[]>(
    () => [
      ...pages,
      ...RAGAS.map((raga) => ({
        id: `r-${raga.slug}`,
        label: raga.name,
        hint: `${raga.devanagari} · ${raga.thaat}`,
        href: `/raga/${raga.slug}`,
        kind: "raga" as const,
      })),
    ],
    [pages],
  );

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length === 0)
      return [...pages, ...all.filter((item) => item.kind === "raga").slice(0, 6)];
    return all
      .filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(needle))
      .slice(0, 9);
  }, [all, pages, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    restoreRef.current?.focus();
  }, []);

  const openPalette = useCallback(() => {
    restoreRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpen(true);
    setActive(0);
    setQuery("");
  }, []);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open) close();
        else openPalette();
      }
      if (event.key === "Escape" && open) close();
    };
    const onCustom = () => openPalette();
    window.addEventListener("keydown", onKey);
    window.addEventListener("swarmandala:palette", onCustom);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("swarmandala:palette", onCustom);
    };
  }, [close, open, openPalette]);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset the active row whenever the query changes
  useEffect(() => {
    setActive(0);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label={t("common.close")}
        onClick={close}
        className="absolute inset-0 cursor-default bg-ink/80 backdrop-blur-[3px]"
        tabIndex={-1}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="rise-in relative mx-auto mt-[10vh] w-[min(92vw,620px)] overflow-hidden rounded-2xl border border-line-strong bg-panel shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <SearchIcon width={16} height={16} className="text-bone-dim" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive((index) => Math.min(results.length - 1, index + 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((index) => Math.max(0, index - 1));
              } else if (event.key === "Enter") {
                const item = results[active];
                if (item) go(item.href);
              }
            }}
            placeholder={t("atlas.search")}
            className="h-14 w-full bg-transparent text-sm text-bone outline-none placeholder:text-bone-dim/80"
            aria-label={t("atlas.search")}
            aria-controls="palette-results"
            aria-activedescendant={results[active] ? `palette-${results[active].id}` : undefined}
          />
          <Kbd className="hidden sm:inline-flex">Esc</Kbd>
        </div>

        <div id="palette-results" role="listbox" className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-bone-dim">{t("atlas.empty")}</div>
          ) : (
            results.map((item, index) => (
              <div
                key={item.id}
                id={`palette-${item.id}`}
                role="option"
                aria-selected={index === active}
                tabIndex={-1}
                onMouseEnter={() => setActive(index)}
                onClick={() => go(item.href)}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left transition-colors",
                  index === active ? "bg-bone/8 text-bone" : "text-bone-dim hover:bg-bone/5",
                )}
              >
                <span className="flex min-w-0 items-baseline gap-3">
                  <span className="truncate text-sm">{item.label}</span>
                  <span className="truncate text-[0.7rem] text-bone-dim/80">{item.hint}</span>
                </span>
                <span className="shrink-0 text-[0.6rem] uppercase tracking-[0.2em] text-bone-dim/80">
                  {item.kind === "page" ? "page" : "raga"}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line px-4 py-2 text-[0.65rem] text-bone-dim">
          <span>{t("common.keyboard")}</span>
          <span className="flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            <Kbd>↵</Kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
