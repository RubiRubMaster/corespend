import { useCoreSpend } from "@/lib/corespend-store";
import { ManagementDashboard } from "./ManagementDashboard";
import { MobilfunkView } from "./MobilfunkView";
import { LockedView } from "./LockedView";

export function Dashboard() {
  const { activeView } = useCoreSpend();
  if (activeView === "mobilfunk") return <MobilfunkView />;
  if (activeView === "locked") return <LockedView />;
  return <ManagementDashboard />;
}
