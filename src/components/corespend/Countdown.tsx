import { useEffect, useState } from "react";

export function Countdown({ days, label }: { days: number; label: string }) {
  const target = useState(() => Date.now() + days * 24 * 3600 * 1000)[0];
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / (24 * 3600 * 1000));
  const h = Math.floor((diff % (24 * 3600 * 1000)) / (3600 * 1000));
  const m = Math.floor((diff % (3600 * 1000)) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  const Block = ({ v, l }: { v: number; l: string }) => (
    <div className="flex flex-col items-center">
      <span className="text-xl font-semibold tabular-nums">{String(v).padStart(2, "0")}</span>
      <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{l}</span>
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="flex items-center gap-3">
        <Block v={d} l="Tage" />
        <span className="text-muted-foreground">:</span>
        <Block v={h} l="Std" />
        <span className="text-muted-foreground">:</span>
        <Block v={m} l="Min" />
        <span className="text-muted-foreground">:</span>
        <Block v={s} l="Sek" />
      </div>
    </div>
  );
}
