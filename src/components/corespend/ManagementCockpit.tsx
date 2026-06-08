import { useCoreSpend, formatEUR, type TickerTone } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";

export function ManagementCockpit() {
  const {
    mobilfunkStatus, cockpitMetrics: m, tickerItems,
    goDashboard, goMobilfunk,
  } = useCoreSpend();
  const live = mobilfunkStatus === "analyzed";

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            CoreSpend · Executive Layer
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mt-1 flex items-center gap-2">
            <span>💼</span> Management Cockpit
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
            Strategische Steuerung für CFO &amp; CIO. Kernkennzahlen, kritische Fristen und realisierter Impact in einer Ansicht.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className={cn("h-2 w-2 rounded-full animate-pulse", live ? "bg-success" : "bg-muted-foreground/40")} />
          {live ? "Live · Datenbasis aktiv" : "Demo · Daten werden nach Analyse freigeschaltet"}
        </div>
      </header>

      {/* KPI Row */}
      <section className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_1fr_1.4fr]">
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
        />
        <KpiCard
          label="Vertragsrisiko (Risk Exposure)"
          value={live ? formatEUR(m.riskExposure) : "—"}
          sub={live ? "Vertragsvolumen in Verhandlung / mit Handlungsbedarf" : "Risk-Exposure-Modell inaktiv"}
          locked={!live}
        />

        {/* Highlight Card */}
        <div
          className={cn(
            "rounded-xl border p-5 flex flex-col justify-between gap-4",
            live
              ? "border-success/40 bg-gradient-to-br from-success/15 via-success/5 to-primary/10 shadow-[0_0_40px_-15px_hsl(var(--success)/0.4)]"
              : "border-border bg-surface/40 opacity-70",
          )}
        >
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-success/90 flex items-center gap-1.5">
              <span>✦</span> CoreSpend Impact
            </div>
            <div className={cn("mt-2 text-3xl font-semibold tabular-nums tracking-tight leading-none", live ? "text-success" : "text-muted-foreground")}>
              {live ? formatEUR(m.impactRealized) : "—"}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1.5">
              Bisher realisierte Einsparungen seit Beginn der Zusammenarbeit
            </div>
          </div>
          <div className="border-t border-success/20 pt-3 flex items-baseline gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">ROI</span>
              <span className={cn("text-xl font-semibold tabular-nums", live ? "text-foreground" : "text-muted-foreground")}>
                {live ? `${m.roi.toFixed(1).replace(".", ",")}x` : "—"}
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground leading-snug">
              Jeder investierte Euro<br />spart aktuell {live ? `${m.roi.toFixed(2).replace(".", ",")} €` : "—"}
            </span>
          </div>
        </div>
      </section>

      {/* Bloomberg-style Ticker */}
      <section
        className={cn(
          "rounded-xl border bg-background/60 backdrop-blur px-4 py-3 flex items-center gap-4 overflow-hidden",
          live ? "border-border" : "border-border opacity-70",
        )}
      >
        <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-border">
          <span className="text-base">📊</span>
          <span className="text-sm font-semibold tracking-tight">CEO/CFO Briefing:</span>
        </div>
        <div className="flex-1 flex items-center gap-6 overflow-x-auto no-scrollbar">
          {tickerItems.map((t, i) => {
            const isMobilfunkLink = i === 0;
            const interactive = live && isMobilfunkLink;
            return (
              <button
                key={i}
                onClick={interactive ? goMobilfunk : undefined}
                disabled={!interactive}
                className={cn(
                  "flex items-center gap-2 text-[12px] whitespace-nowrap tabular-nums",
                  interactive && "hover:text-primary transition-colors cursor-pointer",
                  !live && "text-muted-foreground/70",
                )}
              >
                <TickerDot tone={t.tone} />
                <span className={cn("text-foreground/85", !live && "text-muted-foreground/70")}>{t.text}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* CTA Strip */}
      <section className="grid gap-3 md:grid-cols-3">
        <CtaTile
          emoji="📊"
          title="Core Dashboard öffnen"
          desc="Detail-Analyse aller 5 IT-Bereiche, KPIs und Procure-Actions."
          onClick={goDashboard}
          tone="primary"
        />
        <CtaTile
          emoji="📱"
          title="Mobilfunk-Cockpit"
          desc={live ? "Live-Auswertung · Verhandlungs-Wizard · CFO-Report." : "Wartet auf Daten-Upload."}
          onClick={goMobilfunk}
          tone={live ? "success" : "muted"}
        />
        <CtaTile
          emoji="🔥"
          title="Verhandlungsexperten aktivieren"
          desc="Senior-Negotiator übernimmt das Verhandlungsmandat — Erfolgshonorar."
          tone="success"
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
        "rounded-xl border bg-surface/40 px-4 py-4 flex flex-col leading-tight text-left transition-all",
        "border-border",
        locked && "opacity-60",
        onClick && "hover:border-primary/40 hover:bg-primary/5 cursor-pointer",
      )}
    >
      <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{label}</span>
      <div className="mt-2 flex items-baseline gap-1.5">
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
            "mt-1.5 text-[11px] leading-snug",
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

function TickerDot({ tone }: { tone: TickerTone }) {
  return (
    <span
      className={cn(
        "h-2 w-2 rounded-full shrink-0",
        tone === "success" && "bg-success shadow-[0_0_8px_hsl(var(--success))]",
        tone === "warning" && "bg-[hsl(32_95%_60%)] shadow-[0_0_8px_hsl(32_95%_60%)]",
        tone === "danger" && "bg-destructive shadow-[0_0_8px_hsl(var(--destructive))] animate-pulse",
      )}
    />
  );
}

function CtaTile({
  emoji, title, desc, onClick, tone,
}: {
  emoji: string; title: string; desc: string; onClick?: () => void;
  tone: "primary" | "success" | "muted";
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "rounded-xl border px-4 py-4 text-left transition-all flex flex-col gap-1.5",
        tone === "primary" && "border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50",
        tone === "success" && "border-success/30 bg-success/5 hover:bg-success/10 hover:border-success/50",
        tone === "muted" && "border-border bg-surface/40 opacity-70",
        !onClick && "cursor-not-allowed",
      )}
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="text-base">{emoji}</span> {title}
      </div>
      <div className="text-[11px] text-muted-foreground leading-snug">{desc}</div>
    </button>
  );
}

