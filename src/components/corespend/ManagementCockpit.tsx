import { useCoreSpend, formatEUR, DEFAULT_RENEWALS, type TickerTone, type ActiveView, type CockpitView, type TickerItem, type RenewalStatus } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";
import { AlertCircle, Clock, CheckCircle, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";


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
          label={spendLabel}
          value={live ? `${formatEUR(spendValue)}` : "—"}
          unit={unit}
          sub={live ? `▲ +${m.spendYoyPercent.toFixed(1).replace(".", ",")} % vs. Vorjahr` : "Datenbasis wird geladen"}
          subTone="destructive"
          locked={!live}
          onClick={live ? goSpend : undefined}
        />
        <KpiCard
          label="Identifiziertes Sparpotenzial"
          value={live ? `${formatEUR(savingsValue)}` : "—"}
          unit={unit}
          sub={live ? `${m.savingsPercent.toFixed(1).replace(".", ",")} % Optimierungspotenzial im bestehenden Stack` : "Wird nach Analyse berechnet"}
          subTone="success"
          valueTone="success"
          locked={!live}
          onClick={live ? goOptimizations : undefined}
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

      {/* Spend nach Dimensionen + Sourcing-Status (Top 4 Renewals) */}
      <section className="grid gap-4 lg:grid-cols-2">
        <SpendDistribution
          items={spendBreakdown}
          live={live}
          onClick={live ? goSpend : undefined}
        />
        <RenewalsBox live={live} />
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

      {/* CTA Strip · 2 actions */}
      <section className="grid gap-4 md:grid-cols-2">
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
  emoji, title, desc, onClick, tone, size = "md",
}: {
  emoji: string; title: string; desc: string; onClick?: () => void;
  tone: "primary" | "success" | "default";
  size?: "md" | "lg";
}) {
  const isPrimary = tone === "primary";
  const isSuccess = tone === "success";
  const isLarge = size === "lg";
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "rounded-xl border text-left transition-all flex flex-col",
        isLarge ? "px-7 py-7 gap-3" : "px-5 py-5 gap-2",
        isPrimary
          ? "border-primary/60 bg-gradient-to-br from-primary/35 via-primary/20 to-primary/10 shadow-[0_0_50px_-12px_hsl(var(--primary)/0.6)] hover:from-primary/45 hover:via-primary/25 hover:to-primary/15 hover:border-primary/80"
          : isSuccess
            ? "border-success/60 bg-gradient-to-br from-success/35 via-success/20 to-success/10 shadow-[0_0_50px_-12px_hsl(var(--success)/0.6)] hover:from-success/45 hover:via-success/25 hover:to-success/15 hover:border-success/80"
            : "border-border bg-surface/40 hover:bg-surface/60 hover:border-primary/30",
        !onClick && "cursor-not-allowed opacity-70",
      )}
    >
      <div className={cn(
        "flex items-center gap-2 font-semibold tracking-tight",
        isLarge ? "text-lg" : "text-sm",
        isPrimary && "text-foreground",
        isSuccess && "text-success",
      )}>
        <span className={cn(isLarge ? "text-2xl" : "text-base")}>{emoji}</span> {title}
      </div>
      <div className={cn(
        "leading-snug",
        isLarge ? "text-xs" : "text-[11px]",
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

/* ---------- Spend distribution bar ---------- */

const SEGMENT_COLORS: Record<string, string> = {
  cloud: "bg-[hsl(210_90%_55%)]",
  saas: "bg-[hsl(265_75%_60%)]",
  telco: "bg-[hsl(160_70%_45%)]",
  office: "bg-[hsl(45_90%_55%)]",
  hardware: "bg-[hsl(15_85%_60%)]",
};
const DOT_COLORS: Record<string, string> = {
  cloud: "bg-[hsl(210_90%_55%)]",
  saas: "bg-[hsl(265_75%_60%)]",
  telco: "bg-[hsl(160_70%_45%)]",
  office: "bg-[hsl(45_90%_55%)]",
  hardware: "bg-[hsl(15_85%_60%)]",
};

function SpendDistribution({
  items, live, onClick,
}: {
  items: { key: string; label: string; monthly: number }[];
  live: boolean;
  onClick?: () => void;
}) {
  const total = items.reduce((s, i) => s + (i.monthly || 0), 0);
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "rounded-xl border bg-background/60 backdrop-blur p-5 text-left transition-all flex flex-col gap-4",
        live ? "border-border hover:border-primary/40 hover:bg-primary/5 cursor-pointer" : "border-border opacity-70 cursor-not-allowed",
      )}
    >
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <span className="text-base">📊</span>
        <span className="text-sm font-semibold tracking-tight">Spend nach Dimensionen</span>
        {onClick && <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />}
      </div>

      <div className="flex h-3 w-full rounded-full overflow-hidden bg-background border border-border/60">
        {items.map((it) => {
          const pct = total > 0 ? (it.monthly / total) * 100 : 0;
          return (
            <div
              key={it.key}
              className={cn(SEGMENT_COLORS[it.key] ?? "bg-primary")}
              style={{ width: `${pct}%` }}
              title={`${it.label}: ${formatEUR(it.monthly)} (${Math.round(pct)}%)`}
            />
          );
        })}
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[12px]">
        {items.map((it) => {
          const pct = total > 0 ? Math.round((it.monthly / total) * 100) : 0;
          return (
            <li key={it.key} className="flex items-center gap-2 tabular-nums">
              <span className={cn("h-2 w-2 rounded-full shrink-0", DOT_COLORS[it.key] ?? "bg-primary")} />
              <span className="text-foreground/90 truncate">{it.label}</span>
              <span className="ml-auto text-muted-foreground">{formatEUR(it.monthly)} ({pct}%)</span>
            </li>
          );
        })}
      </ul>
    </button>
  );
}

/* ---------- Top 4 Renewals ---------- */

const RENEWAL_BADGE: Record<RenewalStatus, string> = {
  "In Analyse": "border-slate-500/40 bg-slate-500/15 text-slate-300",
  "Strategie bereit": "border-primary/40 bg-primary/15 text-primary",
  "In Verhandlung": "border-[hsl(32_95%_60%)]/40 bg-[hsl(32_95%_60%)]/15 text-[hsl(32_95%_60%)]",
  "Erfolgreich optimiert": "border-success/40 bg-success/15 text-success",
};

function RenewalsBox({ live }: { live: boolean }) {
  const items = DEFAULT_RENEWALS;
  return (
    <Link
      to="/verhandlungen"
      disabled={!live}
      className={cn(
        "rounded-xl border bg-background/60 backdrop-blur p-5 flex flex-col gap-3 transition-all",
        live ? "border-border hover:border-primary/40 hover:bg-primary/5 cursor-pointer" : "border-border opacity-70 pointer-events-none",
      )}
    >
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <span className="text-base">🤝</span>
        <span className="text-sm font-semibold tracking-tight">Sourcing-Status · Top 4 Verhandlungen</span>
        <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
      </div>
      <ul className="flex flex-col divide-y divide-border/60">
        {items.map((r) => (
          <li key={r.vendor} className="py-2.5 flex items-center gap-3 text-[13px]">
            <div className="min-w-0 flex-1">
              <div className="text-foreground/90 font-medium truncate">{r.vendor}</div>
              <div className="text-[11px] text-muted-foreground truncate">{r.category} · {r.due}</div>
            </div>
            <span className={cn("text-[10px] uppercase tracking-wider rounded-full px-2 py-0.5 border whitespace-nowrap", RENEWAL_BADGE[r.status])}>
              {r.status}
            </span>
          </li>
        ))}
      </ul>
    </Link>
  );
}

