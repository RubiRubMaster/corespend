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
    text: "Erfassen Sie Verträge, Rechnungen und Nutzungsdaten. Unsere KI extrahiert alle relevanten KPIs innerhalb kürzester Zeit und bildet diese volltransparent auf einem zentralen Dashboard ab – direkt C-Level und Report-ready.",
  },
  {
    n: "02",
    title: "Potenziale identifizieren",
    text: "Erkennen Sie neue Verhandlungspotenziale, ungenutzte Lizenzen und verdeckte Vertragsrisiken durch die dauerhafte Analyse und den automatisierten Abgleich mit Hunderten von Live-Benchmarks — präzise aufbereitet, um schnelle, datenbasierte Entscheidungen zu treffen.",
  },
  {
    n: "03",
    title: "Verhandlungsmacht sichern",
    text: "Erhalten Sie echte Preisuntergrenzen, datenbasierte Argumentationsketten, klare Wettbewerbsszenarien und einen maßgeschneiderten Verhandlungsleitfaden für maximale Einsparungen, während Sie jederzeit die absolute Kontrolle behalten.",
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
    text: "Sofortige Erfassung und Analyse aller Rahmenvertragsbedingungen, Fristen und Kostenflüsse auf einem Dashboard. Wichtige KPIs wie der Total Tech Spend werden als konsolidiertes Echtzeit-Budget sofort sichtbar.",
  },
  {
    title: "Ungesehene Potenzial-Analyse",
    text: "Automatisiertes Aufdecken von Überzahlungen, verdeckten Vertragsrisiken und ungenutzten Ressourcen (No Usage) durch die kontinuierliche Prüfung von Rechnungen und den Abgleich mit Hunderten DACH-Benchmarks.",
  },
  {
    title: "CFO- & CIO-Ready Insights",
    text: "Managementtaugliche C-Level-Reports und eine genaue Analyse der Financial Exposure (vertragliche Restrisiken), direkt nutzbar für strategische Entscheidungen und die interne Budgetfreigabe in wenigen Minuten.",
  },
  {
    title: "Smarte Verhandlungs-Execution",
    text: "Maximale Einsparungen durch digitale Verhandlungs-Guides, Best-Practice-Szenarien und die Bewertung von Nebenabreden durch den AI-Consultant – bei Bedarf ergänzt durch verifizierte Verhandlungsexperten per Klick.",
  },
];

const HOW_PILLARS = [
  {
    n: "01",
    title: "Infrastruktur-Intelligenz",
    text: "Intelligente Algorithmen scannen reale Nutzungsdaten sowie monatliche Rechnungen und decken ungenutzte Ressourcen (No Usage) über den gesamten IT-Stack hinweg sofort auf.",
  },
  {
    n: "02",
    title: "Automatisierte Vertrags-Analyse",
    text: "KI-gestützte Auswertung von Rahmenverträgen, Fristen und Geldflüssen. Strategische KPIs wie Total Tech Spend und Financial Exposure werden vollautomatisch ermittelt und auf dem Dashboard visualisiert.",
  },
  {
    n: "03",
    title: "Live-Benchmark-Daten",
    text: "Ein kollaboratives, anonymisiertes DACH-Netzwerk aus Tausenden von realen Geschäften liefert echte Markt- und Spitzenpreise vergleichbarer Unternehmen in Echtzeit.",
  },
  {
    n: "04",
    title: "Digitale Verhandlungs-Guides & AI-Consultant",
    text: "Generierung maßgeschneiderter Argumentationsketten, Best-Practice-Szenarien und echter Preisuntergrenzen. Der integrierte AI-Consultant bewertet zusätzlich individuelle Nebenabreden.",
  },
  {
    n: "05",
    title: "Zertifiziertes Experten-Netzwerk",
    text: "Aktivieren Sie per Klick verifizierte CoreSpend-Verhandlungs­experten. Sie steigen ohne teure Vorphasen direkt auf Augenhöhe am Verhandlungstisch ein, um den maximalen Erfolg zu erzielen.",
  },
  {
    n: "06",
    title: "Zentrale IT-Governance & C-Level-Control",
    text: "Ein digitales Kontroll-Cockpit bündelt sämtliche IT-Ausgaben, Vertragsrisiken und Freigaben an einem Ort. Automatisierte Compliance-Checks reduzieren manuelle Abstimmungen auf ein Minimum, wodurch Sie die absolute Hoheit über das gesamte Portfolio behalten.",
    comingSoon: true,
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
            Built to serve IT, procurement and finance teams by reinventing the way they work.
          </span>
        </div>
        <div className="mt-8 max-w-2xl mx-auto space-y-3 text-[15px] text-muted-foreground/80 leading-relaxed tracking-wide text-left md:text-center">
          <p>
            Erfassen Sie Ihren gesamten IT-Stack in einem zentralen Dashboard und erhalten Sie durch den automatisierten Abgleich mit Hunderten DACH-Benchmarks sofort volle Transparenz.
          </p>
          <p>
            CoreSpend überwacht Vertragsbedingungen, Risiken und Geldflüsse vollautomatisch, macht KPIs wie Total Tech Spend und Financial Exposure direkt sichtbar und deckt ungenutzte Ressourcen (No Usage) durch kontinuierliche Prüfung auf.
          </p>
          <p>
            Die Plattform übernimmt die harte Arbeit und begleitet Sie mit smarten Verhandlungs-Guides und verifizierten Experten bis zu den echten Preisuntergrenzen, während Sie die absolute Kontrolle behalten – und jederzeit in Minuten entscheidungsfähig sind.
          </p>
        </div>
        <p className="mt-5 text-[14px] italic max-w-2xl mx-auto leading-relaxed tracking-wide bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
          "It's like having your own dedicated IT procurement, expense, and vendor management department—without the cost of building one."
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
            Drei Schritte zu absoluter Transparenz und Kontrolle
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
            Eine KI-Plattform, die Ihr gesamtes IT-Vertragsportfolio vollautomatisch durchleuchtet.
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
            Modernste Technologie. Tiefes Marktwissen. Sechs Kern-Säulen für Ihren Erfolg.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {HOW_PILLARS.map((p) => (
            <div key={p.n} className={`glass-card p-6 relative overflow-hidden ${p.comingSoon ? 'opacity-70' : ''}`}>
              <div className="absolute top-4 right-5 text-[11px] font-mono text-muted-foreground/60 tracking-wider">
                {p.n}
              </div>
              <h3 className="text-lg font-semibold tracking-tight pr-8 flex items-center gap-2">
                {p.comingSoon && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground shrink-0">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                )}
                {p.title}
                {p.comingSoon && (
                  <span className="ml-auto inline-flex items-center rounded-full border border-border bg-accent px-2 py-0.5 text-[10px] font-medium text-muted-foreground tracking-wide">
                    Coming Soon
                  </span>
                )}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="glass-card p-8 md:p-10 text-center">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">IHR ERGEBNIS</div>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight max-w-3xl mx-auto">
            Maximale Einsparungen und die absolute Hoheit über Ihren gesamten IT-Stack.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl mx-auto">
            Überlassen Sie der KI und verifizierten Experten die harte Arbeit. Steuern Sie Compliance, Fristen und Budgets zentral über ein einziges Dashboard und sichern Sie sich dauerhaft das absolute Marktoptimum.
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
