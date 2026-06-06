import { useCoreSpend } from "@/lib/corespend-store";
import { UploadGrid } from "./UploadGrid";
import { MobilfunkDashboard } from "./MobilfunkDashboard";
import { M365Dashboard } from "./M365Dashboard";
import { ComingSoon } from "./ComingSoon";

export function Dashboard() {
  const { categories, activeView } = useCoreSpend();

  const anyUnlocked = (Object.keys(categories) as Array<keyof typeof categories>).some(
    (k) => categories[k].status !== "idle",
  );

  // STATE A — onboarding when nothing uploaded
  if (!anyUnlocked) return <UploadGrid />;

  const current = categories[activeView as keyof typeof categories];

  // If selected view itself isn't uploaded yet, also show onboarding context
  if (!current || current.status === "idle") {
    if (activeView === "saas") return <ComingSoon title="SaaS & Cloud · Bald verfügbar" />;
    if (activeView === "hardware") return <ComingSoon title="Hardware & Assets · Bald verfügbar" />;
    return <UploadGrid />;
  }

  // STATE B handled inside UploadCard while processing — but once user is in dashboards view,
  // show the unlocked dashboards directly:
  if (activeView === "mobilfunk") return <MobilfunkDashboard />;
  if (activeView === "m365") return <M365Dashboard />;
  if (activeView === "saas") return <ComingSoon title="SaaS & Cloud · Bald verfügbar" />;
  if (activeView === "hardware") return <ComingSoon title="Hardware & Assets · Bald verfügbar" />;

  return <UploadGrid />;
}
