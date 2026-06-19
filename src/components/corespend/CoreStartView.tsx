import { useState } from "react";
import { useCoreSpend, type Category, type CoreStartStatus } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";
import { Phone, Laptop, Cloud, Globe, Cable, Lock, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Tile = {
  key: Category;
  title: string;
  Icon: LucideIcon;
  emoji: string;
  subs: string[];
};

const TILES: Tile[] = [
  { key: "telco", title: "Telekommunikation", emoji: "📞", Icon: Phone, subs: ["Mobilfunk", "Festnetz", "Daten"] },
  { key: "office", title: "Office Suites", emoji: "💻", Icon: Laptop, subs: ["Microsoft 365", "Weitere folgen…"] },
  { key: "saas", title: "SaaS / AI", emoji: "☁️", Icon: Cloud, subs: ["Plattformen & Lizenzen"] },
  { key: "cloud", title: "Cloud", emoji: "🌐", Icon: Globe, subs: ["AWS", "Azure", "GCP", "Weitere folgen…"] },
  { key: "hardware", title: "Hardware", emoji: "🔌", Icon: Cable, subs: ["Smartphones & Tablets", "Workplace (Notebooks, PCs, Peripherie)"] },
];

const STATUS_META: Record<CoreStartStatus, { label: string; badge: string; dot: string }> = {
  analyzed: {
    label: "Analysiert (Aktiv)",
    badge: "border-success/40 bg-success/10 text-success",
    dot: "bg-success shadow-[0_0_10px_rgba(34,197,94,0.6)]",
  },
  pending: {
    label: "Daten ausstehend",
    badge: "border-border bg-background/60 text-foreground",
    dot: "bg-foreground/70",
  },
  comingsoon: {
    label: "Coming Soon",
    badge: "border-border/60 bg-muted/30 text-muted-foreground",
    dot: "bg-muted-foreground/60",
  },
};

export function CoreStartView() {
  const { coreStartStatuses, goMobilfunk, goOfficeUpload } = useCoreSpend();
  const [infoTile, setInfoTile] = useState<Tile | null>(null);

  const onTileClick = (t: Tile) => {
    const status = coreStartStatuses[t.key];
    if (status === "comingsoon") {
      setInfoTile(t);
      return;
    }
    if (t.key === "telco") goMobilfunk();
    else if (t.key === "office") goOfficeUpload();
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">🚀 Core Start</div>
        <h1 className="text-3xl font-semibold tracking-tight">Launchpad · 5 IT-Bereiche</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Ihr zentrales Einstiegsportal. Wählen Sie einen Bereich, um direkt in das jeweilige Cockpit
          oder in die Datenaufnahme zu springen.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {TILES.map((t) => {
          const status = coreStartStatuses[t.key];
          const meta = STATUS_META[status];
          const isComingSoon = status === "comingsoon";
          const Icon = t.Icon;
          return (
            <button
              key={t.key}
              onClick={() => onTileClick(t)}
              className={cn(
                "group relative text-left rounded-2xl border border-border bg-surface/60 backdrop-blur-xl p-6 transition-all duration-300",
                "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.25),0_20px_50px_-20px_hsl(var(--primary)/0.45)]",
                isComingSoon && "opacity-70 hover:opacity-90",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-success/20 grid place-items-center border border-border">
                  <Icon className="h-7 w-7 text-foreground" strokeWidth={1.6} />
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wider",
                    meta.badge,
                  )}
                >
                  {isComingSoon ? (
                    <Lock className="h-3 w-3" />
                  ) : (
                    <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
                  )}
                  {meta.label}
                </span>
              </div>

              <div className="mt-5">
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{t.emoji} Bereich</div>
                <h3 className="text-xl font-semibold tracking-tight mt-1">{t.title}</h3>
              </div>

              <ul className="mt-4 space-y-1.5">
                {t.subs.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
                    {s}
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
                <span>
                  {status === "analyzed" && "→ Cockpit öffnen"}
                  {status === "pending" && "→ Daten hochladen"}
                  {status === "comingsoon" && "→ Mehr erfahren"}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground">›</span>
              </div>
            </button>
          );
        })}
      </div>

      {infoTile && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm p-4"
          onClick={() => setInfoTile(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-border bg-surface/95 backdrop-blur-xl p-6 shadow-2xl"
          >
            <button
              onClick={() => setInfoTile(null)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-success/20 grid place-items-center border border-border mb-4">
              <infoTile.Icon className="h-6 w-6" strokeWidth={1.6} />
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Coming Soon</div>
            <h3 className="text-xl font-semibold tracking-tight mt-1">{infoTile.title}</h3>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Dieser Bereich folgt im nächsten Release. Wir benachrichtigen Sie, sobald
              {` ${infoTile.title} `} freigeschaltet wird — inkl. CoreSpend-Tarif-Rabatt.
            </p>
            <button
              onClick={() => setInfoTile(null)}
              className="mt-5 w-full rounded-lg border border-success/40 bg-success/10 text-success px-4 py-2 text-sm uppercase tracking-wider hover:bg-success/20 transition-colors"
            >
              📬 Auf Warteliste setzen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
