import { Smartphone, Cloud, CloudCog, Cpu } from "lucide-react";
import { UploadCard } from "./UploadCard";

export function UploadGrid() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Onboarding · Core IT Datenerfassung</h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
          Lade Verträge & Rechnungen aus deinen vier Kern-Kostenblöcken hoch. Jeder freigeschaltete
          Bereich reduziert deinen monatlichen Plattformpreis und schaltet das jeweilige
          Analyse-Dashboard frei.
        </p>
      </div>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
        <UploadCard
          category="mobilfunk"
          title="📞 Telekommunikation"
          icon={Smartphone}
          available
          discount={400}
          subItems={[
            { emoji: "📱", label: "Mobilfunk" },
            { emoji: "☎️", label: "Festnetz" },
            { emoji: "🌐", label: "Daten" },
          ]}
          checklist={[
            "Aktueller Rahmenvertrag (PDF)",
            "Letzte 3 Monatsrechnungen",
            "SIM-/Nutzerliste (CSV/XLSX)",
            "Optional: Nutzungsprotokolle",
          ]}
          ctaLabel="Telekommunikation analysieren & 400 € sparen"
        />
        <UploadCard
          category="m365"
          title="💻 Office Suite"
          icon={Cloud}
          available
          discount={400}
          subItems={[
            { emoji: "🟦", label: "Microsoft 365" },
            { emoji: "…", label: "Weitere folgen" },
          ]}
          checklist={[
            "Microsoft EA / MCA Vertrag",
            "Aktuelle Lizenz-Übersicht (Admin Center Export)",
            "True-Up Historie (12 Monate)",
            "Optional: Azure-Kostenexport",
          ]}
          ctaLabel="Office Suite analysieren & 400 € sparen"
        />
        <UploadCard
          category="saas"
          title="☁️ SaaS & Cloud"
          icon={CloudCog}
          available
          discount={400}
          subItems={[
            { emoji: "🧩", label: "SaaS-Plattformen & Lizenzen" },
            { emoji: "🌩️", label: "Cloud (AWS · Azure · GCP)" },
          ]}
          checklist={[
            "SaaS-Inventar (Top 10 Tools)",
            "Cloud-Provider Rechnungen (AWS / Azure / GCP)",
            "Nutzungs-Reports & Lizenz-Auslastung",
          ]}
          ctaLabel="SaaS & Cloud analysieren & 400 € sparen"
        />
        <UploadCard
          category="hardware"
          title="🔌 Hardware"
          icon={Cpu}
          available
          discount={300}
          subItems={[
            { emoji: "📱", label: "Smartphones" },
            { emoji: "💻", label: "Workplace (Notebooks · PCs · Peripherie)" },
            { emoji: "…", label: "Weitere folgen" },
          ]}
          checklist={[
            "Asset-Inventar Export",
            "Leasing- / Kaufverträge",
            "Beschaffungs-Historie 24 Mon.",
          ]}
          ctaLabel="Hardware analysieren & 300 € sparen"
        />
      </div>
    </div>
  );
}
