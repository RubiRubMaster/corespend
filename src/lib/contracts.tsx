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

function guessProvider(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "");
  const KNOWN = ["Vodafone", "Telekom", "O2", "Telefonica", "1und1", "1&1", "Freenet", "Congstar", "Microsoft", "AWS", "Google"];
  const hit = KNOWN.find((k) => base.toLowerCase().includes(k.toLowerCase()));
  if (hit) return hit;
  return base.split(/[_\-\s.]/)[0] || "Unbekannt";
}

export async function uploadContract(params: {
  file: File;
  area: string;
  provider?: string;
}): Promise<{ ok: true; contractId: string } | { ok: false; error: string }> {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    const msg = userErr?.message ?? "Nicht eingeloggt – bitte erneut anmelden.";
    console.error("[uploadContract] no auth user", userErr);
    toast.error("Upload nicht möglich", { description: msg });
    return { ok: false, error: msg };
  }
  const user = userData.user;

  // Path: {user_id}/{filename} as requested
  const safeName = params.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${user.id}/${safeName}`;

  console.log("[uploadContract] uploading", { path, area: params.area, size: params.file.size });

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

  const provider = params.provider?.trim() || guessProvider(params.file.name);

  const { data: profile } = await supabase
    .from("profiles").select("company_id").eq("id", user.id).maybeSingle();

  const { data: inserted, error: insErr } = await supabase
    .from("contracts")
    .insert({
      user_id: user.id,
      company_id: profile?.company_id ?? null,
      area: params.area,
      provider,
      file_url: path,
      status: "In Analyse",
    })
    .select("id")
    .single();

  if (insErr) {
    console.error("[uploadContract] insert error", insErr);
    toast.error("DB-Eintrag fehlgeschlagen", { description: insErr.message });
    return { ok: false, error: insErr.message };
  }

  console.log("[uploadContract] success", inserted);
  return { ok: true, contractId: inserted!.id as string };
}
