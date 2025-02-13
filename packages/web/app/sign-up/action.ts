"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase.server";

export async function signup({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
}
