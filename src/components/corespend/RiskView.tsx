import { useCoreSpend, formatEUR, type RiskStatus } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";

const STATUS_META: Record<RiskStatus, { label: string; tone: "danger" | "warning" | "success"; Icon: typeof AlertCircle }> = {
  akut: { label: "Akuter Handlungsbedarf", tone: "danger", Icon: AlertCircle },
  verhandlung: { label: "In Verhandlung", tone: "warning", Icon: Clock },
  sicher: { label: "Sicher", tone: "success", Icon: CheckCircle },
};

export function RiskView() {
  const { riskItems, cockpit, goCockpit } = useCoreSpend();
  const total = cockpit.riskExposure;

  return (
    <div className="space-y-6">
      <header>
        <button onClick={goCockpit} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          ← Zurück zum Management Cockpit
        </button>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">Vertragsrisiko &amp; Financial Exposure Analyse</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
          Diese Übersicht zeigt das gesamte finanzielle Vertragsvolumen (Liability), das aktuell ungekündigt läuft oder sich in einer kritischen Verhandlungsphase befindet.
        </p>
      </header>

      <section className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Gesamtes Vertragsrisiko (Liability)
          </div>
          <div className="text-3xl font-semibold tabular-nums tracking-tight text-destructive mt-2">
            {formatEUR(total)}
          </div>
        </div>
        <div className="text-xs text-muted-foreground text-right max-w-xs leading-snug">
          Summe aller laufenden Restvolumen aus aktiven Verträgen mit Handlungs- bzw. Verhandlungsbedarf.
        </div>
      </section>

      <div className="rounded-xl border border-border bg-surface/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background/50 text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Vertragspartner</th>
              <th className="text-left px-4 py-3">Bereich</th>
              <th className="text-right px-4 py-3">Gebundenes Restvolumen</th>
              <th className="text-right px-4 py-3">Risiko-Status</th>
            </tr>
          </thead>
          <tbody>
            {riskItems.map((r, i) => {
              const meta = STATUS_META[r.status];
              const Icon = meta.Icon;
              return (
                <tr key={i} className="border-t border-border/60">
                  <td className="px-4 py-3 font-medium">{r.vendor}</td>
                  <td className="px-4 py-3 text-foreground/90">{r.area}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatEUR(r.remainingVolume)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Icon className={cn(
                        "h-3.5 w-3.5",
                        meta.tone === "danger" && "text-destructive",
                        meta.tone === "warning" && "text-[hsl(32_95%_60%)]",
                        meta.tone === "success" && "text-success",
                      )} />
                      <span className={cn(
                        "text-xs",
                        meta.tone === "danger" && "text-destructive",
                        meta.tone === "warning" && "text-[hsl(32_95%_60%)]",
                        meta.tone === "success" && "text-success",
                      )}>
                        {meta.label}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
            <tr className="border-t-2 border-border bg-background/40 font-semibold">
              <td className="px-4 py-3" colSpan={2}>Summe Liability</td>
              <td className="px-4 py-3 text-right tabular-nums text-destructive">{formatEUR(total)}</td>
              <td className="px-4 py-3"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Diese Tabelle wird live aus den Admin-Eingaben gespeist (Sektion „Daten für „Vertragsrisiko"").
      </p>
    </div>
  );
}
