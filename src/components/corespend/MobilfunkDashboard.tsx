import { Wallet, BarChart3, CalendarClock, Smartphone } from "lucide-react";
import { KpiCard } from "./KpiCard";
import { BenchmarkSlider } from "./BenchmarkSlider";
import { Countdown } from "./Countdown";
import { CtaRow } from "./CtaRow";
import { formatEUR } from "@/lib/corespend-store";

export function MobilfunkDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-accent grid place-items-center">
          <Smartphone className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mobilfunk & Telco</h1>
          <p className="text-sm text-muted-foreground">Live-Analyse · 412 aktive Anschlüsse · Vodafone Business</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          label="Ungenutztes Budget"
          value={formatEUR(24320)}
          hint="pro Jahr · 38 verwaiste SIMs, 24 inaktive Datentarife"
          accent="success"
          icon={<Wallet className="h-4 w-4" />}
        />
        <KpiCard
          label="Telco-Markt-Benchmark"
          value="+18%"
          accent="primary"
          icon={<BarChart3 className="h-4 w-4" />}
        >
          <BenchmarkSlider overPercent={18} label="ARPU vs. DACH-Markt" />
        </KpiCard>
        <KpiCard
          label="Nächstes Verhandlungsfenster"
          value=""
          icon={<CalendarClock className="h-4 w-4" />}
        >
          <Countdown days={42} label="Optimaler Verhandlungs-Startpunkt" />
        </KpiCard>
      </div>

      <CtaRow />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass-card p-5">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
            Kostenstruktur · Aufschlüsselung
          </div>
          <div className="space-y-3 text-sm">
            <Row label="ARPU (Average Revenue per User)" value="34,80 €" />
            <Row label="Fixanteil" value="62%" sub="Grundgebühr, EU-Roaming" />
            <Row label="Variabler Anteil" value="38%" sub="Daten-Overage, Auslandsoptionen" />
            <Row label="Overage-Anteil (12 Mon.)" value="9.840 €" accent />
            <Row label="Anteil ungenutzte SIMs" value="9,2%" accent />
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
            Vertragsdaten
          </div>
          <div className="space-y-3 text-sm">
            <Row label="Anbieter" value="Vodafone Business" />
            <Row label="Rahmenvertrag" value="Master Agreement 2022" />
            <Row label="Vertragsbeginn" value="01.04.2022" />
            <Row label="Mindestlaufzeit bis" value="31.03.2026" />
            <Row label="Auto-Renewal" value="12 Monate" sub="Kündigungsfrist 90 Tage" />
            <Row label="Realisierbarer Einsparhebel" value={formatEUR(48600) + " / Jahr"} accent />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="flex items-start justify-between py-1.5 border-b border-border/60 last:border-0">
      <div>
        <div className="text-foreground/90">{label}</div>
        {sub && <div className="text-[11px] text-muted-foreground">{sub}</div>}
      </div>
      <div className={accent ? "text-success font-medium tabular-nums" : "text-foreground tabular-nums"}>
        {value}
      </div>
    </div>
  );
}
