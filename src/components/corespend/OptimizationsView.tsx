import { useCoreSpend, formatEUR } from "@/lib/corespend-store";

export function OptimizationsView() {
  const { optimizations: o, cockpit, goCockpit } = useCoreSpend();
  const total = o.inactiveSims.yearlyCost + o.duplicateLicenses.yearlyCost;

  const rows = [
    {
      title: "Inaktive SIM-Karten",
      desc: "SIM-Karten ohne Datenverkehr in den letzten 90 Tagen.",
      count: o.inactiveSims.count,
      unit: "SIMs",
      cost: o.inactiveSims.yearlyCost,
      tone: "danger" as const,
    },
    {
      title: "Doppelte Lizenzen & Optionen",
      desc: "Mehrfach gebuchte Optionen / überlappende Lizenzpakete.",
      count: o.duplicateLicenses.count,
      unit: "Lizenzen",
      cost: o.duplicateLicenses.yearlyCost,
      tone: "warning" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <button onClick={goCockpit} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          ← Zurück zum Management Cockpit
        </button>
        <div className="mt-2 flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Optimierungsvorschläge</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Identifizierte No-Usage- und Doppelungs-Posten · sofort realisierbare Einsparungen.
            </p>
          </div>
          <div className="rounded-xl border border-success/40 bg-success/10 px-5 py-3 text-right">
            <div className="text-[10px] uppercase tracking-wider text-success/90">Identifiziertes Sparpotenzial</div>
            <div className="text-2xl font-semibold tabular-nums text-success">{formatEUR(total)}</div>
            <div className="text-[10px] text-muted-foreground">
              {cockpit.savingsPercent.toFixed(1).replace(".", ",")} % des Stacks · / Jahr
            </div>
          </div>
        </div>
      </header>

      <div className="rounded-xl border border-border bg-surface/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background/50 text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Optimierung</th>
              <th className="text-right px-4 py-3">Anzahl</th>
              <th className="text-right px-4 py-3">Kosten / Jahr</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-border/60 align-top">
                <td className="px-4 py-3">
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {r.count} <span className="text-xs text-muted-foreground">{r.unit}</span>
                </td>
                <td className={
                  "px-4 py-3 text-right tabular-nums font-medium " +
                  (r.tone === "danger" ? "text-destructive" : "text-[hsl(32_95%_60%)]")
                }>
                  {formatEUR(r.cost)}
                </td>
              </tr>
            ))}
            <tr className="border-t border-border bg-background/40">
              <td className="px-4 py-3 text-sm font-semibold">Summe</td>
              <td className="px-4 py-3" />
              <td className="px-4 py-3 text-right tabular-nums font-semibold text-success">{formatEUR(total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Diese Werte werden live aus den Admin-Eingaben gespeist (Sektion „Daten für Optimierungs-Detailseite") und aktualisieren das Management Cockpit automatisch.
      </p>
    </div>
  );
}
