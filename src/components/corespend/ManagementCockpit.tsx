import { useState } from "react";
import { useCoreSpend, formatEUR, type TickerTone, type ActiveView, type CockpitView, type TickerItem } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";
import { AlertCircle, Clock, CheckCircle, ChevronDown, X, Printer } from "lucide-react";

const TONE_ORDER: Record<TickerTone, number> = { danger: 0, warning: 1, success: 2 };

const SPEND_DIMENSIONS = [
  { key: "telco", label: "Telekommunikation", color: "hsl(210 90% 55%)" },
  { key: "office", label: "Office", color: "hsl(265 75% 60%)" },
  { key: "saas", label: "SaaS / AI", color: "hsl(180 65% 50%)" },
  { key: "cloud", label: "Cloud", color: "hsl(32 95% 55%)" },
  { key: "hardware", label: "Hardware", color: "hsl(140 60% 50%)" },
] as const;

const DIMENSION_VALUE = 3200;
const DIMENSION_BONUS = 350;

const SOURCING_PHASES = [
  { key: "analyse", label: "In Analyse" },
  { key: "strategie", label: "Strategie bereit" },
  { key: "verhandlung", label: "In Verhandlung" },
  { key: "optimiert", label: "Erfolgreich optimiert" },
] as const;

export function ManagementCockpit() {
  const {
    mobilfunkStatus, cockpit: m, tickerItems, tickerOverrides, updateTickerItem, resetTickerItem, timeMode,
    goDeadlines, goOptimizations, goSpend, goRisk, goMobilfunk, setActiveView,
  } = useCoreSpend();
  const live = mobilfunkStatus === "analyzed";
  const yearly = timeMode === "yearly";
  const spendValue = yearly ? m.spendMonthly * 12 : m.spendMonthly;
  const savingsValue = yearly ? m.savingsYearly : Math.floor(m.savingsYearly / 12);
  const unit = yearly ? "/ Jahr" : "/ Monat";

  const [adminOpen, setAdminOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const navTo = (v?: ActiveView) => { if (v) setActiveView(v); };

  const sortedTicker = tickerItems
    .map((t, i) => ({ ...t, originalIndex: i }))
    .sort((a, b) => TONE_ORDER[a.tone] - TONE_ORDER[b.tone]);

  // Sourcing-Status: active phase based on live state
  const activePhase = live ? 2 : 0; // "In Verhandlung" wenn live

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
          <p className="text-sm text-muted-foreground mt-2 max-w-3xl leading-relaxed">
            Die zentrale Governance-Schicht für die vollautomatische Analyse aller Verträge, lückenloses Compliance-Monitoring und die datenbasierte Steuerung Ihres gesamten IT- und Tech-Spends.
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

      {/* Visual Governance: Spend Dimensions + Sourcing Status */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className={cn("rounded-xl border bg-surface/40 px-5 py-4", live ? "border-border" : "border-border opacity-70")}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
              Spend nach Dimensionen
            </div>
            <div className="text-[10px] text-muted-foreground tabular-nums">
              Data-Bonus +{formatEUR(DIMENSION_BONUS)} je Bereich
            </div>
          </div>
          <div className="flex h-3 w-full rounded-full overflow-hidden">
            {SPEND_DIMENSIONS.map((d) => (
              <div
                key={d.key}
                className="h-full transition-opacity hover:opacity-80"
                style={{ flex: 1, backgroundColor: d.color, opacity: live ? 0.85 : 0.35 }}
                title={`${d.label} · ${formatEUR(DIMENSION_VALUE)}`}
              />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {SPEND_DIMENSIONS.map((d) => (
              <div key={d.key} className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="h-2 w-2 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-[10px] text-muted-foreground truncate">{d.label}</span>
                </div>
                <span className="text-[11px] font-medium tabular-nums text-foreground/90">{formatEUR(DIMENSION_VALUE)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={cn("rounded-xl border bg-surface/40 px-5 py-4", live ? "border-border" : "border-border opacity-70")}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
              Sourcing-Status
            </div>
            <div className="text-[10px] text-muted-foreground">
              {live ? SOURCING_PHASES[activePhase].label : "Wartet auf Analyse"}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {SOURCING_PHASES.map((p, i) => {
              const done = live && i < activePhase;
              const current = live && i === activePhase;
              return (
                <div key={p.key} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                    <div className={cn(
                      "h-6 w-6 rounded-full grid place-items-center text-[10px] font-semibold border-2 shrink-0",
                      done && "bg-success border-success text-background",
                      current && "border-primary bg-primary/20 text-primary animate-pulse",
                      !done && !current && "border-border bg-background/40 text-muted-foreground/60",
                    )}>
                      {done ? "✓" : i + 1}
                    </div>
                    <span className={cn(
                      "text-[10px] text-center leading-tight truncate w-full",
                      current ? "text-primary font-medium" : "text-muted-foreground",
                    )}>
                      {p.label}
                    </span>
                  </div>
                  {i < SOURCING_PHASES.length - 1 && (
                    <div className={cn("h-px flex-1 mx-1 -mt-4", done ? "bg-success/60" : "bg-border")} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Management Briefing (executive) */}
      <section
        className={cn(
          "rounded-xl border bg-background/60 backdrop-blur p-6",
          live ? "border-border" : "border-border opacity-70",
        )}
      >
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border">
          <span className="text-lg">📊</span>
          <span className="text-base font-semibold tracking-tight">Management Briefing</span>
          <button
            onClick={() => setAdminOpen((o) => !o)}
            className="ml-auto inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
            Admin-Konsole
            <ChevronDown className={cn("h-3 w-3 transition-transform", adminOpen && "rotate-180")} />
          </button>
        </div>

        {adminOpen && (
          <div className="mb-4 rounded-lg border border-border bg-background/40 p-3 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Briefing-Texte und Status-Farben live editieren
            </div>
            {tickerItems.map((t, i) => {
              const overridden = !!tickerOverrides[i];
              return (
                <div key={i} className="flex items-start gap-2">
                  <select
                    value={t.tone}
                    onChange={(e) => updateTickerItem(i, { tone: e.target.value as TickerTone })}
                    className="bg-background/60 border border-border rounded px-1.5 py-1 text-[11px] text-foreground focus:outline-none"
                  >
                    <option value="danger">danger</option>
                    <option value="warning">warning</option>
                    <option value="success">success</option>
                  </select>
                  <textarea
                    value={t.text}
                    onChange={(e) => updateTickerItem(i, { text: e.target.value })}
                    rows={2}
                    className="flex-1 bg-background/60 border border-border rounded px-2 py-1 text-[11px] text-foreground focus:outline-none resize-y"
                  />
                  {overridden && (
                    <button
                      onClick={() => resetTickerItem(i)}
                      className="text-[10px] text-muted-foreground hover:text-destructive shrink-0 mt-1"
                      title="Auf Standardtext zurücksetzen"
                    >
                      ↺
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <ul className="flex flex-col divide-y divide-border/60">
          {sortedTicker.map((t) => {
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
                  <BriefingIcon tone={t.tone} />
                  <span className={cn("text-foreground/90 flex-1", !live && "text-muted-foreground/70")}>
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
          desc="Verifizierte Sourcing-Experten übernehmen direkt das Verhandlungs-Mandat auf Basis Ihrer Datenlage."
          onClick={live ? goMobilfunk : undefined}
          tone="primary"
        />
        <CtaTile
          emoji="⚡"
          title="Optimierungsvorschläge prüfen"
          desc="Direkter Zugriff auf Konsolidierungen, No-Usage-Warnungen und Einsparpotenziale."
          onClick={live ? goOptimizations : undefined}
          tone="success"
        />
        <CtaTile
          emoji="📄"
          title="CFO-Ready Report generieren"
          desc="Sofortiger, CFO-ready Status-Report des aktuellen IT-Finanzstatus für das Management."
          onClick={() => setReportOpen(true)}
          tone="outline"
        />
      </section>

      {reportOpen && (
        <CfoReportModal
          cockpit={m}
          ticker={sortedTicker}
          yearly={yearly}
          onClose={() => setReportOpen(false)}
        />
      )}
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
    return <AlertCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" strokeWidth={2.2} />;
  }
  if (tone === "warning") {
    return <Clock className="h-5 w-5 shrink-0 text-[hsl(32_95%_60%)] mt-0.5" strokeWidth={2.2} />;
  }
  return <CheckCircle className="h-5 w-5 shrink-0 text-success mt-0.5" strokeWidth={2.2} />;
}

function CtaTile({
  emoji, title, desc, onClick, tone,
}: {
  emoji: string; title: string; desc: string; onClick?: () => void;
  tone: "primary" | "success" | "outline";
}) {
  const isPrimary = tone === "primary";
  const isSuccess = tone === "success";
  const isOutline = tone === "outline";
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "rounded-xl border text-left transition-all flex flex-col px-5 py-5 gap-2",
        isPrimary &&
          "border-primary/60 bg-gradient-to-br from-primary/35 via-primary/20 to-primary/10 shadow-[0_0_50px_-12px_hsl(var(--primary)/0.6)] hover:from-primary/45 hover:via-primary/25 hover:to-primary/15 hover:border-primary/80",
        isSuccess &&
          "border-success/60 bg-gradient-to-br from-success/35 via-success/20 to-success/10 shadow-[0_0_50px_-12px_hsl(var(--success)/0.6)] hover:from-success/45 hover:via-success/25 hover:to-success/15 hover:border-success/80",
        isOutline &&
          "border-border bg-background/60 hover:bg-background/80 hover:border-foreground/40",
        !onClick && "cursor-not-allowed opacity-70",
      )}
    >
      <div className={cn(
        "flex items-center gap-2 font-semibold tracking-tight text-sm",
        isPrimary && "text-foreground",
        isSuccess && "text-success",
        isOutline && "text-foreground",
      )}>
        <span className="text-base">{emoji}</span> {title}
      </div>
      <div className={cn(
        "leading-snug text-[11px]",
        isPrimary && "text-foreground/80",
        isSuccess && "text-success/80",
        isOutline && "text-muted-foreground",
      )}>
        {desc}
      </div>
    </button>
  );
}

/* ---------- CFO Report Modal ---------- */

function CfoReportModal({
  cockpit, ticker, yearly, onClose,
}: {
  cockpit: CockpitView;
  ticker: (TickerItem & { originalIndex: number })[];
  yearly: boolean;
  onClose: () => void;
}) {
  const unit = yearly ? "Jahr" : "Monat";
  const spendValue = yearly ? cockpit.spendMonthly * 12 : cockpit.spendMonthly;
  const savingsValue = yearly ? cockpit.savingsYearly : Math.floor(cockpit.savingsYearly / 12);
  const today = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm grid place-items-center p-4 print:bg-transparent print:p-0 print:static"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-background shadow-2xl print:max-h-none print:shadow-none print:border-0 print:rounded-none print:max-w-none"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-surface/60 text-muted-foreground hover:text-foreground transition print:hidden"
          aria-label="Schließen"
        >
          <X className="h-4 w-4" />
        </button>

        <div id="cfo-report-print" className="px-8 py-8">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            CoreSpend · Executive Briefing
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mt-1">
            Executive Status Report — CoreSpend
          </h2>
          <div className="text-xs text-muted-foreground mt-1">
            Stand: {today} · Zeitraum: pro {unit} · Vertraulich
          </div>

          <h3 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mt-6 mb-3 border-b border-border pb-2">
            Haupt-KPIs
          </h3>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-border">
              <ReportRow label="Total Tech Spend" value={`${formatEUR(spendValue)} / ${unit}`} sub={`▲ ${cockpit.spendYoyPercent.toFixed(1).replace(".", ",")} % vs. Vorjahr`} />
              <ReportRow label="Realisierbares Potenzial" value={`${formatEUR(savingsValue)} / ${unit}`} sub={`${cockpit.savingsPercent.toFixed(1).replace(".", ",")} % des Stacks`} tone="success" />
              <ReportRow label="Fristen-Monitoring" value={`${cockpit.criticalDeadlines} kritisch`} sub={`Innerhalb der nächsten ${cockpit.deadlineWindowDays} Tage`} />
              <ReportRow label="Financial Exposure" value={formatEUR(cockpit.riskExposure)} sub="Volumen mit Handlungsbedarf" />
            </tbody>
          </table>

          <h3 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mt-8 mb-3 border-b border-border pb-2">
            Top-Einsparpotenziale
          </h3>
          <ul className="space-y-2 text-sm">
            {ticker.filter((t) => t.tone !== "warning").map((t) => (
              <li key={t.originalIndex} className="flex items-start gap-2">
                <span className={cn(
                  "mt-1 h-1.5 w-1.5 rounded-full shrink-0",
                  t.tone === "danger" && "bg-destructive",
                  t.tone === "success" && "bg-success",
                )} />
                <span className="text-foreground/90">{t.text}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mt-8 mb-3 border-b border-border pb-2">
            Risk Exposure Audit
          </h3>
          <div className="text-sm text-foreground/90 leading-relaxed">
            Vertragsvolumen mit aktivem Handlungsbedarf: <strong>{formatEUR(cockpit.riskExposure)}</strong>.
            Realisierte Einsparungen bis dato: <strong>{formatEUR(cockpit.impactRealized)}</strong> bei einem
            ROI von <strong>{cockpit.roi.toFixed(1).replace(".", ",")}x</strong>.
          </div>
          {ticker.filter((t) => t.tone === "warning").map((t) => (
            <div key={t.originalIndex} className="mt-3 text-sm flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[hsl(32_95%_60%)] shrink-0" />
              <span className="text-foreground/90">{t.text}</span>
            </div>
          ))}

          <div className="mt-10 pt-4 border-t border-border text-[10px] text-muted-foreground text-center">
            CoreSpend · Vertraulich · Nur für den internen Gebrauch
          </div>
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-2 px-8 py-4 border-t border-border bg-background/95 backdrop-blur print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-surface/60 transition"
          >
            Schließen
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground font-medium hover:brightness-110 transition inline-flex items-center gap-2"
          >
            <Printer className="h-4 w-4" /> Bericht drucken
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportRow({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "success" }) {
  return (
    <tr>
      <td className="py-2.5 pr-4 text-muted-foreground text-[12px] uppercase tracking-wider w-1/2">{label}</td>
      <td className="py-2.5 text-right">
        <div className={cn("font-semibold tabular-nums", tone === "success" && "text-success")}>{value}</div>
        {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
      </td>
    </tr>
  );
}
