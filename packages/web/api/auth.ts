"use server";

import { cache } from "react";
import { createClient } from "@/lib/supabase.server";

export const getUser = cache(async () => {
  const supabase = await createClient();
  return supabase.auth.getUser();
});
