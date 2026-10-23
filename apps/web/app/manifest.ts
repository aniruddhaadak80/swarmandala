import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Swarmandala — the day has a scale",
    short_name: "Swarmandala",
    description:
      "A living atlas of Hindustani raga: 24 ragas, eight prahars, a procedural tanpura, and a swara mandala you can play.",
    start_url: "/",
    display: "standalone",
    background_color: "#0e0c0a",
    theme_color: "#0e0c0a",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
