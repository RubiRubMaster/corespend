import { Bot, Lock, Sparkles, ShieldCheck, Database, Zap } from "lucide-react";
import { useCoreSpend } from "@/lib/corespend-store";

export function CoreAiAgent() {
  const { goToDashboard } = useCoreSpend();
  return (
    <div className="space-y-8">
      <div className="relative glass-card p-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-success/15 pointer-events-none" />
        <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-success/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-success grid place-items-center mb-5 shadow-[0_20px_60px_-10px_color-mix(in_oklab,var(--success)_50%,transparent)]">
            <Bot className="h-10 w-10 text-background" />
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-success border border-success/40 bg-success/10 rounded-full px-3 py-1">
            <Lock className="h-3 w-3" /> Coming Soon · Private Beta
          </span>
          <h1 className="text-4xl font-semibold tracking-tight mt-5">🤖 CoreAI · Negotiation Agent</h1>
          <p className="text-base text-muted-foreground mt-3 leading-relaxed">
            Der autonome KI-Verhandlungsassistent. Trainiert mit den Daten von 1.200+ DACH-Verträgen, um
            vollautomatisch Nachverhandlungen mit deinen Providern zu führen.
          </p>

          <button
            onClick={goToDashboard}
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-success text-success-foreground px-5 py-2.5 text-sm font-medium hover:brightness-110 transition-all"
          >
            <Sparkles className="h-4 w-4" /> Auf die Warteliste setzen
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Feature icon={<Database className="h-5 w-5" />} title="1.200+ DACH-Verträge" desc="Trainiert auf realen Telco-, Cloud- und Hardware-Verträgen des deutschen Mittelstands." />
        <Feature icon={<Zap className="h-5 w-5" />} title="Autonome Verhandlung" desc="Führt selbstständig E-Mail- & Telefon-Verhandlungen mit deinem Provider." />
        <Feature icon={<ShieldCheck className="h-5 w-5" />} title="DSGVO & Audit-trail" desc="Jede Interaktion wird auditfähig dokumentiert · ISO 27001 RZ Deutschland." />
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="glass-card p-5">
      <div className="h-10 w-10 rounded-lg bg-accent grid place-items-center text-primary">{icon}</div>
      <h3 className="font-semibold mt-3">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{desc}</p>
    </div>
  );
}
