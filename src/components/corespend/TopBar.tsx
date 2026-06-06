import { useEffect, useRef, useState } from "react";
import { useCoreSpend, formatEUR, PRICING } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";

export function TopBar() {
  const { currentPrice, unlockedPercent, totalDiscount } = useCoreSpend();
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
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-4 px-6 py-3.5">
        <div className="flex items-center gap-3 glass-card px-4 py-2.5">
          <div className="h-8 w-8 grid place-items-center rounded-md bg-accent text-xs font-bold text-primary">
            €
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Aktueller Tarif
            </span>
            <span
              className={cn(
                "text-lg font-semibold tabular-nums leading-none",
                flash && "animate-flash-success",
              )}
            >
              {formatEUR(currentPrice)} <span className="text-xs text-muted-foreground">/ Monat</span>
            </span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex items-center gap-1 ml-2 pl-3 border-l border-border">
              <span className="text-xs text-success">↓</span>
              <span className="text-xs font-medium text-success tabular-nums">
                −{formatEUR(totalDiscount)}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 max-w-xl ml-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-muted-foreground">
              Dein CoreSpend Daten-Bonus
            </span>
            <span className="text-[11px] font-semibold text-success tabular-nums">
              {unlockedPercent}% freigeschaltet
            </span>
          </div>
          <div className="relative h-1.5 w-full rounded-full bg-accent overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-success transition-all duration-700 ease-out"
              style={{ width: `${unlockedPercent}%` }}
            />
            {unlockedPercent > 0 && unlockedPercent < 100 && (
              <div
                className="absolute inset-y-0 left-0 rounded-full animate-shimmer"
                style={{ width: `${unlockedPercent}%` }}
              />
            )}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>Basis</span>
          <span className="tabular-nums">{formatEUR(PRICING.BASE_PRICE)}</span>
          <span>→</span>
          <span className="tabular-nums text-success">
            {formatEUR(PRICING.BASE_PRICE - 4 * PRICING.DISCOUNT_PER_CATEGORY)}
          </span>
        </div>
      </div>
    </header>
  );
}
