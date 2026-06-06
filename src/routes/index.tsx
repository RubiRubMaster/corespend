import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles, BarChart3, Upload, LineChart, Smartphone, Cloud, CloudCog, Cpu } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CoreSpend — Core IT Spend Intelligence" },
      {
        name: "description",
        content:
          "CoreSpend ist Deutschlands erste KI-gestützte Plattform für IT-Leiter und Einkaufsverantwortliche zur Analyse, Benchmark und Optimierung der Kern-IT-Ausgaben.",
      },
      { property: "og:title", content: "CoreSpend — Core IT Spend Intelligence" },
      {
        property: "og:description",
        content: "Made to serve IT & Procurement by changing the way you source your Core IT.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Ambient gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-[480px] w-[480px] rounded-full bg-success/15 blur-3xl" />
      </div>

      {/* Nav */}
      <header className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-success grid place-items-center">
              <Sparkles className="h-5 w-5 text-background" />
            </div>
            <div>
              <div className="text-base font-semibold tracking-tight">CoreSpend</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                IT & Procurement Intelligence
              </div>
            </div>
          </div>
          <Link
            to="/app"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface/60 backdrop-blur px-3.5 py-2 text-xs font-medium text-foreground hover:bg-accent transition"
          >
            Zur Plattform <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 backdrop-blur px-3 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Live · KI-gestützte Core IT Plattform
        </span>
        <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
          Core<span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">Spend</span>
        </h1>
        <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Made to serve IT &amp; Procurement by changing the way you source your Core IT.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/app"
            className="group inline-flex items-center gap-2 rounded-xl bg-success text-success-foreground px-6 py-3.5 text-sm font-semibold shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--success)_70%,transparent)] hover:brightness-110 transition"
          >
            Jetzt Starten
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> DSGVO-konform · AES-256 verschlüsselt
          </span>
        </div>
      </section>

      {/* Wie es funktioniert */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Wie CoreSpend funktioniert</div>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
            Drei Schritte zu voller Kostentransparenz
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <Step
            n="01"
            icon={<Upload className="h-5 w-5" />}
            title="Daten teilen"
            text="Lade Verträge, Rechnungen und Lizenz-Reports in unsere sichere Umgebung. Jede Datei reduziert deinen Plattformpreis."
          />
          <Step
            n="02"
            icon={<BarChart3 className="h-5 w-5" />}
            title="Benchmark nutzen"
            text="Unsere KI vergleicht deine Konditionen in Echtzeit mit anonymisierten DACH-Marktdaten — ehrlich, datenbasiert, transparent."
          />
          <Step
            n="03"
            icon={<LineChart className="h-5 w-5" />}
            title="Kosten senken"
            text="Erhalte konkrete Verhandlungshebel und Verhandlungsfenster — oder lass unsere Experten direkt für dich verhandeln."
          />
        </div>
      </section>

      {/* Bereiche */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Abgedeckte Bereiche</div>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
            Deine gesamte Core IT — auf einer Plattform
          </h2>
        </div>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <AreaTile icon={<Smartphone className="h-5 w-5" />} label="Telekommunikation" sub="Mobilfunk · Festnetz · Daten" />
          <AreaTile icon={<Cloud className="h-5 w-5" />} label="Office Suite" sub="Microsoft 365 & mehr" />
          <AreaTile icon={<CloudCog className="h-5 w-5" />} label="SaaS & Cloud" sub="Lizenzen · AWS · Azure · GCP" />
          <AreaTile icon={<Cpu className="h-5 w-5" />} label="Hardware" sub="Smartphones · Workplace" />
        </div>
      </section>

      {/* Outcome */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="glass-card p-8 md:p-10 text-center">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Dein Ergebnis</div>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight max-w-3xl mx-auto">
            Volle Kostentransparenz und datenbasierte Hebel für deine nächste Verhandlung.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl mx-auto">
            CoreSpend bricht das traditionelle, intransparente B2B IT-Einkaufssystem — und stellt IT-Leiter und
            Einkaufsverantwortliche endgültig auf Augenhöhe mit Anbietern.
          </p>
          <Link
            to="/app"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-success text-success-foreground px-6 py-3.5 text-sm font-semibold hover:brightness-110 transition"
          >
            Jetzt Starten <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 text-[11px] text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} CoreSpend · Core IT Spend Intelligence</span>
          <span>Made in Germany · DSGVO-konform</span>
        </div>
      </footer>
    </div>
  );
}

function Step({ n, icon, title, text }: { n: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="glass-card p-6 relative overflow-hidden">
      <div className="absolute top-4 right-5 text-[11px] font-mono text-muted-foreground/60 tracking-wider">{n}</div>
      <div className="h-10 w-10 rounded-lg bg-accent grid place-items-center text-primary">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}

function AreaTile({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <div className="glass-card p-5">
      <div className="h-9 w-9 rounded-lg bg-accent grid place-items-center text-primary">{icon}</div>
      <div className="mt-3 text-sm font-semibold tracking-tight">{label}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}
