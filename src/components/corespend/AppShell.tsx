import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { AdminPanel } from "./AdminPanel";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminPanel />
        <TopBar />
        <main className="flex-1 px-6 py-8 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
