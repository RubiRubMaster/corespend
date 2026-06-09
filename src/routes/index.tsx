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

const STEPS = [
  {
    n: "01",
    title: "Daten analysieren",
    text: "Lade Verträge, Rechnungen und Nutzungsdaten hoch. Unsere KI extrahiert alle relevanten Kennzahlen innerhalb weniger Minuten.",
  },
  {
    n: "02",
    title: "Potenziale identifizieren",
    text: "Erkenne Überzahlungen, ungenutzte Lizenzen und Benchmark-Abweichungen durch den Abgleich mit hunderten von Live-Benchmarks — präzise aufbereitet für dein nächstes Management-Update.",
  },
  {
    n: "03",
    title: "Verhandlungsmacht sichern",
    text: "Erhalte datenbasierte Argumentationsketten, Drohkulissen und einen maßgeschneiderten Verhandlungsleitfaden für maximale Einsparungen.",
  },
];

const BADGES = [
  { emoji: "🛡️", label: "DSGVO-konform", sub: "Anonymisierung aller Vertrags- und Nutzerdaten vor der Analyse." },
  { emoji: "🔒", label: "AES-256 Verschlüsselung", sub: "Banken-Sicherheitsstandard für Ihre sensiblen Dokumente." },
  { emoji: "🇩🇪", label: "Hosting in Frankfurt", sub: "ISO 27001 Rechenzentren für maximale Data-Compliance." },
  { emoji: "📝", label: "Automatischer NDA-Schutz", sub: "Aktiv ab dem ersten Upload Ihrer IT-Vertragsdaten." },
];

const WHAT_ITEMS = [
  {
    title: "Glasklare Transparenz",
    text: "Sofortige Analyse aller Verträge, Lizenzen und Mobilfunkflotten.",
  },
  {
    title: "Ungesehene Potenziale",
    text: 'Automatisierte Identifikation von Überzahlungen, ungenutzten Lizenzen ("Karteileichen") und massiven Benchmark-Abweichungen.',
  },
  {
    title: "CFO-Ready Insights",
    text: "Managementtaugliche Berichte, direkt nutzbar für die interne Budgetfreigabe.",
  },
  {
    title: "Smarte Verhandlungs-Unterstützung",
    text: "Digitale Vorbereitung und Begleitung von Anbieter-Verhandlungen für das absolute Marktoptimum.",
  },
];

const HOW_PILLARS = [
  {
    n: "01",
    title: "Infrastruktur-Intelligenz",
    text: "Intelligente Algorithmen scannen reale Nutzungsdaten und matchen sie mit vertraglichen Pflichten.",
  },
  {
    n: "02",
    title: "Automatisierte Vertrags-Analyse",
    text: "KI-gestützte Auswertung von Rahmenverträgen, Kündigungsfristen, Zahlungszielen und Sonderklauseln.",
  },
  {
    n: "03",
    title: "Live-Benchmark-Daten",
    text: "Ein kollaboratives, anonymisiertes DACH-Netzwerk liefert echte Marktpreise vergleichbarer Unternehmen in Echtzeit.",
  },
  {
    n: "04",
    title: "Autonome Verhandlungs-Agenten",
    text: "Digitale Assistenten generieren maßgeschneiderte Argumentationsketten und Drohkulissen für den Einkauf.",
  },
  {
    n: "05",
    title: "Zertifiziertes Experten-Netzwerk",
    text: "Jede automatisierte Analyse wird von verifizierten IT-Einkaufsexperten auditiert — für 100% Präzision und Compliance.",
  },
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

      {/* Hero — Vision & Mission (EN) */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-16 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 backdrop-blur px-3 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Enterprise · IT Spend Intelligence
        </span>
        <div className="mt-6 text-6xl md:text-8xl font-bold tracking-tighter leading-[1.0]">
          <span className="text-foreground">Core</span>
          <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
            Spend
          </span>
        </div>
        <div className="mt-6 text-2xl md:text-4xl font-semibold tracking-tight leading-[1.15] max-w-4xl mx-auto">
          <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
            Made to serve IT & Procurement by changing the way you source your Core IT.
          </span>
        </div>
        <p className="mt-8 text-[15px] text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed tracking-wide">
          Unternehmen teilen ihre IT-Vertragsdaten und erhalten durch den Abgleich mit hunderten Branchen-Benchmarks in Echtzeit volle Kostentransparenz. CoreSpend analysiert den gesamten IT-Stack, macht Vertragsbedingungen, Verlängerungen und Ausgaben zentral sichtbar und navigiert Unternehmen datenbasiert zu den Preisuntergrenzen für ihre zentralen IT-Ausgaben.
        </p>
        <p className="mt-5 text-[14px] italic text-muted-foreground/70 max-w-2xl mx-auto leading-relaxed tracking-wide">
          "It's like having your own dedicated IT procurement and expense management department—without the cost of building one."
        </p>

        {/* Trust badges */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {BADGES.map((b) => (
            <div
              key={b.label}
              className="rounded-xl border border-border bg-surface/60 backdrop-blur px-4 py-3 text-left"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <span>{b.emoji}</span> {b.label}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground leading-snug">{b.sub}</div>
            </div>
          ))}
        </div>

        {/* CoreSpend-Prinzip */}
        <div className="mt-14">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">DAS CORESPEND-PRINZIP</div>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight max-w-3xl mx-auto">
            Drei Schritte zu absoluter Kostentransparenz
          </h2>
        </div>

        {/* 3 Steps */}
        <div className="mt-8 grid gap-4 md:grid-cols-3 max-w-5xl mx-auto text-left">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-xl border border-border bg-surface/60 backdrop-blur px-5 py-5 relative overflow-hidden">
              <div className="absolute top-3 right-4 text-[11px] font-mono text-muted-foreground/60 tracking-wider">
                {s.n}
              </div>
              <h3 className="text-sm font-semibold text-foreground tracking-tight pr-6">{s.title}</h3>
              <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">{s.text}</p>
            </div>
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
            24h von Onboarding zu maximaler Transparenz
          </span>
        </div>
      </section>

      {/* The What */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">The What</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight max-w-3xl mx-auto">
            Eine KI-Plattform, die dein gesamtes IT-Vertragsportfolio vollautomatisch durchleuchtet.
          </h2>
          <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Wir haben CoreSpend für IT- und Einkaufsverantwortliche entwickelt, die Transparenz,
            Geschwindigkeit und harte Verhandlungsergebnisse fordern — auf Knopfdruck.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {WHAT_ITEMS.map((i) => (
            <div key={i.title} className="glass-card p-6">
              <div className="h-10 w-10 rounded-lg bg-accent grid place-items-center text-primary text-xs font-bold">
                ✓
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{i.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{i.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The How */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">The How</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight max-w-3xl mx-auto">
            Modernste Technologie. Tiefes Marktwissen. Fünf Kern-Säulen für deinen Erfolg.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {HOW_PILLARS.map((p) => (
            <div key={p.n} className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-4 right-5 text-[11px] font-mono text-muted-foreground/60 tracking-wider">
                {p.n}
              </div>
              <h3 className="text-lg font-semibold tracking-tight pr-8">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
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
