import { useCoreSpend } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import { useCompanyProfile } from "@/components/corespend/CoreSpendHydrator";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import { Moon, Sun, LogOut } from "lucide-react";
import { toast } from "sonner";

export function GlobalTopBar() {
  const { timeMode, setTimeMode } = useCoreSpend();
  const { theme, toggleTheme } = useTheme();
  const profile = useCompanyProfile();
  const navigate = useNavigate();

  const initials = (profile?.fullName || profile?.email || "U")
    .split(/[\s@.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "U";

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Abgemeldet");
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="flex items-center justify-end gap-3 px-6 py-2">
        <div
          role="tablist"
          aria-label="Zeitraum"
          className="inline-flex items-center rounded-full border border-border bg-surface/60 p-0.5 text-[11px] uppercase tracking-[0.14em]"
        >
          {(["monthly", "yearly"] as const).map((m) => {
            const active = timeMode === m;
            return (
              <button
                key={m}
                role="tab"
                aria-selected={active}
                onClick={() => setTimeMode(m)}
                className={cn(
                  "px-3 py-1.5 rounded-full transition-colors",
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m === "monthly" ? "Monatlich" : "Jährlich"}
              </button>
            );
          })}
        </div>

        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Light Mode aktivieren" : "Dark Mode aktivieren"}
          className="h-8 w-8 rounded-full border border-border bg-surface/60 grid place-items-center text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
          title={theme === "dark" ? "Light Mode" : "Dark Mode"}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className="flex items-center gap-2 pl-3 ml-1 border-l border-border">
          <div className="h-7 w-7 rounded-full bg-accent border border-border grid place-items-center text-[11px] font-medium text-foreground/80">
            {initials}
          </div>
          <div className="hidden sm:flex flex-col leading-tight text-right">
            <span className="text-[11px] font-medium text-foreground truncate max-w-[160px]">
              {profile?.companyName ?? "Mein Unternehmen"}
            </span>
            <span className="text-[10px] text-muted-foreground truncate max-w-[160px]">
              {profile?.email ?? ""}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            aria-label="Abmelden"
            title="Abmelden"
            className="h-7 w-7 rounded-full border border-border grid place-items-center text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
