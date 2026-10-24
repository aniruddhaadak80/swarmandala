"use client";

import { buttonClass } from "@repo/ui";
import Link from "next/link";
import { useEffect } from "react";
import { ArrowRightIcon } from "@/components/icons";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="deva text-[clamp(4rem,12vw,8rem)] leading-none text-marigold/30">स्वर</p>
      <h1 className="mt-2 font-display text-3xl">Something went out of tune.</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-bone-dim">
        The atlas hit an unexpected note. You can try again, or start over from the home page.
      </p>
      {error.digest ? (
        <p className="mt-2 text-[0.65rem] text-bone-dim/60">digest: {error.digest}</p>
      ) : null}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={reset} className={buttonClass({ size: "md" })}>
          Try again
        </button>
        <Link href="/" className={buttonClass({ variant: "outline", size: "md" })}>
          Home
          <ArrowRightIcon width={15} height={15} />
        </Link>
      </div>
    </div>
  );
}
