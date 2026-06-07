import { useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCoreSpend, formatEUR, PRICING } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { recordMobilfunkUpload } from "@/lib/mobilfunk-upload.functions";
import { toast } from "sonner";
import { MobilfunkConsultantChat } from "./MobilfunkConsultantChat";

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50 MB

export function MobilfunkView() {
  const { mobilfunkStatus, mobilfunkStage } = useCoreSpend();

  return (
    <div className="space-y-6">
      <Header />
      {mobilfunkStatus === "idle" && <StateA />}
      {(mobilfunkStatus === "processing" || mobilfunkStatus === "pending") && <StateB />}
      {mobilfunkStatus === "analyzed" && mobilfunkStage === "cockpit" && <StateC />}
      {mobilfunkStatus === "analyzed" && mobilfunkStage === "wizard" && <MobilfunkConsultantChat />}
      {mobilfunkStatus === "analyzed" && mobilfunkStage === "mandate" && <MobilfunkConsultantChat />}
    </div>
  );
}

function Header() {
  const { mobilfunkStatus, mobilfunkStage, goDashboard } = useCoreSpend();
  const stateLabel =
    mobilfunkStatus === "idle" ? "State A · Core DataUpload" :
    mobilfunkStatus === "analyzed"
      ? mobilfunkStage === "wizard"
        ? "State D · Strategie-Assistent"
        : mobilfunkStage === "mandate"
        ? "State E · Verhandlungsmandat"
        : "State C · Unlocked Cockpit"
      : "State B · Enterprise Waiting";

  return (
    <div>
      <button
        onClick={goDashboard}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
      >
        <span>←</span> Zurück zum Management Dashboard
      </button>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/25 to-success/25 grid place-items-center border border-border text-2xl">
          📱
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Telekommunikation · {stateLabel}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mt-0.5">Mobilfunk</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Vom ersten Datenupload bis zum freigeschalteten Verhandlungs-Cockpit. Jede geteilte Datenquelle
            senkt deinen CoreSpend-Tarif dauerhaft um {formatEUR(PRICING.DISCOUNT_PER_AREA)} / Monat.
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------- STATE A -------------------- */
function StateA() {
  const { startMobilfunkUpload } = useCoreSpend();
  const [file, setFile] = useState<File | undefined>();
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerCompany, setCustomerCompany] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recordUpload = useServerFn(recordMobilfunkUpload);

  const checklist = [
    "Mobilfunk-Rahmenvertrag (PDF)",
    "Die letzten 3 Monatsrechnungen (PDF)",
    "Einzelverbindungsnachweis (EVN, PDF/CSV)",
    "Optional: SIM-/Nutzerliste (XLSX)",
  ];

  function pickFile(f: File | undefined) {
    if (!f) return;
    if (f.size > MAX_UPLOAD_BYTES) {
      toast.error("Datei zu groß", { description: "Maximale Größe: 50 MB." });
      return;
    }
    setFile(f);
  }

  async function handleSubmit() {
    if (!file) {
      toast.error("Bitte Datei auswählen");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "bin";
      const safeBase = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
      const path = `uploads/${Date.now()}-${crypto.randomUUID()}-${safeBase}`;

      const { error: uploadError } = await supabase.storage
        .from("mobilfunk-uploads")
        .upload(path, file, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      await recordUpload({
        data: {
          originalFilename: file.name,
          mimeType: file.type || undefined,
          sizeBytes: file.size,
          storagePath: path,
          customerEmail: customerEmail.trim() || undefined,
          customerCompany: customerCompany.trim() || undefined,
        },
      });

      toast.success("Dokument sicher übertragen", {
        description: "Wir haben deine Datei erhalten und benachrichtigen das CoreSpend-Team.",
      });
      startMobilfunkUpload(file.name);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unbekannter Fehler";
      toast.error("Upload fehlgeschlagen", { description: msg });
    } finally {
      setUploading(false);
    }
  }

  return (
    <Tabs defaultValue="manual" className="space-y-5">
      <TabsList className="bg-surface border border-border h-auto p-1">
        <TabsTrigger value="manual" className="gap-2 px-4 py-2">📄 Sichere Dokumenten-Übergabe</TabsTrigger>
        <TabsTrigger value="auto" className="gap-2 px-4 py-2">⚙ Automatisierte Enterprise-Schnittstelle</TabsTrigger>
      </TabsList>

      <TabsContent value="manual" className="mt-0">
        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <div className="glass-card p-6 flex flex-col gap-5">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Drag-and-Drop · Mobilfunk-Dokumente
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
                placeholder="Deine E-Mail (optional)"
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
              disabled={uploading || !file}
              className="w-full rounded-lg bg-success text-success-foreground px-4 py-3.5 text-sm font-semibold hover:brightness-110 transition shadow-[0_10px_40px_-15px_color-mix(in_oklab,var(--success)_70%,transparent)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "⏳ Übertrage sicher …" : "📤 Dokumente sicher übertragen & Analyse starten"}
            </button>
          </div>


          <div className="glass-card p-6">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
              Empfohlene Dokumente
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
              Alle Dokumente werden serverseitig anonymisiert und ausschließlich für deine eigene
              Benchmark-Analyse verwendet. NDA wird automatisch beim Upload erzeugt.
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="auto" className="mt-0">
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">🔑 REST API & n8n-Workflow</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Direkte Anbindung an dein Mobilfunk-Portal · 1-Klick-Setup
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-success border border-success/40 bg-success/10 rounded-full px-2 py-0.5">
              Enterprise
            </span>
          </div>

          <div className="rounded-lg border border-border bg-background/50 p-3 text-[11px] font-mono text-muted-foreground leading-relaxed">
            <span className="text-success">POST</span> https://api.corespend.io/v1/ingest/telco/mobilfunk<br />
            <span className="text-primary">Authorization:</span> Bearer csk_live_telco_mobilfunk_•••<br />
            <span className="text-primary">Content-Type:</span> application/json
          </div>

          <div className="rounded-lg border border-border bg-background/50 p-4">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-3">
              <span className="h-2 w-2 rounded-full bg-success" /> Workflow · CoreSpend · Mobilfunk Ingest
            </div>
            <div className="flex items-center justify-between gap-1 text-[10px]">
              {["Provider-Portal", "Auth", "Transform", "CoreSpend"].map((n, i) => (
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
function StateB() {
  const { demoUnlock, mobilfunkFile } = useCoreSpend();
  const lines = [
    "Anonymisiere Mitarbeiterdaten nach DSGVO …",
    "Scanne 1.200+ DACH-Vergleichsverträge …",
    "Validiere SIM-Inventar und Nutzungs-Cluster …",
    "Berechne ARPU-Benchmark und Einsparkorridor …",
  ];

  return (
    <div className="glass-card relative overflow-hidden min-h-[520px] p-10 flex flex-col items-center justify-center text-center gap-6">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-success to-transparent animate-shimmer" />

      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-success grid place-items-center text-2xl font-bold text-background animate-pulse">
        ⟳
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">State B · Enterprise Waiting Screen</div>
        <h2 className="text-2xl font-semibold mt-2">Analyse läuft · sichere Verarbeitung</h2>
        {mobilfunkFile && (
          <p className="text-xs text-muted-foreground mt-1.5">Eingegangen: <span className="text-foreground">{mobilfunkFile}</span></p>
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

      <div className="rounded-lg border border-success/30 bg-success/5 px-5 py-4 max-w-xl text-left">
        <div className="text-sm font-medium">Dateneingang bestätigt.</div>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Da wir jede KI-Analyse durch zertifizierte IT-Einkaufsexperten auditieren lassen, wird dein Dashboard
          in <span className="text-foreground">24–48 Stunden</span> freigeschaltet. Dein Data-Bonus
          (<span className="text-success">−{formatEUR(PRICING.DISCOUNT_PER_AREA)} / Monat</span>) wurde bereits vorgemerkt und ist live.
        </p>
      </div>

      <button
        onClick={demoUnlock}
        className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-success border border-dashed border-border hover:border-success/50 rounded-md px-3 py-2 transition-colors"
      >
        [Demo-Freischaltung · Dashboard sofort öffnen]
      </button>
    </div>
  );
}

/* -------------------- STATE C -------------------- */
function StateC() {
  const { metrics, resetAll, setMobilfunkStage } = useCoreSpend();
  const arpuOver = metrics.arpuActual > metrics.arpuTarget
    ? Math.round(((metrics.arpuActual - metrics.arpuTarget) / metrics.arpuTarget) * 100)
    : 0;
  // bar width: cap at 200%
  const actualPct = Math.min((metrics.arpuActual / (metrics.arpuTarget * 1.6)) * 100, 100);
  const targetPct = Math.min((metrics.arpuTarget / (metrics.arpuTarget * 1.6)) * 100, 100);

  const findings = [
    { label: "14 verwaiste SIM-Karten (Null-Nutzung > 180 Tage)", saving: 4200 },
    { label: "Überdimensionierte Datenpässe & ungenutzte Auslands-Optionen", saving: 8400 },
    { label: "Fehlende Großkunden-Rabattierung auf Basis-Grundgebühren", saving: 11720 },
  ];

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiBig
          label="Validierte Ist-Kosten · Mobilfunk"
          value={`${formatEUR(metrics.costMonthly)} / Mo.`}
          sub={`${formatEUR(metrics.costMonthly * 12)} pro Jahr · ${metrics.usagePercent}% Auslastung`}
        />
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">CoreSpend ARPU-Benchmark</div>
          <div className="mt-3 flex items-baseline gap-2">
            <div className="text-2xl font-semibold tabular-nums">{metrics.arpuActual.toFixed(2).replace(".", ",")} €</div>
            <div className="text-xs text-muted-foreground">Ist · pro SIM/Monat</div>
          </div>
          <div className="mt-3 text-[11px] text-muted-foreground">
            Markt-Target: <span className="text-success font-medium tabular-nums">{metrics.arpuTarget.toFixed(2).replace(".", ",")} €</span>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-accent overflow-hidden">
                <div className="h-full bg-destructive" style={{ width: `${actualPct}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground tabular-nums w-12 text-right">Ist</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-accent overflow-hidden">
                <div className="h-full bg-success" style={{ width: `${targetPct}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground tabular-nums w-12 text-right">Markt</span>
            </div>
          </div>
          {arpuOver > 0 && (
            <div className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-destructive border border-destructive/40 bg-destructive/10 rounded-full px-2 py-0.5">
              {arpuOver}% Überzahlung
            </div>
          )}
        </div>
        <KpiBig
          label="Sofort realisierbares Einsparpotenzial"
          value={`${formatEUR(metrics.savingsYearly)} / Jahr`}
          sub="KI-validiert · marktbenchmarked"
          accent
        />
      </div>

      {/* Findings table */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide">Identifizierte Ineffizienzen</h3>
          <span className="text-[11px] text-muted-foreground">3 Hauptfelder · {formatEUR(findings.reduce((a,f)=>a+f.saving,0))} / Jahr</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="px-6 py-3 font-medium">Befund</th>
              <th className="px-6 py-3 font-medium text-right">Potenzial / Jahr</th>
            </tr>
          </thead>
          <tbody>
            {findings.map((f) => (
              <tr key={f.label} className="border-b border-border/60 last:border-0">
                <td className="px-6 py-4">{f.label}</td>
                <td className="px-6 py-4 text-right text-success font-semibold tabular-nums">{formatEUR(f.saving)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Procure actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Enterprise Procure-Actions</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <ExportAction title="Executive Summary (PDF)" sub="Sauberes Management-Handout für deinen CFO · Kernzahlen & Freigabe-Vorlage" emoji="📄" />
          <ExportAction title="Verhandlungs-Guide" sub="Strategische Argumentationshilfen für das Gespräch mit deinem Provider" emoji="📘" />
          <ExportAction title="Analyse-Report (XLSX)" sub="Detaillierter Komplett-Report als Datenbasis für den Einkauf" emoji="📊" />
        </div>
        <button
          onClick={() => setMobilfunkStage("wizard")}
          className="mt-2 w-full rounded-xl bg-gradient-to-r from-success to-primary text-success-foreground px-6 py-4 text-sm font-semibold hover:brightness-110 transition shadow-[0_15px_50px_-15px_color-mix(in_oklab,var(--success)_70%,transparent)]"
        >
          🔥 Verhandlungsstrategie konfigurieren · 5 Schritte zum Mandat →
        </button>
      </div>

      <div className="text-right">
        <button onClick={resetAll} className="text-[11px] text-muted-foreground hover:text-foreground underline">
          Demo zurücksetzen
        </button>
      </div>
    </div>
  );
}

function KpiBig({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className="glass-card p-5 relative overflow-hidden">
      <div className={cn(
        "absolute inset-0 pointer-events-none bg-gradient-to-br",
        accent ? "from-success/25 via-transparent to-transparent" : "from-primary/15 via-transparent to-transparent",
      )} />
      <div className="relative">
        <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{label}</div>
        <div className={cn("mt-2 text-3xl font-semibold tabular-nums tracking-tight", accent && "text-success")}>{value}</div>
        <div className="text-xs text-muted-foreground mt-1.5">{sub}</div>
      </div>
    </div>
  );
}

function ExportAction({ title, sub, emoji }: { title: string; sub: string; emoji: string }) {
  return (
    <button className="glass-card text-left p-5 hover:-translate-y-0.5 hover:border-primary/40 transition-all group">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-accent grid place-items-center text-xl">{emoji}</div>
        <div className="flex-1">
          <div className="text-sm font-semibold">{title}</div>
        </div>
        <span className="text-muted-foreground group-hover:text-primary transition-colors">↓</span>
      </div>
      <p className="text-[11.5px] text-muted-foreground mt-3 leading-relaxed">{sub}</p>
    </button>
  );
}
