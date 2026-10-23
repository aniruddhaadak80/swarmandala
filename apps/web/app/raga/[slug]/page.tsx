import { getRaga, ragaSlugs } from "@repo/seed";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RagaView } from "@/components/views/raga-view";

export function generateStaticParams() {
  return ragaSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const raga = getRaga(slug);
  if (!raga) return { title: "Raga not found" };

  return {
    title: raga.name,
    description: `${raga.name} (${raga.devanagari}) — ${raga.mood} Prahar ${raga.prahar}, ${raga.thaat} thaat.`,
    alternates: { canonical: `/raga/${raga.slug}` },
    openGraph: {
      title: `${raga.name} · Swarmandala`,
      description: raga.mood,
      url: `/raga/${raga.slug}`,
    },
  };
}

export default async function RagaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getRaga(slug)) notFound();
  return <RagaView slug={slug} />;
}

export const dynamicParams = false;

export const revalidate = false;
