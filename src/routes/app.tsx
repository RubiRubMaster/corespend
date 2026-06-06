import { createFileRoute } from "@tanstack/react-router";
import { CoreSpendProvider } from "@/lib/corespend-store";
import { AppShell } from "@/components/corespend/AppShell";
import { Dashboard } from "@/components/corespend/Dashboard";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "CoreSpend · Plattform" },
      {
        name: "description",
        content: "CoreSpend Plattform: Onboarding, Management Overview und KI-gestützte Detail-Dashboards.",
      },
    ],
  }),
  component: AppPage,
});

function AppPage() {
  return (
    <CoreSpendProvider>
      <AppShell>
        <Dashboard />
      </AppShell>
    </CoreSpendProvider>
  );
}
