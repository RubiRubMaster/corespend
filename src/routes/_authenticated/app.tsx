import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/corespend/AppShell";
import { Dashboard } from "@/components/corespend/Dashboard";
import { CoreSpendHydrator } from "@/components/corespend/CoreSpendHydrator";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [
      { title: "CoreSpend · Plattform" },
      { name: "description", content: "CoreSpend Plattform: Onboarding, Management Overview und KI-gestützte Detail-Dashboards." },
    ],
  }),
  component: AppPage,
});

function AppPage() {
  return (
    <CoreSpendHydrator>
      <AppShell>
        <Dashboard />
      </AppShell>
    </CoreSpendHydrator>
  );
}
