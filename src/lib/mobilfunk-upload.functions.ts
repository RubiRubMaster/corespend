import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const NOTIFICATION_RECIPIENT = "rubonbeck@icloud.com";
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const InputSchema = z.object({
  originalFilename: z.string().min(1).max(500),
  mimeType: z.string().max(255).optional(),
  sizeBytes: z.number().int().min(1).max(100 * 1024 * 1024), // 100 MB hard cap
  storagePath: z.string().min(1).max(1000),
  customerEmail: z.string().email().max(255).optional().or(z.literal("")),
  customerCompany: z.string().max(255).optional(),
  customerNote: z.string().max(2000).optional(),
});

export const recordMobilfunkUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase: userSupabase, userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Resolve company_id for this user (via RLS-scoped client)
    const { data: profile, error: pErr } = await userSupabase
      .from("profiles")
      .select("company_id")
      .eq("id", userId)
      .maybeSingle();
    if (pErr || !profile) throw new Error("Profil nicht gefunden");

    // 1. Insert DB row (admin client; we set user_id/company_id explicitly)
    const { data: row, error: insertError } = await supabaseAdmin
      .from("mobilfunk_uploads")
      .insert({
        original_filename: data.originalFilename,
        mime_type: data.mimeType ?? null,
        size_bytes: data.sizeBytes,
        storage_path: data.storagePath,
        customer_email: data.customerEmail || null,
        customer_company: data.customerCompany || null,
        customer_note: data.customerNote || null,
        user_id: userId,
        company_id: profile.company_id,
      })
      .select("id, created_at")
      .single();

    if (insertError || !row) {
      console.error("[mobilfunk-upload] insert failed", insertError);
      throw new Error("Upload konnte nicht registriert werden");
    }

    // 2. Signed download URL (7 days)
    const { data: signed, error: signError } = await supabaseAdmin.storage
      .from("mobilfunk-uploads")
      .createSignedUrl(data.storagePath, SIGNED_URL_TTL_SECONDS);

    if (signError || !signed?.signedUrl) {
      console.error("[mobilfunk-upload] sign failed", signError);
    }

    const downloadUrl = signed?.signedUrl;

    // 3. Send notification email (best-effort; non-blocking failure)
    try {
      await sendNotificationEmail({
        uploadId: row.id,
        filename: data.originalFilename,
        sizeBytes: data.sizeBytes,
        mimeType: data.mimeType,
        customerEmail: data.customerEmail || undefined,
        customerCompany: data.customerCompany || undefined,
        customerNote: data.customerNote || undefined,
        downloadUrl,
        createdAt: row.created_at,
      });

      await supabaseAdmin
        .from("mobilfunk_uploads")
        .update({ notification_sent_at: new Date().toISOString() })
        .eq("id", row.id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[mobilfunk-upload] notification failed", msg);
      await supabaseAdmin
        .from("mobilfunk_uploads")
        .update({ notification_error: msg.slice(0, 1000) })
        .eq("id", row.id);
    }

    return { ok: true, uploadId: row.id };
  });

async function sendNotificationEmail(params: {
  uploadId: string;
  filename: string;
  sizeBytes: number;
  mimeType?: string;
  customerEmail?: string;
  customerCompany?: string;
  customerNote?: string;
  downloadUrl?: string;
  createdAt: string;
}) {
  // Build absolute URL to the transactional send route on this same deployment.
  // Use process.env.SUPABASE_URL host as fallback? No — use the public origin.
  // The transactional send route is mounted at /lovable/email/transactional/send.
  const origin = process.env.PUBLIC_SITE_URL || getOriginFromEnv();
  const sendUrl = `${origin}/lovable/email/transactional/send`;

  const sizeMb = (params.sizeBytes / (1024 * 1024)).toFixed(2);

  const response = await fetch(sendUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      templateName: "mobilfunk-upload-notification",
      recipientEmail: NOTIFICATION_RECIPIENT,
      idempotencyKey: `mobilfunk-upload-${params.uploadId}`,
      templateData: {
        filename: params.filename,
        sizeMb,
        mimeType: params.mimeType ?? "unbekannt",
        customerEmail: params.customerEmail ?? "—",
        customerCompany: params.customerCompany ?? "—",
        customerNote: params.customerNote ?? "",
        downloadUrl: params.downloadUrl ?? "",
        createdAt: new Date(params.createdAt).toLocaleString("de-DE", {
          timeZone: "Europe/Berlin",
        }),
        uploadId: params.uploadId,
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`E-Mail-Versand HTTP ${response.status}: ${text.slice(0, 300)}`);
  }
}

function getOriginFromEnv(): string {
  // In production on Lovable, requests come in via a known host; fall back to project URL.
  const projectId = process.env.SUPABASE_PROJECT_ID || process.env.VITE_SUPABASE_PROJECT_ID;
  if (projectId) {
    // Best-effort fallback to stable Lovable production URL pattern.
    return `https://project--490acb82-0f4a-4dfb-a0e5-8c1e435d0d76.lovable.app`;
  }
  return "http://localhost:3000";
}
