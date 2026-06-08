import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CoreSpendProvider,
  useCoreSpend,
  formatEUR,
  PRICING,
  type UploadStatus,
  type MobilfunkMetrics,
  type CockpitMetrics,
  type TickerTone,
} from "@/lib/corespend-store";
import { AppShell } from "@/components/corespend/AppShell";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "CoreSpend · Admin" }] }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <CoreSpendProvider>
      <AppShell>
        <AdminInner />
      </AppShell>
    </CoreSpendProvider>
  );
}

const STATUSES: UploadStatus[] = ["idle", "processing", "pending", "analyzed"];
const STATUS_LABEL: Record<UploadStatus, string> = {
  idle: "Nicht hochgeladen",
  processing: "Verarbeitung (State B)",
  pending: "Expertenprüfung",
  analyzed: "Freigeschaltet (State C)",
};

function AdminInner() {
  const {
    mobilfunkStatus,
    setMobilfunkStatus,
    metrics,
    updateMetrics,
    priceOverride,
    setPriceOverride,
    currentPrice,
    resetAll,
  } = useCoreSpend();

  const setMetric = (k: keyof MobilfunkMetrics, v: string) => {
    const n = Number(v);
    if (!Number.isNaN(n)) updateMetrics({ [k]: n } as Partial<MobilfunkMetrics>);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <span>←</span> Zurück zur Landingpage
            </Link>
            <span>·</span>
            <span>Admin · Live-Steuerung</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Präsentations-Steuerung</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Steuere die Mobilfunk-Pipeline (State A/B/C), überschreibe Kennzahlen und Preis in Echtzeit.
          </p>
        </div>
        <button
          onClick={resetAll}
          className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent transition-colors"
        >
          ↻ Alles zurücksetzen
        </button>
      </div>

      {/* Mobilfunk Pipeline State */}
      <div className="glass-card p-6">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
          Mobilfunk Pipeline · State
        </div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="text-sm">
            Aktuell: <span className="text-foreground font-medium">{STATUS_LABEL[mobilfunkStatus]}</span>
          </div>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setMobilfunkStatus(s)}
                className={
                  "px-3 py-1.5 text-xs transition-colors " +
                  (mobilfunkStatus === s ? "bg-success text-success-foreground" : "hover:bg-accent text-muted-foreground")
                }
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobilfunk Metrics override */}
      <div className="glass-card p-6">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
          Mobilfunk Kennzahlen (Management Dashboard & Cockpit)
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <MetricField label="Kosten / Monat (€)" value={metrics.costMonthly} onChange={(v) => setMetric("costMonthly", v)} />
          <MetricField label="Nutzung (%)" value={metrics.usagePercent} onChange={(v) => setMetric("usagePercent", v)} />
          <MetricField label="Laufzeit (Monate)" value={metrics.runtimeMonths} onChange={(v) => setMetric("runtimeMonths", v)} />
          <MetricField label="Einsparpotenzial / Jahr (€)" value={metrics.savingsYearly} onChange={(v) => setMetric("savingsYearly", v)} />
          <MetricField label="ARPU Ist (€)" value={metrics.arpuActual} step="0.01" onChange={(v) => setMetric("arpuActual", v)} />
          <MetricField label="ARPU Markt-Target (€)" value={metrics.arpuTarget} step="0.01" onChange={(v) => setMetric("arpuTarget", v)} />
        </div>
      </div>

      {/* Pricing override */}
      <div className="glass-card p-6">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
          Pricing-Override
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <div className="text-xs text-muted-foreground">Effektiver Preis</div>
            <div className="text-2xl font-semibold tabular-nums">
              {formatEUR(currentPrice)} <span className="text-xs text-muted-foreground">/ Monat</span>
            </div>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Override:</label>
            <input
              type="number"
              value={priceOverride ?? ""}
              placeholder="—"
              onChange={(e) => setPriceOverride(e.target.value === "" ? null : Number(e.target.value))}
              className="w-32 rounded-md border border-border bg-background px-3 py-1.5 text-sm tabular-nums focus:outline-none focus:ring-1 focus:ring-success"
            />
            <span className="text-xs text-muted-foreground">€ / Monat</span>
            {priceOverride !== null && (
              <button
                onClick={() => setPriceOverride(null)}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Override entfernen
              </button>
            )}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-3">
          Basis {formatEUR(PRICING.BASE_PRICE)} − {formatEUR(PRICING.DISCOUNT_PER_AREA)} je aktiviertem Bereich
          (max. {PRICING.TOTAL_AREAS} Bereiche · Minimum {formatEUR(PRICING.MIN_PRICE)}).
        </p>
      </div>
    </div>
  );
}

function MetricField({
  label, value, step = "1", onChange,
}: { label: string; value: number; step?: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-1 focus:ring-success"
      />
    </label>
  );
}
