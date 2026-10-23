"use client";

import { buttonClass } from "@repo/ui";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n/provider";

export function NotFoundView() {
  const { t } = useI18n();

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="deva text-[clamp(4rem,12vw,8rem)] leading-none text-marigold/30">४०४</p>
      <h1 className="mt-2 font-display text-3xl">This note is not in the scale.</h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-bone-dim">
        {t("raga.notFound")} Try the atlas, or start from the hour you are in.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/atlas" className={buttonClass({ size: "md" })}>
          {t("raga.back")}
          <ArrowRightIcon width={15} height={15} />
        </Link>
        <Link href="/clock" className={buttonClass({ variant: "outline", size: "md" })}>
          {t("nav.clock")}
        </Link>
      </div>
    </div>
  );
}
