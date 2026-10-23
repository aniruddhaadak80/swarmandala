import { AboutView } from "@/components/views/about-view";

export const metadata = {
  title: "About",
  description:
    "What a raga is, what a prahar is, how to read the notation, and where the boundaries of this atlas lie.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutView />;
}
