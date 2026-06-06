import { useCoreSpend } from "@/lib/corespend-store";
import { CoreDashboard } from "./CoreDashboard";
import { CoreStart } from "./CoreStart";
import { CoreKategorien } from "./CoreKategorien";
import { CoreDataUpload } from "./CoreDataUpload";
import { CoreAiAgent } from "./CoreAiAgent";

export function Dashboard() {
  const { activeView } = useCoreSpend();

  if (activeView === "start") return <CoreStart />;
  if (activeView === "kategorie") return <CoreKategorien />;
  if (activeView === "upload") return <CoreDataUpload />;
  if (activeView === "ai") return <CoreAiAgent />;
  return <CoreDashboard />;
}
