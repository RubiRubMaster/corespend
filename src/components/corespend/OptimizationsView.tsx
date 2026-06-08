import { useCoreSpend, formatEUR } from "@/lib/corespend-store";

export function OptimizationsView() {
  const { optimizations: o, goCockpit } = useCoreSpend();
  const totalNoUsage = o.noUsage.reduce((s, it) => s + (Number(it.yearlyCost) || 0), 0);
  const totalTariff = o.tariffMismatches.reduce((s, it) => s + (Number(it.yearlyCost) || 0), 0);
  const total = totalNoUsage + totalTariff;

  return (
    <div className="space-y-8">
      <header>
        <button onClick={goCockpit} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          ← Zurück zum Management Cockpit
        </button>
        <div className="mt-3 flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Einspar- und Optimierungspotenzial</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
              Identifizierte Karteileichen, Tarif-Mismatches und Konsolidierungs-Hebel. Werte aktualisieren sich live aus den Admin-Eingaben.
            </p>
          </div>
          <div className="rounded-xl border border-success/40 bg-success/10 px-6 py-4 text-right">
            <div className="text-[10px] uppercase tracking-[0.22em] text-success/90">Sofort realisierbar</div>
            <div className="text-3xl font-semibold tabular-nums text-success leading-none mt-2">
              {formatEUR(total)}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">/ Jahr</div>
          </div>
        </div>
      </header>

      {/* Section A: No-Usage */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold tracking-tight flex items-center gap-2">
            <span>🗑️</span> No-Usage-Analysen (Karteileichen &amp; ungenutzte Lizenzen)
          </h2>
          <span className="text-xs tabular-nums text-muted-foreground">
            Σ {formatEUR(totalNoUsage)} / Jahr
          </span>
        </div>

        <div className="rounded-xl border border-border bg-surface/40 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-background/50 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Bezeichnung / Asset</th>
                <th className="text-left px-4 py-3">IT-Bereich</th>
                <th className="text-right px-4 py-3">Anzahl</th>
                <th className="text-right px-4 py-3">Verlust / Jahr</th>
                <th className="text-left px-4 py-3">Empfohlene Sofortmaßnahme</th>
              </tr>
            </thead>
            <tbody>
              {o.noUsage.map((it, i) => (
                <tr key={i} className="border-t border-border/60 align-top">
                  <td className="px-4 py-3 font-medium max-w-sm">{it.label}</td>
                  <td className="px-4 py-3 text-foreground/80">{it.area}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {it.count} <span className="text-xs text-muted-foreground">{it.unit}</span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-destructive font-medium">
                    {formatEUR(it.yearlyCost)}
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground/85">{it.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section B: Tariff Mismatches */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold tracking-tight flex items-center gap-2">
            <span>⚙️</span> Tarif-Mismatches &amp; Options-Konsolidierung
          </h2>
          <span className="text-xs tabular-nums text-muted-foreground">
            Σ {formatEUR(totalTariff)} / Jahr
          </span>
        </div>

        <div className="rounded-xl border border-border bg-surface/40 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-background/50 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Vertrag / Option</th>
                <th className="text-left px-4 py-3">IT-Bereich</th>
                <th className="text-right px-4 py-3">Potenzial / Jahr</th>
                <th className="text-left px-4 py-3">Erklärung / Hebel</th>
              </tr>
            </thead>
            <tbody>
              {o.tariffMismatches.map((it, i) => (
                <tr key={i} className="border-t border-border/60 align-top">
                  <td className="px-4 py-3 font-medium max-w-sm">{it.label}</td>
                  <td className="px-4 py-3 text-foreground/80">{it.area}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-success font-medium">
                    {formatEUR(it.yearlyCost)}
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground/85">{it.lever}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Grand total strip */}
      <div className="rounded-xl border border-success/30 bg-success/5 px-5 py-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Gesamtes identifiziertes Sparpotenzial</span>
        <span className="text-2xl font-semibold tabular-nums text-success">{formatEUR(total)} / Jahr</span>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Werte werden live aus den Admin-Eingaben gespeist und aktualisieren das Management Cockpit automatisch.
      </p>
    </div>
  );
}
