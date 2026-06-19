import { Link } from "@tanstack/react-router";
import { useCoreSpend, formatEUR, type TickerTone, type ActiveView, type CockpitView, type TickerItem, type SpendAreaItem } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";
import { AlertCircle, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { NEGOTIATIONS, STATUS_META } from "@/lib/negotiations";


const TONE_ORDER: Record<TickerTone, number> = { danger: 0, warning: 1, success: 2 };

export function ManagementCockpit() {
  const {
    mobilfunkStatus, cockpit: m, tickerItems, timeMode, spendBreakdown,
    goDeadlines, goOptimizations, goSpend, goRisk, setActiveView,
  } = useCoreSpend();
  const live = mobilfunkStatus === "analyzed";
  const yearly = timeMode === "yearly";
  const spendValue = yearly ? m.spendMonthly * 12 : m.spendMonthly;
  const savingsValue = yearly ? m.savingsYearly : Math.floor(m.savingsYearly / 12);
  const unit = yearly ? "/ Jahr" : "/ Monat";
  const spendLabel = yearly ? "Validierte Jahresausgaben" : "Validierte Monatsausgaben";

  const navTo = (v?: ActiveView) => { if (v) setActiveView(v); };

  const sortedTicker = tickerItems
    .map((t, i) => ({ ...t, originalIndex: i }))
    .sort((a, b) => TONE_ORDER[a.tone] - TONE_ORDER[b.tone]);

  return (
    <div className="space-y-3">
      {/* Header */}
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            CoreSpend · Executive Layer
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mt-0.5 flex items-center gap-2">
            <span>💼</span> Core Cockpit
          </h1>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className={cn("h-2 w-2 rounded-full animate-pulse", live ? "bg-success" : "bg-muted-foreground/40")} />
          {live ? "Live · Datenbasis aktiv" : "Demo · Daten werden nach Analyse freigeschaltet"}
        </div>
      </header>

      {/* Top KPIs · unchanged */}
      <section className="grid gap-3 lg:grid-cols-4">
        <KpiCard
          label={spendLabel}
          value={live ? `${formatEUR(spendValue)}` : "—"}
          unit={unit}
          sub={live ? `▲ +${m.spendYoyPercent.toFixed(1).replace(".", ",")} % vs. Vorjahr` : "Datenbasis wird geladen"}
          subTone="destructive"
          locked={!live}
          onClick={live ? goSpend : undefined}
          footer={live ? `Impact ${formatEUR(m.impactRealized)} · ROI ${m.roi.toFixed(1).replace(".", ",")}x` : undefined}
        />
        <KpiCard
          label="Identifiziertes Sparpotenzial"
          value={live ? `${formatEUR(savingsValue)}` : "—"}
          unit={unit}
          sub={live ? `${m.savingsPercent.toFixed(1).replace(".", ",")} % Optimierungspotenzial` : "Wird berechnet"}
          subTone="success"
          valueTone="success"
          locked={!live}
          onClick={live ? goOptimizations : undefined}
        />
        <KpiCard
          label="Kritische Fristen"
          value={live ? `${m.criticalDeadlines}` : "—"}
          valueTone="warning"
          sub={live ? `Handlungsbedarf in ${m.deadlineWindowDays} Tagen` : "Vertragsfristen werden überwacht"}
          locked={!live}
          onClick={live ? goDeadlines : undefined}
        />
        <KpiCard
          label="Vertragsrisiko"
          value={live ? formatEUR(m.riskExposure) : "—"}
          sub={live ? "Volumen in Verhandlung / mit Handlungsbedarf" : "Risk-Exposure inaktiv"}
          locked={!live}
          onClick={live ? goRisk : undefined}
        />
      </section>

      {/* Slim row · halbe Höhe der KPIs */}
      <section className="grid gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SpendShareBar areas={spendBreakdown} live={live} onOpen={live ? goSpend : undefined} />
        </div>
        <NegotiationsButton live={live} />
      </section>

      {/* Management Briefing */}
      <section
        className={cn(
          "rounded-xl border bg-background/60 backdrop-blur p-3",
          live ? "border-border" : "border-border opacity-70",
        )}
      >
        <div className="flex items-center gap-2 pb-2 mb-2 border-b border-border">
          <span className="text-sm">📊</span>
          <span className="text-xs font-semibold tracking-tight">Management Briefing</span>
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
                    "w-full flex items-center gap-2 py-1.5 text-left text-[11px] tabular-nums",
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

      {/* CTA Strip · 2 actions */}
      <section className="grid gap-3 md:grid-cols-2">
        <CtaTile
          emoji="⚡"
          title="Optimierungsvorschläge prüfen"
          desc="Direkter Zugriff auf Konsolidierungen, No-Usage-Warnungen und Einsparpotenziale."
          onClick={live ? goOptimizations : undefined}
          tone="primary"
        />
        <CtaTile
          emoji="📄"
          title="C-Level Report generieren"
          desc="Sofortiger, CFO-ready PDF-Export des aktuellen IT-Finanzstatus für das Management."
          onClick={live ? () => generateCLevelReport({ cockpit: m, ticker: sortedTicker, yearly }) : undefined}
          tone="success"
        />
      </section>
    </div>
  );
}

/* ---------- bits ---------- */

function KpiCard({
  label, value, unit, sub, subTone, valueTone, locked, onClick, footer,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  subTone?: "success" | "destructive" | "muted";
  valueTone?: "success" | "warning" | "destructive";
  locked?: boolean;
  onClick?: () => void;
  footer?: string;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-surface/40 px-3 py-3 flex flex-col leading-tight text-left transition-all min-h-[110px]",
        "border-border",
        locked && "opacity-60",
        onClick && "hover:border-primary/40 hover:bg-primary/5 cursor-pointer",
      )}
    >
      <span className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground font-medium">{label}</span>
      <div className="mt-2 flex items-baseline gap-1">
        <span
          className={cn(
            "text-xl font-semibold tabular-nums tracking-tight",
            valueTone === "success" && "text-success",
            valueTone === "warning" && "text-[hsl(32_95%_60%)]",
            valueTone === "destructive" && "text-destructive",
          )}
        >
          {value}
        </span>
        {unit && <span className="text-[10px] text-muted-foreground">{unit}</span>}
      </div>
      {sub && (
        <span
          className={cn(
            "mt-1.5 text-[10px] leading-snug",
            subTone === "success" && "text-success",
            subTone === "destructive" && "text-destructive/90",
            (!subTone || subTone === "muted") && "text-muted-foreground",
          )}
        >
          {sub}
        </span>
      )}
      {footer && (
        <span className="mt-auto pt-1.5 text-[9px] text-muted-foreground border-t border-border/40 leading-tight">
          {footer}
        </span>
      )}
    </Tag>
  );
}

function BriefingIcon({ tone }: { tone: TickerTone }) {
  if (tone === "danger") {
    return <AlertCircle className="h-3.5 w-3.5 shrink-0 text-destructive" strokeWidth={2.2} />;
  }
  if (tone === "warning") {
    return <Clock className="h-3.5 w-3.5 shrink-0 text-[hsl(32_95%_60%)]" strokeWidth={2.2} />;
  }
  return <CheckCircle className="h-3.5 w-3.5 shrink-0 text-success" strokeWidth={2.2} />;
}

function CtaTile({
  emoji, title, desc, onClick, tone,
}: {
  emoji: string; title: string; desc: string; onClick?: () => void;
  tone: "primary" | "success" | "default";
}) {
  const isPrimary = tone === "primary";
  const isSuccess = tone === "success";
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "rounded-xl border text-left transition-all flex flex-col px-4 py-3 gap-1.5",
        isPrimary
          ? "border-primary/60 bg-gradient-to-br from-primary/35 via-primary/20 to-primary/10 shadow-[0_0_50px_-12px_hsl(var(--primary)/0.6)] hover:from-primary/45 hover:via-primary/25 hover:to-primary/15 hover:border-primary/80"
          : isSuccess
            ? "border-success/60 bg-gradient-to-br from-success/35 via-success/20 to-success/10 shadow-[0_0_50px_-12px_hsl(var(--success)/0.6)] hover:from-success/45 hover:via-success/25 hover:to-success/15 hover:border-success/80"
            : "border-border bg-surface/40 hover:bg-surface/60 hover:border-primary/30",
        !onClick && "cursor-not-allowed opacity-70",
      )}
    >
      <div className={cn(
        "flex items-center gap-2 font-semibold tracking-tight text-sm",
        isPrimary && "text-foreground",
        isSuccess && "text-success",
      )}>
        <span className="text-base">{emoji}</span> {title}
      </div>
      <div className={cn(
        "leading-snug text-[11px]",
        isPrimary ? "text-foreground/80" : isSuccess ? "text-success/80" : "text-muted-foreground",
      )}>
        {desc}
      </div>
    </button>
  );
}

function generateCLevelReport({
  cockpit, ticker, yearly,
}: {
  cockpit: CockpitView;
  ticker: (TickerItem & { originalIndex: number })[];
  yearly: boolean;
}) {
  const unit = yearly ? "Jahr" : "Monat";
  const spendValue = yearly ? cockpit.spendMonthly * 12 : cockpit.spendMonthly;
  const savingsValue = yearly ? cockpit.savingsYearly : Math.floor(cockpit.savingsYearly / 12);
  const today = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
  const toneLabel: Record<TickerTone, string> = { danger: "Kritisch", warning: "Beobachten", success: "Erfolg" };

  const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"/>
<title>CoreSpend · C-Level Report · ${today}</title>
<style>
  *{box-sizing:border-box} body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#111;margin:0;padding:48px;line-height:1.5}
  h1{font-size:28px;margin:0 0 4px;letter-spacing:-0.02em}
  .kicker{font-size:11px;text-transform:uppercase;letter-spacing:.2em;color:#666}
  .meta{color:#666;font-size:13px;margin-bottom:32px}
  h2{font-size:14px;text-transform:uppercase;letter-spacing:.15em;color:#444;border-bottom:1px solid #ddd;padding-bottom:6px;margin:32px 0 16px}
  .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
  .kpi{border:1px solid #e5e5e5;border-radius:8px;padding:16px}
  .kpi .l{font-size:10px;text-transform:uppercase;letter-spacing:.15em;color:#666;margin-bottom:8px}
  .kpi .v{font-size:24px;font-weight:600;letter-spacing:-0.01em}
  .kpi .s{font-size:12px;color:#666;margin-top:6px}
  ul{padding:0;list-style:none;margin:0}
  li{border-bottom:1px solid #eee;padding:12px 0;font-size:13px;display:flex;gap:12px}
  .tag{font-size:10px;text-transform:uppercase;letter-spacing:.1em;padding:2px 8px;border-radius:99px;flex-shrink:0;height:fit-content}
  .danger{background:#fee;color:#a00} .warning{background:#fef3c7;color:#92400e} .success{background:#dcfce7;color:#166534}
  .footer{margin-top:48px;padding-top:16px;border-top:1px solid #ddd;font-size:11px;color:#999;text-align:center}
  @media print{body{padding:24px}}
</style></head><body>
<div class="kicker">CoreSpend · Executive Briefing</div>
<h1>C-Level Report</h1>
<div class="meta">Stand: ${today} · Zeitraum: pro ${unit}</div>

<h2>Kennzahlen</h2>
<div class="grid">
  <div class="kpi"><div class="l">Validierte IT-Ausgaben</div><div class="v">${formatEUR(spendValue)}</div><div class="s">pro ${unit} · ▲ ${cockpit.spendYoyPercent.toFixed(1).replace(".", ",")} % vs. Vorjahr</div></div>
  <div class="kpi"><div class="l">Identifiziertes Sparpotenzial</div><div class="v">${formatEUR(savingsValue)}</div><div class="s">pro ${unit} · ${cockpit.savingsPercent.toFixed(1).replace(".", ",")} % des Stacks</div></div>
  <div class="kpi"><div class="l">Kritische Fristen</div><div class="v">${cockpit.criticalDeadlines}</div><div class="s">in den nächsten ${cockpit.deadlineWindowDays} Tagen</div></div>
  <div class="kpi"><div class="l">Vertragsrisiko</div><div class="v">${formatEUR(cockpit.riskExposure)}</div><div class="s">Volumen mit Handlungsbedarf</div></div>
  <div class="kpi"><div class="l">Realisierte Einsparungen</div><div class="v">${formatEUR(cockpit.impactRealized)}</div><div class="s">CoreSpend Impact bis dato</div></div>
  <div class="kpi"><div class="l">ROI</div><div class="v">${cockpit.roi.toFixed(1).replace(".", ",")}x</div><div class="s">je investiertem Euro</div></div>
</div>

<h2>Management Briefing</h2>
<ul>
${ticker.map((t) => `<li><span class="tag ${t.tone}">${toneLabel[t.tone]}</span><span>${t.text}</span></li>`).join("")}
</ul>

<div class="footer">CoreSpend · Vertraulich · Nur für den internen Gebrauch</div>
<script>window.onload=()=>{setTimeout(()=>window.print(),300)}</script>
</body></html>`;

  const w = window.open("", "_blank");
  if (!w) return;
  w.document.open(); w.document.write(html); w.document.close();
}

/* ---------- Spend Share Bar (mini · same size as KPI card) ---------- */

const AREA_COLORS: Record<SpendAreaItem["key"], string> = {
  telco: "#22d3ee",      // cyan
  office: "#f97316",     // orange
  saas: "#22c55e",       // CoreSpend grün
  cloud: "#a855f7",      // lila
  hardware: "#94a3b8",   // slate
};

function SpendShareBar({
  areas, live, onOpen,
}: { areas: SpendAreaItem[]; live: boolean; onOpen?: () => void }) {
  const total = areas.reduce((s, a) => s + (a.monthly || 0), 0) || 1;
  const segments = areas.map((a) => ({
    key: a.key,
    label: a.label,
    monthly: a.monthly,
    pct: (a.monthly / total) * 100,
    color: AREA_COLORS[a.key],
  }));

  return (
    <div
      onClick={onOpen}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onKeyDown={(e) => { if (onOpen && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onOpen(); } }}
      className={cn(
        "rounded-xl border border-border bg-surface/40 px-3 py-2 flex items-center gap-3 h-[52px]",
        onOpen && "cursor-pointer hover:border-primary/40 hover:bg-surface/60 transition-colors",
        !live && "opacity-70",
      )}
    >
      <span className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground font-medium shrink-0">
        Kostenaufteilung
      </span>

      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="h-2 w-full rounded-full overflow-hidden flex border border-border bg-background">
          {segments.map((s) => (
            <div
              key={s.key}
              title={`${s.label} · ${s.pct.toFixed(1).replace(".", ",")} % · ${formatEUR(s.monthly)} / Monat`}
              className="h-full transition-opacity hover:opacity-80"
              style={{ width: `${s.pct}%`, background: s.color }}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          {segments.map((s) => (
            <div key={s.key} className="flex items-center gap-1 min-w-0">
              <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: s.color }} />
              <span className="text-[9px] text-foreground/80 truncate">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {onOpen && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
    </div>
  );
}

/* ---------- Status Verhandlungen Button (slim · half height) ---------- */

function NegotiationsButton({ live }: { live: boolean }) {
  return (
    <Link
      to="/verhandlungen"
      className={cn(
        "rounded-xl border border-border bg-surface/40 px-3 py-2 h-[52px] flex items-center justify-between gap-2 transition-colors",
        live ? "hover:border-primary/40 hover:bg-surface/60 cursor-pointer" : "pointer-events-none opacity-70",
      )}
    >
      <div className="flex flex-col leading-tight min-w-0">
        <span className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
          Verhandlungs-Portfolio
        </span>
        <span className="text-sm font-semibold tracking-tight text-foreground/90 truncate">
          Status Verhandlungen
        </span>
      </div>
      <ArrowRight className="h-4 w-4 text-primary shrink-0" />
    </Link>
  );
}

