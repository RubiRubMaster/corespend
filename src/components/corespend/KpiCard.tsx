import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  hint,
  accent,
  icon,
  children,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: "success" | "primary" | "neutral";
  icon?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="glass-card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div
        className={cn(
          "text-3xl font-semibold tabular-nums tracking-tight",
          accent === "success" && "text-success",
          accent === "primary" && "text-primary",
        )}
      >
        {value}
      </div>
      {hint && <div className="text-xs text-muted-foreground leading-relaxed">{hint}</div>}
      {children}
    </div>
  );
}
