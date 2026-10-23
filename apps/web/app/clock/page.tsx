import { ClockView } from "@/components/views/clock-view";

export const metadata = {
  title: "Prahar clock",
  description:
    "Eight three-hour watches, beginning at 4am. Drag the hand and the atlas re-tunes to the hour.",
  alternates: { canonical: "/clock" },
};

function parseAt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return undefined;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return undefined;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return undefined;
  return hour * 60 + minute;
}

export default async function ClockPage({
  searchParams,
}: {
  searchParams: Promise<{ at?: string }>;
}) {
  const { at } = await searchParams;
  return <ClockView initialMinutes={parseAt(at)} />;
}
