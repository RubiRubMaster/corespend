import { useRef, useState } from "react";
import { Upload, FileCheck2, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { useCoreSpend, formatEUR, type Category } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";
import { ProcessingPane } from "./ProcessingPane";

type Props = {
  category: Category;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  available: boolean;
  checklist: string[];
  ctaLabel: string;
  discount: number;
  subItems?: { emoji: string; label: string }[];
};

export function UploadCard({ category, title, icon: Icon, available, checklist, ctaLabel, discount, subItems }: Props) {
  const { categories, startProcessing } = useCoreSpend();
  const state = categories[category];
  const [fileName, setFileName] = useState<string | undefined>();
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = (f?: File) => {
    if (!f) return;
    setFileName(f.name);
  };

  if (state.status === "processing") {
    return <ProcessingPane category={category} title={title} />;
  }

  const isComplete = state.status === "pending" || state.status === "analyzed";

  return (
    <div
      className={cn(
        "glass-card p-6 flex flex-col gap-5 relative overflow-hidden transition-all",
        !available && "opacity-60",
        isComplete && "glow-success",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-accent grid place-items-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-base leading-tight">{title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Spare <span className="text-success font-medium">{formatEUR(discount)}</span> / Monat
            </p>
          </div>
        </div>
        {isComplete && (
          <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-success">
            <CheckCircle2 className="h-3 w-3" /> Hochgeladen
          </span>
        )}
        {!available && (
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded px-2 py-0.5">
            Bald verfügbar
          </span>
        )}
      </div>

      {!isComplete && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (available) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (available) onFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => available && inputRef.current?.click()}
          className={cn(
            "rounded-lg border-2 border-dashed border-border bg-background/40 px-4 py-6 text-center cursor-pointer transition-colors",
            dragging && "border-success bg-success/5",
            !available && "cursor-not-allowed",
          )}
        >
          <Upload className="h-5 w-5 mx-auto text-muted-foreground" />
          <p className="text-xs text-muted-foreground mt-2">
            {fileName ? (
              <span className="text-foreground">{fileName}</span>
            ) : (
              <>Datei hierher ziehen oder <span className="text-primary underline-offset-2 hover:underline">durchsuchen</span></>
            )}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1 flex items-center justify-center gap-1">
            <ShieldCheck className="h-3 w-3" /> AES-256 · DSGVO-konform
          </p>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
            disabled={!available}
          />
        </div>
      )}

      {isComplete && (
        <div className="rounded-lg border border-success/40 bg-success/5 px-4 py-3 flex items-start gap-3">
          <Clock className="h-4 w-4 text-success mt-0.5 shrink-0" />
          <div className="text-xs leading-relaxed">
            <div className="font-medium text-foreground">In Expertenprüfung (24–48h)</div>
            <div className="text-muted-foreground mt-0.5">
              Dein Rabatt von {formatEUR(discount)} / Monat ist <span className="text-success">bereits aktiv</span>.
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Benötigte Dokumente</div>
        <ul className="space-y-1.5">
          {checklist.map((item) => (
            <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileCheck2 className="h-3.5 w-3.5 text-primary/70 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => available && startProcessing(category, fileName)}
        disabled={!available || isComplete}
        className={cn(
          "mt-auto w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
          available && !isComplete
            ? "bg-success text-success-foreground hover:brightness-110 shadow-[0_8px_30px_-10px_color-mix(in_oklab,var(--success)_60%,transparent)]"
            : "bg-accent text-muted-foreground cursor-not-allowed",
        )}
      >
        {isComplete ? "Analyse läuft …" : available ? ctaLabel : "Bald verfügbar"}
      </button>
    </div>
  );
}
