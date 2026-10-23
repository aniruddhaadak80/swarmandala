"use client";

import { RAGA_COUNT } from "@repo/seed";
import Link from "next/link";
import { MandalaMark, Wordmark } from "@/components/brand";
import { useI18n } from "@/lib/i18n/provider";

export function SiteFooter() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[1] mt-28 border-t border-line">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <MandalaMark className="size-7 text-bone" />
              <Wordmark />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-bone-dim">
              {t("footer.built")}
            </p>
            <p className="deva mt-5 text-lg text-bone-dim/80">स्वरमंडल</p>
          </div>

          <div>
            <p className="eyebrow">{t("nav.atlas")}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { href: "/atlas", label: t("nav.atlas") },
                { href: "/clock", label: t("nav.clock") },
                { href: "/compare", label: t("nav.compare") },
                { href: "/practice", label: t("nav.practice") },
                { href: "/about", label: t("nav.about") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-bone-dim transition-colors hover:text-marigold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">{t("footer.data")}</p>
            <p className="mt-4 text-sm leading-relaxed text-bone-dim">
              {RAGA_COUNT} ragas · 8 prahars · 4 taals
              <br />
              {t("hero.footnote")}
            </p>
            <a
              href="https://github.com/aniruddhaadak80/swarmandala"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex text-sm text-marigold underline decoration-marigold/30 underline-offset-4 hover:decoration-marigold"
            >
              {t("footer.source")}
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-[0.7rem] text-bone-dim/80 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Swarmandala · {t("footer.license")}
          </p>
          <p className="deva">राग · प्रहर · ताल</p>
        </div>
      </div>
    </footer>
  );
}
