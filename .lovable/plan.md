## Ziel

Nach Abschluss der Mobilfunk-Analyse (State C) startet ein interaktiver 5-Schritte-Beratungsdialog ("Verhandlungs-Strategie-Assistent"), bevor der Nutzer das finale Verhandlungsmandat erhält.

## Neuer Flow

```text
StateA Upload → StateB Waiting → StateC Cockpit (Findings)
                                       │
                                       ▼
                              [Verhandlungsstrategie starten]
                                       │
                                       ▼
                    StateD · 5-Schritte-Wizard
                                       │
                                       ▼
                    StateE · Verhandlungsmandat (Summary)
```

## 5 Schritte des Wizards

1. **Strategische Ausrichtung** – Radio: `Geräuschlose Nachverhandlung` vs. `Offene Marktausschreibung (max. Drohkulisse)`
2. **Vertragslaufzeit** – Radio: `12 Mo. (flexibel)` / `24 Mo. (Standard)` / `36 Mo. (max. Rabatt)`
3. **Liquidität / Abrechnung** – Checkboxen: `Zahlungsziel 60 Tage netto`, `Zahlungsziel 90 Tage netto`, `Konsolidierte ERP-Gesamtrechnung`
4. **Vertragsschutz-Klauseln** – Checkboxen: `Mitarbeiter-Flex-Klausel (bis 20% SIMs straffrei kündbar)`, `Technologie-/5G-Sonderkündigungsrecht`
5. **Flotten-Infrastruktur** – Checkboxen: `eSIM/MDM-Vollautomatisierung`, `Multi-SIM für Tablets`, `Netzvorgabe (Telekom / Vodafone / O2 / egal)` (Select)

Jeder Schritt: Headline, kurzer Beratertext, Optionen, "Zurück" / "Weiter". Fortschrittsbalken oben (1/5 … 5/5). Live-Sidebar mit "Strategie-Impact" (z. B. erwartete Verhandlungsmacht-Anzeige, geschätzter Hebel auf Einsparung).

## Abschluss (StateE)

Card mit Zusammenfassung aller Entscheidungen + Button "📄 Verhandlungsmandat herunterladen (Demo)" und "Strategie anpassen" (zurück zu Schritt 1). Aktiviert weiterhin Mobilfunk-Bereich im Management Dashboard (bereits implementiert).

## Technische Umsetzung

- **State im Store** (`src/lib/corespend-store.tsx`): erweitere `UploadStatus` um `"strategy"` und `"mandate"`, oder besser separater `mobilfunkStage: "cockpit" | "wizard" | "mandate"` nur wenn `mobilfunkStatus === "analyzed"`. Plus `NegotiationStrategy`-Objekt mit den 5 Antworten + Setter.
- **Neue Datei** `src/components/corespend/MobilfunkStrategyWizard.tsx` – kapselt Wizard-UI (Schritt-State, Progress, 5 Step-Komponenten, Navigation). Nutzt vorhandene shadcn `RadioGroup`, `Checkbox`, `Select`, `Button`, `Card`.
- **Neue Datei** `src/components/corespend/MobilfunkMandate.tsx` – Summary-View.
- **`MobilfunkView.tsx`**: In `StateC` am Ende der Findings-Sektion CTA-Button "Verhandlungsstrategie konfigurieren →" hinzufügen. Switch im Hauptrender: wenn stage = wizard → Wizard, wenn mandate → Mandate, sonst StateC. Header-Label entsprechend erweitern (State D / State E).
- **Design**: Konsistent mit bestehendem `glass-card`, gradient-Icons, Success/Primary-Tokens. Keine neuen Farbwerte.
- **Reset**: `resetAll()` setzt Strategie + Stage zurück.

## Out of Scope

Keine Backend-Persistierung der Strategie-Antworten (Prototyp). Kein echter PDF-Export — Button zeigt Toast "Mandat wird vorbereitet".

Soll ich so umsetzen?
