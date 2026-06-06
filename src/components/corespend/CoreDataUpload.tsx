import { useRef, useState } from "react";
import {
  ArrowLeft, Upload, FileCheck2, ShieldCheck, Clock, CheckCircle2, KeyRound, Workflow, Copy, RefreshCw, Webhook,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCoreSpend, formatEUR, CATEGORY_META, PRICING } from "@/lib/corespend-store";
import { iconFor } from "./iconFor";
import { cn } from "@/lib/utils";
import { ProcessingPane } from "./ProcessingPane";

const CHECKLISTS: Record<string, string[]> = {
  "telco.mobilfunk": [
    "Aktueller Mobilfunk-Rahmenvertrag (PDF)",
    "Letzte 3 Monatsrechnungen",
    "SIM-/Nutzerliste (CSV / XLSX)",
    "Optional: Nutzungsprotokolle",
  ],
  "telco.festnetz": [
    "Festnetz-Vertrag & Anlagenverzeichnis",
    "Letzte 3 Monatsrechnungen",
    "Standortliste (CSV)",
  ],
  "telco.daten": [
    "Datenleitungs-Verträge je Standort",
    "Letzte 3 Monatsrechnungen",
    "SLA / Bandbreitenübersicht",
  ],
  "office.office365": [
    "Microsoft EA / MCA Vertrag",
    "Aktuelle Lizenz-Übersicht (Admin Center Export)",
    "True-Up Historie (12 Monate)",
    "Optional: Azure-Kostenexport",
  ],
  "saas.plattformen": [
    "SaaS-Inventar (Top 10 Tools)",
    "Verträge der Top-Anbieter",
    "Nutzungs-Reports & Lizenz-Auslastung",
  ],
  "cloud.aws": [
    "AWS Cost & Usage Report (letzte 3 Monate)",
    "Reservierte Instanzen / Savings Plans Übersicht",
    "Enterprise Discount Program (EDP) Vertrag",
  ],
  "cloud.azure": [
    "Azure Cost Management Export (letzte 3 Monate)",
    "Reservation / Savings Plan Übersicht",
    "MCA / EA Vertrag",
  ],
  "cloud.gcp": [
    "GCP Billing Export (letzte 3 Monate)",
    "CUD / Reservierungs-Übersicht",
    "Enterprise Agreement / Order Forms",
  ],
  "hardware.smartphones": [
    "Asset-Inventar Smartphones / Tablets",
    "Leasing- / Kaufverträge",
    "Beschaffungs-Historie 24 Monate",
  ],
  "hardware.workplace": [
    "Asset-Inventar Workplace-Geräte",
    "Leasing- / Kaufverträge",
    "Service- & MDM-Verträge",
  ],
};

export function CoreDataUpload() {
  const { currentCategory, currentSub, categories, goToCategory, goToStart, startProcessing } = useCoreSpend();
  const [fileName, setFileName] = useState<string | undefined>();
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!currentCategory || !currentSub) {
    return (
      <div className="glass-card p-10 text-center">
        <h2 className="text-lg font-semibold">Kein Upload-Ziel ausgewählt</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Bitte wähle in <button className="underline text-primary" onClick={goToStart}>Core Start</button> einen Bereich und Unterpunkt.
        </p>
      </div>
    );
  }

  const meta = CATEGORY_META[currentCategory];
  const sub = meta.subs.find((s) => s.key === currentSub)!;
  const Icon = iconFor(meta.iconName);
  const cat = categories[currentCategory];
  const subStatus = cat.subStatus[currentSub] ?? "idle";
  const isProcessing = subStatus === "processing";
  const isComplete = subStatus === "pending" || subStatus === "analyzed";

  const checklistKey = `${currentCategory}.${currentSub}`;
  const checklist = CHECKLISTS[checklistKey] ?? ["Rahmenvertrag", "Letzte 3 Rechnungen", "Inventar/Export"];

  const apiKey = `csk_live_${currentCategory}_${currentSub}_a8f3c2`;
  const webhookUrl = `https://api.corespend.io/v1/ingest/${currentCategory}/${currentSub}`;

  const copy = (s: string) => navigator.clipboard?.writeText(s).catch(() => {});

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={() => goToCategory(currentCategory)}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Zurück zu {meta.label}
        </button>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-success/20 grid place-items-center border border-border">
            <Icon className="h-7 w-7 text-primary" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">📥 Core DataUpload</div>
            <h1 className="text-3xl font-semibold tracking-tight mt-0.5">
              {sub.emoji} {meta.label} · {sub.label}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Übertrage Daten manuell per Drag-and-Drop oder verbinde {sub.label} automatisiert via REST API oder n8n-Workflow.
            </p>
          </div>
        </div>
      </div>

      {isProcessing ? (
        <ProcessingPane category={currentCategory} title={`${meta.label} · ${sub.label}`} />
      ) : (
        <Tabs defaultValue="manual" className="space-y-5">
          <TabsList className="bg-surface border border-border h-auto p-1">
            <TabsTrigger value="manual" className="gap-2 px-4 py-2">
              <Upload className="h-4 w-4" /> Manueller Upload
            </TabsTrigger>
            <TabsTrigger value="auto" className="gap-2 px-4 py-2">
              <Workflow className="h-4 w-4" /> Automatisierter Import
            </TabsTrigger>
          </TabsList>

          {/* MANUAL */}
          <TabsContent value="manual" className="mt-0">
            <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
              <div className="glass-card p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Dokumenten-Upload</div>
                  {isComplete && (
                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-success">
                      <CheckCircle2 className="h-3 w-3" /> Hochgeladen
                    </span>
                  )}
                </div>

                {!isComplete && (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      const f = e.dataTransfer.files?.[0];
                      if (f) setFileName(f.name);
                    }}
                    onClick={() => inputRef.current?.click()}
                    className={cn(
                      "rounded-xl border-2 border-dashed border-border bg-background/40 px-6 py-12 text-center cursor-pointer transition-colors",
                      dragging && "border-success bg-success/5",
                    )}
                  >
                    <Upload className="h-7 w-7 mx-auto text-muted-foreground" />
                    <p className="text-sm mt-3">
                      {fileName ? (
                        <span className="text-foreground">{fileName}</span>
                      ) : (
                        <>Dateien hierher ziehen oder <span className="text-primary underline-offset-2 hover:underline">durchsuchen</span></>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PDF · CSV · XLSX · ZIP — max. 50 MB</p>
                    <p className="text-[10px] text-muted-foreground mt-3 flex items-center justify-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> AES-256 · DSGVO-konform · ISO 27001 RZ Deutschland
                    </p>
                    <input
                      ref={inputRef}
                      type="file"
                      className="hidden"
                      onChange={(e) => setFileName(e.target.files?.[0]?.name)}
                    />
                  </div>
                )}

                {isComplete && (
                  <div className="rounded-lg border border-success/40 bg-success/5 px-4 py-3 flex items-start gap-3">
                    <Clock className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <div className="text-xs leading-relaxed">
                      <div className="font-medium text-foreground">In Expertenprüfung (24–48h)</div>
                      <div className="text-muted-foreground mt-0.5">
                        Dein Rabatt von {formatEUR(PRICING.DISCOUNT_PER_CATEGORY)} / Monat ist <span className="text-success">bereits aktiv</span>.
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => startProcessing(currentCategory, currentSub, fileName)}
                  disabled={isComplete}
                  className={cn(
                    "w-full rounded-lg px-4 py-3 text-sm font-medium transition-all",
                    !isComplete
                      ? "bg-success text-success-foreground hover:brightness-110 shadow-[0_8px_30px_-10px_color-mix(in_oklab,var(--success)_60%,transparent)]"
                      : "bg-accent text-muted-foreground cursor-not-allowed",
                  )}
                >
                  {isComplete
                    ? "Analyse läuft …"
                    : `Analyse starten & ${formatEUR(PRICING.DISCOUNT_PER_CATEGORY)} / Monat sparen`}
                </button>
              </div>

              <div className="glass-card p-6">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
                  Benötigte Dokumente
                </div>
                <ul className="space-y-2.5">
                  {checklist.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground/90">
                      <FileCheck2 className="h-4 w-4 text-primary/80 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 pt-5 border-t border-border/60 text-[11px] text-muted-foreground leading-relaxed">
                  Alle Dokumente werden automatisch anonymisiert und ausschließlich für deine eigene Benchmark-Analyse verwendet.
                </div>
              </div>
            </div>
          </TabsContent>

          {/* AUTOMATED */}
          <TabsContent value="auto" className="mt-0 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              {/* REST API */}
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-success/20 grid place-items-center border border-border">
                      <KeyRound className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">🔑 REST API</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">API-Key & Webhook zur direkten System-Anbindung</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-success border border-success/40 bg-success/10 rounded-full px-2 py-0.5">
                    Beta
                  </span>
                </div>

                <CodeRow label="API Key" value={apiKey} onCopy={() => copy(apiKey)} mask />
                <CodeRow label="Webhook URL" value={webhookUrl} onCopy={() => copy(webhookUrl)} icon={<Webhook className="h-3.5 w-3.5" />} />

                <div className="rounded-lg border border-border bg-background/50 p-3 text-[11px] font-mono text-muted-foreground leading-relaxed">
                  <span className="text-success">POST</span> {webhookUrl}<br />
                  <span className="text-primary">Authorization:</span> Bearer {apiKey.slice(0, 14)}…<br />
                  <span className="text-primary">Content-Type:</span> application/json
                </div>

                <button
                  onClick={() => copy(apiKey)}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-accent hover:bg-accent/70 px-4 py-2.5 text-sm transition-colors"
                >
                  <RefreshCw className="h-4 w-4" /> Neuen API-Key generieren
                </button>
              </div>

              {/* n8n */}
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-success/20 grid place-items-center border border-border">
                      <Workflow className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">⚙️ n8n Automatisierung</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Fertiger Workflow zum 1-Klick-Import</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-primary border border-primary/40 bg-primary/10 rounded-full px-2 py-0.5">
                    Template
                  </span>
                </div>

                <div className="rounded-lg border border-border bg-background/50 p-4">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-3">
                    <span className="h-2 w-2 rounded-full bg-success" /> Workflow · CoreSpend · {sub.label}
                  </div>
                  <div className="flex items-center justify-between gap-1 text-[10px]">
                    {["Trigger", "Auth", "Transform", "CoreSpend"].map((n, i) => (
                      <div key={n} className="flex-1 flex items-center gap-1">
                        <div className="flex-1 rounded-md bg-accent border border-border px-2 py-2 text-center font-medium">
                          {n}
                        </div>
                        {i < 3 && <div className="text-muted-foreground">→</div>}
                      </div>
                    ))}
                  </div>
                </div>

                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Trigger: Webhook · Cron · Datei-Upload</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Auth-Node mit hinterlegtem API-Key</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Mapping auf CoreSpend-Schema vorkonfiguriert</li>
                </ul>

                <button
                  onClick={() => copy(`{"name":"CoreSpend ${meta.label} ${sub.label}","nodes":[...]}`)}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-success/15 hover:bg-success/25 text-success border border-success/40 px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  <Copy className="h-4 w-4" /> Workflow-Template kopieren
                </button>
              </div>
            </div>

            <div className="glass-card p-5 text-xs text-muted-foreground flex items-start gap-3">
              <ShieldCheck className="h-4 w-4 text-success mt-0.5 shrink-0" />
              <div>
                <span className="text-foreground font-medium">Sicherheits-Hinweis:</span> Alle automatisierten Imports werden serverseitig validiert,
                anonymisiert und in einem ISO-27001-zertifizierten Rechenzentrum in Deutschland verarbeitet. Der API-Key kann jederzeit rotiert werden.
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function CodeRow({
  label, value, onCopy, mask, icon,
}: { label: string; value: string; onCopy: () => void; mask?: boolean; icon?: React.ReactNode }) {
  const display = mask ? `${value.slice(0, 16)}${"•".repeat(10)}` : value;
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5">
        {icon} {label}
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-background/60 pl-3 pr-1.5 py-1.5">
        <code className="flex-1 text-[12px] font-mono text-foreground/90 truncate">{display}</code>
        <button
          onClick={onCopy}
          className="rounded-md p-1.5 hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Kopieren"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
