import { TrendingDown, BarChart3, CalendarClock, Cloud } from "lucide-react";
import { KpiCard } from "./KpiCard";
import { BenchmarkSlider } from "./BenchmarkSlider";
import { Countdown } from "./Countdown";
import { CtaRow } from "./CtaRow";
import { formatEUR } from "@/lib/corespend-store";

const LICENSES = [
  { sku: "Microsoft 365 E5", count: 184, price: "57,50 €", utilization: "31%", flag: "Downgrade auf E3" },
  { sku: "Microsoft 365 E3", count: 612, price: "33,70 €", utilization: "82%", flag: "OK" },
  { sku: "Microsoft 365 F3", count: 96, price: "7,80 €", utilization: "61%", flag: "OK" },
  { sku: "Power BI Pro", count: 78, price: "9,90 €", utilization: "22%", flag: "Konsolidieren" },
  { sku: "Visio Plan 2", count: 42, price: "13,80 €", utilization: "14%", flag: "Reduzieren" },
];

export function M365Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-accent grid place-items-center">
          <Cloud className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Microsoft 365</h1>
          <p className="text-sm text-muted-foreground">Live-Analyse · 1.012 aktive Lizenzen · Microsoft EA</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          label="Optimierungspotenzial"
          value={formatEUR(76440)}
          hint="pro Jahr · v.a. Downgrades E5 → E3 und ungenutzte Power BI Pro"
          accent="success"
          icon={<TrendingDown className="h-4 w-4" />}
        />
        <KpiCard
          label="M365-Preis-Benchmark"
          value="+11%"
          accent="primary"
          icon={<BarChart3 className="h-4 w-4" />}
        >
          <BenchmarkSlider overPercent={11} label="Effektivpreis je User vs. DACH-Markt" />
        </KpiCard>
        <KpiCard
          label="Nächster True-Up-Stichtag"
          value=""
          icon={<CalendarClock className="h-4 w-4" />}
        >
          <Countdown days={89} label="True-Up Submission Deadline" />
        </KpiCard>
      </div>

      <CtaRow />

      <div className="glass-card p-5">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
          Aktives Lizenz-Inventar
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-2 pr-4 font-medium">SKU</th>
                <th className="py-2 pr-4 font-medium">Anzahl</th>
                <th className="py-2 pr-4 font-medium">Preis / Monat</th>
                <th className="py-2 pr-4 font-medium">Nutzung</th>
                <th className="py-2 font-medium">Empfehlung</th>
              </tr>
            </thead>
            <tbody>
              {LICENSES.map((l) => {
                const ok = l.flag === "OK";
                return (
                  <tr key={l.sku} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-4 text-foreground">{l.sku}</td>
                    <td className="py-3 pr-4 tabular-nums text-muted-foreground">{l.count}</td>
                    <td className="py-3 pr-4 tabular-nums text-muted-foreground">{l.price}</td>
                    <td className="py-3 pr-4 tabular-nums text-muted-foreground">{l.utilization}</td>
                    <td className="py-3">
                      <span
                        className={
                          ok
                            ? "text-[11px] px-2 py-1 rounded bg-accent text-muted-foreground"
                            : "text-[11px] px-2 py-1 rounded bg-success/15 text-success font-medium"
                        }
                      >
                        {l.flag}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
