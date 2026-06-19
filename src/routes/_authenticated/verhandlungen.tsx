import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { CoreSpendHydrator } from "@/components/corespend/CoreSpendHydrator";
import { AppShell } from "@/components/corespend/AppShell";
import { NEGOTIATIONS, STATUS_META, type NegotiationStatus } from "@/lib/negotiations";

export const Route = createFileRoute("/_authenticated/verhandlungen")({
  head: () => ({
    meta: [
      { title: "CoreSpend · Verhandlungs-Portfolio" },
      { name: "description", content: "Alle anstehenden und geschlossenen Vertragsverhandlungen auf einen Blick." },
    ],
  }),
  component: VerhandlungenPage,
});

const FILTERS: { key: "alle" | NegotiationStatus; label: string }[] = [
  { key: "alle", label: "Alle" },
  { key: "analyse", label: "In Analyse" },
  { key: "strategie", label: "Strategie bereit" },
  { key: "verhandlung", label: "In Verhandlung" },
  { key: "geschlossen", label: "Erfolgreich geschlossen" },
];

function VerhandlungenPage() {
  const sorted = [...NEGOTIATIONS].sort((a, b) => {
    // open negotiations first, sorted by daysRemaining ascending; closed at the end
    if (a.daysRemaining < 0 && b.daysRemaining >= 0) return 1;
    if (b.daysRemaining < 0 && a.daysRemaining >= 0) return -1;
    return a.daysRemaining - b.daysRemaining;
  });

  const counts = FILTERS.reduce<Record<string, number>>((acc, f) => {
    acc[f.key] = f.key === "alle" ? NEGOTIATIONS.length : NEGOTIATIONS.filter((n) => n.status === f.key).length;
    return acc;
  }, {});

  return (
    <CoreSpendHydrator>
      <AppShell>
        <div className="space-y-8">
          <header className="space-y-2">
            <Link
              to="/app"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Zurück zum Core Cockpit
            </Link>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              CoreSpend · Verhandlungs-Portfolio
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Status Verhandlungen</h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Vollständige Übersicht aller laufenden und abgeschlossenen Vertragsverhandlungen über alle Kernbereiche hinweg.
            </p>
          </header>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <span
                key={f.key}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/40 px-3 py-1.5 text-xs text-muted-foreground"
              >
                {f.label}
                <span className="tabular-nums text-foreground/80">{counts[f.key] ?? 0}</span>
              </span>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-surface/40 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-background/50 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Bereich</th>
                  <th className="text-left px-4 py-3">Vertrag / Anbieter</th>
                  <th className="text-left px-4 py-3">Vertragsende</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((n, i) => {
                  const meta = STATUS_META[n.status];
                  return (
                    <tr key={i} className="border-t border-border/60 hover:bg-surface/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{n.area}</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground/90">{n.vendor}</td>
                      <td className="px-4 py-3 text-foreground/80 tabular-nums">{n.endLabel}</td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border font-medium", meta.cls)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
                          {meta.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Datenbasis: aktive CoreSpend-Mandate · Aktualisierung in Echtzeit nach jedem Verhandlungs-Schritt.
          </p>
        </div>
      </AppShell>
    </CoreSpendHydrator>
  );
}
