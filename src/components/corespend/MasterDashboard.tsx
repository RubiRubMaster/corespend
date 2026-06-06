import { useState, type ReactNode } from "react";
import {
  Smartphone,
  Cloud,
  CloudCog,
  Cpu,
  TrendingDown,
  Wallet,
  Sparkles,
  ArrowUpRight,
  Upload,
  AlertTriangle,
  CalendarClock,
  Users,
  Database,
  Package,
  LineChart,
  CheckCircle2,
} from "lucide-react";
import { useCoreSpend, formatEUR, type Category } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";
import { UploadDialog } from "./UploadDialog";

export function MasterDashboard() {
  const { categories, setActiveView, currentPrice } = useCoreSpend();
  const [uploadFor, setUploadFor] = useState<Category | null>(null);

  const handleSectionClick = (cat: Category) => {
    const unlocked = categories[cat].status !== "idle";
    if (unlocked) setActiveView(cat);
    else setUploadFor(cat);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            CoreSpend · Master-Cockpit
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mt-1">
            Gesamtübersicht <span className="text-muted-foreground font-normal">· Transparenz</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
            Ein zentraler Blick auf alle Kernkostenblöcke deiner IT — vom Telco-Vertrag bis zur Hardware-Flotte.
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
          label="Gesamte IT-Ausgaben · Kernausstattung"
          value={formatEUR(742100)}
          sub="pro Jahr · alle 4 Bereiche aggregiert"
          icon={<Wallet className="h-5 w-5" />}
          gradient="from-primary/15 via-primary/5 to-transparent"
        />
        <TopMetric
          label="Identifiziertes Einsparpotenzial"
          value={formatEUR(100760)}
          sub="pro Jahr · KI-validiert, marktbenchmarked"
          icon={<TrendingDown className="h-5 w-5" />}
          gradient="from-success/20 via-success/5 to-transparent"
          accent
        />
        <TopMetric
          label="Daten-Bonus Status"
          value="Maximaler Rabatt"
          sub={`Aktueller Tarif: ${formatEUR(currentPrice)} / Monat`}
          icon={<Sparkles className="h-5 w-5" />}
          gradient="from-primary/10 via-success/10 to-transparent"
          badge="Aktiv"
        />
      </div>

      {/* MATRIX */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground">
            Kostentransparenz-Matrix
          </h2>
          <span className="text-[11px] text-muted-foreground">
            Klicke auf einen Bereich für die Detailansicht
          </span>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <SectionCard
            emoji="📱"
            title="Mobilfunk & Telco"
            icon={Smartphone}
            unlocked={categories.mobilfunk.status !== "idle"}
            cost="221.040 €"
            costSub="18.420 € / Monat · 412 Anschlüsse"
            savings="24.320 €"
            onClick={() => handleSectionClick("mobilfunk")}
            metrics={[
              { icon: <Users className="h-3.5 w-3.5" />, label: "ARPU", value: "23,02 € / Monat" },
              { icon: <Database className="h-3.5 w-3.5" />, label: "Ø Datenvolumen", value: "14,2 GB / User" },
              { icon: <CalendarClock className="h-3.5 w-3.5" />, label: "Restlaufzeit", value: "14 Monate" },
              { icon: <LineChart className="h-3.5 w-3.5" />, label: "Vertragsende", value: "14.11.2028" },
            ]}
          />
          <SectionCard
            emoji="💻"
            title="Microsoft 365"
            icon={Cloud}
            unlocked={categories.m365.status !== "idle"}
            cost="294.000 €"
            costSub="24.500 € / Monat · 800 Lizenzen"
            savings="76.440 €"
            onClick={() => handleSectionClick("m365")}
            metrics={[
              { icon: <Wallet className="h-3.5 w-3.5" />, label: "Ø Kosten / Lizenz", value: "30,62 € / Monat" },
              {
                icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />,
                label: "Inaktive Lizenzen",
                value: "12 % (96 Accounts)",
                warn: true,
              },
              { icon: <CalendarClock className="h-3.5 w-3.5" />, label: "Nächster True-Up", value: "in 131 Tagen" },
              { icon: <LineChart className="h-3.5 w-3.5" />, label: "Plan-Mix", value: "E3 / E5 / F3" },
            ]}
          />
          <SectionCard
            emoji="☁️"
            title="SaaS & Cloud"
            icon={CloudCog}
            unlocked={categories.saas.status !== "idle"}
            cost="148.500 €"
            costSub="pro Jahr · 34 Plattformen"
            savings={null}
            savingsUnlock={{ label: "Daten hochladen & 400 € sparen", category: "saas" as Category }}
            onClick={() => handleSectionClick("saas")}
            metrics={[
              { icon: <Package className="h-3.5 w-3.5" />, label: "Aktive SaaS-Tools", value: "34 Plattformen" },
              {
                icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />,
                label: "Shadow-IT Warnungen",
                value: "4 unbekannte Abos",
                warn: true,
              },
              { icon: <Users className="h-3.5 w-3.5" />, label: "Top-Tools", value: "Slack · Notion · Zoom" },
              { icon: <Database className="h-3.5 w-3.5" />, label: "Tool-Sprawl Index", value: "Mittel" },
            ]}
            onUpload={() => setUploadFor("saas")}
          />
          <SectionCard
            emoji="🔌"
            title="Hardware & Assets"
            icon={Cpu}
            unlocked={categories.hardware.status !== "idle"}
            cost="78.560 €"
            costSub="pro Jahr · Leasing & Kauf"
            savings={null}
            savingsUnlock={{ label: "Daten hochladen & 300 € sparen", category: "hardware" as Category }}
            onClick={() => handleSectionClick("hardware")}
            metrics={[
              { icon: <Package className="h-3.5 w-3.5" />, label: "Geleaste Geräte", value: "412 Assets" },
              {
                icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />,
                label: "Überfällige Rückgaben",
                value: "8 Geräte",
                warn: true,
              },
              { icon: <CalendarClock className="h-3.5 w-3.5" />, label: "Ø Restlaufzeit", value: "11 Monate" },
              { icon: <LineChart className="h-3.5 w-3.5" />, label: "Hersteller-Mix", value: "Lenovo · Apple · HP" },
            ]}
            onUpload={() => setUploadFor("hardware")}
          />
        </div>
      </div>

      <UploadDialog category={uploadFor} open={uploadFor !== null} onOpenChange={(v) => !v && setUploadFor(null)} />
    </div>
  );
}

function TopMetric({
  label,
  value,
  sub,
  icon,
  gradient,
  accent,
  badge,
}: {
  label: string;
  value: ReactNode;
  sub: string;
  icon: ReactNode;
  gradient: string;
  accent?: boolean;
  badge?: string;
}) {
  return (
    <div className="relative glass-card p-6 overflow-hidden">
      <div className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none", gradient)} />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{label}</span>
          <span className={cn("text-muted-foreground", accent && "text-success")}>{icon}</span>
        </div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <div
            className={cn(
              "text-4xl font-semibold tabular-nums tracking-tight leading-none",
              accent && "text-success",
            )}
          >
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

type Metric = { icon: ReactNode; label: string; value: string; warn?: boolean };

function SectionCard({
  emoji,
  title,
  icon: Icon,
  unlocked,
  cost,
  costSub,
  savings,
  savingsUnlock,
  metrics,
  onClick,
  onUpload,
}: {
  emoji: string;
  title: string;
  icon: typeof Smartphone;
  unlocked: boolean;
  cost: string;
  costSub: string;
  savings: string | null;
  savingsUnlock?: { label: string; category: Category };
  metrics: Metric[];
  onClick: () => void;
  onUpload?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative text-left glass-card p-6 overflow-hidden transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-[0_30px_80px_-40px_color-mix(in_oklab,var(--primary)_60%,transparent)]",
        unlocked && "glow-success",
      )}
    >
      {/* gradient corner */}
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{emoji}</div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
              {unlocked ? (
                <span className="text-[10px] uppercase tracking-wider text-success border border-success/40 bg-success/10 rounded-full px-2 py-0.5">
                  Live
                </span>
              ) : (
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded-full px-2 py-0.5">
                  Gesperrt
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5" /> {costSub}
            </div>
          </div>
        </div>
        <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
      </div>

      <div className="relative grid grid-cols-2 gap-4 mb-5">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Ist-Kosten / Jahr
          </div>
          <div className="text-2xl font-semibold tabular-nums">{cost}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Einsparpotenzial
          </div>
          {savings ? (
            <div className="text-2xl font-semibold tabular-nums text-success">{savings}</div>
          ) : (
            <div className="text-sm text-muted-foreground italic leading-tight">
              Noch nicht analysiert
            </div>
          )}
        </div>
      </div>

      <div className="relative grid grid-cols-2 gap-x-4 gap-y-2.5 pt-4 border-t border-border/60">
        {metrics.map((m) => (
          <div key={m.label} className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              <span className={cn(m.warn && "text-amber-400")}>{m.icon}</span>
              <span className="truncate">{m.label}</span>
            </div>
            <div
              className={cn(
                "text-sm tabular-nums truncate",
                m.warn ? "text-amber-400 font-medium" : "text-foreground/90",
              )}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {savingsUnlock && onUpload && (
        <div
          className="relative mt-5 pt-5 border-t border-border/60"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpload();
            }}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-success/15 hover:bg-success/25 text-success border border-success/40 px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <Upload className="h-4 w-4" />
            {savingsUnlock.label}
          </button>
        </div>
      )}
    </button>
  );
}
