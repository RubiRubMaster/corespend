import { useCoreSpend, CATEGORIES, CATEGORY_META, type Category } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";

export function CoreStart() {
  const { goToCategory, categories } = useCoreSpend();

  return (
    <div className="space-y-8">
      <header>
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          🚀 Core Start
        </div>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">
          Wähle deinen Einstiegspunkt
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
          Fünf Hauptbereiche deiner Core IT. Klicke eine Karte an, um die enthaltenen Unterpunkte zu sehen und
          Daten hochzuladen.
        </p>
      </header>

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <StartCard key={c} category={c} unlocked={categories[c].status !== "idle"} onClick={() => goToCategory(c)} />
        ))}
      </div>
    </div>
  );
}

function StartCard({ category, unlocked, onClick }: { category: Category; unlocked: boolean; onClick: () => void }) {
  const meta = CATEGORY_META[category];

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative text-left glass-card p-6 overflow-hidden transition-all duration-300 min-h-[260px] flex flex-col",
        "hover:-translate-y-1 hover:shadow-[0_30px_80px_-40px_color-mix(in_oklab,var(--primary)_60%,transparent)]",
        unlocked && "glow-success",
      )}
    >
      <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative flex items-start justify-between mb-6">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-success/20 grid place-items-center border border-border text-2xl">
          {meta.emoji}
        </div>
        <span className="text-muted-foreground group-hover:text-primary transition-colors text-sm">→</span>
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{meta.emoji}</span>
          <h3 className="text-xl font-semibold tracking-tight">{meta.label}</h3>
        </div>
        {unlocked && (
          <span className="inline-flex items-center text-[10px] uppercase tracking-wider text-success border border-success/40 bg-success/10 rounded-full px-2 py-0.5 mb-3">
            Live
          </span>
        )}
      </div>

      <div className="relative mt-auto pt-5 border-t border-border/60 space-y-1.5">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Enthält</div>
        {meta.subs.map((s) => (
          <div key={s.key} className="flex items-center gap-2 text-xs text-foreground/85">
            <span>{s.emoji}</span>
            <span className={cn(s.available === false && "text-muted-foreground italic")}>{s.label}</span>
          </div>
        ))}
      </div>
    </button>
  );
}
