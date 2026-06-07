import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CoreSpend — Reinventing technology procurement for the AI era" },
      {
        name: "description",
        content:
          "CoreSpend ist die KI-gestützte Plattform für IT- und Procurement-Teams: vollautomatische Vertrags-, Lizenz- und Mobilfunkanalyse mit Live-Benchmark und Verhandlungs-Unterstützung.",
      },
      { property: "og:title", content: "CoreSpend — Reinventing technology procurement for the AI era" },
      {
        property: "og:description",
        content: "Built to serve IT and procurement teams by reinventing the way they work.",
      },
    ],
  }),
  component: Landing,
});

const BADGES = [
  { emoji: "🛡", label: "DSGVO-konform" },
  { emoji: "🔐", label: "AES-256 Verschlüsselung" },
  { emoji: "🇩🇪", label: "Hosting in Frankfurt" },
  { emoji: "📄", label: "Automatischer NDA-Schutz" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-[480px] w-[480px] rounded-full bg-success/15 blur-3xl" />
      </div>

      <header className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-success grid place-items-center text-sm font-bold text-background">
              CS
            </div>
            <div>
              <div className="text-base font-semibold tracking-tight">CoreSpend</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Enterprise · IT Spend Intelligence
              </div>
            </div>
          </div>
          <Link
            to="/app"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface/60 backdrop-blur px-3.5 py-2 text-xs font-medium text-foreground hover:bg-accent transition"
          >
            Zur Plattform <span>→</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 backdrop-blur px-3 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Enterprise · IT Spend Intelligence
        </span>
        <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
          Reinventing{" "}
          <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
            technology procurement
          </span>{" "}
          for the AI era.
        </h1>
        <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Built to serve IT and procurement teams by reinventing the way they work.
        </p>
        <p className="mt-4 text-sm text-muted-foreground/90 max-w-3xl mx-auto leading-relaxed">
          Die KI-gestützte Plattform, die dein gesamtes IT-Vertragsportfolio vollautomatisch
          durchleuchtet — von Lizenzen bis Mobilfunkflotten. Glasklare Transparenz, CFO-Ready
          Insights und smarte Verhandlungs-Unterstützung auf Knopfdruck.
        </p>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          {BADGES.map((b) => (
            <span
              key={b.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/60 backdrop-blur px-3 py-1.5 text-[11px] text-foreground/90"
            >
              <span>{b.emoji}</span> {b.label}
            </span>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/app"
            className="group inline-flex items-center gap-2 rounded-xl bg-success text-success-foreground px-7 py-4 text-sm font-semibold shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--success)_70%,transparent)] hover:brightness-110 transition"
          >
            Enterprise-Analyse starten
            <span className="transition group-hover:translate-x-0.5">→</span>
          </Link>
          <span className="text-xs text-muted-foreground">
            48h Onboarding · keine Provider-Kündigung notwendig
          </span>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Das CoreSpend-Prinzip</div>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
            Modernste Technologie. Tiefes Marktwissen.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <Step
            n="01"
            title="Infrastruktur- & Vertrags-Intelligenz"
            text="KI-gestützte Auswertung von Rahmenverträgen, Kündigungsfristen und realer Nutzung — Überzahlungen und ungenutzte Lizenzen werden automatisch sichtbar."
          />
          <Step
            n="02"
            title="Live-Benchmark-Daten"
            text="Ein kollaboratives, anonymisiertes DACH-Netzwerk liefert echte Marktpreise vergleichbarer Unternehmen in Echtzeit."
          />
          <Step
            n="03"
            title="Autonome Verhandlungs-Agenten"
            text="Maßgeschneiderte Argumentationsketten, auditiert von zertifizierten IT-Einkaufsexperten — für 100 % Präzision und Compliance."
          />
        </div>
      </section>

      {/* CTA outcome */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="glass-card p-8 md:p-10 text-center">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Dein Ergebnis</div>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight max-w-3xl mx-auto">
            Volle Kostentransparenz und datenbasierte Hebel für deine nächste Verhandlung.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl mx-auto">
            CoreSpend bricht das intransparente B2B IT-Einkaufssystem und stellt IT-Leiter
            und Einkaufsverantwortliche endgültig auf Augenhöhe mit Anbietern.
          </p>
          <Link
            to="/app"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-success text-success-foreground px-7 py-3.5 text-sm font-semibold hover:brightness-110 transition"
          >
            Enterprise-Analyse starten <span>→</span>
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 text-[11px] text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} CoreSpend · Enterprise IT Spend Intelligence</span>
          <span>Made in Germany · DSGVO-konform · Hosting Frankfurt</span>
        </div>
      </footer>
    </div>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="glass-card p-6 relative overflow-hidden">
      <div className="absolute top-4 right-5 text-[11px] font-mono text-muted-foreground/60 tracking-wider">{n}</div>
      <div className="h-10 w-10 rounded-lg bg-accent grid place-items-center text-primary text-xs font-bold">S</div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}
