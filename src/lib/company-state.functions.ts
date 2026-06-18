import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type CompanySnapshot = Record<string, any>;

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

    const result: {
      companyId: string;
      companyName: string | null;
      email: string | null;
      fullName: string | null;
      state: CompanySnapshot;
      updatedAt: string | null;
    } = {
      companyId: profile.company_id as string,
      companyName: ((profile as any).companies?.name as string | null) ?? null,
      email: profile.email,
      fullName: profile.full_name,
      state: (row?.state ?? {}) as CompanySnapshot,
      updatedAt: row?.updated_at ?? null,
    };
    return result;
  });

export const saveCompanyState = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ state: z.record(z.string(), z.any()) }).parse(data))
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
      .upsert({ company_id: profile.company_id, state: data.state as any, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
