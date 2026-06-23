import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useCoreSpend, CATEGORIES_META, type Category } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export function Sidebar() {
  const { activeView, goCockpit, goCoreStart, goDashboard, goMobilfunk, goOfficeSuite, goSaasAi, goLocked, mobilfunkStatus } = useCoreSpend();
  const [telcoOpen, setTelcoOpen] = useState(activeView === "mobilfunk");
  const [officeOpen, setOfficeOpen] = useState(activeView === "officesuite");
  const [saasOpen, setSaasOpen] = useState(activeView === "saasai");

  return (
    <aside className="hidden md:flex w-[272px] shrink-0 flex-col border-r border-border bg-surface/60 backdrop-blur-xl">
      <div className="px-5 py-6 border-b border-border">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-success grid place-items-center text-sm font-bold text-background">
            CS
          </div>
          <div>
            <div className="text-base font-semibold tracking-tight group-hover:text-primary transition-colors">CoreSpend</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Enterprise · IT Spend Intelligence
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <button
          onClick={goCockpit}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
            activeView === "cockpit"
              ? "bg-gradient-to-r from-success/15 to-primary/10 text-foreground border border-success/30 shadow-sm"
              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
          )}
        >
          <span className="text-base w-5 text-center">💼</span>
          <span className="flex-1 text-left">Core Cockpit</span>
          <span className="text-[9px] uppercase tracking-wider text-success">C-Level</span>
        </button>

        <button
          onClick={goCoreStart}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
            activeView === "corestart"
              ? "bg-gradient-to-r from-primary/15 to-success/10 text-foreground border border-primary/30 shadow-sm"
              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
          )}
        >
          <span className="text-base w-5 text-center">🚀</span>
          <span className="flex-1 text-left">Core Start</span>
          <span className="text-[9px] uppercase tracking-wider text-primary">Launchpad</span>
        </button>

        <button
          onClick={goDashboard}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
            activeView === "dashboard"
              ? "bg-accent text-foreground border border-border shadow-sm"
              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
          )}
        >
          <span className="text-base w-5 text-center">📊</span>
          <span className="flex-1 text-left">Core Analytics</span>
          <span className="text-[9px] uppercase tracking-wider text-fuchsia-500">Controlling</span>
        </button>

        <div className="px-2 pt-5 pb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Core Kategorien
        </div>

        {/* Telekommunikation (collapsible) */}
        <Collapsible open={telcoOpen} onOpenChange={setTelcoOpen} className="rounded-lg">
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all cursor-pointer",
                activeView === "mobilfunk"
                  ? "bg-success/10 text-foreground border border-success/20"
                  : "text-foreground hover:bg-accent/50",
              )}
            >
              <span className="text-base w-5 text-center">📞</span>
              <span className="flex-1 text-left">Telekommunikation</span>
              <span className="text-[9px] uppercase tracking-wider text-success">Aktiv</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  telcoOpen && "rotate-180",
                )}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="ml-3 pl-3 border-l border-border space-y-1 mt-1 mb-2">
              <button
                onClick={goMobilfunk}
                className={cn(
                  "w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all relative",
                  activeView === "mobilfunk"
                    ? "bg-success/15 text-foreground border border-success/40"
                    : "text-foreground/90 hover:bg-success/10 border border-transparent",
                )}
              >
                <span className="text-sm w-4 text-center">📱</span>
                <span className="flex-1 text-left">Mobilfunk</span>
                {mobilfunkStatus === "analyzed" ? (
                  <span className="text-[9px] uppercase tracking-wider text-success">Live</span>
                ) : (
                  <span className="text-[9px] uppercase tracking-wider text-success/90">MVP</span>
                )}
              </button>
              <LockedSub label="Festnetz" emoji="☎️" />
              <LockedSub label="Datenleitungen" emoji="🌐" />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {CATEGORIES_META.filter((c) => !c.available).map((c) => (
          <LockedRow key={c.key} cat={c.key} label={c.label} emoji={c.emoji} onClick={() => goLocked(c.key)} />
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-border space-y-1">
        <Link
          to="/admin"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
        >
          <span className="text-base w-5 text-center">⚙️</span>
          <span>Admin · Live-Steuerung</span>
        </Link>
        <div className="px-3 pt-2 text-[10px] text-muted-foreground leading-relaxed">
          DSGVO · AES-256 · ISO 27001 · Hosting Frankfurt
        </div>
      </div>
    </aside>
  );
}

function LockedSub({ label, emoji }: { label: string; emoji: string }) {
  return (
    <div className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground opacity-50 cursor-not-allowed">
      <span className="text-sm w-4 text-center">{emoji}</span>
      <span className="flex-1 text-left">{label}</span>
      <span className="text-xs">🔒</span>
      <span className="text-[9px] uppercase tracking-wider">Soon</span>
    </div>
  );
}

function LockedRow({ label, emoji, onClick }: { cat: Category; label: string; emoji: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground opacity-60 hover:opacity-80 hover:bg-accent/30 transition-all"
    >
      <span className="text-base w-5 text-center">{emoji}</span>
      <span className="flex-1 text-left">{label}</span>
      <span className="text-xs">🔒</span>
      <span className="text-[9px] uppercase tracking-wider">Soon</span>
    </button>
  );
}
