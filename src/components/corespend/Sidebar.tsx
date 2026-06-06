import { Smartphone, Cloud, CloudCog, Cpu, Settings, Sparkles, LayoutDashboard, Upload } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCoreSpend, type ActiveView } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";

type NavItem = { key: ActiveView; label: string; icon: typeof Smartphone; pinned?: boolean };

const PRIMARY: NavItem[] = [
  { key: "onboarding", label: "Onboarding · Daten-Upload", icon: Upload, pinned: true },
  { key: "overview", label: "Management Overview", icon: LayoutDashboard, pinned: true },
];

const MODULES: NavItem[] = [
  { key: "mobilfunk", label: "Telekommunikation", icon: Smartphone },
  { key: "m365", label: "Office Suite", icon: Cloud },
  { key: "saas", label: "SaaS & Cloud", icon: CloudCog },
  { key: "hardware", label: "Hardware", icon: Cpu },
];

export function Sidebar() {
  const { activeView, setActiveView } = useCoreSpend();

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

      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-2 pb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Cockpit
        </div>
        {PRIMARY.map((it) => (
          <NavBtn key={it.key} item={it} active={activeView === it.key} onClick={() => setActiveView(it.key)} />
        ))}
        <div className="my-3 mx-2 border-t border-border/60" />
        <div className="px-2 pb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Bereiche
        </div>
        {MODULES.map((it) => (
          <NavBtn key={it.key} item={it} active={activeView === it.key} onClick={() => setActiveView(it.key)} />
        ))}
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

function NavBtn({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
        active
          ? "bg-accent text-foreground border border-border shadow-sm"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
        item.pinned && !active && "text-foreground",
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", item.pinned && "text-primary")} />
      <span className="flex-1 text-left truncate">{item.label}</span>
    </button>
  );
}
