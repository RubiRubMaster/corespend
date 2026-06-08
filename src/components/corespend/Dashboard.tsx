import { useCoreSpend } from "@/lib/corespend-store";
import { ManagementCockpit } from "./ManagementCockpit";
import { ManagementDashboard } from "./ManagementDashboard";
import { MobilfunkView } from "./MobilfunkView";
import { LockedView } from "./LockedView";
import { DeadlinesView } from "./DeadlinesView";
import { OptimizationsView } from "./OptimizationsView";
import { SpendView } from "./SpendView";
import { RiskView } from "./RiskView";
import { CoreStartView } from "./CoreStartView";
import { OfficeUploadView } from "./OfficeUploadView";

export function Dashboard() {
  const { activeView } = useCoreSpend();
  if (activeView === "mobilfunk") return <MobilfunkView />;
  if (activeView === "locked") return <LockedView />;
  if (activeView === "dashboard") return <ManagementDashboard />;
  if (activeView === "corestart") return <CoreStartView />;
  if (activeView === "officeupload") return <OfficeUploadView />;
  if (activeView === "deadlines") return <DeadlinesView />;
  if (activeView === "optimizations") return <OptimizationsView />;
  if (activeView === "spend") return <SpendView />;
  if (activeView === "risk") return <RiskView />;
  return <ManagementCockpit />;
}

