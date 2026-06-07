## Ziel
Wenn ein Kunde im Mobilfunk-Schritt ein Dokument hochlädt, bekommst du (rubonbeck@icloud.com) sofort eine E-Mail mit dem Dateinamen, Metadaten und einem **sicheren Download-Link** zur Datei.

## Warum Download-Link statt Attachment?
Lovable Emails unterstützt keine Datei-Anhänge, und Verträge/Rechnungen sprengen schnell die 20-MB-Limits klassischer Mail-Anhänge. Lösung: Datei landet verschlüsselt im privaten Storage, du klickst in der E-Mail auf einen signierten Link (gültig z.B. 7 Tage).

## Voraussetzungen (werden automatisch eingerichtet)
1. **Lovable Cloud aktivieren** – stellt Datenbank, Storage und E-Mail-Infrastruktur bereit.
2. **E-Mail-Domain einrichten** – damit Mails von einer eigenen Absenderadresse (z.B. `notify@deinedomain.de`) verschickt werden statt im Spam zu landen. Dafür wirst du einmalig nach deiner Domain gefragt und musst NS-Records bei deinem DNS-Anbieter setzen.
3. **App-E-Mail-Infrastruktur scaffolden** – legt Queue, Versand-Route und Templates an.

## Umsetzung im Detail

### A. Storage
- Privater Bucket `mobilfunk-uploads`.
- Jede Datei wird unter `uploads/{timestamp}-{uuid}-{originalname}` abgelegt.
- Kein öffentlicher Zugriff, nur signierte URLs.

### B. Datenbank-Tabelle `uploads`
Felder: `id`, `created_at`, `original_filename`, `mime_type`, `size_bytes`, `storage_path`, `customer_email` (optional, falls Kunde eingibt), `customer_company` (optional), `notification_sent_at`.

### C. Upload-Flow im Frontend (`MobilfunkView` / „Dokumente sicher übertragen"-Seite)
1. Drag-&-Drop-Zone akzeptiert PDF, XLSX, CSV, ZIP (max. 50 MB pro Datei).
2. Beim Drop:
   - Client-seitige Validierung (Größe, MIME-Type).
   - Direkter Upload in den Storage-Bucket.
   - Eintrag in `uploads`-Tabelle via Server-Function.
3. Nach Erfolg → Übergang zum bestehenden „Magic Enterprise Waiting Screen" (State B).

### D. E-Mail-Versand
- React-Email-Template `mobilfunk-upload-notification.tsx` mit:
  - Betreff: `🆕 Neuer Mobilfunk-Upload: {dateiname}`
  - Inhalt: Dateiname, Größe, Upload-Zeit, optional Kunden-Infos, **„Datei herunterladen"-Button** (7-Tage-signierter Storage-Link), Hinweistext.
- Server-Function nach erfolgreichem DB-Insert:
  - Erzeugt 7-Tage-signierten Download-Link via `supabase.storage.createSignedUrl()`.
  - Ruft den scaffoldeten `sendTransactionalEmail()`-Helper auf mit `recipientEmail: "rubonbeck@icloud.com"`, festgelegt im Code.
  - Idempotenzschlüssel: `mobilfunk-upload-{uploadId}`.

### E. Sicherheit
- Bucket privat, keine öffentlichen Listings.
- Server-Function für Insert + Mailversand läuft mit Service-Role; keine Client-Geheimnisse exponiert.
- Empfänger-E-Mail `rubonbeck@icloud.com` hartkodiert (keine Manipulation durch Kunden möglich).
- Validation per Zod (Dateigröße ≤ 50 MB, erlaubte MIME-Types).

## Was du tun musst
1. **Lovable Cloud aktivieren** bestätigen (1 Klick im nachfolgenden Schritt).
2. **Domain auswählen**, von der die Mails verschickt werden sollen (z.B. `notify.corespend.io`), und einmalig die angezeigten NS-Records bei deinem DNS-Anbieter eintragen. Bis zur DNS-Verifizierung warten die Mails in der Queue – sobald aktiv, werden sie automatisch zugestellt.
3. Fertig – Uploads landen ab dann automatisch in deinem iCloud-Posteingang.

## Technische Hinweise
- Stack: TanStack Start Server Functions + Supabase Storage + Lovable Emails Queue.
- Keine externen Provider (Resend/Mailgun) nötig.
- Dateien bleiben dauerhaft im Storage (auch nach Ablauf des Mail-Links erreichbar via Cloud-Konsole).
