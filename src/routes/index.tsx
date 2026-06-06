import { createFileRoute } from "@tanstack/react-router";
import { CoreSpendProvider } from "@/lib/corespend-store";
import { AppShell } from "@/components/corespend/AppShell";
import { Dashboard } from "@/components/corespend/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CoreSpend — Core IT Spend Intelligence" },
      {
        name: "description",
        content:
          "CoreSpend ist Deutschlands erste KI-gestützte Plattform für IT-Leiter und Einkaufsverantwortliche zur Analyse, Benchmark und Optimierung der Kern-IT-Ausgaben.",
      },
      { property: "og:title", content: "CoreSpend — Core IT Spend Intelligence" },
      {
        property: "og:description",
        content: "Made to serve IT and Procurement by changing the way you source your Core IT.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <CoreSpendProvider>
      <AppShell>
        <Dashboard />
      </AppShell>
    </CoreSpendProvider>
  );
}
