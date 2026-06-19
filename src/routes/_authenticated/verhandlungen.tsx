import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/corespend/AppShell";
import { CoreSpendHydrator } from "@/components/corespend/CoreSpendHydrator";
import { ALL_RENEWALS, formatEUR, type RenewalStatus } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/verhandlungen")({
  head: () => ({
    meta: [
      { title: "CoreSpend · Verhandlungen" },
      { name: "description", content: "Vollständige Übersicht aller Vertragsverhandlungen und Renewals." },
    ],
  }),
  component: VerhandlungenPage,
});

const BADGE: Record<RenewalStatus, string> = {
  "In Analyse": "border-slate-500/40 bg-slate-500/15 text-slate-300",
  "Strategie bereit": "border-primary/40 bg-primary/15 text-primary",
  "In Verhandlung": "border-[hsl(32_95%_60%)]/40 bg-[hsl(32_95%_60%)]/15 text-[hsl(32_95%_60%)]",
  "Erfolgreich optimiert": "border-success/40 bg-success/15 text-success",
};

function VerhandlungenPage() {
  const sorted = [...ALL_RENEWALS].sort((a, b) => {
    if (a.dueDays < 0 && b.dueDays >= 0) return 1;
    if (b.dueDays < 0 && a.dueDays >= 0) return -1;
    return a.dueDays - b.dueDays;
  });

  return (
    <CoreSpendHydrator>
      <AppShell>
        <div className="space-y-6">
          <header>
            <Link to="/app" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              ← Zurück zum Core Cockpit
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight mt-2 flex items-center gap-2">
              <span>🤝</span> Verhandlungen & Renewals
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
              Vollständige Übersicht aller aktiven, anstehenden und abgeschlossenen Vertragsverhandlungen Ihres IT-Stacks.
            </p>
          </header>

          <div className="rounded-xl border border-border bg-surface/40 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-background/50 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Kategorie</th>
                  <th className="text-left px-4 py-3">Vertrag / Anbieter</th>
                  <th className="text-left px-4 py-3">Frist</th>
                  <th className="text-right px-4 py-3">Vertragsvolumen</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r) => (
                  <tr key={r.vendor} className="border-t border-border/60 hover:bg-surface/30">
                    <td className="px-4 py-3 text-foreground/90">{r.category}</td>
                    <td className="px-4 py-3 font-medium">{r.vendor}</td>
                    <td className="px-4 py-3 text-muted-foreground tabular-nums">{r.due}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground/90">
                      {r.volume ? formatEUR(r.volume) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center text-[10px] uppercase tracking-wider rounded-full px-2 py-0.5 border whitespace-nowrap",
                        BADGE[r.status],
                      )}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Demo-Daten · Die Live-Synchronisation aus dem Vertrags-Repository erfolgt automatisch nach Freischaltung der jeweiligen IT-Bereiche.
          </p>
        </div>
      </AppShell>
    </CoreSpendHydrator>
  );
}
