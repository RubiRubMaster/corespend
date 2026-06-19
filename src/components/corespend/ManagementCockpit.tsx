import { useState } from "react";
import { useCoreSpend, formatEUR, type TickerTone, type ActiveView } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";
import { AlertCircle, Clock, CheckCircle, ChevronDown, Printer, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const TONE_ORDER: Record<TickerTone, number> = { danger: 0, warning: 1, success: 2 };

type EditableBriefing = { tone: TickerTone; text: string; target?: ActiveView };

const DEFAULT_BRIEFING: EditableBriefing[] = [
  {
    tone: "danger",
    text: "Ungenutzte Ressourcen (No Usage): Unnötige Kapitalbindung von 4.200 € / Jahr im Mobilfunk-Stack identifiziert. Sofortmaßnahme verfügbar.",
    target: "optimizations",
  },
  {
    tone: "warning",
    text: "Strategisches Verhandlungsfenster: Kündigungs- und Optimierungsfrist für Telekommunikation aktiv (Vertragslaufzeit endet in 5 Monaten).",
    target: "deadlines",
  },
  {
    tone: "success",
    text: "Benchmark-Abweichung erkannt: Der durchschnittliche Preis pro User (ARPU) liegt 18% über dem DACH-Marktdurchschnitt. Einsparungspotenzial von 24.320 € verifiziert.",
    target: "optimizations",
  },
  {
    tone: "success",
    text: "Automatisierter Abgleich abgeschlossen: IT-Stack erfolgreich anonymisiert und gegen Hunderte verifizierte DACH-Benchmarks gematcht.",
  },
];

const SPEND_DIMENSIONS = [
  { label: "Telekommunikation", value: 36, color: "hsl(var(--primary))" },
  { label: "Office", value: 16, color: "hsl(199 89% 60%)" },
  { label: "SaaS", value: 18, color: "hsl(262 83% 65%)" },
  { label: "Cloud", value: 21, color: "hsl(173 70% 50%)" },
  { label: "Hardware", value: 9, color: "hsl(32 95% 60%)" },
];

const SOURCING_PHASES = [
  { label: "In Analyse", state: "done" as const },
  { label: "Strategie bereit", state: "done" as const },
  { label: "In Verhandlung", state: "active" as const },
  { label: "Erfolgreich optimiert", state: "todo" as const },
];

export function ManagementCockpit() {
  const {
    mobilfunkStatus, cockpit: m, timeMode,
    goDeadlines, goOptimizations, goSpend, goRisk, setActiveView,
  } = useCoreSpend();
  const live = mobilfunkStatus === "analyzed";
  const yearly = timeMode === "yearly";
  const spendValue = yearly ? m.spendMonthly * 12 : m.spendMonthly;
  const savingsValue = yearly ? m.savingsYearly : Math.floor(m.savingsYearly / 12);
  const unit = yearly ? "/ Jahr" : "/ Monat";

  const [briefing, setBriefing] = useState<EditableBriefing[]>(DEFAULT_BRIEFING);
  const [adminOpen, setAdminOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const navTo = (v?: ActiveView) => { if (v) setActiveView(v); };

  const sortedBriefing = briefing
    .map((t, i) => ({ ...t, originalIndex: i }))
    .sort((a, b) => TONE_ORDER[a.tone] - TONE_ORDER[b.tone]);

  const updateBriefing = (i: number, patch: Partial<EditableBriefing>) =>
    setBriefing((prev) => prev.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            CoreSpend · Executive Layer
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mt-1 flex items-center gap-2">
            <span>💼</span> Core Cockpit
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            Die zentrale Steuerungseinheit für maximale Kostentransparenz, proaktives Fristenmanagement und messbaren ROI Ihres gesamten IT-Stacks.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className={cn("h-2 w-2 rounded-full animate-pulse", live ? "bg-success" : "bg-muted-foreground/40")} />
          {live ? "Live · Datenbasis aktiv" : "Demo · Daten werden nach Analyse freigeschaltet"}
        </div>
      </header>

      {/* KPI Row */}
      <section className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr_1.5fr]">
        <KpiCard
          label="Total Tech Spend"
          value={live ? `${formatEUR(spendValue)}` : "—"}
          unit={unit}
          locked={!live}
          onClick={live ? goSpend : undefined}
        />
        <KpiCard
          label="Realisierbares Potenzial"
          value={live ? `${formatEUR(savingsValue)}` : "—"}
          unit={unit}
          valueTone="success"
          locked={!live}
          onClick={live ? goOptimizations : undefined}
        />
        <KpiCard
          label="Fristen-Monitoring"
          value={live ? `${m.criticalDeadlines}` : "—"}
          valueTone="warning"
          locked={!live}
          onClick={live ? goDeadlines : undefined}
        />
        <KpiCard
          label="Financial Exposure"
          value={live ? formatEUR(m.riskExposure) : "—"}
          locked={!live}
          onClick={live ? goRisk : undefined}
        />

        {/* Highlight Card */}
        <div
          className={cn(
            "rounded-xl border p-5 flex flex-col gap-4",
            live
              ? "border-success/40 bg-gradient-to-br from-success/15 via-success/5 to-primary/10 shadow-[0_0_40px_-15px_hsl(var(--success)/0.4)]"
              : "border-border bg-surface/40 opacity-70",
          )}
        >
          <div className="text-[10px] uppercase tracking-[0.2em] text-success/90 flex items-center gap-1.5">
            <span>✦</span> CoreSpend Impact
          </div>

          <div className="flex items-stretch gap-5 flex-1">
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <div className={cn("text-3xl font-semibold tabular-nums tracking-tight leading-none truncate", live ? "text-success" : "text-muted-foreground")}>
                {live ? formatEUR(m.impactRealized) : "—"}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2">
                Realisierte Einsparungen
              </div>
            </div>
            <div className="w-px bg-success/20 shrink-0" />
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <div className={cn("text-3xl font-semibold tabular-nums tracking-tight leading-none", live ? "text-foreground" : "text-muted-foreground")}>
                {live ? `${m.roi.toFixed(1).replace(".", ",")}x` : "—"}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2">
                ROI
              </div>
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground leading-snug border-t border-success/20 pt-3">
            ROI: {live ? `${m.roi.toFixed(1).replace(".", ",")}x` : "—"}
            {live && ` (Je investiertem Euro werden ${m.roi.toFixed(2).replace(".", ",")} € eingespart)`}
          </div>
        </div>
      </section>

      {/* Visual Governance */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className={cn("rounded-xl border border-border bg-surface/40 px-4 py-4", !live && "opacity-70")}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
              Spend nach Dimensionen
            </span>
            <span className="text-[10px] text-muted-foreground">5 Core-Bereiche</span>
          </div>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-border/40">
            {SPEND_DIMENSIONS.map((d) => (
              <div
                key={d.label}
                style={{ width: `${d.value}%`, backgroundColor: d.color }}
                className="h-full transition-all"
                title={`${d.label} · ${d.value}%`}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {SPEND_DIMENSIONS.map((d) => (
              <div key={d.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span>{d.label}</span>
                <span className="tabular-nums text-foreground/70">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className={cn("rounded-xl border border-border bg-surface/40 px-4 py-4", !live && "opacity-70")}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
              Sourcing-Status
            </span>
            <span className="text-[10px] text-muted-foreground">Aktive Verhandlungsphase</span>
          </div>
          <div className="flex items-center gap-1.5">
            {SOURCING_PHASES.map((p, i) => (
              <div key={p.label} className="flex items-center gap-1.5 flex-1">
                <div
                  className={cn(
                    "flex-1 rounded-md border px-2.5 py-2 text-[11px] leading-tight text-center transition-all",
                    p.state === "done" && "border-success/40 bg-success/10 text-success",
                    p.state === "active" && "border-primary/50 bg-primary/15 text-foreground font-medium shadow-[0_0_20px_-8px_hsl(var(--primary)/0.6)]",
                    p.state === "todo" && "border-border bg-surface/60 text-muted-foreground",
                  )}
                >
                  {p.label}
                </div>
                {i < SOURCING_PHASES.length - 1 && (
                  <span className={cn(
                    "text-xs",
                    p.state === "done" ? "text-success/60" : "text-muted-foreground/50",
                  )}>→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Management Briefing */}
      <section
        className={cn(
          "rounded-xl border bg-background/60 backdrop-blur p-6",
          live ? "border-border" : "border-border opacity-70",
        )}
      >
        {/* Admin Bar */}
        <div className="mb-4">
          <button
            onClick={() => setAdminOpen((v) => !v)}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ChevronDown className={cn("h-3 w-3 transition-transform", adminOpen && "rotate-180")} />
            Admin-Konsole · Briefing bearbeiten
          </button>
          {adminOpen && (
            <div className="mt-3 space-y-2 rounded-lg border border-dashed border-border/70 bg-surface/30 p-3">
              {briefing.map((b, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-[100px_1fr] items-center">
                  <select
                    value={b.tone}
                    onChange={(e) => updateBriefing(i, { tone: e.target.value as TickerTone })}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs cursor-pointer"
                  >
                    <option value="danger">Rot</option>
                    <option value="warning">Orange</option>
                    <option value="success">Grün</option>
                  </select>
                  <Input
                    value={b.text}
                    onChange={(e) => updateBriefing(i, { text: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border">
          <span className="text-lg">📊</span>
          <span className="text-base font-semibold tracking-tight">Management Briefing</span>
        </div>
        <ul className="flex flex-col divide-y divide-border/60">
          {sortedBriefing.map((t) => {
            const interactive = live && !!t.target;
            return (
              <li key={t.originalIndex}>
                <button
                  onClick={interactive ? () => navTo(t.target) : undefined}
                  disabled={!interactive}
                  className={cn(
                    "w-full flex items-start gap-3 py-3.5 text-left text-[14px] leading-relaxed tabular-nums",
                    interactive && "hover:text-primary transition-colors cursor-pointer",
                    !live && "text-muted-foreground/70",
                  )}
                >
                  <span className="mt-0.5"><BriefingIcon tone={t.tone} /></span>
                  <span className={cn("text-foreground/90", !live && "text-muted-foreground/70")}>
                    {t.text}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* CTA Strip · 3 actions */}
      <section className="grid gap-4 md:grid-cols-3">
        <CtaTile
          emoji="🤝"
          title="Verhandlungsexperten aktivieren"
          desc="Verifizierte Verhandlungsexperten per Klick einbinden — für maximale Einsparungen am Tisch."
          onClick={live ? goOptimizations : undefined}
          tone="primary"
        />
        <CtaTile
          emoji="⚡"
          title="Optimierungsvorschläge prüfen"
          desc="Direkter Zugriff auf Konsolidierungen, No-Usage-Warnungen und Einsparpotenziale."
          onClick={live ? goOptimizations : undefined}
          tone="default"
        />
        <CtaTile
          emoji="📄"
          title="CFO-Ready Report generieren"
          desc="Sofortiger, druckfertiger PDF-Export des aktuellen IT-Finanzstatus für das Management."
          onClick={() => setReportOpen(true)}
          tone="outline"
        />
      </section>

      {/* CFO Report Modal */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto print:max-w-none print:shadow-none print:border-0">
          <DialogHeader>
            <DialogTitle className="text-xl">Executive Status Report — CoreSpend</DialogTitle>
            <div className="text-xs text-muted-foreground">
              Stand: {new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })} · Vertraulich
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-2 print:text-black">
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Kennzahlen-Übersicht
              </h3>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium">KPI</th>
                    <th className="text-right py-2 font-medium">Wert</th>
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  <tr className="border-b border-border/60">
                    <td className="py-2">Total Tech Spend ({yearly ? "p.a." : "p.m."})</td>
                    <td className="py-2 text-right">{live ? formatEUR(spendValue) : "—"}</td>
                  </tr>
                  <tr className="border-b border-border/60">
                    <td className="py-2">Realisierbares Potenzial</td>
                    <td className="py-2 text-right text-success">{live ? formatEUR(savingsValue) : "—"}</td>
                  </tr>
                  <tr className="border-b border-border/60">
                    <td className="py-2">Fristen-Monitoring (offen)</td>
                    <td className="py-2 text-right">{live ? m.criticalDeadlines : "—"}</td>
                  </tr>
                  <tr className="border-b border-border/60">
                    <td className="py-2">Financial Exposure</td>
                    <td className="py-2 text-right">{live ? formatEUR(m.riskExposure) : "—"}</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Top-Einsparpotenziale
              </h3>
              <ul className="text-sm space-y-1.5 list-disc list-inside">
                <li>Mobilfunk-Tarifoptimierung — ARPU-Reduktion gegen DACH-Benchmark: <span className="font-medium">24.320 € / Jahr</span></li>
                <li>Inaktive SIM-Karten (No Usage) — sofortige Deaktivierung: <span className="font-medium">4.200 € / Jahr</span></li>
                <li>Konsolidierung von SaaS-Lizenzen — Doppelnutzung Office/Collaboration: <span className="font-medium">11.500 € / Jahr</span></li>
              </ul>
            </section>

            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Risk Exposure Audit
              </h3>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium">Vertrag</th>
                    <th className="text-left py-2 font-medium">Status</th>
                    <th className="text-right py-2 font-medium">Restvolumen</th>
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  <tr className="border-b border-border/60">
                    <td className="py-2">Vodafone — Mobilfunk</td>
                    <td className="py-2 text-destructive">Akut</td>
                    <td className="py-2 text-right">312.000 €</td>
                  </tr>
                  <tr className="border-b border-border/60">
                    <td className="py-2">Microsoft — M365</td>
                    <td className="py-2 text-[hsl(32_95%_60%)]">In Verhandlung</td>
                    <td className="py-2 text-right">198.000 €</td>
                  </tr>
                  <tr className="border-b border-border/60">
                    <td className="py-2">AWS — Cloud</td>
                    <td className="py-2 text-success">Gesichert</td>
                    <td className="py-2 text-right">145.000 €</td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>

          <div className="flex justify-end gap-2 mt-6 print:hidden">
            <button
              onClick={() => setReportOpen(false)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface/40 px-4 py-2 text-sm hover:bg-surface/70 cursor-pointer transition-colors"
            >
              <X className="h-4 w-4" /> Schließen
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 cursor-pointer transition-colors"
            >
              <Printer className="h-4 w-4" /> Bericht drucken
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------- bits ---------- */

function KpiCard({
  label, value, unit, valueTone, locked, onClick,
}: {
  label: string;
  value: string;
  unit?: string;
  valueTone?: "success" | "warning" | "destructive";
  locked?: boolean;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-surface/40 px-4 py-5 flex flex-col leading-tight text-left transition-all",
        "border-border",
        locked && "opacity-60",
        onClick && "hover:border-primary/40 hover:bg-primary/5 cursor-pointer",
      )}
    >
      <span className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground font-medium">{label}</span>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span
          className={cn(
            "text-2xl font-semibold tabular-nums tracking-tight",
            valueTone === "success" && "text-success",
            valueTone === "warning" && "text-[hsl(32_95%_60%)]",
            valueTone === "destructive" && "text-destructive",
          )}
        >
          {value}
        </span>
        {unit && <span className="text-[11px] text-muted-foreground">{unit}</span>}
      </div>
    </Tag>
  );
}

function BriefingIcon({ tone }: { tone: TickerTone }) {
  if (tone === "danger") {
    return <AlertCircle className="h-4 w-4 shrink-0 text-destructive" strokeWidth={2.2} />;
  }
  if (tone === "warning") {
    return <Clock className="h-4 w-4 shrink-0 text-[hsl(32_95%_60%)]" strokeWidth={2.2} />;
  }
  return <CheckCircle className="h-4 w-4 shrink-0 text-success" strokeWidth={2.2} />;
}

function CtaTile({
  emoji, title, desc, onClick, tone,
}: {
  emoji: string; title: string; desc: string; onClick?: () => void;
  tone: "primary" | "default" | "outline";
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "rounded-xl border text-left transition-all flex flex-col px-5 py-5 gap-2",
        tone === "primary" &&
          "border-primary/60 bg-gradient-to-br from-primary/35 via-primary/20 to-primary/10 shadow-[0_0_50px_-12px_hsl(var(--primary)/0.6)] hover:from-primary/45 hover:via-primary/25 hover:to-primary/15 hover:border-primary/80",
        tone === "default" && "border-border bg-surface/40 hover:bg-surface/60 hover:border-primary/30",
        tone === "outline" && "border-border bg-background hover:bg-surface/40 hover:border-primary/40",
        !onClick && "cursor-not-allowed opacity-70",
        onClick && "cursor-pointer",
      )}
    >
      <div className="flex items-center gap-2 font-semibold tracking-tight text-sm text-foreground">
        <span className="text-base">{emoji}</span> {title}
      </div>
      <div className="leading-snug text-[11px] text-muted-foreground">
        {desc}
      </div>
    </button>
  );
}
