import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { loadCompanyState, saveCompanyState } from "@/lib/company-state.functions";
import { CoreSpendProvider, type CoreSpendSnapshot } from "@/lib/corespend-store";

type Profile = { companyId: string; companyName: string | null; email: string | null; fullName: string | null };
const ProfileContext = createContext<Profile | null>(null);

export function useCompanyProfile() {
  return useContext(ProfileContext);
}

export function CoreSpendHydrator({ children }: { children: ReactNode }) {
  const load = useServerFn(loadCompanyState);
  const save = useServerFn(saveCompanyState);
  const [ready, setReady] = useState(false);
  const [snap, setSnap] = useState<CoreSpendSnapshot>({});
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let cancelled = false;
    load()
      .then((res) => {
        if (cancelled) return;
        setProfile({
          companyId: res.companyId,
          companyName: res.companyName,
          email: res.email,
          fullName: res.fullName,
        });
        setSnap((res.state ?? {}) as CoreSpendSnapshot);
        setReady(true);
      })
      .catch(() => setReady(true));
    return () => { cancelled = true; };
  }, [load]);

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-muted-foreground text-sm">
        Lade Ihr Cockpit…
      </div>
    );
  }

  return (
    <ProfileContext.Provider value={profile}>
      <CoreSpendProvider
        initialSnapshot={snap}
        onPersist={(s) => {
          void save({ data: { state: s as Record<string, any> } }).catch(() => {});
        }}
      >
        {children}
      </CoreSpendProvider>
    </ProfileContext.Provider>
  );
}
