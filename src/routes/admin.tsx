import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CoreSpendProvider,
  useCoreSpend,
  formatEUR,
  CATEGORIES as CAT_KEYS,
  CATEGORY_META,
  type Category,
  type UploadStatus,
} from "@/lib/corespend-store";
import { AppShell } from "@/components/corespend/AppShell";
import { ArrowLeft, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "CoreSpend · Admin" }] }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <CoreSpendProvider>
      <AppShell>
        <AdminInner />
      </AppShell>
    </CoreSpendProvider>
  );
}

const CATEGORIES: { key: Category; label: string }[] = CAT_KEYS.map((k) => ({
  key: k,
  label: CATEGORY_META[k].label,
}));

const STATUSES: UploadStatus[] = ["idle", "processing", "pending", "analyzed"];
const STATUS_LABEL: Record<UploadStatus, string> = {
  idle: "Nicht hochgeladen",
  processing: "Verarbeitung",
  pending: "Ausstehend (Expertenprüfung)",
  analyzed: "Analysiert",
};

function AdminInner() {
  const { categories, setStatus, priceOverride, setPriceOverride, currentPrice, resetAll } = useCoreSpend();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <ArrowLeft className="h-3 w-3" /> Zurück
            </Link>
            <span>·</span>
            <span>Admin-Steuerung</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Live-Steuerung · Präsentationsmodus</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Überschreibe Upload-Status und Pricing-Variablen in Echtzeit.
          </p>
        </div>
        <button
          onClick={resetAll}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Alles zurücksetzen
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
          Upload-Status je Modul
        </div>
        <div className="space-y-3">
          {CATEGORIES.map((c) => (
            <div key={c.key} className="flex items-center justify-between gap-4 py-2 border-b border-border/60 last:border-0">
              <div className="text-sm font-medium">{c.label}</div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground tabular-nums">
                  Aktuell: <span className="text-foreground">{STATUS_LABEL[categories[c.key].status]}</span>
                </span>
                <div className="flex rounded-lg border border-border overflow-hidden">
                  {STATUSES.map((s) => {
                    const active = categories[c.key].status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setStatus(c.key, s)}
                        className={
                          "px-3 py-1.5 text-xs transition-colors " +
                          (active ? "bg-success text-success-foreground" : "hover:bg-accent text-muted-foreground")
                        }
                      >
                        {STATUS_LABEL[s]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
          Pricing-Override
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <div className="text-xs text-muted-foreground">Effektiver Preis</div>
            <div className="text-2xl font-semibold tabular-nums">{formatEUR(currentPrice)} <span className="text-xs text-muted-foreground">/ Monat</span></div>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Override:</label>
            <input
              type="number"
              value={priceOverride ?? ""}
              placeholder="—"
              onChange={(e) => setPriceOverride(e.target.value === "" ? null : Number(e.target.value))}
              className="w-32 rounded-md border border-border bg-background px-3 py-1.5 text-sm tabular-nums focus:outline-none focus:ring-1 focus:ring-success"
            />
            <span className="text-xs text-muted-foreground">€ / Monat</span>
            {priceOverride !== null && (
              <button
                onClick={() => setPriceOverride(null)}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Override entfernen
              </button>
            )}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-3">
          Ohne Override wird der Preis automatisch aus den Upload-Status (Basis 2.800 € − 300 € je Bereich, min. 1.300 €) berechnet.
        </p>
      </div>

      <div className="glass-card p-6">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
          Hochgeladene Testdateien
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="py-2 pr-4 font-medium">Modul</th>
              <th className="py-2 pr-4 font-medium">Dateiname</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map((c) => {
              const s = categories[c.key];
              return (
                <tr key={c.key} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-4">{c.label}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{s.fileName ?? "—"}</td>
                  <td className="py-3">
                    <span className={
                      s.status === "analyzed"
                        ? "text-[11px] px-2 py-1 rounded bg-success/15 text-success font-medium"
                        : s.status === "idle"
                        ? "text-[11px] px-2 py-1 rounded bg-accent text-muted-foreground"
                        : "text-[11px] px-2 py-1 rounded bg-primary/15 text-primary font-medium"
                    }>
                      {STATUS_LABEL[s.status]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
