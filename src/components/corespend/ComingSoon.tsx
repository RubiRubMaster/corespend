import { Lock } from "lucide-react";

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="glass-card p-12 text-center">
      <div className="mx-auto h-12 w-12 rounded-lg bg-accent grid place-items-center">
        <Lock className="h-5 w-5 text-muted-foreground" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
        Dieses Modul ist in der Endabstimmung mit Pilotkunden. Verfügbar in Q3.
      </p>
    </div>
  );
}
