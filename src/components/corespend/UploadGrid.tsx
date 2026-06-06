import { Smartphone, Cloud, CloudCog, Cpu } from "lucide-react";
import { UploadCard } from "./UploadCard";

export function UploadGrid() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Onboarding · Core IT Datenerfassung</h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
          Lade Verträge & Rechnungen aus deinen Kern-Kostenblöcken hoch. Jeder freigeschaltete Bereich
          reduziert deinen monatlichen Plattformpreis um <span className="text-success font-medium">400 €</span>{" "}
          und schaltet das jeweilige Analyse-Dashboard frei.
        </p>
      </div>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
        <UploadCard
          category="mobilfunk"
          title="Mobilfunk & Telco"
          icon={Smartphone}
          available
          discount={400}
          checklist={[
            "Aktueller Rahmenvertrag (PDF)",
            "Letzte 3 Monatsrechnungen",
            "SIM-/Nutzerliste (CSV/XLSX)",
            "Optional: Nutzungsprotokolle",
          ]}
          ctaLabel="Mobilfunk-Analyse starten & 400 € sparen"
        />
        <UploadCard
          category="m365"
          title="Microsoft 365"
          icon={Cloud}
          available
          discount={400}
          checklist={[
            "Microsoft EA / MCA Vertrag",
            "Aktuelle Lizenz-Übersicht (Admin Center Export)",
            "True-Up Historie (12 Monate)",
            "Optional: Azure-Kostenexport",
          ]}
          ctaLabel="M365-Analyse starten & 400 € sparen"
        />
        <UploadCard
          category="saas"
          title="SaaS & Cloud"
          icon={CloudCog}
          available={false}
          discount={400}
          checklist={[
            "SaaS-Inventar (Top 10 Tools)",
            "Cloud-Provider Rechnungen",
            "Nutzungs-Reports",
          ]}
          ctaLabel="Bald verfügbar"
        />
        <UploadCard
          category="hardware"
          title="Hardware & Assets"
          icon={Cpu}
          available={false}
          discount={400}
          checklist={[
            "Asset-Inventar Export",
            "Leasing- / Kaufverträge",
            "Beschaffungs-Historie 24 Mon.",
          ]}
          ctaLabel="Bald verfügbar"
        />
      </div>

      <div className="relative rounded-xl border border-border bg-surface/40 p-8 overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-md bg-background/60 grid place-items-center">
          <div className="text-center">
            <div className="text-sm font-medium">Analyse-Dashboards gesperrt</div>
            <div className="text-xs text-muted-foreground mt-1">
              Lade Daten in mindestens einem Modul hoch, um KPI-Karten, Benchmarks &
              Verhandlungsfenster freizuschalten.
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 opacity-40">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-accent" />
          ))}
        </div>
      </div>
    </div>
  );
}
