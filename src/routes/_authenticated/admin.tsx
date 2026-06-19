import { createFileRoute, Link } from "@tanstack/react-router";
import {
  useCoreSpend,
  formatEUR,
  PRICING,
  type UploadStatus,
  type MobilfunkMetrics,
  type CockpitMetrics,
  type DeadlineItem,
  type SpendAreaItem,
  type RiskItem,
  type RiskStatus,
} from "@/lib/corespend-store";
import { AppShell } from "@/components/corespend/AppShell";
import { CoreSpendHydrator } from "@/components/corespend/CoreSpendHydrator";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "CoreSpend · Admin" }] }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <CoreSpendHydrator>
      <AppShell>
        <AdminInner />
      </AppShell>
    </CoreSpendHydrator>
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
    cockpit,
    cockpitMetrics,
    updateCockpitMetrics,
    deadlines,
    updateDeadline,
    optimizations,
    updateNoUsage,
    updateTariff,
    spendBreakdown,
    updateSpendArea,
    riskItems,
    updateRiskItem,
    priceOverride,
    setPriceOverride,
    currentPrice,
    coreStartStatuses,
    updateCoreStartStatus,
    resetAll,
  } = useCoreSpend();

  const setMetric = (k: keyof MobilfunkMetrics, v: string) => {
    const n = Number(v);
    if (!Number.isNaN(n)) updateMetrics({ [k]: n } as Partial<MobilfunkMetrics>);
  };

  const setCockpit = (k: keyof CockpitMetrics, v: string) => {
    const n = Number(v);
    if (!Number.isNaN(n)) updateCockpitMetrics({ [k]: n } as Partial<CockpitMetrics>);
  };

  const setDeadlineField = (i: number, k: keyof DeadlineItem, v: string) => {
    if (k === "remainingMonths") {
      const n = Number(v);
      if (!Number.isNaN(n)) updateDeadline(i, { remainingMonths: n });
    } else {
      updateDeadline(i, { [k]: v } as Partial<DeadlineItem>);
    }
  };

  const totalOptSavings =
    optimizations.noUsage.reduce((s, it) => s + (Number(it.yearlyCost) || 0), 0) +
    optimizations.tariffMismatches.reduce((s, it) => s + (Number(it.yearlyCost) || 0), 0);

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
            Alle Eingaben synchronisieren live mit Core Cockpit, Briefing und Detailseiten.
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
      <Section title="Mobilfunk Pipeline · State">
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
      </Section>

      {/* Core Start Status Tiles */}
      <Section title="Daten für Core Start (Launchpad-Kacheln)" subtitle="Status-Badges der 5 IT-Bereiche · live im Core Start sichtbar">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {(["telco", "office", "saas", "cloud", "hardware"] as const).map((key) => {
            const labels: Record<typeof key, string> = {
              telco: "📞 Telekommunikation",
              office: "💻 Office Suites",
              saas: "☁️ SaaS",
              cloud: "🌐 Cloud",
              hardware: "🔌 Hardware",
            };
            return (
              <SelectField
                key={key}
                label={labels[key]}
                value={coreStartStatuses[key]}
                onChange={(v) => updateCoreStartStatus(key, v as "analyzed" | "pending" | "comingsoon")}
                options={[
                  { value: "analyzed", label: "🟢 Analysiert (Aktiv)" },
                  { value: "pending", label: "⚪ Daten ausstehend" },
                  { value: "comingsoon", label: "🔒 Coming Soon" },
                ]}
              />
            );
          })}
        </div>
      </Section>

      {/* === Daten für Core Cockpit === */}
      <Section title="Daten für Core Cockpit" subtitle="Executive KPIs · live im Cockpit sichtbar">
        <div className="grid gap-4 md:grid-cols-3">
          <MetricField label="Spend YoY (%)" value={cockpitMetrics.spendYoyPercent} step="0.1" onChange={(v) => setCockpit("spendYoyPercent", v)} />
          <MetricField label="Optimierungspotenzial (%)" value={cockpitMetrics.savingsPercent} step="0.1" onChange={(v) => setCockpit("savingsPercent", v)} />
          <MetricField label="Fristen-Fenster (Tage)" value={cockpitMetrics.deadlineWindowDays} onChange={(v) => setCockpit("deadlineWindowDays", v)} />
          <MetricField label="CoreSpend Impact (€)" value={cockpitMetrics.impactRealized} onChange={(v) => setCockpit("impactRealized", v)} />
          <MetricField label="ROI (x)" value={cockpitMetrics.roi} step="0.1" onChange={(v) => setCockpit("roi", v)} />
          <ReadOnlyField label="Validierte IT-Ausgaben / Monat (€) · derived" value={formatEUR(cockpit.spendMonthly)} hint="Summe aus Spend-Breakdown (5 Kernbereiche)" />
          <ReadOnlyField label="Vertragsrisiko / Risk Exposure (€) · derived" value={formatEUR(cockpit.riskExposure)} hint="Summe aus Risiko-Detailseite" />
          <ReadOnlyField label="Sparpotenzial / Jahr (€) · derived" value={formatEUR(cockpit.savingsYearly)} hint="Summe aus Optimierungs-Detailseite" />
          <ReadOnlyField label="Kritische Fristen (#) · derived" value={`${cockpit.criticalDeadlines}`} hint="Verträge innerhalb Fristen-Fenster" />
        </div>
      </Section>

      {/* === Daten fuer Validierte IT-Ausgaben === */}
      <Section
        title="Daten fuer 'Validierte IT-Ausgaben' (Detailseite)"
        subtitle="5 Kernbereiche · Summe der Monatskosten = Haupt-KPI im Cockpit"
      >
        <div className="space-y-3">
          {spendBreakdown.map((a, i) => (
            <div key={a.key} className="grid gap-2 md:grid-cols-[1.4fr_1fr_1fr] items-end rounded-lg border border-border bg-background/40 p-3">
              <TextField label={`Bereich ${i + 1}`} value={`${a.emoji} ${a.label}`} onChange={(v) => updateSpendArea(i, { label: v.replace(/^\S+\s*/, "") })} />
              <MetricField label="Kosten / Monat (€)" value={a.monthly} onChange={(v) => updateSpendArea(i, { monthly: Number(v) || 0 })} />
              <MetricField label="Trend vs. Vorjahr (%)" value={a.yoyPercent} step="0.1" onChange={(v) => updateSpendArea(i, { yoyPercent: Number(v) || 0 })} />
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Summe → Cockpit „Validierte IT-Ausgaben"</span>
          <span className="text-xl font-semibold tabular-nums">{formatEUR(cockpit.spendMonthly)} / Monat</span>
        </div>
      </Section>

      {/* === Daten fuer Vertragsrisiko === */}
      <Section
        title="Daten fuer 'Vertragsrisiko' (Detailseite)"
        subtitle="Bis zu 3 Risiko-Zeilen · Summe Restvolumen = Haupt-KPI im Cockpit"
      >

        <div className="space-y-3">
          {riskItems.map((r, i) => (
            <div key={i} className="grid gap-2 md:grid-cols-[1.2fr_1.2fr_1fr_160px] items-end rounded-lg border border-border bg-background/40 p-3">
              <TextField label={`Risiko ${i + 1} · Vendor`} value={r.vendor} onChange={(v) => updateRiskItem(i, { vendor: v })} />
              <TextField label="Bereich" value={r.area} onChange={(v) => updateRiskItem(i, { area: v })} />
              <MetricField label="Restvolumen (€)" value={r.remainingVolume} onChange={(v) => updateRiskItem(i, { remainingVolume: Number(v) || 0 })} />
              <SelectField
                label="Status"
                value={r.status}
                onChange={(v) => updateRiskItem(i, { status: v as RiskStatus })}
                options={[
                  { value: "akut", label: "Akuter Handlungsbedarf" },
                  { value: "verhandlung", label: "In Verhandlung" },
                  { value: "sicher", label: "Sicher" },
                ]}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Summe → Cockpit „Vertragsrisiko"</span>
          <span className="text-xl font-semibold tabular-nums text-destructive">{formatEUR(cockpit.riskExposure)}</span>
        </div>
      </Section>



      {/* === Daten für Fristen-Detailseite === */}
      <Section
        title="Daten für Fristen-Detailseite"
        subtitle="3 Vertragseinträge · speisen Detailtabelle UND orange Briefing-Zeile"
      >
        <div className="space-y-3">
          {deadlines.map((d, i) => (
            <div key={i} className="grid gap-2 md:grid-cols-[1fr_1.3fr_1.3fr_140px] items-end rounded-lg border border-border bg-background/40 p-3">
              <TextField label={`Vertrag ${i + 1} · Anbieter`} value={d.vendor} onChange={(v) => setDeadlineField(i, "vendor", v)} />
              <TextField label="Vertragsart" value={d.contractType} onChange={(v) => setDeadlineField(i, "contractType", v)} />
              <TextField label="Enddatum / Frist (Text)" value={d.endLabel} onChange={(v) => setDeadlineField(i, "endLabel", v)} placeholder="z.B. Strategisches Verhandlungsfenster: endet in 5 Monaten" />
              <MetricField label="Verbleibend (Monate)" value={d.remainingMonths} onChange={(v) => setDeadlineField(i, "remainingMonths", v)} />
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-3">
          Der erste fällige Vertrag erscheint automatisch als orange Zeile im Management Briefing.
        </p>
      </Section>

      {/* === Daten fuer Optimierungsvorschlaege === */}
      <Section
        title="Daten fuer 'Optimierungsvorschlaege' (Detailseite)"
        subtitle="No-Usage + Tarif-Mismatches · Summe → Karte 'Identifiziertes Sparpotenzial'"
      >
        {/* No-Usage rows */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sektion A · No-Usage (Karteileichen)
          </div>
          {optimizations.noUsage.map((it, i) => (
            <div key={i} className="grid gap-2 md:grid-cols-[1.6fr_1fr_90px_120px_1fr] items-end rounded-lg border border-border bg-background/40 p-3">
              <TextField label={`Asset ${i + 1}`} value={it.label} onChange={(v) => updateNoUsage(i, { label: v })} />
              <TextField label="IT-Bereich" value={it.area} onChange={(v) => updateNoUsage(i, { area: v })} />
              <MetricField label={`Anzahl (${it.unit})`} value={it.count} onChange={(v) => updateNoUsage(i, { count: Number(v) || 0 })} />
              <MetricField label="Verlust / Jahr (€)" value={it.yearlyCost} onChange={(v) => updateNoUsage(i, { yearlyCost: Number(v) || 0 })} />
              <TextField label="Sofortmaßnahme" value={it.action} onChange={(v) => updateNoUsage(i, { action: v })} />
            </div>
          ))}
        </div>

        {/* Tariff rows */}
        <div className="space-y-3 mt-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sektion B · Tarif-Mismatches &amp; Options-Konsolidierung
          </div>
          {optimizations.tariffMismatches.map((it, i) => (
            <div key={i} className="grid gap-2 md:grid-cols-[1.6fr_1fr_140px_1.4fr] items-end rounded-lg border border-border bg-background/40 p-3">
              <TextField label={`Vertrag / Option ${i + 1}`} value={it.label} onChange={(v) => updateTariff(i, { label: v })} />
              <TextField label="IT-Bereich" value={it.area} onChange={(v) => updateTariff(i, { area: v })} />
              <MetricField label="Potenzial / Jahr (€)" value={it.yearlyCost} onChange={(v) => updateTariff(i, { yearlyCost: Number(v) || 0 })} />
              <TextField label="Erklärung / Hebel" value={it.lever} onChange={(v) => updateTariff(i, { lever: v })} />
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-success/30 bg-success/5 px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Summe → Cockpit 'Identifiziertes Sparpotenzial'</span>
          <span className="text-xl font-semibold tabular-nums text-success">{formatEUR(totalOptSavings)} / Jahr</span>
        </div>
      </Section>


      {/* === Daten für Core Analytics === */}
      <Section title="Daten für Core Analytics · Mobilfunk Kennzahlen" subtitle="Operatives Controlling · speist die Mobilfunk-Detailseite und Core Analytics">
        <div className="grid gap-4 md:grid-cols-3">
          <MetricField label="Kosten / Monat (€)" value={metrics.costMonthly} onChange={(v) => setMetric("costMonthly", v)} />
          <MetricField label="Nutzung (%)" value={metrics.usagePercent} onChange={(v) => setMetric("usagePercent", v)} />
          <MetricField label="Laufzeit (Monate)" value={metrics.runtimeMonths} onChange={(v) => setMetric("runtimeMonths", v)} />
          <MetricField label="Einsparpotenzial / Jahr (€)" value={metrics.savingsYearly} onChange={(v) => setMetric("savingsYearly", v)} />
          <MetricField label="ARPU Ist (€)" value={metrics.arpuActual} step="0.01" onChange={(v) => setMetric("arpuActual", v)} />
          <MetricField label="ARPU Markt-Target (€)" value={metrics.arpuTarget} step="0.01" onChange={(v) => setMetric("arpuTarget", v)} />
        </div>
      </Section>

      {/* Pricing override */}
      <Section title="Pricing-Override">
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
      </Section>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-6">
      <div className="mb-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{title}</div>
        {subtitle && <div className="text-[11px] text-muted-foreground/80 mt-0.5">{subtitle}</div>}
      </div>
      {children}
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

function TextField({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-success"
      />
    </label>
  );
}

function ReadOnlyField({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="block">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1 w-full rounded-md border border-border bg-background/40 px-3 py-2 text-sm tabular-nums text-muted-foreground">
        {value}
      </div>
      {hint && <div className="text-[10px] text-muted-foreground/70 mt-1">{hint}</div>}
    </div>
  );
}

function SelectField({
  label, value, onChange, options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-success"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
