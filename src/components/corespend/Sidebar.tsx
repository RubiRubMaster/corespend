import { Settings, Sparkles, LayoutDashboard, Rocket, FolderTree, UploadCloud, Bot, Lock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCoreSpend, type ActiveView } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";

type NavItem = { key: ActiveView; label: string; icon: typeof LayoutDashboard; emoji: string };

const PRIMARY: NavItem[] = [
  { key: "dashboard", label: "Core Dashboard", icon: LayoutDashboard, emoji: "📊" },
  { key: "start", label: "Core Start", icon: Rocket, emoji: "🚀" },
  { key: "kategorie", label: "Core Kategorien", icon: FolderTree, emoji: "🗂️" },
  { key: "upload", label: "Core DataUpload", icon: UploadCloud, emoji: "📥" },
];

export function Sidebar() {
  const { activeView, setActiveView, goToDashboard, goToStart, currentCategory, currentSub, goToCategory, goToUpload } = useCoreSpend();

  const handle = (k: ActiveView) => {
    if (k === "dashboard") return goToDashboard();
    if (k === "start") return goToStart();
    if (k === "kategorie") {
      if (currentCategory) return goToCategory(currentCategory);
      return goToStart(); // need a category first
    }
    if (k === "upload") {
      if (currentCategory && currentSub) return goToUpload(currentCategory, currentSub);
      return goToStart();
    }
    setActiveView(k);
  };

  return (
    <aside className="hidden md:flex w-[260px] shrink-0 flex-col border-r border-border bg-surface/60 backdrop-blur-xl">
      <div className="px-5 py-6 border-b border-border">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-success grid place-items-center">
            <Sparkles className="h-5 w-5 text-background" />
          </div>
          <div>
            <div className="text-base font-semibold tracking-tight group-hover:text-primary transition-colors">CoreSpend</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              IT & Procurement Intelligence
            </div>
          </div>
        </Link>
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          Made to serve IT & Procurement by changing the way you source your Core IT.
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-2 pb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          System
        </div>
        {PRIMARY.map((it) => {
          const disabled =
            (it.key === "kategorie" && !currentCategory) ||
            (it.key === "upload" && (!currentCategory || !currentSub));
          return (
            <NavBtn
              key={it.key}
              item={it}
              active={activeView === it.key}
              disabled={disabled}
              onClick={() => handle(it.key)}
            />
          );
        })}

        <div className="my-4 mx-2 border-t border-border/60" />

        <button
          onClick={() => setActiveView("ai")}
          className={cn(
            "group w-full text-left rounded-xl p-3 border transition-all relative overflow-hidden",
            activeView === "ai"
              ? "border-success/60 bg-success/10"
              : "border-border bg-gradient-to-br from-primary/5 via-transparent to-success/10 hover:border-success/40",
          )}
        >
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-success grid place-items-center shrink-0">
              <Bot className="h-4 w-4 text-background" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold leading-tight truncate">CoreAI · Negotiation</div>
              <div className="text-[10px] uppercase tracking-wider text-success/90 flex items-center gap-1 mt-0.5">
                <Lock className="h-2.5 w-2.5" /> Coming Soon
              </div>
            </div>
          </div>
          <p className="mt-2 text-[10.5px] leading-snug text-muted-foreground">
            Autonomer KI-Verhandlungsassistent · trainiert auf 1.200+ DACH-Verträgen.
          </p>
        </button>
      </nav>

      <div className="px-3 py-4 border-t border-border space-y-1">
        <Link
          to="/admin"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>Admin-Ansicht</span>
        </Link>
      </div>
    </aside>
  );
}

function NavBtn({ item, active, disabled, onClick }: { item: NavItem; active: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
        active
          ? "bg-accent text-foreground border border-border shadow-sm"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
        disabled && "opacity-50",
      )}
      title={disabled ? "Bitte erst eine Kategorie auswählen" : undefined}
    >
      <span className="text-base leading-none w-5 text-center">{item.emoji}</span>
      <span className="flex-1 text-left truncate">{item.label}</span>
    </button>
  );
}
