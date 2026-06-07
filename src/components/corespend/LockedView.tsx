import { useCoreSpend, CATEGORIES_META } from "@/lib/corespend-store";

export function LockedView() {
  const { lockedHint, goDashboard } = useCoreSpend();
  const meta = lockedHint ? CATEGORIES_META.find((c) => c.key === lockedHint) : undefined;

  return (
    <div className="space-y-6">
      <button
        onClick={goDashboard}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>←</span> Zurück zum Management Dashboard
      </button>

      <div className="glass-card p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5 pointer-events-none" />
        <div className="relative max-w-lg mx-auto">
          <div className="text-5xl mb-4">{meta?.emoji ?? "🔒"}</div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Coming Soon</div>
          <h1 className="text-2xl font-semibold tracking-tight mt-2">
            {meta?.label ?? "Bereich"} folgt im nächsten Release
          </h1>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            Aktuell fokussieren wir den MVP auf Mobilfunk. Sobald dieser Bereich freigeschaltet ist,
            sinkt dein CoreSpend-Tarif um weitere 200 € / Monat.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-success border border-success/40 bg-success/10 rounded-full px-3 py-1.5">
            <span>📬</span> Auf Warteliste setzen
          </div>
        </div>
      </div>
    </div>
  );
}
