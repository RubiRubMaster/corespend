import { useState, type ReactNode } from "react";
import { useCoreSpend, formatEUR, type NegotiationStrategy } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";

type StepId = 1 | 2 | 3 | 4 | 5;

const STEP_TITLES: Record<StepId, string> = {
  1: "Strategische Ausrichtung",
  2: "Vertragslaufzeit",
  3: "Liquidität & Abrechnung",
  4: "Vertragsschutz-Klauseln",
  5: "Flotten-Infrastruktur",
};

export function MobilfunkStrategyWizard() {
  const { strategy, updateStrategy, setMobilfunkStage, resetStrategy, metrics } = useCoreSpend();
  const [step, setStep] = useState<StepId>(1);

  const next = () => setStep((s) => (s < 5 ? ((s + 1) as StepId) : s));
  const prev = () => setStep((s) => (s > 1 ? ((s - 1) as StepId) : s));

  const canAdvance =
    (step === 1 && strategy.approach !== null) ||
    (step === 2 && strategy.termMonths !== null) ||
    step === 3 ||
    step === 4 ||
    step === 5;

  // Impact-Schätzung (Demo-Heuristik)
  const impact = computeImpact(strategy, metrics.savingsYearly);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="glass-card p-6 space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span>Schritt {step} / 5 · {STEP_TITLES[step]}</span>
            <span>Verhandlungs-Strategie</span>
          </div>
          <div className="flex gap-1.5">
            {([1, 2, 3, 4, 5] as StepId[]).map((s) => (
              <div
                key={s}
                className={cn(
                  "flex-1 h-1.5 rounded-full transition-colors",
                  s <= step ? "bg-gradient-to-r from-primary to-success" : "bg-accent",
                )}
              />
            ))}
          </div>
        </div>

        {step === 1 && <Step1 strategy={strategy} update={updateStrategy} />}
        {step === 2 && <Step2 strategy={strategy} update={updateStrategy} />}
        {step === 3 && <Step3 strategy={strategy} update={updateStrategy} />}
        {step === 4 && <Step4 strategy={strategy} update={updateStrategy} />}
        {step === 5 && <Step5 strategy={strategy} update={updateStrategy} />}

        {/* Nav */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <button
            onClick={() => {
              if (step === 1) {
                resetStrategy();
                setMobilfunkStage("cockpit");
              } else {
                prev();
              }
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← {step === 1 ? "Zurück zum Cockpit" : "Zurück"}
          </button>
          {step < 5 ? (
            <button
              onClick={next}
              disabled={!canAdvance}
              className="rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Weiter →
            </button>
          ) : (
            <button
              onClick={() => setMobilfunkStage("mandate")}
              className="rounded-lg bg-gradient-to-r from-success to-primary text-success-foreground px-5 py-2.5 text-sm font-semibold hover:brightness-110 transition"
            >
              🔥 Verhandlungsmandat erstellen
            </button>
          )}
        </div>
      </div>

      {/* Sidebar: Impact */}
      <div className="glass-card p-6 space-y-5 h-fit">
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Strategie-Impact · Live
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Erwartete Verhandlungsmacht</div>
          <div className="mt-2 h-2 rounded-full bg-accent overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-success transition-all"
              style={{ width: `${impact.leveragePct}%` }}
            />
          </div>
          <div className="text-[10px] text-muted-foreground mt-1 tabular-nums">
            {impact.leveragePct}% · {impact.leverageLabel}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Geschätztes Verhandlungsergebnis</div>
          <div className="mt-1 text-2xl font-semibold text-success tabular-nums">
            {formatEUR(impact.expectedSavings)} <span className="text-xs text-muted-foreground font-normal">/ Jahr</span>
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Basis-Potenzial: {formatEUR(metrics.savingsYearly)} · Strategie-Hebel × {impact.multiplier.toFixed(2)}
          </div>
        </div>
        <ul className="space-y-2 text-xs text-muted-foreground border-t border-border pt-4">
          {impact.notes.map((n) => (
            <li key={n} className="flex items-start gap-2">
              <span className="text-success mt-0.5">✓</span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------- Helpers ------------- */

function computeImpact(s: NegotiationStrategy, base: number) {
  let m = 1;
  const notes: string[] = [];
  if (s.approach === "tender") { m += 0.18; notes.push("Marktausschreibung erzeugt maximale Drohkulisse"); }
  else if (s.approach === "renegotiate") { notes.push("Geräuschlose Nachverhandlung beim aktuellen Provider"); }
  if (s.termMonths === 36) { m += 0.08; notes.push("36 Monate · maximaler Rabatthebel"); }
  else if (s.termMonths === 24) { m += 0.03; notes.push("24 Monate Standard-Laufzeit"); }
  else if (s.termMonths === 12) { notes.push("12 Monate · maximale Flexibilität"); }
  if (s.payment.net90) { m += 0.04; notes.push("90 Tage netto · spürbare Cashflow-Verbesserung"); }
  else if (s.payment.net60) { m += 0.02; notes.push("60 Tage netto · erweiterte Liquidität"); }
  if (s.payment.consolidated) notes.push("Konsolidierte ERP-Gesamtrechnung");
  if (s.clauses.flexStaff) { m += 0.03; notes.push("Mitarbeiter-Flex-Klausel reduziert Risiko"); }
  if (s.clauses.techExit) { m += 0.02; notes.push("Technologie-Sonderkündigungsrecht abgesichert"); }
  if (s.fleet.esimMdm) notes.push("Vollautomatische eSIM/MDM-Provisionierung");
  if (s.fleet.multiSim) notes.push("Multi-SIM für Tablets vorgesehen");
  if (s.fleet.network !== "any") notes.push(`Netz-Vorgabe: ${networkLabel(s.fleet.network)}`);

  const leveragePct = Math.min(100, Math.round((m - 1) * 250 + 30));
  const leverageLabel =
    leveragePct >= 80 ? "Sehr hoch" : leveragePct >= 60 ? "Hoch" : leveragePct >= 40 ? "Solide" : "Basis";
  return {
    multiplier: m,
    leveragePct,
    leverageLabel,
    expectedSavings: Math.round(base * m),
    notes: notes.length ? notes : ["Wähle Optionen für eine Live-Schätzung des Hebels."],
  };
}

function networkLabel(n: NegotiationStrategy["fleet"]["network"]) {
  return n === "telekom" ? "Telekom" : n === "vodafone" ? "Vodafone" : n === "o2" ? "Telefónica/O2" : "egal";
}

/* ------------- Steps ------------- */

type StepProps = { strategy: NegotiationStrategy; update: (s: Partial<NegotiationStrategy>) => void };

function StepShell({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{intro}</p>
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  title,
  sub,
  badge,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  sub: string;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-xl border p-4 transition-all",
        selected
          ? "border-success bg-success/10 shadow-[0_10px_40px_-20px_color-mix(in_oklab,var(--success)_70%,transparent)]"
          : "border-border bg-background/40 hover:border-primary/50",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-4 w-4 rounded-full border-2 grid place-items-center",
              selected ? "border-success" : "border-border",
            )}
          >
            {selected && <div className="h-1.5 w-1.5 rounded-full bg-success" />}
          </div>
          <div>
            <div className="text-sm font-semibold">{title}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
          </div>
        </div>
        {badge && (
          <span className="text-[10px] uppercase tracking-wider text-success border border-success/40 bg-success/10 rounded-full px-2 py-0.5 whitespace-nowrap">
            {badge}
          </span>
        )}
      </div>
    </button>
  );
}

function CheckOption({
  checked,
  onChange,
  title,
  sub,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  sub: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "w-full text-left rounded-xl border p-4 transition-all",
        checked ? "border-success bg-success/10" : "border-border bg-background/40 hover:border-primary/50",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "h-4 w-4 rounded border-2 grid place-items-center mt-0.5 shrink-0",
            checked ? "border-success bg-success" : "border-border",
          )}
        >
          {checked && <span className="text-[10px] text-success-foreground leading-none">✓</span>}
        </div>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
        </div>
      </div>
    </button>
  );
}

function Step1({ strategy, update }: StepProps) {
  return (
    <StepShell
      title="Wie willst du verhandeln?"
      intro="Lege die strategische Ausrichtung fest. Du kannst leise nachverhandeln oder die volle Drohkulisse einer Marktausschreibung aufbauen."
    >
      <OptionCard
        selected={strategy.approach === "renegotiate"}
        onClick={() => update({ approach: "renegotiate" })}
        title="Geräuschlose Nachverhandlung"
        sub="Mit den ermittelten Einsparungen direkt beim aktuellen Provider — schnell, diskret, ohne Anbieterwechsel."
      />
      <OptionCard
        selected={strategy.approach === "tender"}
        onClick={() => update({ approach: "tender" })}
        title="Offene Marktausschreibung"
        sub="Maximale Drohkulisse inkl. Anbieterwechsel. Höchster Hebel, mehr Aufwand, deutlich besseres Ergebnis."
        badge="Max. Hebel"
      />
    </StepShell>
  );
}

function Step2({ strategy, update }: StepProps) {
  return (
    <StepShell
      title="Welchen Vertragshorizont willst du?"
      intro="Die Laufzeit bestimmt deine Flexibilität und gleichzeitig den verhandelbaren Rabatt."
    >
      <OptionCard
        selected={strategy.termMonths === 12}
        onClick={() => update({ termMonths: 12 })}
        title="12 Monate"
        sub="Maximale Flexibilität · ideal bei Marktunsicherheit oder Transformationsphasen."
      />
      <OptionCard
        selected={strategy.termMonths === 24}
        onClick={() => update({ termMonths: 24 })}
        title="24 Monate"
        sub="Standard für mittelständische Enterprise-Verträge · solider Rabatt."
      />
      <OptionCard
        selected={strategy.termMonths === 36}
        onClick={() => update({ termMonths: 36 })}
        title="36 Monate"
        sub="Maximaler Rabatthebel · empfehlenswert bei stabiler Belegschaft und klarem Tech-Stack."
        badge="Max. Rabatt"
      />
    </StepShell>
  );
}

function Step3({ strategy, update }: StepProps) {
  return (
    <StepShell
      title="Wie soll abgerechnet werden?"
      intro="Erweiterte Zahlungsziele optimieren deinen Cashflow. Eine konsolidierte Gesamtrechnung erleichtert die ERP-Verbuchung."
    >
      <CheckOption
        checked={strategy.payment.net60}
        onChange={(v) => update({ payment: { ...strategy.payment, net60: v, net90: v ? false : strategy.payment.net90 } })}
        title="Zahlungsziel 60 Tage netto"
        sub="Erweiterte Liquidität · branchenüblich für Enterprise-Kunden."
      />
      <CheckOption
        checked={strategy.payment.net90}
        onChange={(v) => update({ payment: { ...strategy.payment, net90: v, net60: v ? false : strategy.payment.net60 } })}
        title="Zahlungsziel 90 Tage netto"
        sub="Maximale Cashflow-Optimierung · stärkstes Liquiditäts-Argument im Konzern."
      />
      <CheckOption
        checked={strategy.payment.consolidated}
        onChange={(v) => update({ payment: { ...strategy.payment, consolidated: v } })}
        title="Konsolidierte ERP-Gesamtrechnung"
        sub="Eine Rechnung pro Monat statt Einzelpositionen — direkt buchungsfähig in SAP & Co."
      />
    </StepShell>
  );
}

function Step4({ strategy, update }: StepProps) {
  return (
    <StepShell
      title="Welche Schutzklauseln willst du?"
      intro="Harte Klauseln, die du in den Vertrag verhandeln willst, um dich gegen unternehmerische Risiken abzusichern."
    >
      <CheckOption
        checked={strategy.clauses.flexStaff}
        onChange={(v) => update({ clauses: { ...strategy.clauses, flexStaff: v } })}
        title="Mitarbeiter-Flex-Klausel"
        sub="Recht, bei Personalabbau bis zu 20 % der SIM-Karten fristlos & ohne Strafgebühren abzuschalten."
      />
      <CheckOption
        checked={strategy.clauses.techExit}
        onChange={(v) => update({ clauses: { ...strategy.clauses, techExit: v } })}
        title="Technologie-Wechselrecht"
        sub="Sonderkündigungsrecht, falls der Provider an Schlüsselstandorten keine stabile 5G-Leistung liefert."
      />
    </StepShell>
  );
}

function Step5({ strategy, update }: StepProps) {
  return (
    <StepShell
      title="Welche Flotten-Infrastruktur ist Pflicht?"
      intro="Operative Must-Haves für die technische Umsetzung deiner Mobilfunk-Flotte."
    >
      <CheckOption
        checked={strategy.fleet.esimMdm}
        onChange={(v) => update({ fleet: { ...strategy.fleet, esimMdm: v } })}
        title="Vollautomatische eSIM/MDM-Aktivierung"
        sub="Provisionierung über Mobile Device Management — ohne Plastikkarten oder Versand."
      />
      <CheckOption
        checked={strategy.fleet.multiSim}
        onChange={(v) => update({ fleet: { ...strategy.fleet, multiSim: v } })}
        title="Multi-SIM für Tablets"
        sub="Eine Nummer auf Smartphone + Tablet · ohne Doppelvertrag."
      />
      <div className="rounded-xl border border-border bg-background/40 p-4">
        <div className="text-sm font-semibold mb-2">Netzvorgabe</div>
        <div className="text-xs text-muted-foreground mb-3">Strikte Netzpräferenz für sicherheits- oder qualitätskritische Standorte.</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(["any", "telekom", "vodafone", "o2"] as const).map((n) => (
            <button
              key={n}
              onClick={() => update({ fleet: { ...strategy.fleet, network: n } })}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                strategy.fleet.network === n
                  ? "border-success bg-success/10 text-success"
                  : "border-border bg-background/40 hover:border-primary/50",
              )}
            >
              {networkLabel(n)}
            </button>
          ))}
        </div>
      </div>
    </StepShell>
  );
}
