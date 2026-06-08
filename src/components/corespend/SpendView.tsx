import { useCoreSpend, formatEUR } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";

export function SpendView() {
  const { spendBreakdown, cockpit, goCockpit } = useCoreSpend();
  const total = cockpit.spendMonthly;
  const maxMonthly = Math.max(...spendBreakdown.map((a) => a.monthly), 1);

  return (
    <div className="space-y-6">
      <header>
        <button onClick={goCockpit} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          ← Zurück zum Core Cockpit
        </button>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">Validierte IT-Ausgaben</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
          Vollständige Budget-Transparenz nach den fünf IT-Kernbereichen. Die Summe entspricht der validierten Datenbasis des Core Cockpits.
        </p>
      </header>

      {/* Bar chart mockup + totals */}
      <section className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-border bg-surface/40 p-5">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
            Kostenaufteilung · Monat
          </div>
          <ul className="space-y-3">
            {spendBreakdown.map((a) => {
              const pct = total > 0 ? Math.round((a.monthly / total) * 100) : 0;
              const barPct = (a.monthly / maxMonthly) * 100;
              return (
                <li key={a.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-medium">
                      <span>{a.emoji}</span> {a.label}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {formatEUR(a.monthly)} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-background overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 flex flex-col justify-center">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Gesamt · validiert
          </div>
          <div className="text-3xl font-semibold tabular-nums tracking-tight mt-2">
            {formatEUR(total)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">/ Monat</div>
          <div className="text-xs text-muted-foreground mt-3 leading-snug">
            {formatEUR(total * 12)} hochgerechnet auf das Geschäftsjahr.
          </div>
        </div>
      </section>

      {/* Budget Table */}
      <div className="rounded-xl border border-border bg-surface/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background/50 text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">IT-Bereich</th>
              <th className="text-right px-4 py-3">Kosten / Monat</th>
              <th className="text-right px-4 py-3">Kosten / Jahr</th>
              <th className="text-right px-4 py-3">Trend vs. Vorjahr</th>
            </tr>
          </thead>
          <tbody>
            {spendBreakdown.map((a) => {
              const up = a.yoyPercent >= 0;
              return (
                <tr key={a.key} className="border-t border-border/60">
                  <td className="px-4 py-3 font-medium">
                    <span className="mr-2">{a.emoji}</span>{a.label}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatEUR(a.monthly)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-foreground/90">
                    {formatEUR(a.monthly * 12)}
                  </td>
                  <td className={cn("px-4 py-3 text-right tabular-nums text-xs", up ? "text-destructive" : "text-success")}>
                    {up ? "▲" : "▼"} {up ? "+" : ""}{a.yoyPercent.toFixed(1).replace(".", ",")} %
                  </td>
                </tr>
              );
            })}
            <tr className="border-t-2 border-border bg-background/40 font-semibold">
              <td className="px-4 py-3">Summe</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatEUR(total)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatEUR(total * 12)}</td>
              <td className="px-4 py-3"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button className="rounded-lg border border-border bg-surface/40 hover:bg-surface/60 hover:border-primary/30 px-4 py-2 text-sm transition-colors flex items-center gap-2">
          <span>📄</span> Budget-Report für Finanzen exportieren
        </button>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Diese Werte werden live aus den Admin-Eingaben gespeist (Sektion „Daten für „Validierte IT-Ausgaben"").
      </p>
    </div>
  );
}
