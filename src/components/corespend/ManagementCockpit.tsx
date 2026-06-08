import { useCoreSpend, formatEUR, type TickerTone, type ActiveView } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";

const TONE_ORDER: Record<TickerTone, number> = { danger: 0, warning: 1, success: 2 };

export function ManagementCockpit() {
  const {
    mobilfunkStatus, cockpit: m, tickerItems,
    goDashboard, goDeadlines, goOptimizations, setActiveView,
  } = useCoreSpend();
  const live = mobilfunkStatus === "analyzed";

  const navTo = (v?: ActiveView) => { if (v) setActiveView(v); };

  const sortedTicker = tickerItems
    .map((t, i) => ({ ...t, originalIndex: i }))
    .sort((a, b) => TONE_ORDER[a.tone] - TONE_ORDER[b.tone]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            CoreSpend · Executive Layer
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mt-1 flex items-center gap-2">
            <span>💼</span> Management Cockpit
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
          label="Validierte IT-Ausgaben"
          value={live ? `${formatEUR(m.spendMonthly)}` : "—"}
          unit="/ Monat"
          sub={live ? `▲ +${m.spendYoyPercent.toFixed(1).replace(".", ",")} % vs. Vorjahr` : "Datenbasis wird geladen"}
          subTone="destructive"
          locked={!live}
        />
        <KpiCard
          label="Identifiziertes Sparpotenzial"
          value={live ? `${formatEUR(m.savingsYearly)}` : "—"}
          unit="/ Jahr"
          sub={live ? `${m.savingsPercent.toFixed(1).replace(".", ",")} % Optimierungspotenzial im bestehenden Stack` : "Wird nach Analyse berechnet"}
          subTone="success"
          valueTone="success"
          locked={!live}
          onClick={live ? goDashboard : undefined}
        />
        <KpiCard
          label="Kritische Fristen"
          value={live ? `${m.criticalDeadlines}` : "—"}
          valueTone="warning"
          sub={live ? `Handlungsbedarf innerhalb der nächsten ${m.deadlineWindowDays} Tage` : "Vertragsfristen werden überwacht"}
          locked={!live}
          onClick={live ? goDeadlines : undefined}
        />
        <KpiCard
          label="Vertragsrisiko"
          value={live ? formatEUR(m.riskExposure) : "—"}
          sub={live ? "Vertragsvolumen in Verhandlung / mit Handlungsbedarf" : "Risk-Exposure-Modell inaktiv"}
          locked={!live}
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
            {/* Impact value */}
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <div className={cn("text-3xl font-semibold tabular-nums tracking-tight leading-none truncate", live ? "text-success" : "text-muted-foreground")}>
                {live ? formatEUR(m.impactRealized) : "—"}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2">
                Realisierte Einsparungen
              </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-success/20 shrink-0" />

            {/* ROI value */}
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

      {/* Management Briefing */}
      <section
        className={cn(
          "rounded-xl border bg-background/60 backdrop-blur p-5",
          live ? "border-border" : "border-border opacity-70",
        )}
      >
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border">
          <span className="text-base">📊</span>
          <span className="text-sm font-semibold tracking-tight">Management Briefing</span>
        </div>
        <ul className="flex flex-col divide-y divide-border/60">
          {sortedTicker.map((t) => {
            const interactive = live && !!t.target;
            return (
              <li key={t.originalIndex}>
                <button
                  onClick={interactive ? () => navTo(t.target) : undefined}
                  disabled={!interactive}
                  className={cn(
                    "w-full flex items-center gap-3 py-2.5 text-left text-[13px] tabular-nums",
                    interactive && "hover:text-primary transition-colors cursor-pointer",
                    !live && "text-muted-foreground/70",
                  )}
                >
                  <BriefingIcon tone={t.tone} />
                  <span className={cn("text-foreground/90 leading-snug", !live && "text-muted-foreground/70")}>
                    {t.text}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* CTA Strip */}
      <section className="grid gap-4 md:grid-cols-3">
        <CtaTile
          emoji="📊"
          title="Core Dashboard öffnen"
          desc="Detail-Analyse aller 5 IT-Bereiche, KPIs und Sourcing-Aktionen."
          onClick={goDashboard}
          tone="default"
        />
        <CtaTile
          emoji="⚡"
          title="Optimierungsvorschläge prüfen"
          desc="Direkter Zugriff auf Konsolidierungen, No-Usage-Warnungen und Einsparpotenziale."
          onClick={live ? goDashboard : undefined}
          tone="primary"
        />
        <CtaTile
          emoji="📄"
          title="Management Report generieren"
          desc="Sofortiger, CFO-ready PDF-Export des aktuellen IT-Finanzstatus für das Management."
          tone="default"
        />
      </section>
    </div>
  );
}

/* ---------- bits ---------- */

function KpiCard({
  label, value, unit, sub, subTone, valueTone, locked, onClick,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  subTone?: "success" | "destructive" | "muted";
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
      {sub && (
        <span
          className={cn(
            "mt-2 text-[11px] leading-snug",
            subTone === "success" && "text-success",
            subTone === "destructive" && "text-destructive/90",
            (!subTone || subTone === "muted") && "text-muted-foreground",
          )}
        >
          {sub}
        </span>
      )}
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
  tone: "primary" | "default";
}) {
  const isPrimary = tone === "primary";
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "rounded-xl border px-5 py-5 text-left transition-all flex flex-col gap-2",
        isPrimary
          ? "border-primary/50 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 shadow-[0_0_30px_-10px_hsl(var(--primary)/0.5)] hover:from-primary/25 hover:to-primary/10 hover:border-primary/70"
          : "border-border bg-surface/40 hover:bg-surface/60 hover:border-primary/30",
        !onClick && "cursor-not-allowed opacity-70",
      )}
    >
      <div className={cn("flex items-center gap-2 text-sm font-semibold", isPrimary && "text-primary-foreground/95")}>
        <span className="text-base">{emoji}</span> {title}
      </div>
      <div className={cn("text-[11px] leading-snug", isPrimary ? "text-foreground/75" : "text-muted-foreground")}>{desc}</div>
    </button>
  );
}
