import type { ReactNode } from "react";
import { TrendingDown, Wallet, Sparkles, ArrowUpRight, CheckCircle2, Bot, Lock, ChevronRight } from "lucide-react";
import { useCoreSpend, formatEUR, CATEGORIES, CATEGORY_META, type Category } from "@/lib/corespend-store";
import { iconFor } from "./iconFor";
import { cn } from "@/lib/utils";

export function CoreDashboard() {
  const { categories, currentPrice, goToCategory, goToUpload, setActiveView } = useCoreSpend();

  const totalCost = CATEGORIES.reduce((acc, c) => acc + CATEGORY_META[c].costPerYear, 0);
  const totalSavings = CATEGORIES.reduce((acc, c) => acc + (CATEGORY_META[c].savingsPerYear ?? 0), 0);

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            CoreSpend · Cockpit
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mt-1">
            Core Dashboard <span className="text-muted-foreground font-normal">· Gesamttransparenz</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
            Alle 5 Kernbereiche deiner IT auf einen Blick — aggregierte Kosten, Einsparpotenziale und Hauptkennzahlen je Unterpunkt.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          Live-Datenstand · zuletzt synchronisiert vor 2 Min.
        </div>
      </header>

      {/* TOP METRICS */}
      <div className="grid gap-5 md:grid-cols-3">
        <TopMetric
          label="Gesamte IT-Ausgaben"
          value={formatEUR(totalCost)}
          sub="pro Jahr · 5 Kernbereiche aggregiert"
          icon={<Wallet className="h-5 w-5" />}
          gradient="from-primary/15 via-primary/5 to-transparent"
        />
        <TopMetric
          label="Gesamtersparnis · Potenzial"
          value={formatEUR(totalSavings)}
          sub="pro Jahr · KI-validiert, marktbenchmarked"
          icon={<TrendingDown className="h-5 w-5" />}
          gradient="from-success/20 via-success/5 to-transparent"
          accent
        />
        <TopMetric
          label="CoreSpend Abonnement-Tarif"
          value={`${formatEUR(currentPrice)} / Mon.`}
          sub="dynamisch reduziert je freigeschaltetem Bereich"
          icon={<Sparkles className="h-5 w-5" />}
          gradient="from-primary/10 via-success/10 to-transparent"
          badge="Aktiv"
        />
      </div>

      {/* SECTIONS */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground">
            Kostentransparenz · nach Hauptbereich
          </h2>
          <span className="text-[11px] text-muted-foreground">
            Klicke auf einen Bereich oder Unterpunkt für Details
          </span>
        </div>

        {CATEGORIES.map((c) => (
          <SectionRow
            key={c}
            category={c}
            unlocked={categories[c].status !== "idle"}
            subStatus={categories[c].subStatus}
            onSectionClick={() => goToCategory(c)}
            onSubClick={(sub) => {
              const status = categories[c].subStatus[sub];
              if (status && status !== "idle") goToCategory(c);
              else goToUpload(c, sub);
            }}
          />
        ))}
      </div>

      {/* CoreAI widget */}
      <button
        onClick={() => setActiveView("ai")}
        className="w-full text-left glass-card p-6 relative overflow-hidden group transition-all hover:-translate-y-0.5"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-success/15 pointer-events-none" />
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-success grid place-items-center">
              <Bot className="h-6 w-6 text-background" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">CoreAI · Negotiation Agent</h3>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-success border border-success/40 bg-success/10 rounded-full px-2 py-0.5">
                  <Lock className="h-3 w-3" /> Coming Soon
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                Autonomer KI-Verhandlungsassistent · trainiert auf 1.200+ DACH-Verträgen, um vollautomatisch
                Nachverhandlungen mit deinen Providern zu führen.
              </p>
            </div>
          </div>
          <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </button>
    </div>
  );
}

function TopMetric({
  label, value, sub, icon, gradient, accent, badge,
}: { label: string; value: ReactNode; sub: string; icon: ReactNode; gradient: string; accent?: boolean; badge?: string }) {
  return (
    <div className="relative glass-card p-6 overflow-hidden">
      <div className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none", gradient)} />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{label}</span>
          <span className={cn("text-muted-foreground", accent && "text-success")}>{icon}</span>
        </div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <div className={cn("text-3xl font-semibold tabular-nums tracking-tight leading-none", accent && "text-success")}>
            {value}
          </div>
          {badge && (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-success border border-success/40 bg-success/10 rounded-full px-2 py-0.5">
              <CheckCircle2 className="h-3 w-3" /> {badge}
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}

function SectionRow({
  category, unlocked, subStatus, onSectionClick, onSubClick,
}: {
  category: Category;
  unlocked: boolean;
  subStatus: Record<string, string>;
  onSectionClick: () => void;
  onSubClick: (sub: string) => void;
}) {
  const meta = CATEGORY_META[category];
  const Icon = iconFor(meta.iconName);

  return (
    <div className="glass-card p-6">
      <button onClick={onSectionClick} className="w-full text-left group">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{meta.emoji}</div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
                  {meta.label}
                </h3>
                {unlocked ? (
                  <span className="text-[10px] uppercase tracking-wider text-success border border-success/40 bg-success/10 rounded-full px-2 py-0.5">
                    Live
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded-full px-2 py-0.5">
                    Daten ausstehend
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" /> {meta.costSub}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <Stat label="Ist-Kosten / Jahr" value={formatEUR(meta.costPerYear)} />
            <Stat
              label="Einsparpotenzial"
              value={meta.savingsPerYear ? formatEUR(meta.savingsPerYear) : "—"}
              accent={!!meta.savingsPerYear}
            />
            <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </button>

      {/* Subcategories */}
      <div className="mt-5 pt-5 border-t border-border/60 grid gap-2.5 md:grid-cols-2 lg:grid-cols-3">
        {meta.subs.map((s) => {
          const st = subStatus[s.key] ?? "idle";
          const isLive = st === "analyzed" || st === "pending";
          const isProcessing = st === "processing";
          const disabled = s.available === false;
          return (
            <button
              key={s.key}
              disabled={disabled}
              onClick={() => onSubClick(s.key)}
              className={cn(
                "group/sub flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-3.5 py-3 text-left transition-all",
                !disabled && "hover:border-primary/40 hover:bg-accent/40",
                disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-lg">{s.emoji}</span>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{s.label}</div>
                  <div className="text-[10.5px] text-muted-foreground truncate">
                    {disabled ? "Bald verfügbar" :
                      isLive ? (s.kpi?.map(k => `${k.label}: ${k.value}`).slice(0,1).join(" · ") ?? "Live · Daten verfügbar")
                      : isProcessing ? "Wird verarbeitet …"
                      : "Daten ausstehend · jetzt hochladen"}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover/sub:text-primary shrink-0 transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="hidden sm:block text-right">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("text-lg font-semibold tabular-nums", accent && "text-success")}>{value}</div>
    </div>
  );
}
