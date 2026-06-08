import { useCoreSpend } from "@/lib/corespend-store";
import { ManagementCockpit } from "./ManagementCockpit";
import { ManagementDashboard } from "./ManagementDashboard";
import { MobilfunkView } from "./MobilfunkView";
import { LockedView } from "./LockedView";
import { DeadlinesView } from "./DeadlinesView";
import { OptimizationsView } from "./OptimizationsView";

export function Dashboard() {
  const { activeView } = useCoreSpend();
  if (activeView === "mobilfunk") return <MobilfunkView />;
  if (activeView === "locked") return <LockedView />;
  if (activeView === "dashboard") return <ManagementDashboard />;
  if (activeView === "deadlines") return <DeadlinesView />;
  if (activeView === "optimizations") return <OptimizationsView />;
  return <ManagementCockpit />;
}
