"use server";

import { createClient } from "@/lib/supabase.server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Provider } from "@supabase/auth-js/src/lib/types";

export async function singIn(formData: FormData) {
  const provider = (formData.get("provider") as Provider) || "Github";
  const supabase = await createClient();
  const _headers = await headers();
  const origin = _headers.get("x-origin");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${origin}/auth/callback` },
  });
  if (error) {
    throw new Error(error.message);
  }
  if (data.url) {
    redirect(data.url);
  }
}
