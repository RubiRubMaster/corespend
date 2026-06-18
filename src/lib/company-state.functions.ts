import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const loadCompanyState = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: profile, error: pErr } = await supabase
      .from("profiles")
      .select("company_id, email, full_name, companies(name)")
      .eq("id", userId)
      .maybeSingle();
    if (pErr) throw new Error(pErr.message);
    if (!profile) throw new Error("Profile not found");

    const { data: row, error } = await supabase
      .from("company_state")
      .select("state, updated_at")
      .eq("company_id", profile.company_id)
      .maybeSingle();
    if (error) throw new Error(error.message);

    return {
      companyId: profile.company_id as string,
      companyName: (profile as any).companies?.name as string | null,
      email: profile.email,
      fullName: profile.full_name,
      state: (row?.state ?? {}) as Record<string, unknown>,
      updatedAt: row?.updated_at ?? null,
    };
  });

export const saveCompanyState = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ state: z.record(z.string(), z.unknown()) }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: profile, error: pErr } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", userId)
      .maybeSingle();
    if (pErr || !profile) throw new Error(pErr?.message ?? "No profile");

    const { error } = await supabase
      .from("company_state")
      .upsert({ company_id: profile.company_id, state: data.state, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
