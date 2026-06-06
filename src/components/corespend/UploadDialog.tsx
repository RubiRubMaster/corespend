import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { UploadCard } from "./UploadCard";
import type { Category } from "@/lib/corespend-store";
import { Smartphone, Cloud, CloudCog, Cpu } from "lucide-react";

const CONFIG: Record<
  Category,
  {
    title: string;
    icon: typeof Smartphone;
    available: boolean;
    checklist: string[];
    ctaLabel: string;
    discount: number;
  }
> = {
  mobilfunk: {
    title: "Mobilfunk & Telco",
    icon: Smartphone,
    available: true,
    discount: 400,
    checklist: [
      "Aktueller Rahmenvertrag (PDF)",
      "Letzte 3 Monatsrechnungen",
      "SIM-/Nutzerliste (CSV/XLSX)",
      "Optional: Nutzungsprotokolle",
    ],
    ctaLabel: "Mobilfunk-Analyse starten & 400 € sparen",
  },
  m365: {
    title: "Microsoft 365",
    icon: Cloud,
    available: true,
    discount: 400,
    checklist: [
      "Microsoft EA / MCA Vertrag",
      "Aktuelle Lizenz-Übersicht (Admin Center Export)",
      "True-Up Historie (12 Monate)",
      "Optional: Azure-Kostenexport",
    ],
    ctaLabel: "M365-Analyse starten & 400 € sparen",
  },
  saas: {
    title: "SaaS & Cloud",
    icon: CloudCog,
    available: true,
    discount: 400,
    checklist: [
      "SaaS-Inventar (Top 10 Tools)",
      "Cloud-Provider Rechnungen",
      "Nutzungs-Reports",
    ],
    ctaLabel: "SaaS-Analyse starten & 400 € sparen",
  },
  hardware: {
    title: "Hardware & Assets",
    icon: Cpu,
    available: true,
    discount: 300,
    checklist: [
      "Asset-Inventar Export",
      "Leasing- / Kaufverträge",
      "Beschaffungs-Historie 24 Mon.",
    ],
    ctaLabel: "Hardware-Analyse starten & 300 € sparen",
  },
};

export function UploadDialog({
  category,
  open,
  onOpenChange,
}: {
  category: Category | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  if (!category) return null;
  const cfg = CONFIG[category];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-surface border-border">
        <DialogHeader>
          <DialogTitle>Transparenz freischalten · {cfg.title}</DialogTitle>
          <DialogDescription>
            Lade die benötigten Dokumente hoch. Die KI-Analyse startet sofort, dein Daten-Bonus wird live aktiviert.
          </DialogDescription>
        </DialogHeader>
        <UploadCard category={category} {...cfg} />
      </DialogContent>
    </Dialog>
  );
}
