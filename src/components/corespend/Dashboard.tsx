import { useCoreSpend } from "@/lib/corespend-store";
import { MasterDashboard } from "./MasterDashboard";
import { UploadGrid } from "./UploadGrid";
import { MobilfunkDashboard } from "./MobilfunkDashboard";
import { M365Dashboard } from "./M365Dashboard";
import { ComingSoon } from "./ComingSoon";

export function Dashboard() {
  const { categories, activeView } = useCoreSpend();

  if (activeView === "onboarding") return <UploadGrid />;
  if (activeView === "overview") return <MasterDashboard />;

  const current = activeView in categories ? categories[activeView as keyof typeof categories] : undefined;

  if (!current || current.status === "idle") {
    if (activeView === "saas") return <ComingSoon title="SaaS & Cloud · Detail-Dashboard bald verfügbar" />;
    if (activeView === "hardware") return <ComingSoon title="Hardware · Detail-Dashboard bald verfügbar" />;
    return <UploadGrid />;
  }

  if (activeView === "mobilfunk") return <MobilfunkDashboard />;
  if (activeView === "m365") return <M365Dashboard />;
  if (activeView === "saas") return <ComingSoon title="SaaS & Cloud · Detail-Dashboard bald verfügbar" />;
  if (activeView === "hardware") return <ComingSoon title="Hardware · Detail-Dashboard bald verfügbar" />;

  return <MasterDashboard />;
}
