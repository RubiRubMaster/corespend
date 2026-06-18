import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Contract = {
  id: string;
  user_id: string;
  company_id: string | null;
  area: string;
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
    if (error) setError(error.message);
    else { setContracts((data ?? []) as Contract[]); setError(null); }
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

export async function uploadContract(params: {
  file: File;
  area: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return { ok: false, error: "Nicht eingeloggt" };
  const user = userData.user;

  const safeName = params.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${user.id}/${Date.now()}-${safeName}`;

  const { error: upErr } = await supabase.storage
    .from("corespend-documents")
    .upload(path, params.file, {
      contentType: params.file.type || "application/octet-stream",
      upsert: false,
    });
  if (upErr) return { ok: false, error: upErr.message };

  // Look up company_id (optional)
  const { data: profile } = await supabase
    .from("profiles").select("company_id").eq("id", user.id).maybeSingle();

  const { error: insErr } = await supabase.from("contracts").insert({
    user_id: user.id,
    company_id: profile?.company_id ?? null,
    area: params.area,
    file_url: params.file.name,
    status: "In Analyse",
  });
  if (insErr) return { ok: false, error: insErr.message };
  return { ok: true };
}
