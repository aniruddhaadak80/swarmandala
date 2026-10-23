import { getRaga } from "@repo/seed";
import { PracticeView } from "@/components/views/practice-view";

export const metadata = {
  title: "Practice room",
  description:
    "A procedural tanpura, four taals, and a tempo control. Set your Sa and practise against the theka.",
  alternates: { canonical: "/practice" },
};

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ raga?: string }>;
}) {
  const { raga } = await searchParams;
  const initial = raga && getRaga(raga) ? raga : undefined;
  return <PracticeView initialRaga={initial} />;
}
