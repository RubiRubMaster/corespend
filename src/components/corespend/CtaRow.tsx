import { FileText, Flame } from "lucide-react";

export function CtaRow() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <button className="glass-card px-5 py-4 flex items-center justify-between hover:bg-accent/40 transition-colors group">
        <div className="flex items-center gap-3 text-left">
          <div className="h-10 w-10 rounded-lg bg-accent grid place-items-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-sm font-medium">Management-Report für den CFO herunterladen</div>
            <div className="text-xs text-muted-foreground">PDF · Executive Summary · 2 Seiten</div>
          </div>
        </div>
        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">→</span>
      </button>

      <button className="rounded-xl px-5 py-4 flex items-center justify-between transition-all bg-success text-success-foreground hover:brightness-110 shadow-[0_12px_40px_-12px_color-mix(in_oklab,var(--success)_70%,transparent)]">
        <div className="flex items-center gap-3 text-left">
          <div className="h-10 w-10 rounded-lg bg-success-foreground/10 grid place-items-center">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">Potenzial realisieren: Verhandlungsexperten aktivieren</div>
            <div className="text-xs opacity-80">Erfolgsbasiert · nur Anteil an realisierter Ersparnis</div>
          </div>
        </div>
        <span className="text-sm">→</span>
      </button>
    </div>
  );
}
