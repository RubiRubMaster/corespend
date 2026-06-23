import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCoreSpend, formatEUR, PRICING } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { ContractsTable } from "./ContractsTable";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from "recharts";

export function ManagementDashboard() {
  const {
    mobilfunkStatus, metrics, goMobilfunk,
    currentPrice, totalDiscount, activatedAreas,
    effectiveSpendMonthly, effectiveSavingsYearly, timeMode,
    globalSpendMonthly, globalSavingsYearly,
    officeSuiteEnabled, saasAiEnabled,
    effectiveOfficeSpend, effectiveOfficeSavings,
    effectiveSaasSpend, effectiveSaasDamage,
    goOfficeSuite, goSaasAi,
  } = useCoreSpend();
  const mobilfunkLive = mobilfunkStatus === "analyzed";
  const live = mobilfunkLive;
  const yearly = timeMode === "yearly";
  const unit = yearly ? "/ Jahr" : "/ Monat";
  const unitShort = yearly ? "/ Jahr" : "/ Mo.";
  const spendDisplay = yearly ? globalSpendMonthly * 12 : globalSpendMonthly;
  const savingsDisplay = yearly ? globalSavingsYearly : Math.floor(globalSavingsYearly / 12);
  const spendLabel = yearly ? "Validierte Jahresausgaben (Gesamt)" : "Validierte Monatsausgaben (Gesamt)";
  const telcoCost = yearly ? metrics.costMonthly * 12 : metrics.costMonthly;
  const telcoSavings = yearly ? metrics.savingsYearly : Math.floor(metrics.savingsYearly / 12);

  const prev = useRef(currentPrice);
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (prev.current !== currentPrice) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 1200);
      prev.current = currentPrice;
      return () => clearTimeout(t);
    }
  }, [currentPrice]);

  return (
    <div className="space-y-8">
      <header className="space-y-5">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              CoreSpend · Controlling Layer
            </div>
            <h1 className="text-3xl font-semibold tracking-tight mt-1">
              📊 Core Analytics
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
              Die detaillierte Analyse- und Controlling-Zentrale für alle Segmente Ihres IT-Stacks.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            Live · zuletzt synchronisiert vor 2 Min.
          </div>
        </div>

        {/* Global KPI row + pricing */}
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] items-stretch">
          <div className="grid grid-cols-3 gap-3">
            <GlobalKpi
              label={spendLabel}
              value={globalSpendMonthly > 0 ? `${formatEUR(spendDisplay)} ${unit}` : `— ${unit}`}
            />
            <GlobalKpi
              label="Identifiziertes Einsparpotenzial"
              value={globalSavingsYearly > 0 ? `${formatEUR(savingsDisplay)} ${unit}` : `— ${unit}`}
              tone="success"
            />
            <GlobalKpi
              label="Aktive Bereiche"
              value={`${activatedAreas} / ${PRICING.TOTAL_AREAS} Bereiche analysiert`}
              tone="muted"
            />
          </div>
          <div
            className={cn(
              "rounded-xl border px-6 py-5 flex flex-col leading-tight min-w-[320px] justify-center",
              totalDiscount > 0
                ? "border-success/40 bg-gradient-to-br from-success/15 to-primary/10"
                : "border-border bg-surface/50",
            )}
          >
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              CoreSpend Enterprise Lizenz
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={cn("text-2xl font-semibold tabular-nums leading-tight", flash && "animate-flash-success")}>
                {formatEUR(currentPrice)}
                <span className="text-sm font-normal text-muted-foreground"> / Monat</span>
              </span>
              {totalDiscount > 0 && (
                <span className="text-sm text-muted-foreground line-through tabular-nums">
                  {formatEUR(PRICING.BASE_PRICE)}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground mt-1">
              Basis {formatEUR(PRICING.BASE_PRICE)} · Data-Contribution Bonus −{formatEUR(PRICING.DISCOUNT_PER_AREA)} pro geteiltem Bereich
            </span>
          </div>
        </div>
      </header>

      {/* Segment-Filter */}
      <div className="glass-card px-4 py-3 flex flex-wrap items-center gap-2">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground mr-2">Segment-Filter</span>
        <button
          onClick={goMobilfunk}
          className="inline-flex items-center gap-1.5 text-xs rounded-full border border-success/40 bg-success/10 text-success px-3 py-1.5 font-medium hover:bg-success/15 transition-colors"
        >
          📞 Telekommunikation <span className="text-[10px] uppercase tracking-wider opacity-80">Aktiv</span>
        </button>
        {officeSuiteEnabled ? (
          <button
            onClick={goOfficeSuite}
            className="inline-flex items-center gap-1.5 text-xs rounded-full border border-success/40 bg-success/10 text-success px-3 py-1.5 font-medium hover:bg-success/15 transition-colors"
          >
            💻 Office-Suite <span className="text-[10px] uppercase tracking-wider opacity-80">Aktiv</span>
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs rounded-full border border-border bg-surface/40 text-muted-foreground px-3 py-1.5 opacity-60 cursor-not-allowed">
            🔒 💻 Office-Suite
          </span>
        )}
        {saasAiEnabled ? (
          <button
            onClick={goSaasAi}
            className="inline-flex items-center gap-1.5 text-xs rounded-full border border-success/40 bg-success/10 text-success px-3 py-1.5 font-medium hover:bg-success/15 transition-colors"
          >
            ☁️ SaaS / AI <span className="text-[10px] uppercase tracking-wider opacity-80">Aktiv</span>
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs rounded-full border border-border bg-surface/40 text-muted-foreground px-3 py-1.5 opacity-60 cursor-not-allowed">
            🔒 ☁️ SaaS / AI
          </span>
        )}
        {[
          { e: "🌩", l: "Cloud" },
          { e: "🔌", l: "Hardware" },
        ].map((s) => (
          <span
            key={s.l}
            className="inline-flex items-center gap-1.5 text-xs rounded-full border border-border bg-surface/40 text-muted-foreground px-3 py-1.5 opacity-60 cursor-not-allowed"
            title="Coming Soon"
          >
            🔒 {s.e} {s.l}
          </span>
        ))}
      </div>

      {/* Global Analytics Charts */}
      <GlobalAnalyticsCharts
        telcoMonthly={metrics.costMonthly}
        telcoSavingsMonthly={Math.round(metrics.savingsYearly / 12)}
        officeMonthly={officeSuiteEnabled ? effectiveOfficeSpend : 0}
        officeSavings={officeSuiteEnabled ? effectiveOfficeSavings : 0}
        saasMonthly={saasAiEnabled ? effectiveSaasSpend : 0}
        saasSavings={saasAiEnabled ? effectiveSaasDamage : 0}
      />






      {/* 1 · Telekommunikation (active, split into 3) */}
      <CategoryTile
        emoji="📞"
        title="Telekommunikation"
        subtitle="Mobilfunk · Festnetz · Daten / Standortvernetzung"
        statusBadge={mobilfunkLive ? { label: "Aktiv", tone: "success" } : { label: "Teil-aktiv", tone: "primary" }}
        kpis={[
          { label: "Ist-Kosten (kumuliert)", value: mobilfunkLive ? `${formatEUR(telcoCost)} ${unitShort}` : "—" },
          { label: "Benchmark-Abweichung", value: mobilfunkLive ? "+37 % (Überzahlung)" : "—", tone: mobilfunkLive ? "destructive" : "muted" },
          { label: "Einsparpotenzial", value: mobilfunkLive ? `${formatEUR(telcoSavings)} ${unit}` : "—", tone: "success" },
        ]}
      >
        <div className="grid gap-3 lg:grid-cols-3">
          {/* Mobilfunk */}
          <SubSegment
            emoji="📱"
            label="Mobilfunk"
            active={mobilfunkLive}
            badge={mobilfunkLive ? "Live" : "Wartet auf Daten"}
            onOpen={goMobilfunk}
            specificKpis={
              mobilfunkLive
                ? [
                    { l: "ARPU (Ist)", v: `${metrics.arpuActual.toFixed(2).replace(".", ",")} €`, sub: `Markt-Target ${metrics.arpuTarget.toFixed(2).replace(".", ",")} €` },
                    { l: "Karteileichen", v: "14 SIMs", sub: "0 KB Verbrauch in 90 Tagen" },
                    { l: "Roaming-Ausreißer", v: "3 Geräte", sub: "USA · Schweiz · außerhalb EU" },
                    { l: "Restlaufzeit Rahmenvertrag", v: `${metrics.runtimeMonths} Monate`, sub: "bis automatische Verlängerung" },
                  ]
                : [
                    { l: "ARPU (Ist)", v: "—", sub: "Markt-Target wird berechnet" },
                    { l: "Karteileichen", v: "—", sub: "Inaktive SIM-Karten" },
                    { l: "Roaming-Ausreißer", v: "—", sub: "Hochpreisige Auslandskosten" },
                    { l: "Restlaufzeit Rahmenvertrag", v: "—", sub: "Vertragsende-Erkennung" },
                  ]
            }
            actions={
              mobilfunkLive ? (
                <>
                  <ActionBtn onClick={() => toast.success("Verhandlungs-Guide vorbereitet", { description: "Strategische Argumentationshilfen für den Provider-Termin." })}>📘 Verhandlungs-Guide</ActionBtn>
                  <ActionBtn onClick={() => toast.success("Analyse-Report wird exportiert", { description: "XLSX-Komplettreport für den Einkauf." })}>📊 Analyse-Report</ActionBtn>
                  <ActionBtn onClick={() => toast.success("Anfrage an CoreSpend-Experten übermittelt", { description: "Ein Senior-Negotiator meldet sich innerhalb von 24 h." })} variant="success" full>🔥 Verhandlungsexperten aktivieren</ActionBtn>
                </>
              ) : (
                <>
                  <ActionBtn onClick={() => toast.success("Verhandlungs-Guide vorbereitet", { description: "Strategische Argumentationshilfen für den Provider-Termin." })}>📘 Verhandlungs-Guide</ActionBtn>
                  <ActionBtn onClick={() => toast.success("Analyse-Report wird exportiert", { description: "XLSX-Komplettreport für den Einkauf." })}>📊 Analyse-Report</ActionBtn>
                  <ActionBtn onClick={goMobilfunk} variant="primary" full>
                    ➜ Mobilfunk-Daten teilen & freischalten
                  </ActionBtn>
                </>
              )
            }
          />

          {/* Festnetz */}
          <SubSegment
            emoji="☎️"
            label="Festnetz"
            active={false}
            badge="🔒 Coming Soon"
            specificKpis={[
              { l: "Ungenutzte Sprachkanäle", v: "—", sub: "SIP-Trunks ohne Traffic" },
              { l: "Fix vs. Flex", v: "—", sub: "Grundgebühr / Verbindungskosten" },
              { l: "Sonderrufnummern", v: "—", sub: "Hotline-Kosten 0800/0180" },
            ]}
            actions={<LockedAction />}
          />

          {/* Daten / Standortvernetzung */}
          <SubSegment
            emoji="🌐"
            label="Daten / Standortvernetzung"
            active={false}
            badge="🔒 Coming Soon"
            specificKpis={[
              { l: "Kosten pro Standort", v: "—", sub: "Ø monatlich je Niederlassung" },
              { l: "SLA-Strafen", v: "—", sub: "Provider-Rückzahlungen bei Ausfall" },
              { l: "Bandbreiten-Effizienz", v: "—", sub: "Leitungen < 10 % ausgelastet" },
            ]}
            actions={<LockedAction />}
          />
        </div>
      </CategoryTile>

      {/* 2 · Office Suite */}
      <CategoryTile
        emoji="💻"
        title="Office-Suite"
        subtitle="Microsoft 365 · Google Workspace · Adobe"
        statusBadge={officeSuiteEnabled ? { label: "Aktiv", tone: "success" } : { label: "🔒 Coming Soon", tone: "muted" }}
        locked={!officeSuiteEnabled}
        kpis={
          officeSuiteEnabled
            ? [
                { label: "Total License Spend", value: `${formatEUR(yearly ? effectiveOfficeSpend * 12 : effectiveOfficeSpend)} ${unitShort}` },
                { label: "Identifiziertes Potenzial", value: `${formatEUR(yearly ? effectiveOfficeSavings * 12 : effectiveOfficeSavings)} ${unit}`, tone: "success" },
                { label: "Aktive Nutzer", value: "18 / 20", tone: "muted" },
              ]
            : lockedTopKpis
        }
      >
        <div className="grid gap-3 lg:grid-cols-3">
          <SpecificBlock
            items={
              officeSuiteEnabled
                ? [
                    { l: "Lizenz-Verteilung", v: "15× E5", sub: "3× E3 · 2× F3" },
                    { l: "Zombie-Lizenzen", v: "2", sub: "b.schulz@ · j.zimmermann@" },
                    { l: "Over-Licensing", v: "3 Downgrades", sub: "p.koch@ · l.bauer@ · c.braun@" },
                  ]
                : [
                    { l: "Lizenz-Auslastung", v: "—", sub: "Utilization Rate in %" },
                    { l: "Doppel-Lizenzen", v: "—", sub: "SaaS-Overlap: Slack vs. Teams · Zoom vs. Meet" },
                    { l: "Shadow-IT-Erkennung", v: "—", sub: "Kreditkarten-Abos außerhalb Procurement" },
                  ]
            }
          />
          <div className="lg:col-span-2 flex flex-wrap gap-2 items-end">
            {officeSuiteEnabled ? (
              <>
                <ActionBtn onClick={goOfficeSuite} variant="primary">→ Office-Suite Detailansicht</ActionBtn>
                <ActionBtn onClick={() => toast.success("CFO-Report exportiert", { description: "Lizenz-Optimierung M365." })}>📄 CFO-Report</ActionBtn>
                <ActionBtn onClick={() => toast.success("Downgrade-Anfrage erstellt", { description: "E5 → F3 für 3 Accounts." })}>⬇️ Lizenz-Downgrade (E5 → F3)</ActionBtn>
                <ActionBtn variant="success" onClick={() => toast.success("Verhandlungsexperte aktiviert", { description: "M365-Spezialist meldet sich in 24 h." })}>🔥 Verhandlungsexperten aktivieren</ActionBtn>
              </>
            ) : (
              <>
                <ActionBtn disabled>📄 CFO-Report</ActionBtn>
                <ActionBtn disabled>⬇️ Lizenz-Downgrade anfordern (E5 → E3)</ActionBtn>
                <ActionBtn disabled variant="success">🔥 Verhandlungsexperten aktivieren</ActionBtn>
              </>
            )}
          </div>
        </div>
      </CategoryTile>

      {/* 3 · SaaS / AI */}
      <CategoryTile
        emoji="☁️"
        title="SaaS / AI"
        subtitle="OpenAI · Anthropic · Salesforce · HubSpot · weitere"
        statusBadge={saasAiEnabled ? { label: "Aktiv", tone: "success" } : { label: "🔒 Coming Soon", tone: "muted" }}
        locked={!saasAiEnabled}
        kpis={
          saasAiEnabled
            ? [
                { label: "Month-to-Date Spend", value: `${effectiveSaasSpend.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €` },
                { label: "Identifizierter Schaden", value: `${effectiveSaasDamage.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`, tone: "destructive" },
                { label: "Forecast-Risiko", value: "38.000 € / Jahr", tone: "muted" },
              ]
            : lockedTopKpis
        }
      >
        <div className="grid gap-3 lg:grid-cols-3">
          <SpecificBlock
            items={
              saasAiEnabled
                ? [
                    { l: "Anomalie 10.06.", v: "2.650 €", sub: "Data_Analytics_Pipeline · gpt-4o" },
                    { l: "Token-Verbrauch (Spike)", v: "430 Mio.", sub: "Mögliche Endlosschleife detektiert" },
                    { l: "Normalverbrauch (Schnitt)", v: "≈ 21 €/Tag", sub: "Customer_Support_AI · Pipeline" },
                  ]
                : [
                    { l: "Seat-Auslastung Salesforce", v: "—", sub: "Aktive Logins / lizenzierte User" },
                    { l: "Adobe Named-User-Status", v: "—", sub: "Inaktive Creative-Cloud-Seats" },
                    { l: "Vertragsende-Cluster", v: "—", sub: "Renewals in den nächsten 90 Tagen" },
                  ]
            }
          />
          <div className="lg:col-span-2 flex flex-wrap gap-2 items-end">
            {saasAiEnabled ? (
              <>
                <ActionBtn onClick={goSaasAi} variant="primary">→ SaaS / AI Detailansicht</ActionBtn>
                <ActionBtn onClick={() => toast.success("CFO-Report exportiert", { description: "AI-Kostenanalyse Juni." })}>📄 CFO-Report</ActionBtn>
                <ActionBtn onClick={() => toast.success("Token-Analyse gestartet", { description: "Auslastung pro Projekt." })}>📊 Auslastungs-Analyse</ActionBtn>
                <ActionBtn variant="success" onClick={() => toast.success("Verhandlungsexperte aktiviert", { description: "AI/SaaS-Spezialist meldet sich in 24 h." })}>🔥 Verhandlungsexperten aktivieren</ActionBtn>
              </>
            ) : (
              <>
                <ActionBtn disabled>📄 CFO-Report</ActionBtn>
                <ActionBtn disabled>📊 Auslastungs-Analyse</ActionBtn>
                <ActionBtn disabled variant="success">🔥 Verhandlungsexperten aktivieren</ActionBtn>
              </>
            )}
          </div>
        </div>
      </CategoryTile>

      {/* 4 · Cloud */}
      <CategoryTile
        emoji="🌩"
        title="Cloud Infrastruktur"
        subtitle="AWS · Azure · GCP"
        statusBadge={{ label: "🔒 Coming Soon", tone: "muted" }}
        locked
        kpis={lockedTopKpis}
      >
        <div className="grid gap-3 lg:grid-cols-3">
          <SpecificBlock
            items={[
              { l: "Zombies / Unused Resources", v: "—", sub: "Ungenutzte Instanzen · verwaiste Speicherblöcke" },
              { l: "RI / Savings-Plan-Abdeckung", v: "—", sub: "Prepaid vs. teurer Minutentakt" },
              { l: "Daten-Transferkosten", v: "—", sub: "Egress · versteckter Datenexport" },
            ]}
          />
          <div className="lg:col-span-2 flex flex-wrap gap-2 items-end">
            <ActionBtn disabled>📄 CFO-Report</ActionBtn>
            <ActionBtn disabled>🔔 Cloud-Alarm einrichten</ActionBtn>
            <ActionBtn disabled variant="success">🔥 Verhandlungsexperten aktivieren</ActionBtn>
          </div>
        </div>
      </CategoryTile>

      {/* 5 · Hardware */}
      <CategoryTile
        emoji="🔌"
        title="Hardware (Smartphones & Workplace)"
        subtitle="Leasing · Refurbishment · End-of-Life"
        statusBadge={{ label: "🔒 Coming Soon", tone: "muted" }}
        locked
        kpis={lockedTopKpis}
      >
        <div className="grid gap-3 lg:grid-cols-3">
          <SpecificBlock
            items={[
              { l: "Leasing-Strafgebühren", v: "—", sub: "Verspätete oder beschädigte Rückgaben" },
              { l: "Geräte pro Mitarbeiter", v: "—", sub: "Mitarbeiter mit mehreren aktiven Devices" },
              { l: "Restwert-Potenzial", v: "—", sub: "Erlöse durch Refurbishment / Wiederverkauf" },
            ]}
          />
          <div className="lg:col-span-2 flex flex-wrap gap-2 items-end">
            <ActionBtn disabled>📄 CFO-Report</ActionBtn>
            <ActionBtn disabled>♻️ Refurbishment-Analyse</ActionBtn>
            <ActionBtn disabled variant="success">🔥 Verhandlungsexperten aktivieren</ActionBtn>
          </div>
        </div>
      </CategoryTile>

      {/* Trust strip */}
      <div className="grid gap-3 md:grid-cols-4 text-[11px] text-muted-foreground">
        {[
          ["🛡", "DSGVO-konform"],
          ["🔐", "AES-256 Verschlüsselung"],
          ["🇩🇪", "Hosting in Frankfurt"],
          ["📄", "Automatischer NDA-Schutz"],
        ].map(([e, l]) => (
          <div key={l} className="glass-card px-4 py-3 flex items-center gap-2">
            <span className="text-base">{e}</span>
            <span className="text-foreground/90">{l}</span>
          </div>
        ))}
      </div>

      <ContractsTable title="📄 Verträge (Live aus Datenbank)" />
    </div>
  );
}

/* ---------- shared bits ---------- */

const lockedTopKpis = [
  { label: "Ist-Kosten", value: "—" },
  { label: "Benchmark-Abweichung", value: "—" },
  { label: "Einsparpotenzial", value: "—" },
] satisfies { label: string; value: string; tone?: "success" | "destructive" | "muted" }[];

type TileKpi = { label: string; value: string; tone?: "success" | "destructive" | "muted" };

function CategoryTile({
  emoji, title, subtitle, statusBadge, kpis, locked, children,
}: {
  emoji: string; title: string; subtitle: string;
  statusBadge: { label: string; tone: "success" | "primary" | "muted" };
  kpis: TileKpi[];
  locked?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "glass-card overflow-hidden relative",
        locked && "opacity-55 hover:opacity-70 transition-opacity",
      )}
    >
      {locked && (
        <div className="absolute top-4 right-4 text-2xl text-primary/70">🔒</div>
      )}
      <div className="px-6 py-5 border-b border-border flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-accent grid place-items-center text-2xl">{emoji}</div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
        </div>
        <span
          className={cn(
            "text-[10px] uppercase tracking-wider rounded-full px-2 py-0.5 border",
            statusBadge.tone === "success" && "text-success border-success/40 bg-success/10",
            statusBadge.tone === "primary" && "text-primary border-primary/40 bg-primary/10",
            statusBadge.tone === "muted" && "text-muted-foreground border-border bg-surface/40",
          )}
        >
          {statusBadge.label}
        </span>
      </div>

      {/* Top-Level KPIs */}
      <div className="grid grid-cols-3 border-b border-border">
        {kpis.map((k) => (
          <div key={k.label} className="px-6 py-4 border-r border-border last:border-r-0">
            <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{k.label}</div>
            <div
              className={cn(
                "mt-1.5 text-xl font-semibold tabular-nums tracking-tight",
                k.tone === "success" && "text-success",
                k.tone === "destructive" && "text-destructive",
                k.tone === "muted" && "text-muted-foreground",
              )}
            >
              {k.value}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6">{children}</div>
    </section>
  );
}

function SubSegment({
  emoji, label, active, badge, onOpen, specificKpis, actions,
}: {
  emoji: string; label: string; active: boolean; badge: string;
  onOpen?: () => void;
  specificKpis: { l: string; v: string; sub: string }[];
  actions: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-background/40 p-4 flex flex-col gap-3",
        active ? "border-success/30" : "border-border opacity-60",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onOpen}
          disabled={!active && !onOpen}
          className={cn("flex items-center gap-2 text-sm font-medium", active && onOpen && "hover:text-primary transition-colors")}
        >
          <span className="text-base">{emoji}</span>
          {label}
          {active && onOpen && <span className="text-xs text-muted-foreground">→</span>}
        </button>
        <span
          className={cn(
            "text-[9px] uppercase tracking-wider rounded-full px-1.5 py-0.5 border",
            active
              ? "text-success border-success/40 bg-success/10"
              : "text-muted-foreground border-border",
          )}
        >
          {badge}
        </span>
      </div>

      <div className="grid gap-1.5">
        {specificKpis.map((k) => (
          <div key={k.l} className="flex items-baseline justify-between gap-3 py-1.5 border-b border-border/40 last:border-0">
            <div className="text-[11px] text-muted-foreground leading-tight">
              <div className="text-foreground/85">{k.l}</div>
              <div>{k.sub}</div>
            </div>
            <div className={cn("text-sm font-semibold tabular-nums whitespace-nowrap", !active && "text-muted-foreground")}>
              {k.v}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 mt-1">{actions}</div>
    </div>
  );
}

function SpecificBlock({ items }: { items: { l: string; v: string; sub: string }[] }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4 grid gap-1.5">
      {items.map((k) => (
        <div key={k.l} className="flex items-baseline justify-between gap-3 py-1.5 border-b border-border/40 last:border-0">
          <div className="text-[11px] leading-tight">
            <div className="text-foreground/85">{k.l}</div>
            <div className="text-muted-foreground">{k.sub}</div>
          </div>
          <div className="text-sm font-semibold tabular-nums text-muted-foreground whitespace-nowrap">{k.v}</div>
        </div>
      ))}
    </div>
  );
}

function ActionBtn({
  children, onClick, variant = "default", disabled, full,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "default" | "success" | "destructive" | "primary";
  disabled?: boolean;
  full?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "text-xs font-medium rounded-md px-3 py-2 border transition-colors",
        full && "w-full justify-center",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && variant === "default" && "border-border bg-surface/60 hover:bg-accent text-foreground/90",
        !disabled && variant === "primary" && "border-primary/40 bg-primary/15 hover:bg-primary/25 text-primary",
        !disabled && variant === "success" && "border-success/40 bg-success/15 hover:bg-success/25 text-success",
        !disabled && variant === "destructive" && "border-destructive/40 bg-destructive/10 hover:bg-destructive/20 text-destructive",
        disabled && "border-border bg-surface/40 text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}

function LockedAction() {
  return (
    <div className="flex flex-wrap gap-1.5 opacity-70">
      <ActionBtn disabled>📄 CFO-Report</ActionBtn>
      <ActionBtn disabled variant="success">🔥 Verhandlungsexperten</ActionBtn>
    </div>
  );
}

function GlobalKpi({ label, value, tone }: { label: string; value: string; tone?: "success" | "muted" }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-5 py-4 flex flex-col justify-center leading-tight bg-surface/40",
        tone === "success" ? "border-success/30" : "border-border",
      )}
    >
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-xl font-semibold tabular-nums mt-1.5",
          tone === "success" && "text-success",
          tone === "muted" && "text-foreground/80",
        )}
      >
        {value}
      </span>
    </div>
  );
}

const COLORS = {
  telco: "hsl(160 70% 45%)",
  office: "hsl(45 90% 55%)",
  saas: "hsl(265 75% 60%)",
};

function GlobalAnalyticsCharts({
  telcoMonthly, telcoSavingsMonthly,
  officeMonthly, officeSavings,
  saasMonthly, saasSavings,
}: {
  telcoMonthly: number; telcoSavingsMonthly: number;
  officeMonthly: number; officeSavings: number;
  saasMonthly: number; saasSavings: number;
}) {
  const trendData = useMemo(() => {
    const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun"];
    return months.map((mo, i) => ({
      month: mo,
      Mobilfunk: Math.round(telcoMonthly * (0.94 + i * 0.012)),
      "Office-Suite": Math.round(officeMonthly * (0.96 + i * 0.008)),
      "SaaS / AI": Math.round(saasMonthly * (i === 5 ? 1.95 : (0.95 + i * 0.01))),
    }));
  }, [telcoMonthly, officeMonthly, saasMonthly]);

  const savingsData = useMemo(
    () => [
      { category: "Mobilfunk", potenzial: telcoSavingsMonthly, fill: COLORS.telco },
      { category: "Office-Suite", potenzial: Math.round(officeSavings), fill: COLORS.office },
      { category: "SaaS / AI", potenzial: Math.round(saasSavings), fill: COLORS.saas },
    ].filter((d) => d.potenzial > 0),
    [telcoSavingsMonthly, officeSavings, saasSavings],
  );

  const tooltipStyle = {
    background: "hsl(var(--background))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 8,
    fontSize: 12,
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="glass-card p-5 flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Gesamt-Kosten · Monatlicher Verlauf</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Gestapelte Ausgaben Mobilfunk · Office-Suite · SaaS / AI
          </p>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatEUR(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Mobilfunk" stackId="a" fill={COLORS.telco} radius={[0, 0, 0, 0]} />
            <Bar dataKey="Office-Suite" stackId="a" fill={COLORS.office} radius={[0, 0, 0, 0]} />
            <Bar dataKey="SaaS / AI" stackId="a" fill={COLORS.saas} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card p-5 flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Einsparpotenzial nach Kategorie</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Monatliches Optimierungs-Potenzial je aktivem Bereich
          </p>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={savingsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickFormatter={(v) => `${v}€`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatEUR(v), "Potenzial / Monat"]} />
            <Bar dataKey="potenzial" radius={[6, 6, 0, 0]}>
              {savingsData.map((d) => (
                <Cell key={d.category} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
