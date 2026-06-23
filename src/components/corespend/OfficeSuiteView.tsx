import { useRef, useState } from "react";
import { useCoreSpend } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

const eur = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(n);

const LICENSE_DATA = [
  { name: "Microsoft 365 E5", value: 15, color: "hsl(210 90% 55%)" },
  { name: "Microsoft 365 E3", value: 3, color: "hsl(265 75% 60%)" },
  { name: "Microsoft 365 F3", value: 2, color: "hsl(160 70% 45%)" },
];

const DEPT_DATA = [
  { dept: "Produkt-Entwicklung", cost: 165 },
  { dept: "Vertrieb", cost: 110 },
  { dept: "Marketing", cost: 110 },
  { dept: "IT-Infrastruktur", cost: 110 },
  { dept: "Produktion", cost: 120 },
  { dept: "Restliche", cost: 399 },
];

type UserRow = {
  user: string;
  dept: string;
  license: string;
  cost: number;
  status: string;
  recommendation: string;
  saving: number;
  critical?: boolean;
};

const USERS: UserRow[] = [
  { user: "b.schulz@firma.de", dept: "HR", license: "M365 E5", cost: 55, status: "Zombie-Lizenz: Seit 15.01. inaktiv", recommendation: "Löschen", saving: 55, critical: true },
  { user: "j.zimmermann@firma.de", dept: "Produkt-Entwicklung", license: "M365 E5", cost: 55, status: "Zombie-Lizenz: Seit 30.11. inaktiv", recommendation: "Löschen", saving: 55, critical: true },
  { user: "p.koch@firma.de", dept: "Produktion", license: "M365 E5", cost: 55, status: "Over-Licensing: Keine PowerBI/OneDrive Nutzung", recommendation: "Downgrade auf F3", saving: 45 },
  { user: "l.bauer@firma.de", dept: "Produktion", license: "M365 E5", cost: 55, status: "Over-Licensing: Keine PowerBI/OneDrive Nutzung", recommendation: "Downgrade auf F3", saving: 45 },
  { user: "c.braun@firma.de", dept: "Logistik", license: "M365 E5", cost: 55, status: "Over-Licensing: Geringe Nutzung", recommendation: "Downgrade auf F3", saving: 45 },
];

export function OfficeSuiteView() {
  const { goDashboard, effectiveOfficeSpend, effectiveOfficeSavings } = useCoreSpend();
  const [file, setFile] = useState<File | undefined>();
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function pickFile(f: File | undefined) {
    if (!f) return;
    if (f.size > MAX_UPLOAD_BYTES) {
      toast.error("Datei zu groß", { description: "Maximale Größe: 50 MB." });
      return;
    }
    setFile(f);
    toast.success("Datei akzeptiert", { description: f.name });
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
            💻
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Office-Suite · Microsoft 365 / Workspace
            </div>
            <h1 className="text-3xl font-semibold tracking-tight mt-0.5">Office-Suite</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Lizenz-Auslastung, Zombie-Accounts und Tier-Mismatches in Microsoft 365 / Workspace —
              KI-validiert je Nutzer & Abteilung.
            </p>
          </div>
        </div>
      </div>

      {/* Upload zone */}
      <div className="glass-card p-5">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
          Datenupload · Lizenz-Export (CSV/PDF)
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
              <>Lizenz-Report hierher ziehen oder <span className="text-primary">durchsuchen</span></>
            )}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">CSV · PDF · XLSX — max. 50 MB · AES-256 · DSGVO</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => pickFile(e.target.files?.[0])}
          />
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard label="Total License Spend" value={`${eur(1014)}`} sub="/ Monat · 20 Lizenzen aktiv" />
        <KpiCard
          label="Identifiziertes Potenzial"
          value={`${eur(245)}`}
          sub="/ Monat · 5 Accounts mit Handlungsbedarf"
          tone="warning"
        />
        <KpiCard label="Aktive Nutzer" value="18 / 20" sub="2 Zombie-Lizenzen detektiert" />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Lizenz-Verteilung">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={LICENSE_DATA}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                stroke="hsl(var(--background))"
                strokeWidth={2}
                label={(e) => `${e.value}`}
              >
                {LICENSE_DATA.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [`${v} Lizenzen`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center text-[11px]">
            {LICENSE_DATA.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
                <span className="text-foreground/90">{d.value}× {d.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Kosten nach Abteilung">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={DEPT_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="dept"
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickFormatter={(v) => `${v}€`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [`${eur(v)} / Monat`, "Kosten"]}
              />
              <Bar dataKey="cost" fill="hsl(210 90% 55%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Detail table */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide">
            KI-Arbeitsplatz-Analyse: Ungenutzte & überlizenzierte Accounts
          </h3>
          <span className="text-[11px] text-muted-foreground">
            {USERS.length} Befunde · Gesamtpotenzial {eur(USERS.reduce((a, u) => a + u.saving, 0))} / Monat
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-6 py-3 font-medium">Nutzer</th>
                <th className="px-4 py-3 font-medium">Abteilung</th>
                <th className="px-4 py-3 font-medium">Lizenztyp</th>
                <th className="px-4 py-3 font-medium text-right">Kosten</th>
                <th className="px-4 py-3 font-medium">Status / Empfehlung</th>
                <th className="px-6 py-3 font-medium text-right">Einsparung</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map((u) => (
                <tr key={u.user} className="border-b border-border/60 hover:bg-accent/30">
                  <td className="px-6 py-3 font-medium text-foreground/90">{u.user}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.dept}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center text-[11px] rounded-full border border-border bg-surface/40 px-2 py-0.5">
                      {u.license}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{eur(u.cost)}</td>
                  <td className="px-4 py-3">
                    <div className={cn("text-[12px] font-medium", u.critical ? "text-destructive" : "text-[hsl(32_95%_60%)]")}>
                      {u.critical ? "🔴 " : "🟠 "}{u.status}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Empfehlung: {u.recommendation}</div>
                  </td>
                  <td className="px-6 py-3 text-right tabular-nums text-success font-semibold">
                    −{eur(u.saving)}
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
    <div className="glass-card p-5">
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

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-5 flex flex-col gap-3">
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      {children}
    </div>
  );
}
