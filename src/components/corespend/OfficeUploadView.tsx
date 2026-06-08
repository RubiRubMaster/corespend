import { useCoreSpend } from "@/lib/corespend-store";
import { Laptop, Upload, FileSpreadsheet } from "lucide-react";

export function OfficeUploadView() {
  const { goCoreStart, updateCoreStartStatus } = useCoreSpend();

  return (
    <div className="space-y-6">
      <button
        onClick={goCoreStart}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>←</span> Zurück zum Core Start
      </button>

      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/25 to-success/25 grid place-items-center border border-border">
          <Laptop className="h-7 w-7" strokeWidth={1.6} />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Office Suites · Core DataUpload
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mt-0.5">Microsoft 365 Lizenzdaten</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Lade deinen aktuellen Lizenzexport (CSV oder XLSX) hoch. Nach der Analyse erhältst du das
            vollständige Office-Cockpit mit User-Pool-Optimierung, Tier-Mismatches und Vertragsrisiko.
          </p>
        </div>
      </div>

      <div className="glass-card p-10 text-center border-dashed border-2">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 grid place-items-center border border-primary/30">
          <Upload className="h-8 w-8 text-primary" strokeWidth={1.6} />
        </div>
        <h2 className="text-lg font-semibold mt-4">Lizenzexport hierher ziehen</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Unterstützt: <span className="text-foreground">.csv</span>, <span className="text-foreground">.xlsx</span>
          {" "}· max. 50 MB
        </p>
        <button
          disabled
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted-foreground cursor-not-allowed"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Datei auswählen
        </button>
        <p className="text-[11px] text-muted-foreground/80 mt-3">
          MVP-Vorschau · Upload-Pipeline folgt im nächsten Release.
        </p>
      </div>

      <div className="glass-card p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Demo-Aktion</div>
          <div className="text-sm font-medium mt-0.5">Office Suites direkt als „Analysiert" markieren</div>
        </div>
        <button
          onClick={() => updateCoreStartStatus("office", "analyzed")}
          className="rounded-lg border border-success/40 bg-success/10 text-success px-4 py-2 text-sm uppercase tracking-wider hover:bg-success/20 transition-colors"
        >
          ✓ Status freischalten
        </button>
      </div>
    </div>
  );
}
