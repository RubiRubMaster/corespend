import { Smartphone, Cloud, CloudCog, Cpu, Lock, Settings, Sparkles, LayoutDashboard } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCoreSpend, type Category, type ActiveView } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";

type NavItem = { key: ActiveView; label: string; icon: typeof Smartphone; available: boolean; pinned?: boolean };

const ITEMS: NavItem[] = [
  { key: "overview", label: "Gesamtübersicht (Transparenz)", icon: LayoutDashboard, available: true, pinned: true },
  { key: "mobilfunk", label: "Mobilfunk & Telco", icon: Smartphone, available: true },
  { key: "m365", label: "Microsoft 365", icon: Cloud, available: true },
  { key: "saas", label: "SaaS & Cloud", icon: CloudCog, available: false },
  { key: "hardware", label: "Hardware & Assets", icon: Cpu, available: false },
];


export function Sidebar() {
  const { activeView, setActiveView } = useCoreSpend();

  return (
    <aside className="hidden md:flex w-[260px] shrink-0 flex-col border-r border-border bg-surface/60 backdrop-blur-xl">
      <div className="px-5 py-6 border-b border-border">
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
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          Made to serve IT and Procurement by changing the way you source your Core IT.
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-2 pb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Module
        </div>
        {ITEMS.map((it) => {
          const active = activeView === it.key;
          const Icon = it.icon;
          return (
            <button
              key={it.key}
              onClick={() => it.available && setActiveView(it.key)}
              disabled={!it.available}
              className={cn(
                "group w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                active
                  ? "bg-accent text-foreground border border-border shadow-sm"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                !it.available && "opacity-60 cursor-not-allowed",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left truncate">{it.label}</span>
              {!it.available && (
                <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground">
                  <Lock className="h-3 w-3" /> Bald
                </span>
              )}
            </button>
          );
        })}
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
