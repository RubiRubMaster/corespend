import { useCoreSpend } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";
import { Clock, AlertCircle, CheckCircle, Cloud, Cpu, Server } from "lucide-react";

type CategoryInsight = {
  key: string;
  label: string;
  icon: typeof Cloud;
  accent: string;
  leadTime: string;
  typicalRisk: string;
  levers: string[];
  watchOuts: string[];
};

const CATEGORY_INSIGHTS: CategoryInsight[] = [
  {
    key: "saas",
    label: "SaaS / AI",
    icon: Cloud,
    accent: "from-sky-500/15 to-sky-500/5 border-sky-500/30",
    leadTime: "6–9 Monate vor Renewal",
    typicalRisk: "Auto-Renewal-Klauseln, Preis-Uplifts 8–15 % p.a., ungenutzte Lizenzen 20–35 %",
    levers: [
      "True-Up & License-Reharvesting vor Verlängerung",
      "Multi-Year-Locks gegen AI-Add-on-Preissprünge",
      "Benchmark gegen Listenpreise & Peer-Discounts",
    ],
    watchOuts: [
      "Stille Verlängerung bei Versäumen der Kündigungsfrist",
      "AI-Module (Copilot, GenAI) oft außerhalb des Rahmenvertrags bepreist",
    ],
  },
  {
    key: "hardware",
    label: "Hardware & Workplace",
    icon: Cpu,
    accent: "from-amber-500/15 to-amber-500/5 border-amber-500/30",
    leadTime: "4–6 Monate vor Leasing-Ende / Refresh",
    typicalRisk: "Lieferzeiten 8–14 Wochen, Restwert-Risiken, ESG-Reporting-Pflichten",
    levers: [
      "Device-as-a-Service vs. CAPEX-Vergleich neu rechnen",
      "Bundling von Endgeräten, Zubehör & Service-Levels",
      "Trade-In & Refurbishment in TCO einpreisen",
    ],
    watchOuts: [
      "Verlängerte Leasingraten nach Ende der Grundmietzeit",
      "Versteckte Logistik- und Imaging-Gebühren",
    ],
  },
  {
    key: "cloud",
    label: "Cloud Infrastruktur",
    icon: Server,
    accent: "from-emerald-500/15 to-emerald-500/5 border-emerald-500/30",
    leadTime: "3–12 Monate vor EDP / Commit-Ende",
    typicalRisk: "Over-Commit auf EDPs, Egress-Kosten, ungenutzte Reserved Instances",
    levers: [
      "Savings Plans & RIs gegen On-Demand-Mix optimieren",
      "Private Pricing Agreements (PPA) neu verhandeln",
      "FinOps-Tags zur verursachergerechten Allokation",
    ],
    watchOuts: [
      "Commit-Strafen bei Unterschreitung des EDP-Volumens",
      "Egress-Fallen bei Multi-Cloud-Architekturen",
    ],
  },
];

export function DeadlinesView() {
  const { deadlines, cockpit, goCockpit } = useCoreSpend();
  const windowMonths = Math.max(1, Math.round(cockpit.deadlineWindowDays / 30));

  return (
    <div className="space-y-6">
      <header>
        <button onClick={goCockpit} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          ← Zurück zum Core Cockpit
        </button>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">Kritische Fristen</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {cockpit.criticalDeadlines} Vertragsfrist(en) innerhalb der nächsten {cockpit.deadlineWindowDays} Tage · Verhandlungsfenster aktiv.
        </p>
      </header>

      <div className="rounded-xl border border-border bg-surface/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background/50 text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Anbieter</th>
              <th className="text-left px-4 py-3">Vertragsart</th>
              <th className="text-left px-4 py-3">Frist</th>
              <th className="text-right px-4 py-3">Verbleibend</th>
              <th className="text-right px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {deadlines.map((d, i) => {
              const isCritical = d.remainingMonths > 0 && d.remainingMonths <= windowMonths;
              const isWarn = d.remainingMonths > windowMonths && d.remainingMonths <= windowMonths * 2;
              return (
                <tr key={i} className="border-t border-border/60">
                  <td className="px-4 py-3 font-medium">{d.vendor}</td>
                  <td className="px-4 py-3 text-foreground/90">{d.contractType}</td>
                  <td className="px-4 py-3 text-foreground/80">{d.endLabel}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{d.remainingMonths} Mo.</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {isCritical ? (
                        <><AlertCircle className="h-3.5 w-3.5 text-destructive" /><span className="text-destructive text-xs">Kritisch</span></>
                      ) : isWarn ? (
                        <><Clock className="h-3.5 w-3.5 text-[hsl(32_95%_60%)]" /><span className="text-[hsl(32_95%_60%)] text-xs">Beobachten</span></>
                      ) : (
                        <><CheckCircle className="h-3.5 w-3.5 text-success" /><span className="text-success text-xs">Stabil</span></>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className={cn("text-[11px] text-muted-foreground")}>
        Diese Tabelle wird live aus den Admin-Eingaben gespeist (Sektion „Daten für Fristen-Detailseite").
      </p>
    </div>
  );
}
