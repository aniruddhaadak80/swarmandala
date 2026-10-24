export default function Loading() {
  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center py-24">
      <div className="flex items-center gap-3 text-bone-dim">
        <span className="size-2 animate-pulse rounded-full bg-marigold" />
        <span className="text-[0.78rem] uppercase tracking-[0.2em]">Tuning…</span>
      </div>
    </div>
  );
}
