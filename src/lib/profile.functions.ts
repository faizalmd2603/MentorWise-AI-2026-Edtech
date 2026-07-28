import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const ProfileSchema = z.object({
  full_name: z.string().max(120).nullable().optional(),
  phone: z.string().max(30).nullable().optional(),
  avatar_url: z.string().url().max(1024).nullable().optional().or(z.literal("")),
  institute: z.string().max(200).nullable().optional(),
  degree: z.string().max(120).nullable().optional(),
  year_of_study: z.string().max(30).nullable().optional(),
  designation: z.string().max(120).nullable().optional(),
  linkedin_url: z.string().url().max(500).nullable().optional().or(z.literal("")),
  account_type: z.enum(["student", "professional"]).optional(),
});

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => ProfileSchema.parse(raw))
  .handler(async ({ context, data }) => {
    const payload: Record<string, unknown> = { ...data, updated_at: new Date().toISOString() };
    // Normalise empty strings to null
    for (const k of Object.keys(payload)) {
      if (payload[k] === "") payload[k] = null;
    }
    const { data: row, error } = await context.supabase
      .from("profiles")
      .update(payload)
      .eq("id", context.userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });
