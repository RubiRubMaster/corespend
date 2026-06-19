import { useEffect, useRef, useState } from "react";
import { useCoreSpend } from "@/lib/corespend-store";
import { cn } from "@/lib/utils";

type Phase = "intro" | "chat" | "waiting";
type Msg = { role: "ai" | "user"; text: string };

const INTRO_TEXT =
  "Hi 👋 ich bin Ihr AI Consultant. Damit ich Ihre Analyse und den Benchmark optimal für Sie gestalten kann, führe ich Sie jetzt durch einen Consultant-verifizierten Prozess. Sind Sie bereit?";

const FIRST_QUESTION =
  "Super. Bitte beschreibe mir Ihr Vorhaben so genau wie möglich: Was ist Ihr Motiv? Welche Anforderungen und Inhalte sollten sich gegenüber Ihrem jetzigen Vertragskonstrukt ändern?";

export function MobilfunkConsultantChat() {
  const { resetAll, goDashboard } = useCoreSpend();
  const [phase, setPhase] = useState<Phase>("intro");
  const [messages, setMessages] = useState<Msg[]>([{ role: "ai", text: INTRO_TEXT }]);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, phase]);

  useEffect(() => {
    if (phase === "chat") inputRef.current?.focus();
  }, [phase]);

  function startConversation() {
    setPhase("chat");
    setMessages((m) => [
      ...m,
      { role: "user", text: "Ja, los geht's 🚀" },
      { role: "ai", text: FIRST_QUESTION },
    ]);
  }

  function submitAnswer() {
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setDraft("");
    setPhase("waiting");
  }

  return (
    <div className="glass-card overflow-hidden flex flex-col min-h-[640px]">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-background/30">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-success grid place-items-center text-lg">
          🤖
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">AI Consultant · Verhandlungs-Briefing</div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            online · Consultant-verifizierter Prozess
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-success border border-success/40 bg-success/10 rounded-full px-2 py-0.5">
          beta
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-background/10">
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role}>{m.text}</Bubble>
        ))}

        {phase === "waiting" && (
          <Bubble role="ai">
            <div className="space-y-3">
              <p>
                Danke 🙏 Auf Basis Ihrer Angaben wird nun der <span className="text-success font-medium">Verhandlungsguide</span> aktiviert
                und Ihr Benchmark spezifiziert. Unsere Consultants prüfen die Strategie und feinjustieren die Argumente für Ihr Provider-Gespräch.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                Verarbeitung läuft · geschätzte Bearbeitungszeit 24 h
              </div>
              <p className="text-xs text-muted-foreground">
                📧 Sie werden per E-Mail informiert, sobald Ihre Ergebnisse fertig sind.
              </p>
            </div>
          </Bubble>
        )}
      </div>

      {/* Footer / input */}
      <div className="border-t border-border bg-background/40 px-6 py-4">
        {phase === "intro" && (
          <button
            onClick={startConversation}
            className="w-full rounded-lg bg-gradient-to-r from-success to-primary text-success-foreground px-5 py-3.5 text-sm font-semibold hover:brightness-110 transition shadow-[0_15px_50px_-15px_color-mix(in_oklab,var(--success)_70%,transparent)]"
          >
            ✅ Bereit · Briefing starten
          </button>
        )}

        {phase === "chat" && (
          <div className="space-y-2">
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  submitAnswer();
                }
              }}
              placeholder="Beschreiben Sie Ihr Vorhaben, Motiv und gewünschte Änderungen am Vertrag …"
              rows={4}
              className="w-full resize-none rounded-lg border border-border bg-background/60 px-3.5 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] text-muted-foreground">⌘/Ctrl + Enter zum Senden</span>
              <button
                onClick={submitAnswer}
                disabled={!draft.trim()}
                className="rounded-lg bg-gradient-to-r from-success to-primary text-success-foreground px-5 py-2.5 text-sm font-semibold hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Senden ↗
              </button>
            </div>
          </div>
        )}

        {phase === "waiting" && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              disabled
              className="rounded-lg bg-gradient-to-r from-success to-primary text-success-foreground px-5 py-3 text-sm font-semibold opacity-80 cursor-not-allowed inline-flex items-center gap-2"
            >
              <span className="h-2 w-2 rounded-full bg-background/80 animate-pulse" />
              Verarbeitung läuft · per E-Mail benachrichtigen
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={goDashboard}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Zurück zu Core Analytics
              </button>
              <button
                onClick={resetAll}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Demo zurücksetzen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Bubble({ role, children }: { role: "ai" | "user"; children: React.ReactNode }) {
  const isAi = role === "ai";
  return (
    <div className={cn("flex gap-3", isAi ? "justify-start" : "justify-end")}>
      {isAi && (
        <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-primary to-success grid place-items-center text-sm">
          🤖
        </div>
      )}
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isAi
            ? "bg-background/60 border border-border rounded-tl-sm text-foreground"
            : "bg-primary text-primary-foreground rounded-tr-sm",
        )}
      >
        {children}
      </div>
      {!isAi && (
        <div className="h-8 w-8 shrink-0 rounded-lg bg-accent grid place-items-center text-sm">
          🧑
        </div>
      )}
    </div>
  );
}
