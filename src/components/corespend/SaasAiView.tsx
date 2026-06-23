import { useRef, useState } from "react";
import { useCoreSpend } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceDot,
} from "recharts";

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

const usd = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);

// Daily June spend; flat 10-40 days 1-9, massive spike on 10 (2650), back to 16.25 from day 11
const DAILY_SPEND = [
  { day: "01.06.", cost: 14.2 },
  { day: "02.06.", cost: 22.5 },
  { day: "03.06.", cost: 18.7 },
  { day: "04.06.", cost: 31.4 },
  { day: "05.06.", cost: 39.5 },
  { day: "06.06.", cost: 12.1 },
  { day: "07.06.", cost: 15.8 },
  { day: "08.06.", cost: 28.6 },
  { day: "09.06.", cost: 12.6 },
  { day: "10.06.", cost: 2650 },
  { day: "11.06.", cost: 16.25 },
  { day: "12.06.", cost: 16.25 },
  { day: "13.06.", cost: 16.25 },
  { day: "14.06.", cost: 16.25 },
  { day: "15.06.", cost: 16.25 },
  { day: "16.06.", cost: 16.25 },
  { day: "17.06.", cost: 16.25 },
  { day: "18.06.", cost: 16.25 },
  { day: "19.06.", cost: 16.25 },
  { day: "20.06.", cost: 16.25 },
];

type TokenRow = {
  date: string;
  project: string;
  model: string;
  tokens: string;
  cost: number;
  statusEmoji: string;
  statusLabel: string;
  critical?: boolean;
};

const TOKEN_ROWS: TokenRow[] = [
  { date: "10.06.2026", project: "Data_Analytics_Pipeline", model: "gpt-4o", tokens: "430 Mio.", cost: 2650.0, statusEmoji: "🔴", statusLabel: "KRITISCH: Kosten-Explosion / Mögliche Endlosschleife detektiert", critical: true },
  { date: "09.06.2026", project: "Customer_Support_AI", model: "gpt-4o-mini", tokens: "9,7 Mio.", cost: 12.6, statusEmoji: "🟢", statusLabel: "Normaler Verbrauch" },
  { date: "05.06.2026", project: "Data_Analytics_Pipeline", model: "gpt-4o", tokens: "4,7 Mio.", cost: 39.5, statusEmoji: "🟢", statusLabel: "Normaler Verbrauch" },
];

export function SaasAiView() {
  const { goDashboard } = useCoreSpend();
  const [file, setFile] = useState<File | undefined>();
  const [dragging, setDragging] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function pickFile(f: File | undefined) {
    if (!f) return;
    if (f.size > MAX_UPLOAD_BYTES) {
      toast.error("Datei zu groß", { description: "Maximale Größe: 50 MB." });
      return;
    }
    setFile(f);
    toast.success("Verbrauchs-CSV akzeptiert", { description: f.name });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={goDashboard}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <span>←</span> Zurück zu Core Analytics
        </button>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/25 to-success/25 grid place-items-center border border-border text-2xl">
            🤖
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              SaaS / AI · Consumption & Token Monitoring
            </div>
            <h1 className="text-3xl font-semibold tracking-tight mt-0.5">SaaS / AI</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              KI-Infrastruktur- und API-Kostenüberwachung. Anomalien, Kosten-Explosionen und
              Forecast-Risiken in Echtzeit erkannt.
            </p>
          </div>
        </div>
      </div>

      {/* Upload + API key */}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass-card p-5">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
            Verbrauchs-Daten · CSV-Upload
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
              "rounded-xl border-2 border-dashed border-border bg-background/40 px-6 py-8 text-center cursor-pointer transition-colors",
              dragging && "border-success bg-success/10",
            )}
          >
            <div className="text-2xl text-muted-foreground">↑</div>
            <p className="text-sm mt-2">
              {file ? (
                <span className="text-foreground">{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</span>
              ) : (
                <>Verbrauchs-CSV hierher ziehen oder <span className="text-primary">durchsuchen</span></>
              )}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">CSV · XLSX — max. 50 MB</p>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
          </div>
        </div>

        <div className="glass-card p-5 flex flex-col gap-3">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Billing-API-Schlüssel (read-only)
          </div>
          <p className="text-[12px] text-muted-foreground leading-snug">
            Optional: schreibgeschützter API-Key für Live-Monitoring (OpenAI, Anthropic, AWS Bedrock).
          </p>
          <input
            type="password"
            placeholder="sk-readonly-•••••••••••••••"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="rounded-lg border border-border bg-background/40 px-3 py-2.5 text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
          />
          <button
            onClick={() => apiKey ? toast.success("API-Key sicher hinterlegt", { description: "Live-Monitoring aktiv." }) : toast.error("Bitte API-Key eingeben")}
            className="rounded-lg bg-primary/15 text-primary border border-primary/40 px-3 py-2 text-xs font-semibold hover:bg-primary/25 transition"
          >
            🔐 Verbinden
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard label="Month-to-Date Spend" value={usd(2784.6)} sub="Juni 2026 · 20 Tage" />
        <KpiCard
          label="Identifizierter Schaden (Anomalie)"
          value={usd(2610)}
          sub="Peak am 10.06. · von CoreSpend abgefangen"
          tone="destructive"
        />
        <KpiCard
          label="Hochgerechnetes Risiko (Forecast)"
          value={usd(38000)}
          sub="ohne CoreSpend-Warnung · monatliche Hochrechnung"
          tone="warning"
        />
      </div>

      {/* Chart */}
      <div className="glass-card p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-semibold tracking-tight">Täglicher Kosten-Verlauf · Juni 2026</h3>
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-destructive border border-destructive/40 bg-destructive/10 rounded-full px-2 py-0.5">
            ● KI-Anomalie abgefangen
          </span>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={DAILY_SPEND} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k$` : `${v}$`}
            />
            <Tooltip
              contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => [usd(v), "Tageskosten"]}
            />
            <Line
              type="monotone"
              dataKey="cost"
              stroke="hsl(210 90% 55%)"
              strokeWidth={2.2}
              dot={{ r: 3, fill: "hsl(210 90% 55%)" }}
              activeDot={{ r: 5 }}
            />
            <ReferenceDot
              x="10.06."
              y={2650}
              r={7}
              fill="hsl(var(--destructive))"
              stroke="hsl(var(--background))"
              strokeWidth={2}
              label={{
                value: "KI-Anomalie abgefangen",
                position: "top",
                fill: "hsl(var(--destructive))",
                fontSize: 11,
                fontWeight: 600,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detail table */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide">
            AI-Infrastruktur & API-Kostenüberwachung
          </h3>
          <span className="text-[11px] text-muted-foreground">
            {TOKEN_ROWS.length} Vorgänge · 1 kritisch
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-6 py-3 font-medium">Datum</th>
                <th className="px-4 py-3 font-medium">Projekt</th>
                <th className="px-4 py-3 font-medium">Modell</th>
                <th className="px-4 py-3 font-medium text-right">Verbrauch (Token)</th>
                <th className="px-4 py-3 font-medium text-right">Tageskosten</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_ROWS.map((r) => (
                <tr key={r.date + r.project} className={cn(
                  "border-b border-border/60 hover:bg-accent/30",
                  r.critical && "bg-destructive/5",
                )}>
                  <td className="px-6 py-3 tabular-nums text-foreground/90">{r.date}</td>
                  <td className="px-4 py-3 font-mono text-[12px]">{r.project}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center text-[11px] rounded-full border border-border bg-surface/40 px-2 py-0.5 font-mono">
                      {r.model}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.tokens}</td>
                  <td className={cn(
                    "px-4 py-3 text-right tabular-nums font-semibold",
                    r.critical ? "text-destructive" : "text-foreground/90",
                  )}>
                    {usd(r.cost)}
                  </td>
                  <td className="px-6 py-3">
                    <div className={cn(
                      "text-[12px] font-medium",
                      r.critical ? "text-destructive" : "text-success",
                    )}>
                      {r.statusEmoji} {r.statusLabel}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "warning" | "destructive" | "success" }) {
  return (
    <div className={cn(
      "glass-card p-5",
      tone === "destructive" && "border-destructive/40 bg-destructive/5",
    )}>
      <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{label}</div>
      <div className={cn(
        "mt-2 text-2xl font-semibold tabular-nums tracking-tight",
        tone === "warning" && "text-[hsl(32_95%_60%)]",
        tone === "destructive" && "text-destructive",
        tone === "success" && "text-success",
      )}>
        {value}
      </div>
      {sub && <div className="mt-1.5 text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}
