"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase.server";

export async function singIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/", "layout");
}
