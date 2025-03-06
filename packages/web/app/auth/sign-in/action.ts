"use server";

import { createClient } from "@/lib/supabase.server";
import { Provider } from "@supabase/auth-js/src/lib/types";
import { redirect } from "next/navigation";
import { getOrigin, setNext } from "@/lib/auth";

export async function singIn(formData: FormData, next = "/admin") {
  const provider = (formData.get("provider") as Provider) || "Github";
  const supabase = await createClient();
  const origin = await getOrigin();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${origin}/auth/callback` },
  });
  if (error) {
    throw new Error(error.message);
  }
  if (data.url) {
    await setNext(next);
    redirect(data.url);
  }
}
