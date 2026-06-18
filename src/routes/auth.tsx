import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "CoreSpend · Login" },
      { name: "description", content: "Sicherer Zugang zu deinem CoreSpend Enterprise Cockpit." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/app" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Willkommen zurück");
        navigate({ to: "/app" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: {
              company_name: companyName || email.split("@")[1] || "Mein Unternehmen",
              full_name: fullName || email,
            },
          },
        });
        if (error) throw error;
        toast.success("Account erstellt", {
          description: "Bitte bestätige deine E-Mail, um dich einzuloggen.",
        });
        setMode("signin");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unbekannter Fehler";
      toast.error("Anmeldung fehlgeschlagen", { description: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2.5 group justify-center mb-8">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-success grid place-items-center text-base font-bold text-background">
            CS
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
              CoreSpend
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Enterprise · IT Spend Intelligence
            </div>
          </div>
        </Link>

        <div className="glass-card p-7">
          <h1 className="text-xl font-semibold tracking-tight">
            {mode === "signin" ? "Im Cockpit anmelden" : "Enterprise-Account erstellen"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signin"
              ? "Sicherer Zugang zu deinen IT-Spend-Daten — strikt mandantengetrennt."
              : "Jede Registrierung erzeugt eine separate, isolierte Company. Niemand sieht deine Daten."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {mode === "signup" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="company">Unternehmen</Label>
                  <Input
                    id="company"
                    placeholder="ACME GmbH"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="name">Dein Name</Label>
                  <Input
                    id="name"
                    placeholder="Max Mustermann"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Geschäfts-E-Mail</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@unternehmen.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading
                ? "Bitte warten…"
                : mode === "signin"
                  ? "Anmelden"
                  : "Account erstellen"}
            </Button>
          </form>

          <div className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                Noch kein Account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-primary hover:underline font-medium"
                >
                  Jetzt registrieren
                </button>
              </>
            ) : (
              <>
                Bereits registriert?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-primary hover:underline font-medium"
                >
                  Zum Login
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground text-center mt-6">
          DSGVO · AES-256 · ISO 27001 · Hosting Frankfurt
        </p>
      </div>
    </div>
  );
}
