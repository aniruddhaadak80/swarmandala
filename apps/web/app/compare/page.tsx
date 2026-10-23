import { CompareView } from "@/components/views/compare-view";

export const metadata = {
  title: "Compare two ragas",
  description:
    "Pick two Hindustani ragas and see which swaras they share. Similarity is the Jaccard overlap of their pitch-class sets.",
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  return <CompareView />;
}
