export function GlobalTopBar() {
  return (
    <div className="border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="flex items-center justify-end gap-3 px-6 py-2">
        <div className="h-7 w-7 rounded-full bg-accent border border-border grid place-items-center text-[11px] font-medium text-foreground/80">
          CL
        </div>
      </div>
    </div>
  );
}
