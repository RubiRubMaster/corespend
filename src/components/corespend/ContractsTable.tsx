import { useContracts } from "@/lib/contracts";
import { cn } from "@/lib/utils";

export function ContractsTable({ title = "Hochgeladene Verträge", compact = false }: { title?: string; compact?: boolean }) {
  const { contracts, loading } = useContracts();

  return (
    <section className="rounded-xl border border-border bg-background/60 backdrop-blur p-5">
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border">
        <span className="text-base">📄</span>
        <span className="text-sm font-semibold tracking-tight">{title}</span>
        {!loading && contracts.length > 0 && (
          <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">{contracts.length} Vertrag{contracts.length === 1 ? "" : "e"}</span>
        )}
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground py-6 text-center">Lade Verträge …</div>
      ) : contracts.length === 0 ? (
        <div className="py-10 text-center">
          <div className="text-3xl mb-2">📭</div>
          <p className="text-sm font-medium">Noch keine Verträge vorhanden</p>
          <p className="text-xs text-muted-foreground mt-1">Bitte lade deinen ersten Vertrag hoch</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="text-left font-medium py-2">Bereich</th>
                <th className="text-left font-medium py-2">Provider</th>
                <th className="text-left font-medium py-2">Datei</th>
                <th className="text-left font-medium py-2">Status</th>
                {!compact && <th className="text-left font-medium py-2">Hochgeladen</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {contracts.map((c) => (
                <tr key={c.id} className="hover:bg-surface/40">
                  <td className="py-2.5 capitalize">{c.area}</td>
                  <td className="py-2.5 text-muted-foreground truncate max-w-[260px]">{c.file_url}</td>
                  <td className="py-2.5">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] border",
                      c.status === "In Analyse"
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-success/40 bg-success/10 text-success",
                    )}>
                      {c.status}
                    </span>
                  </td>
                  {!compact && (
                    <td className="py-2.5 text-muted-foreground text-xs tabular-nums">
                      {new Date(c.created_at).toLocaleDateString("de-DE")}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
