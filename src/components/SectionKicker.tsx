export function SectionKicker({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
      <span className="tabular-nums">{number}</span>
      <span className="h-px w-10 bg-current opacity-40" aria-hidden />
      <span>{label}</span>
    </div>
  );
}
