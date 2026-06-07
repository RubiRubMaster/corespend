import { useEffect, useRef, useState } from "react";
import { useCoreSpend, formatEUR, PRICING } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";

export function TopBar() {
  const { currentPrice, totalDiscount, activatedAreas } = useCoreSpend();
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

  const fullyUnlocked = PRICING.BASE_PRICE - PRICING.TOTAL_AREAS * PRICING.DISCOUNT_PER_AREA;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-6 py-3.5 flex-wrap">
        {/* Base price */}
        <div className="flex items-center gap-3 rounded-lg border border-border bg-surface/50 px-3.5 py-2">
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Enterprise Lizenz · Basis
            </span>
            <span className="text-sm font-medium tabular-nums text-muted-foreground line-through">
              {formatEUR(PRICING.BASE_PRICE)} / Monat
            </span>
          </div>
        </div>

        <span className="text-muted-foreground hidden sm:inline">→</span>

        {/* Discount pill */}
        <div
          className={cn(
            "rounded-lg border px-3.5 py-2 flex flex-col leading-tight transition-colors",
            totalDiscount > 0
              ? "border-success/40 bg-success/10"
              : "border-border bg-surface/40",
          )}
        >
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Data-Contribution Bonus
          </span>
          <span className={cn("text-sm font-semibold tabular-nums", totalDiscount > 0 ? "text-success" : "text-muted-foreground")}>
            {totalDiscount > 0
              ? `−${formatEUR(totalDiscount)} (Mobilfunk geteilt)`
              : "0 € · Bereiche noch nicht aktiviert"}
          </span>
        </div>

        <span className="text-muted-foreground hidden sm:inline">=</span>

        {/* Effective price */}
        <div className="rounded-lg border border-success/40 bg-gradient-to-br from-success/15 to-primary/10 px-4 py-2.5 flex flex-col leading-tight">
          <span className="text-[10px] uppercase tracking-wider text-success">
            Aktueller Live-Preis
          </span>
          <span className={cn("text-2xl font-semibold tabular-nums leading-none mt-0.5", flash && "animate-flash-success")}>
            {formatEUR(currentPrice)} <span className="text-xs font-normal text-muted-foreground">/ Monat</span>
          </span>
        </div>

        <div className="flex-1" />

        <div className="hidden lg:flex flex-col items-end text-[11px] text-muted-foreground leading-tight">
          <span>{activatedAreas} / {PRICING.TOTAL_AREAS} Bereiche aktiviert</span>
          <span>Maximal-Tarif: <span className="text-success font-medium tabular-nums">{formatEUR(fullyUnlocked)} / Mo.</span></span>
        </div>
      </div>
    </header>
  );
}
