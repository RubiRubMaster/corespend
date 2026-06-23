import { useState } from "react";
import { useCoreSpend, formatEUR, OFFICE_DEFAULTS, SAAS_DEFAULTS } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";

const usd = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);

export function AdminPanel() {
  const [open, setOpen] = useState(false);
  const {
    mobilfunkStatus,
    setMobilfunkStatus,
    spendOverride,
    savingsOverride,
    setSpendOverride,
    setSavingsOverride,
    effectiveSpendMonthly,
    effectiveSavingsYearly,
    basePriceOverride,
    discountPerAreaOverride,
    effectiveBasePrice,
    effectiveDiscountPerArea,
    setBasePriceOverride,
    setDiscountPerAreaOverride,
    consultantBriefing,
    tickerItems,
    tickerOverrides,
    updateTickerItem,
    resetTickerItem,
    officeSuiteEnabled,
    saasAiEnabled,
    setOfficeSuiteEnabled,
    setSaasAiEnabled,
    officeSpendOverride,
    officeSavingsOverride,
    saasSpendOverride,
    saasDamageOverride,
    setOfficeSpendOverride,
    setOfficeSavingsOverride,
    setSaasSpendOverride,
    setSaasDamageOverride,
    effectiveOfficeSpend,
    effectiveOfficeSavings,
    effectiveSaasSpend,
    effectiveSaasDamage,
    saasScenario,
    setSaasScenario,
    resetAll,
  } = useCoreSpend();

  const live = mobilfunkStatus === "analyzed";

  return (
    <div className="border-b border-border bg-surface/40">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-6 py-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        Admin · Demo-Steuerung
        <span className="ml-auto text-xs">{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        <div className="px-6 pb-4 pt-1 grid gap-3 md:grid-cols-[1.1fr_1fr_1fr_auto] items-end">
          <label className="flex items-center gap-3 rounded-lg border border-border bg-background/40 px-3 py-2.5">
            <input
              type="checkbox"
              checked={live}
              onChange={(e) => setMobilfunkStatus(e.target.checked ? "analyzed" : "idle")}
              className="h-4 w-4 accent-success"
            />
            <span className="text-xs leading-tight">
              <span className="block font-medium text-foreground">Mobilfunk-Analyse abgeschlossen</span>
              <span className={cn("block", live ? "text-success" : "text-muted-foreground")}>
                {live ? "State C aktiv · Dashboard live" : "Inaktiv · Werte sind gesperrt"}
              </span>
            </span>
          </label>

          <NumField
            label="Validierte IT-Ausgaben (€ / Monat)"
            value={spendOverride ?? effectiveSpendMonthly}
            placeholder="z. B. 18420"
            onChange={(n) => setSpendOverride(Number.isFinite(n) ? n : null)}
            onClear={() => setSpendOverride(null)}
            cleared={spendOverride === null}
            hint={`Aktuell: ${formatEUR(effectiveSpendMonthly)} / Mo.`}
          />

          <NumField
            label="Einsparpotenzial (€ / Jahr)"
            value={savingsOverride ?? effectiveSavingsYearly}
            placeholder="z. B. 24320"
            onChange={(n) => setSavingsOverride(Number.isFinite(n) ? n : null)}
            onClear={() => setSavingsOverride(null)}
            cleared={savingsOverride === null}
            hint={`Aktuell: ${formatEUR(effectiveSavingsYearly)} / Jahr`}
          />

          <button
            onClick={resetAll}
            className="rounded-lg border border-border bg-background/40 px-3 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:border-destructive/40 transition"
          >
            Demo zurücksetzen
          </button>

          <div className="md:col-span-4 grid gap-3 md:grid-cols-2">
            <NumField
              label="Lizenz-Basispreis (€ / Monat)"
              value={basePriceOverride ?? effectiveBasePrice}
              placeholder="z. B. 3200"
              onChange={(n) => setBasePriceOverride(Number.isFinite(n) ? n : null)}
              onClear={() => setBasePriceOverride(null)}
              cleared={basePriceOverride === null}
              hint={`Aktuell: ${formatEUR(effectiveBasePrice)} / Mo. (Standard 3.200 €)`}
            />
            <NumField
              label="Data-Contribution Bonus (€ / Bereich)"
              value={discountPerAreaOverride ?? effectiveDiscountPerArea}
              placeholder="z. B. 350"
              onChange={(n) => setDiscountPerAreaOverride(Number.isFinite(n) ? n : null)}
              onClear={() => setDiscountPerAreaOverride(null)}
              cleared={discountPerAreaOverride === null}
              hint={`Aktuell: −${formatEUR(effectiveDiscountPerArea)} pro Bereich (Standard 350 €)`}
            />
          </div>

          {/* Office-Suite + SaaS / AI · Bereichs-Steuerung */}
          <div className="md:col-span-4 rounded-lg border border-success/30 bg-success/5 p-3 space-y-3">
            <div className="text-[10px] uppercase tracking-wider text-success flex items-center gap-1.5">
              🧩 Analyse Cockpit · Bereiche & KPI-Simulatoren
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <ToggleRow
                label="Office-Suite aktiv (Microsoft 365 / Workspace)"
                checked={officeSuiteEnabled}
                onChange={setOfficeSuiteEnabled}
                hint={officeSuiteEnabled ? "Sichtbar · zählt zur Lizenz-Berechnung (−Bonus)" : "Ausgeblendet · kein Bonus"}
              />
              <ToggleRow
                label="SaaS / AI aktiv (Consumption & Token)"
                checked={saasAiEnabled}
                onChange={setSaasAiEnabled}
                hint={saasAiEnabled ? "Sichtbar · zählt zur Lizenz-Berechnung (−Bonus)" : "Ausgeblendet · kein Bonus"}
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <NumField
                label="Office · Total License Spend (€/Mo.)"
                value={officeSpendOverride ?? effectiveOfficeSpend}
                placeholder={`${OFFICE_DEFAULTS.totalSpend}`}
                onChange={(n) => setOfficeSpendOverride(Number.isFinite(n) ? n : null)}
                onClear={() => setOfficeSpendOverride(null)}
                cleared={officeSpendOverride === null}
                hint={`Aktuell: ${formatEUR(effectiveOfficeSpend)} (Standard ${formatEUR(OFFICE_DEFAULTS.totalSpend)})`}
              />
              <NumField
                label="Office · Identifiziertes Potenzial (€/Mo.)"
                value={officeSavingsOverride ?? effectiveOfficeSavings}
                placeholder={`${OFFICE_DEFAULTS.potential}`}
                onChange={(n) => setOfficeSavingsOverride(Number.isFinite(n) ? n : null)}
                onClear={() => setOfficeSavingsOverride(null)}
                cleared={officeSavingsOverride === null}
                hint={`Aktuell: ${formatEUR(effectiveOfficeSavings)} (Standard ${formatEUR(OFFICE_DEFAULTS.potential)})`}
              />
              <NumField
                label="SaaS / AI · Month-to-Date Spend ($)"
                value={saasSpendOverride ?? effectiveSaasSpend}
                placeholder={`${SAAS_DEFAULTS.mtdSpend}`}
                onChange={(n) => setSaasSpendOverride(Number.isFinite(n) ? n : null)}
                onClear={() => setSaasSpendOverride(null)}
                cleared={saasSpendOverride === null}
                hint={`Aktuell: ${usd(effectiveSaasSpend)} (Standard ${usd(SAAS_DEFAULTS.mtdSpend)})`}
              />
              <NumField
                label="SaaS / AI · Identifizierter Schaden ($)"
                value={saasDamageOverride ?? (saasScenario === "normal" ? 0 : SAAS_DEFAULTS.damage)}
                placeholder={`${SAAS_DEFAULTS.damage}`}
                onChange={(n) => setSaasDamageOverride(Number.isFinite(n) ? n : null)}
                onClear={() => setSaasDamageOverride(null)}
                cleared={saasDamageOverride === null}
                hint={`Aktuell: ${usd(effectiveSaasDamage)} · Szenario: ${saasScenario === "anomaly" ? "Anomalie" : "Normal (0 $)"}`}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground mr-1">
                Daten-Szenario · SaaS / AI:
              </span>
              <button
                onClick={() => setSaasScenario("normal")}
                className={cn(
                  "text-xs rounded-md border px-3 py-1.5 transition",
                  saasScenario === "normal"
                    ? "border-success/60 bg-success/15 text-success"
                    : "border-border bg-background/40 text-muted-foreground hover:text-foreground",
                )}
              >
                🟢 Normaler Verbrauch
              </button>
              <button
                onClick={() => setSaasScenario("anomaly")}
                className={cn(
                  "text-xs rounded-md border px-3 py-1.5 transition",
                  saasScenario === "anomaly"
                    ? "border-destructive/60 bg-destructive/15 text-destructive"
                    : "border-border bg-background/40 text-muted-foreground hover:text-foreground",
                )}
              >
                🔴 KI-Anomalie am 10. Juni
              </button>
            </div>
          </div>



          <div className="md:col-span-4 rounded-lg border border-primary/30 bg-primary/5 p-3">
            <div className="text-[10px] uppercase tracking-wider text-primary mb-1.5 flex items-center gap-1.5">
              🤖 AI Consultant · Kundenbriefing (Mobilfunk-Nebenabreden)
            </div>
            {consultantBriefing.trim() ? (
              <pre className="text-xs whitespace-pre-wrap font-sans text-foreground/90 leading-relaxed max-h-40 overflow-y-auto">
                {consultantBriefing}
              </pre>
            ) : (
              <div className="text-xs text-muted-foreground italic">
                Noch keine Eingabe — wird sichtbar, sobald der Kunde im Mobilfunk-Onboarding das Consultant-Textfeld ausgefüllt hat.
              </div>
            )}
          </div>

          <div className="md:col-span-4 rounded-lg border border-border bg-background/40 p-3 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              📊 Management Briefing · Texte anpassen
            </div>
            {tickerItems.map((t, i) => {
              const overridden = !!tickerOverrides[i];
              return (
                <div key={i} className="flex items-start gap-2">
                  <select
                    value={t.tone}
                    onChange={(e) => updateTickerItem(i, { tone: e.target.value as typeof t.tone })}
                    className="bg-background/60 border border-border rounded px-1.5 py-1 text-[11px] text-foreground focus:outline-none"
                  >
                    <option value="danger">danger</option>
                    <option value="warning">warning</option>
                    <option value="success">success</option>
                  </select>
                  <textarea
                    value={t.text}
                    onChange={(e) => updateTickerItem(i, { text: e.target.value })}
                    rows={2}
                    className="flex-1 bg-background/60 border border-border rounded px-2 py-1 text-[11px] text-foreground focus:outline-none resize-y"
                  />
                  {overridden && (
                    <button
                      onClick={() => resetTickerItem(i)}
                      className="text-[10px] text-muted-foreground hover:text-destructive shrink-0 mt-1"
                      title="Auf Standardtext zurücksetzen"
                    >
                      ↺
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function NumField({
  label, value, placeholder, onChange, onClear, cleared, hint,
}: {
  label: string; value: number; placeholder: string;
  onChange: (n: number) => void; onClear: () => void; cleared: boolean; hint: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background/40 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="flex items-center gap-2 mt-1">
        <input
          type="number"
          value={cleared ? "" : value}
          placeholder={placeholder}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "") return onClear();
            onChange(Number(v));
          }}
          className="flex-1 bg-transparent text-sm tabular-nums focus:outline-none placeholder:text-muted-foreground/60"
        />
        {!cleared && (
          <button onClick={onClear} className="text-[10px] text-muted-foreground hover:text-destructive">×</button>
        )}
      </div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{hint}</div>
    </div>
  );
}
