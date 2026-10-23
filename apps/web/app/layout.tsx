import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const fraunces = localFont({
  src: "../public/fonts/fraunces-latin.woff2",
  variable: "--font-fraunces",
  display: "swap",
  weight: "300 700",
});

const instrument = localFont({
  src: "../public/fonts/instrument-sans-latin.woff2",
  variable: "--font-instrument",
  display: "swap",
  weight: "400 700",
});

const tiro = localFont({
  src: "../public/fonts/tiro-devanagari.woff2",
  variable: "--font-tiro",
  display: "swap",
  weight: "400",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Swarmandala — the day has a scale",
    template: "%s · Swarmandala",
  },
  description:
    "A living atlas of Hindustani raga: 24 ragas, eight prahars, a procedural tanpura, and a swara mandala you can play. No samples, no keys.",
  applicationName: "Swarmandala",
  authors: [{ name: "Aniruddha Adak", url: "https://github.com/aniruddhaadak80" }],
  creator: "Aniruddha Adak",
  keywords: [
    "raga",
    "hindustani music",
    "indian classical music",
    "prahar",
    "tanpura",
    "swara",
    "music theory",
    "web audio",
    "next.js",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Swarmandala",
    title: "Swarmandala — the day has a scale",
    description:
      "24 ragas, eight watches, a procedural tanpura. Find out what 6pm is supposed to sound like.",
    images: [{ url: "/og", width: 1200, height: 630, alt: "Swarmandala" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Swarmandala — the day has a scale",
    description:
      "24 ragas, eight watches, a procedural tanpura. Find out what 6pm is supposed to sound like.",
    images: ["/og"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0e0c0a" },
    { media: "(prefers-color-scheme: light)", color: "#f6eee0" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

const themeScript = `
(function () {
  try {
    var theme = localStorage.getItem("swarmandala.theme");
    if (theme === "light") document.documentElement.dataset.theme = "light";
    var locale = localStorage.getItem("swarmandala.locale");
    if (locale) document.documentElement.lang = locale;
  } catch (error) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static theme bootstrap, no user input */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${fraunces.variable} ${instrument.variable} ${tiro.variable} antialiased`}>
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-marigold focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
        >
          Skip to content
        </a>
        <Providers>
          <SiteHeader />
          <main id="content" className="relative z-[1]">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
