import { useCoreSpend, formatEUR, CATEGORIES_META, type Category } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";

export function ManagementDashboard() {
  const { mobilfunkStatus, metrics, goMobilfunk, goLocked } = useCoreSpend();
  const mobilfunkLive = mobilfunkStatus === "analyzed";

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            CoreSpend · Cockpit
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mt-1">
            Management Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
            Globale Übersicht aller 5 Kern-IT-Bereiche. Kosten, Nutzung, Vertragslaufzeit und Einsparpotenzial in Echtzeit aggregiert.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          Live · zuletzt synchronisiert vor 2 Min.
        </div>
      </header>

      {/* KPI summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          label="Validierte IT-Ausgaben (live)"
          value={mobilfunkLive ? formatEUR(metrics.costMonthly * 12) : "—"}
          sub={mobilfunkLive ? "Mobilfunk · weitere Bereiche folgen" : "0 / 5 Bereiche analysiert"}
          tone="primary"
        />
        <KpiCard
          label="Identifiziertes Einsparpotenzial"
          value={mobilfunkLive ? `${formatEUR(metrics.savingsYearly)} / Jahr` : "—"}
          sub={mobilfunkLive ? "KI-validiert · DACH-Benchmark" : "Daten ausstehend"}
          tone="success"
        />
        <KpiCard
          label="Aktive Bereiche"
          value={mobilfunkLive ? "1 / 5" : "0 / 5"}
          sub="Office, SaaS, Cloud, Hardware folgen"
          tone="muted"
        />
      </div>

      {/* Table-style overview */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-wide uppercase">
              IT-Bereiche · Kosten- & Vertragstransparenz
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Klicke einen Bereich an, um zur Detail-Pipeline zu wechseln.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-6 py-3 font-medium">Bereich</th>
                <th className="px-4 py-3 font-medium text-right">Kosten</th>
                <th className="px-4 py-3 font-medium text-right">Nutzung</th>
                <th className="px-4 py-3 font-medium text-right">Laufzeit</th>
                <th className="px-4 py-3 font-medium text-right">Einsparpotenzial</th>
                <th className="px-6 py-3 font-medium text-right">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {/* Mobilfunk (live or pending) */}
              <Row
                emoji="📱"
                label="Telekommunikation · Mobilfunk"
                sub="Hauptbereich · MVP-Fokus"
                cost={mobilfunkLive ? `${formatEUR(metrics.costMonthly)} / Mo.` : "—"}
                usage={mobilfunkLive ? `${metrics.usagePercent}%` : "—"}
                runtime={mobilfunkLive ? `${metrics.runtimeMonths} Monate` : "—"}
                potential={mobilfunkLive ? `${formatEUR(metrics.savingsYearly)} / Jahr` : "—"}
                status={
                  mobilfunkLive
                    ? "live"
                    : mobilfunkStatus === "processing" || mobilfunkStatus === "pending"
                    ? "processing"
                    : "open"
                }
                onClick={goMobilfunk}
              />
              {/* Locked categories */}
              {CATEGORIES_META.filter((c) => !c.available).map((c) => (
                <Row
                  key={c.key}
                  emoji={c.emoji}
                  label={c.label}
                  sub="Coming Soon · in Vorbereitung"
                  cost="—"
                  usage="—"
                  runtime="—"
                  potential="—"
                  status="locked"
                  onClick={() => goLocked(c.key as Category)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trust strip */}
      <div className="grid gap-3 md:grid-cols-4 text-[11px] text-muted-foreground">
        {[
          ["🛡", "DSGVO-konform"],
          ["🔐", "AES-256 Verschlüsselung"],
          ["🇩🇪", "Hosting in Frankfurt"],
          ["📄", "Automatischer NDA-Schutz"],
        ].map(([e, l]) => (
          <div key={l} className="glass-card px-4 py-3 flex items-center gap-2">
            <span className="text-base">{e}</span>
            <span className="text-foreground/90">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function KpiCard({
  label, value, sub, tone,
}: { label: string; value: string; sub: string; tone: "primary" | "success" | "muted" }) {
  return (
    <div className="glass-card p-5 relative overflow-hidden">
      <div className={cn(
        "absolute inset-0 pointer-events-none bg-gradient-to-br",
        tone === "primary" && "from-primary/15 via-transparent to-transparent",
        tone === "success" && "from-success/20 via-transparent to-transparent",
        tone === "muted" && "from-accent/30 via-transparent to-transparent",
      )} />
      <div className="relative">
        <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{label}</div>
        <div className={cn(
          "mt-2 text-3xl font-semibold tabular-nums tracking-tight",
          tone === "success" && "text-success",
        )}>{value}</div>
        <div className="text-xs text-muted-foreground mt-1.5">{sub}</div>
      </div>
    </div>
  );
}

function Row({
  emoji, label, sub, cost, usage, runtime, potential, status, onClick,
}: {
  emoji: string; label: string; sub: string;
  cost: string; usage: string; runtime: string; potential: string;
  status: "live" | "processing" | "open" | "locked";
  onClick: () => void;
}) {
  const locked = status === "locked";
  return (
    <tr
      onClick={onClick}
      className={cn(
        "border-b border-border/60 last:border-0 transition-colors group cursor-pointer",
        locked ? "opacity-55 hover:bg-accent/20" : "hover:bg-accent/30",
      )}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="text-xl">{emoji}</div>
          <div>
            <div className="font-medium flex items-center gap-2">
              {label}
              {status === "live" && (
                <span className="text-[9px] uppercase tracking-wider text-success border border-success/40 bg-success/10 rounded-full px-1.5 py-0.5">Live</span>
              )}
              {status === "processing" && (
                <span className="text-[9px] uppercase tracking-wider text-primary border border-primary/40 bg-primary/10 rounded-full px-1.5 py-0.5">In Prüfung</span>
              )}
              {locked && (
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground border border-border rounded-full px-1.5 py-0.5">
                  🔒 Coming Soon
                </span>
              )}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-right tabular-nums">{cost}</td>
      <td className="px-4 py-4 text-right tabular-nums">{usage}</td>
      <td className="px-4 py-4 text-right tabular-nums">{runtime}</td>
      <td className={cn("px-4 py-4 text-right tabular-nums", status === "live" && "text-success font-semibold")}>{potential}</td>
      <td className="px-6 py-4 text-right">
        <span className="text-muted-foreground group-hover:text-primary transition-colors">
          {locked ? "Details" : status === "open" ? "Daten teilen →" : "Öffnen →"}
        </span>
      </td>
    </tr>
  );
}
