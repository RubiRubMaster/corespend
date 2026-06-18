import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Contract = {
  id: string;
  user_id: string;
  company_id: string | null;
  area: string;
  provider: string | null;
  file_url: string;
  status: string;
  created_at: string;
  updated_at: string;
};

/**
 * Kept for backwards-compatibility with Cockpit / Analytics views that still
 * read from the `contracts` table. The upload flow no longer writes here.
 */
export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contracts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[contracts] load failed", error);
      setError(error.message);
    } else {
      setContracts((data ?? []) as Contract[]);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const channel = supabase
      .channel("contracts-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "contracts" }, () => { refresh(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [refresh]);

  return { contracts, loading, error, refresh };
}

/**
 * Lädt eine Datei AUSSCHLIESSLICH in den Storage-Bucket `corespend-documents`
 * unter dem Pfad `{user_id}/{filename}` hoch. Es wird KEIN DB-Eintrag erzeugt.
 */
export async function uploadContract(params: {
  file: File;
  area?: string;
  provider?: string;
}): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    const msg = userErr?.message ?? "Nicht eingeloggt – bitte erneut anmelden.";
    console.error("[uploadContract] no auth user", userErr);
    toast.error("Upload nicht möglich", { description: msg });
    return { ok: false, error: msg };
  }
  const user = userData.user;

  const safeName = params.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${user.id}/${safeName}`;

  console.log("[uploadContract] uploading", { path, size: params.file.size });

  const { error: upErr } = await supabase.storage
    .from("corespend-documents")
    .upload(path, params.file, {
      contentType: params.file.type || "application/octet-stream",
      upsert: true,
    });

  if (upErr) {
    console.error("[uploadContract] storage error", upErr);
    toast.error("Storage-Upload fehlgeschlagen", { description: upErr.message });
    return { ok: false, error: upErr.message };
  }

  toast.success("Datei erfolgreich hochgeladen", {
    description: "Unsere Analysten prüfen deine Daten.",
  });
  return { ok: true, path };
}
