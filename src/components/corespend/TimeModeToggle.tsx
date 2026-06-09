import { useCoreSpend } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";

export function TimeModeToggle() {
  const { timeMode, setTimeMode } = useCoreSpend();
  return (
    <div
      role="tablist"
      aria-label="Zeitraum"
      className="inline-flex items-center rounded-full border border-border bg-surface/60 p-0.5 text-[11px] uppercase tracking-[0.14em] mt-3"
    >
      {(["monthly", "yearly"] as const).map((m) => {
        const active = timeMode === m;
        return (
          <button
            key={m}
            role="tab"
            aria-selected={active}
            onClick={() => setTimeMode(m)}
            className={cn(
              "px-3 py-1.5 rounded-full transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {m === "monthly" ? "Monatlich" : "Jährlich"}
          </button>
        );
      })}
    </div>
  );
}
