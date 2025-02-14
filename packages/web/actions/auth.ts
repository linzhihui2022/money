"use server";

import { redirect } from "i18n/routing";
import { createClient } from "@/lib/supabase.server";
import { getLocale } from "next-intl/server";

export const logout = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const locale = await getLocale();
  redirect({ locale, href: "/auth/sign-in" });
};
