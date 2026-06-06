import { useEffect, useState } from "react";
import type { Category } from "@/lib/corespend-store";

const STEPS = [
  "Verschlüsselung via AES-256 …",
  "Anonymisierung personenbezogener Daten (DSGVO) …",
  "Abgleich mit 1.200+ DACH-Verträgen …",
  "Kostenstrukturen werden segmentiert …",
  "Benchmark-Cluster wird berechnet …",
  "Optimierungspotenzial wird quantifiziert …",
];

export function ProcessingPane({ category: _category, title }: { category: Category; title: string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass-card p-6 flex flex-col gap-5 relative overflow-hidden min-h-[420px]">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-success to-transparent animate-shimmer" />
      </div>

      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-accent grid place-items-center text-success text-sm font-bold animate-pulse">
          ↻
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">Datenverarbeitung läuft</p>
        </div>
      </div>

      {/* Animated data stream */}
      <div className="flex items-end justify-center gap-1 h-24">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className="w-1.5 rounded-full bg-gradient-to-t from-primary/40 to-success animate-data-pulse"
            style={{
              height: `${30 + ((i * 13) % 70)}%`,
              animationDelay: `${(i * 80) % 1200}ms`,
            }}
          />
        ))}
      </div>

      <div className="rounded-lg border border-border bg-background/40 px-4 py-3 min-h-[56px] flex items-center">
        <span className="text-sm text-foreground/90 transition-opacity">{STEPS[step]}</span>
      </div>

      <div className="rounded-lg border border-success/30 bg-success/5 px-4 py-3 flex items-start gap-3">
        <span className="text-success mt-0.5 shrink-0 text-sm">◷</span>
        <div className="text-xs leading-relaxed">
          <div className="font-medium text-foreground">Expertenprüfung: 24–48 Stunden</div>
          <div className="text-muted-foreground mt-0.5">
            Dein Preis-Rabatt ist <span className="text-success">ab sofort aktiv</span> und in der Top-Bar sichtbar.
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
        <span className="text-success text-xs">🛡</span> Verarbeitung in deutschem Rechenzentrum · ISO 27001
      </div>
    </div>
  );
}
