import { AtlasView } from "@/components/views/atlas-view";

export const metadata = {
  title: "The atlas",
  description:
    "Twenty-four Hindustani ragas, sorted by prahar, thaat, and mood. Search the atlas, listen to a scale, follow the hour.",
  alternates: { canonical: "/atlas" },
};

export default function AtlasPage() {
  return <AtlasView />;
}
