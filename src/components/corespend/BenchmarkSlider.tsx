export function BenchmarkSlider({ overPercent, label }: { overPercent: number; label: string }) {
  // Normalize: position from -30% (best) to +30% (worst)
  const clamped = Math.max(-30, Math.min(30, overPercent));
  const pct = ((clamped + 30) / 60) * 100;
  const isOver = overPercent > 0;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={isOver ? "text-destructive text-sm font-medium" : "text-success text-sm font-medium"}>
          {isOver ? "+" : ""}
          {overPercent}%
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-accent overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-success/30 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-destructive/30 to-transparent" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-border" />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-foreground border-2 border-background shadow-lg transition-all"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>Best-in-Class</span>
        <span>Markt-Ø</span>
        <span>Optimierungspotenzial</span>
      </div>
    </div>
  );
}
