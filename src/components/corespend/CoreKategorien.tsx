import { useCoreSpend, CATEGORY_META } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";

export function CoreKategorien() {
  const { currentCategory, categories, goToStart, goToUpload } = useCoreSpend();

  if (!currentCategory) {
    return (
      <div className="glass-card p-10 text-center">
        <h2 className="text-lg font-semibold">Keine Kategorie ausgewählt</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Bitte wähle in <button className="underline text-primary" onClick={goToStart}>Core Start</button> einen Hauptbereich.
        </p>
      </div>
    );
  }

  const meta = CATEGORY_META[currentCategory];
  const cat = categories[currentCategory];

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={goToStart}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <span>←</span> Zurück zu Core Start
        </button>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-success/20 grid place-items-center border border-border text-2xl">
            {meta.emoji}
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">🗂️ Core Kategorien</div>
            <h1 className="text-3xl font-semibold tracking-tight mt-0.5">
              {meta.emoji} {meta.label}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Wähle einen Unterpunkt, um Daten hochzuladen oder bestehende Analysen einzusehen.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {meta.subs.map((s) => {
          const status = cat.subStatus[s.key] ?? "idle";
          const isLive = status === "analyzed" || status === "pending";
          const isProcessing = status === "processing";
          const disabled = s.available === false;

          return (
            <button
              key={s.key}
              disabled={disabled}
              onClick={() => goToUpload(currentCategory, s.key)}
              className={cn(
                "group relative text-left glass-card p-6 overflow-hidden transition-all duration-300 flex flex-col gap-4 min-h-[220px]",
                !disabled && "hover:-translate-y-0.5 hover:border-primary/40",
                isLive && "glow-success",
                disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{s.emoji}</div>
                  <div>
                    <h3 className="text-base font-semibold leading-tight">{s.label}</h3>
                    <StatusBadge status={disabled ? "disabled" : status} />
                  </div>
                </div>
                {!disabled && (
                  <span className="text-muted-foreground group-hover:text-primary transition-colors text-sm">→</span>
                )}
              </div>

              {s.kpi && !disabled && (
                <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-2 pt-4 border-t border-border/60">
                  {s.kpi.map((k) => (
                    <div key={k.label} className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.label}</div>
                      <div className={cn("text-sm tabular-nums truncate", isLive ? "text-foreground" : "text-muted-foreground/80 italic")}>
                        {isLive ? k.value : "—"}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {disabled && (
                <div className="mt-auto text-xs text-muted-foreground italic">
                  Dieser Unterpunkt wird in Kürze freigeschaltet.
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "disabled") {
    return (
      <span className="inline-flex items-center text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded-full px-2 py-0.5 mt-1">
        Bald verfügbar
      </span>
    );
  }
  if (status === "analyzed") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-success border border-success/40 bg-success/10 rounded-full px-2 py-0.5 mt-1">
        <span>✓</span> Analysiert
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary border border-primary/40 bg-primary/10 rounded-full px-2 py-0.5 mt-1">
        <span>◷</span> In Prüfung
      </span>
    );
  }
  if (status === "processing") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary border border-primary/40 bg-primary/10 rounded-full px-2 py-0.5 mt-1">
        <span className="animate-spin inline-block">↻</span> Verarbeitung
      </span>
    );
  }
  return (
    <span className="inline-flex items-center text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded-full px-2 py-0.5 mt-1">
      Daten ausstehend
    </span>
  );
}
