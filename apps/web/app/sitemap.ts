import { RAGAS } from "@repo/seed";
import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/atlas", "/clock", "/compare", "/practice", "/about"].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const ragaRoutes = RAGAS.map((raga) => ({
    url: `${base}/raga/${raga.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...ragaRoutes];
}
