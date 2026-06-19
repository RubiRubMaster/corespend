import { useCoreSpend, formatEUR, type NegotiationStrategy } from "@/lib/corespend-store";
import { toast } from "sonner";

export function MobilfunkMandate() {
  const { strategy, metrics, setMobilfunkStage, resetStrategy } = useCoreSpend();

  const rows = buildSummary(strategy);
  const expectedSavings = Math.round(metrics.savingsYearly * estimateMultiplier(strategy));

  return (
    <div className="space-y-6">
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-success/10 via-transparent to-primary/10 pointer-events-none" />
        <div className="relative space-y-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              State E · Verhandlungsmandat
            </div>
            <h2 className="text-3xl font-semibold tracking-tight mt-1">Ihr Mandat ist bereit</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              Diese strategischen Parameter führen unsere Verhandlungsexperten in Ihr Provider-Gespräch.
              Erwartetes Verhandlungsergebnis:{" "}
              <span className="text-success font-semibold tabular-nums">{formatEUR(expectedSavings)} / Jahr</span>.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {rows.map((r) => (
              <div key={r.label} className="rounded-xl border border-border bg-background/40 p-4">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.label}</div>
                <div className="text-sm font-semibold mt-1.5">{r.value}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() =>
                toast.success("Verhandlungsmandat wird vorbereitet", {
                  description: "Sie erhalten das signierte PDF per E-Mail innerhalb von 24 Stunden.",
                })
              }
              className="rounded-lg bg-gradient-to-r from-success to-primary text-success-foreground px-5 py-3 text-sm font-semibold hover:brightness-110 transition shadow-[0_15px_50px_-15px_color-mix(in_oklab,var(--success)_70%,transparent)]"
            >
              📄 Verhandlungsmandat herunterladen
            </button>
            <button
              onClick={() => setMobilfunkStage("wizard")}
              className="rounded-lg border border-border bg-background/40 px-5 py-3 text-sm font-medium hover:border-primary/50 transition-colors"
            >
              Strategie anpassen
            </button>
            <button
              onClick={() => {
                resetStrategy();
                setMobilfunkStage("cockpit");
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline ml-auto"
            >
              Zurück zum Cockpit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildSummary(s: NegotiationStrategy) {
  const payment: string[] = [];
  if (s.payment.net60) payment.push("60 Tage netto");
  if (s.payment.net90) payment.push("90 Tage netto");
  if (s.payment.consolidated) payment.push("Konsolidierte ERP-Rechnung");

  const clauses: string[] = [];
  if (s.clauses.flexStaff) clauses.push("Mitarbeiter-Flex-Klausel (20 %)");
  if (s.clauses.techExit) clauses.push("Technologie-/5G-Sonderkündigungsrecht");

  const fleet: string[] = [];
  if (s.fleet.esimMdm) fleet.push("eSIM/MDM-Vollautomatisierung");
  if (s.fleet.multiSim) fleet.push("Multi-SIM für Tablets");
  fleet.push(`Netz: ${networkLabel(s.fleet.network)}`);

  return [
    {
      label: "Strategische Ausrichtung",
      value:
        s.approach === "tender"
          ? "Offene Marktausschreibung (max. Drohkulisse)"
          : s.approach === "renegotiate"
          ? "Geräuschlose Nachverhandlung"
          : "—",
    },
    { label: "Vertragslaufzeit", value: s.termMonths ? `${s.termMonths} Monate` : "—" },
    { label: "Abrechnungsmodell", value: payment.length ? payment.join(" · ") : "Standard 30 Tage netto" },
    { label: "Vertragsschutz-Klauseln", value: clauses.length ? clauses.join(" · ") : "Keine Sonderklauseln" },
    { label: "Flotten-Infrastruktur", value: fleet.join(" · ") },
  ];
}

function networkLabel(n: NegotiationStrategy["fleet"]["network"]) {
  return n === "telekom" ? "Telekom" : n === "vodafone" ? "Vodafone" : n === "o2" ? "Telefónica/O2" : "egal";
}

function estimateMultiplier(s: NegotiationStrategy) {
  let m = 1;
  if (s.approach === "tender") m += 0.18;
  if (s.termMonths === 36) m += 0.08;
  else if (s.termMonths === 24) m += 0.03;
  if (s.payment.net90) m += 0.04;
  else if (s.payment.net60) m += 0.02;
  if (s.clauses.flexStaff) m += 0.03;
  if (s.clauses.techExit) m += 0.02;
  return m;
}
