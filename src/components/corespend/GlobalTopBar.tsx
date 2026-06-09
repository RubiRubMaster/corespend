import { useCoreSpend } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";

export function GlobalTopBar() {
  const { timeMode, setTimeMode } = useCoreSpend();
  return (
    <div className="border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="flex items-center justify-end gap-3 px-6 py-2">
        <div
          role="tablist"
          aria-label="Zeitraum"
          className="inline-flex items-center rounded-full border border-border bg-surface/60 p-0.5 text-[11px] uppercase tracking-[0.14em]"
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
        <div className="h-7 w-7 rounded-full bg-accent border border-border grid place-items-center text-[11px] font-medium text-foreground/80">
          CL
        </div>
      </div>
    </div>
  );
}
