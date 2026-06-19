import { useEffect, useRef, useState } from "react";
import { useCoreSpend, formatEUR, PRICING } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";

export function TopBar() {
  const {
    currentPrice, totalDiscount, activatedAreas,
    effectiveSpendMonthly, effectiveSavingsYearly, mobilfunkStatus,
    effectiveBasePrice, effectiveDiscountPerArea,
  } = useCoreSpend();
  const live = mobilfunkStatus === "analyzed";
  const prev = useRef(currentPrice);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (prev.current !== currentPrice) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 1200);
      prev.current = currentPrice;
      return () => clearTimeout(t);
    }
  }, [currentPrice]);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="grid gap-3 px-6 py-3.5 lg:grid-cols-[1fr_auto] items-stretch">
        {/* Global KPIs */}
        <div className="grid grid-cols-3 gap-2">
          <KpiPill
            label="Validierte IT-Ausgaben (Gesamt)"
            value={live || effectiveSpendMonthly > 0 ? `${formatEUR(effectiveSpendMonthly)} / Monat` : "— / Monat"}
            tone="default"
          />
          <KpiPill
            label="Identifiziertes Einsparpotenzial"
            value={live || effectiveSavingsYearly > 0 ? `${formatEUR(effectiveSavingsYearly)} / Jahr` : "— / Jahr"}
            tone="success"
          />
          <KpiPill
            label="Aktive Bereiche"
            value={`${activatedAreas} / ${PRICING.TOTAL_AREAS} Bereiche analysiert`}
            tone="muted"
          />
        </div>

        {/* Pricing block */}
        <div
          className={cn(
            "rounded-lg border px-4 py-2.5 flex flex-col leading-tight min-w-[280px]",
            totalDiscount > 0
              ? "border-success/40 bg-gradient-to-br from-success/15 to-primary/10"
              : "border-border bg-surface/50",
          )}
        >
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            CoreSpend Enterprise Lizenz
          </span>
          <div className="flex items-baseline gap-2">
            <span className={cn("text-lg font-semibold tabular-nums leading-tight", flash && "animate-flash-success")}>
              {formatEUR(currentPrice)}
              <span className="text-xs font-normal text-muted-foreground"> / Monat</span>
            </span>
            {totalDiscount > 0 && (
              <span className="text-xs text-muted-foreground line-through tabular-nums">
                {formatEUR(PRICING.BASE_PRICE)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            Basis {formatEUR(PRICING.BASE_PRICE)} · Data-Contribution Bonus −{formatEUR(PRICING.DISCOUNT_PER_AREA)} pro geteiltem Bereich
          </span>
        </div>
      </div>
    </header>
  );
}

function KpiPill({ label, value, tone }: { label: string; value: string; tone: "default" | "success" | "muted" }) {
  return (
    <div
      className={cn(
        "rounded-lg border px-3.5 py-2 flex flex-col leading-tight bg-surface/40",
        tone === "success" ? "border-success/30" : "border-border",
      )}
    >
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-sm font-semibold tabular-nums mt-0.5",
          tone === "success" && "text-success",
          tone === "muted" && "text-foreground/80",
        )}
      >
        {value}
      </span>
    </div>
  );
}
