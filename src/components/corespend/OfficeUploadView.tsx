import { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCoreSpend, formatEUR, PRICING } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

type OfficeStage = "idle" | "processing" | "analyzed";

export function OfficeUploadView() {
  const { goCoreStart, updateCoreStartStatus, coreStartStatuses } = useCoreSpend();
  const [stage, setStage] = useState<OfficeStage>(
    coreStartStatuses.office === "analyzed" ? "analyzed" : "idle",
  );
  const [fileName, setFileName] = useState<string | undefined>();

  function start(name?: string) {
    setFileName(name);
    setStage("processing");
  }
  function unlock() {
    setStage("analyzed");
    updateCoreStartStatus("office", "analyzed");
  }

  return (
    <div className="space-y-6">
      <Header stage={stage} />
      {stage === "idle" && <StateA onStart={start} />}
      {stage === "processing" && <StateB fileName={fileName} onDemoUnlock={unlock} />}
      {stage === "analyzed" && <StateC onBack={goCoreStart} />}
    </div>
  );
}

function Header({ stage }: { stage: OfficeStage }) {
  const { goCoreStart } = useCoreSpend();
  const stateLabel =
    stage === "idle" ? "State A · Core DataUpload"
    : stage === "processing" ? "State B · Enterprise Waiting"
    : "State C · M365-Cockpit freigeschaltet";

  return (
    <div>
      <button
        onClick={goCoreStart}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
      >
        <span>←</span> Zurück zum Core Start
      </button>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/25 to-success/25 grid place-items-center border border-border text-2xl">
          💻
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Office Suites · {stateLabel}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mt-0.5">Microsoft 365</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Vom Lizenz-Upload bis zum freigeschalteten M365-Optimierungs-Cockpit. Jede geteilte
            Datenquelle senkt Ihren CoreSpend-Tarif dauerhaft um {formatEUR(PRICING.DISCOUNT_PER_AREA)} / Monat.
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------- STATE A -------------------- */
function StateA({ onStart }: { onStart: (name?: string) => void }) {
  const [file, setFile] = useState<File | undefined>();
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerCompany, setCustomerCompany] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const checklist = [
    "Aktueller Microsoft Enterprise Agreement (EA) oder CSP-Vertrag (PDF)",
    "Aktueller Lizenz- & Zuweisungs-Report (CSV/Excel)",
    "Aktivitäts- & Log-Reports der letzten 90 Tage (CSV)",
  ];

  function pickFile(f: File | undefined) {
    if (!f) return;
    if (f.size > MAX_UPLOAD_BYTES) {
      toast.error("Datei zu groß", { description: "Maximale Größe: 50 MB." });
      return;
    }
    setFile(f);
  }

  function handleSubmit() {
    if (!file) {
      toast.error("Bitte Datei auswählen");
      return;
    }
    toast.success("M365-Lizenzexport übermittelt", {
      description: "Datenbasis wird gegen 1.200+ DACH-Verträge gespiegelt.",
    });
    onStart(file.name);
  }

  return (
    <Tabs defaultValue="manual" className="space-y-5">
      <TabsList className="bg-surface border border-border h-auto p-1">
        <TabsTrigger value="manual" className="gap-2 px-4 py-2">📄 Manueller PDF/Excel Upload</TabsTrigger>
        <TabsTrigger value="auto" className="gap-2 px-4 py-2">⚙ Automatisierter Import (REST API / n8n)</TabsTrigger>
      </TabsList>

      <TabsContent value="manual" className="mt-0">
        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <div className="glass-card p-6 flex flex-col gap-5">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Drag-and-Drop · Microsoft 365 Lizenzdaten
            </div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                pickFile(e.dataTransfer.files?.[0]);
              }}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "rounded-xl border-2 border-dashed border-border bg-background/40 px-6 py-14 text-center cursor-pointer transition-colors",
                dragging && "border-success bg-success/10",
              )}
            >
              <div className="text-3xl text-muted-foreground">↑</div>
              <p className="text-sm mt-3">
                {file ? <span className="text-foreground">{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</span> : (
                  <>Dateien hierher ziehen oder <span className="text-primary">durchsuchen</span></>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">PDF · CSV · XLSX · ZIP — max. 50 MB</p>
              <p className="text-[10px] text-muted-foreground mt-3">
                🛡 AES-256 · DSGVO-konform · ISO 27001 RZ Frankfurt · automatischer NDA-Schutz
              </p>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.csv,.xlsx,.xls,.zip,application/pdf,text/csv"
                className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0])}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="email"
                placeholder="Ihre E-Mail (optional)"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="rounded-lg border border-border bg-background/40 px-3 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="Unternehmen (optional)"
                value={customerCompany}
                onChange={(e) => setCustomerCompany(e.target.value)}
                className="rounded-lg border border-border bg-background/40 px-3 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!file}
              className="w-full rounded-lg bg-success text-success-foreground px-4 py-3.5 text-sm font-semibold hover:brightness-110 transition shadow-[0_10px_40px_-15px_color-mix(in_oklab,var(--success)_70%,transparent)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📤 M365-Daten sicher übertragen & Analyse starten
            </button>
          </div>

          <div className="glass-card p-6">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
              Empfohlene M365-Dokumente
            </div>
            <ul className="space-y-2.5">
              {checklist.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-foreground/90">
                  <span className="text-primary mt-0.5">☑</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-5 border-t border-border/60 text-[11px] text-muted-foreground leading-relaxed">
              Alle Dokumente werden serverseitig anonymisiert und ausschließlich für Ihre eigene
              M365-Lizenzoptimierung verwendet. NDA wird automatisch beim Upload erzeugt.
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="auto" className="mt-0">
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">🔑 Microsoft Graph API & n8n-Workflow</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Direkte Anbindung an Ihren M365 Tenant · 1-Klick-Setup
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-success border border-success/40 bg-success/10 rounded-full px-2 py-0.5">
              Enterprise
            </span>
          </div>

          <div className="rounded-lg border border-border bg-background/50 p-3 text-[11px] font-mono text-muted-foreground leading-relaxed">
            <span className="text-success">POST</span> https://api.corespend.io/v1/ingest/office/m365<br />
            <span className="text-primary">Authorization:</span> Bearer csk_live_office_m365_•••<br />
            <span className="text-primary">Content-Type:</span> application/json
          </div>

          <div className="rounded-lg border border-border bg-background/50 p-4">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-3">
              <span className="h-2 w-2 rounded-full bg-success" /> Workflow · CoreSpend · M365 Ingest
            </div>
            <div className="flex items-center justify-between gap-1 text-[10px]">
              {["Microsoft Graph", "Auth (OAuth2)", "Transform", "CoreSpend"].map((n, i) => (
                <div key={n} className="flex-1 flex items-center gap-1">
                  <div className="flex-1 rounded-md bg-accent border border-border px-2 py-2 text-center font-medium">{n}</div>
                  {i < 3 && <div className="text-muted-foreground">→</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

/* -------------------- STATE B -------------------- */
function StateB({ fileName, onDemoUnlock }: { fileName?: string; onDemoUnlock: () => void }) {
  const lines = [
    "Sichere Verbindung zu Microsoft Tenant wird simuliert...",
    "Erkennung ungenutzter E5/E3-Lizenzleichen läuft...",
    "Abgleich der Lizenz-Rabattstaffeln mit 1.200+ DACH-Verträgen...",
  ];
  const [showInfo, setShowInfo] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowInfo(true), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="glass-card relative overflow-hidden min-h-[520px] p-10 flex flex-col items-center justify-center text-center gap-6">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-success to-transparent animate-shimmer" />

      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-success grid place-items-center text-2xl font-bold text-background animate-pulse">
        ⟳
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">State B · Enterprise Waiting Screen</div>
        <h2 className="text-2xl font-semibold mt-2">M365-Analyse läuft · sichere Verarbeitung</h2>
        {fileName && (
          <p className="text-xs text-muted-foreground mt-1.5">Eingegangen: <span className="text-foreground">{fileName}</span></p>
        )}
      </div>

      <div className="flex items-end justify-center gap-1 h-20 w-full max-w-md">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className="w-1.5 rounded-full bg-gradient-to-t from-primary/40 to-success animate-data-pulse"
            style={{ height: `${30 + ((i * 13) % 70)}%`, animationDelay: `${(i * 80) % 1200}ms` }}
          />
        ))}
      </div>

      <div className="space-y-1.5 text-sm text-foreground/85 max-w-md">
        {lines.map((l) => (
          <div key={l} className="flex items-center gap-2 justify-center">
            <span className="text-success text-xs">✓</span>{l}
          </div>
        ))}
      </div>

      {showInfo && (
        <div className="rounded-lg border border-success/30 bg-success/5 px-5 py-4 max-w-xl text-left animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="text-sm font-medium">M365-Dateneingang bestätigt.</div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Da jede KI-Analyse durch zertifizierte Microsoft-Lizenz-Experten auditiert wird, schalten
            wir Ihr M365-Cockpit in <span className="text-foreground">24–48 Stunden</span> frei.
            Ihr Data-Bonus (<span className="text-success">−{formatEUR(PRICING.DISCOUNT_PER_AREA)} / Monat</span>)
            auf den Plattform-Tarif wurde bereits vorgemerkt und gilt ab sofort.
          </p>
        </div>
      )}

      <button
        onClick={onDemoUnlock}
        className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-success border border-dashed border-border hover:border-success/50 rounded-md px-3 py-2 transition-colors"
      >
        [Demo-Freischaltung · M365-Cockpit sofort öffnen]
      </button>
    </div>
  );
}

/* -------------------- STATE C -------------------- */
function StateC({ onBack }: { onBack: () => void }) {
  return (
    <div className="glass-card p-10 text-center space-y-5">
      <div className="mx-auto h-16 w-16 rounded-2xl bg-success/15 grid place-items-center text-3xl border border-success/40">
        ✓
      </div>
      <h2 className="text-2xl font-semibold">Microsoft 365 freigeschaltet</h2>
      <p className="text-sm text-muted-foreground max-w-xl mx-auto">
        Das M365-Optimierungs-Cockpit ist nun in Core Analytics verfügbar. User-Pool-Optimierung,
        Tier-Mismatches und Vertragsrisiko werden live ausgewertet.
      </p>
      <button
        onClick={onBack}
        className="rounded-lg border border-success/40 bg-success/10 text-success px-5 py-2.5 text-sm uppercase tracking-wider hover:bg-success/20 transition-colors"
      >
        ➜ Zurück zum Core Start
      </button>
    </div>
  );
}
